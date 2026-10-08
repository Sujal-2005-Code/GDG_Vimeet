// The pre-redesign home sections that still sit below the new Hero. They are
// replaced chapter by chapter in Stage 3/4; this file disappears with the last
// of them. Kept in one module so App can load it after the Hero has painted.
import Upcoming from './Upcoming';
import Social from './Social';
import Lucia from './Lucia';
import GoBeyondCode from './GoBeyondCode';
import JoinUs from './JoinUs';
import Final from './Final';

const LegacyHome = () => (
  <>
    <div className="py-16"></div>
    <Upcoming />

    <div className="py-16"></div>
    <Social />

    <div className="py-20"></div>
    <Lucia />

    <GoBeyondCode />

    <JoinUs />

    <div className="py-16"></div>
    <Final />
  </>
);

export default LegacyHome;
