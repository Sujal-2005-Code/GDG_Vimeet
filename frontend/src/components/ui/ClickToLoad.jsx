import { useState } from 'react';
import Button from './Button';

/**
 * Third-party embed (Google Forms, Google Maps) that loads only when the
 * visitor asks for it. Until then nothing is requested — no third-party
 * scripts or cookies — and there is a plain link as the no-embed fallback.
 */
const ClickToLoad = ({ title, src, label, openHref, openLabel, className = '', iframeClassName = '', ...iframeProps }) => {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return <iframe src={src} title={title} className={`size-full border-0 ${iframeClassName}`} {...iframeProps} />;
  }

  return (
    <div className={`flex size-full flex-col items-center justify-center gap-3 bg-surface-2 p-6 text-center ${className}`}>
      <p className="max-w-[34ch] text-sm text-ink-2">
        {title} is provided by Google and loads only when you choose to open it.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" onClick={() => setLoaded(true)}>
          {label}
        </Button>
        {openHref && (
          <Button size="sm" variant="text" href={openHref} icon="external" aria-label={`${openLabel} (opens in a new tab)`}>
            {openLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClickToLoad;
