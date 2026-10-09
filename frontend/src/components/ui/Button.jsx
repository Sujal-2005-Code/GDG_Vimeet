import { Link } from 'react-router-dom';
import Icon from './Icon';

const BASE =
  'group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,box-shadow,transform,color] duration-[var(--dur-base)] ease-standard ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const VARIANTS = {
  // White on #1A73E8 = 4.51:1 (AA). Brand blue #4285F4 would fail (3.56:1).
  primary:
    'bg-primary text-white shadow-rest hover:-translate-y-px hover:bg-primary-strong hover:shadow-raised',
  secondary:
    'border border-line-strong bg-surface text-ink hover:-translate-y-px hover:border-ink-2 hover:bg-surface-2',
  // primary-strong (not primary): the plain blue is 4.27:1 on the grey section bands.
  text: 'px-1 text-primary-strong underline-offset-4 hover:text-ink hover:underline',
};

const SIZES = {
  md: 'min-h-12 px-6 text-[0.9375rem]',
  sm: 'min-h-11 px-5 text-sm',
};

/**
 * Polymorphic button. Renders a router <Link> when `to` is set, an external
 * <a target="_blank"> when `href` is set, otherwise a <button>.
 * Every size keeps a ≥44px touch target.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon,
  className = '',
  children,
  ...rest
}) => {
  const classes = `${BASE} ${VARIANTS[variant]} ${variant === 'text' ? 'min-h-11' : SIZES[size]} ${className}`;
  const content = (
    <>
      {children}
      {icon && (
        <Icon
          name={icon}
          className={`size-4 shrink-0 ${icon === 'arrow-right' ? 'transition-transform duration-[var(--dur-base)] ease-standard group-hover:translate-x-0.5' : ''}`}
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
};

export default Button;
