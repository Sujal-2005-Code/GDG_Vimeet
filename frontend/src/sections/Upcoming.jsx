import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const Upcoming = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.upcoming-wrap',
        start: 'top 85%',
        end: '+=120%',
        scrub: 1.8,
      }
    })

    tl.fromTo('.upcoming-halo', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 0.6, ease: 'power2.out' })
      .fromTo('.upcoming-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, '<')
      .fromTo('.upcoming-cards > div', { y: 80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, ease: 'power2.out' }, '-=0.2')
  })

  const items = [
    {
      date: 'Soon revealed',
      title: 'Propursuit Free Fire Showdown',
      desc:
        'Compete. Conquer. Rise to the top in Propursuit’s ultimate Free Fire tournament!',
    },
  ]

  return (
    <section className="relative z-10 md:pt-40 pt-28 md:pb-16 pb-10 overflow-visible">
      <div className="upcoming-wrap md:max-w-6xl mx-auto md:px-16 px-5 relative overflow-visible">
        {/* Animated halo background (softened + pulled up to avoid cutting text) */}
        <div className="upcoming-halo absolute left-1/2 -translate-x-1/2 -top-48 w-[110%] max-w-[1200px] h-[420px] rounded-[999px] blur-3xl opacity-40 bg-gradient-to-r from-[#0066B1]/20 via-[#00AEEF]/20 to-[#E60C2C]/20 pointer-events-none" />

        <div className="relative">
          <p className="text-white/70 md:text-base text-sm">What’s next</p>
          <h2 className="upcoming-title md:text-[4.5rem] text-[2.4rem] font-round-bold !font-extrabold md:leading-[4.6rem] leading-[2.8rem] text-center bg-gradient-to-r from-[#0066B1] via-[#00AEEF] to-[#E60C2C] bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <div className="mt-4 md:mt-5 text-center">
            <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white/90 hover:text-black hover:bg-white transition px-4 py-2 text-sm">
              View all events
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M13.22 4.47a.75.75 0 011.06 0l6.25 6.25a.75.75 0 010 1.06l-6.25 6.25a.75.75 0 11-1.06-1.06l4.97-4.97H4.75a.75.75 0 010-1.5h13.44l-4.97-4.97a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="upcoming-cards grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-6 mt-8">
            {items.map((e, i) => (
              <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] min-h-[180px] flex flex-col justify-between">
                <div>
                  <p className="text-white/70 text-sm">{e.date}</p>
                  <h3 className="text-white md:text-2xl text-xl font-semibold mt-1 leading-snug">{e.title}</h3>
                  <p className="text-white/80 md:mt-2 leading-relaxed text-sm">{e.desc}</p>
                </div>
                <div className="mt-4">
                  <a href="/events" className="inline-block rounded-lg bg-white text-black font-semibold px-4 py-2 hover:opacity-90 text-sm">Event Details</a>
                </div>
              </div>
            ))}

            {/* GDG Recruitment Card */}
            <div className="relative rounded-2xl border border-[#00AEEF]/40 bg-gradient-to-br from-[#0066B1]/20 via-[#00AEEF]/15 to-[#E60C2C]/15 hover:border-[#00AEEF] transition p-5 md:p-6 shadow-[0_10px_40px_rgba(0,174,239,0.15)] min-h-[180px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  Hiring Now • ViMEET 2025-26
                </span>
                <h3 className="text-white md:text-2xl text-xl font-bold mt-2 leading-snug">
                  GDG Core Member Recruitment
                </h3>
                <p className="text-white/80 md:mt-2 text-sm leading-relaxed">
                  Join our Technical, Event Management, PR, Graphics, and Content & Media teams. Build projects, lead events, and grow!
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0066B1] to-[#00AEEF] text-white font-bold px-4 py-2 hover:opacity-90 transition text-sm shadow-md"
                >
                  Apply to Join
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Upcoming


