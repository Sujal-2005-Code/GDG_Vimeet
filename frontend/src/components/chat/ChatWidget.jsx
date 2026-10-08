import { Suspense, lazy, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchChatSuggestions } from '../../services/chat';
import { site } from '../../data/site';

// Only the launcher ships eagerly; the panel and its deps load on first open.
const ChatPanel = lazy(() => import('./ChatPanel'));
const QueryFallback = lazy(() => import('./QueryFallback'));

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isUnavailable, setIsUnavailable] = useState(false);

  // Asked once, on first open — not on page load, so a visitor who never
  // opens the chat costs the backend nothing.
  useEffect(() => {
    if (!isOpen || suggestions.length > 0 || isUnavailable) return;
    let cancelled = false;
    fetchChatSuggestions().then((data) => {
      if (cancelled) return;
      if (!data.enabled) setIsUnavailable(true);
      setSuggestions(data.suggestions ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, suggestions.length, isUnavailable]);

  // Escape closes; on phones the panel is full-screen, so lock the page
  // behind it — on desktop it is a corner panel and locking would be wrong.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);

    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (isMobile) document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chat' : `Ask ${site.chatbot.name} a question`}
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-[1500] inline-flex items-center justify-center size-14 rounded-full bg-gradient-to-br from-google-blue to-google-green text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h8m-8-4h5m-5 8h3m-6 5V6a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4z" />
          </svg>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-5 z-[1900] sm:w-[22rem] sm:h-[32rem] sm:max-h-[calc(100dvh-8rem)]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full bg-neutral-950 border border-white/10 sm:rounded-2xl">
                  <span className="size-6 rounded-full border-2 border-white/15 border-t-white animate-spin" />
                </div>
              }
            >
              {isUnavailable ? (
                <QueryFallback onClose={() => setIsOpen(false)} />
              ) : (
                <ChatPanel onClose={() => setIsOpen(false)} suggestions={suggestions} />
              )}
            </Suspense>
          </div>,
          document.body
        )}
    </>
  );
};

export default ChatWidget;
