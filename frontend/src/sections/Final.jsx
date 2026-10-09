import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsap";
import { prefersReducedMotion } from "../animations/motion";
import Loader from "../components/Loader";

const Final = () => {
  // Lets the stylesheet run the closing scene's infinite animation only while
  // it is actually visible (see .bmw-text in styles/legacy.css).
  const sectionRef = useRef(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle("is-in-view", entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    // Reduced motion: no pin/scrub - the closing scene just stays visible.
    if (prefersReducedMotion()) return;

    gsap.set('.final-content', { opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.final',
        start: 'top top',
        end: '90% top',
        scrub: true,
        pin: true,
      }
    })

    const tl = gsap.timeline({ 
      scrollTrigger: {
        trigger: '.final',
        start: 'top 80%',
        end: '90% top',
        scrub: true,
      }
    })

    tl.to('.final-content', { opacity: 1, duration: 1, scale: 1, ease: 'power1.inOut' });
  });

  return (
    <section ref={sectionRef} className="final">
      <div className="final-content size-full flex items-center justify-center">
        <Loader />
      </div>
    </section>
  )
}

export default Final