import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../data/site';
import { footerNavItems } from '../data/navigation';

const Footer = () => {
  const footerRef = useRef(null);
  const textRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const text = textRef.current;
    const glow = glowRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(text,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(glow,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.6"
    );

    gsap.to(glow, {
      opacity: 0.3,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    const handleMouseEnter = () => {
      gsap.to(text, { scale: 1.02, duration: 0.3, ease: "power2.out" });
      gsap.to(glow, { opacity: 0.8, scale: 1.2, duration: 0.3, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(text, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(glow, { opacity: 0.3, scale: 1, duration: 0.3, ease: "power2.out" });
    };

    footer.addEventListener('mouseenter', handleMouseEnter);
    footer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      footer.removeEventListener('mouseenter', handleMouseEnter);
      footer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full py-12 md:py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        borderTop: '2px solid transparent',
        borderImage: 'linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335) 1'
      }}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.05) 50%, rgba(234, 67, 53, 0.1) 100%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(66, 133, 244, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(66, 133, 244, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 text-center">
        <div ref={textRef} className="space-y-4">
          <div className="space-y-2">
            <h3
              className="text-2xl md:text-3xl font-bold font-round-bold"
              style={{
                background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '2px'
              }}
            >
              {site.name}
            </h3>

            <p className="text-lg md:text-xl text-white/80 font-medium" style={{ letterSpacing: '1px' }}>
              {site.tagline}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-google-blue to-transparent flex-1 max-w-20" />
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                boxShadow: '0 0 20px rgba(66, 133, 244, 0.6)',
                animation: 'spin 3s linear infinite'
              }}
            />
            <div className="h-px bg-gradient-to-r from-transparent via-google-red to-transparent flex-1 max-w-20" />
          </div>

          <p className="text-sm md:text-base text-white/70 italic">
            Google Developer Groups on Campus • {site.institute.shortName} • {site.chapterYear}
          </p>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-center space-x-6 mb-3">
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-white/70 hover:text-google-blue transition-colors duration-300"
                title="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>

              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-white/70 hover:text-google-red transition-colors duration-300"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 my-4 text-xs sm:text-sm text-white/70">
              {footerNavItems.map((item, i) => (
                <span key={item.path} className="flex items-center gap-4">
                  <a
                    href={item.path}
                    className={
                      item.highlight
                        ? 'text-google-green font-semibold hover:underline'
                        : item.muted
                        ? 'text-white/40 hover:text-white transition text-xs'
                        : 'hover:text-white transition'
                    }
                  >
                    {item.label}
                  </a>
                  {i < footerNavItems.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>

            <p className="text-xs md:text-sm text-white/50 uppercase tracking-wider" style={{ letterSpacing: '3px' }}>
              {site.institute.shortName} • {site.chapterYear}
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335)',
          boxShadow: '0 0 20px rgba(66, 133, 244, 0.8)',
          filter: 'blur(1px)'
        }}
      />
    </footer>
  );
};

export default Footer;
