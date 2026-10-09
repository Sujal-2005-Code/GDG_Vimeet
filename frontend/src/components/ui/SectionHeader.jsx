import ColorStroke from './ColorStroke';

/**
 * Overline · heading · four-colour stroke · lede — the one way sections are
 * introduced. `id` goes on the heading so the section can use
 * aria-labelledby. `as` sets the heading level (h2 by default; h1 on page
 * headers).
 */
const SectionHeader = ({
  id,
  overline,
  title,
  lede,
  as = 'h2',
  size = 'h2',
  align = 'left',
  stroke = true,
  className = '',
  children,
}) => {
  const Heading = as;
  const centered = align === 'center';
  const sizeClass = size === 'display' ? 'text-display' : size === 'h1' ? 'text-h1' : 'text-h2';
  return (
    <header className={`${centered ? 'mx-auto text-center' : ''} max-w-[46rem] ${className}`} data-reveal>
      {overline && (
        <p className="font-mono text-overline font-medium uppercase text-ink-2">{overline}</p>
      )}
      <Heading id={id} className={`${overline ? 'mt-3' : ''} ${sizeClass} text-balance text-ink`}>
        {title}
      </Heading>
      {stroke && <ColorStroke className={`mt-5 h-[3px] w-20 ${centered ? 'mx-auto' : ''}`} />}
      {lede && <p className="mt-5 max-w-[60ch] text-body-lg text-pretty text-ink-2">{lede}</p>}
      {children}
    </header>
  );
};

export default SectionHeader;
