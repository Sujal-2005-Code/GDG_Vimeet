import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useReveal from '../animations/reveal';
import { EventMeta } from '../components/events/EventCard';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import { Chip, StatusChip } from '../components/ui/Chip';
import Icon from '../components/ui/Icon';
import Lightbox from '../components/ui/Lightbox';
import Photo from '../components/ui/Photo';
import SectionHeader from '../components/ui/SectionHeader';
import { findEvent, pastEvents } from '../data/events';
import usePageMeta from '../hooks/usePageMeta';
import NotFound from './NotFound';

// Bento rhythm: every 6th photo (starting with the first) is a 2×2 tile.
const tileSpan = (i) => (i % 6 === 0 ? 'col-span-2 row-span-2' : '');

const EventPage = ({ event }) => {
  usePageMeta(event.title, event.desc);
  const ref = useRef(null);
  useReveal(ref, [event.slug]);
  const [index, setIndex] = useState(null);

  const at = pastEvents.indexOf(event);
  const newer = pastEvents[at - 1];
  const older = pastEvents[at + 1];

  return (
    <main id="main" ref={ref}>
      <PageHeader crumbs={[{ label: 'Events', to: '/events' }]} current={event.title} title={event.title}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StatusChip status={event.status} />
          <Chip>{event.category}</Chip>
          {event.highlight && <StatusChip status="highlight" />}
        </div>
        <EventMeta event={event} className="mt-5 text-base" />
        <p className="mt-6 max-w-[64ch] text-body-lg text-ink-2">{event.desc}</p>

        {event.stats?.length > 0 && (
          <dl className="mt-8 grid max-w-[40rem] grid-cols-3 gap-6 border-t border-line pt-6">
            {event.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-sm text-ink-2">{stat.label}</dt>
                <dd className="order-first text-h2 font-bold tabular-nums text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {(event.meta?.organizer || event.credits) && (
          <p className="mt-6 max-w-[64ch] text-sm text-ink-2">
            {event.meta?.organizer ? (
              <>
                Organised by <span className="font-medium text-ink">{event.meta.organizer}</span>
              </>
            ) : (
              event.credits
            )}
          </p>
        )}

        {event.link && (
          <div className="mt-6">
            <Button href={event.link.href} variant="secondary" icon="external" aria-label={`${event.link.label} (opens in a new tab)`}>
              {event.link.label}
            </Button>
          </div>
        )}
      </PageHeader>

      <Section labelledBy="gallery-title" tone="tint">
        <SectionHeader id="gallery-title" overline={`${event.photos.length} photos`} title="Gallery" stroke={false} />
        <ul className="mt-8 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[12rem] lg:grid-cols-4">
          {event.photos.map((photo, i) => (
            <li key={photo.src} data-reveal="image" className={tileSpan(i)}>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.focus();
                  setIndex(i);
                }}
                aria-label={`Open photo ${i + 1} of ${event.photos.length}: ${photo.alt}`}
                className="group block size-full overflow-hidden rounded-card bg-surface"
              >
                <Photo
                  src={photo.src}
                  alt=""
                  sizes={tileSpan(i) ? '(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'}
                  className="size-full object-cover transition-transform duration-[var(--dur-slow)] ease-standard group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Container as="nav" aria-label="More events" className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16">
        {[newer && { e: newer, dir: 'Newer' }, older && { e: older, dir: 'Older' }].filter(Boolean).map(({ e, dir }) => (
          <Link
            key={e.slug}
            to={`/events/${e.slug}`}
            className={`group flex min-h-24 flex-col justify-center rounded-card border border-line p-5 transition-[box-shadow,border-color] hover:border-transparent hover:shadow-raised ${dir === 'Older' ? 'sm:col-start-2 sm:text-right' : ''}`}
          >
            <span className={`inline-flex items-center gap-1.5 text-sm text-ink-2 ${dir === 'Older' ? 'sm:justify-end' : ''}`}>
              {dir === 'Newer' && <Icon name="arrow-left" className="size-4" />}
              {dir} event
              {dir === 'Older' && <Icon name="arrow-right" className="size-4" />}
            </span>
            <span className="mt-1 text-lg font-semibold text-ink group-hover:text-primary">{e.title}</span>
          </Link>
        ))}
      </Container>

      <Lightbox title={event.title} photos={event.photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </main>
  );
};

/** /events/:slug — one event: details, figures, the full gallery. */
const EventDetail = () => {
  const { slug } = useParams();
  const event = findEvent(slug);
  if (!event) return <NotFound what="event" />;
  // Keyed by slug so moving between events resets the viewer and reveals.
  return <EventPage key={event.slug} event={event} />;
};

export default EventDetail;
