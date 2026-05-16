import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis,
  PieChart, Pie, Cell,
  BarChart, Bar, YAxis,
} from 'recharts';
import { Users, Link2, MessageSquare, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

const ACCENT = '#10b981';
const ACCENT_DIM = '#059669';
const GOLD = '#d4a853';
const COLORS = { healthy: '#10b981', warning: '#fbbc04', atRisk: '#ea4335', dormant: '#475569' };

function SkeletonCard() {
  return <div className="bg-bg-card border border-border rounded-xl p-5 animate-pulse"><div className="h-4 w-20 bg-white/5 rounded mb-3" /><div className="h-8 w-16 bg-white/5 rounded mb-2" /><div className="h-3 w-24 bg-white/5 rounded" /></div>;
}

function fmtDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  return isNaN(d) ? '' : d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [raw, setRaw] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(() => {
    fetchAllData()
      .then(data => { setRaw(data); setError(null); setLastUpdated(new Date()); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const id = setInterval(load, 30000); return () => clearInterval(id); }, [load]);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-4 gap-3.5 mb-5">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
        <div className="grid grid-cols-[2fr_1fr] gap-3.5 mb-5">
          <div className="bg-bg-card border border-border rounded-xl h-48 animate-pulse" />
          <div className="bg-bg-card border border-border rounded-xl h-48 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-g-red text-sm">Failed to load: {error}</div>;
  }

  const { entities, linkages, interactions } = raw;
  const entityMap = buildEntityMap(entities);

  // KPI calculations
  const activeEntities = entities.filter(e => (e.Status || '').toLowerCase() === 'active').length;
  const atRisk = linkages.filter(l => Number(l.Health_Score) < 40).length;
  const totalHealth = linkages.reduce((a, l) => a + Number(l.Health_Score || 0), 0);
  const avgHealth = linkages.length ? Math.round(totalHealth / linkages.length) : 0;
  const healthColor = avgHealth >= 70 ? ACCENT : avgHealth >= 40 ? '#fbbc04' : '#ea4335';

  // Health distribution
  const healthDist = { healthy: 0, warning: 0, atRisk: 0, dormant: 0 };
  linkages.forEach(l => {
    const s = Number(l.Health_Score);
    if (s >= 70) healthDist.healthy++;
    else if (s >= 40) healthDist.warning++;
    else if (s >= 20) healthDist.atRisk++;
    else healthDist.dormant++;
  });
  const healthDistData = [
    { name: 'Healthy', value: healthDist.healthy, color: COLORS.healthy },
    { name: 'Warning', value: healthDist.warning, color: COLORS.warning },
    { name: 'At-Risk', value: healthDist.atRisk, color: COLORS.atRisk },
    { name: 'Dormant', value: healthDist.dormant, color: COLORS.dormant },
  ].filter(d => d.value > 0);

  // Entity role distribution
  const roleCounts = {};
  entities.forEach(e => { roleCounts[e.Role] = (roleCounts[e.Role] || 0) + 1; });
  const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
  const roleColors = { Mentor: ACCENT, Company: '#4285f4', Partner: GOLD, Admin: '#8b5cf6' };

  // Linkage type breakdown
  const typeCounts = {};
  linkages.forEach(l => { typeCounts[l.Linkage_Type] = (typeCounts[l.Linkage_Type] || 0) + 1; });
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  const typeColors = { Mentorship: ACCENT, Partnership: '#4285f4', Investment: GOLD };

  // Health scores per linkage (horizontal bar)
  const healthBarData = [...linkages]
    .sort((a, b) => Number(b.Health_Score) - Number(a.Health_Score))
    .slice(0, 8)
    .map(l => {
      const nameA = entityMap[l.Entity_A_ID]?.Name?.split(' ')[0] || '?';
      const nameB = entityMap[l.Entity_B_ID]?.Name?.split(' ')[0] || '?';
      return { name: `${nameA}-${nameB}`, score: Number(l.Health_Score), id: l.Linkage_ID };
    });

  // Interaction trend (last 15 days)
  const now = new Date();
  const chartData = Array.from({ length: 15 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (14 - i));
    const key = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
    const count = interactions.filter(inter => (inter.Date || '').slice(0, 10) === key).length;
    return { day: dayName, value: count };
  });

  // Recent activity
  const linkageMap = {};
  linkages.forEach(l => { linkageMap[l.Linkage_ID] = l; });
  const recentActivity = [...interactions]
    .sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0))
    .slice(0, 6)
    .map(inter => {
      const linkage = linkageMap[inter.Linkage_ID] || {};
      const nameA = entityMap[linkage.Entity_A_ID]?.Name || '—';
      const nameB = entityMap[linkage.Entity_B_ID]?.Name || '—';
      const isMeeting = inter.Interaction_Type === 'Meeting';
      return {
        nameA, nameB,
        type: inter.Interaction_Type || 'Note',
        summary: inter.Summary || '',
        date: fmtDate(inter.Date),
        color: isMeeting ? ACCENT : '#4285f4',
        bgColor: isMeeting ? 'bg-accent/10' : 'bg-g-blue/10',
        textColor: isMeeting ? 'text-accent' : 'text-g-blue',
      };
    });

  const syncLabel = lastUpdated?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const kpis = [
    { label: 'Total Entities', value: entities.length, sub: `${activeEntities} active`, icon: Users, accent: ACCENT },
    { label: 'Active Linkages', value: linkages.length, sub: `${atRisk} at-risk`, icon: Link2, accent: ACCENT_DIM },
    { label: 'Interactions', value: interactions.length, sub: 'All time', icon: MessageSquare, accent: GOLD },
    { label: 'At-Risk', value: atRisk, sub: 'Health < 40', icon: AlertTriangle, accent: '#ea4335' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Ecosystem Dashboard</h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-[11px] font-medium text-accent">Live</span>
            </div>
          </div>
          <p className="text-[12px] text-text-muted mt-0.5">Real-time ecosystem health and relationship analytics</p>
        </div>
        {syncLabel && (
          <span className="text-[11px] text-text-muted">Last synced: {syncLabel}</span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-5">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-bg-card border border-border rounded-xl p-4.5 relative overflow-hidden hover:border-accent/20 transition-all duration-200 cursor-default"
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: kpi.accent }} />
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] text-text-muted font-medium">{kpi.label}</span>
              <kpi.icon size={14} style={{ color: kpi.accent }} />
            </div>
            <div className="text-[28px] font-bold leading-none" style={{ color: kpi.accent }}>{kpi.value}</div>
            <div className="text-[11px] mt-1.5 font-medium text-text-secondary">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Health Distribution Bar */}
      <div className="bg-bg-card border border-border rounded-xl p-4.5 mb-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent" />
            <span className="text-[13px] font-semibold">Relationship Health Distribution</span>
          </div>
          <span className="text-[11px] text-text-muted">{linkages.length} linkages</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-white/5 mb-3">
          {healthDistData.map(d => (
            <div
              key={d.name}
              style={{ width: `${(d.value / linkages.length) * 100}%`, background: d.color }}
              className="transition-all duration-500"
            />
          ))}
        </div>
        <div className="flex gap-5">
          {healthDistData.map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
              <span className="text-[11px] text-text-secondary">{d.name}</span>
              <span className="text-[11px] font-semibold text-text-primary">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row: Trend + Health Ring */}
      <div className="grid grid-cols-[2fr_1fr] gap-3.5 mb-5">
        <div className="bg-bg-card border border-border rounded-xl p-4.5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-[13px] font-semibold">Interaction Trend</span>
            </div>
            <span className="text-[11px] text-text-muted">Last 15 days</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#5a7366', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0b1a12', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#8fa89a' }}
              />
              <Area type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2} fill="url(#accentGrad)" />
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
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={healthColor} strokeWidth="8"
                strokeDasharray={`${avgHealth * 2.64} ${264 - avgHealth * 2.64}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: healthColor }}>{avgHealth}</span>
              <span className="text-[9px] text-text-muted">/ 100</span>
            </div>
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-text-muted">
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COLORS.healthy }} />Healthy</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COLORS.warning }} />Warning</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COLORS.atRisk }} />At-risk</span>
          </div>
        </div>
      </div>

      {/* Row: Role Distribution + Type Breakdown + Health Ranking */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {/* Entity Role Distribution */}
        <div className="bg-bg-card border border-border rounded-xl p-4.5">
          <span className="text-[13px] font-semibold">Entity Roles</span>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                {roleData.map((entry) => (
                  <Cell key={entry.name} fill={roleColors[entry.name] || '#475569'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0b1a12', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center">
            {roleData.map(d => (
              <div key={d.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: roleColors[d.name] || '#475569' }} />
                <span className="text-[10px] text-text-muted">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linkage Type Breakdown */}
        <div className="bg-bg-card border border-border rounded-xl p-4.5">
          <span className="text-[13px] font-semibold">Linkage Types</span>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={typeData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8fa89a', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: '#0b1a12', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, fontSize: 11 }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                {typeData.map((entry) => (
                  <Cell key={entry.name} fill={typeColors[entry.name] || ACCENT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Health Score Ranking */}
        <div className="bg-bg-card border border-border rounded-xl p-4.5">
          <span className="text-[13px] font-semibold">Health Ranking</span>
          <div className="mt-3 space-y-2">
            {healthBarData.map(d => {
              const barColor = d.score >= 70 ? COLORS.healthy : d.score >= 40 ? COLORS.warning : COLORS.atRisk;
              return (
                <div key={d.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted w-[70px] truncate">{d.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.score}%`, background: barColor }} />
                  </div>
                  <span className="text-[10px] font-semibold w-6 text-right" style={{ color: barColor }}>{d.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-bg-card border border-border rounded-xl p-4.5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold">Recent Activity</span>
          <span className="text-[11px] text-text-muted">Latest interactions</span>
        </div>
        {recentActivity.length === 0 && (
          <div className="text-center py-8 text-text-muted text-sm">No interactions recorded yet</div>
        )}
        {recentActivity.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-b-0"
            style={{ borderLeftWidth: 2, borderLeftColor: item.color, paddingLeft: 12 }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-text-primary">{item.nameA}</span>
                <span className="text-text-muted text-[10px]">&harr;</span>
                <span className="text-xs font-semibold text-text-primary">{item.nameB}</span>
              </div>
              <p className="text-[11px] text-text-muted truncate">{item.summary}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold whitespace-nowrap ${item.bgColor} ${item.textColor}`}>
              {item.type}
            </span>
            <span className="text-[11px] text-text-muted whitespace-nowrap">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
