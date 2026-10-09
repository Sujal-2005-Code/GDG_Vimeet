/**
 * The real GDG mark: the `#gdg-mark` group of the supplied logo SVG
 * (site.brand.logo), referenced with <use> — never redrawn, split or
 * re-coloured here. It stays ONE object (the four chevron strokes are not
 * animated separately); the text lockup is not part of it.
 *
 * Replace public/images/gdg-on-campus-vishwaniketan.svg and this updates
 * with it (keep the `gdg-mark` id; adjust `markViewBox` in data/site.js if
 * the mark's bounds change).
 */
const LogoMark = ({ logo }) => (
  <svg
    className="story-svg"
    viewBox={logo.markViewBox}
    aria-hidden="true"
    focusable="false"
  >
    <use href={`${logo.src}#${logo.markId}`} />
  </svg>
);

export default LogoMark;
