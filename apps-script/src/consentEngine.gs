/**
 * EcoLink AI — Consent Engine
 *
 * Handles the email consent flow between companies and mentors
 * after AI matching. Implements Phase 2 and Phase 3 of the pipeline.
 */

var MAX_ACTIVE_MENTEES = 3;
var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyn3WDkU66HuKBhyEjOius7aa4LnCd8lLjQb5ABjn8S7mrLm5z2fVw8EgjYYjScOtRlcA/exec';

/**
 * Builds a clickable consent URL for email buttons.
 */
function getConsentUrl(matchId, responder, decision) {
  return WEB_APP_URL + '?action=consent&matchId=' + encodeURIComponent(matchId)
    + '&responder=' + encodeURIComponent(responder)
    + '&decision=' + encodeURIComponent(decision);
}

/**
 * Creates Match_History sheet with proper headers if it doesn't exist.
 */
function setupMatchHistorySheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEETS.MATCH_HISTORY);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.MATCH_HISTORY);
  }
  var headers = [
    'Match_ID', 'Company_ID', 'Mentor_ID', 'Linkage_Type',
    'Match_Score', 'Match_Reason',
    'Company_Decision', 'Mentor_Decision', 'Reject_Reason',
    'Final_Status', 'Conflict_Flag', 'Created_At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  Logger.log('Match_History sheet ready with ' + headers.length + ' columns');
}

/**
 * Sends consent emails to both the company and the mentor.
 * Creates a Match_History record with status PENDING.
 *
 * @param {string} companyId - Entity_ID of the company
 * @param {string} mentorId - Entity_ID of the mentor
 * @param {number} matchScore - AI confidence score (0-1)
 * @param {string} matchReason - AI explanation for the match
 * @param {string} linkageType - Mentorship, Partnership, or Investment
 * @returns {{ matchId, status }}
 */
function sendConsentEmails(companyId, mentorId, matchScore, matchReason, linkageType) {
  var entities = getSheetData(SHEETS.ENTITIES);
  var entityMap = {};
  entities.forEach(function(e) { entityMap[e.Entity_ID] = e; });

  var company = entityMap[companyId];
  var mentor = entityMap[mentorId];

  if (!company) return { error: 'Company not found: ' + companyId };
  if (!mentor) return { error: 'Mentor not found: ' + mentorId };

  var matchId = 'MATCH-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  var scorePercent = Math.round((matchScore || 0) * 100);
  var timestamp = formatTimestamp(new Date());

  // Write to Match_History
  appendRow(SHEETS.MATCH_HISTORY, [
    matchId, companyId, mentorId, linkageType || 'Mentorship',
    scorePercent, matchReason || '',
    'PENDING', 'PENDING', '',
    'AWAITING_CONSENT', '', timestamp
  ]);

  // Send email to company
  var companySubject = 'EcoLink AI: Mentor match ready for your review';
  var companyBody = buildConsentEmail(
    company.Name, mentor.Name, mentor.Role,
    mentor.Industry_Tags || '', mentor.Expertise_Needs || '',
    scorePercent, matchReason || '', linkageType,
    'company', matchId
  );

  if (isValidEmail(company.Email)) {
    MailApp.sendEmail({ to: company.Email, subject: companySubject, htmlBody: companyBody });
  }

  // Send email to mentor
  var mentorSubject = 'EcoLink AI: New ' + (linkageType || 'mentorship') + ' request';
  var mentorBody = buildConsentEmail(
    mentor.Name, company.Name, company.Role,
    company.Industry_Tags || '', company.Expertise_Needs || '',
    scorePercent, matchReason || '', linkageType,
    'mentor', matchId
  );

  if (isValidEmail(mentor.Email)) {
    MailApp.sendEmail({ to: mentor.Email, subject: mentorSubject, htmlBody: mentorBody });
  }

  Logger.log('Consent emails sent for ' + matchId + ': ' + company.Name + ' <> ' + mentor.Name);
  return { matchId: matchId, status: 'AWAITING_CONSENT', companyName: company.Name, mentorName: mentor.Name };
}

/**
 * Processes a consent response from either party.
 *
 * @param {string} matchId - Match_History ID
 * @param {string} responder - 'company' or 'mentor'
 * @param {string} decision - 'ACCEPTED' or 'DECLINED'
 * @param {string} reason - Decline reason (if declined)
 * @returns {{ matchId, status, linkageId? }}
 */
