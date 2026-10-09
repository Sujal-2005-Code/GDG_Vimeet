import Photos from './Photos';

/**
 * The persistent object on the stage: ONE visual (the real GDG mark, or an
 * image plane).
 *
 *   anchor        positions/scales the whole composition (and the photos)
 *     mark        the object — gives way when the photos take over
 *       core      the object
 *         …the visual…
 *     photo-1…n   event photography
 *
 * `core` is built KX× larger than its design size and the engine divides every
 * authored scale by KX (data-kx), so the browser only ever scales its pixels
 * DOWN — no soft edges when the mark grows for the camera dolly.
 */
export const KX = 1.3;

const Composition = ({ aspect = 1, width = 1, photos = [], photosOn = false, children }) => (
  <div data-entity="anchor" className="story-entity story-anchor">
    <div data-entity="mark" className="story-entity story-box">
      {children && (
        <div
          data-entity="core"
          data-kx={KX}
          data-ky={KX}
          className="story-entity story-core"
          style={{ width: `calc(var(--s) * ${width * KX})`, aspectRatio: aspect }}
        >
          <div className="story-flat">{children}</div>
        </div>
      )}
    </div>

    <Photos srcs={photos} on={photosOn} />
  </div>
);

export default Composition;
