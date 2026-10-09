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
 *   hero → drift → tier1 → cloud → jams → m1 → m2 → m3 → achieve → community
 *
 * WHAT MOVES HERE vs IN THE RIG
 *   poses (this file)  position, size, 3D tilt, camera, photos — tweened
 *                      between chapters
 *   rig.js             the logo's rotation (chapters.SPIN) and the accent dots'
 *                      orbits — continuous functions of scroll
 *
 * UNITS (so poses are resolution-independent)
 *   x, y, z        fractions of S, the mark's on-screen size
 *   dr             Z-rotation in degrees (the orbit's slant)
 *   ar             absolute Z-rotation in degrees (photos)
 *   rx, ry         X / Y tilt in degrees
 *   scale, sx, sy  uniform scale and extra per-axis scale (1 = the design size)
 *   opacity
 *   anchor only:   ax, ay = pixel offset of the whole group from the stage centre
 * Anything not listed falls back to the entity's REST pose.
 *
 * ENTITY IDS (see story/marks/Composition.jsx)
 *   anchor ⊃ mark ⊃ { orbit (the dots), core (the logo) }
 *   anchor ⊃ photo-1 … photo-4
 * The tilt (rx/ry) is on `core`, OUTSIDE the spin, so it leans the whole
 * object toward the camera in screen axes while the logo turns inside it.
 */

/** Where an entity sits when a pose doesn't mention it. */
export const restOf = (id) =>
  id.startsWith('photo-') ? { opacity: 0, z: -1.5, ry: 40, scale: 0.6 } : {};

export const createPoses = ({ view, tier }, ids) => {
  const full = tier === 'full';
  const still = tier === 'static'; // reduced motion: upright and flat, nothing leans
  const k = still ? 0 : full ? 1 : 0.6; // 3D tilt strength (softer on touch devices)
  const m = full ? 1 : 0.86; // the logo is a little smaller on phones so the orbit clears it
  const sh = full ? 1 : 0.4; // up/right shifts are gentler where the visual sits under the copy
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
  /** The story frame, nudged right (fx) / down (fy) by fractions of the viewport. */
  const nudge = (fx, fy) => ({ ...storyA, ax: storyA.ax + fx * W * sh, ay: storyA.ay + fy * H * sh });

  const raw = {
    // The mark upright in the hero slot, accents already orbiting.
    hero: {
      anchor: heroA,
      core: { scale: m, rx: -4 * k, ry: 8 * k },
      orbit: { scale: 1 },
    },

    // Behind the camera and small: the one-time load-in.
    intro: {
      anchor: heroA,
      core: { scale: 0.8 * m, z: -0.5, rx: -12 * k, ry: 38 * k, opacity: 0 },
      orbit: { scale: 0.35, dr: -40, opacity: 0 },
    },

    // End of the hero: the mark has glided into the story frame and leans in.
    drift: {
      anchor: storyA,
      core: { scale: m, z: 0.04, rx: -6 * k, ry: 14 * k },
      orbit: { scale: 1.04, dr: 8 },
    },

    // TIER 1 / 3 YEARS STRONG — the mark tilts across the chapter and, at the
    // very end, lifts up and to the right as the next chapter enters.
    tier1: {
      anchor: nudge(0.035, -0.085),
      core: { scale: 0.96 * m, z: 0.1, rx: 8 * k, ry: -16 * k },
      orbit: { scale: 1.06, dr: -14 },
    },

    // Google Cloud — the camera dollies in (CAMERA), the orbit widens.
    cloud: {
      anchor: nudge(0.04, -0.1),
      core: { scale: 1.02 * m, z: 0.02, rx: 10 * k, ry: -8 * k },
      orbit: { scale: 1.12, dr: 10 },
    },

    // Cloud Study Jams — the camera eases back, the orbit settles.
    jams: {
      anchor: nudge(0.04, -0.1),
      core: { scale: 0.9 * m, z: -0.04, rx: -6 * k, ry: 12 * k },
      orbit: { scale: 1.04, dr: -6 },
    },

    // 245+ / 107 / 20+ — one beat at a time. The mark stays small in the
    // upper right and leans a different way each beat; the slant of the
    // orbit swings with it.
    m1: {
      anchor: nudge(0.025, -0.08),
      core: { scale: 0.8 * m, z: 0.06, rx: 4 * k, ry: -14 * k },
      orbit: { scale: 1, dr: 12 },
    },
    m2: {
      anchor: nudge(0.025, -0.08),
      core: { scale: 0.8 * m, z: 0.06, rx: -5 * k, ry: 10 * k },
      orbit: { scale: 1, dr: -10 },
    },
    m3: {
      anchor: nudge(0.025, -0.08),
      core: { scale: 0.8 * m, z: 0.06, rx: 6 * k, ry: -8 * k },
      orbit: { scale: 1, dr: 6 },
    },

    // 4TH COLLEGE TO COMPLETE THE JAMS — the mark settles back to the centre
    // of its frame, upright (the rotation has completed 360°), orbit wide.
    achieve: {
      anchor: storyA,
      core: { scale: m, z: 0.08 },
      orbit: { scale: 1.1 },
    },

    // The mark recedes and fades; real event photography takes its place.
    community: {
      anchor: storyA,
      mark: { scale: 0.7, z: -0.6, y: -0.05, opacity: 0 },
      core: { scale: m, z: 0.08 },
      orbit: { scale: 1.1 },
      'photo-1': { x: -0.05, y: -0.12, z: 0.18, ar: -4, ry: -14 * k, rx: 4 * k, scale: 1, opacity: 1 },
      'photo-2': { x: 0.27, y: 0.1, z: 0.05, ar: 3, ry: -20 * k, rx: -2 * k, scale: 1, opacity: 1 },
      'photo-3': { x: -0.28, y: 0.22, z: -0.02, ar: -2, ry: -9 * k, rx: 3 * k, scale: 1, opacity: 1 },
      'photo-4': { x: 0.2, y: -0.3, z: -0.1, ar: 5, ry: -22 * k, rx: 4 * k, scale: 1, opacity: 1 },
    },
  };

  // Resolve every pose against REST so each pose lists every entity present.
  const resolved = {};
  for (const [name, entries] of Object.entries(raw)) {
    resolved[name] = Object.fromEntries(ids.map((id) => [id, { ...restOf(id), ...(entries[id] || {}) }]));
  }
  return resolved;
};

/** Camera (the world element) per pose: dolly z in S, sway ry in degrees. */
export const CAMERA = {
  hero: { z: 0, ry: 0 },
  drift: { z: 0.04, ry: 0 },
  tier1: { z: 0.06, ry: 5 },
  cloud: { z: 0.16, ry: -5 }, // the dolly toward the mark
  jams: { z: 0.06, ry: 0 },
  m1: { z: 0.06, ry: -5 },
  m2: { z: 0.06, ry: 0 },
  m3: { z: 0.06, ry: 5 },
  achieve: { z: 0.1, ry: 0 },
  community: { z: 0, ry: 0 },
};

/** Per-entity offsets inside a chapter (0–0.12 of its length), so pieces don't move in lockstep. */
export const STAGGER = {
  core: 0,
  orbit: 0.04,
  'photo-1': 0,
  'photo-2': 0.06,
  'photo-3': 0.12,
  'photo-4': 0.18,
};

export const EASES = {
  anchor: 'power2.inOut',
  orbit: 'power1.inOut',
  core: 'sine.inOut',
};

/**
 * Chapter-specific timing overrides, keyed by the chapter's TARGET pose:
 *   id → [offset, duration, ease]   (fractions of the chapter)
 */
export const TIMING = {
  // The mark stays in its frame and turns for most of the chapter, then lifts
  // away up-right over the last 40% as the next chapter arrives.
  tier1: {
    core: [0, 1, 'sine.inOut'],
    anchor: [0.6, 0.4, 'power2.inOut'],
  },
  // Photos arrive across the chapter, not in the first moments.
  community: {
    'photo-1': [0.05, 0.7, 'power3.out'],
    'photo-2': [0.15, 0.7, 'power3.out'],
    'photo-3': [0.25, 0.7, 'power3.out'],
    'photo-4': [0.35, 0.6, 'power3.out'],
    mark: [0, 0.7, 'power2.in'],
  },
};
