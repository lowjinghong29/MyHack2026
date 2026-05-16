/**
 * EcoLink AI — Data Setup
 *
 * Populates Google Sheets with realistic Malaysian ecosystem data.
 * Run populateRealisticData() ONCE from the Apps Script editor.
 */

/**
 * Clears existing data (keeps headers) and populates all three sheets
 * with realistic Malaysian innovation ecosystem data.
 */
function populateRealisticData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Clear existing data (keep row 1 headers)
  ['Entities', 'Linkages', 'Interactions'].forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
  });

  populateEntities(ss);
  populateLinkages(ss);
  populateInteractions(ss);

  Logger.log('=== Population complete ===');
  // Read back and log summary
  ['Entities', 'Linkages', 'Interactions'].forEach(name => {
    const rows = ss.getSheetByName(name).getLastRow() - 1;
    Logger.log(name + ': ' + rows + ' rows');
  });
}

function populateEntities(ss) {
  const sheet = ss.getSheetByName('Entities');
  const data = [
    // === MENTORS (10) ===
    ['ENT-M01', 'Dr. Amirul Hakim', 'Mentor', 'amirul.hakim@utm.my', 'AI, Machine Learning', 'Deep learning research, NLP for Bahasa Melayu, AI ethics advisory', 'Active'],
    ['ENT-M02', 'Tan Wei Lin', 'Mentor', 'weilin.tan@grab.com', 'FinTech, Payments', 'Digital payments infrastructure, regulatory sandbox navigation, Series A readiness', 'Active'],
    ['ENT-M03', 'Rajesh Krishnan', 'Mentor', 'rajesh.k@deloitte.com', 'Consulting, Strategy', 'Go-to-market strategy for B2B SaaS, enterprise sales playbooks', 'Active'],
    ['ENT-M04', 'Nur Aisyah Mohd Zain', 'Mentor', 'aisyah.zain@khazanah.com.my', 'Impact Investing, ESG', 'SDG-aligned business models, impact measurement frameworks', 'Active'],
    ['ENT-M05', 'Dr. Lim Chee Kian', 'Mentor', 'cheekian@usm.my', 'HealthTech, BioTech', 'Medical device regulation (MDA), clinical trial design, ASEAN market entry', 'Active'],
    ['ENT-M06', 'Farah Diyana', 'Mentor', 'farah.d@petronas.com', 'CleanTech, Energy', 'Carbon credit markets, renewable energy policy, corporate sustainability', 'Active'],
    ['ENT-M07', 'Wong Kah Yee', 'Mentor', 'kahyee.wong@aws.com', 'Cloud, DevOps', 'Cloud architecture at scale, MLOps pipelines, cost optimization on GCP/AWS', 'Active'],
    ['ENT-M08', 'Siti Mariam Abdullah', 'Mentor', 'mariam.abdullah@mdec.com.my', 'Digital Economy, Policy', 'Government grants navigation, MSC status application, public sector partnerships', 'Active'],
    ['ENT-M09', 'Vikram Singh', 'Mentor', 'vikram.s@accenture.com', 'Enterprise Tech, ERP', 'SAP implementation, digital transformation for manufacturing SMEs', 'Dormant'],
    ['ENT-M10', 'Chen Jia Xin', 'Mentor', 'jiaxin.chen@tngdigital.com.my', 'FinTech, Mobile', 'Super-app ecosystems, e-wallet integration, QR payment infrastructure', 'Active'],

    // === COMPANIES / STARTUPS (15) ===
    ['ENT-C01', 'PayFlex Sdn Bhd', 'Company', 'founder@payflex.my', 'FinTech, Payments', 'Building BNPL solution for Malaysian SMEs, seed stage, need FinTech mentorship', 'Active'],
    ['ENT-C02', 'MedikAI Sdn Bhd', 'Company', 'ceo@medikai.com.my', 'HealthTech, AI', 'AI-powered diagnostic imaging for rural clinics, pre-Series A, need regulatory guidance', 'Active'],
    ['ENT-C03', 'AgriSense Tech', 'Company', 'ops@agrisense.my', 'AgriTech, IoT', 'Precision farming IoT sensors for palm oil plantations, pilot stage with FELDA', 'Active'],
    ['ENT-C04', 'EduBridge Asia', 'Company', 'hello@edubridge.asia', 'EdTech, Mobile', 'Micro-credentialing platform for TVET workers, partnered with HRDF', 'Active'],
    ['ENT-C05', 'GreenHaul Logistics', 'Company', 'ops@greenhaul.my', 'Logistics, CleanTech', 'EV-first last-mile delivery for Klang Valley, Series A fundraising', 'Active'],
    ['ENT-C06', 'PropView AI', 'Company', 'team@propview.com.my', 'PropTech, AI', 'AI property valuation engine using Bank Negara data, pre-seed', 'Active'],
    ['ENT-C07', 'Warung Digital', 'Company', 'admin@warungdigital.my', 'F&B Tech, SaaS', 'POS and inventory SaaS for mamak restaurants and hawker stalls', 'Active'],
    ['ENT-C08', 'NilaiCarbon', 'Company', 'ceo@nilaicarbon.my', 'CleanTech, ESG', 'Voluntary carbon credit marketplace for Malaysian palm oil mills', 'Active'],
    ['ENT-C09', 'Salam Insure', 'Company', 'hello@salaminsure.my', 'InsurTech, Shariah', 'Shariah-compliant micro-takaful via WhatsApp chatbot', 'Active'],
    ['ENT-C10', 'KodLab', 'Company', 'team@kodlab.dev', 'EdTech, Developer Tools', 'Competitive programming training platform for Malaysian universities', 'Active'],
    ['ENT-C11', 'BatuData Analytics', 'Company', 'info@batudata.my', 'Data Analytics, AI', 'Retail foot-traffic analytics for Malaysian shopping malls', 'Dormant'],
    ['ENT-C12', 'CariKerja.AI', 'Company', 'hr@carikerja.ai', 'HR Tech, AI', 'AI resume screening for Malaysian job market, Bahasa + English bilingual NLP', 'Active'],
    ['ENT-C13', 'RumahSewa', 'Company', 'support@rumahsewa.my', 'PropTech, Marketplace', 'Rental deposit tokenization and tenant verification platform', 'Active'],
    ['ENT-C14', 'HelangDrone', 'Company', 'pilot@helangdrone.my', 'AgriTech, Drones', 'Drone-based crop spraying and mapping for Sabah plantations', 'Active'],
    ['ENT-C15', 'JomClinic', 'Company', 'admin@jomclinic.my', 'HealthTech, Telehealth', 'Telehealth platform connecting rural B40 communities to specialists', 'Churned'],

    // === PARTNERS (8) ===
    ['ENT-P01', 'Cradle Fund', 'Partner', 'programmes@cradle.com.my', 'Government Grant, Startup Funding', 'CIP Spark and Coach & Grow grant programmes for Malaysian tech startups', 'Active'],
    ['ENT-P02', '500 Global (KL)', 'Partner', 'kl@500.co', 'Venture Capital, Acceleration', 'Pre-seed to Series A investments in SEA, batch acceleration programmes', 'Active'],
    ['ENT-P03', 'MDEC', 'Partner', 'ecosystem@mdec.com.my', 'Digital Economy, Policy', 'MSC Malaysia status, DE Rantau programme, digital adoption grants', 'Active'],
    ['ENT-P04', 'Bank Islam', 'Partner', 'innovation@bankislam.com.my', 'Islamic Finance, Banking', 'Shariah-compliant fintech sandbox, API banking partnerships', 'Active'],
    ['ENT-P05', 'Sime Darby Innovation', 'Partner', 'innovation@simedarby.com', 'Plantation, Automotive', 'Corporate venture arm, pilot programmes with portfolio companies', 'Active'],
    ['ENT-P06', 'Lee Hishammuddin Allen & Gledhill', 'Partner', 'startup@lh-ag.com', 'Legal, IP', 'Pro-bono startup legal clinics, IP registration support', 'Active'],
    ['ENT-P07', 'Google for Startups (MY)', 'Partner', 'startups-my@google.com', 'Cloud, AI', 'Google Cloud credits, Gemini API access, GDG community events', 'Active'],
    ['ENT-P08', 'Petronas Technology Ventures', 'Partner', 'ventures@petronas.com', 'Energy, DeepTech', 'Cleantech piloting at Petronas facilities, co-investment up to RM5M', 'Active'],
  ];

  data.forEach(row => sheet.appendRow(row));
  Logger.log('Entities: ' + data.length + ' rows written');
  Logger.log('  First: ' + data[0][1]);
  Logger.log('  Last: ' + data[data.length - 1][1]);
}

