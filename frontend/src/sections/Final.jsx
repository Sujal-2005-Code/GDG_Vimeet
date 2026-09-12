import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Loader from "../components/Loader";

const Final = () => {

  useGSAP(() => {
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
    <section className="final">
      <div className="final-content size-full flex items-center justify-center">
        <Loader />
      </div>
    </section>
  )
}

export default Final