import { site } from '../../data/site';
import Button from '../ui/Button';
import { Chip, StatusChip } from '../ui/Chip';
import ColorStroke from '../ui/ColorStroke';
import Icon from '../ui/Icon';

/**
 * The featured upcoming event: date emphasised, blue CTA. With no upcoming
 * event the same slot shows a friendly empty state instead.
 */
const UpcomingCard = ({ event, headingLevel = 'h3', className = '' }) => {
  const Heading = headingLevel;

  if (!event) {
    return (
      <div data-reveal className={`flex flex-col justify-center rounded-media border border-dashed border-line-strong bg-surface p-8 sm:p-10 ${className}`}>
        <p className="text-h3 text-ink">Something new is brewing.</p>
        <p className="mt-3 max-w-[48ch] text-ink-2">
          Check back soon for the next GDG ViMEET experience — or follow us so you don’t miss the announcement.
        </p>
        <div className="mt-6">
          <Button href={site.social.instagram} variant="secondary" icon="external" aria-label="Follow GDG ViMEET on Instagram (opens in a new tab)">
            Follow us
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article
      data-reveal
      className={`relative flex flex-col overflow-hidden rounded-media border border-line bg-surface shadow-rest ${className}`}
    >
      <ColorStroke className="h-1 w-full rounded-none" />
      <div className="flex flex-1 flex-col p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status="upcoming" />
          {event.tag && <Chip>{event.tag}</Chip>}
        </div>

        <p className="mt-6 inline-flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong">
          <Icon name="calendar" className="size-4" />
          {event.when}
        </p>
        <Heading className="mt-3 text-h2 text-balance text-ink">{event.title}</Heading>
        <p className="mt-4 max-w-[52ch] text-body-lg text-ink-2">{event.desc}</p>

        {event.venue && (
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-ink-2">
            <Icon name="pin" className="size-4" />
            {event.venue}
          </p>
        )}

        {event.cta && (
          <div className="mt-auto pt-8">
            <Button
              href={event.cta.href.startsWith('http') ? event.cta.href : undefined}
              to={event.cta.href.startsWith('http') ? undefined : event.cta.href}
              icon={event.cta.href.startsWith('http') ? 'external' : 'arrow-right'}
              aria-label={event.cta.href.startsWith('http') ? `${event.cta.label} (opens in a new tab)` : undefined}
            >
              {event.cta.label}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};

export default UpcomingCard;
