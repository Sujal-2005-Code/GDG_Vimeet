/**
 * Initials avatar for people without a photo. The colour is picked from the
 * four brand tints by a hash of the name, so a person always gets the same
 * one. Text/background pairs all pass WCAG AA.
 */
const TONES = [
  'bg-primary-tint text-primary-strong',
  'bg-danger-tint text-danger',
  'bg-warning-tint text-ink',
  'bg-success-tint text-success',
];

const initialsOf = (name = '') => {
  const words = name
    .replace(/^(dr|mrs|mr|ms|prof)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
};

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const Avatar = ({ name, size = 'size-12', className = '' }) => (
  <span
    aria-hidden="true"
    className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-tight ${TONES[hash(name) % TONES.length]} ${size} ${className}`}
  >
    {initialsOf(name)}
  </span>
);

export default Avatar;
