# Person A — Platform Lead Guide

## Role
You own the data foundation. The rest of the team (B, C, D) cannot start writing scripts until your Google Sheet schema is live and locked.

---

## Step 1 — Create the Google Sheet

Create a new Google Sheet with **3 tabs** using these exact column names:

**Tab: `Entities`**
| Column | Type | Notes |
|---|---|---|
| `Entity_ID` | UUID | Primary Key — auto-generate on row creation |
| `Name` | String | |
| `Role` | Enum | `Mentor`, `Company`, `Partner`, `Admin` |
| `Email` | String | |
| `Industry_Tags` | String | Comma-separated values |
| `Expertise_Needs` | Text | Free-text description |
| `Status` | Enum | `Active`, `Dormant`, `Churned` |

**Tab: `Linkages`**
| Column | Type | Notes |
|---|---|---|
| `Linkage_ID` | UUID | Primary Key |
| `Entity_A_ID` | String | Foreign Key → `Entities` |
| `Entity_B_ID` | String | Foreign Key → `Entities` |
| `Linkage_Type` | Enum | `Mentorship`, `Partnership`, `Investment` |
| `Start_Date` | Date | |
| `Last_Interaction_Date` | Date | Updated by Person B's script |
| `Health_Score` | Integer | 1–100 |

**Tab: `Interactions`**
| Column | Type | Notes |
|---|---|---|
| `Interaction_ID` | UUID | Primary Key |
| `Linkage_ID` | String | Foreign Key → `Linkages` |
| `Interaction_Type` | Enum | `Email`, `Meeting`, `AppSheet_Note` |
| `Date` | Timestamp | |
| `Summary` | Text | Auto-filled by Person B's script |

---

## Step 2 — Connect to AppSheet

1. Go to [appsheet.com](https://appsheet.com)
2. Create New App → Start with your data → Google Sheets
3. Select your Sheet — AppSheet will import all 3 tabs as separate tables
4. Verify all column types are correctly detected

---

## Step 3 — Configure References (Foreign Keys)

In AppSheet's **Data → Columns** settings, set the following Reference types:

| Table | Column | Reference Target |
|---|---|---|
| `Linkages` | `Entity_A_ID` | `Entities` |
| `Linkages` | `Entity_B_ID` | `Entities` |
| `Interactions` | `Linkage_ID` | `Linkages` |

This enforces relational integrity — AppSheet will validate that values exist in the parent table before saving.

---

## Step 4 — Build AppSheet Views

Create these 3 views under **UX → Views**:

| View Name | View Type | Data Source | Filter / Notes |
|---|---|---|---|
| `Admin Dashboard` | Dashboard | All tables | Summary cards: entity count, active linkage count, avg health score |
| `Active Linkages` | Table | `Linkages` | Filter: `Health_Score > 0` and `Linkage_Type` is set |
| `Entity Directory` | Table | `Entities` | Add filter by `Role` and `Status` |

---

## Step 5 — Handoff (Team Gate)

Once Steps 1–4 are done, share the following with the team before they start:

- **Google Sheet URL** — with edit access granted to the shared service account
- **AppSheet App Link** — so the team can test data entry
- **Schema lock confirmation** — post in team chat that columns are final; any changes must be agreed by all

> Person B and C need the Sheet URL to connect their `clasp` Apps Script project.
> Person D needs the Sheet URL to read the `Entities` table for Gemini matching.

---

## Step 6 — Late Stage: Pending Approvals View (with Person D)

After Person D completes the Gemini matchmaking function, come back to AppSheet and add:

| View Name | View Type | Data Source | Notes |
|---|---|---|---|
| `Pending Approvals` | Table | `Pending_Approvals` tab (created by Person D) | Admin clicks to approve → creates a new row in `Linkages` |

Coordinate with Person D on the exact column names they write to the `Pending_Approvals` tab.

---

## Priority Order

```
[1] Sheet schema (3 tabs, all columns) ──────────────────────────────► lock schema
[2] AppSheet connection + column type verification
[3] Configure References (Entity_A_ID, Entity_B_ID, Linkage_ID)
[4] Build 3 views (Admin Dashboard, Active Linkages, Entity Directory)
[5] Share Sheet URL + AppSheet link → unblock B, C, D
[6] Later: add Pending Approvals view with Person D
```
