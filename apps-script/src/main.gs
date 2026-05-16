/**
 * EcoLink AI — Main entry point for Apps Script automation.
 *
 * Sets up time-driven triggers for interaction tracking and nudge engine.
 */

const SPREADSHEET_ID = '1wc5ecKu_Wfq7Y0Lvztpcbzanbx87N_8VIx5ZU6LfQsg';
const SHEETS = {
  ENTITIES: 'Entities',
  LINKAGES: 'Linkages',
  INTERACTIONS: 'Interactions',
  NUDGE_LOG: 'Nudge_Log',
  PENDING_NUDGES: 'Pending_Nudges',
  MATCH_HISTORY: 'Match_History',
  MILESTONES: 'Milestones',
  MONTHLY_REPORTS: 'Monthly_Reports',
  OUTCOMES: 'Outcomes',
  AI_LOG: 'AI_Improvement_Log'
};

/**
 * Adds an "EcoLink" menu to the spreadsheet so a judge can run the demo
 * with a single click. Bound automatically when the sheet opens.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('EcoLink')
    .addItem('Run Nudge Engine (live)', 'runNudgeEngine')
    .addItem('Run Nudge Demo (threshold = 0)', 'runNudgeEngineDemo')
    .addSeparator()
    .addItem('Send Approved Nudges', 'sendApprovedNudges')
    .addSeparator()
    .addItem('Setup Match_History sheet', 'setupMatchHistorySheet')
    .addItem('Setup All Programme Sheets', 'setupAllProgrammeSheets')
    .addItem('Setup AI Improvement Log', 'setupAILogSheet')
    .addSeparator()
    .addItem('Populate Demo Match + Reports', 'populateDemoMatchAndReports')
    .addItem('Record Outcome (demo)', 'recordOutcomeDemo')
    .addItem('Run AI Pattern Analysis', 'analyseAndLogPatterns')
    .addItem('Generate Analytics Summary', 'generateAnalyticsSummary')
    .addToUi();
}

/**
 * Schedules a one-off test trigger that fires runNudgeEngine 1 minute
 * from now. Lets you prove the automation path works without waiting
 * until 9 AM. Does NOT touch the daily trigger; one-off triggers
 * self-delete after firing.
 */
function testTriggerInOneMinute() {
  const fireAt = new Date(Date.now() + 60 * 1000);
  ScriptApp.newTrigger('runNudgeEngine')
    .timeBased()
    .at(fireAt)
    .create();
  Logger.log('Test trigger scheduled. runNudgeEngine will fire at ' + fireAt);
}

/**
 * One-time setup: creates the production triggers.
 *
 *   06:00 MYT daily        - scanInteractions     (B/jh: log new emails + meetings)
 *   09:00 MYT daily        - runNudgeEngine       (C/dan: queue AI-drafted nudges)
 *   every 15 min, always   - sendApprovedNudges   (C/dan: dispatch ticked nudges)
 *
 * The 15-minute sender is what makes the approval flow hands-free: the
 * programme owner just ticks Approved checkboxes in Pending_Nudges and
 * walks away; the cron picks them up within 15 minutes. Ticking IS the
 * approval gesture — no further clicks needed.
 */
function installTriggers() {
  // Remove existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Daily interaction scan at 6 AM MYT
  ScriptApp.newTrigger('scanInteractions')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();

  // Daily nudge check at 9 AM MYT
  ScriptApp.newTrigger('runNudgeEngine')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  // Dispatch any approved-but-unsent nudges every 15 minutes
  ScriptApp.newTrigger('sendApprovedNudges')
    .timeBased()
    .everyMinutes(15)
    .create();

  // Daily milestone overdue check at 7 AM MYT
  ScriptApp.newTrigger('checkOverdueMilestones')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  Logger.log('Triggers installed: scan @6AM, overdue @7AM, nudge @9AM, sendApproved every 15 min.');
}

/**
 * Returns the active spreadsheet handle.
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Returns all rows from a given sheet as an array of objects.
 */
