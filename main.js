import * as THREE from 'three';

// Check for WebGL support before initializing scene
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

// Display user-friendly message if WebGL is unavailable
if (!checkWebGLSupport()) {
  const errorMessage = document.createElement('div');
  errorMessage.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    font-family: sans-serif;
    max-width: 500px;
    z-index: 1000;
  `;
  errorMessage.innerHTML = `
    <h2 style="margin-top: 0;">WebGL Not Supported</h2>
    <p>Your browser does not support WebGL, which is required for this 3D experience.</p>
    <p>Please try using a modern browser like Chrome, Firefox, Safari, or Edge.</p>
  `;
  document.body.appendChild(errorMessage);
  throw new Error('WebGL is not supported');
}

// Create THREE.Scene instance
const scene = new THREE.Scene();

// Set up THREE.PerspectiveCamera with FOV 50 and position at z=4
const camera = new THREE.PerspectiveCamera(
  50, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 4;

// Initialize THREE.WebGLRenderer with alpha channel and antialiasing
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  alpha: true,
  antialias: true
});

// Configure renderer pixel ratio and size to match window dimensions
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create realistic starfield background
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);
const starColors = new Float32Array(starCount * 3);

// Generate random vertex positions in spherical distribution
for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  
  // Generate random spherical coordinates
  const radius = 50 + Math.random() * 50; // Distance between 50-100 units
  const theta = Math.random() * Math.PI * 2; // Azimuthal angle (0 to 2π)
  const phi = Math.acos((Math.random() * 2) - 1); // Polar angle (0 to π)
  
  // Convert spherical to Cartesian coordinates
  starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta); // x
  starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
  starPositions[i3 + 2] = radius * Math.cos(phi); // z
  
  // Vary star sizes - most small, some medium, few large
  const sizeRandom = Math.random();
  if (sizeRandom > 0.95) {
    starSizes[i] = 2.5 + Math.random() * 1.5; // Large bright stars
  } else if (sizeRandom > 0.8) {
    starSizes[i] = 1.2 + Math.random() * 1.0; // Medium stars
  } else {
    starSizes[i] = 0.5 + Math.random() * 0.5; // Small stars
  }
  
  // Vary star colors - mostly white/blue-white, some yellow/orange
  const colorRandom = Math.random();
  if (colorRandom > 0.9) {
    // Warm stars (yellow/orange)
    starColors[i3] = 1.0;
    starColors[i3 + 1] = 0.8 + Math.random() * 0.2;
    starColors[i3 + 2] = 0.6 + Math.random() * 0.2;
  } else if (colorRandom > 0.7) {
    // Blue-white stars
    starColors[i3] = 0.8 + Math.random() * 0.2;
    starColors[i3 + 1] = 0.9 + Math.random() * 0.1;
    starColors[i3 + 2] = 1.0;
  } else {
    // Pure white stars
    starColors[i3] = 1.0;
    starColors[i3 + 1] = 1.0;
    starColors[i3 + 2] = 1.0;
  }
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

// Custom shader material for realistic stars with twinkle
const starMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vSize;
    
    void main() {
      vColor = color;
      vSize = size;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec3 vColor;
    varying float vSize;
    
    void main() {
      // Create circular star shape with soft edges
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) {
        discard;
      }
      
      // Soft falloff for glow effect
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.5);
      
      // Add subtle twinkle based on position and time
      float twinkle = sin(time * 2.0 + gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1) * 0.15 + 0.85;
      
      // Brighter core for larger stars
      float core = 1.0 - smoothstep(0.0, 0.2, dist);
      float brightness = mix(1.0, 1.5, core * (vSize / 4.0));
      
      gl_FragColor = vec4(vColor * brightness * twinkle, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

// Create the starfield and add to scene
const starfield = new THREE.Points(starGeometry, starMaterial);
scene.add(starfield);

// Create Earth sphere with realistic textures
// Create THREE.SphereGeometry with radius 1 and 64 segments
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

// Load Earth texture using THREE.TextureLoader
const textureLoader = new THREE.TextureLoader();

// Use MeshStandardMaterial for physically-based rendering
const earthMaterial = new THREE.MeshStandardMaterial({
  color: 0x2233ff, // Fallback blue color for Earth
  roughness: 0.9,
  metalness: 0.1
});

// Load multiple texture maps for realism
const earthTexture = textureLoader.load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  (texture) => {
    console.log('Earth texture loaded successfully');
    earthMaterial.map = texture;
    earthMaterial.color.setHex(0xffffff);
    earthMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.error('Error loading Earth texture:', error);
    console.warn('Using fallback solid color for Earth');
  }
);

// Load normal map for surface detail
const earthNormalMap = textureLoader.load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  (texture) => {
    console.log('Earth normal map loaded successfully');
    earthMaterial.normalMap = texture;
    earthMaterial.normalScale.set(0.85, 0.85);
    earthMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.warn('Normal map not loaded, continuing without it');
  }
);

// Load specular map for ocean reflections
const earthSpecularMap = textureLoader.load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
  (texture) => {
    console.log('Earth specular map loaded successfully');
    earthMaterial.roughnessMap = texture;
    earthMaterial.roughness = 0.7;
    earthMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.warn('Specular map not loaded, continuing without it');
  }
);

// Create Earth mesh and add to scene at center position
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, 0, 0); // Center position
scene.add(earth);

// Atmosphere glow removed

// Implement lighting system for realistic rendering
// Create THREE.DirectionalLight positioned at (5, 3, 5) with intensity 2.5 (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Create THREE.AmbientLight with intensity 0.15 (space ambient)
const ambientLight = new THREE.AmbientLight(0x404060, 0.15);
scene.add(ambientLight);

// Add hemisphere light for better atmosphere
const hemisphereLight = new THREE.HemisphereLight(0x0d1b2a, 0x000000, 0.3);
scene.add(hemisphereLight);

console.log('Space Advisor - Three.js scene initialized');

// Create concentric expanding rings with glow
const concentricRings = [];
const ringColors = [
  { color: 0x00d4ff, name: 'light blue' },  // Light blue
  { color: 0x0099cc, name: 'medium blue' }, // Medium blue
  { color: 0x0066aa, name: 'dark blue' }    // Dark blue
];

ringColors.forEach((config, index) => {
  const segments = 128;
  const ringGeometry = new THREE.BufferGeometry();
  const ringPositions = new Float32Array((segments + 1) * 3);
  
  // Create circle geometry
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    ringPositions[i * 3] = Math.cos(angle);
    ringPositions[i * 3 + 1] = 0;
    ringPositions[i * 3 + 2] = Math.sin(angle);
  }
  
  ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
  
  // Create glowing ring material with expansion and fade
  const ringMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(config.color) },
      time: { value: 0 },
      ringIndex: { value: index },
      opacity: { value: 1.0 },
      scale: { value: 1.0 }
    },
    vertexShader: `
      uniform float scale;
      void main() {
        vec3 pos = position * scale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float opacity;
      
      void main() {
        // Strong glow effect with blue tint
        vec3 glowColor = color * 2.5;
        gl_FragColor = vec4(glowColor, opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    linewidth: 3
  });
  
  const ring = new THREE.Line(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2; // Make rings horizontal
  
  scene.add(ring);
  concentricRings.push({
    mesh: ring,
    material: ringMaterial,
    startDelay: index * 0.8 // Stagger the start of each ring
  });
});

console.log('Concentric expanding rings added to scene');

// Create moon sphere with realistic textures
// Create THREE.SphereGeometry with radius 0.27
const moonGeometry = new THREE.SphereGeometry(0.27, 64, 64);

// Use MeshStandardMaterial for physically-based rendering
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888, // Fallback gray color for Moon
  roughness: 1.0,
  metalness: 0.0
});

