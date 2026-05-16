import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Link2, MessageSquare, AlertTriangle } from 'lucide-react';
import { entities, linkages, interactions, recentActivity } from '../lib/sampleData';

const chartData = [
  { day: '1', value: 8 }, { day: '2', value: 12 }, { day: '3', value: 7 },
  { day: '4', value: 15 }, { day: '5', value: 11 }, { day: '6', value: 18 },
  { day: '7', value: 14 }, { day: '8', value: 22 }, { day: '9', value: 17 },
  { day: '10', value: 25 }, { day: '11', value: 20 }, { day: '12', value: 28 },
  { day: '13', value: 23 }, { day: '14', value: 30 }, { day: '15', value: 26 },
];

const kpis = [
  { label: 'Total Entities', value: entities.length, change: '+12 this week', icon: Users, color: 'g-blue' },
  { label: 'Active Linkages', value: linkages.length, change: '+5 this week', icon: Link2, color: 'g-green' },
  { label: 'Interactions (30d)', value: interactions.length, change: '+28% vs last month', icon: MessageSquare, color: 'g-yellow' },
  { label: 'At-Risk Linkages', value: linkages.filter(l => l.Health_Score < 40).length, change: 'Need attention', icon: AlertTriangle, color: 'g-red', isDown: true },
];

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
  const avgHealth = Math.round(linkages.reduce((a, l) => a + l.Health_Score, 0) / linkages.length);

  return (
    <div>
      {/* Header */}
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
            <span className="text-[11px] text-text-muted">Last 30 days</span>
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

        {/* Health Ring */}
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

      {/* Activity Feed */}
      <div className="bg-bg-card border border-border rounded-xl p-4.5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold">Recent Activity</span>
          <span className="text-[11px] text-text-muted">Today</span>
        </div>
        {recentActivity.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
            <div className={`w-2 h-2 rounded-full bg-${item.color} flex-shrink-0`} />
            <span className="flex-1 text-xs text-text-secondary" dangerouslySetInnerHTML={{
              __html: item.text.replace(/(\b[A-Z][a-z]+ [A-Z][a-z]+\b|LNK-\d+|Gemini AI)/g, '<strong class="text-text-primary font-semibold">$1</strong>')
            }} />
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
