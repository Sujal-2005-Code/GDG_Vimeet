import { useMemo } from 'react';
import Stack from './Stack';
import GlareHover from './GlareHover';

// Stack mounts one <img> per card up front (only the top one is visible),
// so we cap how many of an event's photos go into the live stack to keep
// page weight sane — "View Photos" still opens the full gallery.
const MAX_STACK_PHOTOS = 8;

const EventPhotoStack = ({ images, title }) => {
  const photos = images?.length ? images.slice(0, MAX_STACK_PHOTOS) : [];

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
        autoplayDelay={1200}
        pauseOnHover={true}
        mobileClickOnly={true}
      />
    </GlareHover>
  );
};

export default EventPhotoStack;
