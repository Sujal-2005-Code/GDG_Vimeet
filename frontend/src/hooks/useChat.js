import { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../services/chat';

const MAX_CHARS = 600;

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const lastAttempt = useRef(null);

  // Count down the rate-limit wait so the UI can show when to try again.
  useEffect(() => {
    if (retryAfter <= 0) return;
    const id = window.setInterval(() => setRetryAfter((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [retryAfter]);

  const run = useCallback(async (history) => {
    setIsSending(true);
    setError(null);
    try {
      const data = await sendChatMessage(history);
      setMessages([...history, { role: 'assistant', content: data.reply, sources: data.sources ?? [] }]);
      lastAttempt.current = null;
    } catch (err) {
      setError(err.message);
      if (err.retryAfter) setRetryAfter(err.retryAfter);
      lastAttempt.current = history;
    } finally {
      setIsSending(false);
    }
  }, []);

  const send = useCallback(
    (text) => {
      const content = text.trim().slice(0, MAX_CHARS);
      if (!content || isSending) return;
      // Only role/content go to the server; `sources` is display-only state.
      const history = [...messages.map(({ role, content: c }) => ({ role, content: c })), { role: 'user', content }];
      setMessages((current) => [...current, { role: 'user', content }]);
      run(history);
    },
    [isSending, messages, run]
  );

  const retry = useCallback(() => {
    if (lastAttempt.current) run(lastAttempt.current);
  }, [run]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setRetryAfter(0);
    lastAttempt.current = null;
  }, []);

  return { messages, isSending, error, retryAfter, canRetry: Boolean(lastAttempt.current), send, retry, reset, MAX_CHARS };
};

export default useChat;
