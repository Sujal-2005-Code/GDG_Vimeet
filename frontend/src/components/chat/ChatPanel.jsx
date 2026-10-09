import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import { useChat } from '../../hooks/useChat';
import { site } from '../../data/site';
import Icon from '../ui/Icon';
import ChatHeader from './ChatHeader';

const ChatPanel = ({ onClose, suggestions }) => {
  const { messages, isSending, error, retryAfter, canRetry, send, retry, sendToTeam, MAX_CHARS } = useChat();
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (text) => {
    send(text);
    setDraft('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(draft);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden border border-line bg-surface shadow-overlay sm:rounded-media">
      <ChatHeader onClose={onClose} subtitle="Answers about recruitment, teams and events" />

      {/* Messages — announced to screen readers as they arrive. */}
      <div ref={listRef} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div>
            <p className="rounded-card bg-surface-2 px-4 py-3 text-sm text-ink">
              Hey, I'm {site.chatbot.name}! Ask me anything about GDG ViMEET — joining a team, the application process, or our events.
            </p>
            {suggestions.length > 0 && (
              <div className="mt-4 flex flex-col items-start gap-2">
                <p className="font-mono text-overline font-medium uppercase text-ink-2">Try asking</p>
                {suggestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => submit(question)}
                    className="min-h-11 rounded-card border border-line bg-surface px-3.5 py-2 text-left text-sm text-ink transition-colors hover:border-line-strong hover:bg-surface-2"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              precedingQuestion={index > 0 ? messages[index - 1]?.content : undefined}
              onSendToTeam={(question, source) => sendToTeam(question, index, source)}
            />
          ))
        )}

        {isSending && (
          <div className="flex items-center gap-1.5 px-1 text-xs text-ink-2" role="status">
            <span className="size-1.5 animate-pulse rounded-full bg-google-blue" />
            <span className="size-1.5 animate-pulse rounded-full bg-google-red [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-google-yellow [animation-delay:300ms]" />
            <span className="ml-1">Thinking…</span>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-card bg-danger-tint px-3.5 py-3">
            <p className="text-sm text-danger">{error}</p>
            {retryAfter > 0 ? (
              <p className="mt-1 text-xs text-ink-2">Try again in {retryAfter}s.</p>
            ) : (
              <div className="mt-1.5 flex items-center gap-4">
                {canRetry && (
                  <button type="button" onClick={retry} className="min-h-11 text-sm font-semibold text-primary hover:underline">
                    Try again
                  </button>
                )}
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">
                  Email us instead
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Your question
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_CHARS}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question…"
            className="max-h-28 min-h-11 flex-1 resize-none rounded-field border border-line-strong bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-ink-2/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => submit(draft)}
            disabled={isSending || draft.trim().length === 0 || retryAfter > 0}
            aria-label="Send message"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="send" className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-ink-2">
          {site.chatbot.name} is automated and can be wrong. Email {site.email} to reach a person.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
