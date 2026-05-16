const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Fetches all data (entities, linkages, interactions) from the Apps Script web app.
 */
export async function fetchAllData() {
  const res = await fetch(`${API_URL}?sheet=all`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

/**
 * Fetches a single sheet's data.
 * @param {'Entities'|'Linkages'|'Interactions'} sheet
 */
export async function fetchSheet(sheet) {
  const res = await fetch(`${API_URL}?sheet=${sheet}`);
  if (!res.ok) throw new Error(`Failed to fetch ${sheet}`);
  return res.json();
}

/**
 * Fetches a single linkage with its interactions.
 * @param {string} linkageId e.g. "LNK-001"
 */
export async function fetchLinkageDetail(linkageId) {
  const res = await fetch(`${API_URL}?sheet=Linkages&id=${encodeURIComponent(linkageId)}`);
  if (!res.ok) throw new Error('Failed to fetch linkage detail');
  return res.json();
}

/**
 * Calls the Gemini Matcher Cloud Function.
 * @param {string} entityId
 * @param {'Mentorship'|'Partnership'|'Investment'} matchType
 */
export async function requestAIMatch(entityId, matchType) {
  // Call Apps Script Gemini matcher (no separate Cloud Function needed)
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'aiMatch', entityId, matchType }),
  });
  if (!res.ok) throw new Error('AI match request failed');
  return res.json();
}

/**
 * Sends consent emails to both parties via the Apps Script doPost endpoint.
 * @param {string} companyId
 * @param {string} mentorId
 * @param {number} matchScore - 0 to 1
 * @param {string} matchReason
 * @param {string} linkageType
 */
export async function sendConsent(companyId, mentorId, matchScore, matchReason, linkageType) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'sendConsent',
      companyId,
      mentorId,
      matchScore,
      matchReason,
      linkageType,
    }),
  });
  if (!res.ok) throw new Error('Failed to send consent emails');
  return res.json();
}

/**
 * Helper: build entity lookup map from array.
 */
export function buildEntityMap(entities) {
  const map = {};
  entities.forEach(e => { map[e.Entity_ID] = e; });
  return map;
}
