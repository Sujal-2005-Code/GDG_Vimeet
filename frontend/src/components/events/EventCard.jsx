import { Link } from 'react-router-dom';
import { formatEventDate } from '../../data/events';
import { Chip, StatusChip } from '../ui/Chip';
import Icon from '../ui/Icon';
import Photo from '../ui/Photo';

/** Date · time · venue · audience, each with its icon (only what is known). */
export const EventMeta = ({ event, className = '' }) => {
  const items = [
    { key: 'date', icon: 'calendar', text: formatEventDate(event) },
    { key: 'time', icon: 'clock', text: event.meta?.time },
    { key: 'venue', icon: 'pin', text: event.meta?.venue ?? event.venue },
    { key: 'audience', icon: 'users', text: event.meta?.audience },
  ].filter((m) => m.text);
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-2 ${className}`}>
      {items.map((m) => (
        <li key={m.key} className="inline-flex items-center gap-1.5">
          <Icon name={m.icon} className="size-4 shrink-0 text-ink-2" />
          <span>
            <span className="sr-only">{m.key}: </span>
            {m.text}
          </span>
        </li>
      ))}
    </ul>
  );
};

const SIZES = {
  lead: '(min-width: 1024px) 720px, 100vw',
  feature: '(min-width: 1024px) 680px, (min-width: 640px) 90vw, 100vw',
  standard: '(min-width: 1024px) 420px, (min-width: 640px) 45vw, 100vw',
  compact: '160px',
};

/**
 * Editorial event card. The whole card is one link to the event's page
 * (stretched over the card by the title link), so it is a single tab stop;
 * hover and keyboard focus look the same (lift + photo zoom).
 *
 *   lead      photo beside the text on desktop (the top story), description + figures
 *   feature   large photo above, description included
 *   standard  photo above, no description
 *   compact   thumbnail beside the text (stacked lists)
 */
const EventCard = ({ event, variant = 'standard', headingLevel = 'h3', className = '' }) => {
  const Heading = headingLevel;
  const compact = variant === 'compact';
  const lead = variant === 'lead';
  const long = lead || variant === 'feature';
  const cover = event.photos.find((p) => p.src === event.cover) ?? event.photos[0];

  return (
    <article
      data-reveal
      className={`group relative isolate flex rounded-card border border-line bg-surface transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-standard hover:-translate-y-0.5 hover:border-transparent hover:shadow-raised focus-within:-translate-y-0.5 focus-within:border-transparent focus-within:shadow-raised ${
        compact ? 'items-center gap-4 p-3 sm:gap-5' : `flex-col overflow-hidden ${lead ? 'lg:flex-row' : ''}`
      } ${className}`}
    >
      {cover && (
        <div
          className={`overflow-hidden bg-surface-2 ${
            compact
              ? 'aspect-square w-24 shrink-0 rounded-field sm:w-32'
              : lead
                ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[28rem] lg:w-7/12 lg:shrink-0'
                : variant === 'feature'
                  ? 'aspect-[16/10]'
                  : 'aspect-[4/3]'
          }`}
        >
          <Photo
            src={cover.src}
            alt=""
            sizes={SIZES[variant]}
            className="size-full object-cover transition-transform duration-[var(--dur-slow)] ease-standard group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
          />
        </div>
      )}

      <div className={`flex min-w-0 flex-1 flex-col ${compact ? 'py-1 pr-2' : lead ? 'p-6 sm:p-8 lg:p-10' : 'p-5 sm:p-6'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={event.status} />
          {!compact && <Chip>{event.category}</Chip>}
          {!compact && event.highlight && <StatusChip status="highlight" />}
        </div>

        <Heading className={`mt-3 text-pretty font-semibold text-ink ${lead ? 'text-h2' : variant === 'feature' ? 'text-h3' : compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
          <Link
            to={`/events/${event.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
          >
            {event.title}
          </Link>
        </Heading>

        <EventMeta event={event} className={compact ? 'mt-1.5 text-[0.8125rem]' : 'mt-3'} />

        {long && <p className={`mt-4 text-ink-2 ${lead ? 'line-clamp-5' : 'line-clamp-3'}`}>{event.desc}</p>}

        {lead && event.stats?.length > 0 && (
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5">
            {event.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-xs text-ink-2">{stat.label}</dt>
                <dd className="order-first text-h3 font-bold tabular-nums text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {!compact && event.photos.length > 1 && (
          <p className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
            <Icon name="photo" className="size-4" />
            View photos ({event.photos.length})
            <Icon name="arrow-right" className="size-4 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" />
          </p>
        )}
      </div>
    </article>
  );
};

export default EventCard;