function getSheetData(sheetName) {
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

/**
 * Appends a row to the specified sheet.
 */
function appendRow(sheetName, rowData) {
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  sheet.appendRow(rowData);
}

/**
 * Adds a new Entity row from registration form data. Generates a
 * sequential Entity_ID based on Role prefix (M=Mentor, C=Company, P=Partner).
 * Returns { entityId } on success or { error } on validation failure.
 *
 * @param {object} entity - { name, role, email, industryTags, expertiseNeeds }
 */
function addEntity(entity) {
  if (!entity || !entity.name || !entity.email || !entity.role) {
    return { error: 'Missing required fields: name, role, email' };
  }
  if (!isValidEmail(entity.email)) {
    return { error: 'Invalid email format' };
  }
  var validRoles = ['Mentor', 'Company', 'Partner'];
  if (validRoles.indexOf(entity.role) === -1) {
    return { error: 'Role must be Mentor, Company, or Partner' };
  }

  var prefix = entity.role.charAt(0).toUpperCase();
  var existing = getSheetData(SHEETS.ENTITIES)
    .filter(function(e) { return String(e.Entity_ID || '').indexOf('ENT-' + prefix) === 0; });
  var nextNum = (existing.length + 1).toString().padStart(3, '0');
  var entityId = 'ENT-' + prefix + nextNum;

  appendRow(SHEETS.ENTITIES, [
    entityId,
    entity.name,
    entity.role,
    entity.email,
    entity.industryTags || '',
    entity.expertiseNeeds || '',
    'Active'
  ]);

  return { entityId: entityId, name: entity.name, role: entity.role };
}

/**
 * Updates a specific cell in a sheet by matching a key column.
 */
function updateCell(sheetName, keyColumn, keyValue, targetColumn, newValue) {
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIdx = headers.indexOf(keyColumn);
  const targetIdx = headers.indexOf(targetColumn);

  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIdx] === keyValue) {
      sheet.getRange(i + 1, targetIdx + 1).setValue(newValue);
      return true;
    }
  }
  return false;
}

/**
 * Web App endpoint — serves sheet data as JSON.
 * Deploy as: Execute as "Me", Access "Anyone".
 *
 * Query params:
 *   ?sheet=Entities | Linkages | Interactions
 *   ?sheet=all  (returns all three)
 *   ?sheet=Linkages&id=LNK-001  (single linkage with its interactions)
 */
