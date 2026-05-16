# EcoLink AI — Slide Content
### MyHack 2026 | Drop into Canva (https://www.canva.com/design/DAHJ2BnbhmI/...)

Each section below = one slide. Headlines are short and bold for the title field; bullets are 1 line each. Visual prompts describe what to place where.

---

## Slide 1 — Cover

**Title:**
EcoLink AI

**Subtitle:**
Automating Ecosystem Linkages as Programmable Entities

**Below subtitle:**
Team: Yoke Yau · Jing Hong · Dan Syafiq · Farah Safiyyah
MyHack 2026 — Cradle Fund × Google × GDG KL

**Visual:**
Center the EcoLink "E" logo from the React app sidebar (green gradient on dark). Around it, faint orbiting dots representing relationships. Background: dark navy / black.

**Speaker notes (5s):**
*"Hi, we're EcoLink AI — and we replace manual ecosystem coordination with AI-managed, programmable relationships."*

---

## Slide 2 — The Problem

**Title:**
Relationships Run on Spreadsheets

**Body (3 bullets, big):**
- **75 hours** to manually pair 25 startups with mentors (Cradle Fund)
- **One staff member** owns the entire matching workflow
- **Zero memory** — every new programme starts from scratch

**Visual:**
Left side: cluttered spreadsheet screenshot or icon, sticky notes, calendar invites overlapping.
Right side: arrow → tired admin emoji 🥱 or stressed icon.

Bottom strip: *"Across countries, every programme reinvents this."*

**Speaker notes (15s):**
*"Imagine pairing 25 startups with mentors — manually. Cradle Fund's admins spend 3 hours per match. 75 hours, one staff member, every cohort, every country. And when the programme ends, all that knowledge dies with the spreadsheet."*

---

## Slide 3 — Our Solution

**Title:**
Relationships as First-Class Entities

**Body (3 pillars in horizontal cards):**

| 🔗 MATCH | 📊 TRACK | 🧠 LEARN |
|---|---|---|
| AI-suggested pairings with reasoning | Auto-detected interactions via Gmail + Calendar | Outcome data feeds back into matching |

**Below pillars:**
*"Every relationship is now a structured object — defined, automated, governed, reused."*

**Visual:**
Three large icons (handshake, graph trending up, brain with circular arrow). Connected by an animated dotted line forming a triangle. Background: subtle Google-themed gradient.

**Speaker notes (12s):**
*"We treat every mentor-company pairing as a first-class entity in the system — not a row in someone's spreadsheet. It has an ID, a type, a lifecycle, a health score, and an outcome. Match, track, and learn — automated end-to-end."*

---

## Slide 4 — The Pipeline

**Title:**
10 Phases. Zero Manual Steps Where It Counts.

**Visual (this slide is mostly diagram):**
Horizontal flow diagram. 10 nodes connected by arrows:

```
[Phase 0]     [Phase 1]     [Phase 2]     [Phase 3]     [Phase 4]
Register      AI Matching   Email          Auto-           Programme
              (Gemini)      Consent        Approval        Begins
   │             │             │              │              │
   ▼             ▼             ▼              ▼              ▼
[Phase 5]     [Phase 6]     [Phase 7]     [Phase 8]     [Phase 9-10]
Engagement    Milestone     Nudge         Outcome        AI Learning
Tracking      Tracking      Engine        Recording      Loop
```

**Color code each phase:**
- Green = automated (no human input)
- Blue = AI step (Gemini)
- Yellow = human review/approval

Most phases should be green or blue.

**Bottom strip:**
*"Programme owner only intervenes at exception points. Everything else is automatic."*

**Speaker notes (15s):**
*"Here's the full flow. Ten phases from registration to AI learning. Notice the colors — green is fully automated, blue is AI-driven, yellow is human approval. Most of the pipeline is green or blue. The programme owner only steps in for exceptions."*

---

## Slide 5 — Phase 0: Registration

**Title:**
Register Once. Profile Travels.

**Left side:**
Screenshot of the AppSheet registration form OR the React `/register/company` form. Highlight: Name, Role, Industry tags, Expertise/Needs.

