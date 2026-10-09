import { useState } from 'react';
import Section from '../../components/layout/Section';
import Lightbox from '../../components/ui/Lightbox';
import Photo from '../../components/ui/Photo';
import SectionHeader from '../../components/ui/SectionHeader';
import TextLink from '../../components/ui/TextLink';
import { moments } from '../../data/events';

// Bento layout: 4 columns × 3 rows from `sm` (12 cells: one 2×2, one 1×2,
// six singles); 2 columns on phones, where the last tile is dropped so the
// grid ends on a full row.
const SPANS = ['sm:col-span-2 sm:row-span-2', '', 'sm:row-span-2', '', '', '', '', 'max-sm:hidden'];

/** A strip of real photos from every event; any tile opens the viewer. */
const Moments = () => {
  const [index, setIndex] = useState(null);

  return (
    <Section id="moments" labelledBy="moments-title" tone="tint">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader id="moments-title" overline="Moments" title="From our events" />
        <div data-reveal>
          <TextLink to="/events" icon="arrow-right">
            Every gallery
          </TextLink>
        </div>
      </div>

      <ul className="mt-12 lg:mt-14 grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4 sm:gap-4 lg:auto-rows-[13rem]">
        {moments.map((photo, i) => (
          <li key={photo.src} data-reveal="image" className={`${SPANS[i] ?? ''} ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.focus();
                setIndex(i);
              }}
              className="group relative block size-full overflow-hidden rounded-card bg-surface"
            >
              <Photo
                src={photo.src}
                alt={photo.alt}
                sizes={i === 0 ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 640px) 25vw, 50vw'}
                className="size-full object-cover transition-transform duration-[var(--dur-slow)] ease-standard group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
              />
              <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-surface/95 px-3 py-1 text-xs font-medium text-ink shadow-rest">
                {photo.event.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox title="Moments" photos={moments} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </Section>
  );
};

export default Moments;
