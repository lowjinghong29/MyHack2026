# EcoLink AI — Submission Guide
### MyHack 2026 | Due: 9am, 17 May 2026

This document is written for the teammate handling the final submission.
No prior context needed — everything you need is in this file.

---

## What You Need to Submit

| # | Deliverable | Format | Status |
|---|-------------|--------|--------|
| 1 | Presentation slides | PDF | ❌ To do |
| 2 | 3-minute pitch/demo video | MP4 or YouTube link | ❌ To do |
| 3 | GitHub repo link | Public URL | ❌ To do |
| 4 | Google Form questionnaire | Online form | ❌ To do |

Do them in this order: **GitHub → Slides → Video → Form**

---

## Task 1 — GitHub Repo (15 minutes)

### Step 1 — Make the repo public
1. Go to `https://github.com/lowjinghong29/MyHack2026`
2. Settings → General → scroll to bottom → **Change visibility** → Public
3. Confirm

### Step 2 — Update the README
Replace the current README.md content with this:

```markdown
# EcoLink AI

> AI-powered Ecosystem Relationship Management Platform
> MyHack 2026 | Build with AI KL | Sunway University | 16–17 May 2026
> Problem statement by Cradle Fund Malaysia | Organised by GDG Kuala Lumpur

## Live Links

| System | Link |
|--------|------|
| Web App (Analytics + AI Matching) | https://ecolink-erm.web.app |
| Admin App (AppSheet) | https://www.appsheet.com/start/7a6e9f3e-63fb-4367-9c68-50fd03a3f028 |

## What EcoLink AI Does

EcoLink AI replaces manual ecosystem coordination with an AI-powered platform
that automatically matches startups to mentors, tracks engagement, and gets
smarter with every programme run.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Matching | Gemini 2.0-flash (Google AI Studio) |
| Database | Google Sheets |
| Engagement Tracking | Gmail API + Google Calendar API |
| Backend | Google Apps Script + Google Cloud Functions |
| Frontend | React + Vite (Firebase Hosting) |
| Admin UI | Google AppSheet |
| Notifications | Gmail API |

## Team

| Person | Role |
|--------|------|
| Person A | Platform Lead — AppSheet + Google Sheets |
| Person B | Interaction Logger — Gmail + Calendar API |
| Person C | Nudge Engine — Dormancy detection + AI emails |
| Person D | AI Matchmaking — Gemini integration |
```

### Step 3 — Commit and push
```
git add README.md
git commit -m "docs: update README for submission"
git push
```

---

## Task 2 — Presentation Slides (2–3 hours)

Use Google Slides or PowerPoint. Export as PDF when done.
**Target: 10–12 slides, under 3 minutes to present.**

---

### Slide 1 — Cover
```
EcoLink AI
AI-Powered Ecosystem Relationship Management

MyHack 2026 | Build with AI KL
Sunway University | 16–17 May 2026
Powered by Google & Cradle Fund

[Team names]
```

---

### Slide 2 — The Problem (30 seconds to present)

**Title:** The Problem with Ecosystem Coordination Today

**Visual:** Two-column comparison table

| Manual (Today) | EcoLink AI |
|----------------|-----------|
| Staff manually match startups to mentors | AI matches in 3 seconds |
| 3–5 days of back-and-forth emails | Automated consent flow |
| Relationships forgotten after each programme | Every outcome is saved and reused |
| No insight into what works | Dashboard shows success patterns |
| Can't scale beyond one team | Cloud-based, works anywhere |

**Speaker note:** "Cradle Fund runs programmes for hundreds of Malaysian startups. But right now, every mentor match is done manually — by a human, from scratch, every single time."

---

### Slide 3 — Our Solution (20 seconds to present)

**Title:** EcoLink AI — Relationships as Programmable Entities

**Visual:** One-line summary in large text, then 3 pillars

> *"We treat ecosystem relationships as first-class, programmable entities — so they can be created, managed, reused, and improved automatically."*

**3 Pillars:**
- 🤖 **Match** — Gemini AI recommends the right mentor in seconds
- 📊 **Track** — Gmail + Calendar APIs monitor engagement automatically
- 🔄 **Learn** — Every outcome makes the next match smarter

---

### Slide 4 — The Pipeline (30 seconds to present)

**Title:** How EcoLink AI Works — 10 Phases

**Visual:** Flow diagram (copy from pipeline doc Section 3)

