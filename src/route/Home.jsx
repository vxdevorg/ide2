import React, { useEffect, useState } from 'react';
import LandingPage from "../pages/LandingPage.jsx";
import KeyFeatures from '../pages/KeyFeatures.jsx';
import Contact from '../pages/Contact.jsx';
import EventRegister from '../components/forms/EventRegister.jsx';
import EventResult from '../components/forms/EventResult.jsx';
import { ArrowUp } from 'lucide-react'; // optional icon library (lucide)

const Home = ({ language, themeColor }) => {
  const [showButton, setShowButton] = useState(false);

  // Show button after scrolling down 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowButton(true);
      else setShowButton(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Main Sections */}
      <LandingPage language={language} themeColor={themeColor} />
      <KeyFeatures language={language} themeColor={themeColor} />
      <EventRegister language={language} themeColor={themeColor} />
      <EventResult language={language} themeColor={themeColor} />
      <Contact language={language} themeColor={themeColor} />

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 z-50 
                     bg-white text-black border-2 border-gray-300 
                     rounded-full shadow-lg hover:shadow-xl 
                     p-3 md:p-4 transition-all duration-300 
                     hover:bg-gray-100 flex items-center justify-center"
          style={{ borderColor: themeColor }}
        >
          <ArrowUp size={22} style={{ color: themeColor }} />
        </button>
      )}
    </div>
  );
};

export default Home;
