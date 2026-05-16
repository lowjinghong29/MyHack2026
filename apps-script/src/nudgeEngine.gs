/**
 * EcoLink AI — Nudge Engine
 *
 * Implements PRD FR-16 (at-risk relationship flagging), FR-22
 * (session-overdue notification), and feeds FR-23 (dashboard at-risk flags).
 *
 * Reads its runtime config from Script Properties so the same code runs
 * in production (30-day threshold, real sends) and on stage during the
 * pitch (threshold 0, dry-run, or human-approval gate).
 */

/**
 * Reads runtime config from Script Properties with sane defaults.
 */
function getNudgeConfig() {
  const props = PropertiesService.getScriptProperties();
  const thresholdRaw = props.getProperty('DORMANT_THRESHOLD_DAYS');
  return {
    thresholdDays: thresholdRaw === null || thresholdRaw === '' ? 30 : Number(thresholdRaw),
    dryRun: props.getProperty('NUDGE_DRY_RUN') === 'true',
    requireApproval: props.getProperty('NUDGE_REQUIRE_APPROVAL') === 'true',
    geminiApiKey: props.getProperty('GEMINI_API_KEY') || '',
    chatWebhookUrl: props.getProperty('CHAT_WEBHOOK_URL') || ''
  };
}

/**
 * Main entry: scans all active linkages, writes Health_Status back to
 * each row, and dispatches (or queues) a nudge for any past the threshold.
 *
 * @param {{sendThresholdOverride?: number}} [opts] one-off overrides for demos.
 *   Only affects the send decision; Health_Status always uses the configured
 *   threshold so the dashboard shows a true mix of Healthy/At_Risk/Dormant.
 * @returns {{scanned:number, atRisk:number, dormant:number, queued:number, sent:number}}
 */
function runNudgeEngine(opts) {
  const config = getNudgeConfig();
  const healthThreshold = config.thresholdDays;
  const sendThreshold = (opts && typeof opts.sendThresholdOverride === 'number')
    ? opts.sendThresholdOverride
    : config.thresholdDays;

  const linkages = getSheetData(SHEETS.LINKAGES).filter(l => l.Status === 'Active');
  const entities = getSheetData(SHEETS.ENTITIES);
  const entityMap = {};
  entities.forEach(e => { entityMap[e.Entity_ID] = e; });

  const now = new Date();
  const stats = { scanned: 0, atRisk: 0, dormant: 0, queued: 0, sent: 0 };

  linkages.forEach(linkage => {
    stats.scanned++;

    const lastInteraction = new Date(linkage.Last_Interaction_Date);
    const daysSince = Math.floor((now - lastInteraction) / (1000 * 60 * 60 * 24));

    const healthStatus = computeHealthStatus(daysSince, healthThreshold);
    updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkage.Linkage_ID,
      'Health_Status', healthStatus);

    if (healthStatus === 'At_Risk') stats.atRisk++;
    if (healthStatus === 'Dormant') stats.dormant++;

    if (daysSince < sendThreshold) return;

    const entityA = entityMap[linkage.Entity_A_ID];
    const entityB = entityMap[linkage.Entity_B_ID];
    if (!entityA || !entityB) {
      logNudge(linkage.Linkage_ID, '(missing entity)', daysSince, false,
        'SKIPPED_MISSING_ENTITY', '');
      return;
    }

    const a = buildBestNudgeBody(entityA, entityB, linkage, daysSince, config);
    const b = buildBestNudgeBody(entityB, entityA, linkage, daysSince, config);

    if (config.requireApproval) {
      if (queueNudge(linkage, entityA, entityB, a.body, a.aiUsed, daysSince)) stats.queued++;
      if (queueNudge(linkage, entityB, entityA, b.body, b.aiUsed, daysSince)) stats.queued++;
    } else {
      if (dispatchNudge(linkage, entityA, a.body, a.aiUsed, daysSince, config)) stats.sent++;
      if (dispatchNudge(linkage, entityB, b.body, b.aiUsed, daysSince, config)) stats.sent++;
    }
  });

  postChatSummary(stats, config);
  Logger.log(`Nudge engine: scanned=${stats.scanned}, at_risk=${stats.atRisk}, ` +
    `dormant=${stats.dormant}, queued=${stats.queued}, sent=${stats.sent}`);
  return stats;
}

/**
 * Sheet-menu entry point: forces send threshold = 0 so the engine fires
 * every active linkage during a live pitch demo. Health_Status still uses
 * the configured threshold, so the dashboard shows a real Healthy/At_Risk/
 * Dormant mix instead of marking everything Dormant.
 */
function runNudgeEngineDemo() {
  return runNudgeEngine({ sendThresholdOverride: 0 });
}

/**
 * Maps days-since-interaction to a categorical health status for the
 * Linkages dashboard. Distinct from Health_Score (numeric, owned by
 * interactionTracker) — this one drives FR-16 at-risk flags.
 */
function computeHealthStatus(daysSince, threshold) {
  if (daysSince < threshold) return 'Healthy';
  if (daysSince < threshold * 2) return 'At_Risk';
  return 'Dormant';
}

