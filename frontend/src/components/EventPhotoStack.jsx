import { useMemo } from 'react';
import Stack from './Stack';
import GlareHover from './GlareHover';

// How long each photo stays on top before the stack advances, for every event.
const PHOTO_INTERVAL_MS = 1800;

const EventPhotoStack = ({ images, title }) => {
  const photos = images?.length ? images : [];

  // `cards` must stay referentially stable across re-renders (Stack resets
  // its internal order whenever this array identity changes), so this is
  // memoized on the underlying photo list rather than rebuilt every render.
  const cards = useMemo(
    () =>
      photos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} — photo ${i + 1}`}
          className="card-image"
          loading={i === 0 ? undefined : 'lazy'}
          draggable={false}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos.join('|'), title]
  );

  if (!cards.length) return null;

  return (
    <GlareHover
      width="100%"
      height="100%"
      background="transparent"
      borderColor="transparent"
      borderRadius="20px"
      glareColor="#ffffff"
      glareOpacity={0.35}
      glareAngle={-45}
      glareSize={250}
      transitionDuration={650}
      // The Stack's fanned-out cards intentionally peek outside the top
      // card's own bounds — GlareHover's default overflow:hidden would clip
      // that. The glare gradient itself fades to transparent at its edges,
      // so it needs no clipping to look correct.
      style={{ overflow: 'visible' }}
    >
      <Stack
        cards={cards}
        randomRotation={false}
        sensitivity={200}
        sendToBackOnClick={true}
        autoplay={true}
        autoplayDelay={PHOTO_INTERVAL_MS}
        pauseOnHover={true}
        mobileClickOnly={true}
      />
    </GlareHover>
  );
};

export default EventPhotoStack;
