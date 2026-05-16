# EcoLink AI — Ecosystem Relationship Management Platform

> **Build with AI MyHack KL 2026** | Sunway University, May 16–17, 2026

## Problem

Innovation ecosystem platforms still depend on **manual coordination** to verify participants, match mentors, assign companies to programmes, and manage partner linkages. As ecosystems scale, these relationships remain ad hoc, operationally heavy, and impossible to reuse across programmes and geographies.

## Solution

**EcoLink AI** is an AI-powered Ecosystem Relationship Management (ERM) platform that treats ecosystem relationships as **first-class, programmable entities**. It automates the creation, governance, and continuous improvement of linkages between mentors, startups, partners, and programme administrators.

### Key Features

- **Self-Service Registration** — Startups, mentors, and partners register via AppSheet form; Entity_ID auto-generated, data written directly to Google Sheets
- **AI Matching** — Gemini 2.0-flash scores all entity pairings and returns top 3 recommendations with personalised reasoning
- **Automated Interaction Tracking** — Passive capture of meetings, emails, and engagement signals to maintain a living history of every relationship
- **Relationship Health Monitoring** — Real-time health scores and automated nudges to prevent relationships from going dormant
- **Reusable Linkage Templates** — Relationship patterns that can be defined once and replicated across programmes, cohorts, and regions
- **Role-Based Dashboards** — Tailored views for admins, mentors, companies, and partners

## UN SDG Alignment

- **SDG 9** — Industry, Innovation and Infrastructure
- **SDG 17** — Partnerships for the Goals
- **SDG 8** — Decent Work and Economic Growth

## Live Links

| System | URL |
|--------|-----|
| Web App (Analytics + AI Matching) | https://ecolink-erm.web.app |
| Admin App — AppSheet (Preview) | https://www.appsheet.com/start/7a6e9f3e-63fb-4367-9c68-50fd03a3f028 |

> **Note:** AppSheet runs in preview mode (free tier). Request an invite from the team to access. The web app is fully public.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AI Matching + Nudges | Gemini 2.0-flash | Profile scoring, match reasoning, personalised email writing |
| Database | Google Sheets (7 tabs) | Live database — transparent, shareable, real-time |
| Engagement Tracking | Gmail API | Auto-detect email exchanges between linked entities |
| Session Detection | Google Calendar API | Auto-detect scheduled meetings |
| Backend Automation | Google Apps Script | Nudge engine, dormancy checks, daily triggers |
| AI Endpoint | Google Cloud Functions | Serverless Gemini matchmaking API |
| Admin UI | Google AppSheet | No-code interface with registration form + match approvals |
| Web Frontend | React + Vite | Analytics dashboard, AI matching UI |
| Hosting | Firebase Hosting | Live at ecolink-erm.web.app |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  AppSheet UI                    │
│         (Role-based dashboards & forms)         │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              Google Apps Script                 │
│    (Automation, sync, triggers, API gateway)    │
├──────────┬───────────┬───────────┬──────────────┤
│ Gmail    │ Calendar  │ Sheets    │ Gemini API   │
│ API      │ API       │ (DB)      │ (AI Engine)  │
└──────────┴───────────┴───────────┴──────────────┘
```

## Project Structure

```
MyHack2026/
├── README.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── architecture.md
│   └── erm_implementation_plan.md
├── apps-script/
│   ├── appsscript.json
│   ├── src/
│   │   ├── main.gs
│   │   ├── interactionTracker.gs
│   │   ├── nudgeEngine.gs
│   │   └── utils.gs
│   └── .clasp.json.example
├── cloud-functions/
│   └── gemini-matcher/
│       ├── index.js
│       ├── package.json
│       └── .env.example
└── assets/
    └── slides/
```

## Getting Started

### Prerequisites

- Google account with Cloud Credits redeemed
- Node.js 18+
- [clasp](https://github.com/google/clasp) CLI installed globally

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lowjinghong29/MyHack2026.git
   cd MyHack2026
   ```

2. **Set up Apps Script**
   ```bash
   cd apps-script
   cp .clasp.json.example .clasp.json
   # Update .clasp.json with your script ID
   clasp login
   clasp push
   ```

3. **Set up Cloud Function**
   ```bash
   cd cloud-functions/gemini-matcher
   cp .env.example .env
   # Add your Gemini API key to .env
   npm install
   ```

4. **Configure Google Sheets**
   - Create a new Google Sheet
   - Set up the three tables: Entities, Linkages, Interactions
   - Connect to AppSheet

## Team

Built at Build with AI MyHack KL 2026, organized by GDG Kuala Lumpur.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
