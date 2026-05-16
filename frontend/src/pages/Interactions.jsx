import { useState } from 'react';
import { Mail, Calendar, Clock, Filter } from 'lucide-react';
import { interactions, getEntityName, getLinkage } from '../lib/sampleData';

const sorted = [...interactions].sort((a, b) => new Date(b.Date) - new Date(a.Date));

export default function Interactions() {
  const [typeFilter, setTypeFilter] = useState('All');

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
            const linkage = getLinkage(interaction.Linkage_ID);
            const entityAName = linkage ? getEntityName(linkage.Entity_A_ID) : '?';
            const entityBName = linkage ? getEntityName(linkage.Entity_B_ID) : '?';
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
