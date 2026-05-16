import { useState, useEffect } from 'react';
import { Mail, Calendar, Clock, Loader2 } from 'lucide-react';
import { fetchAllData, buildEntityMap } from '../lib/api';

export default function Interactions() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [interactions, setInteractions] = useState([]);
  const [linkageMap, setLinkageMap] = useState({});
  const [entityMap, setEntityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData()
      .then(data => {
        const eMap = buildEntityMap(data.entities);
        const lMap = {};
        data.linkages.forEach(l => { lMap[l.Linkage_ID] = l; });
        const sorted = [...data.interactions].sort(
          (a, b) => new Date(b.Date) - new Date(a.Date)
        );
        setEntityMap(eMap);
        setLinkageMap(lMap);
        setInteractions(sorted);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = typeFilter === 'All'
    ? interactions
    : interactions.filter(i => i.Interaction_Type === typeFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={28} className="text-accent animate-spin" />
        <span className="text-sm text-text-muted">Loading interactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-red-400 text-sm">
        Failed to load interactions: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-accent" />
          <h1 className="text-xl font-bold">Interaction Timeline</h1>
        </div>
        <div className="flex gap-1.5">
          {['All', 'Meeting', 'Email'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-2 text-[11px] rounded-lg font-medium transition-colors cursor-pointer ${
                typeFilter === type
                  ? 'bg-accent text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:bg-bg-card-hover'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-text-muted text-sm">
          No interactions found for this filter
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-3">
            {filtered.map(interaction => {
              const linkage = linkageMap[interaction.Linkage_ID];
              const entityA = linkage ? entityMap[linkage.Entity_A_ID] : null;
              const entityB = linkage ? entityMap[linkage.Entity_B_ID] : null;
              const entityAName = entityA ? entityA.Name : (linkage ? linkage.Entity_A_ID : '?');
              const entityBName = entityB ? entityB.Name : (linkage ? linkage.Entity_B_ID : '?');
              const date = new Date(interaction.Date);
              const isMeeting = interaction.Interaction_Type === 'Meeting';
              const Icon = isMeeting ? Calendar : Mail;

              return (
                <div key={interaction.Interaction_ID} className="flex gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    isMeeting ? 'bg-g-green/15' : 'bg-accent/15'
                  }`}>
                    <Icon size={16} className={isMeeting ? 'text-g-green' : 'text-accent'} />
                  </div>
                  <div className="flex-1 bg-bg-card border border-border rounded-xl p-4 hover:bg-bg-card-hover transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          isMeeting ? 'bg-g-green/15 text-g-green' : 'bg-accent/15 text-accent'
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
      )}
    </div>
  );
}
