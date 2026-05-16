const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Helper for Apps Script calls.
 * Uses GET with URL params to avoid CORS issues with POST redirects.
 * For fire-and-forget actions (sendConsent etc.), uses no-cors POST.
 */
async function callAppsScript(payload) {
  // Actions that need a response → use GET (no CORS issues)
  const getActions = ['aiMatch', 'getLearningStatus', 'getMilestoneProgress'];
  if (getActions.includes(payload.action)) {
    const actionMap = { aiMatch: 'aiMatchGet', getLearningStatus: 'getLearningStatusGet', getMilestoneProgress: 'getMilestoneProgressGet' };
    const params = new URLSearchParams({ action: actionMap[payload.action] || payload.action });
    Object.keys(payload).forEach(k => { if (k !== 'action') params.set(k, payload[k]); });
    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error(`${payload.action} failed`);
    return res.json();
  }

  // Fire-and-forget actions → use no-cors POST (can't read response but triggers the action)
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    mode: 'no-cors',
  });
  return { success: true, action: payload.action };
}

/**
 * Fetches all data from the Apps Script web app.
 */
export async function fetchAllData() {
  const res = await fetch(`${API_URL}?sheet=all`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

/**
 * Fetches a single sheet's data.
 */
export async function fetchSheet(sheet) {
  const res = await fetch(`${API_URL}?sheet=${sheet}`);
  if (!res.ok) throw new Error(`Failed to fetch ${sheet}`);
  return res.json();
}

/**
 * Fetches a single linkage with its interactions.
 */
export async function fetchLinkageDetail(linkageId) {
  const res = await fetch(`${API_URL}?sheet=Linkages&id=${encodeURIComponent(linkageId)}`);
  if (!res.ok) throw new Error('Failed to fetch linkage detail');
  return res.json();
}

/**
 * Calls the Gemini Matcher.
 */
export async function requestAIMatch(entityId, matchType) {
  return callAppsScript({ action: 'aiMatch', entityId, matchType });
}

/**
 * Sends consent emails to both parties.
 */
export async function sendConsent(companyId, mentorId, matchScore, matchReason, linkageType) {
  return callAppsScript({ action: 'sendConsent', companyId, mentorId, matchScore, matchReason, linkageType });
}

/**
 * Records a consent response.
 */
export async function respondConsent(matchId, responder, decision, reason) {
  return callAppsScript({ action: 'respondConsent', matchId, responder, decision, reason: reason || '' });
}

/**
 * Registers a new entity.
 */
export async function addEntity(entity) {
  return callAppsScript({ action: 'addEntity', entity });
}

/**
 * Triggers nudge engine run.
 */
export async function triggerNudgeRun() {
  return callAppsScript({ action: 'triggerNudgeRun' });
}

/**
 * Fetches AI learning status.
 */
export async function getLearningStatus() {
  return callAppsScript({ action: 'getLearningStatus' });
}

/**
 * Helper: build entity lookup map from array.
 */
export function buildEntityMap(entities) {
  const map = {};
  entities.forEach(e => { map[e.Entity_ID] = e; });
  return map;
}