function doGet(e) {
  var sheetParam = (e && e.parameter && e.parameter.sheet) || 'all';
  var idParam = e && e.parameter && e.parameter.id;
  var actionParam = e && e.parameter && e.parameter.action;
  var result = {};

  // Handle consent response via URL: ?action=consent&matchId=X&responder=company&decision=ACCEPTED
  if (actionParam === 'consent') {
    var consentResult = processConsentResponse(
      e.parameter.matchId, e.parameter.responder,
      e.parameter.decision, e.parameter.reason || ''
    );
    var statusMsg = consentResult.status === 'APPROVED'
      ? 'Match approved! Both parties have been notified. Linkage ' + consentResult.linkageId + ' created.'
      : consentResult.status === 'DECLINED'
      ? 'Your response has been recorded. We will find the next best match.'
      : consentResult.status === 'WAITING_FOR_OTHER_PARTY'
      ? 'Thank you! Waiting for the other party to respond.'
      : consentResult.status === 'NEEDS_ADMIN_REVIEW'
      ? 'Match flagged for admin review due to: ' + (consentResult.conflicts || []).join(', ')
      : 'Response recorded.';
    return ContentService.createTextOutput(
      '<html><body style="font-family:Arial;max-width:500px;margin:40px auto;text-align:center;">'
      + '<h2 style="color:#10b981;">EcoLink AI</h2>'
      + '<p style="font-size:18px;">' + statusMsg + '</p>'
      + '<p style="color:#666;font-size:14px;">You may close this page.</p>'
      + '</body></html>'
    ).setMimeType(ContentService.MimeType.HTML);
  }

  if (sheetParam === 'all') {
    result.entities = getSheetData(SHEETS.ENTITIES);
    result.linkages = getSheetData(SHEETS.LINKAGES);
    result.interactions = getSheetData(SHEETS.INTERACTIONS);
    try { result.milestones = getSheetData(SHEETS.MILESTONES); } catch(e) { result.milestones = []; }
    try { result.outcomes = getSheetData(SHEETS.OUTCOMES); } catch(e) { result.outcomes = []; }
    try { result.match_history = getSheetData(SHEETS.MATCH_HISTORY); } catch(e) { result.match_history = []; }
    try { result.monthly_reports = getSheetData(SHEETS.MONTHLY_REPORTS); } catch(e) { result.monthly_reports = []; }
    try { result.ai_log = getSheetData(SHEETS.AI_LOG); } catch(e) { result.ai_log = []; }
  } else if (sheetParam === 'Linkages' && idParam) {
    var linkages = getSheetData(SHEETS.LINKAGES);
    var match = linkages.filter(function(l) { return l.Linkage_ID === idParam; });
    result.linkage = match.length > 0 ? match[0] : null;
    result.interactions = getSheetData(SHEETS.INTERACTIONS).filter(function(i) {
      return i.Linkage_ID === idParam;
    });
  } else {
    var validSheets = ['Entities', 'Linkages', 'Interactions', 'Match_History', 'Milestones', 'Monthly_Reports', 'Outcomes', 'AI_Improvement_Log'];
    if (validSheets.indexOf(sheetParam) === -1) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid sheet' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    result[sheetParam.toLowerCase()] = getSheetData(sheetParam);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Web App POST endpoint — handles actions from the frontend.
 *
 * Actions:
 *   { action: "sendConsent", companyId, mentorId, matchScore, matchReason, linkageType }
 *   { action: "respondConsent", matchId, responder, decision, reason }
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var result = {};

    if (body.action === 'registerEntity') {
      var entId = 'ENT-' + Utilities.getUuid().substring(0, 6).toUpperCase();
      appendRow(SHEETS.ENTITIES, [
        entId, body.name || '', body.role || 'Company', body.email || '',
        body.industryTags || '', body.expertiseNeeds || '', 'Active'
      ]);
      result = { entityId: entId, name: body.name, role: body.role };
    } else if (body.action === 'aiMatch') {
      result = findMatches(body.entityId, body.matchType || 'Mentorship');
    } else if (body.action === 'sendConsent') {
      result = sendConsentEmails(
        body.companyId, body.mentorId,
        body.matchScore, body.matchReason, body.linkageType || 'Mentorship'
      );
    } else if (body.action === 'respondConsent') {
      result = processConsentResponse(
        body.matchId, body.responder, body.decision, body.reason || ''
      );
    } else if (body.action === 'updateMilestone') {
      updateMilestone(body.milestoneId, body.status, body.progress, body.evidenceLink || '');
      result = { success: true, milestoneId: body.milestoneId };
    } else if (body.action === 'recordOutcome') {
      result = recordOutcome(
        body.linkageId, body.outcomeStatus, body.fundingRaised || '',
        body.growthMetric || '', body.mentorRating || '', body.companyRating || '',
        body.lessonsLearned || ''
      );
    } else if (body.action === 'submitReport') {
      result = submitMonthlyReport(
        body.linkageId, body.month, body.revenue, body.teamSize, body.customers,
        body.budgetSpent, body.burnRate, body.remainingBudget,
        body.topWin || '', body.biggestChallenge || ''
      );
    } else if (body.action === 'getAnalytics') {
      result = { summary: generateAnalyticsSummary() };
    } else if (body.action === 'getMilestoneProgress') {
      result = getMilestoneProgress(body.linkageId);
    } else if (body.action === 'addEntity') {
      result = addEntity(body.entity || {});
    } else if (body.action === 'triggerNudgeRun') {
      result = runNudgeEngineDemo();
    } else {
      result = { error: 'Unknown action: ' + body.action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
