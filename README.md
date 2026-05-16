# EcoLink AI — Ecosystem Relationship Management Platform

> AI-powered platform that automatically matches startups to mentors, tracks engagement, and gets smarter with every programme run.

**MyHack 2026 | Build with AI KL | Sunway University | 16–17 May 2026**
Organised by GDG Kuala Lumpur | Powered by Google & Cradle Fund

---

## Live Links

| System | URL |
|--------|-----|
| Web App (Analytics + AI Matching) | https://ecolink-erm.web.app |
| Admin App (AppSheet) | https://www.appsheet.com/start/7a6e9f3e-63fb-4367-9c68-50fd03a3f028 |

---

## Problem We Are Solving

Innovation ecosystem platforms like Cradle Fund still depend on manual coordination to match mentors, assign companies to programmes, and manage partner linkages. As ecosystems scale, these relationships are hard to reuse, inconsistent across programmes, and impossible to learn from.

**Design Challenge (MyHack 2026):**
> *How might we design an AI-enabled platform system that treats ecosystem relationships as first-class, programmable entities — so that linkages can be created, managed, reused, and improved automatically across programmes, countries, and ecosystem actors?*

---

## What EcoLink AI Does

| Phase | What Happens | How |
|-------|-------------|-----|
| Register | Startup/mentor/partner added to system | AppSheet form → Google Sheets |
| AI Match | Gemini scores all possible pairings, returns top 3 | Gemini 2.0-flash + Cloud Functions |
| Consent | Admin reviews and approves recommended match | AppSheet Pending Approval view |
| Track | Gmail + Calendar APIs detect every interaction automatically | Gmail API + Google Calendar API |
| Alert | Dormant relationships trigger personalised nudge emails | Apps Script + Gemini |
| Learn | Outcomes fed back into Gemini prompt for future matching | Outcome_Status field → Gemini context |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AI Matching | Gemini 2.0-flash (Google AI Studio) | Profile scoring, match reasoning, nudge email writing |
| Database | Google Sheets | 7-tab live database visible to all team members |
| Engagement Tracking | Gmail API | Auto-detect email interactions between linked entities |
| Session Detection | Google Calendar API | Auto-detect scheduled meetings |
| Backend Automation | Google Apps Script | Nudge engine, dormancy checks, daily triggers |
| AI Endpoint | Google Cloud Functions | Serverless Gemini matchmaking API |
| Admin UI | Google AppSheet | No-code admin interface on top of Google Sheets |
| Web Frontend | React + Vite | Analytics dashboard, AI matching UI, linkage explorer |
| Hosting | Firebase Hosting | Web app at ecolink-erm.web.app |
| Notifications | Gmail API | Automated re-engagement emails |

---

## Google Sheets Database (7 Tabs)

| Tab | Purpose |
|-----|---------|
| `Entities` | All ecosystem actors — Mentor, Company, Partner, Admin |
| `Linkages` | Relationships with health score, type, status, outcome |
| `Interactions` | Email and meeting log per linkage |
| `Nudge_Log` | Audit trail of all nudge engine decisions |
| `Pending_Nudges` | Human-in-the-loop queue for nudge email approval |
| `Pending_Linkage_Approvals` | AI-generated match recommendations awaiting admin approval |
| `Admins` | Access control list |

---

## AppSheet Views

| View | Purpose |
|------|---------|
| Dashboard | 5-panel overview: Active Linkages, Entities, Pending Approval, Activity, Mentor Overload |
| Active Linkages | All relationships with health score colours, outcome status, interaction counts |
| Entities Directory | All ecosystem actors grouped by role with industry tags |
| Activity | Full interaction log (meetings + emails) across all linkages |
| Pending Approval | AI match suggestions with score, reasoning, Approve/Reject buttons |
| Nudged Log | Complete audit trail of nudge emails sent |

---

## Web App Pages (ecolink-erm.web.app)

| Page | Purpose |
|------|---------|
| `/` | Analytics dashboard — KPIs, health distribution, activity feed |
| `/entities` | Entity directory with search and role filters |
| `/linkages` | All relationships with health scores |
| `/linkages/:id` | Single relationship detail — health gauge, interaction timeline |
| `/ai-match` | Select entity + type → Gemini returns top 3 matches with reasoning |
| `/interactions` | Timeline of all emails and meetings |

---

## Health Score System

| Score | Status | Meaning |
|-------|--------|---------|
| 70–100 | 🟢 Healthy | Meeting regularly, both engaged |
| 40–69 | 🟡 At Risk | Sessions slowing down, needs attention |
| 0–39 | 🔴 Dormant | 30+ days no contact → auto-alert triggered |

---

## Repository Structure

```
MyHack2026/
├── apps-script/
│   └── src/
│       └── utils.gs              # Shared utility functions
├── cloud-functions/
│   └── gemini-matcher/
│       ├── index.js              # Gemini matchmaking Cloud Function
│       ├── package.json
│       └── .env.example          # Required env vars: GEMINI_API_KEY, SPREADSHEET_ID
├── docs/
│   ├── architecture.md           # System architecture overview
│   ├── person_a_guide.md         # Platform Lead implementation guide
│   └── submission_guide.md       # Slides, video script, questionnaire answers
├── assets/
│   └── slides/                   # Presentation assets
├── EcoLink_AI_Complete_Pipeline.md  # Full system pipeline documentation
├── team_distribution_plan.md     # Team roles and task breakdown
└── README.md
```

---

## Team

| Person | Role | Responsibilities |
|--------|------|-----------------|
| Person A | Platform Lead | Google Sheets schema, AppSheet UI, all views and format rules |
| Person B | Interaction Logger | Gmail API + Calendar API scanner → Interactions tab |
| Person C | Nudge Engine | Dormancy detection, Gemini email writer, Pending_Nudges flow |
| Person D | AI Matchmaking | Gemini doPost endpoint, Pending_Linkage_Approvals writer |

---

## Environment Variables

For the Cloud Function (`cloud-functions/gemini-matcher/.env`):

```
GEMINI_API_KEY=your_gemini_api_key
SPREADSHEET_ID=your_google_sheet_id
```

---

## Judging Rubric Alignment

| Criterion | Max Pts | How We Address It |
|-----------|:-------:|-------------------|
| Google Technology Integration | 15 | Gemini + Sheets + Gmail API + Calendar API + Apps Script + Cloud Functions + AppSheet + Firebase |
| AI Implementation Quality | 10 | Gemini for matching + nudge writing + learning loop. 3-way consent for ethics. Structured prompts against hallucination. |
| Working Demo & UI/UX | 10 | Live AppSheet + web app. Full pipeline demonstrable in real time. |
| AI Model Performance | 5 | Match accuracy improves per programme via outcome feedback loop |
| Problem-Solution Fit | 15 | Directly solves Cradle Fund's exact problem statement |
| Originality | 10 | Relationships as programmable entities + self-improving flywheel |
| Scalability | 10 | Cloud-native, Google Workspace, works across geographies |
| Deployment Readiness | 5 | Firebase Hosting + AppSheet live. Clear path to production. |

---

*EcoLink AI | MyHack 2026 | GDG Kuala Lumpur*
