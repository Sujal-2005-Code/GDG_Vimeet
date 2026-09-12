import { useEffect, useRef } from 'react';
import { animateCards } from '../animations';

const CATEGORIES = [
  { name: 'Technology', emoji: '💻' },
  { name: 'AI', emoji: '🤖' },
  { name: 'Web & App Dev', emoji: '🌐' },
  { name: 'Cloud', emoji: '☁️' },
  { name: 'Design', emoji: '🎨' },
  { name: 'Graphics', emoji: '🖌️' },
  { name: 'Content & Social', emoji: '📱' },
  { name: 'PR & Outreach', emoji: '🤝' },
  { name: 'Events', emoji: '🎤' },
  { name: 'Entrepreneurship', emoji: '🚀' },
  { name: 'Community', emoji: '👥' },
  { name: 'Innovation', emoji: '💡' },
];

const GoBeyondCode = () => {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCards('.go-beyond-card');
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 md:py-20 py-14">
      <div className="md:max-w-6xl mx-auto md:px-16 px-5">
        <div className="text-center mb-10">
          <p className="text-white/70 md:text-base text-sm">Wherever your interests lie</p>
          <h2 className="md:text-[2.6rem] text-[1.9rem] font-round-bold !font-extrabold gradient-text-google">
            Go Beyond Code
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mt-3 text-sm md:text-base">
            GDG ViMEET isn&apos;t just for programmers. Whatever you're into, there's a place for you here.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="go-beyond-card card text-center">
              <div className="text-3xl md:text-4xl mb-2">{cat.emoji}</div>
              <p className="text-white text-sm md:text-base font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoBeyondCode;
