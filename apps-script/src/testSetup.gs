/**
 * EcoLink AI — Test Setup
 *
 * Run this ONCE to populate sample data for testing.
 * Delete this file after testing is complete.
 */

/**
 * Populates the Entities, Linkages sheets with sample data for testing.
 * Run this function from the Apps Script editor: Run > populateTestData
 */
function populateTestData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // --- Sample Entities ---
  const entitiesSheet = ss.getSheetByName(SHEETS.ENTITIES);
  const sampleEntities = [
    ['ENT-001', 'Ahmad Rizal', 'Mentor', 'ahmad.rizal@gmail.com', 'FinTech, AI', 'Looking to mentor early-stage startups in payments', 'Active'],
    ['ENT-002', 'Sarah Chen', 'Company', 'sarah.chen@techstartup.com', 'HealthTech, AI', 'Need guidance on regulatory compliance and scaling', 'Active'],
    ['ENT-003', 'David Lim', 'Partner', 'david.lim@vcfund.com', 'DeepTech, SaaS', 'Seeking Series A investment opportunities', 'Active'],
    ['ENT-004', 'Priya Nair', 'Company', 'priya.nair@edtech.my', 'EdTech, Mobile', 'Need mentorship on product-market fit', 'Active'],
    ['ENT-005', 'James Wong', 'Mentor', 'james.wong@google.com', 'Cloud, DevOps', 'Available to mentor on cloud architecture', 'Active']
  ];
  sampleEntities.forEach(row => entitiesSheet.appendRow(row));

  // --- Sample Linkages ---
  const linkagesSheet = ss.getSheetByName(SHEETS.LINKAGES);
  const sampleLinkages = [
    ['LNK-001', 'ENT-001', 'ENT-002', 'Mentorship', '2026-04-01', '2026-04-15', 65],
    ['LNK-002', 'ENT-003', 'ENT-004', 'Investment', '2026-03-15', '2026-03-20', 30],
    ['LNK-003', 'ENT-005', 'ENT-002', 'Mentorship', '2026-05-01', '2026-05-10', 80]
  ];
  sampleLinkages.forEach(row => linkagesSheet.appendRow(row));

  Logger.log('Test data populated successfully!');
  Logger.log('Entities: ' + sampleEntities.length + ' rows');
  Logger.log('Linkages: ' + sampleLinkages.length + ' rows');
}

/**
 * Quick test: reads Entities sheet and logs the data.
 * Verifies that the script can connect to the spreadsheet.
 */
function testConnection() {
  const entities = getSheetData(SHEETS.ENTITIES);
  Logger.log('Connected! Found ' + entities.length + ' entities:');
  entities.forEach(e => Logger.log('  - ' + e.Name + ' (' + e.Role + ')'));

  const linkages = getSheetData(SHEETS.LINKAGES);
  Logger.log('Found ' + linkages.length + ' linkages:');
  linkages.forEach(l => Logger.log('  - ' + l.Linkage_ID + ': ' + l.Entity_A_ID + ' <-> ' + l.Entity_B_ID));
}

/**
 * Simulates the scanner finding interactions and writing them to the sheet.
 * Use this to test that logging works without needing real emails/meetings.
 */
function testLogInteraction() {
  // Simulate: a meeting was found between ENT-001 and ENT-002
  const fakeInteractions = [
    {
      type: 'Meeting',
      date: new Date(),
      summary: 'Calendar event: "Weekly Mentorship Check-in"'
    },
    {
      type: 'Email',
      date: new Date(),
      summary: 'Email thread: "Follow-up on product roadmap" (3 messages)'
    }
  ];

  const linkageId = 'LNK-001';

  fakeInteractions.forEach(interaction => {
    const interactionId = Utilities.getUuid();
    appendRow(SHEETS.INTERACTIONS, [
      interactionId,
      linkageId,
      interaction.type,
      interaction.date,
      interaction.summary
    ]);
    Logger.log('Logged: ' + interaction.type + ' - ' + interaction.summary);
  });

  // Update last interaction date
  updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkageId,
    'Last_Interaction_Date', new Date());

  // Recalculate health score
  const newScore = calculateHealthScore(linkageId);
  updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkageId,
    'Health_Score', newScore);

  Logger.log('Health score updated to: ' + newScore);
  Logger.log('Check the Interactions tab and Linkages tab in the Google Sheet!');
}

/**
 * Runs the real scanner. Use this to test Gmail + Calendar scanning.
 * Note: will only find results if the sample entities have real email activity.
 */
function testRealScan() {
  Logger.log('Starting real interaction scan...');
  scanInteractions();
  Logger.log('Done! Check the Interactions tab for any results.');
}