**Right side bullets:**
- 60-second sign-up via AppSheet or web app
- Profile structured with industry, stage, needs — Gemini-ready
- Same profile reusable across multiple programmes — no re-registration

**Visual:**
Show a Google Sheets tab opening live with the new row appearing — make it animated/highlighted.

**Speaker notes (12s):**
*"Phase zero — registration. Companies, mentors, and partners fill a structured form. The profile lands in Google Sheets instantly. And it travels — same profile usable across every programme they join."*

---

## Slide 6 — Phase 1: AI Matching

**Title:**
Gemini Doesn't Just Match — It Explains.

**Body (2 columns):**

Left: Screenshot of AppSheet "Pending Approval" tab with two pending matches.
Each row shows:
- Startup name + Mentor name
- Match Score: 92% / 88%
- Match Reason (short text)

Right side bullets:
- **gemini-2.5-flash** scores every viable pair
- Returns **top 3** with confidence + plain-English reasoning
- **Under 3 seconds** end-to-end
- Admin reviews → one-click approval

**Bottom callout strip:**
*"No black-box AI. Every recommendation is auditable."*

**Speaker notes (15s):**
*"Phase one — AI matching. We pass every entity profile to Gemini 2.5 Flash. It scores all viable pairs and returns the top three — each with a confidence score and a plain-English reason. The admin sees the reasoning, not just the recommendation. One click to approve."*

---

## Slide 7 — Phase 5: Health Tracking

**Title:**
Every Relationship Has a Pulse.

**Visual (left):**
Three relationship cards stacked:

🟢 **PayFlex ↔ Tan Wei Lin** — Health: 87
*Active engagement — meetings weekly*

🟡 **MedikAI ↔ Dr. Lim** — Health: 55
*Sessions slowing down*

🔴 **BatuData ↔ Vikram** — Health: 12
*45 days no contact → triggers nudge*

**Right bullets:**
- **Gmail API** scans email threads between linked entities
- **Calendar API** detects shared meetings
- **Apps Script cron** at 6 AM daily updates Health_Score
- **3 health bands**: Healthy / At-Risk / Dormant

**Speaker notes (15s):**
*"Phase five — every relationship has a live health score. Gmail and Calendar APIs detect activity automatically. The cron runs daily at 6 AM. Green is healthy, yellow is slipping, red triggers the nudge engine."*

---

## Slide 8 — Phase 7: Nudge Engine (Person C — your slice)

**Title:**
The Immune System for Relationships

**Visual (left):**
Screenshot of an actual AI-generated nudge email in Gmail (use the one Dan got — "Hi Dan, ... reconnect with Farah ..."). Highlight: personalized partner name + suggested action grounded in expertise.

**Right side bullets:**
- Daily 9 AM scan for dormant linkages (Health_Score < 40 OR 30+ days)
- **Gemini drafts personalized re-engagement email** per recipient
- Programme owner ticks ✅ in `Pending_Nudges` sheet
- 15-min cron auto-dispatches approved nudges
- Every action logged in `Nudge_Log`

**Below bullets, callout strip:**
*"AI proposes. Human disposes. Nothing sends without approval."*

**Speaker notes (15s):**
*"Phase seven — the nudge engine. When a relationship goes quiet, Gemini drafts a personal re-engagement email — referencing each entity's actual expertise. The admin ticks approve in the sheet and walks away. Within fifteen minutes, the email goes out. Every action is logged for audit."*

---

## Slide 9 — Google Tech Stack

**Title:**
Built Entirely on Google

**Visual:**
8-tile grid (2 rows × 4 cols), each tile = a Google product logo + one-line role:

| 🤖 Gemini 2.5 Flash | 📊 Google Sheets | 📧 Gmail API | 📅 Calendar API |
|---|---|---|---|
| Matching + Nudge AI | Live database (9 tabs) | Auto-detect interactions | Detect shared meetings |

| ⚡ Apps Script | ☁️ Cloud Functions | 📱 AppSheet | 🔥 Firebase Hosting |
|---|---|---|---|
| Cron jobs + automation | Serverless endpoints | No-code admin UI | React web app deploy |

**Bottom strip:**
*"8 Google products. Zero non-Google dependencies. Native integration end-to-end."*

