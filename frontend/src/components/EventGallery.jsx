import { useEffect, useState } from 'react';

const EventGallery = ({ title, images, onClose }) => {
  const [index, setIndex] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (index !== null) setIndex(null);
        else onClose();
      } else if (index !== null && e.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % images.length);
      } else if (index !== null && e.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm md:text-base">{title}</h3>
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="inline-flex items-center justify-center size-9 rounded-full text-white hover:bg-white/10 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {index === null ? (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                className="aspect-square overflow-hidden rounded-lg border border-white/10 hover:border-white/30 transition"
              >
                <img src={src} alt={`${title} photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 md:left-6 inline-flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={images[index]}
            alt={`${title} photo ${index + 1}`}
            className="max-h-[75vh] max-w-full object-contain rounded-lg"
          />
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 md:right-6 inline-flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <p className="absolute bottom-4 text-white/60 text-xs">{index + 1} / {images.length}</p>
        </div>
      )}
    </div>
  );
};

export default EventGallery;
