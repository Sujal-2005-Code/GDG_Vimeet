import { useRef } from 'react';
import useReveal from '../animations/reveal';
import PageHeader from '../components/layout/PageHeader';
import Section from '../components/layout/Section';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { StatusChip } from '../components/ui/Chip';
import Icon from '../components/ui/Icon';
import SectionHeader from '../components/ui/SectionHeader';
import SocialIcon from '../components/ui/SocialIcon';
import { getRecruitmentCta, recruitmentTeams } from '../data/recruitment';
import { site } from '../data/site';
import { guidance, previousTenureGroups } from '../data/team';
import usePageMeta from '../hooks/usePageMeta';
import { socialKind } from '../lib/social';
import { TEAM_ICON, TONE } from '../lib/teams';

const TEAM_TONES = [TONE.blue, TONE.red, TONE.yellow, TONE.green, TONE.blue];

/** A person: initials avatar, name, role, labelled social links (44px targets). */
const Person = ({ member }) => (
  <li className="flex items-start gap-4 rounded-card border border-line bg-surface p-4 sm:p-5">
    <Avatar name={member.name} />
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-ink">{member.name}</p>
      <p className="text-sm text-ink-2">{member.role}</p>
      {member.socials?.length > 0 && (
        <ul className="-ml-2.5 mt-1 flex flex-wrap">
          {member.socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${s.label} (opens in a new tab)`}
                className="inline-flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <SocialIcon kind={socialKind(s.label)} className="size-[1.125rem]" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  </li>
);

const Team = () => {
  usePageMeta('Team', 'The people behind GDG On Campus Vishwaniketan — the recruitment teams, faculty guidance and the 2025-26 core team.');
  const ref = useRef(null);
  useReveal(ref);
  const cta = getRecruitmentCta();

  return (
    <main id="main" ref={ref}>
      <PageHeader
        current="Team"
        overline="Team"
        title={
          <>
            The people behind <span className="text-primary">GDG ViMEET</span>
          </>
        }
        lede="Students who organise the events, run the workshops and build the community — with the guidance of our faculty."
      />

      <Section id="teams" labelledBy="teams-title" className="pt-0! scroll-mt-[var(--nav-h)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="teams-title" overline={`Recruitment ${site.chapterYear}`} title="Five teams" stroke={false} />
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <StatusChip status={cta.open ? 'open' : 'closed'} />
            <Button
              size="sm"
              variant={cta.open ? 'primary' : 'secondary'}
              icon={cta.external ? 'external' : 'arrow-right'}
              aria-label={cta.ariaLabel}
              {...(cta.external ? { href: cta.href } : { to: cta.href })}
            >
              {cta.open ? 'Apply now' : cta.label}
            </Button>
          </div>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recruitmentTeams.map((team, i) => {
            const tone = TEAM_TONES[i % TEAM_TONES.length];
            return (
              <li key={team.id} data-reveal className="flex flex-col rounded-card border border-line bg-surface p-6">
                <span className={`inline-flex size-12 items-center justify-center rounded-full ${tone.tint} ${tone.text}`}>
                  <Icon name={TEAM_ICON[team.iconKey] ?? 'users'} className="size-6" />
                </span>
                <h3 className="mt-5 text-h3 text-ink">{team.name}</h3>
                <p className="mt-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink-2">{team.badge}</p>
                <p className="mt-3 text-ink-2">{team.description}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section labelledBy="guidance-title" tone="tint">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeader
            id="guidance-title"
            overline="Faculty"
            title="Under the guidance of"
            className="lg:col-span-4"
          />
          <ul data-reveal className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
            {guidance.map((person) => (
              <li key={person.name} className="flex items-center gap-3 border-b border-line py-4">
                <Avatar name={person.name} size="size-10" className="text-sm" />
                <div className="min-w-0">
                  <p className="font-medium text-ink">{person.name}</p>
                  <p className="text-sm text-ink-2">{person.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section labelledBy="tenure-title">
        <SectionHeader
          id="tenure-title"
          overline="Previous tenure"
          title="Core team 2025-26"
          lede="The team that led the chapter through the Cloud Study Jams, Nirmaan and the 2025-26 workshops."
        />
        <div className="mt-10 space-y-3">
          {previousTenureGroups.map((group, i) => (
            <details key={group.heading} data-reveal open={i === 0} className="group rounded-card border border-line bg-surface open:shadow-rest">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-3">
                  <span className="text-lg font-semibold text-ink">
                    {group.heading.replace(/\s*20\d\d-\d\d$/, '').replace(/^CORE TEAM$/, 'Core team')}
                  </span>
                  <span className="text-sm text-ink-2">
                    {group.members.length} {group.members.length === 1 ? 'person' : 'people'}
                  </span>
                </span>
                <Icon name="chevron-down" className="size-5 shrink-0 text-ink-2 transition-transform duration-[var(--dur-base)] group-open:rotate-180" />
              </summary>
              <ul className="grid gap-3 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6 lg:grid-cols-3">
                {group.members.map((member) => (
                  <Person key={member.name} member={member} />
                ))}
              </ul>
            </details>
          ))}
        </div>
      </Section>
    </main>
  );
};

export default Team;
