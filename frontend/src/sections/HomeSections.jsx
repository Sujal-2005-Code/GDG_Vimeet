import { useRef } from 'react';
import useReveal from '../animations/reveal';
import About from './home/About';
import EventsPreview from './home/EventsPreview';
import FinalCTA from './home/FinalCTA';
import FindYourPlace from './home/FindYourPlace';
import Moments from './home/Moments';
import TeamPreview from './home/TeamPreview';

/**
 * Everything on the home page after the scroll story, in story order:
 * event cards → photography → Learn · Build · Grow → find your place →
 * the people → join. Loaded after the Hero has painted (see App.jsx).
 */
const HomeSections = () => {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <div ref={ref}>
      <EventsPreview />
      <Moments />
      <About />
      <FindYourPlace />
      <TeamPreview />
      <FinalCTA />
    </div>
  );
};

export default HomeSections;
