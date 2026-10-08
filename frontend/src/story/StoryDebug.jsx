import { useEffect, useState } from 'react';
import { storyState } from './engine';

/** Add ?story=debug to the URL to see the tier / chapter / progress live. */
const StoryDebug = () => {
  const [snap, setSnap] = useState(storyState);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setSnap({ ...storyState });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed bottom-3 left-3 z-[4000] rounded-field bg-ink/90 px-3 py-2 font-mono text-[11px] leading-relaxed text-white">
      <div>tier: {snap.tier}</div>
      <div>chapter: {snap.chapter ?? '—'}</div>
      <div>progress: {snap.progress.toFixed(3)}</div>
    </div>
  );
};

export default StoryDebug;