```
Register → AI Match → Consent → Auto-Approve → Programme Begins
    → Track Sessions → Monitor Growth → Early Warning
        → Measure Success → Record Outcome → AI Learns 🔄
```

**Key message:** "The system handles everything automatically. Admins only step in for exceptions."

---

### Slide 5 — AI Matching in Action (30 seconds to present)

**Title:** Gemini Reads Profiles, Scores Every Match

**Visual:** Screenshot of Pending Approval view in AppSheet
(show the 3 rows with scores 70, 65, 10 and the Reason column)

**Bullets:**
- Gemini 2.0-flash reads all entity profiles
- Scores every possible pairing 0–100
- Returns top 3 matches with personalised reasoning
- Admin approves with one click → Linkage created instantly

---

### Slide 6 — Live Demo Screenshots (30 seconds to present)

**Title:** Built and Running — Live Demo

Use 4 screenshots side by side:
1. **Entities Directory** — registered ecosystem actors
2. **Active Linkages** — health scores, outcome tracking
3. **Pending Approval** — AI match suggestions
4. **Nudge Log** — automated dormancy alerts sent

**Caption:** "All data flows through Google Sheets. Judges can see it updating in real time."

---

### Slide 7 — Engagement Tracking (20 seconds to present)

**Title:** Phase 5 — We Know When a Relationship is Dying

**Visual:** Health score colour bands

```
🟢 HEALTHY  (70–100) — Meeting regularly, both engaged
🟡 AT RISK  (40–69)  — Sessions slowing down
🔴 DORMANT  (0–39)   — 30+ days no contact → Auto-alert sent
```

**Bullets:**
- Gmail API detects email exchanges automatically
- Google Calendar API detects scheduled meetings automatically
- Health score recalculated continuously
- Dormancy alert email sent via Gemini-powered nudge engine

---

### Slide 8 — The Flywheel (20 seconds to present)

**Title:** The More It Runs, The Smarter It Gets

**Visual:** Circular flywheel diagram

```
More programmes → More outcome data
→ Smarter AI matching → Better mentor-startup pairs
→ Higher success rates → More programmes join
→ (repeat) 🔄
```

**Match accuracy over time:**
```
Programme 1:  70%
Programme 2:  78%  📈
Programme 3:  85%  📈
Programme 4:  91%  📈
Programme 5:  94%  🚀
```

---

### Slide 9 — Google Technology (20 seconds to present)

**Title:** Built Entirely on Google Technologies

| Technology | How We Use It |
|-----------|--------------|
| Gemini 2.0-flash | AI matching + personalised nudge emails |
| Google Sheets | Live database — visible to judges in real time |
| Gmail API | Auto-detect email interactions |
| Google Calendar API | Auto-detect scheduled meetings |
| Google Apps Script | Nudge engine + automation backend |
| Google Cloud Functions | Gemini matchmaking endpoint |
| Google AppSheet | Admin UI — no-code, on top of Sheets |
| Firebase Hosting | React web app at ecolink-erm.web.app |

---

### Slide 10 — Time Saved (15 seconds to present)

**Title:** 645 Staff-Hours Saved Per Programme

| Task | Manual | EcoLink AI |
|------|--------|-----------|
| Match startup to mentor | 3 hours | 3 seconds |
| Consent emails | 3–5 days | Automated |
| Track engagement | 400 hours/programme | Automated |
| Identify at-risk pairs | 48 hours | Real-time |
| Outcome reports | 100 hours | Auto-generated |
| **TOTAL** | **~647 hours** | **~2 hours** |

**= 4 months of one full-time staff saved per programme cycle**

---

### Slide 11 — Business Model & Scale (15 seconds to present)

**Title:** Scalable Across Southeast Asia

**Business Model:**
- SaaS — charged per programme cycle or per organisation
- First customer: Cradle Fund Malaysia
- Expansion: Singapore (MAS Fintech), Indonesia (Startup Studio), Thailand (DEPA)

**Why it scales:**
- Cloud-based — no geographic limit
- Google Workspace — tools Cradle already uses
- Flywheel compounds with every programme

---

### Slide 12 — Closing

**Title:** EcoLink AI

> *"Where every relationship is programmable, every outcome is learnable, and every programme makes the next one better."*

**Live links:**
- Web App: `ecolink-erm.web.app`
- Admin App: AppSheet (demo account: `laiyokeyau@gmail.com`)
- GitHub: `github.com/lowjinghong29/MyHack2026`

