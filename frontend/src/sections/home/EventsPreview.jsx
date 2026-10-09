import EventCard from '../../components/events/EventCard';
import UpcomingCard from '../../components/events/UpcomingCard';
import Section from '../../components/layout/Section';
import SectionHeader from '../../components/ui/SectionHeader';
import TextLink from '../../components/ui/TextLink';
import { pastEvents, upcomingEvents } from '../../data/events';

/**
 * Events on the home page — editorial, not a uniform grid: the featured
 * upcoming event large on the left, the three most recent past events
 * stacked on the right.
 */
const EventsPreview = () => (
  <Section id="events" labelledBy="events-title">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <SectionHeader
        id="events-title"
        overline="Events"
        title="Workshops, hackathons and study jams"
        lede="What’s coming up next, and the most recent things we’ve done together."
      />
      <div data-reveal>
        <TextLink to="/events" icon="arrow-right" stroke>
          See all events
        </TextLink>
      </div>
    </div>

    <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-6">
      <UpcomingCard event={upcomingEvents[0]} className="lg:col-span-7" />
      <div className="flex flex-col gap-4 lg:col-span-5">
        <p data-reveal className="font-mono text-overline font-medium uppercase text-ink-2">
          Recently
        </p>
        {pastEvents.slice(0, 3).map((event) => (
          <EventCard key={event.slug} event={event} variant="compact" />
        ))}
      </div>
    </div>
  </Section>
);

export default EventsPreview;
