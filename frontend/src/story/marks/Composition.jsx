import { ORBIT_DOTS } from '../orbit';
import Photos from './Photos';

/**
 * The persistent object on the stage: ONE visual (the real GDG mark, or an
 * image plane) with a few small accent dots orbiting it.
 *
 *   anchor        positions/scales the whole composition (and the photos)
 *     mark        the object + its orbit — recedes when the photos take over
 *       orbit     the accent dots (positions come from the rig, orbit.js)
 *       core      the object. Tilts in screen space (rx/ry from the poses) —
 *         float     idle breathing (full tier)
 *           spin    rotation driven by scroll (rig.js)
 *             …the visual…
 *     photo-1…n   event photography
 *
 * `core` is built KX× larger than its design size and the engine divides every
 * authored scale by KX (data-kx), so the browser only ever scales its pixels
 * DOWN — no soft edges when the mark grows for the camera dolly.
 */
export const KX = 1.3;

const Composition = ({ aspect, width = 1, photos = [], photosOn = false, children }) => (
  <div data-entity="anchor" className="story-entity story-anchor">
    <div data-entity="mark" className="story-entity story-box">
      <div data-entity="orbit" className="story-entity story-box">
        {ORBIT_DOTS.map((d) => (
          <span
            key={d.key}
            data-dot={d.key}
            className="story-dot"
            style={{ '--c': d.color, '--k': d.size }}
          />
        ))}
      </div>

      {children && (
        <div
          data-entity="core"
          data-kx={KX}
          data-ky={KX}
          className="story-entity story-core"
          style={{ width: `calc(var(--s) * ${width * KX})`, aspectRatio: aspect }}
        >
          <div data-float className="story-flat">
            <div data-spin className="story-flat">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>

    <Photos srcs={photos} on={photosOn} />
  </div>
);

export default Composition;
