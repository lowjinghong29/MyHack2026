import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { addEntity } from '../lib/api';

const INDUSTRY_OPTIONS = [
  'Fintech',
  'Healthtech',
  'Edtech',
  'Agritech',
  'Logistics',
  'Sustainability',
  'Proptech',
];

const STAGE_OPTIONS = ['Pre-seed', 'Seed', 'Series A'];

const HELP_OPTIONS = [
  'Fundraising',
  'Product development',
  'Market access',
  'Legal & compliance',
  'Business model',
  'Bank/corporate partnerships',
  'Hiring & team building',
];

const inputCls =
  'w-full px-3 py-2 bg-bg-card border border-border rounded-md text-sm focus:outline-none focus:border-accent';
const labelCls =
  'block text-xs font-semibold uppercase tracking-wide text-text-muted mb-1.5';
const errorInputCls =
  'w-full px-3 py-2 bg-bg-card border border-red-500/60 rounded-md text-sm focus:outline-none focus:border-red-500';

export default function RegisterCompany() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industries, setIndustries] = useState([]);
  const [stage, setStage] = useState('');
  const [help, setHelp] = useState([]);
  const [challenge, setChallenge] = useState('');
  const [website, setWebsite] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const toggleArrayValue = (arr, setter, value) => {
    setter(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!email.trim()) errs.email = true;
    if (industries.length === 0) errs.industries = true;
    if (!stage) errs.stage = true;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    const parts = [`Stage: ${stage}`];
    if (help.length > 0) parts.push(`Looking for: ${help.join(', ')}`);
    if (challenge.trim()) parts.push(`Challenge: ${challenge.trim()}`);
    if (website.trim()) parts.push(`Website: ${website.trim()}`);
    const expertiseNeeds = parts.join('. ');

    const payload = {
      name: name.trim(),
      role: 'Company',
      email: email.trim(),
      industryTags: industries.join(', '),
      expertiseNeeds,
    };

    setSubmitting(true);
    try {
      const data = await addEntity(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setIndustries([]);
    setStage('');
    setHelp([]);
    setChallenge('');
    setWebsite('');
    setResult(null);
    setError(null);
    setFieldErrors({});
  };

  if (result) {
    const entityId = result.entityId || result.Entity_ID || result.id || 'pending';
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 size={20} className="text-g-green" />
          <h1 className="text-xl font-bold">Registration Complete</h1>
        </div>

        <div className="max-w-2xl mx-auto bg-bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-g-green/15 flex items-center justify-center text-g-green mx-auto mb-4">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-base font-semibold mb-2">Welcome to the ecosystem, {name}!</h2>
          <p className="text-xs text-text-muted mb-5">
            Your company has been registered. Use your Entity ID for AI Match requests
            and to track linkages.
          </p>

          <div className="bg-bg-primary border border-border rounded-md py-3 px-4 mb-6 inline-block">
            <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Your Entity ID</div>
            <div className="text-sm font-mono font-semibold text-accent">{entityId}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 bg-accent text-white rounded-md text-sm font-semibold hover:bg-accent-dim transition-colors cursor-pointer"
            >
              Register another
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto px-4 py-2.5 bg-bg-primary border border-border text-text-secondary rounded-md text-sm font-semibold hover:bg-bg-card-hover transition-colors cursor-pointer text-center"
            >
              Back to roles
            </Link>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 py-2.5 bg-bg-primary border border-border text-text-secondary rounded-md text-sm font-semibold hover:bg-bg-card-hover transition-colors cursor-pointer"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Building2 size={20} className="text-accent" />
        <h1 className="text-xl font-bold">Register your Company</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Link
          to="/register"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft size={12} /> Back to role chooser
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-card border border-border rounded-xl p-6"
          noValidate
        >
          <p className="text-xs text-text-muted mb-6">
            Tell us about your startup so the AI matcher can find the right mentors,
            partners and investors for you.
          </p>

          {/* Company name */}
          <div className="mb-5">
            <label htmlFor="name" className={labelCls}>
              Company name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Acme Robotics"
              className={fieldErrors.name ? errorInputCls : inputCls}
              disabled={submitting}
              maxLength={120}
            />
            {fieldErrors.name && (
              <div className="text-[11px] text-red-400 mt-1">Company name is required.</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className={labelCls}>
              Contact email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="founder@acme.com"
              className={fieldErrors.email ? errorInputCls : inputCls}
              disabled={submitting}
            />
            {fieldErrors.email && (
              <div className="text-[11px] text-red-400 mt-1">A contact email is required.</div>
            )}
          </div>

          {/* Industry */}
          <div className="mb-5">
            <label className={labelCls}>
              Industry <span className="text-red-400">*</span>
            </label>
            <div
              className={`${fieldErrors.industries ? 'border-red-500/60' : 'border-border'} bg-bg-primary border rounded-md p-3 grid grid-cols-2 gap-2`}
            >
              {INDUSTRY_OPTIONS.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={industries.includes(opt)}
                    onChange={() => toggleArrayValue(industries, setIndustries, opt)}
                    disabled={submitting}
                    className="accent-accent"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {fieldErrors.industries && (
              <div className="text-[11px] text-red-400 mt-1">Pick at least one industry.</div>
            )}
          </div>

          {/* Stage */}
          <div className="mb-5">
            <label className={labelCls}>
              Stage <span className="text-red-400">*</span>
            </label>
            <div
              className={`${fieldErrors.stage ? 'border-red-500/60' : 'border-border'} bg-bg-primary border rounded-md p-3 flex flex-col sm:flex-row gap-3`}
            >
              {STAGE_OPTIONS.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="stage"
                    value={opt}
                    checked={stage === opt}
                    onChange={() => setStage(opt)}
                    disabled={submitting}
                    className="accent-accent"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {fieldErrors.stage && (
              <div className="text-[11px] text-red-400 mt-1">Pick a funding stage.</div>
            )}
          </div>

          {/* Help needed */}
          <div className="mb-5">
            <label className={labelCls}>Help needed (optional)</label>
            <div className="bg-bg-primary border border-border rounded-md p-3 flex flex-col gap-2">
              {HELP_OPTIONS.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={help.includes(opt)}
                    onChange={() => toggleArrayValue(help, setHelp, opt)}
                    disabled={submitting}
                    className="accent-accent"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Current challenge */}
          <div className="mb-5">
            <label htmlFor="challenge" className={labelCls}>
              Current challenge (optional)
            </label>
            <textarea
              id="challenge"
              value={challenge}
              onChange={e => setChallenge(e.target.value)}
              placeholder="What's the biggest problem blocking you right now?"
              rows={4}
              className={`${inputCls} resize-none`}
              disabled={submitting}
              maxLength={1000}
            />
          </div>

          {/* Website */}
          <div className="mb-6">
            <label htmlFor="website" className={labelCls}>
              Website (optional)
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://acme.com"
              className={inputCls}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-4 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-accent text-white rounded-md text-sm font-semibold hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Registering...
              </>
            ) : (
              'Register Company'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
