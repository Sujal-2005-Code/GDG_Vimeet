import { site } from './site';
import { studyJams } from './story';

/**
 * Events data — the single source for the home page, /events and
 * /events/:slug. Keep placeholders clearly labelled rather than inventing
 * dates, attendance figures or titles.
 *
 * HOW TO ADD AN EVENT
 *   1. Put the photos in public/events/<slug>/1.webp, 2.webp … (≤1600px wide)
 *      and run `node scripts/make-image-variants.mjs` from frontend/ (it
 *      writes the -480/-960 copies the site serves on small screens).
 *   2. Add an entry below: `slug`, `title`, `date` (ISO `YYYY-MM-DD` when
 *      known — the status chip is derived from it), `category` (one of
 *      eventCategories), `desc`, `gallery: galleryPaths('<slug>', <count>)`
 *      and, ideally, one `photoAlts` line per photo describing the moment.
 *   3. Upcoming events go in `upcomingEvents`.
 */

/** Up next. `when` is shown as-is until a real date is announced. */
export const upcomingEvents = [
  {
    slug: 'google-cloud-ai-study-jam',
    when: 'Coming this semester',
    title: 'Google Cloud & AI Study Jam',
    tag: 'Cloud & AI',
    desc: 'Hands-on Google Cloud Skills Boost labs, generative AI quests, badges, and official Google swag.',
    venue: 'Computer Labs & Virtual',
    // No date or registration yet, so the action is to get notified.
    cta: { label: 'Get notified on Instagram', href: site.social.instagram },
  },
];

const galleryPaths = (slug, count) =>
  Array.from({ length: count }, (_, i) => `/events/${slug}/${i + 1}.webp`);

const rawPastEvents = [
  {
    slug: 'git-github-workshop-2026',
    title: 'Git & GitHub Workshop',
    date: '2026-10-07',
    category: 'Workshops',
    meta: {
      time: '2:00 PM – 4:15 PM',
      venue: 'Lab B008',
      audience: 'FE & SE',
      organizer: 'GDG On Campus Vishwaniketan',
    },
    desc: 'An interactive Git & GitHub workshop for FE and SE students, covering version control, Git fundamentals, GitHub workflows, repositories, commits, branches, and basics of deployment.',
    cover: '/events/git-github-workshop-2026/3.webp',
    gallery: galleryPaths('git-github-workshop-2026', 12),
    photoAlts: [
      'Students at their lab workstations as the Git & GitHub Workshop begins',
      'A speaker addresses the room from the podium',
      'A student presenter points out a step on the projected slides',
      'A presenter walks through the Git flow on screen: write code, git add, git commit',
      'Students follow along at their computers during the session',
      'A team member hands a participant a giveaway',
      'A participant receives a giveaway from a team member',
      'A participant is handed a giveaway in front of the projected QR code',
      'Two students exchange a giveaway at the front of the hall',
      'A team member hands a participant a giveaway',
      'Workshop attendees seated together for a group photo',
      'Attendees and team members pose together, many making hand gestures for the camera',
    ],
  },
  {
    slug: 'cloud-study-jams',
    title: 'Google Cloud Study Jams Campaign',
    date: null, // TODO: the real date (shown as the 2025-26 tenure until then)
    tenure: '2025-26',
    category: 'Study Jams',
    highlight: true,
    desc: 'A full learning cycle, executed start to finish. Participants completed 20+ Google Cloud courses along with an Arcade Game to earn official goodies — with the GDG ViMEET core team guiding students throughout, helping with labs and courses, and resolving doubts to keep everyone on track.',
    // Single source with the home-page scroll story (data/story.js).
    stats: studyJams.stats.map((s) => ({ value: `${s.value}${s.suffix}`, label: s.label })),
    credits: studyJams.credits,
    link: { label: 'View on LinkedIn', href: site.social.linkedin },
    cover: '/events/cloud-campaign/1.webp',
    gallery: galleryPaths('cloud-campaign', 12),
    photoAlts: [
      'Cloud Study Jams participants fill a Vishwaniketan classroom for a group photo',
      'A participant receives a Study Jams goodies bag on stage',
      'A participant is handed his Study Jams goodies bag on stage',
      'A participant receives her goodies bag on stage',
      'A participant and a team member pose with a goodies bag on stage',
      'Three participants open their Google Cloud goodies, one covering her face in excitement',
      'Two participants unpack their goodies while a team member looks on',
      'A participant pulls his goodies out of the packaging',
      'The GDG team poses with goodies bags in front of the Vishwaniketan banner',
      'Team members unpack boxes of goodies before handing them out',
      'The goodies: a laptop bag, a Google Developer Groups T-shirt, a bottle and stickers',
      'Close-up of the goodies kit: laptop bag, Google Cloud stickers, bottle and T-shirt',
    ],
  },
  {
    slug: 'git-github-workshop-2025',
    title: 'Git & GitHub Workshop',
    date: null, // TODO: the real date
    tenure: '2025-26',
    category: 'Workshops',
    desc: 'Hands-on session covering Git fundamentals and collaborative workflows on GitHub — branching, commits, pull requests, and resolving merge conflicts.',
    cover: '/events/git-github-workshop/12.webp',
    gallery: galleryPaths('git-github-workshop', 15),
    photoAlts: [
      'A mentor sets up on a laptop before the workshop',
      'A technical team member helps a student in a code editor',
      'A student raises a hand with a question in the computer lab',
      'A team member guides two students at a workstation',
      'Two mentors troubleshoot together at a monitor',
      'Students watch a demo on a lab monitor',
      'A full computer lab follows along during the workshop',
      'A mentor watches over the lab from the front desk',
      'Wide view of the lab with a mentor at the front',
      'A mentor faces a room of students at their workstations',
      'A mentor checks on two students’ progress',
      'Attendees and mentors pose together at the end of the workshop',
      'Group photo of the whole workshop with the mentors in front',
      'The workshop group photo, second take',
      'The workshop group photo, third take',
    ],
  },
  {
    slug: 'nirmaan-webathon',
    title: 'Nirmaan — 8 Hour Webathon',
    date: null, // TODO: the real date
    tenure: '2025-26',
    category: 'Hackathons',
    desc: 'An 8-hour build sprint where teams designed and shipped a working web project from scratch in a single day.',
    cover: '/events/nirmaan-webathon/2.webp',
    gallery: galleryPaths('nirmaan-webathon', 15),
    photoAlts: [
      'Teams settle in at the start of the 8-hour webathon',
      'Four teammates talk through their code around a laptop',
      'A team works together at a desktop',
      'Teammates review code on two laptops',
      'Three teammates build on laptops by the window',
      'Wide view of the lab with teams at work',
      'A team concentrates on a shared screen',
      'Teammates code side by side',
      'A team of four works across their laptops',
      'Teammates type away at the lab desks',
      'A team gathers around one laptop',
      'Team members in GDG shirts code alongside participants',
      'Participants work on their laptops near the windows',
      'A technical team member oversees the full lab',
      'A team member checks in on a team’s progress',
    ],
  },
  {
    slug: 'jamming-session',
    title: 'Jamming Session',
    date: null, // TODO: the real date
    tenure: '2025-26',
    category: 'Community',
    desc: 'An informal community hangout for members to unwind, play music together, and connect outside of workshops and hackathons.',
    cover: '/events/jamming-session/2.webp',
    gallery: galleryPaths('jamming-session', 11),
    photoAlts: [
      'Two members laugh and sing along at their desks',
      'A member sings while playing an acoustic guitar',
      'Members gather in a circle in a classroom',
      'Two members smile during the session',
      'Members spread across a classroom for the jam',
      'A member listens as the music plays',
      'A member plays guitar and sings in front of a Diwali-decorated chalkboard',
      'A member smiles in front of the “Happy Diwali” chalkboard',
      'A selfie with members giving a thumbs-up',
      'Another thumbs-up selfie with the group behind',
      'Group photo of the jamming session in front of the Diwali chalkboard',
    ],
  },
];