function processConsentResponse(matchId, responder, decision, reason) {
  var column = responder === 'company' ? 'Company_Decision' : 'Mentor_Decision';
  updateCell(SHEETS.MATCH_HISTORY, 'Match_ID', matchId, column, decision);

  if (decision === 'DECLINED') {
    updateCell(SHEETS.MATCH_HISTORY, 'Match_ID', matchId, 'Reject_Reason', reason || 'No reason given');
    updateCell(SHEETS.MATCH_HISTORY, 'Match_ID', matchId, 'Final_Status', 'DECLINED_BY_' + responder.toUpperCase());
    Logger.log(matchId + ': declined by ' + responder + ' — ' + reason);
    return { matchId: matchId, status: 'DECLINED', declinedBy: responder, reason: reason };
  }

  // Check if both have now accepted
  var matches = getSheetData(SHEETS.MATCH_HISTORY);
  var match = matches.filter(function(m) { return m.Match_ID === matchId; })[0];
  if (!match) return { error: 'Match not found: ' + matchId };

  if (match.Company_Decision === 'ACCEPTED' && match.Mentor_Decision === 'ACCEPTED') {
    return autoApproveMatch(matchId, match);
  }

  return { matchId: matchId, status: 'WAITING_FOR_OTHER_PARTY' };
}

/**
 * Auto-approves a match when both parties have consented.
 * Checks for conflicts and mentor overload before approval.
 *
 * @param {string} matchId
 * @param {object} match - Match_History row
 * @returns {{ matchId, status, linkageId? }}
 */
function autoApproveMatch(matchId, match) {
  var conflicts = [];

  // Check mentor overload
  var linkages = getSheetData(SHEETS.LINKAGES);
  var activeMentorLinks = linkages.filter(function(l) {
    return (l.Entity_A_ID === match.Mentor_ID || l.Entity_B_ID === match.Mentor_ID)
      && l.Status === 'Active';
  });

  if (activeMentorLinks.length >= MAX_ACTIVE_MENTEES) {
    conflicts.push('MENTOR_OVERLOAD: ' + activeMentorLinks.length + ' active linkages (max ' + MAX_ACTIVE_MENTEES + ')');
  }

  // Check duplicate linkage
  var duplicateLink = linkages.filter(function(l) {
    return ((l.Entity_A_ID === match.Company_ID && l.Entity_B_ID === match.Mentor_ID) ||
            (l.Entity_A_ID === match.Mentor_ID && l.Entity_B_ID === match.Company_ID))
      && l.Status === 'Active';
  });

  if (duplicateLink.length > 0) {
    conflicts.push('DUPLICATE_LINKAGE: Active linkage already exists');
  }

  if (conflicts.length > 0) {
    updateCell(SHEETS.MATCH_HISTORY, 'Match_ID', matchId, 'Conflict_Flag', conflicts.join('; '));
    updateCell(SHEETS.MATCH_HISTORY, 'Match_ID', matchId, 'Final_Status', 'NEEDS_ADMIN_REVIEW');
    Logger.log(matchId + ': flagged for admin — ' + conflicts.join('; '));
    return { matchId: matchId, status: 'NEEDS_ADMIN_REVIEW', conflicts: conflicts };
  }

  // All clear — create the linkage
  var linkageId = 'LNK-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  var today = formatDate(new Date());

  appendRow(SHEETS.LINKAGES, [
    linkageId,
    match.Mentor_ID,
    match.Company_ID,
    match.Linkage_Type || 'Mentorship',
    today,
    today,
    100,
    'Healthy',
    'Active'
  ]);

  updateCell(SHEETS.MATCH_HISTORY, 'Match_ID', matchId, 'Final_Status', 'APPROVED');

  // Phase 4: Auto-create milestones for the new linkage
  try { createMilestonesForLinkage(linkageId, match.Linkage_Type || 'Mentorship'); } catch (e) {
    Logger.log('Milestone creation skipped: ' + e.message);
  }

  // Send confirmation emails
  sendConfirmationEmails(match.Company_ID, match.Mentor_ID, linkageId, match.Linkage_Type);

  Logger.log(matchId + ': approved → linkage ' + linkageId + ' created with milestones');
  return { matchId: matchId, status: 'APPROVED', linkageId: linkageId };
}

/**
 * Sends confirmation emails to both parties and admin after approval.
 */