/**
 * Sends a single nudge email and writes a log row. Honours dry-run.
 * Returns true if an email actually went out.
 */
function dispatchNudge(linkage, recipient, htmlBody, aiUsed, daysSince, config) {
  if (!isValidEmail(recipient.Email)) {
    logNudge(linkage.Linkage_ID, recipient.Email || '(missing)', daysSince, aiUsed,
      'SKIPPED_INVALID_EMAIL', '');
    return false;
  }
  const subject = `EcoLink: Time to reconnect — ${linkage.Linkage_Type}`;
  if (config.dryRun) {
    logNudge(linkage.Linkage_ID, recipient.Email, daysSince, aiUsed, 'DRY_RUN', '');
    return false;
  }
  try {
    MailApp.sendEmail({ to: recipient.Email, subject: subject, htmlBody: htmlBody });
    logNudge(linkage.Linkage_ID, recipient.Email, daysSince, aiUsed, 'SENT', '');
    return true;
  } catch (err) {
    logNudge(linkage.Linkage_ID, recipient.Email, daysSince, aiUsed, 'FAILED', String(err));
    return false;
  }
}

/**
 * Queues a nudge for human approval instead of sending immediately.
 * Implements the PRD "AI as copilot, not replacement" stance: the AI
 * drafts, the programme owner approves, the system sends.
 * Returns true if a row was successfully queued.
 */
function queueNudge(linkage, recipient, partner, htmlBody, aiUsed, daysSince) {
  if (!isValidEmail(recipient.Email)) {
    logNudge(linkage.Linkage_ID, recipient.Email || '(missing)', daysSince, aiUsed,
      'SKIPPED_INVALID_EMAIL', '');
    return false;
  }
  appendRow(SHEETS.PENDING_NUDGES, [
    generateUUID(),
    formatTimestamp(new Date()),
    linkage.Linkage_ID,
    recipient.Email,
    recipient.Name || '',
    partner.Name || '',
    daysSince,
    aiUsed,
    htmlBody,
    false,
    'PENDING',
    ''
  ]);
  return true;
}

/**
 * Reads Pending_Nudges and sends every row where Approved=TRUE and
 * Status is not yet SENT. Wired to the EcoLink sheet menu so a
 * programme owner reviews drafts on the sheet, ticks the boxes they
 * approve, then triggers send with one click.
 */
function sendApprovedNudges() {
  const pending = getSheetData(SHEETS.PENDING_NUDGES);
  let sent = 0;
  let skipped = 0;

  pending.forEach(row => {
    const approved = row.Approved === true || String(row.Approved).toUpperCase() === 'TRUE';
    if (!approved) return;
    if (row.Status === 'SENT' || row.Status === 'FAILED') return;
    if (!isValidEmail(row.Recipient_Email)) {
      updateCell(SHEETS.PENDING_NUDGES, 'Pending_ID', row.Pending_ID, 'Status', 'SKIPPED_INVALID');
      skipped++;
      return;
    }

    const aiUsed = row.AI_Used === true || String(row.AI_Used).toUpperCase() === 'TRUE';
    const subject = `EcoLink: Time to reconnect — ${row.Partner_Name || ''}`.trim();

    try {
      MailApp.sendEmail({
        to: row.Recipient_Email,
        subject: subject,
        htmlBody: row.Body
      });
      updateCell(SHEETS.PENDING_NUDGES, 'Pending_ID', row.Pending_ID, 'Status', 'SENT');
      logNudge(row.Linkage_ID, row.Recipient_Email, row.Days_Since, aiUsed,
        'SENT_APPROVED', '');
      sent++;
    } catch (err) {
      updateCell(SHEETS.PENDING_NUDGES, 'Pending_ID', row.Pending_ID, 'Status', 'FAILED');
      logNudge(row.Linkage_ID, row.Recipient_Email, row.Days_Since, aiUsed,
        'FAILED', String(err));
    }
  });

  Logger.log(`Approved nudges: sent=${sent}, skipped=${skipped}`);
  return { sent: sent, skipped: skipped };
}

/**
 * Appends one row to the Nudge_Log sheet — the auditable record of every
 * decision the engine made. Doubles as the seed dataset for the PRD's
 * Phase 3 outcome-learning loop.
 */
function logNudge(linkageId, recipientEmail, daysSince, aiUsed, status, error) {
  appendRow(SHEETS.NUDGE_LOG, [
    generateUUID(),
    formatTimestamp(new Date()),
    linkageId,
    recipientEmail,
    daysSince,
    aiUsed,
    status,
    error || ''
  ]);
}

/**
 * Posts a one-line run summary to Google Chat via the incoming webhook
 * URL stored in Script Properties. Silently no-ops if the URL is unset.
 */
