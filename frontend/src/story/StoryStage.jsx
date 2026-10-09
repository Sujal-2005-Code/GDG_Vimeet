import { useEffect, useState } from 'react';
import { site } from '../data/site';
import { studyJams } from '../data/story';
import GdgMark, { MarkDefs } from './marks/GdgMark';
import ImagePlane from './marks/ImagePlane';
import './story.css';

/**
 * The persistent stage. Decorative only (aria-hidden): every word on the
 * page is real HTML above it. The hero visual is chosen by data
 * (site.hero.visual.kind), so swapping it never touches the engine.
 */
const StoryStage = ({ tier }) => {
  const { kind, src } = site.hero.visual;
  const slices = tier === 'full' ? 3 : 1;
  const photos = studyJams.photos.slice(0, tier === 'full' ? 4 : 3);

  // Fetch the event photos only once the visitor is within ~one screen of
  // the part of the page that uses them.
  const [photosOn, setPhotosOn] = useState(false);
  useEffect(() => {
    const target = document.querySelector('[data-story-chapter="achieve"]');
    if (!target || typeof IntersectionObserver === 'undefined') {
      setPhotosOn(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhotosOn(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100% 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div data-story-stage className="story-stage" aria-hidden="true">
      <MarkDefs />
      <div data-story-parallax className="story-layer">
        <div data-story-world className="story-layer">
          {kind === 'image' ? (
            <ImagePlane src={src} photos={photos} photosOn={photosOn} />
          ) : (
            <GdgMark slices={slices} photos={photos} photosOn={photosOn} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryStage;
