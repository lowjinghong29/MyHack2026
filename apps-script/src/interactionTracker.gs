/**
 * EcoLink AI — Interaction Tracker
 *
 * Passively scans Gmail and Google Calendar for interactions
 * between linked entities and logs them automatically.
 */

/**
 * Main entry: scans emails and calendar events for active linkages.
 */
function scanInteractions() {
  // Process all linkages (no Status column in current schema)
  const linkages = getSheetData(SHEETS.LINKAGES);
  const entities = getSheetData(SHEETS.ENTITIES);
  const entityMap = {};
  entities.forEach(e => entityMap[e.Entity_ID] = e);

  linkages.forEach(linkage => {
    const entityA = entityMap[linkage.Entity_A_ID];
    const entityB = entityMap[linkage.Entity_B_ID];

    if (!entityA || !entityB) return;

    const emailInteractions = scanEmails(entityA.Email, entityB.Email);
    const calendarInteractions = scanCalendar(entityA.Email, entityB.Email);

    const allInteractions = [...emailInteractions, ...calendarInteractions];

    allInteractions.forEach(interaction => {
      const interactionId = Utilities.getUuid();
      appendRow(SHEETS.INTERACTIONS, [
        interactionId,
        linkage.Linkage_ID,
        interaction.type,
        interaction.date,
        interaction.summary
      ]);
    });

    // Update last interaction date if we found anything
    if (allInteractions.length > 0) {
      const latestDate = allInteractions
        .map(i => new Date(i.date))
        .sort((a, b) => b - a)[0];

      updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkage.Linkage_ID,
        'Last_Interaction_Date', latestDate);

      // Recalculate health score
      const newScore = calculateHealthScore(linkage.Linkage_ID);
      updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkage.Linkage_ID,
        'Health_Score', newScore);
    }
  });

  Logger.log('Interaction scan complete.');
}

/**
 * Scans Gmail for threads between two email addresses in the last 24 hours.
 */
function scanEmails(emailA, emailB) {
  const interactions = [];
  const query = `(from:${emailA} to:${emailB}) OR (from:${emailB} to:${emailA}) newer_than:1d`;
  const threads = GmailApp.search(query, 0, 20);

  threads.forEach(thread => {
    const messages = thread.getMessages();
    const latest = messages[messages.length - 1];
    interactions.push({
      type: 'Email',
      date: latest.getDate(),
      summary: `Email thread: "${thread.getFirstMessageSubject()}" (${messages.length} messages)`
    });
  });

  return interactions;
}

/**
 * Scans Google Calendar for shared events between two email addresses in the last 24 hours.
 */
function scanCalendar(emailA, emailB) {
  const interactions = [];
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const events = CalendarApp.getDefaultCalendar().getEvents(yesterday, now);

  events.forEach(event => {
    const guests = event.getGuestList().map(g => g.getEmail().toLowerCase());
    const aPresent = guests.includes(emailA.toLowerCase());
    const bPresent = guests.includes(emailB.toLowerCase());

    if (aPresent && bPresent) {
      interactions.push({
        type: 'Meeting',
        date: event.getStartTime(),
        summary: `Calendar event: "${event.getTitle()}"`
      });
    }
  });

  return interactions;
}

/**
 * Calculates a health score (1-100) for a linkage based on interaction frequency and recency.
 */
function calculateHealthScore(linkageId) {
  const interactions = getSheetData(SHEETS.INTERACTIONS)
    .filter(i => i.Linkage_ID === linkageId);

  if (interactions.length === 0) return 10;

  const now = new Date();
  const dates = interactions.map(i => new Date(i.Date));
  const mostRecent = Math.max(...dates);
  const daysSinceLast = (now - mostRecent) / (1000 * 60 * 60 * 24);

  // Count interactions in last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentCount = dates.filter(d => d >= thirtyDaysAgo).length;

  // Score: recency (0-50) + frequency (0-50)
  const recencyScore = Math.max(0, 50 - (daysSinceLast * 1.5));
  const frequencyScore = Math.min(50, recentCount * 12.5);

  return Math.round(recencyScore + frequencyScore);
}
