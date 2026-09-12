import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useEffect, useState } from 'react';

import Loader from './components/Loader';
import Footer from './components/Footer';
import NavBar from './sections/NavBar';
import Hero from './sections/Hero';
import Upcoming from './sections/Upcoming';
import Social from './sections/Social';
import Lucia from './sections/Lucia';
import GoBeyondCode from './sections/GoBeyondCode';
import JoinUs from './sections/JoinUs';
import Final from './sections/Final';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoaded = () => setIsLoading(false);
    if (document.readyState === 'complete') {
      handleLoaded();
    } else {
      window.addEventListener('load', handleLoaded);
      return () => {
        window.removeEventListener('load', handleLoaded);
      };
    }
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <main aria-hidden={isLoading}>
        <NavBar />
        <Hero />

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
        <Footer />
      </main>
    </>
  )
}

export default App