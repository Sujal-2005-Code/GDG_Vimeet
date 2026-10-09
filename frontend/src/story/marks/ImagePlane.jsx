/**
 * Image mode for the hero visual (`site.hero.visual.kind === 'image'`): any
 * image — e.g. a real event photo — as a rounded plane in place of the logo.
 * Same orbit, same tilt, same journey; a photo does not spin.
 */
const ImagePlane = ({ src }) => (
  <div className="story-plane">
    <img src={src} alt="" decoding="async" draggable="false" />
  </div>
);

export default ImagePlane;
