import NavBar from './NavBar'
import Footer from '../components/Footer'
import { site } from '../data/site'

const SectionHeader = ({ title, subtitle }) => (
  <header className="pt-28 md:pt-32 pb-10 md:pb-14 text-center">
    <p className="text-white/70 md:text-base text-sm">{subtitle}</p>
    <h1 className="gradient-title mt-2">{title}</h1>
  </header>
)

const Contact = () => {
  return (
    <main>
      <NavBar />

      <div className="black-gradient-bg min-h-dvh">
        <div className="md:max-w-6xl mx-auto md:px-8 px-5">
          <nav className="relative md:static md:top-auto md:left-auto md:w-auto md:px-0 !px-0 !pt-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li className="opacity-60">/</li>
              <li className="text-white">Contact</li>
            </ol>
          </nav>
        </div>

        <SectionHeader title="Contact" subtitle="Get in touch with us" />

        <section className="md:py-12 py-8">
          <div className="md:max-w-7xl mx-auto md:px-8 px-5">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Google Map Column */}
              <div className="order-2 lg:order-1">
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 h-40">
                  <iframe
                    src={site.institute.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vishwaniketan Institute Location"
                    className="w-full h-full"
                  ></iframe>
              </div>

                {/* Contact Information below map */}
                <div className="mt-6 space-y-4">
                  {/* Logo and Title */}
                  <div className="flex items-center space-x-3">
                    <img src="/images/nav-logo.svg" alt="GDG ViMEET Logo" className="h-7 w-auto" loading="lazy" />
                    <h2 className="text-white text-2xl md:text-3xl font-bold">{site.name}</h2>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-semibold">Address</h3>
                    <div className="text-gray-300 space-y-1">
                      {site.institute.addressLines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-semibold">Email</h3>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {site.email}
                    </a>
                  </div>

                  {/* Reasons to reach out */}
                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-semibold">Reach Out About</h3>
                    <div className="flex flex-wrap gap-2">
                      {['General Questions', 'Collaborations', 'Workshops & Talks', 'Community', 'Partnerships', 'Recruitment'].map((reason) => (
                        <span key={reason} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <h3 className="text-white text-lg font-semibold">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a
                        href={site.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label="GitHub"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a
                        href={site.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label="Instagram"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a
                        href={site.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Column (Google Form Embed) */}
              <div className="order-1 lg:order-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
                  <h2 className="text-white text-lg font-bold mb-3">Get in Touch</h2>
                  <div className="rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <iframe
                      src={site.contactFormUrl}
                      width="100%"
                      height="500"
                      frameBorder="0"
                      marginHeight="0"
                      marginWidth="0"
                      className="w-full"
                      title="GDG ViMEET Contact Form"
                    >
                      Loading…
                    </iframe>
                  </div>
                </div>
                
                {/* Contact Us Section */}
                <div className="mt-4">
                  <h3 className="text-white text-lg font-semibold mb-3">Contact Us</h3>

                  {/* Social Media Links */}
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <h4 className="text-white font-medium mb-3">Follow Us</h4>
                    <div className="flex items-center space-x-4">
                      <a
                        href={site.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center space-x-2 text-white/70 hover:text-[#0066B1] transition-colors duration-300"
                        title="Follow us on LinkedIn"
                      >
                        <svg 
                          className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                      
                      <a
                        href={site.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center space-x-2 text-white/70 hover:text-[#E60C2C] transition-colors duration-300"
                        title="Follow us on Instagram"
                      >
                        <svg
                          className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  )
}

export default Contact


