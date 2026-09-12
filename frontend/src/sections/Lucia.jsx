import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Lucia = () => {
  useGSAP(() => {
    gsap.set('.lucia-life', { marginTop: '-80vh'});

    gsap.to('.lucia-life .img-box', {
      scrollTrigger: {
        trigger: '.lucia-life',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -200, duration: 1, ease: 'power1.inOut'
    });
  });

  return (
    <section className="lucia-life">
      {/* Images Section - Responsive Layout */}
      <div className="flex flex-col gap-5 items-end img-box lg:w-1/2 w-full px-4 lg:px-10 mt-96 lg:mt-96 md:mt-48 mt-32">
        <div className="lucia-1 w-full lg:w-auto">
          <img src="/images/lucia-1.webp" alt="GDG Vimeet Community" className="w-full h-auto object-cover" />
        </div>
        <div className="lucia-3 w-full lg:w-auto">
          <img src="/images/lucia-3.webp" alt="GDG Vimeet Activities" className="w-full h-auto object-cover" />
        </div>
      </div>

      {/* Content Section - Responsive Layout */}
      <div className="lg:w-1/2 w-full lucia-life-content px-4 lg:px-0">
        {/* About GDG Vimeet Section */}
        <div className="max-w-xl lg:ps-32 ps-0 mb-8 lg:mb-12">
          <h1 className="text-yellow font-long uppercase text-4xl md:text-6xl lg:text-8xl mb-6 md:mb-8 lg:mb-20 leading-tight">
            About GDG ViMEET
          </h1>
          <p className="text-white text-base md:text-lg lg:text-2xl leading-relaxed md:pe-20 lg:pe-28">
            GDG ViMEET is a student-led developer community that empowers members to learn, create, and innovate. Through workshops, hackathons, study jams, and speaker sessions, we foster a peer-driven environment that encourages skill-building, experimentation, and collaboration.
          </p>
        </div>

        {/* Middle Image */}
        <div className="lucia-2 mb-8 lg:mb-12 w-full">
          <img src="/images/lucia-2.webp" alt="GDG Vimeet Team" className="w-full h-auto object-cover" />
        </div>

        {/* What We Do Section */}
        <div className="max-w-xl lg:ps-32 ps-0 mb-8 lg:mb-12">
          <h1 className="text-yellow font-long uppercase text-4xl md:text-6xl lg:text-8xl mb-6 md:mb-8 lg:mb-20 leading-tight">
            What We Do
          </h1>
          <p className="text-white text-base md:text-lg lg:text-2xl leading-relaxed md:pe-20 lg:pe-28">
            We bring technology to life with practical experiences in Web, Mobile, Cloud, and AI/ML. Our members participate in project-based workshops, team challenges, and mentorship programs that help them grow as developers and leaders.
          </p>
        </div>

        {/* Join GDG Teams Recruitment Callout */}
        <div className="max-w-xl lg:ps-32 ps-0">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-md">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#00AEEF] block mb-1">
              Recruitment 2025-26
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Ready to Join GDG ViMEET?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4">
              We are actively hiring for <strong>Content & Media, Event Management, PR, Technical, and Graphics</strong> teams. Step up and make an impact!
            </p>
            <a
              href="/join"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0066B1] via-[#00AEEF] to-[#E60C2C] px-6 py-3 text-sm font-bold text-white hover:opacity-95 transition shadow-lg"
            >
              Apply for GDG Teams
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Lucia