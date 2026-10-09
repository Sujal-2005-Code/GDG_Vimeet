/**
 * THE JOURNEY — one continuous visual story, declared in scroll order.
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
 *   `pinned` is the scroll distance (in viewport heights) the chapter lasts.
 *   Phones get 80% of it (see ScrollStory).
 *
 * Stage 3 builds everything up to the event photography. Stage 4 continues
 * the journey into the events section, Learn · Build · Grow and Join GDG.
 */
export const chapters = [
  {
    id: 'hero',
    from: 'hero',
    to: 'drift',
    // The hero copy fades/lifts away over the first 45% so the separating
    // pieces never cross readable text.
    exitCopy: '[data-story-copy="hero"]',
  },
  { id: 'orbit', from: 'drift', to: 'orbit', pinned: 150 }, // Google Developer Group → On Campus · Vishwaniketan
  { id: 'cloud', from: 'orbit', to: 'cloud', pinned: 100 }, // Google Cloud
  { id: 'jams', from: 'cloud', to: 'jams', pinned: 80 }, // Cloud Study Jams
  { id: 'm1', from: 'jams', to: 'm1', pinned: 60 }, // 245+ Participants
  { id: 'm2', from: 'm1', to: 'm2', pinned: 60 }, // 107 Completed Milestones
  { id: 'm3', from: 'm2', to: 'm3', pinned: 60 }, // 20+ Cloud Labs & Courses
  { id: 'achieve', from: 'm3', to: 'achieve', pinned: 110 }, // TIER 1 · 3 YEARS STRONG → 4TH COLLEGE…
  {
    id: 'community',
    from: 'achieve',
    to: 'community',
    pinned: 130, // real event photography
    // Fade the whole stage out over the last stretch, before the next
    // (still legacy, opaque) block covers it.
    stageFadeAt: 0.82,
  },
];

/** Story tracks = every chapter after the hero. */
export const storyChapters = chapters.filter((c) => c.pinned);

/** Phones/tablets get a shorter journey. */
export const LITE_TRACK_SCALE = 0.8;
