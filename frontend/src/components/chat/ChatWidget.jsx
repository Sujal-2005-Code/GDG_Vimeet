import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchChatSuggestions } from '../../services/chat';
import { site } from '../../data/site';
import useFocusTrap from '../../hooks/useFocusTrap';
import useModalOpen from '../../hooks/useModalOpen';
import Icon from '../ui/Icon';

// Only the launcher ships eagerly; the panel and its deps load on first open.
const ChatPanel = lazy(() => import('./ChatPanel'));
const QueryFallback = lazy(() => import('./QueryFallback'));

const PHONE = '(max-width: 639px)';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE).matches);
  const launcherRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const onChange = () => setIsPhone(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

  const close = useCallback(() => {
    setIsOpen(false);
    // Hand focus back to the launcher, where the visitor started.
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  // On phones the panel is full-screen: it is a modal (focus trapped, page
  // locked, other floating UI hidden). On desktop it is a corner panel that
  // the page stays usable around; Esc still closes it.
  const modal = isOpen && isPhone;
  useFocusTrap(panelRef, modal, close);
  useModalOpen(modal);

  useEffect(() => {
    if (!isOpen || isPhone) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isPhone, close]);

  useEffect(() => {
    if (!modal) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [modal]);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-label={isOpen ? 'Close chat' : `Ask ${site.chatbot.name} a question`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'chat-panel' : undefined}
        className="chat-launcher fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[1500] inline-flex size-12 items-center justify-center rounded-full bg-primary sm:size-14 text-white shadow-overlay transition-[transform,background-color] duration-[var(--dur-base)] ease-standard hover:-translate-y-0.5 hover:bg-primary-strong active:scale-95 sm:right-6 sm:bottom-6"
      >
        <Icon name={isOpen ? 'close' : 'chat'} className="size-6" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            id="chat-panel"
            role="dialog"
            aria-modal={modal ? 'true' : undefined}
            aria-label={`${site.chatbot.name} — questions about GDG ViMEET`}
            className="fixed inset-0 z-[1900] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[34rem] sm:max-h-[calc(100dvh-8rem)] sm:w-[23rem]"
          >
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center border border-line bg-surface sm:rounded-media" role="status">
                  <span className="size-6 animate-spin rounded-full border-2 border-line border-t-primary" />
                  <span className="sr-only">Loading chat…</span>
                </div>
              }
            >
              {isUnavailable ? (
                <QueryFallback onClose={close} />
              ) : (
                <ChatPanel onClose={close} suggestions={suggestions} />
              )}
            </Suspense>
          </div>,
          document.body
        )}
    </>
  );
};

export default ChatWidget;
