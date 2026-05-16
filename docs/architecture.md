# EcoLink AI — System Architecture

## Overview

EcoLink AI is built entirely on the Google ecosystem, using a serverless architecture that connects Google Workspace tools with AI capabilities through Apps Script automation and Cloud Functions.

## High-Level Architecture

```
                    ┌──────────────────┐
                    │   End Users       │
                    │ (Admin, Mentor,   │
                    │  Company, Partner)│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Google AppSheet  │
                    │  (Frontend UI)    │
                    │  - Dashboards     │
                    │  - Entity CRUD    │
                    │  - Approval flows │
                    └────────┬─────────┘
                             │
              ┌──────────────▼──────────────┐
              │     Google Apps Script       │
              │     (Orchestration Layer)    │
              ├─────────────────────────────┤
              │ - Interaction tracker        │
              │ - Health score calculator    │
              │ - Nudge engine              │
              │ - Data validation           │
              └──┬────────┬────────┬────────┘
                 │        │        │
    ┌────────────▼┐  ┌────▼────┐  ┌▼────────────────┐
    │ Gmail API    │  │Calendar │  │ Google Sheets    │
    │ (Email scan) │  │API      │  │ (Relational DB)  │
    └──────────────┘  └─────────┘  │ - Entities       │
                                   │ - Linkages       │
                                   │ - Interactions   │
                                   └─────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │  Google Cloud Function       │
              │  (Gemini Matcher Service)    │
              ├─────────────────────────────┤
              │ - Receives match requests    │
              │ - Queries entity data        │
              │ - Calls Gemini 3.1 API       │
              │ - Returns ranked matches     │
              └─────────────────────────────┘
```

## Data Flow

### 1. Entity Registration
```
Google Form → Apps Script trigger → Validate & write to Entities sheet → Trigger Gemini matching
```

### 2. Interaction Tracking (Passive)
```
Daily cron (Apps Script) → Scan Gmail + Calendar → Match against active Linkages → Log to Interactions sheet → Update health scores
```

### 3. AI Matching
```
New entity / match request → Cloud Function → Build context from Entities sheet → Gemini API prompt → Top 3 matches returned → Surface in AppSheet as pending approvals
```

### 4. Nudge Engine
```
Daily cron → Query Linkages where last_interaction > 30 days → Send templated emails via GmailApp → Alert admins in Google Chat
```

## Database Schema

See [erm_implementation_plan.md](./erm_implementation_plan.md) for detailed table definitions.

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Entities   │       │   Linkages   │       │ Interactions │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ Entity_ID PK │◄──┐   │ Linkage_ID PK│◄──────│Interaction_ID│
│ Name         │   ├───│ Entity_A_ID  │       │ Linkage_ID FK│
│ Role         │   └───│ Entity_B_ID  │       │ Type         │
│ Email        │       │ Linkage_Type │       │ Date         │
│ Industry_Tags│       │ Start_Date   │       │ Summary      │
│ Expertise    │       │ Last_Interact│       └──────────────┘
│ Status       │       │ Health_Score │
└──────────────┘       └──────────────┘
```

## Security Considerations

- All API keys stored in environment variables, never committed
- Apps Script OAuth scopes limited to required APIs only
- AppSheet role-based access controls for data visibility
- Gemini prompts sanitized to prevent injection
