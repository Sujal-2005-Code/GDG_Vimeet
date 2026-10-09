/**
 * Every `public/events/<slug>/<n>.webp` has `-480` and `-960` copies
 * (scripts/make-image-variants.mjs). These helpers build the `srcset`
 * for such a photo; any other image path returns undefined / itself.
 */
const VARIANT = /^(\/events\/[^/]+\/\d+)\.webp$/;

export const photoSrcSet = (src) => {
  const m = src?.match(VARIANT);
  return m ? `${m[1]}-480.webp 480w, ${m[1]}-960.webp 960w, ${src} 1600w` : undefined;
};

/** The `src` fallback: the 960px copy for event photos, the path itself otherwise. */
export const photoDefaultSrc = (src) => {
  const m = src?.match(VARIANT);
  return m ? `${m[1]}-960.webp` : src;
};
