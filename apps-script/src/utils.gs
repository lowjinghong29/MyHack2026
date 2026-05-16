/**
 * EcoLink AI — Utility functions
 */

/**
 * Generates a UUID v4 string.
 */
function generateUUID() {
  return Utilities.getUuid();
}

/**
 * Formats a date to YYYY-MM-DD string.
 */
function formatDate(date) {
  return Utilities.formatDate(date, 'Asia/Kuala_Lumpur', 'yyyy-MM-dd');
}

/**
 * Formats a date to full timestamp string.
 */
function formatTimestamp(date) {
  return Utilities.formatDate(date, 'Asia/Kuala_Lumpur', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Parses comma-separated tags into an array.
 */
function parseTags(tagString) {
  if (!tagString) return [];
  return tagString.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
}

/**
 * Calculates the overlap between two tag arrays.
 * Returns a similarity score between 0 and 1.
 */
function tagSimilarity(tagsA, tagsB) {
  if (tagsA.length === 0 || tagsB.length === 0) return 0;

  const setA = new Set(tagsA);
  const setB = new Set(tagsB);
  const intersection = [...setA].filter(t => setB.has(t));
  const union = new Set([...setA, ...setB]);

  return intersection.length / union.size;
}

/**
 * Validates an email address format.
 */
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Returns today's date as YYYY-MM-DD in MYT timezone.
 */
function todayMYT() {
  return formatDate(new Date());
}
