import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import { useChat } from '../../hooks/useChat';
import { site } from '../../data/site';

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
    <div className="flex flex-col h-full bg-neutral-950 border border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={site.chatbot.avatar} alt={site.chatbot.name} className="size-7 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">{site.chatbot.name}</p>
            <p className="text-[11px] text-white/45 leading-tight">Answers about recruitment, teams and events</p>
          </div>
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

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-white/70">
              Hey, I'm {site.chatbot.name}! Ask me anything about GDG ViMEET — joining a team, the application process, or our events.
            </p>
            {suggestions.length > 0 && (
              <div className="flex flex-col items-start gap-2 mt-4">
                {suggestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => submit(question)}
                    className="text-left text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white transition"
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
          <div className="flex items-center gap-1.5 text-white/40 text-xs px-1" aria-live="polite">
            <span className="size-1.5 rounded-full bg-white/40 animate-pulse" />
            <span className="size-1.5 rounded-full bg-white/40 animate-pulse [animation-delay:150ms]" />
            <span className="size-1.5 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]" />
            <span className="ml-1">Thinking…</span>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/[0.08] px-3 py-2.5">
            <p className="text-rose-200 text-xs leading-relaxed">{error}</p>
            {retryAfter > 0 ? (
              <p className="text-rose-200/70 text-[11px] mt-1">Try again in {retryAfter}s.</p>
            ) : (
              <div className="flex items-center gap-3 mt-1.5">
                {canRetry && (
                  <button type="button" onClick={retry} className="text-[11px] text-white/80 hover:text-white underline">
                    Try again
                  </button>
                )}
                <a href="mailto:gdgvimeet@gmail.com" className="text-[11px] text-white/80 hover:text-white underline">
                  Email us instead
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_CHARS}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question…"
            className="flex-1 resize-none max-h-28 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/35 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition"
          />
          <button
            type="button"
            onClick={() => submit(draft)}
            disabled={isSending || draft.trim().length === 0 || retryAfter > 0}
            aria-label="Send message"
            className="shrink-0 inline-flex items-center justify-center size-10 rounded-xl bg-white text-black hover:bg-white/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-white/30 mt-2 text-center">
          {site.chatbot.name} is automated and can be wrong. Email gdgvimeet@gmail.com to reach a person.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
