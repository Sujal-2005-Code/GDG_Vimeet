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
 * `pinned` is the scroll distance (in viewport heights) the chapter lasts.
 * Phones get 80% of it (see ScrollStory).
 *
 * THE SCENE (the real GDG mark is the hero object throughout)
 *   hero       the mark, upright, accents orbiting
 *   tier1      TIER 1 / 3 YEARS STRONG — the mark turns and tilts; at the end
 *              it lifts away up and to the right
 *   cloud      GOOGLE CLOUD — camera dolly toward the mark, orbit widens
 *   jams       CLOUD STUDY JAMS — the camera eases back
 *   m1·m2·m3   245+ · 107 · 20+ — one number per beat, the mark small in the corner
 *   achieve    4TH COLLEGE TO COMPLETE THE JAMS — the mark settles, upright, centred
 *   community  real event photography; the mark recedes
 */
export const chapters = [
  {
    id: 'hero',
    from: 'hero',
    to: 'drift',
    // The hero copy fades/lifts away over the first 45% so the mark and its
    // orbit never cross readable text.
    exitCopy: '[data-story-copy="hero"]',
  },
  { id: 'tier1', from: 'drift', to: 'tier1', pinned: 150 }, // TIER 1 / 3 YEARS STRONG
  { id: 'cloud', from: 'tier1', to: 'cloud', pinned: 100 }, // Google Cloud
  { id: 'jams', from: 'cloud', to: 'jams', pinned: 80 }, // Cloud Study Jams
  { id: 'm1', from: 'jams', to: 'm1', pinned: 60 }, // 245+ Participants
  { id: 'm2', from: 'm1', to: 'm2', pinned: 60 }, // 107 Completed Milestones
  { id: 'm3', from: 'm2', to: 'm3', pinned: 60 }, // 20+ Cloud Labs & Courses
  { id: 'achieve', from: 'm3', to: 'achieve', pinned: 100 }, // 4TH COLLEGE TO COMPLETE THE JAMS
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

/**
 * THE LOGO'S ROTATION, driven by scroll (not a free-running spin).
 *
 * `keys` are [progress, degrees] where progress runs 0 → 1 from the start of
 * chapter `from` to the end of chapter `to`. The rig draws a smooth curve
 * through them (rig.js), so the mark passes exactly through 25° at 20%, 90° at
 * 40% … and arrives upright (360°) when the metrics are done. Scrolling back
 * reverses it exactly.
 */
export const SPIN = {
  from: 'hero',
  to: 'm3',
  keys: [
    [0, 0],
    [0.2, 25],
    [0.4, 90],
    [0.6, 180],
    [0.8, 270],
    [1, 360],
  ],
};

/** How far the accent dots travel round their orbits per 100svh scrolled (degrees). */
export const ORBIT_SWEEP = 140;
