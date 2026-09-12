import { Link } from 'react-router-dom';

const JoinUs = () => {
  return (
    <section className="relative z-10 md:py-24 py-16">
      <div className="md:max-w-4xl mx-auto md:px-16 px-5 text-center">
        <p className="text-white/70 md:text-base text-sm mb-3">GDG ViMEET 2026-27</p>
        <h2 className="md:text-[3.2rem] text-[2.1rem] font-round-bold !font-extrabold leading-tight gradient-text-google">
          Join The Next Chapter
        </h2>
        <p className="text-white/80 md:text-lg text-base mt-4 max-w-xl mx-auto">
          Don&apos;t just attend events. Be part of the team that creates them.
        </p>
        <div className="mt-8">
          <Link to="/join" className="btn-primary">
            Apply For 2026-27
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