function sendConfirmationEmails(companyId, mentorId, linkageId, linkageType) {
  var entities = getSheetData(SHEETS.ENTITIES);
  var entityMap = {};
  entities.forEach(function(e) { entityMap[e.Entity_ID] = e; });

  var company = entityMap[companyId];
  var mentor = entityMap[mentorId];
  if (!company || !mentor) return;

  // Email to company
  if (isValidEmail(company.Email)) {
    MailApp.sendEmail({
      to: company.Email,
      subject: 'EcoLink AI: Your mentor has been confirmed!',
      htmlBody: buildConfirmationBody(company.Name, mentor.Name, linkageType, linkageId, 'company')
    });
  }

  // Email to mentor
  if (isValidEmail(mentor.Email)) {
    MailApp.sendEmail({
      to: mentor.Email,
      subject: 'EcoLink AI: New mentee confirmed!',
      htmlBody: buildConfirmationBody(mentor.Name, company.Name, linkageType, linkageId, 'mentor')
    });
  }
}

/**
 * Builds the HTML consent request email.
 */
function buildConsentEmail(recipientName, partnerName, partnerRole, partnerTags, partnerNeeds, scorePercent, reason, linkageType, recipientType, matchId) {
  var actionLabel = recipientType === 'company'
    ? 'proceed with this mentor'
    : 'mentor this company';

  return '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">'
    + '<div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 8px; color: white; margin-bottom: 20px;">'
    + '<h2 style="margin: 0 0 4px 0;">EcoLink AI</h2>'
    + '<p style="margin: 0; opacity: 0.9; font-size: 14px;">' + (linkageType || 'Mentorship') + ' Match Request</p>'
    + '</div>'
    + '<p>Hi ' + recipientName + ',</p>'
    + '<p>We have found a strong match for you:</p>'
    + '<div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 16px 0;">'
    + '<p style="margin: 0 0 8px 0;"><strong>' + partnerName + '</strong> (' + partnerRole + ')</p>'
    + '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">' + partnerTags + '</p>'
    + '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">' + partnerNeeds + '</p>'
    + '<div style="background: #f0fdf4; padding: 12px; border-radius: 6px; margin-top: 12px;">'
    + '<p style="margin: 0; font-size: 13px;"><strong>Match Score: ' + scorePercent + '%</strong></p>'
    + '<p style="margin: 4px 0 0 0; font-size: 13px; color: #374151;">' + reason + '</p>'
    + '</div>'
    + '</div>'
    + '<p>Would you like to ' + actionLabel + '?</p>'
    + '<div style="margin: 20px 0; text-align: center;">'
    + '<a href="' + getConsentUrl(matchId, recipientType, 'ACCEPTED') + '" style="display:inline-block;padding:12px 32px;background:#10b981;color:white;text-decoration:none;border-radius:8px;font-weight:bold;margin-right:12px;">Accept</a>'
    + '<a href="' + getConsentUrl(matchId, recipientType, 'DECLINED') + '" style="display:inline-block;padding:12px 32px;background:#ef4444;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Decline</a>'
    + '</div>'
    + '<p style="color: #9ca3af; font-size: 12px;">Match ID: ' + matchId + '</p>'
    + '<p style="color: #9ca3af; font-size: 12px;">This is an automated message from EcoLink AI.</p>'
    + '</div>';
}

/**
 * Builds the HTML confirmation email after approval.
 */
function buildConfirmationBody(recipientName, partnerName, linkageType, linkageId, recipientType) {
  var roleLabel = recipientType === 'company' ? 'mentor' : 'mentee';

  return '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">'
    + '<div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 8px; color: white; margin-bottom: 20px;">'
    + '<h2 style="margin: 0;">Match Confirmed!</h2>'
    + '</div>'
    + '<p>Hi ' + recipientName + ',</p>'
    + '<p>Great news! Your ' + (linkageType || 'mentorship') + ' ' + roleLabel + ' has been confirmed:</p>'
    + '<div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 16px 0;">'
    + '<p style="margin: 0;"><strong>' + partnerName + '</strong></p>'
    + '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">Linkage ID: ' + linkageId + '</p>'
    + '</div>'
    + '<p><strong>Next steps:</strong></p>'
    + '<ol style="color: #374151; font-size: 14px;">'
    + '<li>Schedule an introductory meeting within 48 hours</li>'
    + '<li>Define your goals for the first 30 days</li>'
    + '<li>Review the programme milestone plan together</li>'
    + '</ol>'
    + '<p style="color: #9ca3af; font-size: 12px;">This is an automated message from EcoLink AI.</p>'
    + '</div>';
}
