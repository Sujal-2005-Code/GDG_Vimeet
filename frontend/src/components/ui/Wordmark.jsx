import { Link } from 'react-router-dom';
import { site } from '../../data/site';

/**
 * Site brand in the header. Temporary typographic wordmark until the
 * official GDG On Campus logo is supplied: set `site.brand.logo = { src, alt }`
 * and this renders the image instead — no other change needed.
 * Never draw or approximate the logo here.
 */
const Wordmark = ({ className = '', onClick }) => {
  const { logo, wordmark } = site.brand;

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex min-h-11 flex-col justify-center rounded-field leading-none ${className}`}
    >
      {logo ? (
        <img src={logo.src} alt={`${wordmark.primary} ${wordmark.secondary}`} className="h-9 w-auto" />
      ) : (
        <>
          <span className="text-[1.0625rem] font-semibold tracking-tight text-ink">
            {wordmark.primary}
          </span>
          <span className="mt-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-2">
            {wordmark.secondary}
          </span>
        </>
      )}
      <span className="sr-only">, home</span>
    </Link>
  );
};

export default Wordmark;
