import { site } from '../data/site';
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

  return (
    <div data-story-stage className="story-stage" aria-hidden="true">
      <MarkDefs />
      <div data-story-parallax className="story-layer">
        <div data-story-world className="story-layer">
          {kind === 'image' ? <ImagePlane src={src} /> : <GdgMark slices={slices} />}
        </div>
      </div>
    </div>
  );
};

export default StoryStage;
