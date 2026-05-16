# Wire Frontend to Live Data & Deploy

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded sample data in the React frontend with live Google Sheets data served via Apps Script Web App, wire AI Match to the real Gemini Cloud Function, and deploy the frontend to Firebase Hosting.

**Architecture:** Apps Script gets a new `doGet()` web endpoint that returns Entities/Linkages/Interactions as JSON. The React frontend replaces static imports with `fetch()` calls to this endpoint. AI Match calls the deployed Cloud Function. Frontend is built and deployed to Firebase Hosting.

**Tech Stack:** Google Apps Script (web app), React 19, Vite 8, Firebase Hosting, Google Cloud Functions, Gemini 2.0-flash

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `apps-script/src/main.gs` | Add `doGet()` web app endpoint returning JSON |
| Create | `frontend/src/lib/api.js` | Centralized fetch helpers for Apps Script API + Cloud Function |
| Delete | `frontend/src/lib/sampleData.js` | Replaced by live API calls |
| Modify | `frontend/src/pages/Dashboard.jsx` | Fetch live data, loading states |
| Modify | `frontend/src/pages/Entities.jsx` | Fetch live entities |
| Modify | `frontend/src/pages/Linkages.jsx` | Fetch live linkages + entity names |
| Modify | `frontend/src/pages/LinkageDetail.jsx` | Fetch linkage + entities + interactions by ID |
| Modify | `frontend/src/pages/Interactions.jsx` | Fetch live interactions |
| Modify | `frontend/src/pages/AIMatch.jsx` | Call real Gemini Cloud Function |
| Create | `frontend/.env` | API URLs (Apps Script web app URL, Cloud Function URL) |
| Create | `frontend/firebase.json` | Firebase Hosting config |
| Create | `frontend/.firebaserc` | Firebase project binding |

---

### Task 1: Apps Script — Add `doGet()` Web App Endpoint

**Files:**
- Modify: `apps-script/src/main.gs`

This adds a `doGet(e)` function that serves sheet data as JSON. When deployed as a web app, any `GET` request with a `?sheet=Entities` (or `Linkages`, `Interactions`) param returns that sheet's data.

- [ ] **Step 1: Add doGet function to main.gs**

Add this to the end of `apps-script/src/main.gs`:

```javascript
/**
 * Web App endpoint — serves sheet data as JSON.
 * Deploy as: Execute as "Me", Access "Anyone".
 *
 * Query params:
 *   ?sheet=Entities | Linkages | Interactions
 *   ?sheet=all  (returns all three)
 *   ?sheet=Linkages&id=LNK-001  (single linkage with its interactions)
 */
function doGet(e) {
  var sheetParam = (e && e.parameter && e.parameter.sheet) || 'all';
  var idParam = e && e.parameter && e.parameter.id;
  var result = {};

  if (sheetParam === 'all') {
    result.entities = getSheetData(SHEETS.ENTITIES);
    result.linkages = getSheetData(SHEETS.LINKAGES);
    result.interactions = getSheetData(SHEETS.INTERACTIONS);
  } else if (sheetParam === 'Linkages' && idParam) {
    var linkages = getSheetData(SHEETS.LINKAGES);
    var match = linkages.filter(function(l) { return l.Linkage_ID === idParam; });
    result.linkage = match.length > 0 ? match[0] : null;
    result.interactions = getSheetData(SHEETS.INTERACTIONS).filter(function(i) {
      return i.Linkage_ID === idParam;
    });
  } else {
    var validSheets = ['Entities', 'Linkages', 'Interactions'];
    if (validSheets.indexOf(sheetParam) === -1) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid sheet' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    result[sheetParam.toLowerCase()] = getSheetData(sheetParam);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Deploy to Apps Script**

```bash
cd apps-script
clasp push
```

- [ ] **Step 3: Deploy as Web App in Apps Script editor**

Run `clasp open` to open the editor, then:
1. Click **Deploy** → **New Deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy**
6. Copy the Web App URL (looks like `https://script.google.com/macros/s/XXXXX/exec`)

- [ ] **Step 4: Test the endpoint**

Open in browser:
- `<WEB_APP_URL>?sheet=all` — should return JSON with entities, linkages, interactions arrays
- `<WEB_APP_URL>?sheet=Entities` — should return `{ "entities": [...] }`
- `<WEB_APP_URL>?sheet=Linkages&id=LNK-001` — should return single linkage + its interactions

