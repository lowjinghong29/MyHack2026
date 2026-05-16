/**
 * EcoLink AI — Main entry point for Apps Script automation.
 *
 * Sets up time-driven triggers for interaction tracking and nudge engine.
 */

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const SHEETS = {
  ENTITIES: 'Entities',
  LINKAGES: 'Linkages',
  INTERACTIONS: 'Interactions',
  NUDGE_LOG: 'Nudge_Log',
  PENDING_NUDGES: 'Pending_Nudges'
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
    .addToUi();
}

/**
 * One-time setup: creates daily triggers for tracking and nudges.
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

  Logger.log('Triggers installed successfully.');
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
