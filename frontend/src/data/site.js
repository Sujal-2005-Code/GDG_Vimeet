/**
 * Central site configuration — name, contact info, social links, and
 * external form/API URLs. Edit here instead of hunting through components.
 */
export const site = {
  name: 'GDG ViMEET',
  fullName: 'Google Developer Groups on Campus — ViMEET',
  tagline: 'Build. Create. Connect. Go Beyond.',
  chapterYear: '2026-27',
  email: 'gdgvimeet@gmail.com',

  // Recruitment intake switch. Set to true to reopen the /join form (and
  // flip REGISTRATIONS_OPEN in backend/server.js back on too — the backend
  // rejects submissions independently so the API can't be posted to
  // directly while this is false).
  recruitmentOpen: false,

  /**
   * Branding. The logo is the supplied SVG (public/images/gdg-on-campus-vishwaniketan.svg).
   * The header shows its chevron mark (the `#gdg-mark` group, referenced
   * straight from the file via <use>, never redrawn in code) next to the
   * wordmark text set in HTML so it stays crisp at nav size; the Hero shows
   * the full lockup. Replace the SVG file to update both — keep the
   * `gdg-mark` group id and adjust `markViewBox` if the mark's bounds change.
   * Set `logo: null` to fall back to the typographic wordmark only.
   */
  brand: {
    wordmark: { primary: 'GDG On Campus', secondary: 'Vishwaniketan' },
    logo: {
      src: '/images/gdg-on-campus-vishwaniketan.svg',
      alt: "Google Developer Groups On Campus, Vishwaniketan's iMEET",
      markId: 'gdg-mark',
      markViewBox: '352 28 488 168',
    },
    // Full lockup, shown in the Hero. Set to null to hide it.
    lockup: {
      src: '/images/gdg-on-campus-vishwaniketan.svg',
      alt: "Google Developer Groups On Campus, Vishwaniketan's iMEET",
      width: 1192,
      height: 394,
    },
  },

  /**
   * Hero content + visual. `visual.kind` picks how the right-hand visual
   * is built; the Hero component and the story engine do not change:
   *   'mark'  → the real GDG mark (the `gdg-mark` group of `brand.logo`),
   *             turned by scroll with small accent dots orbiting it
   *   'image' → any image (e.g. a real event photo) as a rounded plane with
   *             the same orbit/dot accents around it (needs `src`)
   * Example: visual: { kind: 'image', src: '/events/cloud-campaign/1.webp',
   *                    alt: 'Students at the Google Cloud Study Jams' }
   */
  hero: {
    headline: ['Build. Create.', 'Connect.', 'Go Beyond.'],
    subhead: 'Where students build, learn and grow together.',
    visual: {
      kind: 'mark',
      alt: '',
    },
  },

  /**
   * About — wording taken from the previous About section (no new claims).
   * Pillars are Learn · Build · Grow, each one line.
   */
  about: {
    overline: 'About us',
    title: 'More than a coding community',
    body: 'GDG ViMEET is a student-led developer community that empowers members to learn, create, and innovate. Through workshops, hackathons, study jams, and speaker sessions, we bring together technology, creativity, leadership, and collaboration in one place.',
    pillars: [
      { key: 'learn', title: 'Learn', icon: 'book', text: 'Workshops, study jams and speaker sessions in Web, Mobile, Cloud and AI/ML.' },
      { key: 'build', title: 'Build', icon: 'hammer', text: 'Project-based workshops, team challenges, hackathons and innovation labs.' },
      { key: 'grow', title: 'Grow', icon: 'sprout', text: 'Mentorship that helps members grow as developers, designers and leaders.' },
    ],
  },

  institute: {
    name: "Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology",
    shortName: 'ViMEET',
    addressLines: [
      'Vishwaniketan Institute of Management',
      'Entrepreneurship and Engineering Technology',
      'Khalapur, Navi Mumbai',
      'Maharashtra - 410210',
    ],
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1234567890!2d73.2710681!3d18.820721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e2b676c190e9%3A0xf77754195ba9b262!2sVishwaniketan%27s%20Institute%20of%20Management%20Entrepreneurship%20and%20Engineering%20Technology%20(ViMEET)!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
  },

  social: {
    instagram: 'https://www.instagram.com/gdgvimeet/',
    linkedin: 'https://www.linkedin.com/company/gdgvimeet/',
    github: 'https://github.com/gdgvimeet',
  },

  // Google Form used on the Contact page. Placeholder — replace with the
  // official 2026-27 contact/query form URL when available.
  contactFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSd9hYJ48DFNnZtp-3kJKhGfYw-pR0M2-Nf47TYAGSJnH_7toA/viewform?embedded=true',

  // Recruitment application backend (see frontend/src/services/db.js) —
  // relative by default so API calls stay same-origin through Vercel's
  // /api rewrite proxy; VITE_API_BASE_URL overrides this if ever needed.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  // The FAQ chatbot's public-facing identity — the one place this is
  // defined. Every chat component reads it from here rather than
  // hardcoding a name, so renaming the assistant later is a one-line change.
  chatbot: {
    name: 'Vimi',
    avatar: '/vimi/pfp.png',
  },
};

export default site;
