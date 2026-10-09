/**
 * The accent dots that orbit the logo — pure data, read by the markup
 * (colour, size) and by the rig (the orbit itself).
 *
 * Each dot has its OWN orbit so they never move in lockstep:
 *   r      orbit radius, a fraction of S (the stage's mark size)
 *   tilt   inclination of the orbit plane, degrees (0 = facing the camera,
 *          90 = edge-on). Near 70° the ring reads as a flat ellipse, with the
 *          dot passing in FRONT of the logo on the near side and BEHIND it on
 *          the far side (real depth, sorted by the browser).
 *   slant  rotation of the ellipse in the screen plane, degrees
 *   speed  angular speed relative to the shared sweep (see ORBIT_SWEEP)
 *   phase  starting angle, degrees
 *   size   diameter as a fraction of S
 *
 * Colours are the four in the logo file (decoration only — never used for text).
 */
export const ORBIT_DOTS = [
  { key: 'blue', color: '#4285F4', r: 0.56, tilt: 66, slant: -52, speed: 1, phase: 20, size: 0.05 },
  { key: 'red', color: '#EA4335', r: 0.5, tilt: 62, slant: 22, speed: 1.35, phase: 110, size: 0.038 },
  { key: 'yellow', color: '#FBBC04', r: 0.52, tilt: 70, slant: -18, speed: 0.8, phase: 205, size: 0.046 },
  { key: 'green', color: '#0F9D58', r: 0.46, tilt: 60, slant: 58, speed: 1.15, phase: 300, size: 0.034 },
];
