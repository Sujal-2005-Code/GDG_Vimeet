/**
 * POSES — the choreography as data.
 *
 * A pose says where every entity is at one moment of the journey. A chapter
 * (chapters.js) tweens entities from one named pose to the next, so each
 * chapter's start is the previous chapter's end *by construction*: the page
 * is one continuous journey, and anchor jumps / reverse scrolling stay
 * correct.
 *
 * THE JOURNEY (pose names, in order)
 *   hero → story → community
 *
 * There are only three moves, each with a reason:
 *   hero → story        the mark settles from the hero slot into the story frame
 *   story → community   the mark gives way to the event photos
 *   (intro)             the one-time fade-in on load
 * Everything in between is stillness: the mark does not rotate, tilt, orbit or
 * change size from chapter to chapter.
 *
 * UNITS (so poses are resolution-independent)
 *   x, y           fractions of S, the mark's on-screen size
 *   scale          uniform scale (1 = the design size)
 *   opacity
 *   anchor only:   ax, ay = pixel offset of the whole group from the stage centre
 * Anything not listed falls back to the entity's REST pose.
 *
 * ENTITY IDS (see story/marks/Composition.jsx)
 *   anchor ⊃ mark ⊃ core (the diamond mark)
 *   anchor ⊃ photo-1 … photo-4
 */

/**
 * Event photos in the community pose: a tidy two-column layout, offset
 * vertically so it reads as a deliberate collage. Fractions of S.
 */
const PHOTO_LAYOUT = {
  'photo-1': { x: -0.245, y: -0.22 },
  'photo-2': { x: 0.245, y: -0.14 },
  'photo-3': { x: -0.245, y: 0.16 },
  'photo-4': { x: 0.245, y: 0.24 },
};

/** How far below its place a photo waits (fraction of S) before it settles in. */
const PHOTO_RISE = 0.04;

/** Where an entity sits when a pose doesn't mention it. */
export const restOf = (id) => {
  const place = PHOTO_LAYOUT[id];
  return place ? { x: place.x, y: place.y + PHOTO_RISE, opacity: 0, scale: 0.96 } : {};
};

export const createPoses = ({ view, tier }, ids) => {
  const full = tier === 'full';
  const m = full ? 1 : 0.92; // the mark is a little smaller on phones so the rings clear the edges
  const { W, H } = view;

  // The mark's box is `view.box` px (the larger of the hero and story sizes);
  // the anchor scales it DOWN to each on-screen size, never up.
  const heroA = {
    ax: view.hero.cx - W / 2,
    ay: view.hero.cy - H / 2,
    scale: view.S / view.box,
  };
  const storyA = {
    ax: view.story.cx - W / 2,
    ay: view.story.cy - H / 2,
    scale: view.story.S / view.box,
  };

  const raw = {
    // The mark in the hero slot.
    hero: {
      anchor: heroA,
      core: { scale: m },
    },

    // The one-time load-in: the same composition, slightly smaller and faded.
    intro: {
      anchor: heroA,
      core: { scale: 0.94 * m, opacity: 0 },
    },

    // Every story chapter: the mark in the story frame, where it stays.
    story: {
      anchor: storyA,
      core: { scale: m },
    },

    // The mark gives way; real event photography takes its place.
    community: {
      anchor: storyA,
      mark: { scale: 0.96, opacity: 0 },
      core: { scale: m },
      ...Object.fromEntries(
        Object.entries(PHOTO_LAYOUT).map(([id, place]) => [id, { ...place, scale: 1, opacity: 1 }])
      ),
    },
  };

  // Resolve every pose against REST so each pose lists every entity present.
  const resolved = {};
  for (const [name, entries] of Object.entries(raw)) {
    resolved[name] = Object.fromEntries(ids.map((id) => [id, { ...restOf(id), ...(entries[id] || {}) }]));
  }
  return resolved;
};

/** Per-entity offsets inside a chapter (fractions of its length), so pieces don't move in lockstep. */
export const STAGGER = {
  core: 0,
};

export const EASES = {
  anchor: 'power2.inOut',
  core: 'power2.inOut',
};

/**
 * Chapter-specific timing overrides, keyed by the chapter's TARGET pose:
 *   id → [offset, duration, ease]   (fractions of the chapter)
 */
export const TIMING = {
  // The mark settles into its frame over the first part of the hero's exit.
  story: {
    anchor: [0, 0.6, 'power2.inOut'],
  },
  // The mark fades first; the photos then settle in one after another.
  community: {
    mark: [0, 0.3, 'power2.inOut'],
    'photo-1': [0.2, 0.3, 'power2.out'],
    'photo-2': [0.3, 0.3, 'power2.out'],
    'photo-3': [0.4, 0.3, 'power2.out'],
    'photo-4': [0.5, 0.3, 'power2.out'],
  },
};
