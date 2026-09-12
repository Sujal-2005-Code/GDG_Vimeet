import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from '../components/Footer';
import EventGallery from '../components/EventGallery';
import { animateHeading, animateTextReveal, animateCards, animateCardsOut } from '../animations';
import { upcomingEvents, pastEvents, eventCategories } from '../data/events';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const PinIcon = () => (
  <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GalleryIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FeaturedEventCard = ({ event }) => (
  <div className="up-next-card group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-7 md:p-12 shadow-2xl">
    <div
      aria-hidden
      className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-google-blue via-google-green to-google-yellow opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-30"
    />
    <div className="relative">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/15 bg-white/5 text-white/80">
          {event.tag}
        </span>
        <span className="text-xs text-white/50 font-mono">{event.when}</span>
      </div>
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-4 max-w-2xl">
        {event.title}
      </h2>
      <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-xl mb-6">
        {event.desc}
      </p>
      <div className="flex items-center gap-2 text-xs md:text-sm text-white/60 mb-8">
        <PinIcon />
        {event.venue}
      </div>
      {event.cta && (
        <a
          href={event.cta.href}
          target={event.cta.href.startsWith('http') ? '_blank' : '_self'}
          rel="noreferrer"
          className="btn-primary group/btn"
        >
          {event.cta.label}
          <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </a>
      )}
    </div>
  </div>
);

const EmptyUpNext = () => (
  <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
    <p className="text-white text-xl md:text-2xl font-semibold mb-2">Something new is brewing.</p>
    <p className="text-white/60 text-sm md:text-base max-w-md mx-auto mb-6">
      Check back soon for the next GDG ViMEET experience — or follow us so you don't miss the announcement.
    </p>
    <a
      href="https://www.instagram.com/gdgvimeet/"
      target="_blank"
      rel="noreferrer"
      className="btn-secondary"
    >
      Follow the Journey
    </a>
  </div>
);

const PastEventCard = ({ item, onView }) => (
  <div className="past-event-card group relative rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/25 transition-colors duration-300 overflow-hidden shadow-lg flex flex-col">
    {item.cover && (
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 text-white/90">
          {item.category}
        </span>
        <span className="absolute bottom-3 left-3 text-[11px] text-white/80 font-mono">{item.date}</span>
      </div>
    )}
    <div className="p-5 flex flex-col flex-1 justify-between">
      <div>
        <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
        <p className="text-white/70 text-sm mt-2 leading-relaxed">{item.desc}</p>
      </div>
      {item.gallery?.length > 0 && (
        <button
          type="button"
          onClick={() => onView(item)}
          className="group/btn mt-4 inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition self-start"
        >
          <GalleryIcon />
          View Photos ({item.gallery.length})
          <ArrowIcon className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      )}
    </div>
  </div>
);

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedCategory, setDisplayedCategory] = useState('All');
  const [galleryEvent, setGalleryEvent] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const pillRefs = useRef({});
  const pastSectionRef = useRef(null);
  const hasRevealedPast = useRef(false);
  const isFirstRender = useRef(true);

  const filteredPast = useMemo(
    () => pastEvents.filter((e) => displayedCategory === 'All' || e.category === displayedCategory),
    [displayedCategory]
  );

  // Hero entrance
  useEffect(() => {
    animateTextReveal('.events-eyebrow', { split: 'words' });
    // split: false — char-splitting breaks the gradient-text-google background-clip
    animateHeading('.events-heading', { split: false });
    animateCards('.up-next-card', { delay: 150 });
  }, []);

  // Reveal past-events grid the first time it scrolls into view
  useEffect(() => {
    const el = pastSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealedPast.current) {
          hasRevealedPast.current = true;
          animateCards('.past-event-card');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Re-animate cards in whenever the displayed (post-transition) set changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!hasRevealedPast.current) return;
    const id = requestAnimationFrame(() => animateCards('.past-event-card'));
    return () => cancelAnimationFrame(id);
  }, [displayedCategory]);

  // Slide the filter-pill indicator under the active category
  useEffect(() => {
    const el = pillRefs.current[activeCategory];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeCategory]);

  const handleCategoryChange = async (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    if (!prefersReducedMotion() && hasRevealedPast.current) {
      animateCardsOut('.past-event-card');
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    setDisplayedCategory(cat);
  };

  return (
    <main>
      <NavBar />

      <div className="black-gradient-bg min-h-dvh">
        <div className="md:max-w-6xl mx-auto md:px-8 px-5">
          <nav className="relative md:static md:top-auto md:left-auto md:w-auto md:px-0 !px-0 !pt-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li className="opacity-60">/</li>
              <li className="text-white">Events</li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <header className="relative overflow-hidden pt-16 md:pt-24 pb-12 md:pb-16 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="events-blob absolute -top-20 -left-16 w-64 h-64 md:w-80 md:h-80 rounded-full bg-google-blue/20 blur-3xl" />
            <div className="events-blob events-blob-delay absolute top-4 right-0 w-72 h-72 md:w-96 md:h-96 rounded-full bg-google-red/15 blur-3xl" />
            <div className="events-blob events-blob-delay2 absolute bottom-0 left-1/3 w-56 h-56 md:w-72 md:h-72 rounded-full bg-google-yellow/15 blur-3xl" />
          </div>

          <p className="events-eyebrow text-white/60 text-xs md:text-sm uppercase tracking-[0.3em] mb-3">
            What&apos;s Happening
          </p>
          <h1 className="events-heading inline-block mx-auto text-[2.4rem] md:text-[4rem] lg:text-[4.5rem] font-round-bold !font-extrabold leading-[1.05] gradient-text-google">
            Explore Events
          </h1>
          <p className="text-white/70 max-w-xl mx-auto mt-4 text-sm md:text-base px-4">
            Workshops, hackathons, and community experiences built for people who want to learn, create, and grow together.
          </p>
        </header>

        {/* Up Next / Featured */}
        <section className="relative z-10 pb-14 md:pb-20">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-google-green animate-pulse" />
              <span className="text-xs md:text-sm uppercase tracking-widest text-white/60">Up Next</span>
            </div>

            {upcomingEvents.length === 0 ? (
              <EmptyUpNext />
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                <FeaturedEventCard event={upcomingEvents[0]} />
                {upcomingEvents.length > 1 && (
                  <div className="flex flex-col gap-4">
                    {upcomingEvents.slice(1).map((e, i) => (
                      <div
                        key={i}
                        className="up-next-card rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition p-5"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-white/60 text-xs font-mono">{e.when}</span>
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${e.tagColor}`}>
                            {e.tag}
                          </span>
                        </div>
                        <h3 className="text-white text-lg font-semibold">{e.title}</h3>
                        <p className="text-white/75 text-sm mt-2 leading-relaxed">{e.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Past Events / Archive */}
        <section ref={pastSectionRef} className="md:py-12 py-8">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs md:text-sm uppercase tracking-widest text-white/60">From the Community Archive</span>
                <h2 className="text-yellow font-long uppercase md:text-4xl text-3xl mt-1">Past Events &amp; Sessions</h2>
              </div>

              {/* Category Filter Pills with sliding indicator */}
              <div className="relative inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 p-1 overflow-x-auto max-w-full">
                <span
                  aria-hidden
                  className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-out"
                  style={{ left: indicator.left, width: indicator.width }}
                />
                {eventCategories.map((cat) => (
                  <button
                    key={cat}
                    ref={(el) => { pillRefs.current[cat] = el; }}
                    onClick={() => handleCategoryChange(cat)}
                    aria-pressed={activeCategory === cat}
                    className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                      activeCategory === cat ? 'text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredPast.length === 0 ? (
              <p className="text-center text-white/50 text-sm py-10">No sessions in this category yet.</p>
            ) : (
              <div
                className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${
                  filteredPast.length === 1 ? 'lg:grid-cols-1' : ''
                }`}
              >
                {filteredPast.map((item) => (
                  <div key={item.title} className={filteredPast.length === 1 ? 'md:max-w-md' : ''}>
                    <PastEventCard item={item} onView={setGalleryEvent} />
                  </div>
                ))}
              </div>
            )}

            <p className="text-center text-xs text-white/40 mt-6 italic">
              * Note: More past event galleries, recordings, and speaker highlights will be updated shortly!
            </p>
          </div>
        </section>

        {/* Recruitment & Propose Session CTA Banner */}
        <section className="py-12">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-google-blue/20 via-google-green/20 to-google-yellow/20 p-6 md:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white mb-3">
                  🚀 GDG ViMEET 2026-27 Recruitment
                </span>
                <h3 className="text-white md:text-3xl text-2xl font-bold">
                  Want to organize, design, or speak at our next big event?
                </h3>
                <p className="text-white/80 mt-3 text-sm sm:text-base leading-relaxed">
                  Join our Technical, Event Management, Graphics & Design, PR & Outreach, or Content & Social Media teams and take your campus leadership to the next level.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Link to="/join" className="btn-primary">
                    Apply for GDG Teams
                  </Link>
                  <a href="mailto:gdgvimeet@gmail.com" className="btn-secondary">
                    Propose a Workshop / Talk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {galleryEvent && (
        <EventGallery
          title={galleryEvent.title}
          images={galleryEvent.gallery}
          onClose={() => setGalleryEvent(null)}
        />
      )}
    </main>
  );
};

export default Events;
