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
  // configurable via VITE_API_BASE_URL in Vercel project env vars.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://gdg-vimeet-backend-production.up.railway.app',
};

export default site;
