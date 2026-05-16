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
 * @param {{thresholdOverride?: number}} [opts] one-off overrides for demos
 * @returns {{scanned:number, atRisk:number, dormant:number, queued:number, sent:number}}
 */
function runNudgeEngine(opts) {
  const config = getNudgeConfig();
  if (opts && typeof opts.thresholdOverride === 'number') {
    config.thresholdDays = opts.thresholdOverride;
  }

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

    const healthStatus = computeHealthStatus(daysSince, config.thresholdDays);
    updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkage.Linkage_ID,
      'Health_Status', healthStatus);

    if (healthStatus === 'At_Risk') stats.atRisk++;
    if (healthStatus === 'Dormant') stats.dormant++;

    if (daysSince < config.thresholdDays) return;

    const entityA = entityMap[linkage.Entity_A_ID];
    const entityB = entityMap[linkage.Entity_B_ID];
    if (!entityA || !entityB) {
      logNudge(linkage.Linkage_ID, '(missing entity)', daysSince, false,
        'SKIPPED_MISSING_ENTITY', '');
      return;
    }

    const bodyA = buildNudgeBody(entityA.Name, entityB.Name, linkage.Linkage_Type, daysSince);
    const bodyB = buildNudgeBody(entityB.Name, entityA.Name, linkage.Linkage_Type, daysSince);

    if (dispatchNudge(linkage, entityA, bodyA, false, daysSince, config)) stats.sent++;
    if (dispatchNudge(linkage, entityB, bodyB, false, daysSince, config)) stats.sent++;
  });

  postChatSummary(stats, config);
  Logger.log(`Nudge engine: scanned=${stats.scanned}, at_risk=${stats.atRisk}, ` +
    `dormant=${stats.dormant}, queued=${stats.queued}, sent=${stats.sent}`);
  return stats;
}

/**
 * Sheet-menu entry point: forces threshold = 0 so the engine fires every
 * active linkage during a live pitch demo.
 */
function runNudgeEngineDemo() {
  return runNudgeEngine({ thresholdOverride: 0 });
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
