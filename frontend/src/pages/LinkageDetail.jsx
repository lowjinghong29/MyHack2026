import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, TrendingUp, TrendingDown, Mail, Calendar } from 'lucide-react';
import { getLinkage, getEntity, getLinkageInteractions } from '../lib/sampleData';

function HealthGauge({ score }) {
  const color = score >= 70 ? '#34a853' : score >= 40 ? '#fbbc04' : '#ea4335';
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'Warning' : 'At Risk';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${score * 2.64} ${264 - score * 2.64}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] text-text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function LinkageDetail() {
  const { id } = useParams();
  const linkage = getLinkage(id);

  if (!linkage) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-text-muted">Linkage not found</div>
        <Link to="/" className="text-g-blue text-sm hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const entityA = getEntity(linkage.Entity_A_ID);
  const entityB = getEntity(linkage.Entity_B_ID);
  const interactionsList = getLinkageInteractions(linkage.Linkage_ID);

  const typeColor = {
    Mentorship: 'bg-g-blue/15 text-g-blue',
    Partnership: 'bg-g-green/15 text-g-green',
    Investment: 'bg-g-yellow/15 text-g-yellow',
  };

  const interactionIcon = {
    Meeting: Calendar,
    Email: Mail,
  };

  return (
    <div>
      <Link to="/" className="flex items-center gap-1.5 text-text-muted text-xs hover:text-text-primary transition-colors mb-4 cursor-pointer">
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-bg-card border border-border rounded-xl p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-g-blue/15 flex items-center justify-center text-g-blue font-bold">
                {entityA?.Name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-semibold">{entityA?.Name}</div>
                <div className="text-[11px] text-text-muted">{entityA?.Role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4">
              <div className="w-8 h-px bg-border" />
              <Heart size={16} className="text-g-blue" />
              <div className="w-8 h-px bg-border" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-g-green/15 flex items-center justify-center text-g-green font-bold">
                {entityB?.Name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-semibold">{entityB?.Name}</div>
                <div className="text-[11px] text-text-muted">{entityB?.Role}</div>
              </div>
            </div>
          </div>
          <span className={`text-[11px] px-3 py-1 rounded-lg font-semibold ${typeColor[linkage.Linkage_Type]}`}>
            {linkage.Linkage_Type}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-bg-primary rounded-lg p-4 flex flex-col items-center">
            <HealthGauge score={linkage.Health_Score} />
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Linkage ID</div>
            <div className="text-sm font-semibold font-mono">{linkage.Linkage_ID}</div>
            <div className="text-[10px] text-text-muted mt-1">Created {linkage.Start_Date}</div>
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Last Interaction</div>
            <div className="text-sm font-semibold">{linkage.Last_Interaction_Date}</div>
            <div className="flex items-center gap-1 mt-1">
              {linkage.Health_Score >= 50
                ? <TrendingUp size={12} className="text-g-green" />
                : <TrendingDown size={12} className="text-g-red" />
              }
              <span className={`text-[10px] ${linkage.Health_Score >= 50 ? 'text-g-green' : 'text-g-red'}`}>
                {linkage.Health_Score >= 50 ? 'Active' : 'Declining'}
              </span>
            </div>
          </div>
          <div className="bg-bg-primary rounded-lg p-4">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">Total Interactions</div>
            <div className="text-2xl font-bold text-g-blue">{interactionsList.length}</div>
            <div className="text-[10px] text-text-muted mt-1">Since {linkage.Start_Date}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4">Interaction Timeline</h2>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {interactionsList.map(interaction => {
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
      </div>
    </div>
  );
}
