import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from '../components/Footer';

const SectionHeader = ({ title, subtitle }) => (
  <header className="pt-28 md:pt-32 pb-8 md:pb-12 text-center">
    <p className="text-white/70 md:text-base text-sm">{subtitle}</p>
    <h1 className="gradient-title mt-2">{title}</h1>
  </header>
);

const UPCOMING_EVENTS = [
  {
    when: 'Announcing Soon • 2025',
    title: 'Propursuit Free Fire Showdown',
    tag: 'Esports & Gaming',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    desc: 'Compete. Conquer. Rise to the top in Propursuit’s ultimate Free Fire tournament hosted by GDG ViMEET.',
    venue: 'ViMEET Campus Auditorium / Discord',
    cta: {
      label: 'Notify Me On Launch',
      href: 'https://www.instagram.com/gdgvimeet'
    }
  },
  {
    when: 'Coming This Semester',
    title: 'Google Cloud & AI Study Jam',
    tag: 'Cloud & AI',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    desc: 'Hands-on Google Cloud Skills Boost labs, generative AI quests, badges, and official Google swags.',
    venue: 'Computer Labs & Virtual',
    cta: {
      label: 'Stay Tuned',
      href: '/join'
    }
  }
];

const PAST_EVENTS = [
  {
    title: 'Google Cloud Career Practitioner Bootcamp',
    date: 'Academic Year 2024-25',
    category: 'Cloud & DevOps',
    desc: 'Comprehensive hands-on training on Google Cloud Platform, covering Compute Engine, Cloud Storage, and BigQuery with practical labs and digital certifications.',
    attendees: '250+ Students',
    highlights: ['Qwiklabs hands-on access', 'Completion certificates', 'Cloud Architecture insights']
  },
  {
    title: 'Full-Stack Web Development Workshop',
    date: 'Tech Sprint Series',
    category: 'Web Dev',
    desc: 'Hands-on workshop introducing modern web architecture: HTML5, Tailwind CSS, JavaScript ES6, and building interactive web applications with React.',
    attendees: '180+ Attendees',
    highlights: ['Live coding projects', 'Git & GitHub basics', 'Hosting on Vercel & Firebase']
  },
  {
    title: 'Intro to GenAI & Google Gemini APIs',
    date: 'AI Innovation Series',
    category: 'AI & ML',
    desc: 'Deep dive into prompt engineering, LLM capabilities, and building real-world AI applications using Google Gemini models and Python.',
    attendees: '210+ Attendees',
    highlights: ['Gemini API key setups', 'Multimodal prompts', 'Building AI Chatbots']
  },
  {
    title: 'UI/UX & Creative Graphics Masterclass',
    date: 'Design Domain',
    category: 'Design & Graphics',
    desc: 'Figma mastery session covering layout design, typography, color psychology, and crafting high-converting social media creatives.',
    attendees: '150+ Designers',
    highlights: ['Figma auto-layout', 'Brand identity', 'Poster composition']
  }
];

const CATEGORIES = ['All', 'Cloud & DevOps', 'Web Dev', 'AI & ML', 'Design & Graphics'];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPast = PAST_EVENTS.filter(
    (e) => activeCategory === 'All' || e.category === activeCategory
  );

  return (
    <main>
      <NavBar />

      <div className="black-gradient-bg min-h-dvh">
        <div className="md:max-w-6xl mx-auto md:px-8 px-5">
          <nav className="relative md:static md:top-auto md:left-auto md:w-auto md:px-0 !px-0 !pt-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li className="opacity-60">/</li>
              <li className="text-white">Events</li>
            </ol>
          </nav>
        </div>

        <SectionHeader title="Events" subtitle="Discover what we do, build, and celebrate" />

        {/* Impact Stats Banner */}
        <section className="py-6">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#0066B1] to-[#00AEEF] bg-clip-text text-transparent">800+</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Student Attendees</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#34A853] to-emerald-400 bg-clip-text text-transparent">12+</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Workshops & Jams</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FBBC05] to-amber-400 bg-clip-text text-transparent">5</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Core Tech Domains</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#EA4335] to-rose-400 bg-clip-text text-transparent">100%</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Student Driven</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="md:py-10 py-6">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-yellow font-long uppercase md:text-4xl text-3xl">Upcoming Events</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Registering Soon
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {UPCOMING_EVENTS.map((e, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition p-6 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-white/60 text-xs font-mono">{e.when}</span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${e.tagColor}`}>
                        {e.tag}
                      </span>
                    </div>

                    <h3 className="text-white md:text-2xl text-xl font-semibold mt-1">{e.title}</h3>
                    <p className="text-white/80 mt-2 text-sm leading-relaxed">{e.desc}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-white/50 mt-4">
                      <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {e.venue}
                    </div>
                  </div>

                  {e.cta && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <a
                        href={e.cta.href}
                        target={e.cta.href.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm px-4 py-2.5 hover:bg-white/90 transition"
                      >
                        {e.cta.label}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events Section */}
        <section className="md:py-12 py-8">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-yellow font-long uppercase md:text-4xl text-3xl">Past Events & Sessions</h2>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  A look back at hands-on learning experiences hosted by GDG ViMEET.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap border ${
                      activeCategory === cat
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {filteredPast.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 p-5 sm:p-6 transition shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs text-[#00AEEF] font-mono">{item.date}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{item.title}</h3>
                    <p className="text-white/75 text-xs sm:text-sm mt-2 leading-relaxed">{item.desc}</p>

                    <div className="mt-4 pt-3 border-t border-white/10">
                      <span className="text-[11px] text-white/50 block mb-1.5">Key Highlights:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.highlights.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[11px] text-white/70"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-white/50">
                    <span>{item.attendees}</span>
                    <span className="text-emerald-400">Successfully Completed</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-white/40 mt-6 italic">
              * Note: More past event galleries, recordings, and speaker highlights will be updated shortly!
            </p>
          </div>
        </section>

        {/* Recruitment & Propose Session CTA Banner */}
        <section className="py-12">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0066B1]/20 via-[#00AEEF]/20 to-[#E60C2C]/20 p-6 md:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white mb-3">
                  🚀 GDG ViMEET 2025-26 Recruitment
                </span>
                <h3 className="text-white md:text-3xl text-2xl font-bold">
                  Want to organize, design, or speak at our next big event?
                </h3>
                <p className="text-white/80 mt-3 text-sm sm:text-base leading-relaxed">
                  Join our Technical, Event Management, Graphics, PR, or Content teams and take your campus leadership to the next level.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/join"
                    className="rounded-full bg-white text-black font-bold px-6 py-3 hover:bg-white/90 transition text-sm shadow-lg"
                  >
                    Apply for GDG Teams
                  </Link>
                  <a
                    href="mailto:gdgvimeet@gmail.com"
                    className="rounded-full border border-white/20 text-white/90 hover:bg-white/10 transition px-6 py-3 text-sm"
                  >
                    Propose a Workshop / Talk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default Events;
