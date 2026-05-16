# EcoLink AI — System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ECOLINK AI SYSTEM                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ADMIN (AppSheet)          WEB APP (ecolink-erm.web.app)            │
│  ├── Dashboard             ├── Analytics Dashboard (/)              │
│  ├── Active Linkages       ├── Entity Directory (/entities)         │
│  ├── Entities Directory    ├── Linkages (/linkages)                 │
│  ├── Activity              ├── Linkage Detail (/linkages/:id)       │
│  ├── Pending Approval      ├── AI Matching (/ai-match)              │
│  ├── Nudged Log            └── Interactions (/interactions)         │
│  └── Mentor Overload                                                │
│            │                          │                             │
│            └──────────────┬───────────┘                             │
│                           │                                         │
│                    GOOGLE SHEETS (Database)                         │
│          Entities | Linkages | Interactions | Nudge_Log             │
│          Pending_Nudges | Pending_Linkage_Approvals | Admins        │
│                           │                                         │
│         ┌─────────────────┼──────────────────┐                     │
│         │                 │                  │                     │
│  GMAIL API          CALENDAR API      CLOUD FUNCTION               │
│  (Person B)         (Person B)        gemini-matcher                │
│  Auto-detect        Auto-detect       (Person D)                    │
│  email threads      meetings          ├── Reads Entities sheet      │
│  → Interactions     → Interactions    ├── Calls Gemini 2.0-flash    │
│    tab                tab             └── Writes to                 │
│                                       Pending_Linkage_Approvals     │
│                                                                     │
│  APPS SCRIPT — Nudge Engine (Person C)                              │
│  ├── Daily trigger: checks Linkages for dormancy (30+ days)         │
│  ├── Calls Gemini to write personalised email body                  │
│  ├── Writes to Pending_Nudges (awaits admin approval)               │
│  └── On approval: sends email via Gmail API, logs to Nudge_Log      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow — AI Matching Pipeline

```
1. Admin adds entity via AppSheet (+ Add)
         ↓
2. New row appears in Entities sheet (Entity_ID auto-generated)
         ↓
3. Admin triggers match: POST to Cloud Function (gemini-matcher)
   Body: { entityId: "ENT-C01", matchType: "Mentorship" }
         ↓
4. Cloud Function reads ALL Entities from Sheets
         ↓
5. Gemini 2.0-flash scores all candidates → returns top 3
   [ { entityId, name, score, reason }, ... ]
         ↓
6. Cloud Function writes results to Pending_Linkage_Approvals sheet
         ↓
7. Admin sees results in AppSheet "Pending Approval" view
   (For Entity | Suggested Match | Score | Reason | Approve ✓ | Reject ✗)
         ↓
8. Admin approves → new row created in Linkages sheet
         ↓
9. Linkage appears in Active Linkages view with health score
```

---

## Data Flow — Engagement Tracking

```
Gmail API (Person B — Apps Script)
  Scans sent/received emails between entity email addresses
         ↓
  Writes to Interactions tab:
  Interaction_ID | Linkage_ID | Interaction_Type=Email | Date | Summary
         ↓
  Updates Linkages.Last_Interaction_Date

Google Calendar API (Person B — Apps Script)
  Scans calendar events shared between entity accounts
         ↓
  Writes to Interactions tab:
  Interaction_ID | Linkage_ID | Interaction_Type=Meeting | Date | Summary
         ↓
  Updates Linkages.Last_Interaction_Date

Health Score = f(Last_Interaction_Date, Interaction_Frequency)
  🟢 70–100  |  🟡 40–69  |  🔴 0–39
```

---

## Data Flow — Nudge Engine

```
Apps Script — daily time trigger (Person C)
         ↓
Reads all Linkages where:
  Days_Since_Last_Interaction > 30 AND Status = "Active"
         ↓
For each dormant linkage:
  Calls Gemini → generates personalised HTML email body
         ↓
Writes to Pending_Nudges:
  Pending_ID | Linkage_ID | Recipient_Email | Days_Since |
  AI_Used | Body | Approved=FALSE | Status=DRY_RUN
         ↓
Admin reviews in AppSheet → clicks Approve
         ↓
Apps Script sends email via Gmail API
         ↓
Updates Pending_Nudges.Status = SENT_APPROVED
Writes to Nudge_Log audit trail
```

---

## Google Sheets Schema

### Entities
```
Entity_ID | Name | Role | Email | Industry_Tags | Expertise_Needs | Status
```
- `Role`: Mentor | Company | Partner | Admin
- `Status`: Active | Archived

### Linkages
```
Linkage_ID | Entity_A_ID | Entity_B_ID | Linkage_Type |
Start_Date | Last_Interaction_Date | Health_Score |
Health_Status | Status | Outcome_Status
```
- `Linkage_Type`: Mentorship | Investment | Partnership
- `Health_Status`: Healthy | At Risk | Dormant
- `Status`: Active | Archived
- `Outcome_Status`: Funded | Graduated | Pivoted | Stalled | Churned | Ongoing

### Interactions
```
Interaction_ID | Linkage_ID | Interaction_Type | Date | Summary
```
- `Interaction_Type`: Email | Meeting

### Nudge_Log
```
Log_ID | Timestamp | Linkage_ID | Recipient_Email |
Days_Since | AI_Used | Status | Error
```
- `Status`: DRY_RUN | Sent | SENT_APPROVED

### Pending_Nudges
```
Pending_ID | Timestamp | Linkage_ID | Recipient_Email |
Recipient_Name | Partner_Name | Days_Since | AI_Used |
Body | Approved | Status | Error
```

### Pending_Linkage_Approvals
```
Approval_ID | Source_Entity_ID | Recommended_Entity_ID |
Score | Reason | Status
```
- `Status`: Pending | Approved | Rejected

### Admins
```
Admin_ID | Email | Name | Role
```

---

## Cloud Function — gemini-matcher

**Endpoint:** POST (Google Cloud Functions)
**File:** `cloud-functions/gemini-matcher/index.js`

**Request:**
```json
{ "entityId": "ENT-C01", "matchType": "Mentorship" }
```

**Response:**
```json
{
  "matches": [
    { "entityId": "ENT-M03", "name": "Danial Syafiq", "score": 0.95, "reason": "..." },
    { "entityId": "ENT-M07", "name": "Nur Aisyah", "score": 0.88, "reason": "..." },
    { "entityId": "ENT-M01", "name": "Tan Wei Lin", "score": 0.81, "reason": "..." }
  ]
}
```

**Environment variables required:**
```
GEMINI_API_KEY=...
SPREADSHEET_ID=...
```

---

## AppSheet Configuration Summary

| Component | Count | Details |
|-----------|:-----:|---------|
| Data tables | 7 | Entities, Linkages, Interactions, Nudge_Log, Pending_Nudges, Pending_Linkage_Approvals, Admins |
| Slices | 5 | Mentor Overload, Linkages Health_Score >0, Status Active, Pending Approval Slice, Pending_Nudges_Slice |
| Views (primary nav) | 6 | Dashboard, Active Linkages, Entities Directory, Interactions, Pending Approval, Nudged Log |
| Format rules | 16 | Entities (3), Linkages (3), Nudge_Log (3), Pending_Linkage_Approvals (5), Pending_Nudges (2) |
| Actions | 26 | Add/Edit/Delete on all tables + Log Interaction, Approve, Reject, Compose Email |

---

*EcoLink AI | MyHack 2026*