---

## Task 3 — 3-Minute Video Script

**Setup before recording:**
- Open AppSheet on one screen
- Open `ecolink-erm.web.app` on the second screen
- Have Google Sheets open in a third tab (to show live data)
- Record screen + voiceover (use OBS, Loom, or built-in screen recorder)
- Total runtime: 3 minutes exactly

---

### [0:00–0:30] Opening — The Problem

**What to show on screen:** Slide 2 (the comparison table)

**Script:**
> "Cradle Fund runs programmes for hundreds of Malaysian startups every year.
> But today, every single mentor match is done manually — a staff member reads
> profiles, sends emails, waits days for replies, and starts over if someone says no.
>
> This creates bottlenecks. Relationships are forgotten after each programme.
> And there's no way to learn from what worked.
>
> EcoLink AI fixes this."

---

### [0:30–1:00] Solution Overview

**What to show on screen:** Switch to AppSheet Dashboard

**Script:**
> "EcoLink AI is an AI-powered platform that treats ecosystem relationships as
> first-class, programmable entities.
>
> This is our admin dashboard — built on Google AppSheet, connected live to
> Google Sheets. You can see Active Linkages, the Entities Directory, AI-generated
> match recommendations, and the activity log — all in one place.
>
> Let me walk you through the full pipeline."

---

### [1:00–1:25] Registration + AI Matching

**What to show on screen:**
1. Click Entities Directory → show mentor and company list
2. Click "+ Add" → show the registration form fields briefly
3. Click Pending Approval view

**Script:**
> "When a new startup registers, their profile is added directly to Google Sheets.
> Gemini 2.0-flash immediately reads every entity profile and scores all possible pairings.
>
> Here in Pending Approval, you can see Gemini's top recommendations —
> each with a match score and a personalised reason explaining why it's a good fit.
> Danial Syafiq and MedikAI Sdn Bhd — score 70. Danial and EduBridge Asia — score 65.
>
> The admin reviews and approves with one click."

---

### [1:25–1:50] Approval → Linkage Created

**What to show on screen:**
1. Click the approve (✓) button on one of the Pending Approval rows
2. Navigate to Active Linkages
3. Show the new linkage appearing with health score

**Script:**
> "Once approved, the system instantly creates a new linkage in the Active Linkages view.
> The relationship is now live — tracked, monitored, and health-scored automatically.
>
> The health score is calculated from real Gmail and Google Calendar data —
> how recently they communicated, how often they meet.
> Green means healthy. Yellow is at risk. Red means dormant — 30 or more days with no contact."

---

### [1:50–2:15] Early Warning + Nudge Engine

**What to show on screen:**
1. Navigate to Nudged Log
2. Show the SENT_APPROVED and DRY_RUN entries
3. Briefly show a log entry detail

**Script:**
> "When a relationship goes quiet, our nudge engine catches it automatically.
>
> Here in the Nudge Log, you can see emails that were sent to re-engage dormant pairs —
> some with Gemini-written personalised content, some approved by the admin before sending.
>
> Status SENT_APPROVED means the admin reviewed and sent it.
> DRY_RUN means it was tested without sending — giving admins full control."

---

### [2:15–2:40] Web App — Analytics + AI Matching

**What to show on screen:**
1. Switch to browser tab with `ecolink-erm.web.app`
2. Show the Analytics Dashboard briefly
3. Navigate to `/ai-match` — select an entity and run a match

**Script:**
> "Beyond AppSheet, we have a React web app at ecolink-erm.web.app —
> built with Firebase Hosting — where programme managers see the full analytics view.
>
> And here is the AI Matching interface. Select a company, choose the relationship type,
> and Gemini returns the top 3 recommended matches with scores and personalised reasoning —
> in under 3 seconds."

---

### [2:40–3:00] Flywheel + Closing

**What to show on screen:** Slide 8 (flywheel) or stay on web app

**Script:**
> "But the real power is what happens over time.
> Every outcome — funded, graduated, churned — is recorded and fed back into Gemini.
> The system learns which mentor types produce the best results for which startups.
> Every programme makes the next one smarter.
>
> More programmes. More data. Smarter AI. Better matches. Higher success rates.
> The flywheel keeps compounding.
>
> EcoLink AI — where every relationship is programmable, every outcome is learnable,
> and every programme makes the next one better."

