import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Link2, Sparkles, Clock } from 'lucide-react';

const navItems = [
  { label: 'Overview', items: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/entities', icon: Users, label: 'Entities' },
    { to: '/linkages', icon: Link2, label: 'Linkages' },
  ]},
  { label: 'AI Tools', items: [
    { to: '/ai-match', icon: Sparkles, label: 'AI Matching' },
    { to: '/interactions', icon: Clock, label: 'Interactions' },
  ]},
];

export default function Sidebar() {
  return (
    <aside
      className="w-[220px] border-r border-border flex-shrink-0 flex flex-col"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-primary) 100%)' }}
    >
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 0 12px 2px rgba(16, 185, 129, 0.25)',
          }}
        >
          E
        </div>
        <span className="font-bold text-base text-text-primary">EcoLink AI</span>
        <span className="relative flex h-2 w-2 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
      </div>

      <nav className="flex-1 mt-2">
        {navItems.map(section => (
          <div key={section.label}>
            <div className="px-5 pt-4 pb-2 text-[10px] font-semibold tracking-[1.5px] uppercase text-text-muted">
              {section.label}
            </div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-5 py-2.5 text-[13px] border-l-[3px] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-accent/8 text-accent border-l-accent font-semibold'
                      : 'text-text-secondary border-l-transparent hover:bg-accent/[0.04] hover:text-text-primary'
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="w-1.5 h-1.5 rounded-full bg-g-red" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="w-1.5 h-1.5 rounded-full bg-g-blue" />
          <span className="text-[10px] text-text-muted ml-1">Powered by Google AI</span>
        </div>
        <div className="text-[10px] text-text-muted mt-0.5">MyHack 2026</div>
      </div>
    </aside>
  );
}
