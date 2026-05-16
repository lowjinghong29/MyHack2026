const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const MATCHER_URL = import.meta.env.VITE_GEMINI_MATCHER_URL;

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
  const res = await fetch(MATCHER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entityId, matchType }),
  });
  if (!res.ok) throw new Error('AI match request failed');
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