---

## Task 4 — Google Form Questionnaire Answers

Copy-paste these answers directly into the submission form.

---

### Elevator Pitch (2–3 sentences)

> EcoLink AI is an AI-powered ecosystem relationship management platform that replaces
> manual coordination in innovation programmes. Using Gemini 2.0-flash, it automatically
> matches startups to mentors, tracks engagement via Gmail and Google Calendar APIs,
> and improves its matching accuracy with every programme run. It saves approximately
> 645 staff-hours per programme cycle — the equivalent of 4 months of a full-time employee.

---

### Google Technologies Used + Justification

> We use 8 Google technologies, each serving a critical function:
>
> 1. **Gemini 2.0-flash** — Core AI matching engine. Reads entity profiles, scores all
>    possible pairings, and generates personalised match reasoning. Also powers the nudge
>    engine, writing personalised re-engagement emails for dormant relationships.
>
> 2. **Google Sheets** — Primary database. All entities, linkages, interactions, and
>    outcomes are stored in Sheets. Chosen because it is transparent, shareable, and
>    already used by organisations like Cradle Fund.
>
> 3. **Gmail API** — Automatic engagement detection. Scans email exchanges between
>    mentor-startup pairs to detect communication frequency and recency, feeding the
>    health score calculation.
>
> 4. **Google Calendar API** — Automatic session detection. Detects scheduled meetings
>    between paired entities without requiring manual log entries.
>
> 5. **Google Apps Script** — Backend automation. Runs the nudge engine, dormancy checks,
>    and data triggers on a scheduled basis.
>
> 6. **Google Cloud Functions** — Gemini matchmaking endpoint. Hosts the serverless
>    function that calls the Gemini API and writes results to Google Sheets.
>
> 7. **Google AppSheet** — Admin UI. No-code interface for programme managers to manage
>    entities, review AI recommendations, approve matches, and monitor programme health.
>
> 8. **Firebase Hosting** — React web app at ecolink-erm.web.app. Hosts the analytics
>    dashboard, entity directory, linkage viewer, and AI matching interface.

---

### AI Components + Ethical Considerations

> **AI Components:**
>
> 1. **Gemini Matchmaking** — Gemini 2.0-flash reads structured entity profiles (role,
>    industry, expertise, needs) and scores all candidate pairings. It returns the top 3
>    matches with a confidence score and a 1–2 sentence personalised explanation for
>    each recommendation.
>
> 2. **Gemini Nudge Writer** — When a relationship becomes dormant (30+ days no contact),
>    Gemini writes a personalised re-engagement email referencing the specific mentor-startup
>    context, rather than sending a generic reminder.
>
> 3. **Learning Loop** — Outcome data (Funded / Graduated / Churned / Stalled) is fed back
>    into the Gemini prompt as historical context, improving match accuracy over successive
>    programme runs.
>
> **Ethical Considerations:**
>
> 1. **3-Way Consent** — No linkage is created without explicit approval. The AI recommends,
>    but a human admin confirms. This prevents automated pairings that either party did not
>    agree to.
>
> 2. **Transparency** — Every match shows its score AND its reasoning. Users always know
>    why the AI made a recommendation, preventing blind trust in opaque outputs.
>
> 3. **Human Override** — Admins can reject any AI recommendation at any time. The system
>    is designed so the AI handles routine cases and humans handle exceptions — not the
>    reverse.
>
> 4. **Bias Mitigation** — Matching is based on structured fields (industry, expertise,
>    needs) rather than free-text or demographic data, reducing the risk of subjective
>    bias in recommendations.
>
> 5. **Hallucination Control** — Gemini is given a structured prompt with real data from
>    Google Sheets. It cannot invent entities that do not exist — the candidate pool is
>    explicitly passed as a JSON array.

---

### Tech Stack + Deployment Approach

> **Tech Stack:**
> - AI: Gemini 2.0-flash via Google AI Studio
> - Database: Google Sheets (7 tabs: Entities, Linkages, Interactions, Nudge_Log,
>   Pending_Nudges, Pending_Linkage_Approvals, Admins)
> - Backend: Google Apps Script (nudge engine, triggers) +
>   Google Cloud Functions (Gemini matchmaking endpoint)
> - Frontend: React + Vite, deployed on Firebase Hosting at ecolink-erm.web.app
> - Admin UI: Google AppSheet (entity management, match approvals, monitoring)
> - Engagement tracking: Gmail API + Google Calendar API
>
> **Deployment:**
> - Web app is live at ecolink-erm.web.app (Firebase Hosting, continuous deployment)
> - AppSheet app is live and shareable via URL
> - Apps Script runs on a time-based trigger (daily dormancy check)
> - Cloud Function deployed on Google Cloud (Gemini endpoint)
> - All data in Google Sheets — accessible to any team member with the link