function postChatSummary(stats, config) {
  if (!config.chatWebhookUrl) return;
  const ts = formatTimestamp(new Date());
  const text = `🔔 EcoLink — ${stats.scanned} linkages scanned, ` +
    `${stats.atRisk} at-risk, ${stats.dormant} dormant, ` +
    `${stats.queued} queued, ${stats.sent} sent at ${ts}`;
  try {
    UrlFetchApp.fetch(config.chatWebhookUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ text: text }),
      muteHttpExceptions: true
    });
  } catch (err) {
    Logger.log('Chat webhook post failed: ' + err.message);
  }
}

/**
 * Returns the best available nudge body: a personalised one from Gemini
 * if an API key is configured and the call succeeds, otherwise the
 * deterministic static template. Returns {body, aiUsed} so the log can
 * record which path was taken.
 */
function buildBestNudgeBody(recipient, partner, linkage, daysSince, config) {
  if (config.geminiApiKey) {
    const aiBody = tryBuildAINudgeBody(recipient, partner, linkage, daysSince, config);
    if (aiBody) return { body: aiBody, aiUsed: true };
  }
  return {
    body: buildNudgeBody(recipient.Name, partner.Name, linkage.Linkage_Type, daysSince),
    aiUsed: false
  };
}

/**
 * Calls Gemini to produce a personalised HTML email body for one
 * recipient. Returns the HTML string on success, null on any failure
 * (parse error, quota, timeout) so the caller falls back to the static
 * template. Prompt shape mirrors cloud-functions/gemini-matcher.
 */
function tryBuildAINudgeBody(recipient, partner, linkage, daysSince, config) {
  const prompt =
    `You are an ecosystem relationship coach writing a brief, warm re-engagement email.\n\n` +
    `RECIPIENT:\n` +
    `- Name: ${recipient.Name}\n` +
    `- Role: ${recipient.Role}\n` +
    `- Industry Tags: ${recipient.Industry_Tags || ''}\n` +
    `- Expertise/Needs: ${recipient.Expertise_Needs || ''}\n\n` +
    `PARTNER (their connection that has gone quiet):\n` +
    `- Name: ${partner.Name}\n` +
    `- Role: ${partner.Role}\n` +
    `- Industry Tags: ${partner.Industry_Tags || ''}\n` +
    `- Expertise/Needs: ${partner.Expertise_Needs || ''}\n\n` +
    `CONTEXT:\n` +
    `- Relationship type: ${linkage.Linkage_Type}\n` +
    `- Days since last interaction: ${daysSince}\n\n` +
    `Write the HTML body of a re-engagement email to the recipient. Requirements:\n` +
    `- Addressed to ${recipient.Name} by name, warm but professional\n` +
    `- 3 short sentences in the main paragraph\n` +
    `- Mention ${partner.Name} by name\n` +
    `- Suggest ONE concrete next step grounded in the partner's expertise/needs above\n` +
    `- Total under 120 words\n` +
    `- Return ONLY the HTML body wrapped in a single <div> with simple inline styles. ` +
    `No <html>/<head>/<body> tags, no markdown code fences.\n\n` +
    `Do not invent facts not in the data above. Do not include placeholders like [your name].`;

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    'gemini-2.0-flash:generateContent?key=' + encodeURIComponent(config.geminiApiKey);

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
      }),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    if (code >= 400) {
      Logger.log('Gemini HTTP ' + code + ': ' + response.getContentText().slice(0, 200));
      return null;
    }

    const json = JSON.parse(response.getContentText());
    const text = json.candidates &&
      json.candidates[0] &&
      json.candidates[0].content &&
      json.candidates[0].content.parts &&
      json.candidates[0].content.parts[0] &&
      json.candidates[0].content.parts[0].text;

    if (!text) {
      Logger.log('Gemini returned empty body');
      return null;
    }

    return stripCodeFences(text).trim();
  } catch (err) {
    Logger.log('Gemini call failed: ' + err.message);
    return null;
  }
}

/**
 * Removes ```html ... ``` (or ```...```) wrappers that Gemini sometimes
 * adds even when told not to.
 */
function stripCodeFences(text) {
  return text
    .replace(/^```(?:html)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '');
}

/**
 * Static fallback template — used when no AI body is available or when
 * the Gemini call fails. Deterministic safety net for the demo.
 */
function buildNudgeBody(recipientName, partnerName, linkageType, daysSince) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">Time to Reconnect</h2>
      <p>Hi ${recipientName},</p>
      <p>It's been <strong>${daysSince} days</strong> since your last interaction with
         <strong>${partnerName}</strong> in your <strong>${linkageType}</strong> relationship.</p>
      <p>Consistent engagement leads to stronger outcomes. Consider scheduling a quick
         check-in to keep the momentum going.</p>
      <div style="margin: 20px 0; padding: 15px; background: #f0f4ff; border-radius: 8px;">
        <strong>Quick actions:</strong>
        <ul>
          <li>Schedule a 15-minute catch-up call</li>
          <li>Share a relevant article or resource</li>
          <li>Send a brief progress update</li>
        </ul>
      </div>
      <p style="color: #666; font-size: 12px;">
        This is an automated reminder from EcoLink AI to help maintain healthy ecosystem relationships.
      </p>
    </div>
  `;
}
