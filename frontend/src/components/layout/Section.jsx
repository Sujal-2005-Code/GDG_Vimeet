import Container from './Container';

/**
 * Page section with the system's vertical rhythm (64px mobile → 112px
 * desktop) — no spacer divs. `tone="tint"` gives the alternate grey band.
 */
const Section = ({ id, labelledBy, tone = 'surface', className = '', containerClassName = '', children, ...rest }) => (
  <section
    id={id}
    aria-labelledby={labelledBy}
    className={`relative py-16 sm:py-20 lg:py-28 ${tone === 'tint' ? 'bg-surface-2' : 'bg-surface'} ${className}`}
    {...rest}
  >
    <Container className={containerClassName}>{children}</Container>
  </section>
);

export default Section;
