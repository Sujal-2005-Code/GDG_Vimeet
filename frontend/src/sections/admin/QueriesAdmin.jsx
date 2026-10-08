import { useEffect, useState } from 'react';
import { getQueries, updateQueryStatus, deleteQuery } from '../../services/adminQueries';

const STATUS_FLOW = { new: 'reviewing', reviewing: 'resolved', resolved: 'resolved' };

const STATUS_STYLES = {
  new: 'bg-blue-950/60 border-blue-500/50 text-blue-300',
  reviewing: 'bg-amber-950/60 border-amber-500/50 text-amber-300',
  resolved: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300',
  dismissed: 'bg-white/5 border-white/15 text-white/50',
};

const SOURCE_LABELS = {
  manual: 'Asked directly',
  'chat-unavailable': 'Assistant was offline',
  'chat-no-answer': "Assistant couldn't answer",
  'faq-feedback': 'Marked not helpful',
};

const QueriesAdmin = () => {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQueries();
      setQueries(data);
    } catch (err) {
      setError(
        err.status === 401 || err.status === 403
          ? 'Your admin session has expired. Please sign in again.'
          : 'Could not load queries. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdvance = async (query) => {
    const next = STATUS_FLOW[query.status] ?? 'reviewing';
    setBusyId(query._id);
    try {
      const updated = await updateQueryStatus(query._id, next);
      setQueries((current) => current.map((q) => (q._id === updated._id ? updated : q)));
    } catch {
      setError('Could not update this query. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = async (query) => {
    setBusyId(query._id);
    try {
      const updated = await updateQueryStatus(query._id, 'dismissed');
      setQueries((current) => current.map((q) => (q._id === updated._id ? updated : q)));
    } catch {
      setError('Could not update this query. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await deleteQuery(id);
      setQueries((current) => current.filter((q) => q._id !== id));
      setConfirmDeleteId(null);
    } catch {
      setError('Could not delete this query. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const newCount = queries.filter((q) => q.status === 'new').length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Queries</h1>
          {newCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/50 text-blue-300 text-xs font-semibold">
              {newCount} New
            </span>
          )}
        </div>
        <p className="text-sm text-white/60 mt-1">
          Questions visitors submitted directly, or handed off by the chatbot when it couldn't help.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.08]">
          <p className="text-rose-200 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="shrink-0 text-white/50 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.02]">
          <span className="inline-block size-6 rounded-full border-2 border-white/15 border-t-white animate-spin mb-3" />
          <p className="text-white/60 text-sm">Loading queries…</p>
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
          <p className="text-white text-lg font-semibold mb-1">No questions yet</p>
          <p className="text-white/50 text-sm">
            Questions from the chatbot fallback or the contact box will show up here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
          {queries.map((query) => (
            <div key={query._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white leading-relaxed break-words">{query.question}</p>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <span className="text-xs text-white/40">
                    {new Date(query.createdAt).toLocaleString()}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs text-white/40">{SOURCE_LABELS[query.source] ?? query.source}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${STATUS_STYLES[query.status] ?? STATUS_STYLES.new}`}
                >
                  {query.status}
                </span>

                {query.status !== 'resolved' && query.status !== 'dismissed' && (
                  <button
                    onClick={() => handleAdvance(query)}
                    disabled={busyId === query._id}
                    title={`Mark as ${STATUS_FLOW[query.status] ?? 'reviewing'}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition disabled:opacity-50"
                  >
                    Mark {STATUS_FLOW[query.status] ?? 'reviewing'}
                  </button>
                )}

                {query.status !== 'dismissed' && query.status !== 'resolved' && (
                  <button
                    onClick={() => handleDismiss(query)}
                    disabled={busyId === query._id}
                    title="Dismiss without resolving"
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 transition disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                )}

                {confirmDeleteId === query._id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(query._id)}
                      disabled={busyId === query._id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition disabled:opacity-50"
                    >
                      {busyId === query._id ? 'Deleting…' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={busyId === query._id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(query._id)}
                    title="Delete this query"
                    className="inline-flex items-center justify-center size-8 rounded-lg text-white/40 hover:text-rose-300 hover:bg-rose-950/40 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueriesAdmin;
