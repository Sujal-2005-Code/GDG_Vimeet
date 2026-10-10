import { Link } from 'react-router-dom';
import { site } from '../../data/site';

/**
 * Site brand in the header: the logo's chevron mark (referenced from the
 * supplied SVG with <use>, never redrawn here) beside the name set as HTML
 * text. With `site.brand.logo = null` it falls back to text only.
 */
const Wordmark = ({ className = '', onClick }) => {
  const { logo, wordmark } = site.brand;

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex min-h-11 items-center gap-3 rounded-field leading-none ${className}`}
    >
      {logo?.src && (
        <img
          src={logo.src}
          alt=""
          className="h-[60px] w-auto shrink-0 object-contain"
        />
      )}
      <span className="flex flex-col">
        <span className="whitespace-nowrap text-[1.0625rem] font-semibold tracking-tight text-ink">
          {wordmark.primary}
        </span>
        <span className="mt-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-2">
          {wordmark.secondary}
        </span>
      </span>
      <span className="sr-only">, home</span>
    </Link>
  );
};

export default Wordmark;
