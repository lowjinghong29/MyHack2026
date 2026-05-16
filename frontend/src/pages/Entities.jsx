import { useState, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { fetchSheet } from '../lib/api';

const roleBadge = {
  Mentor:  'bg-g-blue/15 text-g-blue',
  Company: 'bg-g-green/15 text-g-green',
  Partner: 'bg-g-yellow/15 text-g-yellow',
  Admin:   'bg-g-red/15 text-g-red',
};

const statusDot = {
  Active:  'bg-g-green',
  Dormant: 'bg-g-yellow',
  Churned: 'bg-g-red',
};

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchSheet('Entities')
      .then(data => setEntities(data.entities || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = entities.filter(e => {
    const q = search.toLowerCase();
    const matchesSearch =
      (e.Name || '').toLowerCase().includes(q) ||
      (e.Email || '').toLowerCase().includes(q) ||
      (e.Industry_Tags || '').toLowerCase().includes(q);
    const matchesRole = roleFilter === 'All' || e.Role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Loading entities…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-g-red text-sm">
        Failed to load entities: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Entity Directory</h1>
        <button className="px-4 py-2 text-xs bg-g-blue text-white rounded-lg font-semibold hover:bg-g-blue/90 transition-colors cursor-pointer flex items-center gap-1.5">
          <Plus size={14} /> Add Entity
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-bg-card border border-border rounded-lg py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-g-blue/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Mentor', 'Company', 'Partner'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 text-[11px] rounded-lg font-medium transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-g-blue text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:bg-bg-card-hover'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Industry</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(entity => {
              const initials = (entity.Name || '?')
                .split(' ')
                .map(n => n[0] || '')
                .join('');
              const tags = (entity.Industry_Tags || '').split(', ').filter(Boolean);
              return (
                <tr key={entity.Entity_ID} className="border-b border-border last:border-b-0 hover:bg-bg-card-hover transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-g-blue/15 flex items-center justify-center text-g-blue text-xs font-bold">
                        {initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-primary">{entity.Name}</div>
                        <div className="text-[10px] text-text-muted">{entity.Entity_ID}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${roleBadge[entity.Role] || 'bg-white/5 text-text-muted'}`}>
                      {entity.Role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{entity.Email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot[entity.Status] || 'bg-text-muted'}`} />
                      <span className="text-xs text-text-secondary">{entity.Status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-text-muted text-sm">No entities found</div>
        )}
      </div>
    </div>
  );
}
