# Ecosystem Relationship Management (ERM) System
## Master Implementation Plan

### 1. Project Objective
To build an automated, scalable Ecosystem Relationship Management (ERM) system that replaces manual tracking of mentors, companies, and partners. The system will establish strict relational logic, automate the logging of historical interactions, enable AI-driven entity matchmaking, and passively trigger engagement nudges to prevent fragile linkages. 

### 2. Architecture & Technology Stack
The platform leverages the Google ecosystem to minimize custom web development overhead while maintaining high extensibility.

* **Database (MVP):** Google Sheets (Acting as the relational backend).
* **Database (Scale):** Google BigQuery or Firebase (for larger datasets and complex querying).
* **Application Interface:** Google AppSheet (Provides role-based dashboards, data validation, and CRUD operations).
* **Automation & Sync:** Google Apps Script (via `clasp` CLI for local development) and Google Cloud Functions.
* **AI Engine:** Gemini API via Google AI Studio (For semantic matching of ad-hoc requests).
* **Intake & Triggers:** Google Forms / AppSheet Forms, Gmail API, and Google Calendar API.

---

### 3. Core Data Schema (Relational Logic)

Implement the following strict relational tables in the database (Google Sheets):

**Table 1: Entities (Profiles)**
* `Entity_ID` (UUID - Primary Key)
* `Name` (String)
* `Role` (Enum: Mentor, Company, Partner, Admin)
* `Email` (String)
* `Industry_Tags` (Comma-separated string or Array)
* `Expertise_Needs` (Text description)
* `Status` (Enum: Active, Dormant, Churned)

**Table 2: Linkages (Relationships)**
* `Linkage_ID` (UUID - Primary Key)
* `Entity_A_ID` (Foreign Key -> Entities)
* `Entity_B_ID` (Foreign Key -> Entities)
* `Linkage_Type` (Enum: Mentorship, Partnership, Investment)
* `Start_Date` (Date)
* `Last_Interaction_Date` (Date)
* `Health_Score` (Integer: 1-100)

**Table 3: Interactions (History)**
* `Interaction_ID` (UUID - Primary Key)
* `Linkage_ID` (Foreign Key -> Linkages)
* `Interaction_Type` (Enum: Email, Meeting, AppSheet_Note)
* `Date` (Timestamp)
* `Summary` (Text)

---

### 4. Phased Implementation Steps

#### Phase 1: Foundation & Platform Logic (AppSheet + Sheets)
**Goal:** Eliminate manual spreadsheets and enforce strict relationship logic.
1.  Initialize a new Google Sheet with the schema defined in Section 3.
2.  Connect the Google Sheet to **Google AppSheet**.
3.  Configure AppSheet References: Link `Entity_A_ID` and `Entity_B_ID` in the `Linkages` table to the `Entities` table to enforce foreign-key constraints.
4.  Build basic Views: `Admin Dashboard`, `Active Linkages`, and `Entity Directory`.

#### Phase 2: Solving "Lost History" (Apps Script + Workspace APIs)
**Goal:** Passively capture interaction data without manual data entry.
1.  Initialize a local Apps Script project using `clasp`.
2.  Write an Apps Script service that connects to the Gmail API and Google Calendar API.
3.  **Logic:** Create a daily trigger that scans the calendars and emails of registered `Entities`.
4.  If a meeting or email thread involves both `Entity_A` and `Entity_B` of an active `Linkage_ID`, log a new record in the `Interactions` table and update the `Last_Interaction_Date` in the `Linkages` table.

#### Phase 3: Solving "Fragile Engagement" (Automated Nudges)
**Goal:** Prevent relationships from going dormant.
1.  Create an Apps Script time-driven trigger (Cron job running daily).
2.  Query the `Linkages` table for records where `Last_Interaction_Date` is older than 30 days and `Status` is Active.
3.  **Action:** Utilize the `MailApp` or `GmailApp` service to send a templated check-in email to both entities.
4.  Alternatively, send a webhook alert to a Google Chat space for platform administrators to intervene.

#### Phase 4: Solving "Ad-Hoc Relations" (Gemini API Matchmaking)
**Goal:** Replace manual searching with AI-driven recommendations.
1.  Set up a Google Cloud Function (Node.js/Python) or an Apps Script endpoint.
2.  Integrate the **Gemini API** using your Google AI Studio API key.
3.  **Prompt Engineering:** When a new `Entity` submits an intake form requesting a connection, pass their `Expertise_Needs` and the JSON dump of the current `Entities` table to Gemini.
4.  Ask Gemini to return a structured JSON array of the top 3 recommended `Entity_ID`s with a brief `Match_Reason`.
5.  Surface these recommendations in the AppSheet Admin Dashboard as "Pending Linkage Approvals".

---

### 5. Getting Started
* Review this document and confirm understanding of the 3-table schema.
* Write the Apps Script `.js` files locally for Phase 2 and Phase 3, ensuring they are structured properly to be pushed via `clasp`.
* Draft the Gemini API wrapper function in Python or Node.js for Phase 4.