- [ ] **Step 5: Commit**

```bash
git add apps-script/src/main.gs
git commit -m "feat(api): add doGet web app endpoint for live data serving"
```

---

### Task 2: Frontend — Create API Layer

**Files:**
- Create: `frontend/.env`
- Create: `frontend/src/lib/api.js`

- [ ] **Step 1: Create .env with API URLs**

Create `frontend/.env`:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_GEMINI_MATCHER_URL=https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/geminiMatcher
```

Replace the URLs with the actual deployed endpoints.

- [ ] **Step 2: Create api.js**

Create `frontend/src/lib/api.js`:

```javascript
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const MATCHER_URL = import.meta.env.VITE_GEMINI_MATCHER_URL;

/**
 * Fetches all data (entities, linkages, interactions) from the Apps Script web app.
 */
export async function fetchAllData() {
  const res = await fetch(`${API_URL}?sheet=all`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

/**
 * Fetches a single sheet's data.
 * @param {'Entities'|'Linkages'|'Interactions'} sheet
 */
export async function fetchSheet(sheet) {
  const res = await fetch(`${API_URL}?sheet=${sheet}`);
  if (!res.ok) throw new Error(`Failed to fetch ${sheet}`);
  return res.json();
}

/**
 * Fetches a single linkage with its interactions.
 * @param {string} linkageId e.g. "LNK-001"
 */
export async function fetchLinkageDetail(linkageId) {
  const res = await fetch(`${API_URL}?sheet=Linkages&id=${encodeURIComponent(linkageId)}`);
  if (!res.ok) throw new Error('Failed to fetch linkage detail');
  return res.json();
}

/**
 * Calls the Gemini Matcher Cloud Function.
 * @param {string} entityId
 * @param {'Mentorship'|'Partnership'|'Investment'} matchType
 */
export async function requestAIMatch(entityId, matchType) {
  const res = await fetch(MATCHER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entityId, matchType }),
  });
  if (!res.ok) throw new Error('AI match request failed');
  return res.json();
}

/**
 * Helper: build entity lookup map from array.
 */
