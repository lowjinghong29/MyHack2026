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
  OUTCOMES: 'Outcomes'
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
    .addSeparator()
    .addItem('Record Outcome (demo)', 'recordOutcomeDemo')
    .addItem('Generate AI Analytics', 'generateAnalyticsSummary')
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

  Logger.log('Triggers installed: scan @6AM daily, nudge @9AM daily, sendApproved every 15 min.');
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
  var result = {};

  if (sheetParam === 'all') {
    result.entities = getSheetData(SHEETS.ENTITIES);
    result.linkages = getSheetData(SHEETS.LINKAGES);
    result.interactions = getSheetData(SHEETS.INTERACTIONS);
  } else if (sheetParam === 'Linkages' && idParam) {
    var linkages = getSheetData(SHEETS.LINKAGES);
    var match = linkages.filter(function(l) { return l.Linkage_ID === idParam; });
    result.linkage = match.length > 0 ? match[0] : null;
    result.interactions = getSheetData(SHEETS.INTERACTIONS).filter(function(i) {
      return i.Linkage_ID === idParam;
    });
  } else {
    var validSheets = ['Entities', 'Linkages', 'Interactions', 'Match_History', 'Milestones', 'Monthly_Reports', 'Outcomes'];
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

    if (body.action === 'sendConsent') {
      result = sendConsentEmails(
        body.companyId, body.mentorId,
        body.matchScore, body.matchReason, body.linkageType || 'Mentorship'
      );
    } else if (body.action === 'respondConsent') {
      result = processConsentResponse(
        body.matchId, body.responder, body.decision, body.reason || ''
      );
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
