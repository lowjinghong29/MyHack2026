/**
 * EcoLink AI — Gemini-Powered Recommendation Engine (standalone)
 *
 * Required Script Property:
 *   GEMINI_API_KEY  — Google AI Studio key
 *
 * Required sheets:
 *   Entities                    (must contain Entity_ID column)
 *   Pending_Linkage_Approvals   columns in this order:
 *     Approval_ID | Source_Entity_ID | Recommended_Entity_ID |
 *     Match_Score | Match_Reason | Status | Created_At | AI_Generated
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const TOP_K = 3;

const SHEETS = {
  ENTITIES: "Entities",
  PENDING_APPROVALS: "Pending_Linkage_Approvals"
};


/* =========================================================================
 * WEB APP ENTRY POINTS
 * ========================================================================= */

function doPost(e) {
  try {
    Logger.log("POST RECEIVED");

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Empty request body");
    }

    const payload = JSON.parse(e.postData.contents);
    Logger.log(payload);

    const entityId = String(payload.entity_id || payload.Entity_ID || "").trim();
    if (!entityId) throw new Error("Missing entity_id");

    const recommendations = generateMatches(entityId);

    return jsonResponse({
      ok: true,
      source_entity_id: entityId,
      recommendation_count: recommendations.length,
      recommendations: recommendations
    });
  } catch (err) {
    Logger.log(err);
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "EcoLink AI Recommendation Engine" });
}


/* =========================================================================
 * CORE MATCHING
 * ========================================================================= */

function generateMatches(entityId) {
  const entities = getSheetData(SHEETS.ENTITIES);

  const sourceEntity = entities.find(
    en => String(en.Entity_ID).trim() === entityId
  );
  if (!sourceEntity) throw new Error(`Entity not found: ${entityId}`);

  const candidates = entities.filter(
    en => String(en.Entity_ID).trim() !== entityId
  );
  if (candidates.length === 0) return [];

  const prompt = buildPrompt(sourceEntity, candidates);
  const raw = callGemini(prompt);
  const validated = validate(raw, candidates);

  const createdAt = new Date();
  validated.forEach(rec => {
    appendRow(SHEETS.PENDING_APPROVALS, [
      Utilities.getUuid(),
      entityId,
      rec.Entity_ID,
      rec.Match_Score,
      rec.Match_Reason,
      "Pending",
      createdAt,
      true
    ]);
  });

  return validated;
}

function buildPrompt(sourceEntity, candidates) {
  const slim = candidates.map(c => ({
    Entity_ID: c.Entity_ID,
    Name: c.Name,
    Role: c.Role,
    Industry_Tags: c.Industry_Tags,
    Expertise_Needs: c.Expertise_Needs
  }));

  return [
    "You are an ecosystem relationship matchmaking engine for EcoLink AI.",
    "A new entity just joined. Find the most relevant existing entities to connect them with.",
    "",
    "Prioritize:",
    "- complementary expertise (fills a gap in Expertise_Needs)",
    "- industry compatibility (Industry_Tags overlap)",
    "- collaboration / mentorship potential based on Role",
    "",
    "NEW ENTITY:",
    JSON.stringify({
      Entity_ID: sourceEntity.Entity_ID,
      Name: sourceEntity.Name,
      Role: sourceEntity.Role,
      Industry_Tags: sourceEntity.Industry_Tags,
      Expertise_Needs: sourceEntity.Expertise_Needs
    }, null, 2),
    "",
    "CANDIDATES:",
    JSON.stringify(slim, null, 2),
    "",
    `Return ONLY a JSON array with at most ${TOP_K} items, ordered by Match_Score desc:`,
    "[",
    '  { "Entity_ID": "<id>", "Match_Score": <0-100 integer>, "Match_Reason": "<one-sentence why>" }',
    "]"
  ].join("\n");
}


/* =========================================================================
 * GEMINI CALL
 * ========================================================================= */

function callGemini(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY script property");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    payload: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  const code = response.getResponseCode();
  const raw = response.getContentText();
  Logger.log(`Gemini HTTP ${code}: ${raw}`);

  if (code < 200 || code >= 300) {
    throw new Error(`Gemini API ${code}: ${raw}`);
  }

  const parsed = JSON.parse(raw);
  const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no text: " + raw);

  return parseJsonArray(text);
}

function parseJsonArray(text) {
  const cleaned = text.trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const direct = JSON.parse(cleaned);
    if (Array.isArray(direct)) return direct;
  } catch (_) { /* fall through */ }

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not find JSON array in Gemini response: " + cleaned);
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function validate(recs, candidates) {
  const validIds = new Set(candidates.map(c => String(c.Entity_ID).trim()));
  return recs
    .filter(r => r && validIds.has(String(r.Entity_ID).trim()))
    .map(r => ({
      Entity_ID: String(r.Entity_ID).trim(),
      Match_Score: clampScore(r.Match_Score),
      Match_Reason: String(r.Match_Reason || "").slice(0, 500)
    }))
    .sort((a, b) => b.Match_Score - a.Match_Score)
    .slice(0, TOP_K);
}

function clampScore(score) {
  const n = Number(score);
  if (!isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}


/* =========================================================================
 * SHEET HELPERS
 * ========================================================================= */

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(h => String(h).trim());
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function appendRow(sheetName, rowData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);
  sheet.appendRow(rowData);
}


/* =========================================================================
 * HTTP RESPONSE
 * ========================================================================= */

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/* =========================================================================
 * LOCAL TEST — run from the Apps Script editor
 * ========================================================================= */

function testGenerateMatches() {
  const entities = getSheetData(SHEETS.ENTITIES);
  if (entities.length === 0) throw new Error("Entities sheet is empty");
  const result = generateMatches(String(entities[0].Entity_ID).trim());
  Logger.log(JSON.stringify(result, null, 2));
}
