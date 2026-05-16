import { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, Activity, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchAllData, buildEntityMap, triggerNudgeRun } from '../lib/api';

function daysBetween(dateStr) {
  const last = new Date(dateStr);
  if (isNaN(last)) return 999;
  const ms = Date.now() - last.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function bucketFor(days) {
  if (days < 30) return 'Healthy';
  if (days < 60) return 'At_Risk';
  return 'Dormant';
}

const typeColor = {
  Mentorship: 'bg-accent/15 text-accent',
  Partnership: 'bg-g-blue/15 text-g-blue',
  Investment: 'bg-gold/15 text-gold',
};

function ScorePill({ score }) {
  if (score === undefined || score === null || score === '' || isNaN(Number(score))) {
    return <span className="text-[11px] text-text-muted">—</span>;
  }
  const val = Number(score);
  const color = val >= 70 ? 'text-g-green' : val >= 40 ? 'text-gold' : 'text-g-red';
  return <span className={`text-xs font-semibold ${color}`}>{val}</span>;
}

function SummaryCard({ icon: Icon, label, count, accentClass, iconColor }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg ${accentClass} flex items-center justify-center`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <div className="text-2xl font-bold text-text-primary leading-tight">{count}</div>
        <div className="text-[11px] text-text-muted uppercase tracking-wider font-medium">{label}</div>
      </div>
    </div>
  );
}

function FlagRow({ row, onNudge, nudgingId, nudgeResult }) {
  const isNudging = nudgingId === row.Linkage_ID;
  const isSuccess = nudgeResult?.linkageId === row.Linkage_ID && !nudgeResult?.error;
  const isError = nudgeResult?.linkageId === row.Linkage_ID && nudgeResult?.error;

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-bg-card-hover transition-colors">
      <td className="px-4 py-3 text-xs font-mono text-text-muted">{row.Linkage_ID}</td>
      <td className="px-4 py-3">
        <div className="text-xs">
          <span className="font-semibold text-text-primary">{row.nameA}</span>
          <span className="text-text-muted mx-1.5">&rarr;</span>
          <span className="font-semibold text-text-primary">{row.nameB}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${typeColor[row.Linkage_Type] ?? 'bg-white/10 text-text-secondary'}`}>
          {row.Linkage_Type}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-text-secondary">{row.daysSince} days</td>
      <td className="px-4 py-3"><ScorePill score={row.Health_Score} /></td>
      <td className="px-4 py-3 text-right">
        {isSuccess ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-accent font-medium">
            <CheckCircle2 size={13} />
            Nudge sent
          </span>
        ) : isError ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-g-red font-medium">
            Failed
          </span>
        ) : (
          <button
            onClick={() => onNudge(row.Linkage_ID)}
            disabled={isNudging}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-semibold"
          >
            {isNudging ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={12} />
                Send nudge now
              </>
            )}
          </button>
        )}
      </td>
    </tr>
  );
}

