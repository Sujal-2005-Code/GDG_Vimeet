import { useRef } from 'react';
import useReveal from '../animations/reveal';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import { Chip } from '../components/ui/Chip';
import ClickToLoad from '../components/ui/ClickToLoad';
import Icon from '../components/ui/Icon';
import SocialIcon from '../components/ui/SocialIcon';
import { site } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import { chapterSocials } from '../lib/social';

const REASONS = ['General questions', 'Collaborations', 'Workshops & talks', 'Community', 'Partnerships', 'Recruitment'];

const Contact = () => {
  usePageMeta('Contact', 'Get in touch with GDG On Campus Vishwaniketan — email, socials, our campus address and a contact form.');
  const ref = useRef(null);
  useReveal(ref);

  return (
    <main id="main" ref={ref}>
      <PageHeader
        current="Contact"
        overline="Contact"
        title={
          <>
            Get in <span className="text-primary">touch</span>
          </>
        }
        lede="Questions, collaborations, a workshop or talk idea — write to us, message us on social media, or use the form."
      />

      <Container className="grid gap-6 pb-20 lg:grid-cols-12 lg:gap-8 lg:pb-28">
        {/* Contact card */}
        <section aria-labelledby="reach-title" data-reveal className="flex flex-col gap-8 rounded-media border border-line bg-surface p-6 sm:p-8 lg:col-span-5">
          <div>
            <h2 id="reach-title" className="text-h3 text-ink">
              Reach us
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex min-h-11 items-center gap-3 break-all text-lg font-semibold text-primary hover:text-primary-strong hover:underline"
            >
              <Icon name="mail" className="size-5 shrink-0" />
              {site.email}
            </a>
          </div>

          <div>
            <h3 className="font-mono text-overline font-medium uppercase text-ink-2">Follow us</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {chapterSocials.map((s) => (
                <li key={s.kind}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-surface-2"
                  >
                    <SocialIcon kind={s.kind} className="size-4" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-overline font-medium uppercase text-ink-2">Reach out about</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <li key={r}>
                  <Chip>{r}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-overline font-medium uppercase text-ink-2">Address</h3>
            <address className="mt-3 not-italic leading-relaxed text-ink">
              {site.institute.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-5 aspect-[16/10] overflow-hidden rounded-card border border-line bg-surface-2">
              <ClickToLoad
                title="The map"
                src={site.institute.mapEmbedUrl}
                label="Load map"
                openHref={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.institute.name)}`}
                openLabel="Open in Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Contact form (existing Google Form, loaded only near the viewport) */}
        <section aria-labelledby="form-title" data-reveal className="flex flex-col overflow-hidden rounded-media border border-line bg-surface lg:col-span-7">
          <div className="border-b border-line p-6 sm:p-8">
            <h2 id="form-title" className="text-h3 text-ink">
              Send us a message
            </h2>
            <p className="mt-2 text-ink-2">Prefer email? Write to us at {site.email}.</p>
          </div>
          <div className="min-h-[640px] flex-1">
            <ClickToLoad
              title="The contact form"
              src={site.contactFormUrl}
              label="Load the contact form"
              openHref={site.contactFormUrl.replace('?embedded=true', '')}
              openLabel="Open it on Google Forms"
              iframeClassName="min-h-[640px]"
            />
          </div>
        </section>
      </Container>
    </main>
  );
};

export default Contact;
