import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import ColorStroke from '../../components/ui/ColorStroke';
import { StatusChip } from '../../components/ui/Chip';
import SocialIcon from '../../components/ui/SocialIcon';
import { getRecruitmentCta } from '../../data/recruitment';
import { site } from '../../data/site';
import { chapterSocials } from '../../lib/social';

/**
 * The closing call to action, driven by `site.recruitmentOpen`:
 *   open   → Join GDG On Campus Vishwaniketan + Apply
 *   closed → applications are closed, follow us to hear when they reopen
 */
const FinalCTA = () => {
  const cta = getRecruitmentCta();
  const { logo } = site.brand;

  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden bg-surface-2 py-16 sm:py-20 lg:py-28">
      <Container className="relative text-center">
        <div data-reveal className="mx-auto flex max-w-[44rem] flex-col items-center">
          {logo?.markId && (
            <svg viewBox={logo.markViewBox} aria-hidden="true" focusable="false" className="h-10 w-auto sm:h-12">
              <use href={`${logo.src}#${logo.markId}`} />
            </svg>
          )}
          <div className="mt-8">
            <StatusChip status={cta.open ? 'open' : 'closed'} label={`${cta.statusLabel} · ${site.chapterYear}`} />
          </div>
          <h2 id="final-title" className="mt-5 text-h1 text-balance text-ink">
            {cta.open ? 'Join GDG On Campus Vishwaniketan' : 'Applications are closed'}
          </h2>
          <ColorStroke className="mt-6 h-1 w-24" />
          <p className="mt-6 max-w-[52ch] text-body-lg text-ink-2">
            {cta.open ? 'Don’t just attend events. Be part of the team that creates them.' : cta.message}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {cta.open ? (
              <Button to={cta.href} icon="arrow-right">
                Apply for {site.chapterYear}
              </Button>
            ) : (
              chapterSocials.map((s, i) => (
                <Button
                  key={s.kind}
                  href={s.href}
                  variant={i === 0 ? 'primary' : 'secondary'}
                  aria-label={`${s.label} (opens in a new tab)`}
                >
                  <SocialIcon kind={s.kind} className="size-4" />
                  {s.label}
                </Button>
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FinalCTA;
