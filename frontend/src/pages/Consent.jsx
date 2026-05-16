import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { respondConsent } from '../lib/api';

export default function Consent() {
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const partner = searchParams.get('partner');
  const type = searchParams.get('type');

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'result'
  const [decisionMade, setDecisionMade] = useState(null); // 'ACCEPTED' | 'DECLINED'
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [reason, setReason] = useState('');

  const hasMeta = role && partner && type;

  const submit = async (decision) => {
    setStatus('loading');
    setError(null);
    setDecisionMade(decision);
    try {
      const data = await respondConsent(matchId, role || 'company', decision, decision === 'DECLINED' ? reason : '');
      setResponse(data);
      setStatus('result');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const handleAccept = () => submit('ACCEPTED');

  const handleDeclineClick = () => {
    if (!showDeclineReason) {
      setShowDeclineReason(true);
      return;
    }
    submit('DECLINED');
  };

  const retry = () => {
    setError(null);
    setStatus('idle');
    setDecisionMade(null);
  };

  // Invalid link: no matchId
  if (!matchId) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <XCircle size={20} className="text-red-400" />
          <h1 className="text-xl font-bold">Invalid Consent Link</h1>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-6 max-w-xl">
          <div className="text-sm text-text-secondary">
            This consent link is missing a match identifier. Please check the link in your email or contact the team.
          </div>
        </div>
      </div>
    );
  }

  const responseStatus = response?.status;
  const linkageId = response?.linkageId;

  const successHeadline = () => {
    if (linkageId) return 'Match approved — Linkage created';
    if (responseStatus === 'ACCEPTED') return "Thanks for accepting!";
    if (responseStatus === 'DECLINED') return 'Match declined';
    if (responseStatus === 'WAITING_FOR_OTHER_PARTY') return 'Response recorded';
    return 'Response recorded';
  };

  const successBody = () => {
    if (linkageId) return `Both parties have accepted. Linkage ${linkageId} has been created and is now active.`;
    if (responseStatus === 'ACCEPTED') return "We'll wait for the other party to respond, then notify you when the match is finalized.";
    if (responseStatus === 'DECLINED') return 'Match declined. Thanks for letting us know — we will look for other opportunities.';
    if (responseStatus === 'WAITING_FOR_OTHER_PARTY') return "Your response has been recorded. We'll wait for the other party before finalizing the match.";
    return 'Your response has been recorded.';
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Mail size={20} className="text-accent" />
        <h1 className="text-xl font-bold">
          {hasMeta ? 'Match Consent Request' : 'Consent request'}
        </h1>
        {type && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold ml-2">
            {type}
          </span>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-bg-card border border-border rounded-xl p-6 mb-6 max-w-xl">
        {hasMeta ? (
          <>
            <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-2">
              Match ID
            </div>
            <div className="text-sm font-mono text-text-secondary mb-5">{matchId}</div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <Sparkles size={18} className="text-accent" />
              </div>
              <div>
                <div className="text-sm text-text-muted">You've been matched with</div>
                <div className="text-base font-semibold text-text-primary">{partner}</div>
              </div>
            </div>

            <div className="bg-bg-primary border border-border rounded-lg p-4 text-xs text-text-secondary leading-relaxed">
              You are reviewing this match as the{' '}
              <span className="text-accent font-semibold">{role}</span>. The proposed
              linkage type is <span className="text-accent font-semibold">{type}</span>.
              Please accept or decline below — both parties must accept for the match to be finalized.
            </div>
          </>
        ) : (
          <>
            <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-2">
              Match ID
            </div>
            <div className="text-sm font-mono text-text-secondary">{matchId}</div>
            <div className="text-xs text-text-muted mt-4">
              Match details could not be loaded from this link. You can still respond below.
            </div>
          </>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 max-w-xl text-red-400 text-xs flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={retry}
            className="px-3 py-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300 font-semibold text-[11px] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Idle: action buttons */}
      {status === 'idle' && (
        <div className="bg-bg-card border border-border rounded-xl p-6 max-w-xl">
          <h2 className="text-sm font-semibold mb-4">Your response</h2>

          {showDeclineReason && (
            <div className="mb-4">
              <label className="block text-[11px] text-text-muted font-medium mb-2 uppercase tracking-wider">
                Reason for declining (optional)
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder="Help us understand — e.g. timing, mismatch, already engaged elsewhere..."
                className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-xs text-text-primary focus:outline-none focus:border-accent/50 resize-none"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {!showDeclineReason && (
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-dim transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={14} />
                Accept
              </button>
            )}
            <button
              onClick={handleDeclineClick}
              className={`${showDeclineReason ? 'flex-1' : 'flex-1'} px-6 py-3 bg-g-red text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2`}
            >
              <XCircle size={14} />
              {showDeclineReason ? 'Confirm decline' : 'Decline'}
            </button>
            {showDeclineReason && (
              <button
                onClick={() => { setShowDeclineReason(false); setReason(''); }}
                className="px-4 py-3 bg-bg-primary border border-border text-text-secondary rounded-lg text-xs font-medium hover:bg-bg-card-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="bg-bg-card border border-border rounded-xl p-10 max-w-xl flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
            <Loader2 size={20} className="text-accent animate-spin" />
          </div>
          <div className="text-sm font-medium">
            Recording your {decisionMade === 'ACCEPTED' ? 'acceptance' : 'response'}...
          </div>
          <div className="text-xs text-text-muted">Please wait a moment</div>
        </div>
      )}

      {/* Result */}
      {status === 'result' && response && (
        <div
          className={`border rounded-xl p-6 max-w-xl ${
            responseStatus === 'DECLINED'
              ? 'bg-red-500/5 border-red-500/30'
              : 'bg-accent/10 border-accent/30'
          }`}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                responseStatus === 'DECLINED' ? 'bg-red-500/20' : 'bg-accent/20'
              }`}
            >
              {responseStatus === 'DECLINED' ? (
                <XCircle size={20} className="text-red-400" />
              ) : (
                <CheckCircle2 size={20} className="text-accent" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-text-primary mb-1">
                {successHeadline()}
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">
                {successBody()}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-[11px] text-text-muted">
            <span className="uppercase tracking-wider font-medium">Status</span>
            <span
              className={`px-2 py-0.5 rounded font-semibold ${
                responseStatus === 'DECLINED'
                  ? 'bg-red-500/15 text-red-400'
                  : 'bg-accent/15 text-accent'
              }`}
            >
              {responseStatus || 'RECORDED'}
            </span>
            {linkageId && (
              <>
                <ArrowRight size={12} className="text-text-muted" />
                <span className="font-mono text-text-secondary">{linkageId}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
