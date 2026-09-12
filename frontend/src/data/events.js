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

export const pastEvents = [
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

export const eventCategories = ['All', 'Workshops', 'Hackathons', 'Community'];

export default { upcomingEvents, pastEvents, eventCategories };
