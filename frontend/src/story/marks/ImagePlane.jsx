import Photos from './Photos';
import { Dots, Ring, Shadow } from './Satellites';

/**
 * Image mode for the hero visual (`site.hero.visual.kind === 'image'`):
 * any image — e.g. a real event photo — as a rounded plane with the same
 * rings and accent dots around it. Same engine, same journey; the plane is
 * moved/tilted by the same chapters (poses.js lists `plane` for each).
 */
const ImagePlane = ({ src, photos = [], photosOn = false }) => (
  <div data-entity="anchor" className="story-entity gdg-mark">
    <div data-entity="mark" className="story-entity story-box">
      <Shadow />
      <Ring id="ring-a" r0={-18} />
      <Ring id="ring-b" r0={42} />
      <div
        data-entity="plane"
        className="story-entity story-plane"
        style={{ left: '50%', top: '50%', width: '66%', height: '66%' }}
      >
        <img src={src} alt="" decoding="async" draggable="false" />
      </div>
      <Dots />
    </div>

    <Photos srcs={photos} on={photosOn} />
  </div>
);

export default ImagePlane;
