// Sample data for demo/prototype — replaces Firestore reads during hackathon demo
export const entities = [
  { Entity_ID: 'ENT-001', Name: 'Ahmad Rizal', Role: 'Mentor', Email: 'ahmad.rizal@gmail.com', Industry_Tags: 'FinTech, AI', Expertise_Needs: 'Looking to mentor early-stage startups in payments', Status: 'Active' },
  { Entity_ID: 'ENT-002', Name: 'Sarah Chen', Role: 'Company', Email: 'sarah.chen@techstartup.com', Industry_Tags: 'HealthTech, AI', Expertise_Needs: 'Need guidance on regulatory compliance and scaling', Status: 'Active' },
  { Entity_ID: 'ENT-003', Name: 'David Lim', Role: 'Partner', Email: 'david.lim@vcfund.com', Industry_Tags: 'DeepTech, SaaS', Expertise_Needs: 'Seeking Series A investment opportunities', Status: 'Active' },
  { Entity_ID: 'ENT-004', Name: 'Priya Nair', Role: 'Company', Email: 'priya.nair@edtech.my', Industry_Tags: 'EdTech, Mobile', Expertise_Needs: 'Need mentorship on product-market fit', Status: 'Active' },
  { Entity_ID: 'ENT-005', Name: 'James Wong', Role: 'Mentor', Email: 'james.wong@google.com', Industry_Tags: 'Cloud, DevOps', Expertise_Needs: 'Available to mentor on cloud architecture', Status: 'Active' },
  { Entity_ID: 'ENT-006', Name: 'Aisha Rahman', Role: 'Partner', Email: 'aisha@impactvc.my', Industry_Tags: 'Impact, ESG', Expertise_Needs: 'SDG-aligned investment in Southeast Asia', Status: 'Active' },
  { Entity_ID: 'ENT-007', Name: 'Wei Lin Tan', Role: 'Company', Email: 'weilin@greenai.io', Industry_Tags: 'CleanTech, AI', Expertise_Needs: 'Looking for climate tech mentors and seed funding', Status: 'Active' },
  { Entity_ID: 'ENT-008', Name: 'Raj Patel', Role: 'Mentor', Email: 'raj.patel@aws.com', Industry_Tags: 'Cloud, ML', Expertise_Needs: 'Mentoring on MLOps and model deployment', Status: 'Dormant' },
];

export const linkages = [
  { Linkage_ID: 'LNK-001', Entity_A_ID: 'ENT-001', Entity_B_ID: 'ENT-002', Linkage_Type: 'Mentorship', Start_Date: '2026-04-01', Last_Interaction_Date: '2026-05-14', Health_Score: 82 },
  { Linkage_ID: 'LNK-002', Entity_A_ID: 'ENT-003', Entity_B_ID: 'ENT-004', Linkage_Type: 'Investment', Start_Date: '2026-03-15', Last_Interaction_Date: '2026-04-10', Health_Score: 28 },
  { Linkage_ID: 'LNK-003', Entity_A_ID: 'ENT-005', Entity_B_ID: 'ENT-002', Linkage_Type: 'Mentorship', Start_Date: '2026-05-01', Last_Interaction_Date: '2026-05-15', Health_Score: 91 },
  { Linkage_ID: 'LNK-004', Entity_A_ID: 'ENT-006', Entity_B_ID: 'ENT-007', Linkage_Type: 'Investment', Start_Date: '2026-04-20', Last_Interaction_Date: '2026-05-12', Health_Score: 65 },
  { Linkage_ID: 'LNK-005', Entity_A_ID: 'ENT-001', Entity_B_ID: 'ENT-004', Linkage_Type: 'Mentorship', Start_Date: '2026-05-05', Last_Interaction_Date: '2026-05-08', Health_Score: 45 },
];

export const interactions = [
  { Interaction_ID: 'INT-001', Linkage_ID: 'LNK-001', Interaction_Type: 'Meeting', Date: '2026-05-14T10:00:00', Summary: 'Weekly mentorship check-in: discussed product roadmap and go-to-market strategy' },
  { Interaction_ID: 'INT-002', Linkage_ID: 'LNK-001', Interaction_Type: 'Email', Date: '2026-05-12T14:30:00', Summary: 'Email thread: "Follow-up on regulatory requirements" (3 messages)' },
  { Interaction_ID: 'INT-003', Linkage_ID: 'LNK-003', Interaction_Type: 'Meeting', Date: '2026-05-15T09:00:00', Summary: 'Cloud architecture review session for HealthTech platform' },
  { Interaction_ID: 'INT-004', Linkage_ID: 'LNK-004', Interaction_Type: 'Email', Date: '2026-05-12T11:00:00', Summary: 'Email thread: "ESG impact metrics and reporting framework" (5 messages)' },
  { Interaction_ID: 'INT-005', Linkage_ID: 'LNK-002', Interaction_Type: 'Meeting', Date: '2026-04-10T15:00:00', Summary: 'Initial investment pitch meeting — EdTech market analysis presented' },
  { Interaction_ID: 'INT-006', Linkage_ID: 'LNK-005', Interaction_Type: 'Email', Date: '2026-05-08T16:00:00', Summary: 'Email thread: "Product-market fit framework resources" (2 messages)' },
  { Interaction_ID: 'INT-007', Linkage_ID: 'LNK-001', Interaction_Type: 'Meeting', Date: '2026-05-07T10:00:00', Summary: 'Mentorship session: user acquisition channels and metrics' },
  { Interaction_ID: 'INT-008', Linkage_ID: 'LNK-003', Interaction_Type: 'Email', Date: '2026-05-13T08:30:00', Summary: 'Email thread: "GCP architecture diagrams and cost estimates" (4 messages)' },
];

export const recentActivity = [
  { type: 'meeting', text: 'Ahmad Rizal and Sarah Chen had a meeting', badge: 'Meeting', time: '2 min ago', color: 'g-green' },
  { type: 'ai', text: 'Gemini AI matched Priya Nair with 3 mentors', badge: 'AI Match', time: '15 min ago', color: 'g-blue' },
  { type: 'alert', text: 'LNK-002 health dropped below 30 — nudge sent', badge: 'Alert', time: '1 hr ago', color: 'g-yellow' },
  { type: 'email', text: 'David Lim exchanged 3 emails with Priya Nair', badge: 'Email', time: '3 hrs ago', color: 'g-green' },
  { type: 'meeting', text: 'James Wong and Sarah Chen reviewed cloud architecture', badge: 'Meeting', time: '5 hrs ago', color: 'g-green' },
  { type: 'ai', text: 'Gemini AI updated health scores for 12 linkages', badge: 'AI Scan', time: '6 hrs ago', color: 'g-blue' },
];

// Helper to resolve entity names from IDs
export function getEntityName(id) {
  const entity = entities.find(e => e.Entity_ID === id);
  return entity ? entity.Name : id;
}

export function getEntity(id) {
  return entities.find(e => e.Entity_ID === id);
}

export function getLinkage(id) {
  return linkages.find(l => l.Linkage_ID === id);
}

export function getLinkageInteractions(linkageId) {
  return interactions.filter(i => i.Linkage_ID === linkageId).sort((a, b) => new Date(b.Date) - new Date(a.Date));
}
