import { useEffect, useState } from 'react';
import Section from '../../components/layout/Section';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import { getPublicTeams } from '../../services/adminTeams';

const TeamPreview = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicTeams()
      .then((data) => {
        const allMembers = data.flatMap((group) => group.members);
        const homepageMembers = allMembers.filter((m) => m.showOnHomepage);
        setLeads(homepageMembers);
      })
      .catch((err) => console.error('Failed to load team preview:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
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

      {isLoading ? (
        <div className="mt-12 py-12 text-center text-ink-2 text-sm border border-dashed border-line-strong rounded-card bg-surface lg:mt-14">
          <span className="inline-block size-5 rounded-full border-2 border-line-strong border-t-primary animate-spin mb-2" />
          <p>Loading team preview...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-12 py-12 text-center text-ink-2 text-sm border border-dashed border-line-strong rounded-card bg-surface lg:mt-14">
          <p>No members have been marked to show on the homepage yet.</p>
        </div>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {leads.map((person) => (
            <li key={person._id || person.name} data-reveal className="flex items-center gap-4 rounded-card border border-line bg-surface p-5">
              {person.image ? (
                <img src={person.image} alt={person.name} className="size-14 rounded-full object-cover bg-surface-2" />
              ) : (
                <Avatar name={person.name} size="size-14" className="text-lg" />
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-ink">{person.name}</p>
                <p className="text-sm text-ink-2">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default TeamPreview;
