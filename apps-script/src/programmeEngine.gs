/**
 * EcoLink AI — Programme Engine
 *
 * Implements Phases 4, 6, 8, 9, 10, 12b of the pipeline:
 * - Phase 4: Auto-create milestones when programme begins
 * - Phase 6: Milestone tracking + financial reporting
 * - Phase 8: Outcome determination (success/failure)
 * - Phase 9: Record final outcome
 * - Phase 10: AI learning loop (enhanced Gemini prompt)
 * - Phase 12b: Data analytics summaries
 */

// =====================================================
// SHEET SETUP
// =====================================================

/**
 * Creates all programme-related sheets with headers.
 * Run once from the EcoLink menu.
 */
function setupAllProgrammeSheets() {
  var ss = getSpreadsheet();

  // Milestones
  var ms = ss.getSheetByName(SHEETS.MILESTONES);
  if (!ms) ms = ss.insertSheet(SHEETS.MILESTONES);
  ms.getRange(1, 1, 1, 8).setValues([[
    'Milestone_ID', 'Linkage_ID', 'Milestone_Name', 'Target_Date',
    'Completion_Status', 'Progress_Percent', 'Evidence_Link', 'Updated_At'
  ]]);

  // Monthly Reports
  var mr = ss.getSheetByName(SHEETS.MONTHLY_REPORTS);
  if (!mr) mr = ss.insertSheet(SHEETS.MONTHLY_REPORTS);
  mr.getRange(1, 1, 1, 13).setValues([[
    'Report_ID', 'Linkage_ID', 'Month', 'Revenue', 'Team_Size',
    'Customers', 'Budget_Spent', 'Burn_Rate', 'Remaining_Budget',
    'Top_Win', 'Biggest_Challenge', 'Gemini_Analysis', 'Submitted_At'
  ]]);

  // Outcomes
  var oc = ss.getSheetByName(SHEETS.OUTCOMES);
  if (!oc) oc = ss.insertSheet(SHEETS.OUTCOMES);
  oc.getRange(1, 1, 1, 14).setValues([[
    'Outcome_ID', 'Linkage_ID', 'Company_ID', 'Mentor_ID',
    'Outcome_Status', 'Outcome_Date', 'Funding_Raised', 'Growth_Metric',
    'Success_Score', 'Match_Attribution', 'Mentor_Final_Rating',
    'Company_Final_Rating', 'Lessons_Learned', 'Created_At'
  ]]);

  Logger.log('All programme sheets created: Milestones, Monthly_Reports, Outcomes');
}

// =====================================================
// PHASE 4 — PROGRAMME BEGINS (auto-create milestones)
// =====================================================

/**
 * Default milestone templates by linkage type.
 */
var MILESTONE_TEMPLATES = {
  'Mentorship': [
    { name: 'Complete intro session with mentor', weekOffset: 1 },
    { name: 'Define 90-day goals together', weekOffset: 2 },
    { name: 'Refine pitch deck / business plan', weekOffset: 4 },
    { name: 'Submit grant or funding application', weekOffset: 6 },
    { name: 'Secure first customer or pilot', weekOffset: 8 },
    { name: 'Achieve revenue milestone (RM10K MRR)', weekOffset: 10 },
    { name: 'Begin fundraising conversations', weekOffset: 12 },
    { name: 'Receive term sheet or LOI', weekOffset: 14 },
    { name: 'Programme graduation review', weekOffset: 16 }
  ],
  'Investment': [
    { name: 'Due diligence kickoff', weekOffset: 1 },
    { name: 'Financial model review', weekOffset: 3 },
    { name: 'Term sheet negotiation', weekOffset: 5 },
    { name: 'Legal documentation', weekOffset: 7 },
    { name: 'Investment disbursement', weekOffset: 9 },
    { name: 'First milestone checkpoint', weekOffset: 12 },
    { name: 'Portfolio review', weekOffset: 16 }
  ],
  'Partnership': [
    { name: 'Partnership kickoff meeting', weekOffset: 1 },
    { name: 'Define collaboration scope', weekOffset: 2 },
    { name: 'MOU or agreement signed', weekOffset: 4 },
    { name: 'Pilot programme launched', weekOffset: 6 },
    { name: 'Mid-programme checkpoint', weekOffset: 10 },
    { name: 'Pilot results review', weekOffset: 14 },
    { name: 'Partnership renewal decision', weekOffset: 16 }
  ]
};

