import { Link } from 'react-router-dom';
import { footerNavItems } from '../data/navigation';
import { getRecruitmentCta } from '../data/recruitment';
import { site } from '../data/site';
import { chapterSocials } from '../lib/social';
import Container from './layout/Container';
import SocialIcon from './ui/SocialIcon';
import Wordmark from './ui/Wordmark';

const linkClass =
  'inline-flex min-h-11 items-center text-ink-2 transition-colors duration-[var(--dur-fast)] hover:text-ink sm:min-h-9';

/** Light footer: brand + socials, navigation, contact, address — and the four-colour stroke as the last line. */
const Footer = () => {
  const cta = getRecruitmentCta();
  return (
    <footer className="relative z-20 border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Wordmark />
          <p className="mt-4 max-w-[34ch] text-ink-2">{site.tagline}</p>
          <ul className="mt-6 flex gap-2">
            {chapterSocials.map((s) => (
              <li key={s.kind}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                >
                  <SocialIcon kind={s.kind} className="size-[1.125rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <p className="font-mono text-overline font-medium uppercase text-ink-2">Explore</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
            {footerNavItems.map((item) => (
              <li key={item.label}>
                <Link to={item.path} className={linkClass}>
                  {item.path === '/join' ? (cta.open ? 'Join us' : 'Applications') : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="font-mono text-overline font-medium uppercase text-ink-2">Contact</p>
          <a href={`mailto:${site.email}`} className={`${linkClass} mt-3 font-medium text-ink`}>
            {site.email}
          </a>
          <address className="mt-3 not-italic text-sm leading-relaxed text-ink-2">
            {site.institute.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
      </Container>

      <div className="border-t border-line">
        {/* Left-aligned with room on the right, where the floating chat button sits. */}
        <Container className="py-6 pr-24 text-sm text-ink-2">
          <p>
            © {site.chapterYear} GDG On Campus Vishwaniketan ({site.institute.shortName}) · A student community of Google Developer Groups on Campus
          </p>
        </Container>
      </div>
      <span aria-hidden="true" className="color-stroke block h-1 w-full" />
    </footer>
  );
};

export default Footer;