function FlagTable({ rows, onNudge, nudgingId, nudgeResult }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">ID</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Entities</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Days Since</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Health</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <FlagRow
              key={row.Linkage_ID}
              row={row}
              onNudge={onNudge}
              nudgingId={nudgingId}
              nudgeResult={nudgeResult}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminFlags() {
  const [flagged, setFlagged] = useState({ dormant: [], atRisk: [], lowScoreCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nudgingId, setNudgingId] = useState(null);
  const [nudgeResult, setNudgeResult] = useState(null);
  const [globalNudgeStatus, setGlobalNudgeStatus] = useState(null);

  useEffect(() => {
    fetchAllData()
      .then(data => {
        const entityMap = buildEntityMap(data.entities || []);
        const linkages = (data.linkages || []).filter(l => l.Status === 'Active');

        const dormant = [];
        const atRisk = [];
        let lowScoreCount = 0;

        linkages.forEach(l => {
          const daysSince = daysBetween(l.Last_Interaction_Date);
          const bucket = bucketFor(daysSince);
          const scoreNum = Number(l.Health_Score);
          const isLowScore = !isNaN(scoreNum) && scoreNum < 40;
          if (isLowScore) lowScoreCount += 1;

          const row = {
            ...l,
            daysSince,
            bucket,
            isLowScore,
            nameA: entityMap[l.Entity_A_ID]?.Name ?? l.Entity_A_ID,
            nameB: entityMap[l.Entity_B_ID]?.Name ?? l.Entity_B_ID,
          };

          if (bucket === 'Dormant') dormant.push(row);
          else if (bucket === 'At_Risk') atRisk.push(row);
        });

        dormant.sort((a, b) => b.daysSince - a.daysSince);
        atRisk.sort((a, b) => b.daysSince - a.daysSince);

        setFlagged({ dormant, atRisk, lowScoreCount });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleNudge = async (linkageId) => {
    setNudgingId(linkageId);
    setNudgeResult(null);
    try {
      await triggerNudgeRun();
      setNudgeResult({ linkageId, message: 'Nudge run triggered — emails will dispatch within seconds' });
      setGlobalNudgeStatus({ ok: true, message: 'Nudge run triggered — emails will dispatch within seconds' });
    } catch (err) {
      setNudgeResult({ linkageId, error: err.message || 'Failed to trigger nudge run' });
      setGlobalNudgeStatus({ ok: false, message: err.message || 'Failed to trigger nudge run' });
    } finally {
      setNudgingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading exception queue…</span>
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

  const { dormant, atRisk, lowScoreCount } = flagged;
  const hasAnyFlags = dormant.length > 0 || atRisk.length > 0 || lowScoreCount > 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <AlertOctagon size={20} className="text-g-red" />
        <h1 className="text-xl font-bold">Exception Queue</h1>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-g-red/15 text-g-red font-semibold ml-2">
          Admin
        </span>
      </div>

      {globalNudgeStatus?.ok && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-4 text-accent text-xs flex items-center gap-2">
          <CheckCircle2 size={14} />
          {globalNudgeStatus.message}
        </div>
      )}
      {globalNudgeStatus && !globalNudgeStatus.ok && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-red-400 text-xs">
          {globalNudgeStatus.message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          icon={AlertOctagon}
          label="Dormant"
          count={dormant.length}
          accentClass="bg-g-red/15"
          iconColor="text-g-red"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="At Risk"
          count={atRisk.length}
          accentClass="bg-gold/15"
          iconColor="text-gold"
        />
        <SummaryCard
          icon={Activity}
          label="Low Score"
          count={lowScoreCount}
          accentClass="bg-accent/15"
          iconColor="text-accent"
        />
      </div>

      {!hasAnyFlags && (
        <div className="bg-bg-card border border-border rounded-xl p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-accent" />
          </div>
          <div className="text-sm font-medium text-text-primary">All relationships healthy</div>
          <div className="text-xs text-text-muted">No flags to review — every active linkage is on track.</div>
        </div>
      )}

      {dormant.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon size={16} className="text-g-red" />
            <h2 className="text-sm font-semibold text-text-primary">Critical (Dormant) linkages</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-g-red/15 text-g-red font-semibold">
              {dormant.length}
            </span>
            <span className="text-[11px] text-text-muted ml-1">60+ days without interaction</span>
          </div>
          <FlagTable
            rows={dormant}
            onNudge={handleNudge}
            nudgingId={nudgingId}
            nudgeResult={nudgeResult}
          />
        </div>
      )}

      {atRisk.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-gold" />
            <h2 className="text-sm font-semibold text-text-primary">At-Risk linkages</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-gold/15 text-gold font-semibold">
              {atRisk.length}
            </span>
            <span className="text-[11px] text-text-muted ml-1">30–59 days since last touch</span>
          </div>
          <FlagTable
            rows={atRisk}
            onNudge={handleNudge}
            nudgingId={nudgingId}
            nudgeResult={nudgeResult}
          />
        </div>
      )}
    </div>
  );
}
