const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * POST helper for Apps Script — handles CORS redirect properly.
 * Apps Script returns 302 on POST → browser fails CORS on redirect target.
 * Fix: use redirect:'follow' with no-cors fallback, then re-fetch as GET.
 */
async function postToAppsScript(payload) {
  // First try: standard POST (works when same-origin or CORS is allowed)
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    if (res.ok || res.type === 'opaque') {
      return res.json();
    }
  } catch {
    // CORS error — fall through to workaround
  }

  // Fallback: send via no-cors POST (triggers the action), then GET the result
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    mode: 'no-cors',
    redirect: 'follow',
  });

  // For actions that return data, we need to re-fetch via doGet
  // For fire-and-forget actions (sendConsent, etc.), we return success
  if (payload.action === 'aiMatch') {
    // Re-call as GET with encoded params
    const params = new URLSearchParams({
      action: 'aiMatchGet',
      entityId: payload.entityId,
      matchType: payload.matchType || 'Mentorship',
    });
    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error('AI match request failed');
    return res.json();
  }

  if (payload.action === 'getLearningStatus') {
    const res = await fetch(`${API_URL}?action=getLearningStatusGet`);
    if (!res.ok) throw new Error('Failed to fetch learning status');
    return res.json();
  }

  // For other actions, return generic success
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
  return postToAppsScript({ action: 'aiMatch', entityId, matchType });
}

/**
 * Sends consent emails to both parties.
 */
export async function sendConsent(companyId, mentorId, matchScore, matchReason, linkageType) {
  return postToAppsScript({ action: 'sendConsent', companyId, mentorId, matchScore, matchReason, linkageType });
}

/**
 * Records a consent response.
 */
export async function respondConsent(matchId, responder, decision, reason) {
  return postToAppsScript({ action: 'respondConsent', matchId, responder, decision, reason: reason || '' });
}

/**
 * Registers a new entity.
 */
export async function addEntity(entity) {
  return postToAppsScript({ action: 'addEntity', entity });
}

/**
 * Triggers nudge engine run.
 */
export async function triggerNudgeRun() {
  return postToAppsScript({ action: 'triggerNudgeRun' });
}

/**
 * Fetches AI learning status.
 */
export async function getLearningStatus() {
  return postToAppsScript({ action: 'getLearningStatus' });
}

/**
 * Helper: build entity lookup map from array.
 */
export function buildEntityMap(entities) {
  const map = {};
  entities.forEach(e => { map[e.Entity_ID] = e; });
  return map;
}
