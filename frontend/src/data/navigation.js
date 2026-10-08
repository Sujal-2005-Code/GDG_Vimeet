/**
 * Primary site navigation (links only). The call-to-action button is NOT
 * listed here — it comes from getRecruitmentCta() so it always matches
 * whether applications are open. `hash` items would be anchors on the
 * homepage; none are in the primary nav (a hash item shares its pathname
 * with Home, which made both appear active).
 */
export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Team', path: '/team' },
  { label: 'Contact', path: '/contact' },
];

export const footerNavItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/#about', hash: true },
  { label: 'Team', path: '/team' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
  { label: 'Join Us', path: '/join' },
];

export default navItems;