---

### Problem Alignment

> The official problem statement asks: "How might we design an AI-enabled platform
> system that treats ecosystem relationships as first-class, programmable entities?"
>
> EcoLink AI directly addresses this by:
>
> 1. **Relationships as entities** — Linkages are structured records with their own ID,
>    type, health score, status, and outcome. They are reusable across programmes and
>    searchable by any admin.
>
> 2. **Automated governance** — The system auto-approves matches when no flags are
>    detected. Admins only intervene for conflicts, overloads, or at-risk relationships.
>
> 3. **Cross-context reuse** — A successful mentor-startup pairing is recorded as an
>    outcome and informs future matching across different programmes and geographies.
>
> 4. **AI-enabled** — Gemini handles the matching logic that would otherwise require
>    staff to manually read hundreds of profiles per programme cycle.

---

### Business Model

> **Primary model:** SaaS subscription per organisation
> - Tier 1: Single programme (e.g., Cradle CIP Dash) — monthly fee
> - Tier 2: Organisation-wide (all programmes) — annual licence
> - Tier 3: Multi-country deployment — enterprise contract
>
> **Secondary model:** Success-based fee — small percentage of funding raised by
> matched startups, attributable to EcoLink AI pairings.
>
> **First customer:** Cradle Fund Malaysia — direct alignment with their existing
> programmes (CIP Dash, CIP Ignite, CIP Coach & Grow).
>
> **Expansion markets:** Singapore (MAS FinTech Festival ecosystem),
> Indonesia (Startup Studio Indonesia), Thailand (DEPA Digital Startup).

---

### Scalability Plan

> EcoLink AI is cloud-native and scales in three dimensions:
>
> 1. **Volume** — Google Sheets handles thousands of entities. Cloud Functions scale
>    automatically with request volume. Firebase Hosting serves global traffic.
>
> 2. **Geography** — Adding a new country means adding a new Google Sheet as the
>    database. The AppSheet app and web app connect to whichever sheet is relevant.
>    No infrastructure changes required.
>
> 3. **Intelligence** — The Gemini prompt improves automatically as more outcome data
>    accumulates. A platform with 10 completed programmes makes better recommendations
>    than one with 1. This is the flywheel: more data → smarter AI → better outcomes →
>    more programmes → more data.
>
> **Concrete projection:** A single Cradle Fund programme cycle involves ~25 startups.
> At 4 cycles per year across 3 countries = 300 linkages per year feeding the learning loop.
> By year 3, the AI has outcome data from 900+ linkages — enough to achieve 90%+ match accuracy.

---

### Path from Prototype to Production

> **Step 1 (Month 1–2):** Replace seeded data with real Cradle Fund programme data.
> Connect Gmail and Calendar APIs to actual mentor/startup accounts with OAuth consent.
>
> **Step 2 (Month 2–3):** Add authentication to the web app (Firebase Auth).
> Give startups and mentors their own login so they can see their own dashboard.
>
> **Step 3 (Month 3–4):** Build the email consent flow — when a match is approved,
> send emails to both parties with AGREE/DECLINE links. This removes the admin
> as a middleman for routine approvals.
>
> **Step 4 (Month 4–6):** Run the first live programme cycle. Collect real outcome data.
> Feed outcomes back into the Gemini prompt. Measure match accuracy improvement.
>
> **Step 5 (Month 6+):** Add milestone tracking and monthly reporting forms.
> Connect Gemini analytics to generate programme health summaries automatically.

---

## Quick Checklist Before Submitting

- [ ] GitHub repo is public and README has both live links
- [ ] Slides are exported as PDF (not .pptx)
- [ ] Video is under 3 minutes and has clear audio
- [ ] Video is uploaded to YouTube (unlisted is fine) or as MP4
- [ ] All 8 questionnaire sections are answered
- [ ] Double-check the submission form deadline: **9am, 17 May 2026**

---

*Document prepared by Person A — EcoLink AI Team, MyHack 2026*
