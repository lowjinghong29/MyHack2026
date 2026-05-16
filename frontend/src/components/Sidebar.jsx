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
    <aside className="w-[220px] bg-bg-card border-r border-border flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-g-blue to-g-green flex items-center justify-center text-white font-bold text-sm">
          E
        </div>
        <span className="font-bold text-base text-text-primary">EcoLink AI</span>
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
                  `flex items-center gap-2.5 px-5 py-2.5 text-[13px] border-l-[3px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-g-blue/8 text-g-blue border-l-g-blue font-semibold'
                      : 'text-text-secondary border-l-transparent hover:bg-white/[0.03] hover:text-text-primary'
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
        <div className="text-[10px] text-text-muted">Powered by Gemini AI</div>
        <div className="text-[10px] text-text-muted">MyHack 2026</div>
      </div>
    </aside>
  );
}