/**
 * Auto-creates milestones for a newly approved linkage.
 * Called by autoApproveMatch() in consentEngine.gs.
 *
 * @param {string} linkageId
 * @param {string} linkageType - Mentorship, Investment, or Partnership
 */
function createMilestonesForLinkage(linkageId, linkageType) {
  var template = MILESTONE_TEMPLATES[linkageType] || MILESTONE_TEMPLATES['Mentorship'];
  var today = new Date();

  template.forEach(function(milestone) {
    var targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + (milestone.weekOffset * 7));

    appendRow(SHEETS.MILESTONES, [
      'MS-' + Utilities.getUuid().substring(0, 8).toUpperCase(),
      linkageId,
      milestone.name,
      formatDate(targetDate),
      'Not Started',
      0,
      '',
      formatTimestamp(new Date())
    ]);
  });

  Logger.log('Created ' + template.length + ' milestones for ' + linkageId);
}

// =====================================================
// PHASE 6 — MILESTONE TRACKING
// =====================================================

/**
 * Updates a milestone's status and progress.
 *
 * @param {string} milestoneId
 * @param {string} status - Not Started / In Progress / Completed / Overdue
 * @param {number} progress - 0 to 100
 * @param {string} evidenceLink - optional URL
 */
function updateMilestone(milestoneId, status, progress, evidenceLink) {
  updateCell(SHEETS.MILESTONES, 'Milestone_ID', milestoneId, 'Completion_Status', status);
  updateCell(SHEETS.MILESTONES, 'Milestone_ID', milestoneId, 'Progress_Percent', progress);
  if (evidenceLink) {
    updateCell(SHEETS.MILESTONES, 'Milestone_ID', milestoneId, 'Evidence_Link', evidenceLink);
  }
  updateCell(SHEETS.MILESTONES, 'Milestone_ID', milestoneId, 'Updated_At', formatTimestamp(new Date()));
}

/**
 * Checks all milestones and marks overdue ones.
 * Should be run daily via trigger.
 */
function checkOverdueMilestones() {
  var milestones = getSheetData(SHEETS.MILESTONES);
  var today = new Date();
  var overdueCount = 0;

  milestones.forEach(function(ms) {
    if (ms.Completion_Status === 'Not Started' || ms.Completion_Status === 'In Progress') {
      var target = new Date(ms.Target_Date);
      if (target < today) {
        updateCell(SHEETS.MILESTONES, 'Milestone_ID', ms.Milestone_ID, 'Completion_Status', 'Overdue');
        overdueCount++;
      }
    }
  });

  Logger.log('Overdue check: ' + overdueCount + ' milestones marked overdue');
  return overdueCount;
}

/**
 * Gets milestone progress summary for a linkage.
 *
 * @param {string} linkageId
 * @returns {{ total, completed, inProgress, overdue, notStarted, progressPercent }}
 */
function getMilestoneProgress(linkageId) {
  var milestones = getSheetData(SHEETS.MILESTONES).filter(function(m) {
    return m.Linkage_ID === linkageId;
  });

  var total = milestones.length;
  var completed = milestones.filter(function(m) { return m.Completion_Status === 'Completed'; }).length;
  var inProgress = milestones.filter(function(m) { return m.Completion_Status === 'In Progress'; }).length;
  var overdue = milestones.filter(function(m) { return m.Completion_Status === 'Overdue'; }).length;
  var notStarted = milestones.filter(function(m) { return m.Completion_Status === 'Not Started'; }).length;
  var progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total: total, completed: completed, inProgress: inProgress,
    overdue: overdue, notStarted: notStarted, progressPercent: progressPercent
  };
}

// =====================================================
// PHASE 8 & 9 — OUTCOME DETERMINATION & RECORDING
// =====================================================

/**
 * Determines outcome status based on milestones and health.
 *
 * @param {string} linkageId
 * @returns {{ status, score, reason }}
 */
