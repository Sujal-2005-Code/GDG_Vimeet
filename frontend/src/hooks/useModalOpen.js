import { useEffect } from 'react';

let openCount = 0;

/**
 * Marks the document while any modal (menu, lightbox, chat on phones) is
 * open, so other fixed UI — e.g. the chat launcher — can step out of the
 * way (`html[data-modal]` in CSS). Counts nested modals correctly.
 */
export const useModalOpen = (open) => {
  useEffect(() => {
    if (!open) return undefined;
    openCount += 1;
    document.documentElement.dataset.modal = 'open';
    return () => {
      openCount -= 1;
      if (openCount <= 0) {
        openCount = 0;
        delete document.documentElement.dataset.modal;
      }
    };
  }, [open]);
};

export default useModalOpen;