/**
 * The event's date as a Date, or null when it is not known yet. ISO dates
 * only (`2026-10-07`), so parsing never depends on the browser's locale.
 */
export const eventDate = (event) => {
  if (!event?.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) return null;
  const [y, m, d] = event.date.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/**
 * 'upcoming' | 'completed', derived from the date — never stored by hand.
 * Undated events in `upcomingEvents` are upcoming; undated past events are
 * completed.
 */
export const getEventStatus = (event, now = new Date()) => {
  const date = eventDate(event);
  if (!date) return upcomingEvents.includes(event) ? 'upcoming' : 'completed';
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return endOfDay > now ? 'upcoming' : 'completed';
};

/** "7 October 2026", or the tenure ("2025-26") while the date is unknown. */
export const formatEventDate = (event) => {
  const date = eventDate(event);
  if (date) {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return event.when ?? event.tenure ?? '';
};

// Resolves each event's full photo set once, at module load. Priority:
// gallery[] > images[] > cover/image single shot. Each photo carries its alt
// text (falling back to "<title> — photo n").
const resolvePhotos = (event) => {
  const srcs = event.gallery?.length
    ? event.gallery
    : event.images?.length
      ? event.images
      : [event.cover ?? event.image].filter(Boolean);
  return srcs.map((src, i) => ({
    src,
    alt: event.photoAlts?.[i] ?? `${event.title} — photo ${i + 1}`,
  }));
};

export const pastEvents = rawPastEvents.map((event) => ({
  ...event,
  status: getEventStatus(event),
  photos: resolvePhotos(event),
}));

export const findEvent = (slug) => pastEvents.find((e) => e.slug === slug) ?? null;

export const eventCategories = ['All', 'Study Jams', 'Workshops', 'Hackathons', 'Community'];

/**
 * A few real photos from every event, for the home page "Moments" strip.
 * [slug, photo number] — change freely.
 */
const MOMENTS = [
  ['cloud-study-jams', 6],
  ['git-github-workshop-2026', 4],
  ['nirmaan-webathon', 2],
  ['jamming-session', 2],
  ['git-github-workshop-2025', 13],
  ['cloud-study-jams', 9],
  ['git-github-workshop-2026', 12],
  ['nirmaan-webathon', 15],
];

export const moments = MOMENTS.map(([slug, n]) => {
  const event = findEvent(slug);
  return { ...event.photos[n - 1], event: { slug: event.slug, title: event.title } };
});

export default { upcomingEvents, pastEvents, eventCategories };
