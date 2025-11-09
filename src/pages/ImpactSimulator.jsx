import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthButtons from "../components/AuthButtons";

export default function ImpactSimulator() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [diameter, setDiameter] = useState(100);
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  const [material, setMaterial] = useState("3000");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [impactMarker, setImpactMarker] = useState(null);
  const [damageCircles, setDamageCircles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load Leaflet + initialize map
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initializeMap;
    document.head.appendChild(script);

    createStars();

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const createStars = () => {
    const starsContainer = document.createElement("div");
    starsContainer.className = "stars";
    document.body.appendChild(starsContainer);
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 3 + "s";
      star.style.opacity = Math.random() * 0.7 + 0.3;
      starsContainer.appendChild(star);
    }
  };

  const initializeMap = () => {
    if (window.L && mapRef.current) {
      const mapInstance = window.L.map(mapRef.current, {
        center: [40.7128, -74.006],
        zoom: 11,
        preferCanvas: true,
      });
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapInstance);

      mapInstance.on("click", (e) => {
        const { lat, lng } = e.latlng;
        selectLocation(lat, lng, mapInstance);
      });
      setMap(mapInstance);
    }
  };

  const selectLocation = (lat, lng, mapInstance) => {
    setSelectedLocation({ lat, lng });
    setShowResults(false);

    if (impactMarker) mapInstance.removeLayer(impactMarker);
    damageCircles.forEach((c) => mapInstance.removeLayer(c));

    const marker = window.L.marker([lat, lng], {
      icon: window.L.divIcon({
        className: "location-marker",
        html: "📍",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
      }),
    }).addTo(mapInstance);
    setImpactMarker(marker);
  };

  const calculateImpact = (lat, lng) => {
    const radius = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * parseFloat(material);
    const velocityMs = velocity * 1000;
    const kineticEnergy = 0.5 * mass * velocityMs ** 2;
    const megatonsTNT = kineticEnergy / 4.184e15;

    const fireballRadius = 0.44 * Math.pow(megatonsTNT, 0.4);
    const craterDiameter =
      Math.pow(kineticEnergy / 1e15, 0.25) * Math.sin((angle * Math.PI) / 180);
    const shockwaveRadius = 2.2 * Math.pow(megatonsTNT, 0.33);
    const thermalRadius = 1.5 * Math.pow(megatonsTNT, 0.41);
    const affectedArea = Math.PI * shockwaveRadius ** 2;
    const casualties = Math.floor(affectedArea * 5000);

    return {
      lat,
      lng,
      energy: megatonsTNT,
      fireballRadius,
      craterDiameter,
      shockwaveRadius,
      thermalRadius,
      casualties,
    };
  };

  const createAsteroidTrail = (latlng) => {
    const point = map.latLngToContainerPoint(latlng);
    const color =
      material === "1000"
        ? "linear-gradient(to bottom, transparent,#4a9eff,#6bb6ff,#a8e6ff,#fff)"
        : material === "3000"
        ? "linear-gradient(to bottom,transparent,#ff6600,#ff8c00,#ffb347,#fff)"
        : "linear-gradient(to bottom,transparent,#3e2723,#654321,#8b4513,#d2691e)";
    const trail = document.createElement("div");
    trail.className = "asteroid-trail";
    trail.style.left = `${point.x}px`;
    trail.style.top = "-100px";
    trail.style.background = color;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 2000);
  };

  const createBlastEffect = (latlng) => {
    const point = map.latLngToContainerPoint(latlng);
    const blast = document.createElement("div");
    blast.className = "blast-effect";
    blast.style.left = `${point.x - 100}px`;
    blast.style.top = `${point.y - 100}px`;
    document.body.appendChild(blast);
    setTimeout(() => blast.remove(), 1200);
  };

  const launchAsteroid = () => {
    if (!selectedLocation || !map) return;
    const { lat, lng } = selectedLocation;
    createAsteroidTrail(window.L.latLng(lat, lng));
    setTimeout(() => createBlastEffect(window.L.latLng(lat, lng)), 1400);

    setTimeout(() => {
      const data = calculateImpact(lat, lng);
      displayImpact(data);
    }, 1500);
  };

  const displayImpact = (data) => {
    if (impactMarker) map.removeLayer(impactMarker);
    damageCircles.forEach((c) => map.removeLayer(c));

    const marker = window.L.marker([data.lat, data.lng], {
      icon: window.L.divIcon({
        className: "impact-marker",
        iconSize: [24, 24],
      }),
    }).addTo(map);

    const circles = [
      { radius: data.fireballRadius, color: "#ff0000" },
      { radius: data.thermalRadius, color: "#ff6600" },
      { radius: data.shockwaveRadius, color: "#ffaa00" },
    ];

    const newCircles = circles.map(({ radius, color }) =>
      window.L.circle([data.lat, data.lng], {
        radius: radius * 1000,
        color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map)
    );

    setImpactMarker(marker);
    setDamageCircles(newCircles);
    setImpactData(data);
    setShowResults(true);

    const bounds = window.L.latLngBounds([data.lat, data.lng]);
    newCircles.forEach((c) => bounds.extend(c.getBounds()));
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  const resetSimulation = () => {
    if (!map) return;
    if (impactMarker) map.removeLayer(impactMarker);
    damageCircles.forEach((c) => map.removeLayer(c));
    setDamageCircles([]);
    setSelectedLocation(null);
    setShowResults(false);
    map.setView([40.7128, -74.006], 11);
  };

  const quickLaunch = (lat, lng) => {
    if (!map) return;
    selectLocation(lat, lng, map);
    map.setView([lat, lng], 11);
    setTimeout(() => launchAsteroid(), 500);
  };

  const materialNames = { 1000: "Ice", 3000: "Rock", 8000: "Iron" };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{overflow:hidden;}
        @keyframes twinkle{0%,100%{opacity:.3;}50%{opacity:1;}}
        @keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes blastExpand{0%{transform:scale(0);opacity:1;}100%{transform:scale(8);opacity:0;}}
        .stars{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;}
        .star{position:absolute;width:2px;height:2px;background:white;border-radius:50%;animation:twinkle 3s infinite;}
        .navbar{display:flex;justify-content:space-between;align-items:center;padding:10px 20px;background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);z-index:2000;position:fixed;top:0;left:0;right:0;}
        .nav-menu{display:flex;gap:20px;list-style:none;}
        .nav-menu a{color:white;text-decoration:none;font-weight:600;transition:.3s;}
        .nav-menu a:hover{color:#ff6b6b;}
        .menu-toggle{display:none;font-size:24px;color:white;background:none;border:none;cursor:pointer;}
        @media(max-width:768px){
          .nav-menu{display:${menuOpen ? "flex" : "none"};flex-direction:column;position:absolute;top:60px;left:0;right:0;background:rgba(0,0,0,0.9);padding:10px;z-index:1999;}
          .menu-toggle{display:block;}
        }
        #map{width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:1;}
        .sidebar{position:fixed;left:20px;top:80px;width:340px;background:rgba(15,15,35,0.95);backdrop-filter:blur(30px);border-radius:20px;padding:28px;z-index:1000;overflow-y:auto;max-height:80vh;border:1px solid rgba(255,107,107,0.2);}
        .info-panel{position:fixed;right:20px;top:80px;width:320px;background:rgba(15,15,35,0.95);backdrop-filter:blur(30px);border-radius:20px;padding:28px;z-index:1000;transform:translateX(400px);opacity:0;transition:all 0.5s cubic-bezier(0.4,0,0.2,1);}
        .info-panel.active{transform:translateX(0);opacity:1;}
        .impact-marker{width:24px;height:24px;background:radial-gradient(circle,#fff 0%,#ff6b6b 50%,#ff0000 100%);border:3px solid #fff;border-radius:50%;animation:pulse 2s infinite;}
        .blast-effect{position:fixed;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#fff,#ff6600,#ff0000,transparent);animation:blastExpand 1s ease-out forwards;z-index:9999;}
        .launch-btn{width:100%;padding:16px;background:linear-gradient(135deg,#ff6b6b,#ff5252);border:none;border-radius:12px;color:#fff;font-size:1.1em;font-weight:700;cursor:pointer;transition:.3s;}
        .launch-btn:hover{transform:translateY(-3px);box-shadow:0 8px 35px rgba(255,107,107,0.7);}
        @media(max-width:768px){
          .sidebar{width:calc(100vw - 40px);left:20px;right:20px;}
          .info-panel{width:calc(100vw - 40px);right:20px;top:auto;bottom:20px;}
        }
      `}</style>

      <div className="navbar">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="/asteroid-launcher.html" target="_blank" rel="noopener noreferrer">Impact Simulator</a>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
        </ul>
        <AuthButtons />
      </div>

      <div ref={mapRef} id="map"></div>

      <div className="sidebar">
        <h1
          style={{
            fontSize: "2em",
            marginBottom: "8px",
            background:
              "linear-gradient(135deg, #ff6b6b, #feca57, #ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          }}
        >
          🌠 Asteroid Launcher
        </h1>
        <p style={{ color: "#999", marginBottom: "20px" }}>
          Click anywhere on the map to launch
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label className="control-label">
            Diameter <span>{diameter} m</span>
          </label>
          <input
            type="range"
            min="1"
            max="1000"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Velocity <span>{velocity} km/s</span>
          </label>
          <input
            type="range"
            min="11"
            max="70"
            value={velocity}
            onChange={(e) => setVelocity(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Impact Angle <span>{angle}°</span>
          </label>
          <input
            type="range"
            min="15"
            max="90"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Material</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#222",
              color: "#fff",
              borderRadius: "8px",
            }}
          >
            <option value="1000">Ice</option>
            <option value="3000">Rock</option>
            <option value="8000">Iron</option>
          </select>
        </div>

        <button
          className="launch-btn"
          onClick={launchAsteroid}
          disabled={!selectedLocation}
        >
          🚀 Launch {materialNames[material]}
        </button>

        {showResults && (
          <button
            className="launch-btn"
            style={{
              background: "linear-gradient(135deg,#666,#888)",
              marginTop: "10px",
            }}
            onClick={resetSimulation}
          >
            🔄 New Launch
          </button>
        )}

        <div style={{ marginTop: "20px" }}>
          <label>Quick Launch</label>
          <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
            <button onClick={() => quickLaunch(40.7128, -74.006)}>New York</button>
            <button onClick={() => quickLaunch(51.5074, -0.1278)}>London</button>
            <button onClick={() => quickLaunch(35.6762, 139.6503)}>Tokyo</button>
            <button onClick={() => quickLaunch(48.8566, 2.3522)}>Paris</button>
          </div>
        </div>
      </div>

      <div className={`info-panel ${showResults ? "active" : ""}`}>
        <h2
          style={{
            background: "linear-gradient(135deg,#feca57,#ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Impact Results
        </h2>
        {impactData && (
          <>
            <p>Energy: {impactData.energy.toFixed(2)} MT</p>
            <p>Fireball: {impactData.fireballRadius.toFixed(2)} km</p>
            <p>Crater: {impactData.craterDiameter.toFixed(0)} m</p>
            <p>Shockwave: {impactData.shockwaveRadius.toFixed(2)} km</p>
            <p>Casualties: {impactData.casualties.toLocaleString()}</p>
          </>
        )}
      </div>
    </>
  );
}
