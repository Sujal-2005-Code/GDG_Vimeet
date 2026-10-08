/**
 * THE JOURNEY — one continuous visual story, declared in scroll order.
 *
 * A chapter is a section of the page (marked `data-story-chapter="<id>"`)
 * whose scroll range drives the stage from pose `from` to pose `to`
 * (poses.js). Because chapter N's `to` is chapter N+1's `from`, the stage
 * never "resets" between sections.
 *
 * Stage 2 enables only the first chapter. The rest are the agreed journey,
 * listed so the architecture is reviewable now; each lands in Stage 3/4
 * together with its section and its pose:
 *
 *   GDG / Vishwaniketan → geometric mark → separate / rotate / orbit →
 *   toward Google Cloud → Cloud Study Jams → 245+ / 107 / 20+ → community →
 *   event cards / real photography → Learn · Build · Grow → Join GDG
 */
export const chapters = [
  {
    id: 'hero',
    enabled: true,
    section: '[data-story-chapter="hero"]',
    from: 'hero',
    to: 'drift',
    // The hero is exactly one viewport: progress runs 0→1 as it scrolls away.
    start: 'top top',
    end: 'bottom top',
    // Hero copy fades/lifts away over the first 45% so the separating
    // pieces never cross readable text.
    copy: '[data-story-copy="hero"]',
    // Fade the whole stage out over the last quarter, before the next
    // (still legacy, opaque) block covers it.
    stageFadeAt: 0.75,
  },

  // ---- planned (not built yet) ------------------------------------------
  { id: 'orbit', enabled: false, from: 'drift', to: 'orbit' }, // On Campus · Vishwaniketan
  { id: 'cloud', enabled: false, from: 'orbit', to: 'cloud' }, // reshape toward Google Cloud
  { id: 'jams', enabled: false, from: 'cloud', to: 'jams' }, // Study Jams + 245+ / 107 / 20+
  { id: 'community', enabled: false, from: 'jams', to: 'community' }, // dots join
  { id: 'events', enabled: false, from: 'community', to: 'events' }, // event cards / photos
  { id: 'values', enabled: false, from: 'events', to: 'values' }, // Learn · Build · Grow
  { id: 'join', enabled: false, from: 'values', to: 'join' }, // Join GDG
];