function populateLinkages(ss) {
  const sheet = ss.getSheetByName('Linkages');
  const data = [
    // Mentorship linkages (mentor → company)
    ['LNK-001', 'ENT-M02', 'ENT-C01', 'Mentorship', '2024-03-15', '2026-05-14', 88, 'Healthy', 'Active'],
    ['LNK-002', 'ENT-M05', 'ENT-C02', 'Mentorship', '2024-06-01', '2026-05-12', 82, 'Healthy', 'Active'],
    ['LNK-003', 'ENT-M01', 'ENT-C12', 'Mentorship', '2024-09-10', '2026-05-10', 75, 'Healthy', 'Active'],
    ['LNK-004', 'ENT-M04', 'ENT-C08', 'Mentorship', '2024-11-20', '2026-05-08', 70, 'Healthy', 'Active'],
    ['LNK-005', 'ENT-M07', 'ENT-C06', 'Mentorship', '2025-01-05', '2026-04-28', 62, 'Warning', 'Active'],
    ['LNK-006', 'ENT-M03', 'ENT-C05', 'Mentorship', '2025-02-14', '2026-05-15', 91, 'Healthy', 'Active'],
    ['LNK-007', 'ENT-M06', 'ENT-C03', 'Mentorship', '2025-03-01', '2026-04-20', 55, 'Warning', 'Active'],
    ['LNK-008', 'ENT-M08', 'ENT-C04', 'Mentorship', '2025-04-10', '2026-05-11', 78, 'Healthy', 'Active'],
    ['LNK-009', 'ENT-M10', 'ENT-C09', 'Mentorship', '2025-05-01', '2026-05-13', 85, 'Healthy', 'Active'],
    ['LNK-010', 'ENT-M01', 'ENT-C07', 'Mentorship', '2025-06-15', '2026-03-10', 28, 'At_Risk', 'Active'],
    ['LNK-011', 'ENT-M09', 'ENT-C11', 'Mentorship', '2024-08-20', '2025-06-15', 12, 'Dormant', 'Active'],
    ['LNK-012', 'ENT-M02', 'ENT-C10', 'Mentorship', '2025-07-01', '2026-05-09', 73, 'Healthy', 'Active'],
    ['LNK-013', 'ENT-M05', 'ENT-C15', 'Mentorship', '2024-04-01', '2025-02-28', 8, 'Dormant', 'Archived'],

    // Investment / Partnership linkages (partner → company)
    ['LNK-014', 'ENT-P01', 'ENT-C01', 'Investment', '2024-06-01', '2026-05-10', 80, 'Healthy', 'Active'],
    ['LNK-015', 'ENT-P02', 'ENT-C02', 'Investment', '2024-09-15', '2026-04-30', 65, 'Warning', 'Active'],
    ['LNK-016', 'ENT-P01', 'ENT-C05', 'Investment', '2025-01-20', '2026-05-14', 86, 'Healthy', 'Active'],
    ['LNK-017', 'ENT-P04', 'ENT-C09', 'Partnership', '2025-03-10', '2026-05-12', 77, 'Healthy', 'Active'],
    ['LNK-018', 'ENT-P05', 'ENT-C03', 'Partnership', '2025-04-15', '2026-04-18', 48, 'Warning', 'Active'],
    ['LNK-019', 'ENT-P08', 'ENT-C08', 'Partnership', '2025-05-01', '2026-05-06', 72, 'Healthy', 'Active'],
    ['LNK-020', 'ENT-P07', 'ENT-C06', 'Partnership', '2025-06-01', '2026-05-15', 90, 'Healthy', 'Active'],
    ['LNK-021', 'ENT-P03', 'ENT-C04', 'Partnership', '2025-02-01', '2026-05-09', 68, 'Warning', 'Active'],
    ['LNK-022', 'ENT-P06', 'ENT-C13', 'Partnership', '2025-07-15', '2026-04-22', 52, 'Warning', 'Active'],
    ['LNK-023', 'ENT-P02', 'ENT-C14', 'Investment', '2025-08-01', '2026-03-15', 35, 'At_Risk', 'Active'],
    ['LNK-024', 'ENT-P01', 'ENT-C11', 'Investment', '2024-05-01', '2025-04-10', 10, 'Dormant', 'Archived'],
    ['LNK-025', 'ENT-P01', 'ENT-C15', 'Investment', '2024-03-01', '2025-01-30', 5, 'Dormant', 'Archived'],
  ];

  data.forEach(row => sheet.appendRow(row));
  Logger.log('Linkages: ' + data.length + ' rows written');
  Logger.log('  First: ' + data[0][0]);
  Logger.log('  Last: ' + data[data.length - 1][0]);
}

