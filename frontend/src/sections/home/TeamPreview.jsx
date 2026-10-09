import Section from '../../components/layout/Section';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import { previousTenureGroups } from '../../data/team';

// The leads of the most recent tenure on record (2025-26) — picked by role,
// so the list follows data/team.js. Swap in the 2026-27 team when it exists.
const LEAD_ROLE = /lead|facilitator|mentor/i;
const leads = previousTenureGroups.flatMap((g) => g.members).filter((m) => LEAD_ROLE.test(m.role));

const TeamPreview = () => (
  <Section id="team-preview" labelledBy="team-title">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <SectionHeader
        id="team-title"
        overline="Team · 2025-26"
        title="The people behind it"
        lede="The students who led the chapter in 2025-26."
      />
      <div data-reveal>
        <Button to="/team" variant="secondary" icon="arrow-right">
          Meet the team
        </Button>
      </div>
    </div>

    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
      {leads.map((person) => (
        <li key={person.name} data-reveal className="flex items-center gap-4 rounded-card border border-line bg-surface p-5">
          <Avatar name={person.name} size="size-14" className="text-lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-ink">{person.name}</p>
            <p className="text-sm text-ink-2">{person.role}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

export default TeamPreview;
