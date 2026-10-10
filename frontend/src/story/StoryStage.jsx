import { useEffect, useState } from 'react';
import { site } from '../data/site';
import { studyJams } from '../data/story';
import Composition from './marks/Composition';
import DiamondMark from './marks/DiamondMark';
import ImagePlane from './marks/ImagePlane';

import './story.css';

/**
 * The persistent stage. Decorative only (aria-hidden): every word on the
 * page is real HTML above it. The visual is chosen by data
 * (site.hero.visual.kind), so swapping it never touches the engine:
 *   'mark'  the four-diamond GDG mark (marks/DiamondMark.jsx)
 *   'image' any image as a plane
 */
const StoryStage = ({ tier }) => {
  const { kind, src } = site.hero.visual;
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

  const asImage = kind === 'image';

  return (
    <div data-story-stage data-visual-kind={asImage ? 'image' : 'mark'} className="story-stage hidden md:block" aria-hidden="true">
      <Composition
        width={asImage ? 0.66 : 0.92}
        photos={photos}
        photosOn={photosOn}
      >
        {asImage ? <ImagePlane src={src} /> : <DiamondMark />}
      </Composition>
    </div>
  );
};

export default StoryStage;
