import { Link } from 'react-router-dom';
import { Building2, Users, Handshake, ArrowRight } from 'lucide-react';

const ROLES = [
  {
    to: '/register/company',
    icon: Building2,
    title: 'Company / Startup',
    description: "I'm building a startup and need mentors, partners, or investors.",
  },
  {
    to: '/register/mentor',
    icon: Users,
    title: 'Mentor',
    description: "I'm an expert and want to mentor startups in my domain.",
  },
  {
    to: '/register/partner',
    icon: Handshake,
    title: 'Partner / Investor',
    description: "I'm a VC, accelerator, or service provider looking to engage with the ecosystem.",
  },
];

export default function Register() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Building2 size={20} className="text-accent" />
        <h1 className="text-xl font-bold">Join the Ecosystem</h1>
      </div>

      <p className="text-sm text-text-muted mb-6 max-w-2xl">
        Choose the role that best describes you. We'll tailor the onboarding questions
        and match you with the right people in the network.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES.map(({ to, icon: Icon, title, description }) => (
          <Link
            key={to}
            to={to}
            className="bg-bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors cursor-pointer flex flex-col gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent">
              <Icon size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary mb-1">{title}</div>
              <div className="text-xs text-text-muted leading-relaxed">{description}</div>
            </div>
            <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
              Get started <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
