import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useMotionTier from '../hooks/useMotionTier';
import { buildStory } from './engine';
import StoryDebug from './StoryDebug';
import StoryStage from './StoryStage';

/**
 * Wrap the page that hosts the journey. Renders the persistent stage and
 * (re)builds the scroll timelines whenever the motion tier or the viewport
 * width changes. All timelines/triggers are created inside one gsap.context
 * and reverted on cleanup, so nothing leaks between routes.
 */
const StoryRoot = ({ children }) => {
  const tier = useMotionTier();
  const rootRef = useRef(null);
  const [epoch, setEpoch] = useState(0);

  // Layout effect: measure + place pieces before the first paint (no flash).
  useLayoutEffect(() => {
    const story = buildStory({ root: rootRef.current, tier });
    return () => story.destroy();
  }, [tier, epoch]);

  // Rebuild on width change (not height — mobile toolbars change height
  // constantly) and once webfonts settle, since text height moves the slot.
  useEffect(() => {
    let width = window.innerWidth;
    let timer = 0;
    const rebuild = () => setEpoch((e) => e + 1);
    const onResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.innerWidth !== width) {
          width = window.innerWidth;
          rebuild();
        }
      }, 200);
    };
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(rebuild);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const debug = new URLSearchParams(window.location.search).get('story') === 'debug';

  return (
    <div ref={rootRef} className="story-root" data-tier={tier}>
      <StoryStage tier={tier} />
      {children}
      {debug && <StoryDebug />}
    </div>
  );
};

export default StoryRoot;
