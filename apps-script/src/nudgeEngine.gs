/**
 * EcoLink AI — Nudge Engine
 *
 * Monitors relationship health and sends automated check-in
 * reminders to prevent linkages from going dormant.
 */

const DORMANT_THRESHOLD_DAYS = 30;

/**
 * Main entry: checks all active linkages and sends nudges for dormant ones.
 */
function runNudgeEngine() {
  const linkages = getSheetData(SHEETS.LINKAGES).filter(l => l.Status === 'Active');
  const entities = getSheetData(SHEETS.ENTITIES);
  const entityMap = {};
  entities.forEach(e => entityMap[e.Entity_ID] = e);

  const now = new Date();
  let nudgeCount = 0;

  linkages.forEach(linkage => {
    const lastInteraction = new Date(linkage.Last_Interaction_Date);
    const daysSince = (now - lastInteraction) / (1000 * 60 * 60 * 24);

    if (daysSince >= DORMANT_THRESHOLD_DAYS) {
      const entityA = entityMap[linkage.Entity_A_ID];
      const entityB = entityMap[linkage.Entity_B_ID];

      if (!entityA || !entityB) return;

      sendNudgeEmail(entityA, entityB, linkage, Math.round(daysSince));
      nudgeCount++;
    }
  });

  Logger.log(`Nudge engine complete. Sent ${nudgeCount} nudge(s).`);
}

/**
 * Sends a check-in nudge email to both entities in a dormant linkage.
 */
function sendNudgeEmail(entityA, entityB, linkage, daysSince) {
  const subject = `EcoLink: Time to reconnect — ${entityA.Name} & ${entityB.Name}`;

  const bodyA = buildNudgeBody(entityA.Name, entityB.Name, linkage.Linkage_Type, daysSince);
  const bodyB = buildNudgeBody(entityB.Name, entityA.Name, linkage.Linkage_Type, daysSince);

  MailApp.sendEmail({
    to: entityA.Email,
    subject: subject,
    htmlBody: bodyA
  });

  MailApp.sendEmail({
    to: entityB.Email,
    subject: subject,
    htmlBody: bodyB
  });
}

/**
 * Builds the HTML body for a nudge email.
 */
function buildNudgeBody(recipientName, partnerName, linkageType, daysSince) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">Time to Reconnect</h2>
      <p>Hi ${recipientName},</p>
      <p>It's been <strong>${daysSince} days</strong> since your last interaction with
         <strong>${partnerName}</strong> in your <strong>${linkageType}</strong> relationship.</p>
      <p>Consistent engagement leads to stronger outcomes. Consider scheduling a quick
         check-in to keep the momentum going.</p>
      <div style="margin: 20px 0; padding: 15px; background: #f0f4ff; border-radius: 8px;">
        <strong>Quick actions:</strong>
        <ul>
          <li>Schedule a 15-minute catch-up call</li>
          <li>Share a relevant article or resource</li>
          <li>Send a brief progress update</li>
        </ul>
      </div>
      <p style="color: #666; font-size: 12px;">
        This is an automated reminder from EcoLink AI to help maintain healthy ecosystem relationships.
      </p>
    </div>
  `;
}
