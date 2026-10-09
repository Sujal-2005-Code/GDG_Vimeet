import { Link } from 'react-router-dom';
import Icon from './Icon';

/**
 * Inline link whose underline grows in on hover/focus. `stroke` uses the
 * four-colour stroke for the underline (key links only). Internal paths use
 * the router; `http…`/`mailto:` render an <a> (external ones open a new tab).
 */
const TextLink = ({ to, children, stroke = false, icon, className = '', ...rest }) => {
  const external = /^https?:/.test(to);
  const plain = /^(mailto|tel):/.test(to);
  const underline = stroke
    ? 'bg-[linear-gradient(90deg,var(--color-google-blue)_0_25%,var(--color-google-red)_25%_50%,var(--color-google-yellow)_50%_75%,var(--color-google-green)_75%_100%)]'
    : 'bg-[linear-gradient(currentColor,currentColor)]';
  const classes =
    `group inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary-strong hover:text-ink ` +
    `transition-colors duration-[var(--dur-fast)] ${className}`;
  const content = (
    <>
      <span
        className={`${underline} bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-[var(--dur-slow)] ease-emphasized group-hover:bg-[length:100%_2px] group-focus-visible:bg-[length:100%_2px]`}
      >
        {children}
      </span>
      {icon && <Icon name={icon} className="size-4 shrink-0 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" />}
    </>
  );

  if (external || plain) {
    return (
      <a href={to} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={classes} {...rest}>
      {content}
    </Link>
  );
};

export default TextLink;
