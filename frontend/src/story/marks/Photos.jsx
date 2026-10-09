/**
 * Real event photography as planes in the world. They sit in the anchor
 * (same frame as the mark) and stay invisible until the community chapter
 * flies them in. Images are only fetched when `on` becomes true (the stage
 * flips it when the visitor nears that part of the page), so nobody pays for
 * photos they never scroll to.
 *
 * Decorative here (the stage is aria-hidden); the same photos are fully
 * described in the Events gallery.
 */
const Photos = ({ srcs = [], on = false }) =>
  srcs.map((src, i) => (
    <div key={src} data-entity={`photo-${i + 1}`} className="story-entity story-photo">
      {on && <img src={src} alt="" decoding="async" draggable="false" />}
    </div>
  ));

export default Photos;
