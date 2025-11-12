import { useEffect, useState } from 'react';
import BasicThreeScene from '../components/BasicThreeScene';
import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';
import MeteorStandalone from '../components/MeteorStandalone';

export default function Home() {
  const [subtitleText, setSubtitleText] = useState('');
  const subtitleFullText = "AN INTERACTIVE EXPERIENCE OF THE DOCUMENTARY\nBEYOND EARTH: THE BEGINNING OF NEWSPACE";
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let timeoutId;

    function typeText() {
      if (isTyping) {
        if (charIndex < subtitleFullText.length) {
          setSubtitleText(subtitleFullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          // much faster typing
          timeoutId = setTimeout(typeText, 2);
        } else {
          setIsTyping(false);
          // shorter pause at full text
          timeoutId = setTimeout(typeText, 800);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1);
          setSubtitleText(subtitleFullText.substring(0, charIndex - 1));
          // much faster deleting
          timeoutId = setTimeout(typeText, 3);
        } else {
          setIsTyping(true);
          // shorter pause before retyping
          timeoutId = setTimeout(typeText, 200);
        }
      }
    }

  // initial startup delay (very short)
  timeoutId = setTimeout(typeText, 50);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [charIndex, isTyping, subtitleFullText]);

  // Override global gradient background with solid black while on Home
  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevAnim = document.body.style.animation;
    document.body.style.background = '#000';
    document.body.style.animation = 'none';
    return () => {
      document.body.style.background = prevBg;
      document.body.style.animation = prevAnim;
    };
  }, []);

  return (
    <>
      <BasicThreeScene />
      <nav className="navbar">
        <Link to="/" className="nav-brand">ULKAA</Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/live-tracking" onClick={() => setIsMobileMenuOpen(false)}>Live Tracking</Link></li>
          <li><Link to="/fun-zone" onClick={() => setIsMobileMenuOpen(false)}>Fun Zone</Link></li>
          <li><a href="/asteroid-launcher.html" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Impact Simulator</a></li>
          <li><a href="https://venerable-dango-dd74b9.netlify.app/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Info-askAI</a></li>
          <li><Link to="/eyes-on-solar-system" onClick={() => setIsMobileMenuOpen(false)}>Explore Solar System</Link></li>
        </ul>
        
        <div className="nav-auth">
          <AuthButtons />
        </div>
      </nav>

      {/* Hero section: floating text over globe, limited to first viewport */}
      <section className="home-hero" aria-label="Home Hero">
        <div className="home-overlay">
          <h1 className="title">ULKAA</h1>
          <div className="subtitle-container">
            <p className="subtitle">{subtitleText}</p>
          </div>
        </div>
      </section>


      {/* Second section: integrated standalone content */}
      <section className="meteor-standalone-section" aria-label="Meteor Standalone">
        <MeteorStandalone />
      </section>

      {/* Page-specific styles */}
      <style jsx>{`
        .home-hero { position: relative; width: 100%; height: 100vh; z-index: 10; pointer-events: none; }
        .home-overlay { position: absolute; inset: 0; display:flex; flex-direction:column; justify-content:center; align-items:center; pointer-events:none; }

        .meteor-standalone-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: block;
          z-index: 5; /* above the canvas */
          background: #000; /* ensure solid background under iframe */
        }



        /* content handled inside MeteorStandalone */
      `}</style>
    </>
  );
}

