/**
 * Copy for the home-page scroll story. Every word and number the story shows
 * lives here; components never hard-code them.
 *
 * ACCURACY RULES — these are the user-approved strings. Do not embellish:
 * no rankings ("#4 in India", "top 4 college"), no extra claims. The figures
 * are shared with the Events page (data/events.js reads `studyJams`), so the
 * two can never disagree.
 */
export const studyJams = {
  title: 'Cloud Study Jams',
  // First sentence of the established Study Jams description (data/events.js).
  lede: 'A full learning cycle, executed start to finish.',

  // Shown ONE AT A TIME in the story. `value` counts up; the final value is
  // always present in the HTML (reduced motion, no JS, search engines).
  stats: [
    { value: 245, suffix: '+', label: 'Participants' },
    { value: 107, suffix: '', label: 'Completed Milestones' },
    { value: 20, suffix: '+', label: 'Cloud Labs & Courses' },
  ],

  achievements: {
    badges: ['TIER 1', '3 YEARS STRONG'],
    milestone: '4TH COLLEGE TO COMPLETE THE JAMS',
  },

  credits:
    'Guided by Faculty Coordinator Prof. Charusheela Pandit and led by GDG Lead Pranav Salunkhe, with Cloud Campaign Mentor Nimish Patil and GDG Facilitator Harsh Dhanawade.',

  // Real photos from the event, flown through the final chapter (4 on desktop, 3 on phones).
  photos: [
    '/events/cloud-campaign/1.webp',
    '/events/cloud-campaign/6.webp',
    '/events/cloud-campaign/9.webp',
    '/events/cloud-campaign/7.webp',
  ],
};

export const story = {
  orbit: { line1: 'Google Developer Group', line2: 'On Campus · Vishwaniketan' },
  cloud: { overline: 'Powered by', title: 'Google Cloud' },
  community: {
    overline: 'From the Cloud Study Jams',
    cta: { label: 'See all events', to: '/events' },
  },
};

export default { studyJams, story };