function populateInteractions(ss) {
  const sheet = ss.getSheetByName('Interactions');
  const data = [
    // LNK-001 (Tan Wei Lin → PayFlex) — very active mentorship
    ['INT-001', 'LNK-001', 'Meeting', '2026-05-14T10:00:00', 'Bi-weekly mentorship: reviewed BNPL risk scoring model and Bank Negara sandbox application timeline'],
    ['INT-002', 'LNK-001', 'Email', '2026-05-12T14:30:00', 'Email thread: "Series A term sheet comparison — YC vs 500 Global terms" (4 messages)'],
    ['INT-003', 'LNK-001', 'Meeting', '2026-04-30T10:00:00', 'Mentorship session: go-to-market strategy for merchant onboarding in Klang Valley'],
    ['INT-004', 'LNK-001', 'Email', '2026-04-22T09:15:00', 'Email thread: "Intro to BNM FinTech regulatory team" (2 messages)'],
    ['INT-005', 'LNK-001', 'Meeting', '2026-04-15T14:00:00', 'Deep dive on payment gateway architecture and PCI-DSS compliance roadmap'],

    // LNK-002 (Dr. Lim → MedikAI) — strong health-tech mentorship
    ['INT-006', 'LNK-002', 'Meeting', '2026-05-12T11:00:00', 'Reviewed MDA Class B registration requirements for AI diagnostic software'],
    ['INT-007', 'LNK-002', 'Email', '2026-05-08T16:00:00', 'Email thread: "Clinical validation study protocol — IRB submission draft" (3 messages)'],
    ['INT-008', 'LNK-002', 'Meeting', '2026-04-28T11:00:00', 'Mentorship: ASEAN market entry strategy starting with Thailand MOH partnership'],
    ['INT-009', 'LNK-002', 'Email', '2026-04-15T10:30:00', 'Email thread: "Intro to KPJ Healthcare innovation team for pilot" (2 messages)'],

    // LNK-003 (Dr. Amirul → CariKerja.AI)
    ['INT-010', 'LNK-003', 'Meeting', '2026-05-10T15:00:00', 'NLP model review: Bahasa-English code-switching handling in resume parser'],
    ['INT-011', 'LNK-003', 'Email', '2026-05-05T11:00:00', 'Email thread: "Training data sourcing — JobStreet partnership discussion" (3 messages)'],
    ['INT-012', 'LNK-003', 'Meeting', '2026-04-20T15:00:00', 'Reviewed bias audit methodology for AI hiring recommendations'],

    // LNK-006 (Rajesh → GreenHaul) — very active
    ['INT-013', 'LNK-006', 'Meeting', '2026-05-15T09:00:00', 'Investor pitch practice: refined unit economics slides for Series A deck'],
    ['INT-014', 'LNK-006', 'Email', '2026-05-13T08:30:00', 'Email thread: "Financial model review — RM3.2M raise at 12x revenue" (5 messages)'],
    ['INT-015', 'LNK-006', 'Meeting', '2026-05-06T09:00:00', 'B2B sales playbook: enterprise logistics contract negotiation framework'],
    ['INT-016', 'LNK-006', 'Email', '2026-04-28T14:00:00', 'Email thread: "Intro to Lazada logistics partnership team" (2 messages)'],
    ['INT-017', 'LNK-006', 'Meeting', '2026-04-18T09:00:00', 'Competitive analysis: GreenHaul vs Lalamove vs J&T EV fleet comparison'],

    // LNK-009 (Chen Jia Xin → Salam Insure)
    ['INT-018', 'LNK-009', 'Meeting', '2026-05-13T14:00:00', 'WhatsApp chatbot UX review: takaful product recommendation flow'],
    ['INT-019', 'LNK-009', 'Email', '2026-05-07T10:00:00', 'Email thread: "BNM sandbox approval — Shariah compliance checklist" (3 messages)'],
    ['INT-020', 'LNK-009', 'Meeting', '2026-04-29T14:00:00', 'Integration planning: TNG eWallet payment gateway for micro-takaful premiums'],

    // LNK-014 (Cradle → PayFlex) — grant partnership
    ['INT-021', 'LNK-014', 'Meeting', '2026-05-10T10:00:00', 'CIP Coach & Grow quarterly review: milestone 3 of 5 completed, RM150K disbursed'],
    ['INT-022', 'LNK-014', 'Email', '2026-05-02T09:00:00', 'Email thread: "Q2 progress report submission — merchant acquisition metrics" (2 messages)'],
    ['INT-023', 'LNK-014', 'Meeting', '2026-04-10T10:00:00', 'Mid-programme check-in: discussed pivot from B2C to B2B SME focus'],

    // LNK-016 (Cradle → GreenHaul)
    ['INT-024', 'LNK-016', 'Meeting', '2026-05-14T11:00:00', 'CIP Spark final review: all 5 milestones met, RM250K fully disbursed'],
    ['INT-025', 'LNK-016', 'Email', '2026-05-08T15:00:00', 'Email thread: "Graduation to Coach & Grow application" (3 messages)'],

    // LNK-020 (Google → PropView AI)
    ['INT-026', 'LNK-020', 'Meeting', '2026-05-15T16:00:00', 'Google Cloud architecture review: Vertex AI deployment for property valuation model'],
    ['INT-027', 'LNK-020', 'Email', '2026-05-10T11:00:00', 'Email thread: "GCP credits allocation — $10K approved for Vertex AI" (2 messages)'],
    ['INT-028', 'LNK-020', 'Meeting', '2026-04-25T16:00:00', 'Gemini API integration workshop: structured output for valuation reports'],

    // LNK-017 (Bank Islam → Salam Insure)
    ['INT-029', 'LNK-017', 'Meeting', '2026-05-12T10:00:00', 'API banking integration kickoff: sandbox access granted for premium collection'],
    ['INT-030', 'LNK-017', 'Email', '2026-05-05T14:00:00', 'Email thread: "Shariah Advisory Board review of micro-takaful product" (4 messages)'],

    // LNK-004 (Nur Aisyah → NilaiCarbon) — ESG mentorship
    ['INT-031', 'LNK-004', 'Meeting', '2026-05-08T15:00:00', 'Impact measurement framework review: Verra VCS methodology for palm oil credits'],
    ['INT-032', 'LNK-004', 'Email', '2026-04-30T12:00:00', 'Email thread: "Intro to Bursa Carbon Exchange team" (2 messages)'],
    ['INT-033', 'LNK-004', 'Meeting', '2026-04-15T15:00:00', 'SDG alignment mapping: Goals 7, 13, 15 for carbon credit marketplace'],

    // LNK-008 (Siti Mariam → EduBridge)
    ['INT-034', 'LNK-008', 'Meeting', '2026-05-11T10:00:00', 'MDEC grant application review: DE Rantau digital adoption programme'],
    ['INT-035', 'LNK-008', 'Email', '2026-05-03T09:00:00', 'Email thread: "HRDF partnership MOU draft review" (3 messages)'],

    // LNK-007 (Farah → AgriSense) — cooling off
    ['INT-036', 'LNK-007', 'Email', '2026-04-20T11:00:00', 'Email thread: "FELDA pilot results — sensor accuracy report" (2 messages)'],
    ['INT-037', 'LNK-007', 'Meeting', '2026-03-25T14:00:00', 'Reviewed carbon footprint reduction data from precision fertilizer dosing'],

    // LNK-010 (Dr. Amirul → Warung Digital) — at risk
    ['INT-038', 'LNK-010', 'Email', '2026-03-10T10:00:00', 'Email thread: "POS system architecture feedback" (1 message, no reply)'],

    // LNK-019 (Petronas → NilaiCarbon)
    ['INT-039', 'LNK-019', 'Meeting', '2026-05-06T11:00:00', 'Pilot scoping: carbon credit verification at 3 Petronas-linked palm oil mills'],
    ['INT-040', 'LNK-019', 'Email', '2026-04-28T16:00:00', 'Email thread: "NDA and pilot agreement terms" (3 messages)'],

    // LNK-005 (Wong Kah Yee → PropView AI)
    ['INT-041', 'LNK-005', 'Meeting', '2026-04-28T14:00:00', 'Cloud cost optimization: migrated from Cloud Run to GKE Autopilot, saving 40%'],
    ['INT-042', 'LNK-005', 'Email', '2026-04-10T09:00:00', 'Email thread: "CI/CD pipeline setup for ML model deployment" (2 messages)'],

    // LNK-012 (Tan Wei Lin → KodLab)
    ['INT-043', 'LNK-012', 'Meeting', '2026-05-09T11:00:00', 'Revenue model review: freemium vs institutional licensing for universities'],
    ['INT-044', 'LNK-012', 'Email', '2026-04-25T10:00:00', 'Email thread: "Partnership with UPM Computer Science faculty" (3 messages)'],

    // LNK-021 (MDEC → EduBridge)
    ['INT-045', 'LNK-021', 'Meeting', '2026-05-09T14:00:00', 'MSC Malaysia status application review: compliance checklist walkthrough'],

    // LNK-015 (500 Global → MedikAI)
    ['INT-046', 'LNK-015', 'Meeting', '2026-04-30T15:00:00', 'Due diligence session: reviewed clinical validation data and IP portfolio'],
    ['INT-047', 'LNK-015', 'Email', '2026-04-20T11:00:00', 'Email thread: "Term sheet for RM2.5M pre-Series A" (4 messages)'],

    // LNK-022 (Legal firm → RumahSewa)
    ['INT-048', 'LNK-022', 'Meeting', '2026-04-22T10:00:00', 'Legal clinic: rental deposit tokenization regulatory framework under SC guidelines'],

    // LNK-023 (500 Global → HelangDrone) — cooling
    ['INT-049', 'LNK-023', 'Email', '2026-03-15T14:00:00', 'Email thread: "CAAM drone operation license status update" (2 messages)'],
    ['INT-050', 'LNK-023', 'Meeting', '2026-02-20T11:00:00', 'Initial investment screening: reviewed Sabah plantation market size and unit economics'],
  ];

  data.forEach(row => sheet.appendRow(row));
  Logger.log('Interactions: ' + data.length + ' rows written');
  Logger.log('  First: ' + data[0][0]);
  Logger.log('  Last: ' + data[data.length - 1][0]);
}