export function buildEntityMap(entities) {
  const map = {};
  entities.forEach(e => { map[e.Entity_ID] = e; });
  return map;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/.env frontend/src/lib/api.js
git commit -m "feat(api): add frontend API layer for Apps Script and Cloud Function"
```

---

### Task 3: Frontend — Wire Dashboard to Live Data

**Files:**
- Modify: `frontend/src/pages/Dashboard.jsx`

Replace the static `sampleData` import with a `useEffect` fetch. Add loading state.

- [ ] **Step 1: Rewrite Dashboard.jsx**

Replace the entire contents of `frontend/src/pages/Dashboard.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Link2, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

const colorMap = {
  'g-blue': { text: 'text-g-blue', bg: 'bg-g-blue', border: 'bg-g-blue' },
  'g-green': { text: 'text-g-green', bg: 'bg-g-green', border: 'bg-g-green' },
  'g-yellow': { text: 'text-g-yellow', bg: 'bg-g-yellow', border: 'bg-g-yellow' },
  'g-red': { text: 'text-g-red', bg: 'bg-g-red', border: 'bg-g-red' },
};

const badgeStyles = {
  'g-green': 'bg-g-green/15 text-g-green',
  'g-blue': 'bg-g-blue/15 text-g-blue',
  'g-yellow': 'bg-g-yellow/15 text-g-yellow',
  'g-red': 'bg-g-red/15 text-g-red',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData()
      .then(setData)
      .catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-10 text-g-red text-sm">Failed to load data</div>;
  }

  const { entities, linkages, interactions } = data;
  const entityMap = buildEntityMap(entities);
  const avgHealth = linkages.length > 0
    ? Math.round(linkages.reduce((a, l) => a + Number(l.Health_Score || 0), 0) / linkages.length)
    : 0;
  const atRisk = linkages.filter(l => Number(l.Health_Score) < 40).length;

  // Build chart data from interactions (count per day, last 15 days)
  const now = new Date();
  const chartData = Array.from({ length: 15 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (14 - i));
    const dayStr = d.toISOString().slice(0, 10);
    const count = interactions.filter(inter => {
      const interDate = (inter.Date || '').slice(0, 10);
      return interDate === dayStr;
    }).length;
    return { day: String(i + 1), value: count };
  });

  // Build activity feed from the 6 most recent interactions
  const sorted = [...interactions]
    .sort((a, b) => new Date(b.Date) - new Date(a.Date))
    .slice(0, 6);
  const recentActivity = sorted.map(inter => {
    const linkage = linkages.find(l => l.Linkage_ID === inter.Linkage_ID);
    const nameA = linkage ? (entityMap[linkage.Entity_A_ID]?.Name || linkage.Entity_A_ID) : '?';
    const nameB = linkage ? (entityMap[linkage.Entity_B_ID]?.Name || linkage.Entity_B_ID) : '?';
    const isMeeting = inter.Interaction_Type === 'Meeting';
    const d = new Date(inter.Date);
    const hoursAgo = Math.round((now - d) / (1000 * 60 * 60));
    const timeStr = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`;
    return {
      text: `${nameA} and ${nameB}: ${inter.Summary}`,
      badge: isMeeting ? 'Meeting' : 'Email',
      time: timeStr,
      color: isMeeting ? 'g-green' : 'g-blue',
    };
  });

  const kpis = [
    { label: 'Total Entities', value: entities.length, change: `${entities.filter(e => e.Status === 'Active').length} active`, icon: Users, color: 'g-blue' },
    { label: 'Active Linkages', value: linkages.length, change: `${atRisk} at-risk`, icon: Link2, color: 'g-green' },
    { label: 'Interactions (30d)', value: interactions.length, change: 'All time', icon: MessageSquare, color: 'g-yellow' },
    { label: 'At-Risk Linkages', value: atRisk, change: 'Health < 40', icon: AlertTriangle, color: 'g-red', isDown: atRisk > 0 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs bg-white/5 text-text-secondary border border-border rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            Export
          </button>
          <button className="px-4 py-2 text-xs bg-g-blue text-white rounded-lg font-semibold hover:bg-g-blue/90 transition-colors cursor-pointer">
            + New Entity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4.5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${colorMap[kpi.color].border}`} />
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] text-text-muted font-medium">{kpi.label}</span>
              <kpi.icon size={14} className={colorMap[kpi.color].text} />
            </div>
            <div className={`text-[28px] font-bold leading-none ${colorMap[kpi.color].text}`}>
              {kpi.value}
            </div>
            <div className={`text-[11px] mt-1.5 font-medium ${kpi.isDown ? 'text-g-red' : 'text-g-green'}`}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-3.5 mb-5">
        <div className="bg-bg-card border border-border rounded-xl p-4.5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-semibold">Interaction Trend</span>
            <span className="text-[11px] text-text-muted">Last 15 days</span>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4285f4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4285f4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="value" stroke="#4285f4" strokeWidth={2} fill="url(#blueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-4.5 flex flex-col items-center justify-center">
          <div className="flex justify-between items-center w-full mb-3">
            <span className="text-[13px] font-semibold">Avg Health</span>
            <span className="text-[11px] text-text-muted">All linkages</span>
          </div>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#34a853" strokeWidth="8"
                strokeDasharray={`${avgHealth * 2.64} ${264 - avgHealth * 2.64}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-g-green">{avgHealth}</span>
              <span className="text-[9px] text-text-muted">/ 100</span>
            </div>
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-text-muted">
            <span><span className="inline-block w-2 h-2 rounded-full bg-g-green mr-1" />Healthy</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-g-yellow mr-1" />Warning</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-g-red mr-1" />At-risk</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-4.5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold">Recent Activity</span>
          <span className="text-[11px] text-text-muted">From live data</span>
        </div>
        {recentActivity.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
            <div className={`w-2 h-2 rounded-full bg-${item.color} flex-shrink-0`} />
            <span className="flex-1 text-xs text-text-secondary truncate">{item.text}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold whitespace-nowrap ${badgeStyles[item.color]}`}>
              {item.badge}
            </span>
            <span className="text-[11px] text-text-muted whitespace-nowrap">{item.time}</span>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <div className="text-center py-6 text-text-muted text-xs">No interactions recorded yet</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Dashboard.jsx
