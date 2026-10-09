import { site } from './site';

/**
 * Single source of truth for every recruitment-related call to action.
 * Anything that advertises joining/applying MUST read this instead of
 * hard-coding "Apply" / "Hiring" copy, so the site can never claim
 * applications are open while `site.recruitmentOpen` is false.
 */
export const getRecruitmentCta = () =>
  site.recruitmentOpen
    ? {
        open: true,
        label: 'Join GDG',
        href: '/join',
        external: false,
        ariaLabel: 'Join GDG',
        statusLabel: 'Applications open',
        message: 'We are recruiting for the 2026-27 teams. Step up and make an impact.',
      }
    : {
        open: false,
        label: 'Follow us',
        href: site.social.instagram,
        external: true,
        ariaLabel: 'Follow us on Instagram (opens in a new tab)',
        statusLabel: 'Applications closed',
        message: 'Applications for 2026-27 are closed. Follow us to hear when they reopen.',
      };

/**
 * The 5 official GDG ViMEET 2026-27 recruitment teams. `id` is the value
 * stored/submitted with an application — keep it stable once applications
 * start coming in.
 */
export const recruitmentTeams = [
  {
    id: 'Technical',
    name: 'Technical Team',
    badge: 'Code & Workshops',
    iconKey: 'technical',
    description: 'Build web applications, conduct AI/ML & Cloud workshops, organize competitive hackathons and coding labs.',
  },
  {
    id: 'Graphics & Design',
    name: 'Graphics & Design Team',
    badge: 'Design Task Req.',
    iconKey: 'graphics',
    description: 'Design official GDG branding, social media posts, UI mockups, event banners, and stickers.',
  },
  {
    id: 'Content & Social Media',
    name: 'Content & Social Media Team',
    badge: 'Media & Reels',
    iconKey: 'content',
    description: 'Create captivating reels, write social copy, photograph events, and lead community engagement.',
  },
  {
    id: 'PR & Outreach',
    name: 'PR & Outreach Team',
    badge: 'Outreach & Sponsors',
    iconKey: 'pr',
    description: 'Drive college sponsorships, connect with campus clubs, manage external outreach, and media relations.',
  },
  {
    id: 'Event Management',
    name: 'Event Management Team',
    badge: 'Operations',
    iconKey: 'events',
    description: 'Coordinate hackathons, tech talks, logistics, host speaker sessions, and manage crowds.',
  },
];

/**
 * "Find your place" (home page): the 12 interest areas of the old "Go Beyond
 * Code" grid, grouped into four clusters and linked to the teams above by
 * `id`. Lead has no single team — it links to all of them.
 */
export const interestClusters = [
  {
    key: 'build',
    name: 'Build',
    icon: 'code',
    tone: 'blue',
    interests: ['Technology', 'AI', 'Web & App Dev', 'Cloud'],
    teams: ['Technical'],
  },
  {
    key: 'create',
    name: 'Create',
    icon: 'palette',
    tone: 'red',
    interests: ['Design', 'Graphics', 'Content & Social'],
    teams: ['Graphics & Design', 'Content & Social Media'],
  },
  {
    key: 'connect',
    name: 'Connect',
    icon: 'users',
    tone: 'green',
    interests: ['PR & Outreach', 'Events', 'Community'],
    teams: ['PR & Outreach', 'Event Management'],
  },
  {
    key: 'lead',
    name: 'Lead',
    icon: 'flag',
    tone: 'yellow',
    interests: ['Entrepreneurship', 'Innovation'],
    teams: [],
  },
];

export default recruitmentTeams;
