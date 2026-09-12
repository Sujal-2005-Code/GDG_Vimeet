import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from '../components/Footer'
import { guidance, previousTenureGroups } from '../data/team'
import { recruitmentTeams } from '../data/recruitment'

const SectionHeader = ({ title, subtitle }) => (
  <header className="pt-28 md:pt-32 pb-10 md:pb-14 text-center">
    <p className="text-white/70 md:text-base text-sm">{subtitle}</p>
    <h1 className="gradient-title mt-2">{title}</h1>
  </header>
)

const Card = ({ title, role, socials }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-5 md:p-6">
    <h3 className="text-white md:text-xl text-lg font-semibold">{title}</h3>
    {role && <p className="text-white/70 md:mt-1">{role}</p>}
    {Array.isArray(socials) && socials.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {socials.map((s, i) => {
          const label = (s.label || '').toLowerCase();
          const iconSize = 'w-4 h-4';
          const Icon = () => {
            if (label.includes('instagram')) {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconSize}>
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.75z" />
                </svg>
              );
            }
            if (label.includes('linkedin')) {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconSize}>
                  <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5zM3 8h4v13H3zM9 8h3.8v1.8h.05A4.17 4.17 0 0 1 16.6 8c3 0 4.4 1.96 4.4 5.1V21H17v-6.1c0-1.46-.03-3.33-2-3.33s-2.3 1.56-2.3 3.22V21H9z" />
                </svg>
              );
            }
            if (label.includes('github')) {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconSize}>
                  <path fillRule="evenodd" d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.23 1.8 1.23 1.05 1.8 2.76 1.28 3.43.98.1-.76.41-1.28.75-1.57-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.3 1.2-3.11-.12-.29-.52-1.47.12-3.05 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.19 3.2-1.19.64 1.58.24 2.76.12 3.05.75.81 1.2 1.85 1.2 3.1 0 4.41-2.68 5.4-5.24 5.7.42.36.8 1.07.8 2.17v3.22c0 .31.21.66.8.55A11.51 11.51 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" clipRule="evenodd" />
                </svg>
              );
            }
            if (label.includes('email')) {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconSize}>
                  <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.35l-10 6.25L2 6.35V6zm0 2.24v9.76A2 2 0 0 0 4 20h16a2 2 0 0 0 2-2V8.24l-9.37 5.86a2 2 0 0 1-2.26 0L2 8.24z" />
                </svg>
              );
            }
            return (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconSize}>
                <circle cx="12" cy="12" r="10" />
              </svg>
            );
          };
          return (
            <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
               className="inline-flex items-center justify-center rounded-full border border-white/15 text-white/85 hover:text-black hover:bg-white transition size-8">
              <Icon />
              <span className="sr-only">{s.label}</span>
            </a>
          );
        })}
      </div>
    )}
  </div>
)

const Group = ({ heading, members }) => (
  <section className="md:py-12 py-8">
    <div className="md:max-w-6xl mx-auto md:px-8 px-5">
      <h2 className="font-long uppercase md:text-4xl text-3xl mb-6 bg-gradient-to-r from-[#6A5AE0] via-[#A24BE7] to-[#FF6EA8] bg-clip-text text-transparent tracking-wide">{heading}</h2>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, idx) => (
          <Card key={idx} title={m.name} role={m.role} socials={m.socials} />
        ))}
      </div>
    </div>
  </section>
)

const RecruitmentCard = ({ team }) => (
  <div className={`rounded-xl border bg-gradient-to-br p-5 md:p-6 ${team.color}`}>
    <h3 className="text-white text-lg font-semibold">{team.name}</h3>
    <span className="inline-block text-[11px] text-white/60 font-medium mt-1">{team.badge}</span>
    <p className="text-white/75 text-sm mt-3 leading-relaxed">{team.description}</p>
  </div>
)

const Team = () => {
  return (
    <main>
      <NavBar />

      <div className="black-gradient-bg min-h-dvh">
        <div className="md:max-w-6xl mx-auto md:px-8 px-5">
          <nav className="relative md:static md:top-auto md:left-auto md:w-auto md:px-0 !px-0 !pt-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li className="opacity-60">/</li>
              <li className="text-white">Team</li>
            </ol>
          </nav>
        </div>

        <SectionHeader title="Team" subtitle="Meet the people building GDG ViMEET" />

        {/* 2026-27 Recruitment */}
        <section className="md:py-8 py-6">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
              <h2 className="font-long uppercase md:text-4xl text-3xl bg-gradient-to-r from-google-blue via-google-green to-google-blue bg-clip-text text-transparent tracking-wide">
                2026-27 Recruitment
              </h2>
              <Link
                to="/join"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black font-bold px-5 py-2.5 hover:bg-white/90 transition text-sm shadow-lg"
              >
                Apply Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recruitmentTeams.map((team) => (
                <RecruitmentCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        </section>

        {/* Previous Tenure */}
        <section className="pt-6 pb-2">
          <div className="md:max-w-6xl mx-auto md:px-8 px-5">
            <h2 className="font-long uppercase md:text-3xl text-2xl text-white/70 tracking-wide border-t border-white/10 pt-10">
              Previous Tenure — 2025-26 Leadership &amp; Team
            </h2>
          </div>
        </section>

        <Group heading="Under The Guidance Of" members={guidance} />

        {previousTenureGroups.map((group) => (
          <Group key={group.heading} heading={group.heading} members={group.members} />
        ))}

        <Footer />
      </div>
    </main>
  )
}

export default Team