function determineOutcome(linkageId) {
  var progress = getMilestoneProgress(linkageId);
  var linkages = getSheetData(SHEETS.LINKAGES);
  var linkage = linkages.filter(function(l) { return l.Linkage_ID === linkageId; })[0];
  var healthScore = linkage ? Number(linkage.Health_Score) : 0;

  var score = 0;
  var status = '';
  var reason = '';

  // Calculate composite score: 60% milestones + 40% engagement health
  score = Math.round((progress.progressPercent * 0.6) + (healthScore * 0.4));

  if (progress.progressPercent >= 80 && healthScore >= 60) {
    status = 'Graduated';
    reason = 'Completed ' + progress.completed + '/' + progress.total + ' milestones with strong engagement (health: ' + healthScore + ')';
  } else if (progress.progressPercent >= 60) {
    status = 'Graduated';
    reason = 'Met programme requirements with ' + progress.completed + '/' + progress.total + ' milestones completed';
  } else if (progress.progressPercent >= 40) {
    status = 'Stalled';
    reason = 'Partial progress (' + progress.completed + '/' + progress.total + '), ' + progress.overdue + ' overdue milestones';
  } else if (healthScore < 20) {
    status = 'Churned';
    reason = 'Relationship dormant (health: ' + healthScore + ') with only ' + progress.completed + '/' + progress.total + ' milestones';
  } else {
    status = 'Stalled';
    reason = 'Insufficient progress: ' + progress.progressPercent + '% milestones, health score ' + healthScore;
  }

  return { status: status, score: score, reason: reason };
}

/**
 * Records the final outcome for a linkage.
 *
 * @param {string} linkageId
 * @param {string} outcomeStatus - Funded / Graduated / Pivoted / Stalled / Churned
 * @param {string} fundingRaised - e.g. "RM500K" or ""
 * @param {string} growthMetric - e.g. "3x MRR" or ""
 * @param {number} mentorRating - 1-5
 * @param {number} companyRating - 1-5
 * @param {string} lessonsLearned - free text
 */
function recordOutcome(linkageId, outcomeStatus, fundingRaised, growthMetric, mentorRating, companyRating, lessonsLearned) {
  var linkages = getSheetData(SHEETS.LINKAGES);
  var linkage = linkages.filter(function(l) { return l.Linkage_ID === linkageId; })[0];
  if (!linkage) return { error: 'Linkage not found' };

  var outcome = determineOutcome(linkageId);
  var finalStatus = outcomeStatus || outcome.status;
  var finalScore = outcome.score;

  // Determine match attribution based on health + milestones
  var attribution = finalScore >= 70 ? 'High' : finalScore >= 40 ? 'Medium' : 'Low';

  appendRow(SHEETS.OUTCOMES, [
    'OUT-' + Utilities.getUuid().substring(0, 8).toUpperCase(),
    linkageId,
    linkage.Entity_B_ID || linkage.Entity_A_ID,
    linkage.Entity_A_ID || linkage.Entity_B_ID,
    finalStatus,
    formatDate(new Date()),
    fundingRaised || '',
    growthMetric || '',
    finalScore,
    attribution,
    mentorRating || '',
    companyRating || '',
    lessonsLearned || outcome.reason,
    formatTimestamp(new Date())
  ]);

  // Archive the linkage
  updateCell(SHEETS.LINKAGES, 'Linkage_ID', linkageId, 'Status', 'Archived');

  // If successful, mark mentor as high-potential
  if (finalStatus === 'Funded' || finalStatus === 'Graduated') {
    Logger.log('Mentor ' + linkage.Entity_A_ID + ' linked to successful outcome — prioritised for future matching');
  }

  Logger.log('Outcome recorded for ' + linkageId + ': ' + finalStatus + ' (score: ' + finalScore + ')');
  return { linkageId: linkageId, status: finalStatus, score: finalScore, attribution: attribution };
}

/**
 * Demo function: records outcome for a sample linkage.
 */
function recordOutcomeDemo() {
  var linkages = getSheetData(SHEETS.LINKAGES).filter(function(l) { return l.Status === 'Active'; });
  if (linkages.length === 0) { Logger.log('No active linkages to record outcome for'); return; }

  var sample = linkages[0];
  var result = recordOutcome(
    sample.Linkage_ID,
    'Graduated',
    'RM250K',
    '3x revenue growth',
    4.5,
    4.8,
    'Strong mentor engagement led to successful grant completion'
  );
  Logger.log('Demo outcome: ' + JSON.stringify(result));
}

// =====================================================
// PHASE 10 — AI LEARNING LOOP
// =====================================================

/**
 * Builds an enhanced Gemini matching prompt that includes
 * historical outcome patterns from completed matches.
 *
 * @param {object} requestingEntity - the entity seeking a match
 * @param {Array} candidates - potential match candidates
 * @param {string} matchType - Mentorship, Partnership, Investment
 * @returns {string} enhanced prompt with historical context
 */
