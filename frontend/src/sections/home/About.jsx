import Section from '../../components/layout/Section';
import Icon from '../../components/ui/Icon';
import SectionHeader from '../../components/ui/SectionHeader';
import { site } from '../../data/site';
import { TONE } from '../../lib/teams';

const PILLAR_TONE = { learn: TONE.blue, build: TONE.red, grow: TONE.green };

/** Who we are in a few sentences + the three pillars: Learn · Build · Grow. */
const About = () => {
  const { about } = site;
  return (
    <Section id="about" labelledBy="about-title" className="scroll-mt-[var(--nav-h)]">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeader
          id="about-title"
          overline={about.overline}
          title={about.title}
          lede={about.body}
          className="lg:col-span-6"
        />

        <ol className="grid gap-4 lg:col-span-6 lg:pt-10">
          {about.pillars.map((pillar, i) => {
            const tone = PILLAR_TONE[pillar.key];
            return (
              <li
                key={pillar.key}
                data-reveal
                className="flex items-start gap-5 rounded-card border border-line bg-surface p-5 sm:p-6"
              >
                <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${tone.tint} ${tone.text}`}>
                  <Icon name={pillar.icon} className="size-6" />
                </span>
                <div>
                  <h3 className="flex items-baseline gap-3 text-h3 text-ink">
                    <span className="font-mono text-sm font-medium text-ink-2">0{i + 1}</span>
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-ink-2">{pillar.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
};

export default About;
