import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Link2, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

const colorMap = {
  'g-blue':   { text: 'text-g-blue',   bg: 'bg-g-blue',   border: 'bg-g-blue' },
  'g-green':  { text: 'text-g-green',  bg: 'bg-g-green',  border: 'bg-g-green' },
  'g-yellow': { text: 'text-g-yellow', bg: 'bg-g-yellow', border: 'bg-g-yellow' },
  'g-red':    { text: 'text-g-red',    bg: 'bg-g-red',    border: 'bg-g-red' },
};

const badgeStyles = {
  'g-green':  'bg-g-green/15 text-g-green',
  'g-blue':   'bg-g-blue/15 text-g-blue',
  'g-yellow': 'bg-g-yellow/15 text-g-yellow',
  'g-red':    'bg-g-red/15 text-g-red',
};

// BUG FIX #2: color by Interaction_Type instead of missing Sentiment_Score
function interactionColor(type) {
  if (!type) return 'g-yellow';
  const t = type.toLowerCase();
  if (t === 'meeting') return 'g-green';
  if (t === 'email') return 'g-blue';
  return 'g-yellow';
}

function buildChartData(interactions) {
  const counts = {};
  const now = new Date();
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    counts[key] = 0;
  }
  interactions.forEach(item => {
    const raw = item.Date || item.Timestamp || '';
    if (!raw) return;
    const key = new Date(raw).toISOString().slice(0, 10);
    if (key in counts) counts[key]++;
  });
  return Object.entries(counts).map(([, value], idx) => ({
    day: String(idx + 1),
    value,
  }));
}

// BUG FIX #1: accept linkages array; resolve entity names via linkage lookup
function buildActivityFeed(interactions, linkages, entityMap) {
  // Build a fast Linkage_ID → linkage lookup (js-index-maps rule)
  const linkageIndex = {};
  linkages.forEach(l => { linkageIndex[l.Linkage_ID] = l; });

  const sorted = [...interactions].sort((a, b) => {
    const ta = new Date(a.Date || a.Timestamp || 0).getTime();
    const tb = new Date(b.Date || b.Timestamp || 0).getTime();
    return tb - ta;
  });

  return sorted.slice(0, 6).map(item => {
    const linkage = linkageIndex[item.Linkage_ID] || {};
    const entityA = entityMap[linkage.Entity_A_ID] || { Name: linkage.Entity_A_ID || '—' };
    const entityB = entityMap[linkage.Entity_B_ID] || { Name: linkage.Entity_B_ID || '—' };
    const type = item.Interaction_Type || 'Interaction';
    const color = interactionColor(type);  // BUG FIX #2
    const raw = item.Date || item.Timestamp || '';
    const time = raw ? new Date(raw).toLocaleDateString() : '—';

    return {
      text: `${entityA.Name} — ${entityB.Name}: ${type}`,
      badge: type,
      color,
      time,
    };
  });
}

// IMPROVEMENT #6: dynamic health ring color
function healthColor(avg) {
  if (avg >= 70) return { stroke: '#34a853', text: 'text-g-green' };
  if (avg >= 40) return { stroke: '#fbbc04', text: 'text-g-yellow' };
  return { stroke: '#ea4335', text: 'text-g-red' };
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [kpis, setKpis]       = useState([]);
  const [chartData, setChartData]     = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [avgHealth, setAvgHealth]     = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);  // IMPROVEMENT #5

  const load = useCallback(() => {
    fetchAllData()
      .then(({ entities, linkages, interactions }) => {
        const entityMap = buildEntityMap(entities);

        // BUG FIX #3: compute real active / at-risk counts
        const activeEntities = entities.filter(e => (e.Status || '').toLowerCase() === 'active').length;
        const atRisk = linkages.filter(l => Number(l.Health_Score) < 40).length;
        const totalHealth = linkages.reduce((acc, l) => acc + Number(l.Health_Score || 0), 0);
        const avg = linkages.length ? Math.round(totalHealth / linkages.length) : 0;

        setKpis([
          {
            label: 'Total Entities',
            value: entities.length,
            change: `${activeEntities} active`,   // BUG FIX #3
            icon: Users,
            color: 'g-blue',
          },
          {
            label: 'Active Linkages',
            value: linkages.length,
            change: `${atRisk} at-risk`,           // BUG FIX #3
            icon: Link2,
            color: 'g-green',
          },
          {
            label: 'Interactions (30d)',
            value: interactions.length,
            change: '+28% vs last month',
            icon: MessageSquare,
            color: 'g-yellow',
          },
          {
            label: 'At-Risk Linkages',
            value: atRisk,
            change: 'Need attention',
            icon: AlertTriangle,
            color: 'g-red',
            isDown: true,
          },
        ]);

        setAvgHealth(avg);
        setChartData(buildChartData(interactions));
        setActivityFeed(buildActivityFeed(interactions, linkages, entityMap)); // BUG FIX #1
        setLastUpdated(new Date()); // IMPROVEMENT #5
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Initial load
  useEffect(() => { load(); }, [load]);

  // IMPROVEMENT #4: auto-refresh every 30 seconds
  useEffect(() => {
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Loading dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-g-red text-sm">
        Failed to load data: {error}
      </div>
    );
  }

  // IMPROVEMENT #5: format lastUpdated
  const syncLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null;

  // IMPROVEMENT #6: resolve health ring color
  const ring = healthColor(avgHealth);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Dashboard</h1>
          {/* IMPROVEMENT #4: Live indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-g-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-g-green" />
            </span>
            <span className="text-[11px] font-medium text-g-green">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* IMPROVEMENT #5: lastUpdated timestamp */}
          {syncLabel && (
            <span className="text-[11px] text-text-muted">Last synced: {syncLabel}</span>
          )}
          <button className="px-4 py-2 text-xs bg-white/5 text-text-secondary border border-border rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            Export
          </button>
          <button className="px-4 py-2 text-xs bg-g-blue text-white rounded-lg font-semibold hover:bg-g-blue/90 transition-colors cursor-pointer">
            + New Entity
          </button>
        </div>
      </div>

      {/* KPI Cards */}
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

      {/* Charts Row */}
      <div className="grid grid-cols-[2fr_1fr] gap-3.5 mb-5">
        {/* Area Chart */}
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

        {/* Health Ring — IMPROVEMENT #6: dynamic color */}
        <div className="bg-bg-card border border-border rounded-xl p-4.5 flex flex-col items-center justify-center">
          <div className="flex justify-between items-center w-full mb-3">
            <span className="text-[13px] font-semibold">Avg Health</span>
            <span className="text-[11px] text-text-muted">All linkages</span>
          </div>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={ring.stroke}
                strokeWidth="8"
                strokeDasharray={`${avgHealth * 2.64} ${264 - avgHealth * 2.64}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${ring.text}`}>{avgHealth}</span>
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

      {/* Activity Feed */}
      <div className="bg-bg-card border border-border rounded-xl p-4.5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold">Recent Activity</span>
          <span className="text-[11px] text-text-muted">Latest interactions</span>
        </div>
        {activityFeed.length === 0 && (
          <div className="text-center py-6 text-text-muted text-sm">No recent activity</div>
        )}
        {activityFeed.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
            <div className={`w-2 h-2 rounded-full bg-${item.color} flex-shrink-0`} />
            <span className="flex-1 text-xs text-text-secondary">
              {item.text}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold whitespace-nowrap ${badgeStyles[item.color]}`}>
              {item.badge}
            </span>
            <span className="text-[11px] text-text-muted whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
