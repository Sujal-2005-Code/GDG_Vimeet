/**
 * Small inline-SVG line-icon set (24px grid, 2px stroke, currentColor).
 * Add icons here as pages need them — no icon font, no dependency.
 */
const PATHS = {
  'arrow-right': 'M5 12h14m0 0-6-6m6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  external: 'M14 4h6v6m0-6L10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
};

const Icon = ({ name, className = 'size-5', ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
    {...rest}
  >
    <path d={PATHS[name]} />
  </svg>
);

export default Icon;
