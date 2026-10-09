import { site } from '../data/site';

/** Which glyph (components/ui/SocialIcon) a link label or URL refers to. */
export const socialKind = (labelOrHref = '') => {
  const s = labelOrHref.toLowerCase();
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('linkedin')) return 'linkedin';
  if (s.includes('github')) return 'github';
  if (s.includes('mail')) return 'email';
  return null;
};

/** The chapter's own social profiles, in display order (from data/site.js). */
export const chapterSocials = [
  { kind: 'instagram', label: 'Instagram', href: site.social.instagram },
  { kind: 'linkedin', label: 'LinkedIn', href: site.social.linkedin },
  { kind: 'github', label: 'GitHub', href: site.social.github },
].filter((s) => s.href);
