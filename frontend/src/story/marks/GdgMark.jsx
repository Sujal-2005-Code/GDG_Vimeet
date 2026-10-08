import { Dots, Ring, Shadow } from './Satellites';

/**
 * The supplied 2.5D geometric mark (public/images/gdg-vishwaniketan-2-5d-mark.svg)
 * split into separately animatable layers. Geometry, colours and gradients
 * are taken from that file (800×800 viewBox); the soft drop-shadow filter is
 * replaced by a single static gradient layer (see story.css).
 *
 * Depth: each diamond is `slices` stacked copies at slightly different Z.
 * The front slice carries the gradient; the rest are darker "edge" colours,
 * so when a diamond turns in 3D you see thickness. Lite tiers use 1 slice.
 *
 * This is a decorative, temporary visual — NOT an official GDG logo.
 */
const DIAMONDS = [
  { key: 'blue', cx: 292.5, cy: 272.5, r0: -45, edge: '#174EA6' },
  { key: 'red', cx: 507.5, cy: 272.5, r0: 45, edge: '#A50E0E' },
  { key: 'yellow', cx: 292.5, cy: 507.5, r0: 45, edge: '#E37400' },
  { key: 'green', cx: 507.5, cy: 507.5, r0: -45, edge: '#0D652D' },
];

// Slice spacing as a fraction of the mark size (about 6px at 520px).
const SLICE_GAP = 0.011;

/** Gradient defs, referenced by id from the slices (same colours as the SVG file). */
export const MarkDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      {[
        ['blue', '#4285F4', '#1A73E8'],
        ['red', '#EA4335', '#C5221F'],
        ['yellow', '#FBBC05', '#F9AB00'],
        ['green', '#34A853', '#137333'],
      ].map(([key, from, to]) => (
        <linearGradient key={key} id={`gdg-g-${key}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      ))}
    </defs>
  </svg>
);

const GdgMark = ({ slices = 1 }) => (
  <div data-entity="mark" className="story-entity gdg-mark">
    <Shadow />
    <Ring id="ring-a" r0={-18} />
    <Ring id="ring-b" r0={42} />

    {DIAMONDS.map((d) => (
      <div
        key={d.key}
        data-entity={`diamond-${d.key}`}
        data-r0={d.r0}
        className="story-entity"
        style={{ left: `${d.cx / 8}%`, top: `${d.cy / 8}%`, width: '21.875%', height: '21.875%' }}
      >
        {Array.from({ length: slices }, (_, i) => (
          <svg
            key={i}
            className="story-slice"
            viewBox="0 0 175 175"
            aria-hidden="true"
            style={i === 0 ? undefined : { transform: `translateZ(calc(var(--s) * ${-i * SLICE_GAP}))` }}
          >
            <rect width="175" height="175" rx="58" fill={i === 0 ? `url(#gdg-g-${d.key})` : d.edge} />
          </svg>
        ))}
      </div>
    ))}

    {/* Central negative-space lens (white over the diamonds' inner corners). */}
    <div
      data-entity="lens"
      className="story-entity"
      style={{ left: '50%', top: '50%', width: '18%', height: '18%' }}
    >
      <svg className="story-fill" viewBox="0 0 144 144" aria-hidden="true">
        <circle cx="72" cy="72" r="72" fill="#fff" />
        <circle cx="72" cy="72" r="48" fill="#F8F9FA" />
      </svg>
    </div>

    <Dots />
  </div>
);

export default GdgMark;
