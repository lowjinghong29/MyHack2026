const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

/**
 * Cloud Function entry point.
 * Receives a match request and returns AI-recommended entity pairings.
 *
 * Request body:
 *   { "entityId": "...", "matchType": "Mentorship" | "Partnership" | "Investment" }
 *
 * Response:
 *   { "matches": [{ "entityId": "...", "name": "...", "score": 0.95, "reason": "..." }] }
 */
exports.geminiMatcher = async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).send('');
  }

  try {
    const { entityId, matchType } = req.body;

    if (!entityId || !matchType) {
      return res.status(400).json({ error: 'Missing entityId or matchType' });
    }

    // Fetch entity data from Google Sheets
    const entities = await getEntities();
    const requestingEntity = entities.find(e => e.Entity_ID === entityId);

    if (!requestingEntity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Filter candidates (exclude self, only active entities)
    const candidates = entities.filter(e =>
      e.Entity_ID !== entityId && e.Status === 'Active'
    );

    // Get AI-powered matches
    const matches = await getGeminiMatches(requestingEntity, candidates, matchType);

    return res.status(200).json({ matches });
  } catch (error) {
    console.error('Match error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Fetches all entities from Google Sheets using the Sheets API.
 */
async function getEntities() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Entities!A:G'
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || '');
    return obj;
  });
}

/**
 * Uses Gemini to find the best matches for an entity.
 */
async function getGeminiMatches(requestingEntity, candidates, matchType) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an ecosystem relationship matching engine. Your job is to find the best matches for forming a ${matchType} relationship.

REQUESTING ENTITY:
- Name: ${requestingEntity.Name}
- Role: ${requestingEntity.Role}
- Industry Tags: ${requestingEntity.Industry_Tags}
- Expertise/Needs: ${requestingEntity.Expertise_Needs}

AVAILABLE CANDIDATES:
${JSON.stringify(candidates.map(c => ({
  Entity_ID: c.Entity_ID,
  Name: c.Name,
  Role: c.Role,
  Industry_Tags: c.Industry_Tags,
  Expertise_Needs: c.Expertise_Needs
})), null, 2)}

Return EXACTLY a JSON array of the top 3 best matches. Each match must have:
- "entityId": the Entity_ID of the candidate
- "name": the candidate's name
- "score": a confidence score between 0 and 1
- "reason": a brief explanation (1-2 sentences) of why this is a good match

Consider:
1. Industry and domain alignment
2. Complementary expertise (one has what the other needs)
3. Role compatibility for the requested ${matchType} relationship type

Return ONLY the JSON array, no other text.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Parse the JSON from Gemini's response
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Gemini response');
  }

  return JSON.parse(jsonMatch[0]);
}