**Speaker notes (10s):**
*"Eight Google products. Zero non-Google dependencies. From Gemini to Sheets to AppSheet to Firebase — every layer is native Google."*

---

## Slide 10 — The Flywheel

**Title:**
More Programmes. Smarter Matches.

**Visual (center):**
Big circular flywheel diagram with 4 spokes:

```
        REGISTER
            ↓
        AI MATCH
            ↓
       TRACK + NUDGE  ← (Person C)
            ↓
    OUTCOME RECORDED
            ↓
     GEMINI LEARNS
            ↓
    NEXT MATCH SMARTER
            ↑________________│
```

**Around the flywheel, projection labels (call out these are projected):**
- Programme 1: Baseline match accuracy
- Programme 3: Pattern data accumulates
- Programme 5: Outcome-tuned recommendations

**Bottom strip:**
*"Every cycle compounds. Every cohort feeds the next."*

**Speaker notes (15s):**
*"This is the flywheel. Every relationship outcome — funded, graduated, churned — feeds back into the Gemini prompt as historical context. The system gets smarter with every programme. More cycles, more data, better matches."*

**Note for presenter: avoid stating specific percentage numbers as measured fact — say "projected accuracy curve" if asked.**

---

## Slide 11 — Impact

**Title:**
4 Months of FTE — Saved Per Programme

**Big number front and center:**
**645 staff-hours** saved per programme cycle

**Below:**
*= 4 months of a full-time employee*
*= RM 28,000+ in cost per cycle (at MYR 50/hr)*

**Side breakdown:**
- Matching: −75 hrs (from 75 to 0)
- Engagement tracking: −150 hrs
- Outreach + nudges: −210 hrs
- Outcome reporting: −210 hrs

**Bottom strip:**
*"For Cradle Fund. For MaGIC. For MDEC. For every ecosystem operator in SEA."*

**Speaker notes (15s):**
*"The bottom line: 645 staff-hours saved per programme cycle. That's four months of a full-time employee. We're not just building a tool — we're freeing the people who run innovation ecosystems to actually grow them."*

---

## Slide 12 — Closing

**Title:**
EcoLink AI

**Three lines, large:**
**Every relationship is programmable.**
**Every outcome is learnable.**
**Every programme makes the next one better.**

**Below — Live URLs (large, clickable in PDF):**
🌐 **Web app:** https://ecolink-erm.web.app
🛠️ **Admin app:** https://appsheet.com/start/7a6e9f3e-...
💻 **GitHub:** https://github.com/lowjinghong29/MyHack2026

**Bottom right corner:**
*Built in 24 hours · MyHack 2026 · Team EcoLink AI*

**Visual:**
Same EcoLink logo as cover slide. Subtle animation of relationship nodes connecting.

**Speaker notes (10s):**
*"EcoLink AI. Every relationship is programmable. Every outcome is learnable. Every programme makes the next one better. Thank you."*

---

## Visual style guide

- **Background:** Dark navy / near-black (matches the React app's dark theme)
- **Primary accent:** Green `#10b981` (the React app's accent color)
- **Secondary accents:** Yellow `#f59e0b` for at-risk states; Red `#ef4444` for dormant; Blue `#3b82f6` for AI/info
- **Font:** Plus Jakarta Sans (already used in the React app) or Inter
- **Spacing:** Generous. One idea per slide. Don't crowd.
- **Screenshots:** Use real screenshots from the live app (AppSheet + ecolink-erm.web.app), not mockups
- **Logos:** Google product logos available at https://about.google/brand-resource-center/

---

## How to use this in Canva

1. Open the Canva design at the link in the team chat
2. For each slide in the deck:
   - Copy the **Title** to the slide title field
   - Copy the **Body** / **Bullets** to the content area
   - Replace the placeholder image with the **Visual** description (use a real screenshot or generate via Canva's stock library)
   - Speaker notes go in the speaker notes pane at the bottom

If you skip any slide, that's fine — slides 2, 6, 8, 10, 11, 12 are the strongest. Slides 4 + 9 are diagram-heavy and benefit from polish.

---

*Drafted overnight by Claude for the EcoLink AI team. Edit freely.*
