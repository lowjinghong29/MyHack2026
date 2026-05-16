import { useState } from 'react';
import { UserPlus, Loader2, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const ROLES = [
  { value: 'Company', label: 'Company / Startup', desc: 'Register your startup to get matched with mentors' },
  { value: 'Mentor', label: 'Mentor', desc: 'Share your expertise and guide startups' },
  { value: 'Partner', label: 'Partner', desc: 'Join as a VC, accelerator, or corporate partner' },
];

const INDUSTRIES = ['FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech', 'PropTech', 'Logistics', 'AI', 'SaaS', 'IoT', 'InsurTech', 'HR Tech'];

export default function Register() {
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', industry: '', expertise: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !form.name || !form.email) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'registerEntity',
          name: form.name,
          role: role,
          email: form.email,
          industryTags: form.industry,
          expertiseNeeds: form.expertise,
        }),
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      setSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <CheckCircle size={48} className="text-accent mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Registration Complete</h2>
        <p className="text-text-secondary text-sm mb-4">
          Welcome, <strong>{form.name}</strong>! Your Entity ID is <code className="text-accent">{success.entityId}</code>.
        </p>
        {role === 'Company' && (
          <p className="text-text-muted text-xs">You can now go to <strong>AI Matching</strong> to find your ideal mentor.</p>
        )}
        <button onClick={() => { setSuccess(null); setRole(''); setForm({ name: '', email: '', industry: '', expertise: '' }); }}
          className="mt-6 px-6 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dim transition-colors cursor-pointer">
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus size={20} className="text-accent" />
        <h1 className="text-xl font-bold">Join EcoLink AI</h1>
      </div>

      {/* Role Selection */}
      {!role && (
        <div>
          <p className="text-sm text-text-secondary mb-4">Select your role to get started:</p>
          <div className="grid grid-cols-3 gap-3">
            {ROLES.map(r => (
              <button key={r.value} onClick={() => setRole(r.value)}
                className="bg-bg-card border border-border rounded-xl p-5 text-left hover:border-accent/30 transition-all cursor-pointer">
                <div className="text-sm font-semibold text-text-primary mb-1">{r.label}</div>
                <div className="text-[11px] text-text-muted">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Registration Form */}
      {role && (
        <form onSubmit={handleSubmit}>
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold">{ROLES.find(r => r.value === role)?.label} Registration</h2>
              <button type="button" onClick={() => setRole('')} className="text-[11px] text-text-muted hover:text-text-primary cursor-pointer">Change role</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-text-muted font-medium mb-1.5 uppercase tracking-wider">
                  {role === 'Company' ? 'Company Name' : role === 'Partner' ? 'Organisation Name' : 'Full Name'}
                </label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={role === 'Company' ? 'e.g. PayFlex Sdn Bhd' : role === 'Partner' ? 'e.g. Cradle Fund' : 'e.g. Dr. Amirul Hakim'}
                  className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] text-text-muted font-medium mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] text-text-muted font-medium mb-1.5 uppercase tracking-wider">Industry Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {INDUSTRIES.map(ind => {
                    const selected = form.industry.includes(ind);
                    return (
                      <button key={ind} type="button"
                        onClick={() => {
                          const tags = form.industry ? form.industry.split(', ').filter(Boolean) : [];
                          const next = selected ? tags.filter(t => t !== ind) : [...tags, ind];
                          setForm({ ...form, industry: next.join(', ') });
                        }}
                        className={`px-2.5 py-1 text-[10px] rounded-lg font-medium transition-colors cursor-pointer ${
                          selected ? 'bg-accent text-white' : 'bg-bg-primary border border-border text-text-secondary hover:bg-bg-card-hover'
                        }`}>
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-text-muted font-medium mb-1.5 uppercase tracking-wider">
                  {role === 'Company' ? 'What help do you need?' : role === 'Mentor' ? 'Your expertise & availability' : 'Services offered'}
                </label>
                <textarea value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })}
                  rows={3}
                  placeholder={role === 'Company' ? 'e.g. Need mentorship on fundraising and regulatory compliance...' : role === 'Mentor' ? 'e.g. 10 years in FinTech, can mentor on payments infrastructure...' : 'e.g. Cloud credits, investor introductions, legal advisory...'}
                  className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none" />
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-g-red/10 border border-g-red/30 rounded-lg p-3 text-xs text-g-red">{error}</div>
            )}

            <button type="submit" disabled={submitting || !form.name || !form.email}
              className="mt-5 w-full py-2.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-dim transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Registering...</> : <><UserPlus size={14} /> Register</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
