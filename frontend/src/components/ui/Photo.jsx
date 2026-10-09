import { photoDefaultSrc, photoSrcSet } from '../../lib/photo';

/**
 * An event photo with responsive sources, so the browser downloads roughly
 * the size it displays — a 300px card no longer pulls a 1600px original.
 * `sizes` describes the rendered width (CSS `sizes` syntax); pass it
 * accurately for the layout. Other images are passed through untouched.
 */
const Photo = ({ src, alt, sizes = '100vw', loading = 'lazy', className = '', ...rest }) => {
  const srcSet = photoSrcSet(src);
  return (
    <img
      src={photoDefaultSrc(src)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable="false"
      className={className}
      {...rest}
    />
  );
};

export default Photo;
