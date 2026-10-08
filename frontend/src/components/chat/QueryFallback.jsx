import { useState } from 'react';
import { submitQuery } from '../../services/queries';
import { site } from '../../data/site';

const MAX_CHARS = 500;

// Shown in place of the chatbot whenever it can't answer at all (no provider
// configured, or the health check reports it offline). Never implies an AI
// answer is coming — the copy is explicit that a person will read this.
const QueryFallback = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const submit = async () => {
    const trimmed = question.trim();
    if (!trimmed || status === 'sending') return;
    setStatus('sending');
    try {
      await submitQuery(trimmed, 'chat-unavailable');
      setStatus('success');
      setQuestion('');
    } catch {
      setStatus('error');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 border border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={site.chatbot.avatar} alt={site.chatbot.name} className="size-6 rounded-full object-cover shrink-0" />
          <p className="text-sm font-semibold text-white leading-tight">{site.chatbot.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="shrink-0 inline-flex items-center justify-center size-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 px-6 py-6 text-center overflow-y-auto">
        {status === 'success' ? (
          <>
            <p className="text-white text-base font-semibold">Question submitted successfully!</p>
            <p className="text-white/60 text-sm">The GDG ViMEET team will review it.</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-2 text-xs text-white/70 hover:text-white underline"
            >
              Send another question
            </button>
          </>
        ) : (
          <>
            <p className="text-white text-base font-semibold">Have a question?</p>
            <p className="text-white/60 text-sm leading-relaxed">
              {site.chatbot.name} is currently unavailable, but you can send your question to the GDG ViMEET team.
            </p>
            <div className="mt-2 flex flex-col gap-2 text-left">
              <textarea
                rows={3}
                maxLength={MAX_CHARS}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your question…"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/35 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition"
              />
              {status === 'error' && (
                <p role="alert" className="text-rose-300 text-xs">
                  Couldn't submit your question right now. Please try again later.
                </p>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={status === 'sending' || question.trim().length === 0}
                className="w-full rounded-xl bg-white text-black text-sm font-semibold py-2.5 hover:bg-white/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Submitting…' : 'Submit Question'}
              </button>
            </div>
          </>
        )}
        <a href="mailto:gdgvimeet@gmail.com" className="text-[11px] text-white/45 hover:text-white underline mt-2">
          Or email gdgvimeet@gmail.com directly
        </a>
      </div>
    </div>
  );
};

export default QueryFallback;
