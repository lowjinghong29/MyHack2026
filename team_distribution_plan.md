# ERM Team Distribution Plan — 4 Persons

## Dependency Note
**Phase 1 is a hard blocker** — the Google Sheet schema and AppSheet setup must exist before Phases 2–4 can run. Person A starts first; B, C, D begin in parallel once the schema sheet is live.

---

## Person A — Platform Lead (Phase 1)
**Goal:** Build the data foundation everyone else depends on.

| Task | Details |
|---|---|
| Create Google Sheet | 3 tabs: `Entities`, `Linkages`, `Interactions` with all columns from the schema |
| Configure AppSheet | Connect Sheet, set data types, configure `Entity_A_ID`/`Entity_B_ID` as References to `Entities` |
| Build AppSheet Views | `Admin Dashboard`, `Active Linkages`, `Entity Directory` |
| Deliverable gate | Share the Sheet URL + AppSheet app link with team; schema must be locked before B/C/D write scripts |

---

## Person B — Interaction History Dev (Phase 2)
**Goal:** Passively log emails and meetings into the `Interactions` table.

| Task | Details |
|---|---|
| `clasp` project init | Set up local Apps Script project, connect to Sheet via Spreadsheet ID |
| Gmail API scanner | Scan email threads; match sender/recipient against active `Linkages` |
| Calendar API scanner | Detect meetings involving both entities of a `Linkage_ID` |
| Interaction logger | Write new rows to `Interactions` tab; update `Last_Interaction_Date` in `Linkages` |
| Daily trigger | Register `ScriptApp.newTrigger` to run the scanner every 24 hours |

---

## Person C — Engagement Nudge Dev (Phase 3)
**Goal:** Automatically alert on dormant relationships.

| Task | Details |
|---|---|
| Dormancy query | Query `Linkages` tab for `Last_Interaction_Date` older than 30 days where `Status = Active` |
| Email nudge | Use `GmailApp.sendEmail` with a templated check-in message to both linked entities |
| Admin webhook | Send a Google Chat webhook alert for admin intervention as an alternative/fallback |
| Cron trigger | Register a daily `ScriptApp.newTrigger` (can share the same trigger file as Person B's project) |
| **Coordinate with B** | Share a common `utils.js` / `sheetHelper.js` for Sheet read/write to avoid duplicated code |

---

## Person D — AI Matchmaking Dev (Phase 4)
**Goal:** Build the Gemini-powered recommendation engine.

| Task | Details |
|---|---|
| Cloud Function / endpoint | Scaffold a Node.js or Python Google Cloud Function (or Apps Script `doPost` endpoint) |
| Gemini API integration | Wire up Google AI Studio API key; call `gemini-pro` with structured prompt |
| Prompt engineering | Pass `Expertise_Needs` of the new entity + JSON dump of `Entities` table; ask for top-3 `Entity_ID` matches with `Match_Reason` |
| Structured output | Parse Gemini JSON response; write "Pending Linkage Approvals" rows to Sheet or AppSheet |
| AppSheet surface | Work with Person A to add a `Pending Approvals` view in AppSheet for admins |

---

## Timeline Overview

```
Day 1–2   [A] ──── Schema + AppSheet setup ────────────────────────────────► (gate)
                                                                                │
Day 3+    [B] ──── Gmail/Calendar scanner + Interaction logger ─────────────►
          [C] ──── Dormancy query + Nudge emails + Webhook ─────────────────►
          [D] ──── Cloud Function + Gemini API + Prompt engineering ────────►

Day N     [A+D] ── AppSheet Pending Approvals view ────────────────────────►
          [B+C] ── Shared utils, trigger registration, integration test ────►
```

---

## Shared Responsibilities (All 4)

- **Integration test:** End-to-end test with dummy entities — simulate an email, verify Interaction row is logged, verify nudge fires at day 31, verify Gemini returns a match.
- **Schema changes:** Any column additions must go through Person A first.
- **Secrets/API keys:** Store `GEMINI_API_KEY` and OAuth tokens in Apps Script `PropertiesService` — never hardcode.
