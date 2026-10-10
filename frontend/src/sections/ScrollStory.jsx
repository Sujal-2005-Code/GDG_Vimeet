import { useEffect } from 'react';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import ColorStroke from '../components/ui/ColorStroke';
import { story, studyJams } from '../data/story';
import useMotionTier from '../hooks/useMotionTier';
import { LITE_TRACK_SCALE, storyChapters } from '../story/chapters';

/**
 * The scroll story after the Hero. Every beat is real, readable HTML; the
 * visuals live on the persistent stage (story/) and are choreographed by the
 * chapters in story/chapters.js — one `data-story-chapter` section per
 * chapter, with the same two-column frame as the Hero so the copy stays on
 * the left while the stage plays on the right.
 *
 * Order: TIER 1 / 3 YEARS STRONG → Google Cloud → Cloud Study Jams →
 * 245+ → 107 → 20+ → 4TH COLLEGE TO COMPLETE THE JAMS → event photography.
 *
 * `data-at="0.45"` = that element fades in when the chapter is 45% through.
 * `data-count` = number that counts up the first time it appears (the final
 * value is always in the markup).
 *
 * Copy comes from data/story.js — never edit strings here.
 */
const PINNED = Object.fromEntries(storyChapters.map((c) => [c.id, c.pinned]));
const HERO_OVERLAP = 30; // svh

const Track = ({ id, index, tier, slot = false, children }) => {
  const pinned = PINNED[id] * (tier === 'full' ? 1 : LITE_TRACK_SCALE);
  return (
    <section
      data-story-chapter={id}
      aria-labelledby={`${id}-title`}
      className="story-track relative z-10"
      // Each track is its pinned length plus one viewport, and overlaps the
      // previous track by one viewport so chapters are contiguous. The first
      // track also tucks under the bottom of the hero, so there is no empty
      // screen between the hero's copy leaving and the story's first words.
      style={{ height: `${pinned + 100}svh`, marginTop: index === 0 ? `-${HERO_OVERLAP}svh` : '-100svh' }}
    >
      <div className="story-pin pt-[var(--nav-h)]">
        <Container className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-center md:gap-10">
          <div
            data-story-copy="track"
            className="flex min-h-0 flex-1 flex-col justify-center py-4 md:max-w-[34rem] md:flex-none md:py-0"
          >
            {children}
          </div>
          {/* Same reserved space on every chapter; only the first is measured. */}
          <div
            {...(slot ? { 'data-story-slot': 'story' } : {})}
            aria-hidden="true"
            className="story-slot-space hidden md:block w-full shrink-0 md:h-[min(72svh,36rem)]"
          />
        </Container>
      </div>
    </section>
  );
};

/** One metric per beat — numbers never share the screen at first. */
const Stat = ({ id, index, tier, stat }) => (
  <Track id={id} index={index} tier={tier}>
    <h2 id={`${id}-title`} className="text-ink">
      <span className="sr-only">
        {stat.value}
        {stat.suffix} {stat.label}
      </span>
      <span aria-hidden="true" className="flex items-baseline">
        <span data-at="0.1" className="text-display tabular-nums">
          <span data-count={stat.value} data-count-at="0.12">
            {stat.value}
          </span>
          <span className="text-primary">{stat.suffix}</span>
        </span>
      </span>
      <span aria-hidden="true" data-at="0.22" className="mt-3 block text-h3 font-medium text-ink-2">
        {stat.label}
      </span>
    </h2>
  </Track>
);

const ScrollStory = () => {
  const tier = useMotionTier();
  const [participants, milestones, labs] = studyJams.stats;
  const [tierBadge, yearsBadge] = studyJams.achievements.badges;
  const { milestone } = studyJams.achievements;

  // Reduced motion: no scroll-driven motion, so each chapter just fades in
  // (and eases from 97% size) once, when it first comes into view.
  useEffect(() => {
    if (tier !== 'static' || typeof IntersectionObserver === 'undefined') return undefined;
    const sections = [...document.querySelectorAll('[data-story-chapter]:not([data-story-chapter="hero"])')];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.inView = 'true';
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((s) => {
      s.dataset.reveal = 'ready';
      observer.observe(s);
    });
    return () => {
      observer.disconnect();
      sections.forEach((s) => {
        delete s.dataset.reveal;
        delete s.dataset.inView;
      });
    };
  }, [tier]);

  return (
    <>
      <Track id="tier1" index={0} tier={tier} slot>
        <h2 id="tier1-title" className="text-ink">
          <span data-at="0.08" className="block text-display">
            {tierBadge}
          </span>
          <span data-at="0.32" className="mt-2 block text-h1 text-primary">
            {yearsBadge}
          </span>
        </h2>
        <ColorStroke data-at="0.55" className="mt-6 h-[3px] w-28" />
      </Track>

      <Track id="cloud" index={1} tier={tier}>
        <h2 id="cloud-title" className="text-h1 text-ink">
          {story.cloud.title}
        </h2>
        <ColorStroke data-at="0.35" className="mt-6 h-[3px] w-28" />
      </Track>

      <Track id="jams" index={2} tier={tier}>
        <h2 id="jams-title" className="text-h1 text-balance text-ink">
          {studyJams.title}
        </h2>
        <p data-at="0.3" className="mt-4 max-w-[28rem] text-body-lg text-ink-2">
          {studyJams.lede}
        </p>
      </Track>

      <Stat id="m1" index={3} tier={tier} stat={participants} />
      <Stat id="m2" index={4} tier={tier} stat={milestones} />
      <Stat id="m3" index={5} tier={tier} stat={labs} />

      <Track id="achieve" index={6} tier={tier}>
        <h2 id="achieve-title" className="text-h1 uppercase text-balance text-ink">
          <span data-at="0.1" className="block">
            {milestone}
          </span>
        </h2>
        <ColorStroke data-at="0.4" className="mt-6 h-[3px] w-28" />
      </Track>

      <Track id="community" index={7} tier={tier}>
        <h2 id="community-title" data-at="0.05" className="text-h2 text-balance text-ink">
          {story.community.overline}
        </h2>
        <p data-at="0.25" className="mt-4 max-w-[28rem] text-ink-2">
          {studyJams.credits}
        </p>
        <div data-at="0.5" className="mt-8">
          <Button to={story.community.cta.to} icon="arrow-right">
            {story.community.cta.label}
          </Button>
        </div>
      </Track>
    </>
  );
};

export default ScrollStory;
