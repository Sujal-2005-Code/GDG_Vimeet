import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside `ref` while `active` (menus, dialogs, lightbox).
 * - moves focus into the container on open and restores it to the element
 *   that had it on close
 * - Tab / Shift+Tab wrap around
 * - Escape calls `onEscape`
 *
 * The container should have role="dialog" + aria-modal="true" + a label.
 */
export const useFocusTrap = (ref, active, onEscape) => {
  // Always call the latest callback without re-running the trap setup.
  const escapeRef = useRef(onEscape);
  useEffect(() => {
    escapeRef.current = onEscape;
  });

  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return undefined;

    const previouslyFocused = document.activeElement;
    const focusables = () => Array.from(root.querySelectorAll(FOCUSABLE));

    // Focus the first control (not the container) so screen readers announce
    // something actionable; fall back to the container itself.
    (focusables()[0] ?? root).focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        escapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [active, ref]);
};

export default useFocusTrap;
