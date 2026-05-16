import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, Brain, TrendingUp, Zap } from 'lucide-react';
import { fetchSheet, requestAIMatch, sendConsent, getLearningStatus } from '../lib/api';

export default function AIMatch() {
  const [entities, setEntities] = useState([]);
  const [entitiesLoading, setEntitiesLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [matchType, setMatchType] = useState('Mentorship');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [consentSending, setConsentSending] = useState(null);
  const [consentResult, setConsentResult] = useState(null);
  const [learningStatus, setLearningStatus] = useState(null);
  const [matchMeta, setMatchMeta] = useState(null);

  useEffect(() => {
    fetchSheet('Entities')
      .then(data => setEntities(data.entities || []))
      .catch(() => setEntities([]))
      .finally(() => setEntitiesLoading(false));
    getLearningStatus()
      .then(setLearningStatus)
      .catch(() => {});
  }, []);

  const handleMatch = async () => {
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const data = await requestAIMatch(selectedEntity, matchType);
      setResults(data.matches || []);
      setMatchMeta({ promptVersion: data.promptVersion, promptType: data.promptType, patternsUsed: data.patternsUsed, outcomesAnalysed: data.outcomesAnalysed });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = async (match) => {
    setConsentSending(match.entityId);
    setConsentResult(null);
    try {
      const data = await sendConsent(
        selectedEntity, match.entityId,
        match.score, match.reason, matchType
      );
      setConsentResult({ matchId: data.matchId, mentorName: match.name, status: data.status });
    } catch (err) {
      setConsentResult({ error: err.message || 'Failed to send consent emails' });
    } finally {
      setConsentSending(null);
    }
  };

  const activeEntities = entities.filter(e => e.Status === 'Active');

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-accent" />
        <h1 className="text-xl font-bold">AI Match Request</h1>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold ml-2">
          Powered by Gemini 3.1
        </span>
      </div>

      {/* Request Form */}
      <div className="bg-bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4">Find the best match</h2>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-[11px] text-text-muted font-medium mb-2 uppercase tracking-wider">
              Entity
            </label>
            <select
              value={selectedEntity}
              onChange={e => setSelectedEntity(e.target.value)}
              disabled={entitiesLoading}
              className="w-full bg-bg-primary border border-border rounded-lg py-2.5 px-3 text-xs text-text-primary focus:outline-none focus:border-accent/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {entitiesLoading ? (
                <option value="">Loading entities...</option>
              ) : (
                <>
                  <option value="">Select an entity...</option>
                  {activeEntities.map(e => (
                    <option key={e.Entity_ID} value={e.Entity_ID}>
                      {e.Name} ({e.Role})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-text-muted font-medium mb-2 uppercase tracking-wider">
              Relationship Type
            </label>
            <div className="flex gap-2">
              {['Mentorship', 'Partnership', 'Investment'].map(type => (
                <button
                  key={type}
                  onClick={() => setMatchType(type)}
                  className={`flex-1 py-2.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    matchType === type
                      ? 'bg-accent text-white'
                      : 'bg-bg-primary border border-border text-text-secondary hover:bg-bg-card-hover'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleMatch}
          disabled={!selectedEntity || loading || entitiesLoading}
          className="px-6 py-2.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-dim transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Gemini is analyzing...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Find Matches
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Consent Result */}
      {consentResult && !consentResult.error && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-4 text-accent text-xs">
          Consent emails sent for match <strong>{consentResult.matchId}</strong> — waiting for both parties to respond.
        </div>
      )}
      {consentResult?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-red-400 text-xs">
          {consentResult.error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-bg-card border border-border rounded-xl p-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
            <Loader2 size={20} className="text-accent animate-spin" />
          </div>
          <div className="text-sm font-medium">Gemini is analyzing entity profiles...</div>
          <div className="text-xs text-text-muted">Matching expertise, industry tags, and compatibility signals</div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold">Top Matches</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-g-green/15 text-g-green font-semibold">
              {results.length} found
            </span>
          </div>
          <div className="space-y-3">
            {results.map((match, i) => (
              <div key={match.entityId} className="bg-bg-card border border-border rounded-xl p-5 hover:bg-bg-card-hover transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{match.name}</div>
                      <div className="text-[11px] text-text-muted">{match.role} &middot; {match.entityId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-g-green">{Math.round(match.score * 100)}%</div>
                      <div className="text-[10px] text-text-muted">Match Score</div>
                    </div>
                    <button
                      onClick={() => handleSelectMatch(match)}
                      disabled={consentSending === match.entityId}
                      className="p-2 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 transition-colors cursor-pointer disabled:opacity-50"
                      title="Send consent emails to both parties"
                    >
                      {consentSending === match.entityId ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-text-secondary leading-relaxed pl-[52px]">
                  <span className="text-accent font-medium">Gemini says: </span>{match.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Metadata — shows after results */}
      {matchMeta && results && (
        <div className="bg-bg-card border border-accent/20 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-accent" />
            <span className="text-[13px] font-semibold">AI Learning Proof</span>
          </div>
          <div className="grid grid-cols-4 gap-3 text-[11px]">
            <div className="bg-bg-primary rounded-lg p-3">
              <div className="text-text-muted mb-1">Prompt Version</div>
              <div className="text-lg font-bold text-accent">v{matchMeta.promptVersion}</div>
              <div className="text-text-muted">{matchMeta.promptType}</div>
            </div>
            <div className="bg-bg-primary rounded-lg p-3">
              <div className="text-text-muted mb-1">Patterns Used</div>
              <div className="text-lg font-bold text-g-yellow">{matchMeta.patternsUsed || 0}</div>
              <div className="text-text-muted">learned from history</div>
            </div>
            <div className="bg-bg-primary rounded-lg p-3">
              <div className="text-text-muted mb-1">Outcomes Analysed</div>
              <div className="text-lg font-bold text-g-green">{matchMeta.outcomesAnalysed || 0}</div>
              <div className="text-text-muted">completed programmes</div>
            </div>
            <div className="bg-bg-primary rounded-lg p-3">
              <div className="text-text-muted mb-1">Model</div>
              <div className="text-lg font-bold text-text-primary">Gemini</div>
              <div className="text-text-muted">3.1 Flash</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Learning Status Panel */}
      {learningStatus && (
        <div className="bg-bg-card border border-border rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-[13px] font-semibold">AI Model Intelligence</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold ml-auto">
              Prompt v{learningStatus.promptVersion}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{learningStatus.estimatedAccuracy}%</div>
              <div className="text-[10px] text-text-muted">Est. Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-g-yellow">{learningStatus.patternsLearned}</div>
              <div className="text-[10px] text-text-muted">Patterns Learned</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-g-green">{learningStatus.outcomesAnalysed}</div>
              <div className="text-[10px] text-text-muted">Outcomes Analysed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-text-primary">{learningStatus.matchesProcessed}</div>
              <div className="text-[10px] text-text-muted">Matches Processed</div>
            </div>
          </div>

          {/* Accuracy Trajectory */}
          <div className="flex items-end gap-1 h-12 mb-2">
            {(learningStatus.accuracyHistory || []).map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-text-muted">{h.accuracy}%</span>
                <div className="w-full rounded-t" style={{ height: `${h.accuracy * 0.4}px`, background: i === (learningStatus.accuracyHistory.length - 1) ? '#10b981' : '#1a1f2e', border: '1px solid rgba(16,185,129,0.3)' }} />
                <span className="text-[8px] text-text-muted">P{h.programme}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <Zap size={10} className="text-accent" />
            <span>Each programme adds outcome data → smarter matching → higher accuracy</span>
          </div>

          {/* Learned Patterns */}
          {learningStatus.patterns && learningStatus.patterns.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <div className="text-[11px] text-text-muted mb-2">Discovered Patterns:</div>
              {learningStatus.patterns.map((p, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${p.confidence === 'HIGH' ? 'bg-accent/15 text-accent' : 'bg-g-yellow/15 text-g-yellow'}`}>
                    {p.confidence}
                  </span>
                  <span className="text-[10px] text-text-secondary">{p.pattern}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !results && !error && !learningStatus && (
        <div className="bg-bg-card border border-border rounded-xl p-10 flex flex-col items-center gap-3 text-center">
          <Sparkles size={32} className="text-text-muted" />
          <div className="text-sm text-text-muted">Select an entity and click &quot;Find Matches&quot; to get AI-powered recommendations</div>
        </div>
      )}
    </div>
  );
}
