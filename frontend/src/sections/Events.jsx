import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import useReveal from '../animations/reveal';
import EventCard from '../components/events/EventCard';
import UpcomingCard from '../components/events/UpcomingCard';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import { eventCategories, pastEvents, upcomingEvents } from '../data/events';
import { getRecruitmentCta } from '../data/recruitment';
import { site } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';

// Editorial rhythm for the archive: the newest event is the lead story, the
// rest alternate wide/narrow in pairs (7/5, 5/7 …) instead of a uniform grid.
const spanFor = (i) => {
  if (i === 0) return 'lg:col-span-12';
  const pair = Math.floor((i - 1) / 2);
  const first = (i - 1) % 2 === 0;
  return (pair % 2 === 0) === first ? 'lg:col-span-7' : 'lg:col-span-5';
};

/** Category filter with a sliding indicator (one element, transform only). */
const CategoryFilter = ({ value, onChange }) => {
  const refs = useRef({});
  const [box, setBox] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[value];
      if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [value]);

  return (
    <div role="group" aria-label="Filter past events by category" className="max-w-full overflow-x-auto">
      <div className="relative inline-flex rounded-full border border-line bg-surface-2 p-1">
        <span
          aria-hidden="true"
          className="absolute left-0 top-1 bottom-1 w-[100px] origin-left rounded-full bg-surface shadow-rest transition-transform duration-[var(--dur-slow)] ease-emphasized"
          style={{ transform: `translateX(${box.x}px) scaleX(${box.w / 100})` }}
        />
        {eventCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            ref={(el) => {
              refs.current[cat] = el;
            }}
            onClick={() => onChange(cat)}
            aria-pressed={value === cat}
            className={`relative z-10 min-h-11 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-[var(--dur-fast)] ${
              value === cat ? 'text-ink' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

const Events = () => {
  usePageMeta('Events', 'Workshops, hackathons, study jams and community sessions by GDG On Campus Vishwaniketan — what’s next and every past gallery.');
  const ref = useRef(null);
  useReveal(ref);

  const recruit = getRecruitmentCta();
  const [category, setCategory] = useState('All');
  const filtered = useMemo(
    () => pastEvents.filter((e) => category === 'All' || e.category === category),
    [category]
  );

  return (
    <main id="main" ref={ref}>
      <PageHeader
        current="Events"
        overline="What’s happening"
        title={
          <>
            Explore <span className="text-primary">events</span>
          </>
        }
        lede="Workshops, hackathons, and community experiences built for people who want to learn, create, and grow together."
      />

      <Section labelledBy="upnext-title" className="pt-0!">
        <SectionHeader id="upnext-title" overline="Up next" title="Coming up" stroke={false} />
        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <UpcomingCard event={upcomingEvents[0]} headingLevel="h3" className="lg:col-span-8" />
          <aside data-reveal className="flex flex-col justify-between gap-6 rounded-media bg-surface-2 p-7 sm:p-8 lg:col-span-4">
            <div>
              <h3 className="text-h3 text-ink">Want to organise, design, or speak at our next event?</h3>
              <p className="mt-3 text-ink-2">
                {recruit.open
                  ? 'Join our Technical, Event Management, Graphics & Design, PR & Outreach, or Content & Social Media teams.'
                  : recruit.message}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button href={`mailto:${site.email}?subject=Workshop%20%2F%20talk%20proposal`} variant="secondary" icon="mail">
                Propose a workshop or talk
              </Button>
              <Button
                variant="text"
                icon={recruit.external ? 'external' : 'arrow-right'}
                aria-label={recruit.ariaLabel}
                {...(recruit.external ? { href: recruit.href } : { to: recruit.href })}
              >
                {recruit.open ? 'Apply for GDG teams' : recruit.label}
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <Section labelledBy="past-title" tone="tint">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="past-title" overline="From the community archive" title="Past events" />
          <div data-reveal>
            <CategoryFilter value={category} onChange={setCategory} />
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'} shown
        </p>

        {filtered.length === 0 ? (
          <p className="mt-10 rounded-card border border-dashed border-line-strong p-10 text-center text-ink-2">
            No sessions in this category yet.
          </p>
        ) : (
          <ul key={category} className="anim-rise-fade mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
            {filtered.map((event, i) => (
              <li key={event.slug} className={`flex ${spanFor(i)}`}>
                <EventCard
                  event={event}
                  variant={i === 0 ? 'lead' : 'standard'}
                  headingLevel="h3"
                  className="w-full"
                />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Container className="py-10 text-center text-sm text-ink-2">
        More galleries and dates are added as events happen.
      </Container>
    </main>
  );
};

export default Events;