/**
 * Quick verification: reads back all sheets and logs summary.
 */
function verifyData() {
  const entities = getSheetData(SHEETS.ENTITIES);
  const linkages = getSheetData(SHEETS.LINKAGES);
  const interactions = getSheetData(SHEETS.INTERACTIONS);

  Logger.log('=== Data Verification ===');
  Logger.log('Entities: ' + entities.length + ' rows');
  Logger.log('  Mentors: ' + entities.filter(e => e.Role === 'Mentor').length);
  Logger.log('  Companies: ' + entities.filter(e => e.Role === 'Company').length);
  Logger.log('  Partners: ' + entities.filter(e => e.Role === 'Partner').length);
  Logger.log('  Active: ' + entities.filter(e => e.Status === 'Active').length);

  Logger.log('Linkages: ' + linkages.length + ' rows');
  Logger.log('  Mentorship: ' + linkages.filter(l => l.Linkage_Type === 'Mentorship').length);
  Logger.log('  Investment: ' + linkages.filter(l => l.Linkage_Type === 'Investment').length);
  Logger.log('  Partnership: ' + linkages.filter(l => l.Linkage_Type === 'Partnership').length);
  Logger.log('  Healthy: ' + linkages.filter(l => Number(l.Health_Score) >= 70).length);
  Logger.log('  Warning: ' + linkages.filter(l => Number(l.Health_Score) >= 40 && Number(l.Health_Score) < 70).length);
  Logger.log('  At-Risk: ' + linkages.filter(l => Number(l.Health_Score) < 40).length);

  Logger.log('Interactions: ' + interactions.length + ' rows');
  Logger.log('  Meetings: ' + interactions.filter(i => i.Interaction_Type === 'Meeting').length);
  Logger.log('  Emails: ' + interactions.filter(i => i.Interaction_Type === 'Email').length);
}
