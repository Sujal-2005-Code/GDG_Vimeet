import { lazy, Suspense, useEffect, useState } from 'react';
import NavBar from './components/layout/NavBar';
import Footer from './components/Footer';
import StoryRoot from './story/StoryRoot';
import Hero from './sections/Hero';

// Everything below the Hero loads AFTER the Hero has painted, so the first
// screen (and LCP) never waits on JavaScript for content that is off-screen.
// This is the pattern the redesigned chapters will follow too. Right now the
// lazy module is the pre-redesign dark sections (see sections/LegacyHome.jsx).
const LegacyHome = lazy(() => import('./sections/LegacyHome'));

const whenIdle = (callback) =>
  typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(callback, { timeout: 1200 })
    : window.setTimeout(callback, 200);

const cancelIdle = (id) =>
  typeof window.cancelIdleCallback === 'function'
    ? window.cancelIdleCallback(id)
    : window.clearTimeout(id);

const App = () => {
  // A deep link (e.g. /#about) needs the sections right away; otherwise wait
  // for the browser to be idle after first paint.
  const [belowFoldReady, setBelowFoldReady] = useState(() => Boolean(window.location.hash));

  useEffect(() => {
    if (belowFoldReady) return undefined;
    const id = whenIdle(() => setBelowFoldReady(true));
    return () => cancelIdle(id);
  }, [belowFoldReady]);

  return (
    <>
      <NavBar />
      <StoryRoot>
        <main id="main">
          <Hero />

          {/* Placeholder keeps the page scrollable (and the footer off-screen)
              until the lazy sections arrive. */}
          <div className="legacy-dark legacy-home min-h-[160svh]">
            {belowFoldReady && (
              <Suspense fallback={null}>
                <LegacyHome />
              </Suspense>
            )}
          </div>
        </main>

        <div className="relative z-20">
          <Footer />
        </div>
      </StoryRoot>
    </>
  );
};

export default App;
