import { useEffect } from 'react'
import { site } from '../data/site'

const Social = () => {
  useEffect(() => {
    // Nudge iframe repaint on mount for better visual sync during transitions
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative z-10 md:pt-12 pt-8 md:pb-20 pb-14 overflow-visible">
      <div className="md:max-w-6xl mx-auto md:px-16 px-5 relative overflow-visible">
        {/* Animated backdrop ribbon */}
        <div className="pointer-events-none absolute -inset-x-24 -top-6 h-40 rotate-2 bg-gradient-to-r from-[#0066B1]/10 via-[#00AEEF]/10 to-[#E60C2C]/10 blur-2xl" />

        <div className="relative">
          <p className="text-white/70 md:text-base text-sm">Follow the journey</p>
          <div className="flex items-center justify-between gap-3 flex-wrap mt-1">
            <h2 className="md:text-[2.2rem] text-[1.6rem] font-round-bold !font-extrabold bg-gradient-to-r from-[#0066B1] via-[#00AEEF] to-[#E60C2C] bg-clip-text text-transparent">
              Latest From GDG ViMEET
            </h2>
            <div className="flex items-center gap-3">
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white/90 hover:text-[#0066B1] hover:bg-white/10 transition px-3 py-2 text-sm"
                title="Follow us on LinkedIn"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white/90 hover:text-black hover:bg-white transition px-4 py-2 text-sm"
              >
                View more
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M13.22 4.47a.75.75 0 011.06 0l6.25 6.25a.75.75 0 010 1.06l-6.25 6.25a.75.75 0 11-1.06-1.06l4.97-4.97H4.75a.75.75 0 010-1.5h13.44l-4.97-4.97a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Unique tilt card with embedded feed */}
        <div className="mt-6 [perspective:1200px]">
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden will-change-transform [transform-style:preserve-3d] transition duration-500 group-hover:rotate-x-2 group-hover:rotate-y-[-1.5deg]">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
            <div className="relative aspect-[4/3] md:aspect-[21/9]">
              <iframe
                title="GDG Vimeet Instagram"
                src={`${site.social.instagram}embed`}
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Floating badges */}
        <div className="mt-5 flex flex-wrap gap-2 text-[11px] md:text-xs text-white/80">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">Highlights</span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">Reels</span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">Posts</span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">Stories</span>
        </div>

        {/* LinkedIn Profile Card */}
        <div className="mt-6 [perspective:1200px]">
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden will-change-transform [transform-style:preserve-3d] transition duration-500 group-hover:rotate-x-2 group-hover:rotate-y-[-1.5deg]">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
            <div className="relative py-10 md:py-14 px-6 flex flex-col items-center justify-center text-center">
              {/* LinkedIn Profile Icon */}
              <div className="w-16 h-16 mb-4 rounded-full bg-[#0066B1] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              
              {/* Profile Name */}
              <h3 className="text-xl font-bold text-white mb-1">GDG VIMEET</h3>
              
              {/* Subtitle */}
              <p className="text-sm text-white/80 mb-4">Google Developer Groups</p>

              {/* CTA Button */}
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0066B1] hover:bg-[#0056A3] text-white px-6 py-3 rounded-full font-medium transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                View LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Social


