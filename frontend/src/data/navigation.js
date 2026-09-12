/**
 * Primary site navigation. `hash` items are anchors on the homepage ('/')
 * rather than separate routes.
 */
export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/#about', hash: true },
  { label: 'Teams', path: '/team' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
  { label: 'Join Us', path: '/join', cta: true },
];

export const footerNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Teams', path: '/team' },
  { label: 'Contact', path: '/contact' },
  { label: 'Recruitment 2026-27', path: '/join', highlight: true },
  { label: 'Core Admin', path: '/admin/applications', muted: true },
];

export default navItems;