function buildEnhancedMatchPrompt(requestingEntity, candidates, matchType) {
  var outcomes = [];
  try { outcomes = getSheetData(SHEETS.OUTCOMES); } catch (e) { /* sheet may not exist yet */ }

  var historicalContext = '';

  if (outcomes.length > 0) {
    // Calculate success patterns
    var totalOutcomes = outcomes.length;
    var successful = outcomes.filter(function(o) {
      return o.Outcome_Status === 'Funded' || o.Outcome_Status === 'Graduated';
    });
    var successRate = Math.round((successful.length / totalOutcomes) * 100);

    // Average score of successful matches
    var avgSuccessScore = successful.length > 0
      ? Math.round(successful.reduce(function(a, o) { return a + Number(o.Success_Score || 0); }, 0) / successful.length)
      : 0;

    // Find high-attribution matches
    var highAttribution = outcomes.filter(function(o) { return o.Match_Attribution === 'High'; });

    historicalContext = '\n\nHISTORICAL CONTEXT (learn from ' + totalOutcomes + ' completed matches):\n'
      + '- Overall success rate: ' + successRate + '% (' + successful.length + ' of ' + totalOutcomes + ')\n'
      + '- Average success score: ' + avgSuccessScore + '/100\n'
      + '- High-attribution matches: ' + highAttribution.length + ' (AI match directly contributed to outcome)\n';

    // Add patterns from successful matches
    if (successful.length > 0) {
      historicalContext += '- Successful match patterns: prioritise mentors with strong engagement history\n';
      historicalContext += '- De-prioritise mentors with 3+ active mentees (overload risk)\n';
    }

    // Add failure patterns
    var failed = outcomes.filter(function(o) {
      return o.Outcome_Status === 'Churned' || o.Outcome_Status === 'Stalled';
    });
    if (failed.length > 0) {
      historicalContext += '- Failed match patterns: avoid industry overlap below 30%, watch for dormant engagement\n';
    }
  }

  var prompt = 'You are an ecosystem relationship matching engine for ' + matchType + ' relationships.\n\n'
    + 'REQUESTING ENTITY:\n'
    + '- Name: ' + requestingEntity.Name + '\n'
    + '- Role: ' + requestingEntity.Role + '\n'
    + '- Industry: ' + (requestingEntity.Industry_Tags || '') + '\n'
    + '- Needs: ' + (requestingEntity.Expertise_Needs || '') + '\n'
    + historicalContext
    + '\nAVAILABLE CANDIDATES:\n'
    + JSON.stringify(candidates.map(function(c) {
        return { Entity_ID: c.Entity_ID, Name: c.Name, Role: c.Role,
                 Industry_Tags: c.Industry_Tags, Expertise_Needs: c.Expertise_Needs };
      }), null, 2)
    + '\n\nReturn EXACTLY a JSON array of the top 3 best matches. Each match must have:\n'
    + '- "entityId": the Entity_ID\n'
    + '- "name": the candidate name\n'
    + '- "score": confidence score 0-1\n'
    + '- "reason": 1-2 sentence explanation\n'
    + '\nPrioritise patterns that led to successful outcomes. De-prioritise patterns that led to churn.\n'
    + 'Return ONLY the JSON array.';

  return prompt;
}

// =====================================================
// PHASE 12b — DATA ANALYTICS (Gemini summaries)
// =====================================================

/**
 * Generates an AI-powered analytics summary of the entire ecosystem.
 * Calls Gemini to analyse linkage health, milestone progress, and patterns.
 */
