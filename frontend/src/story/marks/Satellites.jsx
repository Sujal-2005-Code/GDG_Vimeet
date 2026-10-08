/**
 * Pieces shared by every hero visual: contact shadow, two orbit rings and
 * four accent dots. Geometry (800-unit viewBox) is taken from the supplied
 * public/images/gdg-vishwaniketan-2-5d-mark.svg.
 */
const DOTS = [
  { key: 'blue', cx: 137, cy: 400, fill: '#4285F4' },
  { key: 'red', cx: 663, cy: 400, fill: '#EA4335' },
  { key: 'yellow', cx: 400, cy: 137, fill: '#FBBC05' },
  { key: 'green', cx: 400, cy: 663, fill: '#34A853' },
];

export const Shadow = () => (
  <div
    data-entity="shadow"
    className="story-entity story-shadow"
    style={{ left: '50%', top: '58%', width: '72%', height: '40%' }}
  />
);

// Ellipse rx315 ry115, rotated -18° / 42° about the centre, #DADCE0 stroke.
export const Ring = ({ id, r0 }) => (
  <div
    data-entity={id}
    data-r0={r0}
    className="story-entity"
    style={{ left: '50%', top: '50%', width: '78.75%', height: '28.75%' }}
  >
    <svg className="story-fill" viewBox="0 0 630 230" aria-hidden="true">
      <ellipse cx="315" cy="115" rx="313" ry="113" fill="none" stroke="#DADCE0" strokeWidth="4" opacity="0.75" />
    </svg>
  </div>
);

// `dots` is a full-size group so rotating it swings the dots around the centre.
export const Dots = () => (
  <div
    data-entity="dots"
    className="story-entity"
    style={{ left: '50%', top: '50%', width: '100%', height: '100%' }}
  >
    {DOTS.map((d) => (
      <div
        key={d.key}
        data-entity={`dot-${d.key}`}
        className="story-entity"
        style={{ left: `${d.cx / 8}%`, top: `${d.cy / 8}%`, width: '3%', height: '3%' }}
      >
        <svg className="story-fill" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill={d.fill} />
        </svg>
      </div>
    ))}
  </div>
);
