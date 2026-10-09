import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import ColorStroke from '../components/ui/ColorStroke';
import { getRecruitmentCta } from '../data/recruitment';
import { site } from '../data/site';

/**
 * Hero — chapter 0 of the story. All copy is real HTML; the visual is NOT
 * rendered here: the persistent 2.5D stage (story/) draws it, positioned
 * from the `data-story-slot` element below. That keeps this component
 * independent of what the visual is — swap it in data/site.js
 * (`site.hero.visual`) and nothing here changes.
 *
 * Layout is plain CSS: two columns from `lg`, text-then-slot below it. The
 * slot just reserves space; the engine measures it.
 */
const Hero = () => {
  const { headline, subhead, visual } = site.hero;
  const { lockup } = site.brand;
  const cta = getRecruitmentCta();
  const accentIndex = headline.length - 1;

  return (
    <section
      data-story-chapter="hero"
      aria-labelledby="hero-title"
      className="relative z-10 flex min-h-[100svh] flex-col pt-[var(--nav-h)]"
    >
      <Container className="grid flex-1 items-center gap-6 pb-10 max-lg:grid-rows-[auto_minmax(15rem,1fr)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:pb-16">
        <div data-story-copy="hero" className="max-w-[40rem] py-4 lg:py-0">
          {lockup && (
            <img
              src={lockup.src}
              alt={lockup.alt}
              width={lockup.width}
              height={lockup.height}
              // The supplied SVG has wide blank side margins; a narrower
              // aspect box + object-cover crops them so the lockup is legible.
              // Likely the largest paint on phones: fetch early, and animate
              // transform only (an opacity fade would delay LCP).
              fetchPriority="high"
              decoding="async"
              className="anim-rise mb-6 h-auto w-[min(100%,17rem)] object-contain object-left"
            />
          )}

          {/* Transform-only entrance (no opacity), so the h1 is always painted and LCP is not delayed. */}
          <h1 id="hero-title" className="text-display text-balance text-ink">
            {headline.map((line, i) => (
              <span
                key={line}
                className={`anim-rise block ${i === accentIndex ? 'text-primary' : ''}`}
                style={{ '--delay': `${i * 70}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="anim-rise-fade mt-6 max-w-[34rem] text-body-lg text-ink-2"
            style={{ '--delay': '260ms' }}
          >
            {subhead}
          </p>

          <div
            className="anim-rise-fade mt-8 flex flex-wrap items-center gap-3"
            style={{ '--delay': '360ms' }}
          >
            <Button to="/events" icon="arrow-right">
              Explore events
            </Button>
            <Button
              variant="secondary"
              aria-label={cta.ariaLabel}
              icon={cta.external ? 'external' : 'arrow-right'}
              {...(cta.external ? { href: cta.href } : { to: cta.href })}
            >
              {cta.label}
            </Button>
          </div>

          <ColorStroke className="anim-rise-fade mt-12 h-[3px] w-28" style={{ '--delay': '460ms' }} />
        </div>

        {/* Reserved space for the stage's hero visual (measured by the engine). */}
        <div
          data-story-slot="hero"
          aria-hidden="true"
          className="relative min-h-[15rem] w-full lg:h-[min(72svh,36rem)]"
        />
      </Container>

      {/* The stage is decorative; describe the visual to assistive tech only if it carries meaning. */}
      {visual.alt ? <p className="sr-only">{visual.alt}</p> : null}
    </section>
  );
};

export default Hero;
