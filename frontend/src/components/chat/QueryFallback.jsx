import { useState } from 'react';
import { submitQuery } from '../../services/queries';
import { site } from '../../data/site';
import Icon from '../ui/Icon';
import ChatHeader from './ChatHeader';

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
    <div className="flex h-full flex-col overflow-hidden border border-line bg-surface shadow-overlay sm:rounded-media">
      <ChatHeader onClose={onClose} />

      <div className="flex flex-1 flex-col justify-center gap-3 overflow-y-auto px-6 py-6">
        {status === 'success' ? (
          <div role="status" className="text-center">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-success-tint text-success">
              <Icon name="check" className="size-6" />
            </span>
            <p className="mt-4 text-lg font-semibold text-ink">Question sent</p>
            <p className="mt-1 text-sm text-ink-2">The GDG ViMEET team will review it.</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-3 min-h-11 text-sm font-semibold text-primary hover:underline"
            >
              Send another question
            </button>
          </div>
        ) : (
          <>
            <p className="text-lg font-semibold text-ink">Have a question?</p>
            <p className="text-sm text-ink-2">
              {site.chatbot.name} is currently unavailable, but you can send your question to the GDG ViMEET team.
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <label htmlFor="fallback-question" className="sr-only">
                Your question
              </label>
              <textarea
                id="fallback-question"
                rows={3}
                maxLength={MAX_CHARS}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your question…"
                className="w-full resize-none rounded-field border border-line-strong bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-ink-2/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm"
              />
              {status === 'error' && (
                <p role="alert" className="text-sm text-danger">
                  Couldn't submit your question right now. Please try again later.
                </p>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={status === 'sending' || question.trim().length === 0}
                className="min-h-11 w-full rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'sending' ? 'Submitting…' : 'Submit question'}
              </button>
            </div>
          </>
        )}
        <a href={`mailto:${site.email}`} className="mt-2 inline-flex min-h-11 items-center justify-center text-sm text-ink-2 hover:text-ink hover:underline">
          Or email {site.email} directly
        </a>
      </div>
    </div>
  );
};

export default QueryFallback;
