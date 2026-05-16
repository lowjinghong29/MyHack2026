import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { linkages, getEntityName } from '../lib/sampleData';

function HealthBar({ score }) {
  const color = score >= 70 ? 'bg-g-green' : score >= 40 ? 'bg-g-yellow' : 'bg-g-red';
  const textColor = score >= 70 ? 'text-g-green' : score >= 40 ? 'text-g-yellow' : 'text-g-red';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{score}</span>
    </div>
  );
}

const typeColor = {
  Mentorship: 'bg-g-blue/15 text-g-blue',
  Partnership: 'bg-g-green/15 text-g-green',
  Investment: 'bg-g-yellow/15 text-g-yellow',
};

export default function Linkages() {
  const sorted = [...linkages].sort((a, b) => b.Health_Score - a.Health_Score);

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
                    <span className="font-semibold text-text-primary">{getEntityName(linkage.Entity_A_ID)}</span>
                    <span className="text-text-muted mx-1.5">&harr;</span>
                    <span className="font-semibold text-text-primary">{getEntityName(linkage.Entity_B_ID)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${typeColor[linkage.Linkage_Type]}`}>
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
