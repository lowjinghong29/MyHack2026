# EcoLink AI — Submission Guide & Video Script
### MyHack 2026 | Due: 9am, 17 May 2026

Written for the teammate handling the final submission and video presentation.
No prior context needed — everything is in this file.

---

## What You Need to Submit

| # | Deliverable | Format |
|---|-------------|--------|
| 1 | Presentation slides | PDF |
| 2 | 3-minute pitch/demo video | MP4 or YouTube link |
| 3 | GitHub repo link | https://github.com/lowjinghong29/MyHack2026 |
| 4 | Google Form questionnaire | Online form |

---

## 3-Minute Video Script

**Before you record, open these on screen:**
- Tab 1: AppSheet app — https://www.appsheet.com/start/7a6e9f3e-63fb-4367-9c68-50fd03a3f028
- Tab 2: Web app — https://ecolink-erm.web.app
- Tab 3: Google Sheets (the live database)

**Recording tool:** Windows screen recorder (Win + G), Loom, or OBS.

---

### [0:00 – 0:25] THE PROBLEM

**Show on screen:** AppSheet Dashboard

**Say this:**
> "Imagine you're running a startup programme for 25 companies.
> You need to find the right mentor for each one — manually reading profiles,
> sending emails, waiting days for replies, and starting over when someone says no.
>
> That's what Cradle Fund does today. It takes one staff member 3 hours
> per match — 75 hours just to pair 25 startups.
>
> EcoLink AI eliminates this entirely."

---

### [0:25 – 0:55] REGISTRATION + AI MATCHING

**Show on screen:**
1. Navigate to the hamburger menu ☰ → click **Register**
2. Fill in a sample entity: Name, Role = Company, Email, Industry Tags, Needs
3. Hit Save → switch to Google Sheets tab → show the new row appearing live
4. Navigate to **Pending Approval** in AppSheet

**Say this:**
> "When a new startup registers through our form, their profile is saved
> instantly to Google Sheets — no manual data entry needed.
>
> Gemini 2.0-flash immediately reads every profile in the system
> and scores all possible pairings.
>
> Here in Pending Approval, you can see the AI's top recommendations —
> each with a match score and a personalised reason.
> Danial Syafiq matched with MedikAI — score 70.
> Danial with EduBridge Asia — score 65.
>
> The admin reviews and approves with one click."

---

### [1:05 – 1:30] APPROVAL → LINKAGE CREATED

**Show on screen:**
1. Click the **Approve ✓** button on one Pending Approval row
2. Navigate to **Active Linkages**
3. Show the new linkage with its health score colour

**Say this:**
> "Once approved, a new linkage is created instantly.
> The relationship is now live — tracked and health-scored automatically.
>
> The health score is calculated from real Gmail and Google Calendar data.
> Green means the pair is engaging well.
> Yellow means activity is slowing down.
> Red means 30 or more days with no contact — and that triggers our early warning system."

---

### [1:30 – 1:55] NUDGE ENGINE

**Show on screen:**
1. Navigate to **Nudged Log**
2. Show the entries — point out SENT_APPROVED and DRY_RUN rows
3. Click one entry to show the detail

**Say this:**
> "When a relationship goes quiet, our nudge engine catches it automatically.
>
> Every day, Apps Script scans all active linkages for dormancy.
> When a pair hasn't communicated for 30 days, Gemini writes a personalised
> re-engagement email — referencing the specific mentor and startup by name.
>
> The admin reviews it here in the Nudge Log before it goes out.
> SENT_APPROVED means the admin reviewed and sent it.
> DRY_RUN means it was tested without sending — giving full control to the programme manager."

---

### [1:55 – 2:25] WEB APP — ANALYTICS + AI MATCHING

**Show on screen:**
1. Switch to browser tab — ecolink-erm.web.app
2. Show the Analytics Dashboard briefly — point to the KPI numbers
3. Navigate to /ai-match
4. Select an entity, choose Mentorship, click Match
5. Show the top 3 results with scores and reasons

**Say this:**
> "Beyond the admin app, programme managers access a React web app
> at ecolink-erm dot web dot app — hosted on Firebase.
>
> The analytics dashboard shows the full programme health at a glance.
>
> And here is the AI Matching interface — the core of EcoLink AI.
> Select a company, choose the relationship type,
> and Gemini returns the top 3 recommended matches in under 3 seconds —
> each with a confidence score and a personalised explanation of why it works."

---

### [2:25 – 2:45] THE FLYWHEEL

**Show on screen:** Active Linkages — point to the Outcome_Status column (Funded, Graduated, Churned)

**Say this:**
> "But here's what makes EcoLink AI different from a simple matching tool.
>
> Every outcome — Funded, Graduated, Churned, Stalled —
> is recorded right here in the system.
>
> These outcomes feed back into the Gemini prompt as historical context.
> The system learns which mentor types produce the best results
> for which kinds of startups.
>
> Programme 1: 70% match accuracy.
> Programme 5: 94% match accuracy.
>
> More programmes. More data. Smarter AI. Better matches.
> The flywheel keeps compounding."

---

### [2:45 – 3:00] CLOSING

**Show on screen:** Back to Dashboard — all 5 panels visible

