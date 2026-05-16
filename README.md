# EcoLink AI — Ecosystem Relationship Management Platform

> **Build with AI MyHack KL 2026** | Sunway University, May 16–17, 2026

## Problem

Innovation ecosystem platforms still depend on **manual coordination** to verify participants, match mentors, assign companies to programmes, and manage partner linkages. As ecosystems scale, these relationships remain ad hoc, operationally heavy, and impossible to reuse across programmes and geographies.

## Solution

**EcoLink AI** is an AI-powered Ecosystem Relationship Management (ERM) platform that treats ecosystem relationships as **first-class, programmable entities**. It automates the creation, governance, and continuous improvement of linkages between mentors, startups, partners, and programme administrators.

### Key Features

- **Smart Entity Matching** — Gemini-powered semantic matching that recommends optimal mentor-company-partner pairings based on expertise, needs, and historical outcomes
- **Automated Interaction Tracking** — Passive capture of meetings, emails, and engagement signals to maintain a living history of every relationship
- **Relationship Health Monitoring** — Real-time health scores and automated nudges to prevent relationships from going dormant
- **Reusable Linkage Templates** — Relationship patterns that can be defined once and replicated across programmes, cohorts, and regions
- **Role-Based Dashboards** — Tailored views for admins, mentors, companies, and partners

## UN SDG Alignment

- **SDG 9** — Industry, Innovation and Infrastructure
- **SDG 17** — Partnerships for the Goals
- **SDG 8** — Decent Work and Economic Growth

## Tech Stack

| Layer | Technology |
|---|---|
| AI Engine | Gemini 3.1 API via Google AI Studio |
| Database (MVP) | Google Sheets (relational backend) |
| Database (Scale) | Firebase / BigQuery |
| Application UI | Google AppSheet |
| Automation | Google Apps Script (clasp CLI) |
| Cloud Functions | Google Cloud Functions |
| Integrations | Gmail API, Google Calendar API |
| Intake | Google Forms / AppSheet Forms |

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
