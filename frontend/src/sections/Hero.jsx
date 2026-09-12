import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
      .to('.fade-out', { opacity: 0, ease: 'power2.out', duration: 0.8 })
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
        <img src="/images/hero-text.webp" alt="hero-logo" className="title-logo fade-out" />
        <img  src="/images/watch-trailer.png" alt="trailer" className="trailer-logo fade-out" />
        <div className="play-img fade-out">
          <img src="/images/play.png" alt="play" className="w-7 ml-1" />
        </div>
      </div>

      <div>
        <img src="/images/big-hero-text.svg" alt="logo" className="size-full object-cover mask-logo" />
      </div>

      

      <ComingSoon />
    </section>
  )
}

export default Hero