import { Link } from 'react-router-dom';
import Section from '../../components/layout/Section';
import { Chip } from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import SectionHeader from '../../components/ui/SectionHeader';
import { interestClusters, recruitmentTeams } from '../../data/recruitment';
import { TONE } from '../../lib/teams';

const teamName = (id) => recruitmentTeams.find((t) => t.id === id)?.name ?? id;

/**
 * The twelve interest areas, grouped into Build · Create · Connect · Lead and
 * linked to the five recruitment teams (data/recruitment.js).
 */
const FindYourPlace = () => (
  <Section id="find-your-place" labelledBy="place-title" tone="tint">
    <SectionHeader
      id="place-title"
      overline="Find your place"
      title="Go beyond code"
      lede="GDG ViMEET isn’t just for programmers. Whatever you’re into, there’s a place for you here."
    />

    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 xl:grid-cols-4">
      {interestClusters.map((cluster) => {
        const tone = TONE[cluster.tone];
        return (
          <li key={cluster.key} data-reveal className="flex flex-col rounded-card border border-line bg-surface p-6">
            <span className={`inline-flex size-12 items-center justify-center rounded-full ${tone.tint} ${tone.text}`}>
              <Icon name={cluster.icon} className="size-6" />
            </span>
            <h3 className="mt-5 text-h3 text-ink">{cluster.name}</h3>
            <ul className="mt-4 mb-5 flex flex-wrap gap-2" aria-label={`${cluster.name} interests`}>
              {cluster.interests.map((interest) => (
                <li key={interest}>
                  <Chip>{interest}</Chip>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-line pt-4">
              <p className="pt-2 font-mono text-overline font-medium uppercase text-ink-2">
                {cluster.teams.length ? 'Teams' : 'Across every team'}
              </p>
              <p className="mt-1 text-sm text-ink">
                {cluster.teams.length ? (
                  cluster.teams.map(teamName).join(' · ')
                ) : (
                  <Link to="/team#teams" className="font-semibold text-primary hover:text-primary-strong hover:underline">
                    See all five teams
                  </Link>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  </Section>
);

export default FindYourPlace;
