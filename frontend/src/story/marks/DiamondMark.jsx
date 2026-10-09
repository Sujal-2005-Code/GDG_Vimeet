/**
 * The hero visual: four rounded diamonds in the Google colours around a
 * white lens, with two orbit rings, a soft contact shadow and four accent
 * dots (the supplied public/images/gdg-vishwaniketan-2-5d-mark.svg, 800×800
 * viewBox). Decorative and NOT an official GDG logo.
 *
 * ONE flat SVG, drawn once. The diamonds never move; the two rings and the
 * dots are wrapped in groups the rig turns with scroll (rig.js):
 *   [data-ring="a|b"]   an orbit ring
 *   [data-dots]         the four accent dots
 *
 * Depth is painted, not computed: each diamond has a darker copy offset
 * behind it for thickness, and a static gradient stands in for the shadow.
 */
const DIAMONDS = [
  { key: 'blue', cx: 292.5, cy: 272.5, r0: -45, edge: '#174EA6' },
  { key: 'red', cx: 507.5, cy: 272.5, r0: 45, edge: '#A50E0E' },
  { key: 'yellow', cx: 292.5, cy: 507.5, r0: 45, edge: '#E37400' },
  { key: 'green', cx: 507.5, cy: 507.5, r0: -45, edge: '#0D652D' },
];

const GRADIENTS = [
  ['blue', '#4285F4', '#1A73E8'],
  ['red', '#EA4335', '#C5221F'],
  ['yellow', '#FBBC05', '#F9AB00'],
  ['green', '#34A853', '#137333'],
];

const DOTS = [
  { key: 'blue', cx: 137, cy: 400, fill: '#4285F4' },
  { key: 'red', cx: 663, cy: 400, fill: '#EA4335' },
  { key: 'yellow', cx: 400, cy: 137, fill: '#FBBC05' },
  { key: 'green', cx: 400, cy: 663, fill: '#34A853' },
];

// Rings: ellipse rx313 ry113 about the centre, tilted -18° / 42°.
const RINGS = [
  { id: 'a', r0: -18 },
  { id: 'b', r0: 42 },
];

// A rotated-group's origin must be the viewBox centre.
const SPINNER = { transformOrigin: '400px 400px', transformBox: 'view-box' };

const Diamond = ({ cx, cy, r0, fill }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${r0})`}>
    <rect x="-87.5" y="-87.5" width="175" height="175" rx="58" fill={fill} />
  </g>
);

const DiamondMark = () => (
  <svg className="story-svg" viewBox="0 0 800 800" aria-hidden="true" focusable="false">
    <defs>
      {GRADIENTS.map(([key, from, to]) => (
        <linearGradient key={key} id={`gdg-g-${key}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      ))}
      <radialGradient id="gdg-shadow">
        <stop offset="0" stopColor="#3c4043" stopOpacity="0.2" />
        <stop offset="1" stopColor="#3c4043" stopOpacity="0" />
      </radialGradient>
    </defs>

    <ellipse cx="400" cy="464" rx="288" ry="160" fill="url(#gdg-shadow)" />

    {RINGS.map(({ id, r0 }) => (
      <g key={id} data-ring={id} style={SPINNER}>
        <ellipse
          cx="400"
          cy="400"
          rx="313"
          ry="113"
          fill="none"
          stroke="#DADCE0"
          strokeWidth="4"
          opacity="0.75"
          transform={`rotate(${r0} 400 400)`}
        />
      </g>
    ))}

    {DIAMONDS.map((d) => (
      <g key={d.key}>
        <Diamond cx={d.cx + 5} cy={d.cy + 8} r0={d.r0} fill={d.edge} />
        <Diamond cx={d.cx} cy={d.cy} r0={d.r0} fill={`url(#gdg-g-${d.key})`} />
      </g>
    ))}

    {/* Central negative-space lens. */}
    <circle cx="400" cy="400" r="72" fill="#fff" />
    <circle cx="400" cy="400" r="48" fill="#F8F9FA" />

    <g data-dots style={SPINNER}>
      {DOTS.map((d) => (
        <circle key={d.key} cx={d.cx} cy={d.cy} r="12" fill={d.fill} />
      ))}
    </g>
  </svg>
);

export default DiamondMark;
