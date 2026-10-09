import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from './gsap';
import { getMotionTier } from './motion';

/**
 * Section reveals — the site's one entrance pattern (GSAP + ScrollTrigger):
 * elements marked `data-reveal` fade in and rise 20px, in batches with a
 * 70ms stagger, once, as they scroll into view. `data-reveal="image"` adds a
 * slight scale-down for photos.
 *
 * Call it once per page/section with a ref to the scope. Everything is
 * created inside a gsap context and reverted on unmount, so no
 * ScrollTriggers leak between routes. Reduced motion: nothing is hidden or
 * animated.
 */
export const useReveal = (scopeRef, dependencies = []) => {
  useGSAP(
    () => {
      if (getMotionTier() === 'static') return;
      const items = gsap.utils.toArray('[data-reveal]', scopeRef.current);
      if (!items.length) return;

      gsap.set(items, { autoAlpha: 0, y: 20 });
      gsap.set(items.filter((el) => el.dataset.reveal === 'image'), { scale: 0.985 });

      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.07,
            overwrite: true,
            clearProps: 'transform',
          }),
      });
    },
    { scope: scopeRef, dependencies }
  );
};

export default useReveal;
