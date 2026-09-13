import { site } from './site';

/**
 * Events data. Keep placeholders clearly labeled ("Announcing Soon" / TBD)
 * rather than inventing dates, attendance figures, or titles.
 */
export const upcomingEvents = [
  {
    when: 'Coming This Semester',
    title: 'Google Cloud & AI Study Jam',
    tag: 'Cloud & AI',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    desc: 'Hands-on Google Cloud Skills Boost labs, generative AI quests, badges, and official Google swag.',
    venue: 'Computer Labs & Virtual',
    cta: { label: 'Stay Tuned', href: '/join' },
  },
];

const galleryPaths = (slug, count) =>
  Array.from({ length: count }, (_, i) => `/events/${slug}/${i + 1}.webp`);

const rawPastEvents = [
  {
    title: 'Google Cloud Study Jams Campaign',
    date: 'Date TBD — 2025-26', // TODO: replace with the real date
    category: 'Study Jams',
    highlight: true,
    desc: 'A full learning cycle, executed start to finish. Participants completed 20+ Google Cloud courses along with an Arcade Game to earn official goodies — with the GDG ViMEET core team guiding students throughout, helping with labs and courses, and resolving doubts to keep everyone on track.',
    stats: [
      { value: '245+', label: 'Participants' },
      { value: '107', label: 'Completed & earned goodies' },
      { value: '20+', label: 'Cloud courses each' },
    ],
    credits: 'Guided by Faculty Coordinator Prof. Charusheela Pandit and led by GDG Lead Pranav Salunkhe, with Cloud Campaign Mentor Nimish Patil and GDG Facilitator Harsh Dhanawade.',
    link: { label: 'View on LinkedIn', href: site.social.linkedin },
    cover: `/events/cloud-campaign/1.webp`,
    gallery: galleryPaths('cloud-campaign', 12),
  },
  {
    title: 'Git & GitHub Workshop',
    date: 'Date TBD — 2025-26', // TODO: replace with the real date
    category: 'Workshops',
    desc: 'Hands-on session covering Git fundamentals and collaborative workflows on GitHub — branching, commits, pull requests, and resolving merge conflicts.',
    cover: `/events/git-github-workshop/1.webp`,
    gallery: galleryPaths('git-github-workshop', 15),
  },
  {
    title: 'Nirmaan — 8 Hour Webathon',
    date: 'Date TBD — 2025-26', // TODO: replace with the real date
    category: 'Hackathons',
    desc: 'An 8-hour build sprint where teams designed and shipped a working web project from scratch in a single day.',
    cover: `/events/nirmaan-webathon/1.webp`,
    gallery: galleryPaths('nirmaan-webathon', 15),
  },
  {
    title: 'Jamming Session',
    date: 'Date TBD — 2025-26', // TODO: replace with the real date
    category: 'Community',
    desc: 'An informal community hangout for members to unwind, play music together, and connect outside of workshops and hackathons.',
    cover: `/events/jamming-session/1.webp`,
    gallery: galleryPaths('jamming-session', 11),
  },
];

// Resolves each event's full photo set once, at module load, so the array
// reference stays stable across re-renders (the photo Stack depends on
// that stability). Priority: gallery[] > images[] > cover/image single shot.
const resolvePhotos = (event) => {
  if (event.gallery?.length) return event.gallery;
  if (event.images?.length) return event.images;
  if (event.cover) return [event.cover];
  if (event.image) return [event.image];
  return [];
};

export const pastEvents = rawPastEvents.map((event) => ({
  ...event,
  photos: resolvePhotos(event),
}));

export const eventCategories = ['All', 'Study Jams', 'Workshops', 'Hackathons', 'Community'];

export default { upcomingEvents, pastEvents, eventCategories };
