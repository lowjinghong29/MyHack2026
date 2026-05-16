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
      className="w-[220px] flex-shrink-0 flex flex-col border-r border-border"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 85%, var(--color-bg-primary)) 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-g-blue to-g-green flex items-center justify-center text-white font-bold text-sm"
          style={{ boxShadow: '0 0 12px 2px rgba(66,133,244,0.25)' }}
        >
          E
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-base text-text-primary">EcoLink AI</span>
          {/* Live data pulsing indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-g-green opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-g-green" />
          </span>
        </div>
      </div>

      {/* Navigation */}
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
                  `flex items-center gap-2.5 px-5 py-2.5 text-[13px] border-l-[3px] transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-g-blue/8 text-g-blue border-l-g-blue font-semibold'
                      : 'text-text-secondary border-l-transparent hover:bg-white/[0.04] hover:text-text-primary hover:translate-x-px hover:border-l-border'
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

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-1.5 mb-0.5">
          {/* Google color dots */}
          <span className="w-1.5 h-1.5 rounded-full bg-g-blue" />
          <span className="w-1.5 h-1.5 rounded-full bg-g-red" />
          <span className="w-1.5 h-1.5 rounded-full bg-g-yellow" />
          <span className="w-1.5 h-1.5 rounded-full bg-g-green" />
          <span className="text-[10px] text-text-muted ml-0.5">Powered by Google AI</span>
        </div>
        <div className="text-[10px] text-text-muted">MyHack 2026</div>
      </div>
    </aside>
  );
}
