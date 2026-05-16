/**
 * EcoLink AI — Gemini Matcher (Apps Script)
 *
 * AI-powered entity matching using Gemini 2.0-flash.
 * Replaces the Cloud Function — runs directly in Apps Script.
 * API key stored in Script Properties as GEMINI_API_KEY.
 */

/**
 * Finds the top 3 AI-recommended matches for an entity.
 *
 * @param {string} entityId - the requesting entity
 * @param {string} matchType - Mentorship, Partnership, or Investment
 * @returns {{ matches: Array<{entityId, name, score, reason}> }}
 */
function findMatches(entityId, matchType) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) return { error: 'GEMINI_API_KEY not set in Script Properties' };

  var entities = getSheetData(SHEETS.ENTITIES);
  var entityMap = {};
  entities.forEach(function(e) { entityMap[e.Entity_ID] = e; });

  var requesting = entityMap[entityId];
  if (!requesting) return { error: 'Entity not found: ' + entityId };

  // Filter candidates: exclude self, only Active
  var candidates = entities.filter(function(e) {
    return e.Entity_ID !== entityId && (e.Status || '').toLowerCase() === 'active';
  });

  if (candidates.length === 0) return { matches: [] };

  // Build prompt — use enhanced version if outcomes exist
  var prompt = '';
  try {
    prompt = buildEnhancedMatchPrompt(requesting, candidates, matchType);
  } catch (e) {
    prompt = buildBasicMatchPrompt(requesting, candidates, matchType);
  }

  // Call Gemini
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey);

  try {
    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
      }),
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    if (code >= 400) {
      Logger.log('Gemini HTTP ' + code + ': ' + response.getContentText().substring(0, 200));
      return { error: 'Gemini API error (HTTP ' + code + ')', matches: [] };
    }

    var json = JSON.parse(response.getContentText());
    var text = json.candidates
      && json.candidates[0]
      && json.candidates[0].content
      && json.candidates[0].content.parts
      && json.candidates[0].content.parts[0]
      && json.candidates[0].content.parts[0].text;

    if (!text) return { error: 'Empty Gemini response', matches: [] };

    // Strip code fences and parse JSON
    var clean = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    var jsonMatch = clean.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { error: 'Could not parse Gemini response', matches: [] };

    var matches = JSON.parse(jsonMatch[0]);
    Logger.log('AI Match: ' + matches.length + ' results for ' + entityId + ' (' + matchType + ')');
    return { matches: matches };

  } catch (err) {
    Logger.log('Gemini matcher error: ' + err.message);
    return { error: err.message, matches: [] };
  }
}

/**
 * Basic matching prompt (no historical context).
 */
function buildBasicMatchPrompt(requesting, candidates, matchType) {
  return 'You are an ecosystem relationship matching engine for ' + matchType + ' relationships.\n\n'
    + 'REQUESTING ENTITY:\n'
    + '- Name: ' + requesting.Name + '\n'
    + '- Role: ' + requesting.Role + '\n'
    + '- Industry: ' + (requesting.Industry_Tags || '') + '\n'
    + '- Needs: ' + (requesting.Expertise_Needs || '') + '\n\n'
    + 'AVAILABLE CANDIDATES:\n'
    + JSON.stringify(candidates.map(function(c) {
        return { Entity_ID: c.Entity_ID, Name: c.Name, Role: c.Role,
                 Industry_Tags: c.Industry_Tags, Expertise_Needs: c.Expertise_Needs };
      }), null, 2)
    + '\n\nReturn EXACTLY a JSON array of the top 3 best matches. Each match must have:\n'
    + '- "entityId": the Entity_ID\n'
    + '- "name": the candidate name\n'
    + '- "score": confidence score 0-1\n'
    + '- "reason": 1-2 sentence explanation\n\n'
    + 'Consider: industry alignment, complementary expertise, role compatibility.\n'
    + 'Return ONLY the JSON array.';
}
