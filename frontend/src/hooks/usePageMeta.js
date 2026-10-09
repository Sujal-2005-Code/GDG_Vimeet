import { useEffect } from 'react';

const SITE = 'GDG On Campus Vishwaniketan';
const DEFAULT_TITLE = 'GDG On Campus Vishwaniketan (ViMEET) 2026-27';
const DEFAULT_DESCRIPTION =
  'GDG On Campus Vishwaniketan (ViMEET) — a student-led Google Developer Groups community. Workshops, hackathons, study jams and a place to build, learn and grow together.';

/**
 * Per-route <title> and meta description (the SPA otherwise shares one for
 * every page). Pass nothing for the home page defaults.
 */
export const usePageMeta = (title, description) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description || DEFAULT_DESCRIPTION);
  }, [title, description]);
};

export default usePageMeta;
