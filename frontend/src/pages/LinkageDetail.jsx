import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, TrendingUp, TrendingDown, Mail, Calendar, Loader2 } from 'lucide-react';
import { fetchLinkageDetail, fetchSheet, buildEntityMap } from '../lib/api';

function HealthGauge({ score }) {
  const val = Number(score);
  const color = val >= 70 ? '#34a853' : val >= 40 ? '#fbbc04' : '#ea4335';
  const label = val >= 70 ? 'Healthy' : val >= 40 ? 'Warning' : 'At Risk';
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${val * circumference / 100} ${circumference - val * circumference / 100}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{val}</span>
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

const interactionIcon = {
  Meeting: Calendar,
  Email: Mail,
};

export default function LinkageDetail() {
  const { id } = useParams();
  const [linkage, setLinkage] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [entityMap, setEntityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchLinkageDetail(id),
      fetchSheet('Entities'),
    ])
      .then(([detail, entitiesData]) => {
        if (!detail.linkage) {
          setNotFound(true);
          return;
        }
        setLinkage(detail.linkage);
        const sorted = [...(detail.interactions ?? [])].sort(
          (a, b) => new Date(b.Date) - new Date(a.Date)
        );
        setInteractions(sorted);
        setEntityMap(buildEntityMap(entitiesData.entities ?? []));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-text-muted">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (notFound || !linkage) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-text-muted">Linkage not found</div>
        <Link to="/linkages" className="text-g-blue text-sm hover:underline">Back to Linkages</Link>
      </div>
    );
  }

  const entityA = entityMap[linkage.Entity_A_ID];
  const entityB = entityMap[linkage.Entity_B_ID];
  const health = Number(linkage.Health_Score);

  const initials = name =>
    name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : '?';

  return (
    <div>
      <Link
        to="/linkages"
        className="flex items-center gap-1.5 text-text-muted text-xs hover:text-text-primary transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back to Linkages
      </Link>

      {/* Header */}
      <div className="bg-bg-card border border-border rounded-xl p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            {/* Entity A */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-g-blue/15 flex items-center justify-center text-g-blue font-bold">
                {initials(entityA?.Name)}
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{entityA?.Name ?? linkage.Entity_A_ID}</div>
                <div className="text-[11px] text-text-muted">{entityA?.Role ?? ''}</div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex items-center gap-2 px-4">
              <div className="w-8 h-px bg-border" />
              <Heart size={16} className="text-g-blue" />
              <div className="w-8 h-px bg-border" />
            </div>

            {/* Entity B */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-g-green/15 flex items-center justify-center text-g-green font-bold">
                {initials(entityB?.Name)}
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{entityB?.Name ?? linkage.Entity_B_ID}</div>
                <div className="text-[11px] text-text-muted">{entityB?.Role ?? ''}</div>
              </div>
            </div>
          </div>

          <span className={`text-[11px] px-3 py-1 rounded-lg font-semibold ${typeColor[linkage.Linkage_Type] ?? 'bg-white/10 text-text-secondary'}`}>
            {linkage.Linkage_Type}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-bg-primary rounded-lg p-4 flex flex-col items-center">
            <HealthGauge score={health} />
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Linkage ID</div>
            <div className="text-sm font-semibold font-mono text-text-primary">{linkage.Linkage_ID}</div>
            <div className="text-[10px] text-text-muted mt-1">Created {linkage.Start_Date}</div>
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Last Interaction</div>
            <div className="text-sm font-semibold text-text-primary">{linkage.Last_Interaction_Date}</div>
            <div className="flex items-center gap-1 mt-1">
              {health >= 50
                ? <TrendingUp size={12} className="text-g-green" />
                : <TrendingDown size={12} className="text-g-red" />
              }
              <span className={`text-[10px] ${health >= 50 ? 'text-g-green' : 'text-g-red'}`}>
                {health >= 50 ? 'Active' : 'Declining'}
              </span>
            </div>
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Total Interactions</div>
            <div className="text-2xl font-bold text-g-blue">{interactions.length}</div>
            <div className="text-[10px] text-text-muted mt-1">Since {linkage.Start_Date}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4">Interaction Timeline</h2>
        {interactions.length === 0 ? (
          <p className="text-xs text-text-muted">No interactions recorded yet.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {interactions.map(interaction => {
                const Icon = interactionIcon[interaction.Interaction_Type] ?? Mail;
                const isMeeting = interaction.Interaction_Type === 'Meeting';
                const date = new Date(interaction.Date);
                return (
                  <div key={interaction.Interaction_ID} className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      isMeeting ? 'bg-g-green/15' : 'bg-g-blue/15'
                    }`}>
                      <Icon size={14} className={isMeeting ? 'text-g-green' : 'text-g-blue'} />
                    </div>
                    <div className="flex-1 bg-bg-primary rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          isMeeting ? 'bg-g-green/15 text-g-green' : 'bg-g-blue/15 text-g-blue'
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
        )}
      </div>
    </div>
  );
}
