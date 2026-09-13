import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animateCards } from '../animations';

const Lucia = () => {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCards('.about-reveal');
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative z-10 md:py-24 py-16 scroll-mt-24">
      <div className="md:max-w-6xl mx-auto md:px-16 px-5">
        {/* About Us */}
        <div className="about-reveal grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 md:mb-20">
          <div>
            <p className="text-white/70 md:text-base text-sm mb-2">About Us</p>
            <h2 className="font-round-bold !font-extrabold uppercase text-3xl md:text-5xl gradient-text-google mb-5 leading-tight">
              More Than A Coding Community
            </h2>
            <p className="text-white/85 text-base md:text-lg leading-relaxed">
              GDG ViMEET is a student-led developer community that empowers members to learn, create, and innovate. Through workshops, hackathons, study jams, and speaker sessions, we bring together technology, creativity, leadership, and collaboration in one place.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/events/git-github-workshop/13.webp"
              alt="GDG ViMEET members at the Git & GitHub Workshop"
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>

        {/* What We Do */}
        <div className="about-reveal max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <h2 className="font-round-bold !font-extrabold uppercase text-2xl md:text-4xl gradient-text-google mb-5 leading-tight">
            What We Do
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed">
            We bring technology to life with practical experiences in Web, Mobile, Cloud, and AI/ML. Our members participate in project-based workshops, team challenges, innovation labs, and mentorship programs that help them grow as developers, designers, and leaders — building both skills and community along the way.
          </p>
        </div>

        {/* Join GDG Teams Recruitment Callout */}
        <div className="about-reveal max-w-2xl mx-auto text-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-10 backdrop-blur-md">
          <span className="text-xs uppercase tracking-wider font-semibold text-google-blue block mb-1">
            Recruitment 2026-27
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Ready to Join GDG ViMEET?
          </h3>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-5">
            We are actively hiring for <strong>Technical, Graphics &amp; Design, Content &amp; Social Media, PR &amp; Outreach, and Event Management</strong> teams. Step up and make an impact!
          </p>
          <Link to="/join" className="btn-primary">
            Apply for GDG Teams
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Lucia;