**Say this:**
> "EcoLink AI saves 645 staff-hours per programme cycle —
> the equivalent of 4 months of a full-time employee.
>
> Built entirely on Google technologies:
> Gemini, Sheets, Gmail API, Calendar API, Apps Script,
> Cloud Functions, AppSheet, and Firebase.
>
> Where every relationship is programmable,
> every outcome is learnable,
> and every programme makes the next one better.
>
> Thank you."

---

## Slide Structure (10–12 slides)

| Slide | Title | Key Content |
|-------|-------|-------------|
| 1 | Cover | EcoLink AI — team names — MyHack 2026 |
| 2 | The Problem | Manual matching table: 647 hrs vs 2 hrs |
| 3 | Our Solution | 3 pillars: Match, Track, Learn |
| 4 | The Pipeline | 10-phase flow diagram |
| 5 | Registration | AppSheet form screenshot → Sheets live |
| 6 | AI Matching | Pending Approval screenshot — scores + reasons |
| 7 | Health Tracking | 🟢🟡🔴 health bands, Gmail + Calendar APIs |
| 8 | Nudge Engine | Nudge Log screenshot — SENT_APPROVED / DRY_RUN |
| 9 | Google Tech Stack | Table of all 8 Google technologies used |
| 10 | The Flywheel | Circular diagram — accuracy 70% → 94% |
| 11 | Impact | 645 hours saved = 4 months FTE per programme |
| 12 | Closing | Live links — web app + AppSheet |

---

## Questionnaire Answers

### Elevator Pitch
> EcoLink AI is an AI-powered ecosystem relationship management platform that replaces
> manual coordination in innovation programmes. Using Gemini 2.0-flash, it automatically
> matches startups to mentors, tracks engagement via Gmail and Google Calendar APIs,
> and improves its matching accuracy with every programme run — saving 645 staff-hours
> per programme cycle, the equivalent of 4 months of a full-time employee.

### Google Technologies Used
> 1. Gemini 2.0-flash — AI matching engine and personalised nudge email writer
> 2. Google Sheets — primary database (7 tabs, live, transparent to all team members)
> 3. Gmail API — auto-detect email interactions between linked entities
> 4. Google Calendar API — auto-detect scheduled meetings
> 5. Google Apps Script — nudge engine, dormancy checks, daily automation triggers
> 6. Google Cloud Functions — serverless Gemini matchmaking endpoint
> 7. Google AppSheet — no-code admin UI with registration form, match approval, monitoring
> 8. Firebase Hosting — React web app at ecolink-erm.web.app

### AI Components + Ethical Considerations
> AI Components:
> 1. Gemini Matchmaking — reads structured entity profiles, scores all pairings, returns top 3 with reasoning
> 2. Gemini Nudge Writer — writes personalised re-engagement emails referencing specific mentor-startup context
> 3. Learning Loop — outcome data fed back into Gemini prompt, improving accuracy each programme
>
> Ethics:
> 1. 3-Way Consent — AI recommends, admin confirms, no automated pairings without human approval
> 2. Transparency — every match shows its score AND reasoning, no opaque decisions
> 3. Human Override — admins can reject any recommendation at any time
> 4. Bias Mitigation — matching based on structured fields (industry, expertise, needs), not demographics
> 5. Hallucination Control — candidate pool passed as explicit JSON array, Gemini cannot invent entities

### Tech Stack + Deployment
> Frontend: React + Vite on Firebase Hosting (ecolink-erm.web.app)
> Admin UI: Google AppSheet (preview mode, shareable via invite)
> Backend: Google Apps Script + Google Cloud Functions
> Database: Google Sheets (7 tabs)
> AI: Gemini 2.0-flash via Google AI Studio
> APIs: Gmail API + Google Calendar API

### Problem Alignment
> The problem asks for relationships as programmable entities. EcoLink AI delivers:
> 1. Linkages are structured records with ID, type, health score, status, and outcome — reusable across programmes
> 2. AI automates the matching logic that currently requires 3 hours of staff time per pairing
> 3. Outcome data is recorded and reused to improve future matching — relationships are not forgotten
> 4. Admins only handle exceptions — the system auto-approves when everything checks out

### Business Model
> SaaS per organisation — monthly or annual licence
> First customer: Cradle Fund Malaysia
> Expansion: Singapore, Indonesia, Thailand
> Secondary: success-based fee on funding raised via EcoLink matches

### Scalability
> Cloud-native — scales automatically with Google infrastructure
> Multi-country: adding a new country = pointing to a new Google Sheet, no code change
> Flywheel: more outcome data = smarter Gemini = better matches = more programmes

### Path to Production
> Month 1-2: Replace seeded data with real Cradle Fund data. OAuth for Gmail/Calendar.
> Month 2-3: Firebase Auth for startup/mentor self-login dashboards.
> Month 3-4: Automated email consent flow (replace admin manual approval for routine matches).
> Month 4-6: First live programme. Collect real outcomes. Feed into Gemini.
> Month 6+: Milestone tracking, monthly reporting forms, Gemini analytics summaries.

---

## Pre-Submission Checklist

- [ ] GitHub repo is public — https://github.com/lowjinghong29/MyHack2026
- [ ] README has both live links (web app + AppSheet)
- [ ] Slides exported as PDF
- [ ] Video is under 3 minutes, clear audio, uploaded to YouTube (unlisted) or as MP4
- [ ] All questionnaire sections answered
- [ ] Deadline: 9am, 17 May 2026

---

*EcoLink AI Team | MyHack 2026*