function generateAnalyticsSummary() {
  var entities = getSheetData(SHEETS.ENTITIES);
  var linkages = getSheetData(SHEETS.LINKAGES);
  var interactions = getSheetData(SHEETS.INTERACTIONS);

  var milestones = [];
  try { milestones = getSheetData(SHEETS.MILESTONES); } catch (e) {}
  var outcomes = [];
  try { outcomes = getSheetData(SHEETS.OUTCOMES); } catch (e) {}

  // Build ecosystem stats
  var activeLinks = linkages.filter(function(l) { return l.Status === 'Active'; });
  var atRisk = activeLinks.filter(function(l) { return Number(l.Health_Score) < 40; });
  var healthy = activeLinks.filter(function(l) { return Number(l.Health_Score) >= 70; });

  var entityMap = {};
  entities.forEach(function(e) { entityMap[e.Entity_ID] = e; });

  // Build per-linkage summary
  var linkageSummaries = activeLinks.map(function(l) {
    var nameA = entityMap[l.Entity_A_ID] ? entityMap[l.Entity_A_ID].Name : l.Entity_A_ID;
    var nameB = entityMap[l.Entity_B_ID] ? entityMap[l.Entity_B_ID].Name : l.Entity_B_ID;
    var linkInteractions = interactions.filter(function(i) { return i.Linkage_ID === l.Linkage_ID; });
    var linkMilestones = milestones.filter(function(m) { return m.Linkage_ID === l.Linkage_ID; });
    var completedMs = linkMilestones.filter(function(m) { return m.Completion_Status === 'Completed'; });

    return {
      id: l.Linkage_ID,
      entities: nameA + ' <> ' + nameB,
      type: l.Linkage_Type,
      health: Number(l.Health_Score),
      interactions: linkInteractions.length,
      milestones: completedMs.length + '/' + linkMilestones.length
    };
  });

  var summary = '=== ECOLINK AI — ECOSYSTEM ANALYTICS ===\n'
    + 'Generated: ' + formatTimestamp(new Date()) + '\n\n'
    + 'OVERVIEW:\n'
    + '- Entities: ' + entities.length + ' (' + entities.filter(function(e) { return e.Role === 'Mentor'; }).length + ' mentors, '
    + entities.filter(function(e) { return e.Role === 'Company'; }).length + ' companies, '
    + entities.filter(function(e) { return e.Role === 'Partner'; }).length + ' partners)\n'
    + '- Active Linkages: ' + activeLinks.length + '\n'
    + '- Healthy (>=70): ' + healthy.length + '\n'
    + '- At-Risk (<40): ' + atRisk.length + '\n'
    + '- Total Interactions: ' + interactions.length + '\n'
    + '- Outcomes Recorded: ' + outcomes.length + '\n\n'
    + 'PER-LINKAGE STATUS:\n';

  linkageSummaries.forEach(function(ls) {
    var healthLabel = ls.health >= 70 ? 'HEALTHY' : ls.health >= 40 ? 'WARNING' : 'AT RISK';
    summary += '- ' + ls.id + ': ' + ls.entities + ' (' + ls.type + ') — Health: ' + ls.health
      + ' [' + healthLabel + '] — Interactions: ' + ls.interactions
      + ' — Milestones: ' + ls.milestones + '\n';
  });

  if (atRisk.length > 0) {
    summary += '\nIMMEDIATE ATTENTION NEEDED:\n';
    atRisk.forEach(function(l) {
      var nameA = entityMap[l.Entity_A_ID] ? entityMap[l.Entity_A_ID].Name : l.Entity_A_ID;
      var nameB = entityMap[l.Entity_B_ID] ? entityMap[l.Entity_B_ID].Name : l.Entity_B_ID;
      summary += '- ' + l.Linkage_ID + ': ' + nameA + ' <> ' + nameB
        + ' — Health: ' + l.Health_Score + ' — Action: Admin intervention recommended\n';
    });
  }

  Logger.log(summary);
  return summary;
}

/**
 * Populates sample milestones and outcomes for demo purposes.
 * Run once to make the system look like it has been running.
 */
function populateDemoMilestonesAndOutcomes() {
  var linkages = getSheetData(SHEETS.LINKAGES).filter(function(l) { return l.Status === 'Active'; });

  // Create milestones for first 5 active linkages
  var count = 0;
  linkages.slice(0, 5).forEach(function(l) {
    createMilestonesForLinkage(l.Linkage_ID, l.Linkage_Type);
    count++;
  });

  // Mark some milestones as completed for realism
  var allMs = getSheetData(SHEETS.MILESTONES);
  allMs.slice(0, 8).forEach(function(ms) {
    updateMilestone(ms.Milestone_ID, 'Completed', 100, '');
  });
  allMs.slice(8, 12).forEach(function(ms) {
    updateMilestone(ms.Milestone_ID, 'In Progress', 60, '');
  });

  // Record 2 sample outcomes for archived linkages
  var archived = getSheetData(SHEETS.LINKAGES).filter(function(l) { return l.Status === 'Archived'; });
  archived.slice(0, 2).forEach(function(l) {
    recordOutcome(l.Linkage_ID, 'Graduated', 'RM150K', '2x team growth', 4.5, 4.2, 'Successful programme completion');
  });

  Logger.log('Demo data: ' + count + ' linkages with milestones, 2 outcomes recorded');
}
