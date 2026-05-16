import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d) ? raw : d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

function HealthBar({ score }) {
  const val = Number(score);
  const color = val >= 70 ? 'bg-g-green' : val >= 40 ? 'bg-g-yellow' : 'bg-g-red';
  const textColor = val >= 70 ? 'text-g-green' : val >= 40 ? 'text-g-yellow' : 'text-g-red';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{val}</span>
    </div>
  );
}

const typeColor = {
  Mentorship: 'bg-accent/15 text-accent',
  Partnership: 'bg-g-blue/15 text-g-blue',
  Investment: 'bg-gold/15 text-gold',
};

export default function Linkages() {
  const [linkages, setLinkages] = useState([]);
  const [entityMap, setEntityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData()
      .then(data => {
        setEntityMap(buildEntityMap(data.entities));
        const sorted = [...data.linkages].sort(
          (a, b) => Number(b.Health_Score) - Number(a.Health_Score)
        );
        setLinkages(sorted);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading linkages…</span>
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
            {linkages.map(linkage => {
              const nameA = entityMap[linkage.Entity_A_ID]?.Name ?? linkage.Entity_A_ID;
              const nameB = entityMap[linkage.Entity_B_ID]?.Name ?? linkage.Entity_B_ID;
              return (
                <tr
                  key={linkage.Linkage_ID}
                  className="border-b border-border last:border-b-0 hover:bg-bg-card-hover transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono text-text-muted">{linkage.Linkage_ID}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <span className="font-semibold text-text-primary">{nameA}</span>
                      <span className="text-text-muted mx-1.5">&harr;</span>
                      <span className="font-semibold text-text-primary">{nameB}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${typeColor[linkage.Linkage_Type] ?? 'bg-white/10 text-text-secondary'}`}>
                      {linkage.Linkage_Type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{fmtDate(linkage.Start_Date)}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{fmtDate(linkage.Last_Interaction_Date)}</td>
                  <td className="px-4 py-3"><HealthBar score={linkage.Health_Score} /></td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/linkages/${linkage.Linkage_ID}`}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent transition-colors cursor-pointer inline-flex"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
