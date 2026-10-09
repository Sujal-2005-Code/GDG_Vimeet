import { lazy, Suspense, useEffect, useState } from 'react';
import usePageMeta from './hooks/usePageMeta';
import Hero from './sections/Hero';
import ScrollStory from './sections/ScrollStory';
import StoryRoot from './story/StoryRoot';

// Everything below the scroll story loads AFTER the Hero has painted, so the
// first screen (and LCP) never waits on JavaScript for content that is
// off-screen.
const HomeSections = lazy(() => import('./sections/HomeSections'));

const whenIdle = (callback) =>
  typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(callback, { timeout: 1200 })
    : window.setTimeout(callback, 200);

const cancelIdle = (id) =>
  typeof window.cancelIdleCallback === 'function'
    ? window.cancelIdleCallback(id)
    : window.clearTimeout(id);

/** The home page. NavBar, Footer and chat come from RootLayout. */
const App = () => {
  usePageMeta();

  // A deep link (e.g. /#about) needs the sections right away; otherwise wait
  // for the browser to be idle after first paint.
  const [belowFoldReady, setBelowFoldReady] = useState(() => Boolean(window.location.hash));

  useEffect(() => {
    if (belowFoldReady) return undefined;
    const id = whenIdle(() => setBelowFoldReady(true));
    return () => cancelIdle(id);
  }, [belowFoldReady]);

  return (
    <StoryRoot>
      <main id="main">
        <Hero />
        <ScrollStory />

        {/* Solid and above the fixed story stage. The minimum height keeps the
            footer off-screen until the sections arrive. */}
        <div className="relative z-10 min-h-[160svh] bg-surface">
          {belowFoldReady && (
            <Suspense fallback={null}>
              <HomeSections />
            </Suspense>
          )}
        </div>
      </main>
    </StoryRoot>
  );
};

export default App;
