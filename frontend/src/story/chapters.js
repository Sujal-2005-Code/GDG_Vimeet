/**
 * THE JOURNEY — one calm visual story, declared in scroll order.
 *
 * A chapter is a section of the page (marked `data-story-chapter="<id>"`)
 * whose scroll range drives the stage from pose `from` to pose `to`
 * (poses.js). Chapter N's `to` is chapter N+1's `from`, so the stage never
 * "resets" between sections.
 *
 * All chapters are segments of ONE master timeline driven by ONE scrubbed
 * ScrollTrigger (engine.js). That is what makes the journey a pure function
 * of scroll position: jumping, reloading mid-page and reverse scrolling all
 * land on exactly the same state as scrolling there in order.
 *
 * SCROLL GEOMETRY (measured from the layout by the engine)
 *   hero        range = the hero scrolling out (its top → its bottom at the
 *               top of the viewport)
 *   story tracks each is `pinned + 100svh` tall with a CSS-sticky layer; the
 *               next track overlaps the previous by 100svh (margin-top), so
 *               one track's pinned period ends exactly where the next one's
 *               begins. Range = the pinned period. Chapters are therefore
 *               contiguous with no gaps and no overlap.
 *
 * `pinned` is the scroll distance (in viewport heights) the chapter lasts.
 * Phones get 80% of it (see ScrollStory).
 *
 * THE SCENE — the diamond mark is the one constant. It settles into its
 * frame while the hero scrolls out and then stays put, upright and still;
 * only the words change. The rings and dots turn steadily (DOT_SWEEP, RING_SWEEP below).
 *
 *   hero       the mark in the hero slot
 *   tier1      TIER 1 / 3 YEARS STRONG
 *   cloud      GOOGLE CLOUD
 *   jams       CLOUD STUDY JAMS
 *   m1·m2·m3   245+ · 107 · 20+ — one number per beat
 *   achieve    4TH COLLEGE TO COMPLETE THE JAMS
 *   community  the mark gives way to real event photography
 */
export const chapters = [
  {
    id: 'hero',
    from: 'hero',
    to: 'story',
  },
  { id: 'tier1', from: 'story', to: 'story', pinned: 70 }, // TIER 1 / 3 YEARS STRONG
  { id: 'cloud', from: 'story', to: 'story', pinned: 50 }, // Google Cloud
  { id: 'jams', from: 'story', to: 'story', pinned: 60 }, // Cloud Study Jams
  { id: 'm1', from: 'story', to: 'story', pinned: 45 }, // 245+ Participants
  { id: 'm2', from: 'story', to: 'story', pinned: 45 }, // 107 Completed Milestones
  { id: 'm3', from: 'story', to: 'story', pinned: 45 }, // 20+ Cloud Labs & Courses
  { id: 'achieve', from: 'story', to: 'story', pinned: 60 }, // 4TH COLLEGE TO COMPLETE THE JAMS
  {
    id: 'community',
    from: 'story',
    to: 'community',
    pinned: 100, // real event photography
    // Fade the whole stage out over the last stretch, before the first solid
    // section below covers it.
    stageFadeAt: 0.82,
  },
];

/** Story tracks = every chapter after the hero. */
export const storyChapters = chapters.filter((c) => c.pinned);

/** Phones/tablets get a shorter journey. */
export const LITE_TRACK_SCALE = 0.8;

/**
 * The scroll-linked motion that runs for the whole journey: the rings and the
 * accent dots turn. Plain linear functions of scroll (same speed and direction
 * everywhere, no easing), so scrolling forward, backward or jumping always
 * lands on the same picture. The four diamonds never move.
 *
 *   DOT_SWEEP   degrees the dots turn per 100svh scrolled
 *   RING_SWEEP  degrees each ring turns per 100svh scrolled (opposite ways)
 */
export const DOT_SWEEP = 60;
export const RING_SWEEP = 20;