// Load moon texture
const moonTexture = textureLoader.load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  (texture) => {
    console.log('Moon texture loaded successfully');
    moonMaterial.map = texture;
    moonMaterial.color.setHex(0xffffff);
    moonMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.error('Error loading Moon texture:', error);
    console.warn('Using fallback solid color for Moon');
  }
);

// Create moon mesh
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

// Position moon 3.5 units from Earth center
moon.position.set(3.5, 0, 0);

// Add moon mesh to scene
scene.add(moon);

console.log('Moon sphere added to scene');

// Moon orbit variables
let moonOrbitAngle = 0;
const moonOrbitRadius = 3.5;
const moonOrbitSpeed = 0.008;

// Ring animation variables
const ringAnimationSpeed = 0.015;
const ringMaxScale = 3.5;
const ringStartScale = 1.2;

// Create animate() function using requestAnimationFrame
function animate() {
  requestAnimationFrame(animate);
  
  // Update star twinkle animation
  starMaterial.uniforms.time.value += 0.01;
  
  // Animate concentric rings - expand and fade
  concentricRings.forEach((ring) => {
    ring.material.uniforms.time.value += ringAnimationSpeed;
    
    // Calculate animation progress with staggered start
    const progress = (ring.material.uniforms.time.value - ring.startDelay) % 4.0;
    
    if (progress > 0) {
      // Normalize progress to 0-1
      const normalizedProgress = progress / 4.0;
      
      // Scale grows from start to max
      const scale = ringStartScale + (ringMaxScale - ringStartScale) * normalizedProgress;
      ring.material.uniforms.scale.value = scale;
      
      // Opacity fades out as ring expands
      const opacity = Math.max(0, 1.0 - normalizedProgress);
      ring.material.uniforms.opacity.value = opacity * 0.8;
    } else {
      // Ring hasn't started yet
      ring.material.uniforms.opacity.value = 0;
    }
  });
  
  // Add Earth rotation on Y-axis at 0.003 radians per frame
  earth.rotation.y += 0.003;
  
  // Animate moon orbit around Earth
  moonOrbitAngle += moonOrbitSpeed;
  moon.position.x = Math.cos(moonOrbitAngle) * moonOrbitRadius;
  moon.position.z = Math.sin(moonOrbitAngle) * moonOrbitRadius;
  
  // Call renderer.render() to draw scene each frame
  renderer.render(scene, camera);
}

// Start animation loop
animate();

// Implement responsive window resize handling
// Add window resize event listener
window.addEventListener('resize', () => {
  // Update camera aspect ratio on resize
  camera.aspect = window.innerWidth / window.innerHeight;
  
  // Call camera.updateProjectionMatrix()
  camera.updateProjectionMatrix();
  
  // Update renderer size to match new window dimensions
  renderer.setSize(window.innerWidth, window.innerHeight);
});