git commit -m "feat(dashboard): wire to live Apps Script API data"
```

---

### Task 4: Frontend — Wire Entities Page

**Files:**
- Modify: `frontend/src/pages/Entities.jsx`

- [ ] **Step 1: Rewrite Entities.jsx**

Replace the entire contents of `frontend/src/pages/Entities.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { fetchSheet } from '../lib/api';

const roleBadge = {
  Mentor: 'bg-g-blue/15 text-g-blue',
  Company: 'bg-g-green/15 text-g-green',
  Partner: 'bg-g-yellow/15 text-g-yellow',
  Admin: 'bg-g-red/15 text-g-red',
};

const statusDot = {
  Active: 'bg-g-green',
  Dormant: 'bg-g-yellow',
  Churned: 'bg-g-red',
};

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchSheet('Entities')
      .then(data => setEntities(data.entities || []))
      .catch(err => console.error('Entities fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = entities.filter(e => {
    const matchesSearch = (e.Name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.Email || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.Industry_Tags || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || e.Role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading entities...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Entity Directory</h1>
        <button className="px-4 py-2 text-xs bg-g-blue text-white rounded-lg font-semibold hover:bg-g-blue/90 transition-colors cursor-pointer flex items-center gap-1.5">
          <Plus size={14} /> Add Entity
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-bg-card border border-border rounded-lg py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-g-blue/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Mentor', 'Company', 'Partner'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 text-[11px] rounded-lg font-medium transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-g-blue text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:bg-bg-card-hover'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Industry</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(entity => (
              <tr key={entity.Entity_ID} className="border-b border-border last:border-b-0 hover:bg-bg-card-hover transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-g-blue/15 flex items-center justify-center text-g-blue text-xs font-bold">
                      {(entity.Name || '').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-text-primary">{entity.Name}</div>
                      <div className="text-[10px] text-text-muted">{entity.Entity_ID}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${roleBadge[entity.Role] || ''}`}>
                    {entity.Role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">{entity.Email}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {(entity.Industry_Tags || '').split(', ').filter(Boolean).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot[entity.Status] || 'bg-text-muted'}`} />
                    <span className="text-xs text-text-secondary">{entity.Status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-text-muted text-sm">No entities found</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Entities.jsx
git commit -m "feat(entities): wire to live Apps Script API"
```

---

### Task 5: Frontend — Wire Linkages Page

**Files:**
- Modify: `frontend/src/pages/Linkages.jsx`

- [ ] **Step 1: Rewrite Linkages.jsx**

Replace the entire contents of `frontend/src/pages/Linkages.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

function HealthBar({ score }) {
  const s = Number(score) || 0;
  const color = s >= 70 ? 'bg-g-green' : s >= 40 ? 'bg-g-yellow' : 'bg-g-red';
  const textColor = s >= 70 ? 'text-g-green' : s >= 40 ? 'text-g-yellow' : 'text-g-red';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${s}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{s}</span>
    </div>
  );
}

const typeColor = {
  Mentorship: 'bg-g-blue/15 text-g-blue',
  Partnership: 'bg-g-green/15 text-g-green',
  Investment: 'bg-g-yellow/15 text-g-yellow',
};

export default function Linkages() {
  const [linkages, setLinkages] = useState([]);
  const [entityMap, setEntityMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData()
      .then(data => {
        setLinkages(data.linkages || []);
        setEntityMap(buildEntityMap(data.entities || []));
      })
      .catch(err => console.error('Linkages fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading linkages...</span>
      </div>
    );
  }

  const sorted = [...linkages].sort((a, b) => Number(b.Health_Score) - Number(a.Health_Score));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Linkages</h1>
        <span className="text-xs text-text-muted">{linkages.length} total</span>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Entities</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Started</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Last Active</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Health</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(linkage => (
              <tr key={linkage.Linkage_ID} className="border-b border-border last:border-b-0 hover:bg-bg-card-hover transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-text-muted">{linkage.Linkage_ID}</td>
                <td className="px-4 py-3">
                  <div className="text-xs">
                    <span className="font-semibold text-text-primary">{entityMap[linkage.Entity_A_ID]?.Name || linkage.Entity_A_ID}</span>
                    <span className="text-text-muted mx-1.5">&harr;</span>
                    <span className="font-semibold text-text-primary">{entityMap[linkage.Entity_B_ID]?.Name || linkage.Entity_B_ID}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${typeColor[linkage.Linkage_Type] || ''}`}>
                    {linkage.Linkage_Type}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">{linkage.Start_Date}</td>
                <td className="px-4 py-3 text-xs text-text-secondary">{linkage.Last_Interaction_Date}</td>
                <td className="px-4 py-3"><HealthBar score={linkage.Health_Score} /></td>
                <td className="px-4 py-3">
                  <Link
                    to={`/linkages/${linkage.Linkage_ID}`}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-g-blue transition-colors cursor-pointer inline-flex"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Linkages.jsx
git commit -m "feat(linkages): wire to live Apps Script API"
```

---

### Task 6: Frontend — Wire LinkageDetail Page

**Files:**
- Modify: `frontend/src/pages/LinkageDetail.jsx`

- [ ] **Step 1: Rewrite LinkageDetail.jsx**

Replace the entire contents of `frontend/src/pages/LinkageDetail.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, TrendingUp, TrendingDown, Mail, Calendar, Loader2 } from 'lucide-react';
import { fetchLinkageDetail, fetchSheet, buildEntityMap } from '../lib/api';

function HealthGauge({ score }) {
  const s = Number(score) || 0;
  const color = s >= 70 ? '#34a853' : s >= 40 ? '#fbbc04' : '#ea4335';
  const label = s >= 70 ? 'Healthy' : s >= 40 ? 'Warning' : 'At Risk';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${s * 2.64} ${264 - s * 2.64}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{s}</span>
          <span className="text-[10px] text-text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
}

const typeColor = {
  Mentorship: 'bg-g-blue/15 text-g-blue',
  Partnership: 'bg-g-green/15 text-g-green',
  Investment: 'bg-g-yellow/15 text-g-yellow',
};

const interactionIcon = { Meeting: Calendar, Email: Mail };

export default function LinkageDetail() {
  const { id } = useParams();
  const [linkage, setLinkage] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [entityMap, setEntityMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchLinkageDetail(id),
      fetchSheet('Entities'),
    ])
      .then(([detail, entData]) => {
        setLinkage(detail.linkage);
        setInteractions(detail.interactions || []);
        setEntityMap(buildEntityMap(entData.entities || []));
      })
      .catch(err => console.error('LinkageDetail fetch error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading linkage details...</span>
      </div>
    );
  }

  if (!linkage) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-text-muted">Linkage not found</div>
        <Link to="/" className="text-g-blue text-sm hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const entityA = entityMap[linkage.Entity_A_ID];
  const entityB = entityMap[linkage.Entity_B_ID];
  const sortedInteractions = [...interactions].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  const healthScore = Number(linkage.Health_Score) || 0;

  return (
    <div>
      <Link to="/linkages" className="flex items-center gap-1.5 text-text-muted text-xs hover:text-text-primary transition-colors mb-4 cursor-pointer">
        <ArrowLeft size={14} />
        Back to Linkages
      </Link>

      <div className="bg-bg-card border border-border rounded-xl p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-g-blue/15 flex items-center justify-center text-g-blue font-bold">
                {entityA?.Name?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div>
                <div className="text-sm font-semibold">{entityA?.Name || linkage.Entity_A_ID}</div>
                <div className="text-[11px] text-text-muted">{entityA?.Role || ''}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4">
              <div className="w-8 h-px bg-border" />
              <Heart size={16} className="text-g-blue" />
              <div className="w-8 h-px bg-border" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-g-green/15 flex items-center justify-center text-g-green font-bold">
                {entityB?.Name?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div>
                <div className="text-sm font-semibold">{entityB?.Name || linkage.Entity_B_ID}</div>
                <div className="text-[11px] text-text-muted">{entityB?.Role || ''}</div>
              </div>
            </div>
          </div>
          <span className={`text-[11px] px-3 py-1 rounded-lg font-semibold ${typeColor[linkage.Linkage_Type] || ''}`}>
            {linkage.Linkage_Type}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-bg-primary rounded-lg p-4 flex flex-col items-center">
            <HealthGauge score={healthScore} />
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Linkage ID</div>
            <div className="text-sm font-semibold font-mono">{linkage.Linkage_ID}</div>
            <div className="text-[10px] text-text-muted mt-1">Created {linkage.Start_Date}</div>
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Last Interaction</div>
            <div className="text-sm font-semibold">{linkage.Last_Interaction_Date || 'None'}</div>
            <div className="flex items-center gap-1 mt-1">
              {healthScore >= 50
                ? <TrendingUp size={12} className="text-g-green" />
                : <TrendingDown size={12} className="text-g-red" />
              }
              <span className={`text-[10px] ${healthScore >= 50 ? 'text-g-green' : 'text-g-red'}`}>
                {healthScore >= 50 ? 'Active' : 'Declining'}
              </span>
            </div>
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Total Interactions</div>
            <div className="text-2xl font-bold text-g-blue">{sortedInteractions.length}</div>
            <div className="text-[10px] text-text-muted mt-1">Since {linkage.Start_Date}</div>
          </div>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4">Interaction Timeline</h2>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {sortedInteractions.map(interaction => {
              const Icon = interactionIcon[interaction.Interaction_Type] || Mail;
              const date = new Date(interaction.Date);
              return (
                <div key={interaction.Interaction_ID} className="flex gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    interaction.Interaction_Type === 'Meeting' ? 'bg-g-green/15' : 'bg-g-blue/15'
                  }`}>
                    <Icon size={14} className={interaction.Interaction_Type === 'Meeting' ? 'text-g-green' : 'text-g-blue'} />
                  </div>
                  <div className="flex-1 bg-bg-primary rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        interaction.Interaction_Type === 'Meeting' ? 'bg-g-green/15 text-g-green' : 'bg-g-blue/15 text-g-blue'
                      }`}>
                        {interaction.Interaction_Type}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' '}
                        {date.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{interaction.Summary}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {sortedInteractions.length === 0 && (
          <div className="text-center py-6 text-text-muted text-xs">No interactions recorded for this linkage</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/LinkageDetail.jsx
git commit -m "feat(linkage-detail): wire to live Apps Script API"
```

---

### Task 7: Frontend — Wire Interactions Page

**Files:**
- Modify: `frontend/src/pages/Interactions.jsx`

- [ ] **Step 1: Rewrite Interactions.jsx**

Replace the entire contents of `frontend/src/pages/Interactions.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Mail, Calendar, Clock, Loader2 } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [linkages, setLinkages] = useState([]);
  const [entityMap, setEntityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchAllData()
      .then(data => {
        setInteractions(data.interactions || []);
        setLinkages(data.linkages || []);
        setEntityMap(buildEntityMap(data.entities || []));
      })
      .catch(err => console.error('Interactions fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading interactions...</span>
      </div>
    );
  }

  const sorted = [...interactions].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  const filtered = typeFilter === 'All'
    ? sorted
    : sorted.filter(i => i.Interaction_Type === typeFilter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-g-blue" />
          <h1 className="text-xl font-bold">Interaction Timeline</h1>
        </div>
        <div className="flex gap-1.5">
          {['All', 'Meeting', 'Email'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-2 text-[11px] rounded-lg font-medium transition-colors cursor-pointer ${
                typeFilter === type
                  ? 'bg-g-blue text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:bg-bg-card-hover'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
        <div className="space-y-3">
          {filtered.map(interaction => {
            const linkage = linkages.find(l => l.Linkage_ID === interaction.Linkage_ID);
            const entityAName = linkage ? (entityMap[linkage.Entity_A_ID]?.Name || linkage.Entity_A_ID) : '?';
            const entityBName = linkage ? (entityMap[linkage.Entity_B_ID]?.Name || linkage.Entity_B_ID) : '?';
            const date = new Date(interaction.Date);
            const Icon = interaction.Interaction_Type === 'Meeting' ? Calendar : Mail;
            const isMeeting = interaction.Interaction_Type === 'Meeting';

            return (
              <div key={interaction.Interaction_ID} className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  isMeeting ? 'bg-g-green/15' : 'bg-g-blue/15'
                }`}>
                  <Icon size={16} className={isMeeting ? 'text-g-green' : 'text-g-blue'} />
                </div>
                <div className="flex-1 bg-bg-card border border-border rounded-xl p-4 hover:bg-bg-card-hover transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        isMeeting ? 'bg-g-green/15 text-g-green' : 'bg-g-blue/15 text-g-blue'
                      }`}>
                        {interaction.Interaction_Type}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">{interaction.Linkage_ID}</span>
                    </div>
                    <span className="text-[11px] text-text-muted">
                      {date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                      {' '}
                      {date.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary leading-relaxed mb-2">
                    {interaction.Summary}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="font-semibold text-text-primary">{entityAName}</span>
                    <span>&harr;</span>
                    <span className="font-semibold text-text-primary">{entityBName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-text-muted text-sm">
          No interactions found for this filter
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Interactions.jsx
git commit -m "feat(interactions): wire to live Apps Script API"
```

---

### Task 8: Frontend — Wire AI Match to Real Gemini Cloud Function

**Files:**
- Modify: `frontend/src/pages/AIMatch.jsx`

- [ ] **Step 1: Rewrite AIMatch.jsx**

Replace the entire contents of `frontend/src/pages/AIMatch.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { fetchSheet, requestAIMatch } from '../lib/api';

export default function AIMatch() {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [matchType, setMatchType] = useState('Mentorship');
  const [loading, setLoading] = useState(false);
  const [entitiesLoading, setEntitiesLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSheet('Entities')
      .then(data => setEntities(data.entities || []))
      .catch(err => console.error('Entities fetch error:', err))
      .finally(() => setEntitiesLoading(false));
  }, []);

  const handleMatch = async () => {
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const data = await requestAIMatch(selectedEntity, matchType);
      setResults(data.matches || []);
    } catch (err) {
      console.error('AI Match error:', err);
      setError('Failed to get AI matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-g-blue" />
        <h1 className="text-xl font-bold">AI Match Request</h1>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-g-blue/15 text-g-blue font-semibold ml-2">
          Powered by Gemini 2.0
        </span>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4">Find the best match</h2>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-[11px] text-text-muted font-medium mb-2 uppercase tracking-wider">
              Entity
            </label>
            {entitiesLoading ? (
              <div className="flex items-center gap-2 py-2.5 text-text-muted text-xs">
                <Loader2 size={14} className="animate-spin" /> Loading entities...
              </div>
            ) : (
              <select
                value={selectedEntity}
                onChange={e => setSelectedEntity(e.target.value)}
                className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-xs text-text-primary focus:outline-none focus:border-g-blue/50 cursor-pointer"
              >
                <option value="">Select an entity...</option>
                {entities.filter(e => e.Status === 'Active').map(e => (
                  <option key={e.Entity_ID} value={e.Entity_ID}>
                    {e.Name} ({e.Role})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-[11px] text-text-muted font-medium mb-2 uppercase tracking-wider">
              Relationship Type
            </label>
            <div className="flex gap-2">
              {['Mentorship', 'Partnership', 'Investment'].map(type => (
                <button
                  key={type}
                  onClick={() => setMatchType(type)}
                  className={`flex-1 py-2.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    matchType === type
                      ? 'bg-g-blue text-white'
                      : 'bg-bg-primary border border-border text-text-secondary hover:bg-bg-card-hover'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleMatch}
          disabled={!selectedEntity || loading}
          className="px-6 py-2.5 bg-g-blue text-white rounded-lg text-xs font-semibold hover:bg-g-blue/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Gemini is analyzing...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Find Matches
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-g-red/10 border border-g-red/30 rounded-xl p-4 mb-6 text-xs text-g-red">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-bg-card border border-border rounded-xl p-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-g-blue/15 flex items-center justify-center">
            <Loader2 size={20} className="text-g-blue animate-spin" />
          </div>
          <div className="text-sm font-medium">Gemini is analyzing entity profiles...</div>
          <div className="text-xs text-text-muted">Matching expertise, industry tags, and compatibility signals</div>
        </div>
      )}

      {results && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold">Top Matches</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-g-green/15 text-g-green font-semibold">
              {results.length} found
            </span>
          </div>
          <div className="space-y-3">
            {results.map((match, i) => (
              <div key={match.entityId} className="bg-bg-card border border-border rounded-xl p-5 hover:bg-bg-card-hover transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-g-blue/15 flex items-center justify-center text-g-blue font-bold text-sm">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{match.name}</div>
                      <div className="text-[11px] text-text-muted">{match.entityId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-g-green">{Math.round(match.score * 100)}%</div>
                      <div className="text-[10px] text-text-muted">Match Score</div>
                    </div>
                    <button className="p-2 rounded-lg bg-g-blue/15 text-g-blue hover:bg-g-blue/25 transition-colors cursor-pointer">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-text-secondary leading-relaxed pl-[52px]">
                  <span className="text-g-blue font-medium">Gemini says: </span>{match.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !results && !error && (
        <div className="bg-bg-card border border-border rounded-xl p-10 flex flex-col items-center gap-3 text-center">
          <Sparkles size={32} className="text-text-muted" />
          <div className="text-sm text-text-muted">Select an entity and click "Find Matches" to get AI-powered recommendations</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/AIMatch.jsx
git commit -m "feat(ai-match): wire to real Gemini Cloud Function"
```

---

### Task 9: Clean Up — Delete sampleData.js

**Files:**
- Delete: `frontend/src/lib/sampleData.js`

- [ ] **Step 1: Delete the file**

```bash
cd frontend
rm src/lib/sampleData.js
```

- [ ] **Step 2: Verify no imports remain**

```bash
grep -r "sampleData" src/
```

Expected: No output (all pages now import from `api.js`)

- [ ] **Step 3: Build to verify no broken imports**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove sampleData.js, all pages now use live API"
```

---

### Task 10: Deploy Frontend to Firebase Hosting

**Files:**
- Create: `frontend/firebase.json`
- Create: `frontend/.firebaserc`

- [ ] **Step 1: Install Firebase CLI (if not installed)**

```bash
npm install -g firebase-tools
```

- [ ] **Step 2: Login to Firebase**

```bash
firebase login
```

- [ ] **Step 3: Create Firebase Hosting config files**

Create `frontend/firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

Create `frontend/.firebaserc`:

```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

Replace `YOUR_FIREBASE_PROJECT_ID` with your actual Firebase project ID.

- [ ] **Step 4: Build the frontend**

```bash
cd frontend
npm run build
```

Expected: `dist/` folder is created with the production build.

- [ ] **Step 5: Deploy to Firebase Hosting**

```bash
cd frontend
firebase deploy --only hosting
```

Expected: Outputs a hosting URL like `https://YOUR_PROJECT.web.app`

- [ ] **Step 6: Test the live URL**

Open the Firebase Hosting URL in a browser. Verify:
- Dashboard loads with real data from Google Sheets
- Entities page shows live entity list
- Linkages page shows live linkages with health scores
- LinkageDetail page loads when clicking a linkage
- Interactions page shows live interaction timeline
- AI Match page loads entities from live data (Gemini call works if Cloud Function is deployed)

- [ ] **Step 7: Commit**

```bash
git add frontend/firebase.json frontend/.firebaserc
git commit -m "feat(deploy): add Firebase Hosting config and deploy frontend"
```

---

### Task 11: Deploy Cloud Function (Gemini Matcher)

**Files:**
- Modify: `cloud-functions/gemini-matcher/.env` (create from `.env.example`)

- [ ] **Step 1: Set up environment variables**

```bash
cd cloud-functions/gemini-matcher
cp .env.example .env
```

Edit `.env` with your actual values:
```
GEMINI_API_KEY=your-actual-gemini-api-key
SPREADSHEET_ID=1wc5ecKu_Wfq7Y0Lvztpcbzanbx87N_8VIx5ZU6LfQsg
```

- [ ] **Step 2: Install dependencies**

```bash
cd cloud-functions/gemini-matcher
npm install
```

- [ ] **Step 3: Deploy the Cloud Function**

```bash
cd cloud-functions/gemini-matcher
gcloud functions deploy geminiMatcher \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-actual-gemini-api-key,SPREADSHEET_ID=1wc5ecKu_Wfq7Y0Lvztpcbzanbx87N_8VIx5ZU6LfQsg
```

- [ ] **Step 4: Copy the deployed URL**

After deployment, the CLI outputs the function URL. Copy it and update `frontend/.env`:

```
VITE_GEMINI_MATCHER_URL=https://REGION-PROJECT.cloudfunctions.net/geminiMatcher
```

- [ ] **Step 5: Rebuild and redeploy frontend with updated URL**

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

- [ ] **Step 6: Test end-to-end**

1. Open the live Firebase Hosting URL
2. Go to AI Match page
3. Select an entity and match type
4. Click "Find Matches"
5. Verify Gemini returns real match results with confidence scores and reasons

- [ ] **Step 7: Commit**

```bash
git add frontend/.env
git commit -m "feat(deploy): deploy Gemini matcher Cloud Function and update frontend URL"
```
