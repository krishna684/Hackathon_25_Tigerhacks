import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import InfoCard from '../components/InfoCard';
import MeteorLegend from '../components/MeteorLegend';
import { useRef, useState, useEffect } from 'react';
import { keyboardManager } from '../utils/keyboard';

export default function LiveTracking() {
  const globeRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Populate with sample events for demo
    setEvents([
      { label: 'Event', value: 'Fireball detected over North America' },
      { label: 'Time', value: new Date().toLocaleTimeString() },
      { label: 'Magnitude', value: '-3.2' },
      { label: 'Location', value: '40.7°N, 74.0°W' }
    ]);

    // Register keyboard shortcuts
    keyboardManager.register('r', () => {
      if (window.focusOnLatLng) window.focusOnLatLng(0, 0, 4, 800);
    }, 'Reset globe view');

    return () => {
      keyboardManager.unregister('r');
    };
  }, []);

  const handleSearchSelect = ({ lat, lng }) => {
    if (window.focusOnLatLng) {
      // Zoom into location with closer distance
      window.focusOnLatLng(lat, lng, 2.5, 1500);
      
      // Stop automatic globe rotation
      if (window.stopGlobeRotation) {
        window.stopGlobeRotation();
      }
      
      // Spawn meteors in a circular pattern around the searched location
      if (window.spawnMeteorAtLocation) {
        const numMeteors = 8;
        const radius = 5; // degrees radius for circular pattern
        
        for (let i = 0; i < numMeteors; i++) {
          setTimeout(() => {
            // Calculate position in a circle
            const angle = (i / numMeteors) * Math.PI * 2;
            const offsetLat = lat + Math.cos(angle) * radius;
            const offsetLng = lng + Math.sin(angle) * radius;
            window.spawnMeteorAtLocation(offsetLat, offsetLng, 2.5 + Math.random() * 2);
          }, i * 350);
        }
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '60px', color: '#fff', background: '#000' }}>
      <nav className="navbar" role="navigation" aria-label="Main navigation" style={{ zIndex: 2000 }}>
        <Link to="/" className="nav-brand">ULKAA</Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/live-tracking" aria-current="page" onClick={() => setIsMobileMenuOpen(false)}>Live Tracking</Link></li>
          <li><Link to="/fun-zone" onClick={() => setIsMobileMenuOpen(false)}>Fun Zone</Link></li>
          <li><a href="/asteroid-launcher.html" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Impact Simulator</a></li>
        </ul>
        
        <div className="nav-auth">
          <AuthButtons />
        </div>
      </nav>

      <section 
        id="globe-root" 
        style={{ position: 'relative', height: 'calc(100vh - 60px)', overflow: 'hidden' }}
        role="region"
        aria-label="Interactive 3D globe showing live meteor tracking"
      >
        <ThreeScene ref={globeRef} />
        <InfoCard title="Recent Events" items={events} />
        <MeteorLegend />
      </section>
    </div>
  );
}

