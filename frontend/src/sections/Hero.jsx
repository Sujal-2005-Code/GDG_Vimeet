import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

import { useMaskSettings } from '../../constants';
import ComingSoon from "./ComingSoon"

const Hero = () => {
  const { initialMaskPos, initialMaskSize, maskPos, maskSize } = useMaskSettings();

  useGSAP(() => {
    gsap.set('.mask-wrapper', {
      maskPosition: initialMaskPos,
      WebkitMaskPosition: initialMaskPos,
      maskSize: initialMaskSize,
      WebkitMaskSize: initialMaskSize,
    });

    gsap.set('.mask-logo', { marginTop: '-100vh', opacity: 0 });

    gsap.set('.entrance-message', { marginTop: '0vh' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        scrub: 2.5,
        end: '+=100%',
        pin: true,
      }
    })

    tl
      // autoAlpha (not opacity) so the faded-out CTAs also stop receiving clicks
      .to('.fade-out', { autoAlpha: 0, ease: 'power2.out', duration: 0.8 })
      .to('.scale-out', { scale: 1, ease: 'power2.out', duration: 1.2 })
      .to('.mask-wrapper', {
        maskSize,
        WebkitMaskSize: maskSize,
        maskPosition: maskPos,
        WebkitMaskPosition: maskPos,
        ease: 'power3.out',
        duration: 2
      }, '<')
      // gentle fade after mask finishes to avoid a pop
      .to('.mask-wrapper', { opacity: 0, ease: 'power1.out', duration: 0.8 })
      // remove the SVG mask and hide the big-hero SVG image once shrink completes
      .set('.mask-wrapper', { maskImage: 'none', WebkitMaskImage: 'none' })
      .set('.mask-logo', { display: 'none' })

      .to('.entrance-message', { duration: 1, ease: 'power2.out', maskImage: 'radial-gradient(circle at 50% 0vh, black 0%, transparent 100%)' }, '<')
  });

  return (
    <section className="hero-section">
      <div className="size-full mask-wrapper">
        {/* Desktop Video */}
        <video
          src="/videos/herovideo.mp4"
          className="scale-out hidden md:block"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Mobile Video */}
        <video
          src="/videos/newbmw.mp4"
          className="scale-out block md:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-headline fade-out">
          <p className="hero-eyebrow">GDG ViMEET 2026-27</p>
          <h1 className="hero-title">
            Build. Create.
            <br />
            Connect. Go Beyond.
          </h1>
          <p className="hero-subtitle">
            A community of developers, designers, creators, and innovators at ViMEET.
          </p>
          <div className="hero-ctas">
            <Link to="/#about" className="btn-primary">Explore GDG</Link>
            <Link to="/join" className="btn-secondary">Join Us</Link>
          </div>

          <div className="pointer-events-none absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/70 [@media(max-height:560px)]:hidden">
            <span className="text-[11px] md:text-xs uppercase tracking-[0.25em]">Scroll to explore</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        {/* Invisible until the scroll reveal, but pulled up over the hero by
            a negative margin — it must not intercept clicks on the CTAs. */}
        <img src="/images/big-hero-text.svg" alt="logo" className="size-full object-cover mask-logo pointer-events-none" />
      </div>



      <ComingSoon />
    </section>
  )
}

export default Hero
