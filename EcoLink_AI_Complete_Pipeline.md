# 🌐 EcoLink AI — Complete System Pipeline

### MyHack 2026 | Build with AI KL | Sunway University | 16–17 May 2026

### Organised by GDG Kuala Lumpur | Powered by Google & Cradle Fund

---

## 📑 Table of Contents

1. [System Overview](#1-system-overview)
2. [Problem We Are Solving](#2-problem-we-are-solving)
3. [Master Pipeline Overview](#3-master-pipeline-overview)
4. [Phase 0 — Register & Create Profile](#4-phase-0--register--create-profile)
5. [Phase 1 — AI Matching (Gemini)](#5-phase-1--ai-matching-gemini)
6. [Phase 2 — Email Consent System](#6-phase-2--email-consent-system)
7. [Phase 3 — System Auto-Approval](#7-phase-3--system-auto-approval)
8. [Phase 4 — Programme Begins](#8-phase-4--programme-begins)
9. [Phase 5 — Track Sessions & Engagement](#9-phase-5--track-sessions--engagement)
10. [Phase 6 — Monitor Growth & Milestones](#10-phase-6--monitor-growth--milestones)
11. [Phase 7 — Early Warning System](#11-phase-7--early-warning-system)
12. [Phase 8 — Measuring Success (3 Layers)](#12-phase-8--measuring-success-3-layers)
12b. [Data Analytics Model](#12b-data-analytics-model)
13. [Phase 9 — Record Final Outcome](#13-phase-9--record-final-outcome)
14. [Phase 10 — AI Learns & Improves](#14-phase-10--ai-learns--improves)
15. [Google Sheets Database Structure](#15-google-sheets-database-structure)
16. [Admin Role & Dashboard](#16-admin-role--dashboard)
17. [Tech Stack](#17-tech-stack)
18. [Judging Rubric Alignment](#18-judging-rubric-alignment)
19. [The Flywheel Effect](#19-the-flywheel-effect)
20. [Pitch Script for Judges](#20-pitch-script-for-judges)
20b. [Time Saved — Manual vs EcoLink AI](#20b-time-saved--manual-vs-ecolink-ai)

---

## 1. System Overview

**EcoLink AI** is an AI-powered ecosystem platform that automatically matches startups, mentors, and partners to programmes — replacing the manual coordination that innovation ecosystem platforms like Cradle Fund currently depend on.

### The One-Line Summary
>
> *Build an AI system that automatically connects the right people to the right programmes — tracks their progress — and gets smarter every time it does it.*

### Who Uses It

| User | Role |
|------|------|
| 🏢 **Startups** | Register, get matched to mentors and programmes |
| 🧑‍🏫 **Mentors** | Accept mentees, log sessions, guide growth |
| 🤝 **Partners** | Join programmes, provide resources |
| 👨‍💼 **Programme Admins** | Monitor health, handle exceptions, oversee outcomes |

### What Makes It Different

| Traditional Approach | EcoLink AI |
|---------------------|------------|
| Manual matching by staff | AI matches in seconds |
| Knowledge lost after each programme | Outcomes saved, AI learns |
| Can't scale across countries | Cloud-based, works anywhere |
| One-off relationships | Relationships are reusable entities |
| No insight on what works | Dashboard shows success patterns |
| Admin approves every match | Admin handles exceptions only |
| Forced pairings | Email consent — both parties must agree |

---

## 2. Problem We Are Solving

### Official Problem Statement (MyHack 2026)

**Title:** Automating Ecosystem Linkages Instead of Manual Coordination

**Overview:** Innovation ecosystem platforms still depend on manual coordination to verify participants, match mentors, assign companies to programmes, and manage partner linkages. As ecosystems scale, these relationships remain ad hoc and difficult to reuse, making operations heavy, inconsistent, and hard to extend across geographies and initiatives.

**Core Problem:** The platform does not treat ecosystem relationships as first-class entities that can be defined, automated, governed, and reused across different contexts.

**Design Challenge:**
> *How might we design an AI-enabled platform system that treats ecosystem relationships as first-class, programmable entities — so that linkages can be created, managed, reused, and improved automatically across programmes, countries, and ecosystem actors?*

### Simple Analogy

Think of it like **Grab**, but for startup relationships:

| Grab | EcoLink AI |
|------|-----------|
| Matches riders to drivers automatically | Matches startups to mentors automatically |
| Remembers your favourite routes | Remembers which mentor types work best |
| Works in KL, Penang, JB simultaneously | Works across Malaysia, Singapore, Indonesia |
| Gets smarter over time | Gets smarter with every programme run |

---

## 3. Master Pipeline Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ECOLINK AI PIPELINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PHASE 0   →   Register & Create Profile                    │
│     ↓                                                       │
│  PHASE 1   →   AI Matching (Gemini reads & scores)          │
│     ↓                                                       │
│  PHASE 2   →   Email Consent System                          │
│                (Company chooses → Both agree via email)     │
│     ↓                                                       │
│  PHASE 3   →   System Auto-Approves                         │
│                (Admin handles exceptions only)              │
│     ↓                                                       │
│  PHASE 4   →   Programme Begins                             │
│                (Milestones + dashboards auto-created)       │
│     ↓                                                       │
│  PHASE 5   →   Track Sessions & Engagement                  │
│                (Health score monitored continuously)        │
│     ↓                                                       │
│  PHASE 6   →   Monitor Growth & Milestones                  │
│                (Monthly KPIs + milestone progression)       │
│     ↓                                                       │
│  PHASE 7   →   Early Warning System                         │
│                (Red flags → auto-alerts → admin intervenes) │
│     ↓                                                       │
│  PHASE 8   →   Measure Success (3 Layers)                   │
│                (Engagement → Milestones → Attribution)      │
│     ↓                                                       │
│  PHASE 9   →   Record Final Outcome                         │
│                (Funded / Graduated / Pivoted / Failed)      │
│     ↓                                                       │
│  PHASE 10  →   AI Learns & Improves 🔄                      │
│                (Patterns feed back into Gemini prompt)      │
│     ↓                                                       │
│  NEXT PROGRAMME = SMARTER MATCHING 🚀                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Phase 0 — Register & Create Profile

### How Registration Works

> **Current MVP:** Registration is handled via Google AppSheet forms and Google Forms. Entities are added directly to the `Entities` Google Sheet with a Role field (Mentor, Company, Partner). The analytics dashboard is at ecolink-erm.web.app.
>
> **Full Vision:** A dedicated web app where companies, mentors, and partners self-register, creating a seamless onboarding flow that feeds directly into the AI matching engine.

### Registration Flow

```
User visits web app
        ↓
"I am a..." role selection
   ↙      ↓       ↘
Company  Mentor  Partner
        ↓
Fills role-specific form
        ↓
Data saved to Entities sheet
(Entity_ID auto-generated, Role set)
        ↓
Gemini matching engine reads new profile
        ↓
If Company: Top 3 mentor recommendations generated instantly
If Mentor:  Added to matchable pool, appears in future recommendations
If Partner: Linked to relevant programmes and entities
```

### Web App — Complete Page Map

| Page | Status | Purpose |
|------|--------|---------|
| **Analytics Dashboard** (`/`) | ✅ Built | KPIs, charts, health distribution, activity feed |
| **Entity Directory** (`/entities`) | ✅ Built | Browse all ecosystem entities with search and role filters |
| **Linkages** (`/linkages`) | ✅ Built | View all relationships, health scores, link types |
| **Linkage Detail** (`/linkages/:id`) | ✅ Built | Drill into single relationship — health gauge, interaction timeline |
| **AI Matching** (`/ai-match`) | ✅ Built | Select entity + type → Gemini returns top 3 matches with reasoning |
| **Interactions** (`/interactions`) | ✅ Built | Timeline of all emails and meetings across linkages |
| **Admin CRUD** | ✅ Built | Add/edit/delete entities, manage linkages, approve nudges (AppSheet) |
| `/register` | 🔮 Roadmap | Self-service registration — role selection → form → auto-onboarding |
| `/register/company` | 🔮 Roadmap | Company registration with industry, stage, needs, pitch deck |
| `/register/mentor` | 🔮 Roadmap | Mentor registration with expertise, availability, past track record |
| `/register/partner` | 🔮 Roadmap | Partner registration with services offered, programmes to join |
| `/dashboard/company` | 🔮 Roadmap | Company view — matched mentor, milestones, sessions, growth |
| `/dashboard/mentor` | 🔮 Roadmap | Mentor view — mentees list, session logger, ratings |
| `/consent/:matchId` | 🔮 Roadmap | Accept/decline match via email link — no login required |
| `/admin/flags` | 🔮 Roadmap | Admin exception queue — conflicts, overloads, at-risk alerts |
| `/reports` | 🔮 Roadmap | Gemini-generated progress summaries, risk analysis, recommendations |

### What the Full Web App Would Include

```
┌─────────────────────────────────────────────────────────────┐
│                    ECOLINK AI WEB APP                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PUBLIC PAGES:                                              │
│  ├── Landing page (explain EcoLink AI)                     │
│  ├── Registration (company / mentor / partner forms)        │
│  └── Email consent links (accept/decline match)            │
│                                                             │
│  COMPANY DASHBOARD:                                         │
│  ├── My matched mentor (profile, contact)                  │
│  ├── My milestones (progress tracker with evidence links)  │
│  ├── Monthly report submission (Google Form embedded)      │
│  ├── Session history (auto-detected from Calendar/Gmail)   │
│  └── Financial health (budget, burn rate, runway)          │
│                                                             │
│  MENTOR DASHBOARD:                                          │
│  ├── My mentees (active linkages)                          │
│  ├── Session logger (date, topics, notes, rating)          │
│  ├── Accept/decline new match requests                     │
│  └── My track record (success rate, ratings)               │
│                                                             │
│  ADMIN DASHBOARD (current — ecolink-erm.web.app):          │
│  ├── Ecosystem overview (KPIs, health distribution)        │
│  ├── Entity directory (all entities with filters)          │
│  ├── Linkages (all relationships with health scores)       │
│  ├── AI matching (trigger Gemini recommendations)          │
│  ├── Interactions timeline (Gmail + Calendar logs)         │
│  ├── Exception queue (flags, conflicts, overloads)         │
│  └── Analytics (progress summaries, risk analysis)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Startup Registration Form

```
Company name:        ________________________________
Industry:            [ Fintech | Healthtech | Edtech |
                       Agritech | Logistics |
                       Sustainability | Proptech ]
Stage:               [ Pre-seed | Seed | Series A ]
Founded year:        ________________________________
Team size:           ________________________________
Location:            [ KL | Penang | JB | Cyberjaya |
                       Petaling Jaya | Other ]
Problem solving:     ________________________________
                     (text box — describe your problem)
Help needed:         ☐ Fundraising
                     ☐ Product development
                     ☐ Market access
                     ☐ Legal & compliance
                     ☐ Business model
                     ☐ Bank/corporate partnerships
                     ☐ Hiring & team building
Website:             ________________________________
Pitch deck link:     ________________________________
```

---

### Mentor Registration Form

```
Full name:           ________________________________
Current company:     ________________________________
Job title:           ________________________________
Years of experience: ________________________________
Industries:          ☐ Fintech   ☐ Healthtech
                     ☐ Edtech    ☐ Agritech
                     ☐ Logistics ☐ Sustainability
Expertise:           ☐ Fundraising  ☐ Product
                     ☐ Marketing    ☐ Operations
                     ☐ Legal        ☐ Scaling
                     ☐ VC/Investor  ☐ Corporate BD
Past companies:      ________________________________
LinkedIn profile:    ________________________________
Availability:        [ Weekdays | Weekends | Both ]
Max mentees at once: ________________________________
Short bio:           ________________________________
                     (text box)
```

---

### Partner Registration Form

```
Organisation name:   ________________________________
Type:                [ Legal | Financial | Tech |
                       Corporate | Accelerator ]
Services offered:    ☐ Legal advisory
                     ☐ Grant matching
                     ☐ Cloud credits
                     ☐ Office space
                     ☐ Investor intro
Programmes to join:  ☐ Cradle CIP Dash
                     ☐ Cradle IGNITE
                     ☐ (other active programmes)
Contact person:      ________________________________
Email:               ________________________________
```

### What Happens After Submission

```
Form submitted
      ↓
Data saved to Google Sheets
(correct tab based on role)
      ↓
Gemini immediately reads new profile
      ↓
Matching engine runs automatically
      ↓
Results appear on admin dashboard
      ↓
Top 3 mentor recommendations ready
```

### Google Sheets Updated

- ✅ `Entities` tab — new row added (with Role = Mentor, Company, or Partner)

---

## 5. Phase 1 — AI Matching (Gemini)

### How Gemini Thinks

Gemini does not just match keywords. It reads profiles deeply and reasons like a human expert recruiter:

```
COMPANY PROFILE READ:
"TechBro — Fintech, Pre-seed,
 needs fundraising + bank partnerships,
 team of 2, KL-based"

GEMINI ANALYSES:
This startup needs someone who:
✅ Knows fintech regulations in Malaysia
✅ Has pre-seed fundraising experience
✅ Has connections to Malaysian banks
✅ Has guided very small teams before
✅ Understands B2B fintech space

SCANS ALL MENTORS IN DATABASE...

SCORES EVERY MENTOR:
Ahmad Rizal    → 95%  ✅ RECOMMEND
Priya Nair     → 88%  ✅ RECOMMEND
David Lim      → 81%  ✅ RECOMMEND
Siti Rahimah   → 45%  ❌ skip
Kumar Raj      → 32%  ❌ skip
...
```

---

### Matching Prompt — Basic Version (Early Stage)

```
Match this company to the best mentor.

COMPANY:
- Industry: {industry}
- Stage: {stage}
- Needs: {needs}
- Location: {location}

MENTOR DATABASE:
{all mentor profiles}

Score each mentor 0-100%.
Explain the top 3 matches in 2-3 sentences each.
Focus on: expertise alignment, stage fit,
          network value, past success.
```

---

### Matching Prompt — Enhanced Version (After Learning)

```
Match this company to the best mentor.

COMPANY:
- Industry: {industry}
- Stage: {stage}
- Needs: {needs}
- Location: {location}

MENTOR DATABASE:
{all mentor profiles}

HISTORICAL CONTEXT (learn from past outcomes):
- Mentors with banking + VC background score
  35% higher with fintech pre-seed startups
- Mentor health score above 70 for 6+ months
  = 80% positive outcome rate
- Industry overlap above 50% = better success
- Mentors with 3+ successful exits
  = consistently stronger outcomes
- Startups that hit Milestone 2 by Week 4
  = 73% more likely to complete programme
- Matches scored below 70%
  = 65% admin rejection rate historically

INSTRUCTIONS:
Prioritize patterns that led to successful outcomes.
De-prioritize patterns that led to churn.
Score each mentor 0-100%.
Explain top 3 matches in 2-3 personalised sentences.
```

---

### Top 3 Shown To Company

```
🎯 YOUR TOP 3 MENTOR MATCHES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   🥇 95% MATCH   │  │   🥈 88% MATCH   │  │   🥉 81% MATCH   │
│                  │  │                  │  │                  │
│  Ahmad Rizal     │  │  Priya Nair      │  │  David Lim       │
│  Ex-CIMB | VC    │  │  Regulatory      │  │  Serial          │
│  Partner         │  │  Expert          │  │  Entrepreneur    │
│                  │  │                  │  │                  │
│  ⭐ 4.8 rating   │  │  ⭐ 4.6 rating   │  │  ⭐ 4.9 rating   │
│  👥 12 mentees   │  │  👥 8 mentees    │  │  👥 15 mentees   │
│  🏆 8 exits      │  │  🏆 5 exits      │  │  🏆 10 exits     │
│                  │  │                  │  │                  │
│  WHY YOU?        │  │  WHY YOU?        │  │  WHY YOU?        │
│  "Ahmad spent 8  │  │  "Priya's Bank   │  │  "David raised   │
│  years at CIMB   │  │  Negara network  │  │  RM5M pre-seed   │
│  then joined a   │  │  is perfect for  │  │  himself — he    │
│  fintech VC. He  │  │  your loan app   │  │  knows exactly   │
│  guided 4 pre-   │  │  compliance      │  │  your journey    │
│  seed fintechs   │  │  challenges."    │  │  from day one."  │
│  to Series A."   │  │                  │  │                  │
│                  │  │                  │  │                  │
│  Expertise:      │  │  Expertise:      │  │  Expertise:      │
│  🏦 Fintech      │  │  ⚖️ Regulatory   │  │  💰 Fundraising  │
│  💰 Fundraising  │  │  🏦 Banking      │  │  📈 Scaling      │
│  🌏 Network      │  │  🔒 Compliance   │  │  🎯 PMF          │
│                  │  │                  │  │                  │
│  [ SELECT ✅ ]   │  │  [ SELECT ✅ ]   │  │  [ SELECT ✅ ]   │
└──────────────────┘  └──────────────────┘  └──────────────────┘

     Not satisfied?  [ 🔄 Show me 3 more options ]
     Need help?      [ 📝 Tell Gemini more about your needs ]
```

---

### If Company Asks For Refinement

Gemini asks follow-up questions:

```
Help me find you a better match. Quick questions:

1. What is more urgent right now?
   [ Fundraising ]  [ Product development ]

2. Do you prefer a mentor who is:
   [ Hands-on — weekly check-ins ]
   [ Strategic — monthly guidance ]

3. What specific connections do you need most?
   [ Bank partnerships ]
   [ VC introductions ]
   [ Corporate clients ]
   [ Government grants ]

→ Gemini re-runs matching with this extra context
→ New Top 3 generated instantly
```

### Google Sheets Updated

- ✅ `Match_History` tab — match scores + AI reasoning logged

---

## 6. Phase 2 — Email Consent System

### How the Consent Flow Works

After the company selects a mentor from the AI's top 3 recommendations, the system sends emails to BOTH parties to arrange a meeting or sign an agreement.

```
COMPANY selects 1 mentor from Top 3
              ↓
SYSTEM sends email to BOTH parties
(Company + Chosen Mentor)
              ↓
Email includes: match details, AI reasoning,
proposed next steps (schedule meeting / sign agreement)
              ↓
BOTH PARTIES RESPOND
              ↓
        ┌─────┴─────┐
   BOTH AGREE     EITHER DISAGREES
        ↓              ↓
  System Approved   System finds next
  ✅ Notification    best mentor from
  sent to both      remaining candidates
        ↓              ↓
  Linkage created   Repeat consent flow
  in Google Sheets  with new mentor
```

### What Each Party Receives

**Company receives:**
```
📬 MENTOR MATCH CONFIRMATION REQUEST

Your AI-recommended mentor:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mentor:         Dr. Amirul Hakim
Expertise:      AI, Machine Learning
Match Score:    95%
AI Reasoning:   "Dr. Amirul's deep learning research
                and NLP expertise directly aligns with
                your bilingual resume screening product."

Next steps:
→ Schedule an introductory meeting
→ Or sign the mentorship agreement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ✅ AGREE — Proceed with this mentor  ]
[ ❌ DECLINE — Show me other options   ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Mentor receives:**
```
📬 NEW MENTORSHIP REQUEST

Company:        CariKerja.AI
Industry:       HR Tech, AI
Needs:          Bahasa-English NLP guidance, hiring
Match Score:    95%
AI Reasoning:   "CariKerja.AI is building bilingual
                resume screening — your NLP research
                is a direct match."

Commitment:
→ Programme duration: 16 weeks
→ Minimum 2 sessions per month

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ✅ ACCEPT — I can mentor this company ]
[ ❌ DECLINE — Not the right fit       ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Decision Outcomes

| Scenario | What Happens |
|----------|-------------|
| Both agree ✅ | System auto-approves → sends approval notification to both → creates Linkage in Google Sheets |
| Mentor declines ❌ | AI recommends next best mentor → new consent email sent to company |
| Company declines ❌ | Company can request a new set of 3 recommendations from Gemini |
| No response (48hrs) | Auto-decline → system moves to next best mentor |

### If Either Party Declines — AI Learns

The rejection reason is logged and feeds back into the matching model:
- "Not my expertise area" → AI adjusts expertise weighting
- "Too busy" → AI checks mentor capacity before recommending
- "Stage mismatch" → AI tightens stage-fit scoring

### Google Sheets Updated
- ✅ `Linkages` — new row created when both agree (Status: Active)
- ✅ `Match_History` — match score, AI reasoning, both decisions logged

---

## 7. Phase 3 — System Auto-Approval

### The Key Insight

```
OLD THINKING:
Admin approves EVERY match
= Bottleneck ❌
= Slow ❌
= Pointless when AI + both parties already agree ❌

NEW THINKING:
System AUTO-APPROVES when everything is fine ✅
Admin ONLY handles EXCEPTIONS ✅
= Fast ✅
= Efficient ✅
= Human judgment where it actually matters ✅
```

---

### When System Auto-Approves (Instantly)

```
Company chose mentor            ✅
Mentor accepted                 ✅
No conflict of interest found   ✅
Mentor not overloaded           ✅
Company not flagged             ✅
              ↓
AUTO-APPROVED ✅
Both notified immediately
No human action needed
```

---

### When Admin Must Intervene

```
🚨 CONFLICT OF INTEREST DETECTED
   Same family name as mentor
   Same previous company
   Known prior relationship flagged

⚠️ MENTOR OVERLOAD
   Mentor already has 4+ active mentees
   Quality risk — needs rebalancing

🔴 FLAGGED STARTUP
   Previous misconduct on record
   Incomplete or suspicious profile

🎯 STRATEGIC PROGRAMME OVERRIDE
   Cradle only wants sustainability
   startups this batch — others filtered

🌍 GEOGRAPHIC MISMATCH
   Programme only for East Malaysia
   startups — KL startup flagged
```

---

### Admin's True Role

```
Admin = SAFETY NET 🛡️  (not a bottleneck 🚫)

Admin handles:
✅ Conflict of interest cases
✅ Mentor overload rebalancing
✅ At-risk relationship intervention
✅ Strategic programme decisions
✅ Edge cases AI cannot judge
✅ Complaint resolution
✅ Mid-programme mentor reassignment

Admin does NOT:
❌ Approve every single match
❌ Re-review what AI + both parties agreed
❌ Create unnecessary delays
❌ Duplicate work already done
```

---

### Who Are The Admins?

| Level | Who | Does What |
|-------|-----|-----------|
| **Level 1** Programme Manager | Cradle Fund programme staff | Daily monitoring, flag handling, complaints |
| **Level 2** Programme Director | Senior Cradle Fund staff | Conflict of interest, strategic decisions |
| **Level 3** Super Admin | EcoLink AI platform team | System-wide oversight, AI model settings, onboarding new orgs |

### Google Sheets Updated

- ✅ `Linkages` — new active linkage row created (current MVP)
- ✅ `Match_History` — final approval status logged

---

## 8. Phase 4 — Programme Begins

### What System Creates Automatically (Day 0)

```
SYSTEM AUTO-APPROVES
        ↓
┌───────────────────────────────────┐
│  AUTOMATICALLY CREATED:           │
│  ✅ Milestone plan                │
│  ✅ Growth tracking template      │
│  ✅ Session log                   │
│  ✅ Shared dashboard access       │
│  ✅ Notifications to both parties │
└───────────────────────────────────┘
```

---

### Milestone Plan (Auto-Generated by Programme Type)

```
TechBro Sdn Bhd — Milestone Plan
Programme: Cradle CIP Dash (16 weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 1:   ○ Complete intro session with mentor
Week 2:   ○ Define 90-day goals together
Week 4:   ○ Refine pitch deck
Week 6:   ○ Submit Cradle grant application
Week 8:   ○ First paying customer secured
Week 10:  ○ Revenue target: RM 10,000 MRR
Week 12:  ○ Open fundraising conversations
Week 14:  ○ Term sheet or LOI received
Week 16:  ○ Programme graduation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: 0 / 9 milestones complete
```

---

### Growth Tracking Template (Auto-Created)

```
TechBro — Monthly Growth Tracker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Month 1: Revenue: ___  Team: ___  Customers: ___
Month 2: Revenue: ___  Team: ___  Customers: ___
Month 3: Revenue: ___  Team: ___  Customers: ___
Month 4: Revenue: ___  Team: ___  Customers: ___
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: Awaiting first monthly update
```

---

### Notifications Sent (Day 0)

**Startup receives:**

```
🎉 Your mentor has been confirmed!

Mentor:      Ahmad Rizal
Programme:   Cradle CIP Dash
Start Date:  20 May 2025
Duration:    16 weeks

What to do next:
1. Ahmad will reach out within 48 hours
2. Schedule your intro session
3. Complete your startup profile fully
4. Review your milestone plan

[ GO TO MY DASHBOARD → ]
```

**Mentor receives:**

```
✅ New mentee confirmed!

Mentee:      TechBro Sdn Bhd
Founder:     Hafiz Rahman
Programme:   Cradle CIP Dash
Start Date:  20 May 2025
Duration:    16 weeks

What to do next:
1. Review their pitch deck and full profile
2. Reach out within 48 hours
3. Schedule intro session
4. Review their milestone plan together

[ GO TO MY DASHBOARD → ]
```

**Admin receives:**

```
📊 New match confirmed (no action needed)

TechBro Sdn Bhd ↔ Ahmad Rizal
Match score:    95%
Programme:      Cradle CIP Dash
Auto-approved:  ✅ No flags detected

[ VIEW IN DASHBOARD → ]
```

### Google Sheets Updated

- ✅ `Linkages` — new active linkage row created
- ✅ `Milestones` — auto-created from templates (9 per Mentorship, 7 per Investment/Partnership)
- 🔮 `Monthly_Reports` — template rows created when company submits first report (roadmap)
- ✅ `Match_History` — approval status updated

---

## 9. Phase 5 — Track Sessions & Engagement

### After Every Session, Mentor Logs

```
SESSION LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date:             15 January 2025
Duration:         1.5 hours
Topics covered:   Pitch deck review,
                  Unit economics discussion
Action items:     Revise financial model by
                  next session (Hafiz)
Mentor notes:     Startup needs to sharpen
                  value proposition — too broad
Startup notes:    Will restructure slide 4-6
Mentor rating:    ⭐⭐⭐⭐½ (4.5)
Startup rating:   ⭐⭐⭐⭐⭐ (5.0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 3 of 16 weeks programme
Next session: 29 January 2025
```

---

### Engagement Health Score (Continuous)

Your system already tracks this via Gmail + Google Calendar APIs:

```
HEALTH SCORE = Recency Score + Frequency Score

CALCULATION:
Recency:   Days since last interaction (lower = better)
Frequency: Number of interactions per month

HEALTH BANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 HEALTHY   (70–100):
   Meeting regularly
   Both parties engaged
   Responses within 24–48 hrs

🟡 AT RISK   (40–69):
   Sessions slowing down
   Response times increasing
   Missing some sessions

🔴 DORMANT   (0–39):
   30+ days no contact
   Relationship is dying quietly
   Immediate admin alert needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### What Gets Tracked Automatically

| Signal | How Detected | Source |
|--------|-------------|--------|
| Email exchanges | Gmail API | Automatic |
| Meetings scheduled | Google Calendar API | Automatic |
| Session frequency | Session log entries | Mentor input |
| Response time | Gmail timestamps | Automatic |
| Last interaction date | All sources combined | Automatic |
| Session rating trends | Session log | Both parties |

---

### Important Limitation (Be Honest With Judges)

```
⚠️ ACTIVE ENGAGEMENT ≠ STARTUP SUCCEEDING

A mentor and startup can meet every week
and still be failing completely.

Engagement health only tells us:
"Is the relationship alive?"

It does NOT tell us:
"Is the startup actually growing?"

That is why we need Layers 2 and 3.
(See Phase 8)
```

### Google Sheets Updated

- ✅ `Interactions` — new row per interaction detected (Email or Meeting)
- ✅ `Linkages` — Health_Score and Last_Interaction_Date updated

---

## 10. Phase 6 — Monitor Growth & Milestones

### How It Works

Milestone tracking combines two data sources:
1. **Automatic:** Meeting detection via Google Calendar + Gmail API (already built)
2. **Manual:** Regular reporting from company via Google Forms (simple monthly form)

### Milestone Tracking Fields

Each milestone record contains:

| Field | Example |
|-------|---------|
| Milestone_Name | "Secure first enterprise client" |
| Target_Date | 2026-07-15 |
| Completion_Status | Not Started / In Progress / Completed / Overdue |
| Progress_Percent | 60% |
| Evidence_Link | https://drive.google.com/... |
| Admin_Notes | "Client LOI signed, pending contract" |

### Financial Reporting (via Google Forms → Gemini Analysis)

Companies submit monthly financial updates via a simple Google Form. Gemini analyses the data automatically:

| Field | Example |
|-------|---------|
| Budget_Allocated | RM 250,000 |
| Amount_Spent | RM 145,000 |
| Burn_Rate | RM 36,250/month |
| Spending_Categories | Tech: 40%, Marketing: 25%, Ops: 20%, Legal: 15% |
| Remaining_Budget | RM 105,000 |
| Months_Runway | ~2.9 months |

**Gemini analyses and flags:**
- Burn rate exceeding plan → alert admin
- Spending skewed toward one category → suggest rebalancing
- Runway < 3 months → flag as financial risk

### Suggested Table Structure (Simple — 2 Tables)

Rather than many separate sheets, combine into 2 practical tables:

**Table 1: `Milestones` (one row per milestone per linkage)**
```
Milestone_ID | Linkage_ID | Milestone_Name | Target_Date | Completion_Status | Progress_Percent | Evidence_Link | Updated_At
```

**Table 2: `Monthly_Reports` (one row per monthly submission)**
```
Report_ID | Linkage_ID | Month | Revenue | Team_Size | Customers | Budget_Spent | Burn_Rate | Remaining_Budget | Top_Win | Biggest_Challenge | Gemini_Analysis | Submitted_At
```

### Outcome Determination

| Outcome | How Determined |
|---------|---------------|
| **SUCCESS** | ≥80% milestones completed + positive financial trajectory → Mentor marked as **high-potential mentor** (rating increased, prioritised in future matching) |
| **FAILURE** | <40% milestones + declining metrics → System tracks: Was it mentor mismatch? Industry gap? Timing? Lack of engagement? |

### Learning From Failures

When a linkage fails, the system records correlation data:

```
FAILURE ANALYSIS — ENT-C11 (BatuData Analytics)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Milestones completed:   1 of 9 (11%)
Health score at end:    12 (Dormant)
Mentor sessions:        3 total (vs 16 expected)
Monthly reports filed:  1 of 4

Correlations found:
→ Mentor had 4 other active mentees (overloaded)
→ Industry overlap was only 20% (below 50% threshold)
→ No interaction for 45+ days before official failure
→ Financial: burn rate 2x projected, no course correction

Learning applied:
→ AI now limits mentor to max 3 active mentees
→ AI now requires >40% industry overlap for recommendations
→ Early warning triggers at 14 days no-contact (not 30)
```

### Growth Dashboard (Admin View)

```
STARTUP GROWTH OVERVIEW — All Active Matches
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 TechBro Sdn Bhd
   Revenue:     RM 0 → RM 15k MRR      📈 +∞%
   Team:        2 → 5 people           📈 +150%
   Customers:   0 → 8                  📈 +∞%
   Milestones:  4 of 9 complete        ✅
   Health:      87 (HEALTHY)           🟢

🟡 MediLink Sdn Bhd
   Revenue:     RM 5k → RM 6k MRR     📈 +20%
   Team:        3 → 3 people          ➡️ flat
   Customers:   5 → 6                 📈 +20%
   Milestones:  2 of 9 complete       ⚠️ behind
   Health:      55 (AT RISK)          🟡

🔴 GreenAgri Sdn Bhd
   Revenue:     RM 10k → RM 8k MRR    📉 -20%
   Team:        4 → 3 people          📉 -25%
   Customers:   12 → 9                📉 -25%
   Milestones:  1 of 9 complete       ❌ critical
   Health:      28 (DORMANT)          🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Google Sheets Updated

- 🔮 `Monthly_Reports` — new row per monthly update (roadmap — via Google Forms)
- ✅ `Milestones` — status updated per milestone

---

## 11. Phase 7 — Early Warning System

### Red Flag Triggers

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ENGAGEMENT FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ No session logged for 3 weeks
□ Mentor unresponsive for 1 week
□ Session rating below 3.0 twice in a row
□ Health score dropped below 40
□ Zero email/calendar activity for 2 weeks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📉 GROWTH FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Revenue dropped 2 consecutive months
□ Team size decreased
□ Customer count declining
□ Zero milestone progress for 4 weeks
□ Startup missed 2 milestones in a row

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚩 RELATIONSHIP FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Startup submitted complaint about mentor
□ Mentor requested reassignment
□ Both parties stopped all communication
□ Startup did not submit monthly update x2
```

---

### Escalation Flow

```
FLAG DETECTED BY SYSTEM
          ↓
DAY 1:  Gentle automated reminder
        sent to both parties
          ↓
DAY 3:  No response received
        → Admin gets dashboard alert
          ↓
DAY 5:  Admin contacts both parties
        directly via phone/email
          ↓
DAY 7:  Still no improvement
        → Admin offers options:
          A. Extra support resources
          B. Mediation session arranged
          C. Mentor reassignment
          ↓
IF REASSIGNMENT CHOSEN:
        → AI re-runs matching
        → New Top 3 shown to company
        → Process restarts from Phase 2
        → Outcome of original match logged
          as "Reassigned" for AI learning
```

### Google Sheets Updated

- ✅ `Linkages` — Health_Status updated, flag detected (current MVP)
- 🔮 `AI_Improvement_Log` — flag patterns saved for learning (roadmap)

---

## 12. Phase 8 — Measuring Success (3 Layers)

*This is the most critical phase for judges. It directly answers the problem statement's question about how past engagement data improves future matching.*

---

### Layer 1 — Engagement Health ✅

**Already built in your system**

**Question answered:** "Is the relationship alive and active?"

```
WHAT IT MEASURES:
- Interaction frequency (sessions, emails, meetings)
- Response time between parties
- Health score trend over time
- Dormancy detection (30+ days silence)

HOW IT IS DETECTED:
- Gmail API (automatic)
- Google Calendar API (automatic)
- Session log entries (mentor input)

VERDICT:
🟢 Healthy  = Relationship active and strong
🟡 At Risk  = Slowing down, needs attention
🔴 Dormant  = Relationship dying quietly

LIMITATION:
Active engagement ≠ startup succeeding.
They could meet weekly and still be failing.
Layer 1 alone is not enough.
```

---

### Layer 2 — Milestone Progression 📈

**Trackable with your system**

**Question answered:** "Is the startup actually moving forward?"

| Signal | How to Detect | Source | Automated? |
|--------|--------------|--------|:----------:|
| Funding raised | Admin logs after announcement | Manual input | ❌ |
| Programme graduated | Cradle marks completion | Admin via dashboard | ❌ |
| Revenue milestone hit | Startup self-reports monthly | Google Form | ❌ |
| Team growth | Size change over time | Self-reported | ❌ |
| Customer count | Traction metrics | Self-reported | ❌ |
| IP filed | Patent/trademark registered | MyIPO public records | 🔄 partial |
| Pivot occurred | Industry tags changed | Profile edit history | ✅ |

> **Honest note for judges:** Most of these require the startup to self-report or the programme admin to log manually. Full automation is not possible here — and that is honest. Judges respect this acknowledgement.

---

### Layer 3 — Match Attribution 🧠

**The hard part — but the most impressive**

**Question answered:** "Did OUR match cause the startup's success?"

This is genuinely difficult because a startup may succeed due to:

- Your mentor match (EcoLink AI's contribution)
- Their own team talent
- Market timing
- A separate investor they found independently
- A government grant they applied for on their own

You cannot prove causation, but you can show strong correlation:

| Approach | How It Works |
|----------|-------------|
| **Before/after comparison** | Health score trajectory before vs after match — did engagement improve significantly? |
| **Cohort analysis** | Startups matched by AI vs manually matched — which cohort has better outcomes? |
| **Mentor effectiveness score** | Mentors whose mentees consistently achieve milestones get weighted higher in future matching |
| **Startup feedback survey** | After 3 months: "How valuable was this match on a scale of 1–10?" — direct attribution |
| **Control group** | Some startups matched randomly, some by AI — compare outcomes (gold standard, requires scale) |

---

### What To Tell Judges (Layer Summary)

> *"We measure success at three levels. First, engagement health — are they actually meeting and communicating? Our system tracks this automatically via Gmail and Google Calendar. Second, milestone progression — has the startup raised funding, grown their team, graduated a programme? Programme admins log these in our dashboard. Third, match attribution — we compare outcome rates between AI-matched linkages versus manually assigned ones. Over time, we feed successful match patterns back into Gemini to improve future recommendations. We do not claim to predict startup success — we claim to make better matches faster and detect failing relationships earlier so admins can intervene before it is too late."*

---

## 12b. Data Analytics Model

### Startup Progress Summary

Gemini generates a natural-language summary for each company:

```
PROGRESS SUMMARY — CariKerja.AI (ENT-C12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Technical milestones:  4/5 completed ✅
Commercial milestones: 1/4 completed ⚠️
Overall progress:      62%

Gemini Analysis:
"CariKerja.AI has strong technical execution —
their bilingual NLP model is ahead of schedule.
However, commercialisation is lagging: only 1 paying
customer despite 3 months in programme. Recommend
shifting mentor focus from technical to go-to-market
strategy for the remaining 8 weeks."

Recommended Actions:
1. Schedule GTM strategy session with mentor
2. Connect with Partner ENT-P02 (500 Global)
   for investor readiness workshop
3. Admin to review: reassign commercial-focused
   co-mentor if no improvement by Week 10
```

### Risk Analysis Dashboard

```
RISK ANALYSIS — All Active Linkages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUCCESS RATE:
Overall:        68% (17 of 25 linkages on track)
Mentorship:     75% (9 of 12)
Investment:     50% (3 of 6)
Partnership:    71% (5 of 7)

HIGH RISK (immediate attention):
🔴 ENT-C11 — BatuData Analytics
   Health: 12 | Milestones: 1/9 | No contact 45 days
   → Recommend: Admin intervention or reassignment

🔴 ENT-C14 — HelangDrone
   Health: 35 | Milestones: 2/9 | Funding stalled
   → Recommend: Connect to alternative funding source

PATTERNS DETECTED:
→ Mentorships with >2 sessions/month = 85% success
→ Companies that file monthly reports = 3x more
  likely to complete programme
→ First milestone completion within 2 weeks
  predicts 78% programme success
```

### Milestone Health Overview

| Health Level | Criteria | Count | Action |
|-------------|----------|:-----:|--------|
| 🟢 On Track | ≥70% milestones on schedule | 13 | No action needed |
| 🟡 At Risk | 40-69% on schedule | 6 | Nudge email sent |
| 🔴 Critical | <40% on schedule | 4 | Admin intervention |
| ⚫ Stalled | 0% progress for 4+ weeks | 2 | Reassignment review |

### Recommendation Engine

Based on the analytics, Gemini generates specific action items:

```
WEEKLY ADMIN ACTIONS (auto-generated)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priority 1: Contact BatuData founder — 45 days silence
Priority 2: Review HelangDrone funding options
Priority 3: Schedule GTM session for CariKerja.AI
Priority 4: Recognise Rajesh Krishnan — 91 health score,
            3rd successful mentee this year
```

---

## 13. Phase 9 — Record Final Outcome

### What Gets Recorded At Programme End

```
FINAL OUTCOME — TechBro Sdn Bhd
Programme: Cradle CIP Dash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTCOME STATUS:
[ ✅ Funded ] [ Graduated ] [ Pivoted ]
[ Stalled  ] [ Churned   ] [ Ongoing ]

DETAILS:
Result:              ✅ FUNDED & GRADUATED
Funding raised:      RM 1,200,000 Pre-Seed
Investors:           Cradle Fund + 500 Global
Revenue at end:      RM 45,000 MRR
Team at end:         12 people
Milestones hit:      7 of 9
Sessions completed:  14 of 16 weeks

MENTOR EVALUATION:
Mentor rating:       ⭐⭐⭐⭐⭐ 4.8/5
Sessions quality:    Excellent
Network value:       High — direct investor intro
Recommend mentor:    ✅ Yes, for similar startups

STARTUP EVALUATION:
Startup commitment:  Excellent
Progress made:       Strong
Mentor rating given: ⭐⭐⭐⭐⭐ 5.0/5

ADMIN NOTES:
"Secured Series A conversations via Ahmad's
direct introduction to 500 Global partner.
Pitch deck quality improved dramatically
between Week 2 and Week 14."

OVERALL SUCCESS SCORE:  9.0 / 10
MATCH QUALITY:          Excellent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Outcome Status Definitions

| Status | Meaning |
|--------|---------|
| ✅ **Funded** | Startup raised investment during or after programme |
| 🎓 **Graduated** | Completed all milestones successfully |
| 🔄 **Pivoted** | Changed direction significantly — still alive |
| ⏸️ **Stalled** | Lost momentum, incomplete, no clear outcome |
| ❌ **Churned** | Startup failed, shut down, or dropped out |
| ⏳ **Ongoing** | Extended beyond programme, still tracking |

---

### Google Sheets Outcome Fields

| Field | Example Values |
|-------|---------------|
| `Outcome_Status` | Funded, Graduated, Pivoted, Stalled, Churned |
| `Outcome_Date` | 2026-08-15 |
| `Funding_Raised` | RM500K, RM2.5M, None |
| `Growth_Metric` | 3x MRR, 200% user growth, Team 2→12 |
| `Match_Attribution` | High / Medium / Low / Unknown |
| `Admin_Notes` | "Secured Series A via mentor intro to 500 Global" |
| `Mentor_Final_Rating` | 4.8 |
| `Startup_Final_Rating` | 5.0 |
| `Success_Score` | 9.0 / 10 |
| `Lessons_Learned` | Free text — what worked, what did not |

### Google Sheets Updated

- ✅ `Outcomes` — full outcome row added with success score and attribution
- ✅ `Linkages` — status set to Archived
- 🔮 `Entities` — mentor rating + successful exits count updated (roadmap)

---

## 14. Phase 10 — AI Learns & Improves

### The Feedback Loop

```
OUTCOME SAVED TO GOOGLE SHEETS
              ↓
GEMINI ANALYSES ALL COMPLETED OUTCOMES
              ↓
FINDS PATTERNS IN WHAT MADE SUCCESSFUL MATCHES
              ↓
UPDATES MATCHING PROMPT WITH NEW CONTEXT
              ↓
NEXT PROGRAMME = SMARTER MATCHING
              ↓
BETTER OUTCOMES → MORE DATA → EVEN SMARTER 🔄
```

---

### Pattern Recognition Examples

Gemini analyses which linkage traits predict success:

```
PATTERN 1 — DISCOVERED:
Mentors with banking + VC background
matched to fintech pre-seed startups
→ 89% success rate
→ AI now prioritises this combination
→ Match score weighted +15%

PATTERN 2 — DISCOVERED:
Mentor health score above 70 for 6+ months
→ 80% positive programme outcome
→ AI now flags mentors with consistently
   high health scores as premium matches

PATTERN 3 — DISCOVERED:
Startups that miss Milestone 2 by Week 4
→ 73% chance of failing the programme
→ AI now flags these as at-risk EARLY
→ Admin gets proactive alert at Week 4

PATTERN 4 — DISCOVERED:
Matches with AI score below 70%
→ 65% rejection rate by mentor
→ AI now only surfaces 75%+ scores
→ Reduces wasted time for everyone

PATTERN 5 — DISCOVERED:
Industry overlap above 50%
→ Consistently better match success
→ AI now weights industry alignment
   more heavily in scoring formula

PATTERN 6 — DISCOVERED:
Mentors with 3+ prior successful exits
→ 40% better funding outcomes
→ AI now shows mentor exit track record
   prominently on match cards
```

---

### How Gemini Prompt Evolves Over Time

```
PROGRAMME 1 PROMPT (basic):
"Match based on: expertise, industry, needs"

PROGRAMME 2 PROMPT (learning):
"Match based on expertise, industry, needs.
CONTEXT: Ahmad-type profiles (banking+VC)
perform well with fintech pre-seed."

PROGRAMME 3 PROMPT (smarter):
"Match based on expertise + historical patterns.
WEIGHT: Industry overlap >50% = +20% score.
AVOID: Mentors with <3 mentees experience
for Series A stage startups."

PROGRAMME 4 PROMPT (intelligent):
"Full context-aware matching with 18 months
of outcome data across 45 completed pairings.
Confidence level: HIGH 🟢"
```

---

### Match Accuracy Improvement Over Time

```
Programme 1:  AI match accuracy = 70%
Programme 2:  AI match accuracy = 78%  📈
Programme 3:  AI match accuracy = 85%  📈
Programme 4:  AI match accuracy = 91%  📈
Programme 5:  AI match accuracy = 94%  🚀
```

### Google Sheets Updated

- 🔮 `AI_Improvement_Log` — patterns learned + prompt version saved (roadmap)
- 🔮 `Match_History` — outcome correlation added to historical records (roadmap)

---

## 15. Google Sheets Database Structure

### Complete Tab List

**Currently Built (MVP) — 8 sheets:**

| Tab Name | Purpose | Data |
|----------|---------|------|
| `Entities` | All ecosystem actors (Role: Mentor, Company, Partner) | 33 rows |
| `Linkages` | Relationships between entities (Mentorship, Investment, Partnership) | 25 rows |
| `Interactions` | Email and meeting logs between linked entities | 50 rows |
| `Nudge_Log` | Audit trail of all nudge engine decisions | — |
| `Pending_Nudges` | Human-in-the-loop approval queue for nudge emails | — |
| `Match_History` | AI match scores, reasons, consent decisions, approval status | — |
| `Milestones` | Programme milestones per linkage (auto-created on approval) | 45 rows |
| `Outcomes` | Final programme results with success scores and attribution | 2 rows |

**Roadmap (future phases):**

| Tab Name | Purpose |
|----------|---------|
| `Monthly_Reports` | Monthly startup KPIs submitted via Google Forms |
| `AI_Improvement_Log` | Patterns learned + prompt versions |

---

### Key Fields Per Tab

**Entities tab (current):**

```
Entity_ID | Name | Role | Email | Industry_Tags | Expertise_Needs | Status
```

**Linkages tab (current):**

```
Linkage_ID | Entity_A_ID | Entity_B_ID | Linkage_Type | Start_Date | Last_Interaction_Date | Health_Score | Health_Status | Status
```

**Interactions tab (current):**

```
Interaction_ID | Linkage_ID | Interaction_Type | Date | Summary
```

**Match_History tab (current):**

```
Match_ID | Company_ID | Mentor_ID | Linkage_Type |
Match_Score | Match_Reason |
Company_Decision | Mentor_Decision | Reject_Reason |
Final_Status | Conflict_Flag | Created_At
```

**Milestones tab (current):**

```
Milestone_ID | Linkage_ID | Milestone_Name | Target_Date |
Completion_Status | Progress_Percent | Evidence_Link | Updated_At
```

**Outcomes tab (current):**

```
Outcome_ID | Linkage_ID | Company_ID | Mentor_ID |
Outcome_Status | Outcome_Date | Funding_Raised | Growth_Metric |
Success_Score | Match_Attribution | Mentor_Final_Rating |
Company_Final_Rating | Lessons_Learned | Created_At
```

**Monthly_Reports tab (roadmap):**

```
Report_ID | Linkage_ID | Month | Revenue | Team_Size |
Customers | Budget_Spent | Burn_Rate | Remaining_Budget |
Top_Win | Biggest_Challenge | Gemini_Analysis | Submitted_At
```

**AI_Improvement_Log tab (roadmap):**

```
id | programme_id | pattern_discovered |
pattern_confidence | affected_match_criteria |
prompt_version | accuracy_before |
accuracy_after | created_at
```

---

## 16. Admin Role & Dashboard

### Admin Dashboard Overview

```
ECOLINK AI — ADMIN DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROGRAMME HEALTH
Total active matches:       24
Auto-approved today:         3  ✅
Pending mentor response:     2  ⏳
Flagged for review:          1  ⚠️
At-risk matches:             2  🔴
Mentor overload alerts:      1  ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEEDS YOUR ATTENTION (3 items):

🚨 CONFLICT DETECTED
   TechBro Sdn Bhd ↔ Ahmad Rizal
   Reason: Same family name detected
   AI Score: 95% | Mentor: Accepted
   [ REVIEW & DECIDE → ]

⚠️ AT RISK — GreenAgri Sdn Bhd
   3 missed sessions | 0 contact in 2 weeks
   Mentor: Unresponsive
   Health Score: 28 🔴
   [ CONTACT BOTH PARTIES → ]

⚠️ MENTOR OVERLOAD — Priya Nair
   Currently: 5 active mentees
   Recommended max: 3
   [ REBALANCE WORKLOAD → ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROGRAMME OUTCOMES (this batch)
Funded:      3 startups  🎉
Graduated:   8 startups  🎓
Pivoted:     2 startups  🔄
Stalled:     1 startup   ⏸️
Churned:     1 startup   ❌
Ongoing:    11 startups  ⏳

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI MATCH PERFORMANCE
Current accuracy:     91%
vs last programme:    +6%  📈
Top performing mentor: Ahmad Razil (4.8 ⭐)
Most common flag:     Session frequency drop
```

### Admin Dashboard — Startup Side Visualisation

What the admin sees when drilling into a specific company:

```
STARTUP DETAIL — PayFlex Sdn Bhd (ENT-C01)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERVIEW
Industry:       FinTech, Payments
Stage:          Seed (was Pre-seed at registration)
Mentor:         Tan Wei Lin (ENT-M02)
Partner:        Cradle Fund (ENT-P01)
Health Score:   88 🟢
Programme:      CIP Coach & Grow

MILESTONE PROGRESS        ████████░░ 80%
┌─────────────────────────────────────────┐
│ ✅ Intro session          Week 1       │
│ ✅ Goals defined          Week 2       │
│ ✅ Pitch deck refined     Week 4       │
│ ✅ Grant submitted        Week 6       │
│ ✅ First customer         Week 8       │
│ ✅ RM10k MRR              Week 10      │
│ ✅ Fundraising started    Week 12      │
│ ⏳ Term sheet             Week 14      │
│ ○  Graduation             Week 16      │
└─────────────────────────────────────────┘

FINANCIAL HEALTH
Budget:     RM 250,000 allocated
Spent:      RM 145,000 (58%)
Burn rate:  RM 36,250/month
Runway:     2.9 months remaining
Revenue:    RM 15,000 MRR (↑ from RM 0)

ENGAGEMENT TIMELINE
May 14: Meeting — BNPL risk model review
May 12: Email — Series A term comparison
May 06: Meeting — GTM strategy session
Apr 28: Email — BNM intro
Apr 15: Meeting — Architecture review

GEMINI INSIGHT:
"PayFlex is on track for programme graduation.
Strong technical execution and mentor engagement.
Financial runway is tight — recommend exploring
bridge funding before Series A closes."
```

### Recommended Dashboard Visualisations (React)

| Chart | What It Shows | Why Useful |
|-------|--------------|------------|
| **Milestone Gantt** | Timeline of milestones with completion status | Shows progress at a glance |
| **Burn Rate Line** | Monthly spending vs budget over time | Predicts runway exhaustion |
| **Revenue Growth** | MRR trend over programme duration | Shows commercial traction |
| **Engagement Heatmap** | Meeting/email frequency by week | Spots engagement drops early |
| **Cohort Comparison** | This company vs programme average | Benchmarks performance |
| **Health Score Trend** | Health score over time (not just current) | Shows trajectory, not snapshot |

---

## 17. Tech Stack

| Layer | Technology | Why Chosen |
|-------|-----------|------------|
| 🤖 **AI Matching** | Gemini 2.0-flash (Google AI Studio) | Reads + understands profiles, generates personalised match reasons, learns from outcomes |
| 📊 **Database** | Google Sheets | Visible, shareable, Google technology, easy to demo live to judges |
| 📧 **Engagement Tracking** | Gmail API | Auto-detects interaction frequency |
| 📅 **Session Detection** | Google Calendar API | Auto-detects scheduled meetings |
| ☁️ **Backend** | Google Apps Script (automation, API) + Google Cloud Functions (AI matching) | Serverless, Google ecosystem, tight Sheets integration |
| 🖥️ **Frontend** | React + Vite (deployed on Firebase Hosting at ecolink-erm.web.app) | Fast, modern web dashboard |
| 🛠️ **Admin UI** | Google AppSheet (entity management, approvals) | No-code admin interface on top of Sheets |
| 🔔 **Notifications** | Gmail API | Automated email notifications |
| 📈 **Analytics** | Google Sheets + Gemini | Pattern analysis on outcome data |

### Why Google Tech Stack Scores You Points

> Judges are looking for: *"Meaningful and integral use of at least one Google Developer technology"*

You are using: **Gemini 2.0-flash + Google Sheets + Gmail API + Calendar API + Apps Script + Cloud Functions + AppSheet + Firebase Hosting** = maximum points on Google Technology Integration (15pts).

---

## 18. Judging Rubric Alignment

### Technical Implementation & Architecture (40 pts)

| Criterion | Pts | How EcoLink AI Addresses It |
|-----------|:---:|---------------------------|
| **Google Technology Integration** | 15 | Gemini 2.0-flash for matching + learning. Google Sheets as database. Gmail + Calendar APIs for engagement tracking. Apps Script + Cloud Functions for backend. AppSheet for admin. Firebase Hosting for frontend. Multiple Google technologies used meaningfully and integrally. |
| **AI Implementation Quality** | 10 | AI is essential — without it, matching is manual. Model choice justified (Gemini for natural language profile understanding). Ethical considerations: bias mitigation via email consent (both parties must agree), transparency via visible match scores and reasons, hallucination mitigation via structured prompts. |
| **Working Demo & UI/UX** | 10 | Live registration → Google Sheets → matching → dashboard flow demonstrable in real-time. No critical bugs. Clean, intuitive interface for all 3 user types. |
| **AI Model Performance** | 5 | Match accuracy improves per programme (tracked in AI_Improvement_Log). Rejection feedback reduces bad recommendations. Outcome patterns reduce hallucinated matches. |

---

### Business Innovation & Problem Solving (40 pts)

| Criterion | Pts | How EcoLink AI Addresses It |
|-----------|:---:|---------------------------|
| **Originality & Creativity** | 10 | Email consent model (both parties must agree) is novel. Treating ecosystem relationships as programmable, reusable entities is directly from the problem statement. Self-improving matching loop differentiates from existing tools. |
| **Problem-Solution Fit** | 15 | Directly solves Cradle Fund's exact problem. Clear stakeholders: programme admins, mentors, startups, partners. Solution is practical — built on tools they already use (Google Workspace). |
| **Scalability** | 10 | Cloud-based — works across Malaysia, Singapore, Indonesia simultaneously. Flywheel effect — more data = smarter AI = better matches = more programmes. Business model: SaaS per programme or per organisation. |
| **Deployment Readiness** | 5 | Firebase Hosting (ecolink-erm.web.app) + Apps Script Web App + AppSheet live. Google Sheets as accessible database. Clear path from prototype to production: add auth, connect real Cradle data, train on historical outcomes. |

---

### Presentation & Pitching — Finals Only (20 pts)

| Criterion | Pts | Tips |
|-----------|:---:|------|
| **Clarity & Structure** | 10 | Use this pipeline document as your story structure. Problem → Solution → Demo → Flywheel → Impact. |
| **Visual Appeal** | 10 | Live demo showing data flow in real-time is more impressive than slides. Show Google Sheets updating live. |

---

## 19. The Flywheel Effect

This is your biggest story for judges:

```
┌─────────────────────────────────────────────┐
│           ECOLINK AI FLYWHEEL               │
│                                             │
│   MORE PROGRAMMES JOIN                      │
│           ↑                                 │
│   HIGHER SUCCESS RATES                      │
│           ↑                                 │
│   BETTER MENTOR-STARTUP PAIRS               │
│           ↑                                 │
│   SMARTER AI MATCHING ←──────────────┐      │
│           ↑                          │      │
│   MORE OUTCOME DATA ─────────────────┘      │
│           ↑                                 │
│   MORE ACTIVE PROGRAMMES                    │
│           ↑                                 │
│   MORE PROGRAMMES JOIN                      │
│                                             │
│   More data = Smarter AI                   │
│   Smarter AI = Better matches              │
│   Better matches = Higher success          │
│   Higher success = More programmes         │
│   More programmes = More data  🔄          │
└─────────────────────────────────────────────┘
```

### Match Accuracy Improves Automatically

```
Programme 1:   70% accuracy  ░░░░░░░
Programme 2:   78% accuracy  ░░░░░░░░
Programme 3:   85% accuracy  ░░░░░░░░░
Programme 4:   91% accuracy  ░░░░░░░░░░
Programme 5:   94% accuracy  ░░░░░░░░░░░  🚀
```

---

## 20. Pitch Script for Judges

### Opening (30 seconds)
>
> *"Cradle Fund runs programmes for hundreds of Malaysian startups. But right now, every mentor match, every programme assignment, every partner linkage is done manually — by a human staff member, from scratch, every single time. This creates bottlenecks, inconsistency, and a total inability to learn from past successes. EcoLink AI fixes this."*

### The Solution (45 seconds)
>
> *"EcoLink AI treats ecosystem relationships as first-class, programmable entities. When a startup registers, Gemini reads their profile and instantly recommends the top 3 mentors — with personalised explanations for each match. The startup chooses. The mentor confirms. The system auto-approves. No human bottleneck."*

### The Intelligence Layer (45 seconds)
>
> *"But the real power is what happens next. We track every session, every milestone, every growth metric. If a relationship goes quiet — we catch it before it dies. When a programme ends, we record the outcome — funded, graduated, churned — and feed those patterns back into Gemini. The system learns which mentor types produce the best outcomes for which startup types. Every programme makes the next one smarter."*

### The Flywheel (30 seconds)
>
> *"This creates a flywheel. More programmes equals more data. More data equals smarter AI. Smarter AI equals better matches. Better matches equal higher success rates. Higher success rates attract more programmes. And it keeps compounding."*

### Closing (30 seconds)
>
> *"We are not just building a matching tool. We are building ecosystem intelligence infrastructure — the kind that Cradle Fund can use today and scale across Southeast Asia tomorrow. EcoLink AI: where every relationship is programmable, every outcome is learnable, and every programme makes the next one better."*

---

## 20b. Time Saved — Manual vs EcoLink AI

### The Manual Process (Current State at Cradle Fund)

| Task | Manual Time | Frequency |
|------|-----------|-----------|
| Review startup application | 30 min per startup | Per application |
| Search for suitable mentor | 2-3 hours per match | Per startup |
| Email back-and-forth to arrange | 3-5 days per match | Per startup |
| Track engagement manually | 1 hour per week per match | Ongoing |
| Compile monthly reports | 4-6 hours | Monthly |
| Identify at-risk relationships | 2-3 hours (if noticed at all) | Weekly |
| End-of-programme outcome review | 3-4 hours per startup | Per completion |

### With EcoLink AI

| Task | EcoLink AI Time | How |
|------|---------------|-----|
| Review startup application | Instant — data in Sheets | AppSheet form |
| Match to mentor | 3 seconds — Gemini AI | Automated |
| Consent and agreement | 1-2 days — email system | Automated |
| Track engagement | Real-time — Gmail + Calendar API | Automated |
| Monthly reports | Instant — Google Forms + Gemini | Automated analysis |
| Identify at-risk | Real-time — Health Score monitoring | Automated alerts |
| Outcome review | Auto-generated — Gemini summary | Automated |

### Time Saved Per Programme (25 startups)

```
MANUAL:
Matching:          25 × 3 hours    = 75 hours
Consent emails:    25 × 3 days     = 75 days elapsed
Engagement track:  25 × 1hr × 16w  = 400 hours
Monthly reports:   4 × 6 hours     = 24 hours
At-risk detection: 16 × 3 hours    = 48 hours
Outcome review:    25 × 4 hours    = 100 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:             ~647 staff-hours per programme

ECOLINK AI:
Matching:          25 × 3 seconds  = ~1 minute
Consent:           Automated emails = 1-2 days
Engagement:        Fully automated  = 0 hours
Reports:           Auto-generated   = 0 hours
At-risk:           Real-time alerts = 0 hours
Outcome:           Gemini summary   = 0 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:             ~2 staff-hours (admin exceptions only)

TIME SAVED:        645 hours per programme
                   = ~80 working days
                   = 4 months of one full-time staff
```

### What This Means for Cradle Fund

> *"For every programme cycle of 25 startups, EcoLink AI saves approximately 645 staff-hours — equivalent to 4 months of a full-time employee. This allows Cradle Fund to run 3-4x more programmes simultaneously with the same team, or redirect staff to higher-value strategic work like policy development and investor relations."*

---

## 📋 Pre-Submission Checklist

### Before 9am, 17 May 2026

**Deliverables:**

- [ ] Presentation slides (PDF)
- [ ] 3-minute pitching/demo video
- [ ] GitHub repo link with working prototype
- [ ] Google Form questionnaire fully answered

**Questionnaire answers ready:**

- [ ] Elevator pitch written
- [ ] Google technologies used + justification
- [ ] AI components + ethical considerations
- [ ] Tech stack + deployment approach
- [ ] Problem alignment answered clearly
- [ ] Business model described
- [ ] Scalability plan included
- [ ] Path from prototype to production outlined

**Demo ready:**

- [ ] Registration form works → data appears in Google Sheets live
- [ ] Gemini matching returns Top 3 results
- [ ] Match cards show personalised reasons
- [ ] Admin dashboard shows programme health
- [ ] Session logging works
- [ ] Growth metrics display correctly
- [ ] No critical bugs in demo flow

---

*Document compiled for MyHack 2026 — Build with AI KL*
*EcoLink AI | GDG Kuala Lumpur | Sunway University | 16–17 May 2026*
*Problem statement by Cradle Fund Malaysia*
