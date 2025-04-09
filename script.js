import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- Basic Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2500); // Increased far plane for stars
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- CSS2D Renderer Setup ---
const css2dRenderer = new CSS2DRenderer();
css2dRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('css2d-container').appendChild(css2dRenderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2.5, 1500);
scene.add(pointLight);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 1000; // Increased max distance to see stars better

// --- Data for Planets (Same as previous version) ---
const planetsData = [
    { name: 'Mercury', radius: 0.5, color: 0xd8d8d8, distance: 12, orbitSpeed: 0.010, rotationSpeed: 0.01, emissiveIntensity: 0.6 },
    { name: 'Venus', radius: 0.9, color: 0xfff4c1, distance: 18, orbitSpeed: 0.007, rotationSpeed: 0.005, emissiveIntensity: 0.8 },
    { name: 'Earth', radius: 1.0, color: 0x6699ff, distance: 25, orbitSpeed: 0.005, rotationSpeed: 0.05, emissiveIntensity: 0.7, moons: [
        { name: 'Moon', radius: 0.3, color: 0xe0e0e0, distance: 3, orbitSpeed: 0.02, rotationSpeed: 0.01, emissiveIntensity: 0.5 }
    ]},
    { name: 'Mars', radius: 0.7, color: 0xff8c66, distance: 35, orbitSpeed: 0.004, rotationSpeed: 0.045, emissiveIntensity: 0.6 },
    { name: 'Jupiter', radius: 3.5, color: 0xffddaa, distance: 55, orbitSpeed: 0.002, rotationSpeed: 0.10, emissiveIntensity: 0.7 },
    { name: 'Saturn', radius: 3.0, color: 0xfff6a0, distance: 75, orbitSpeed: 0.0015, rotationSpeed: 0.09, emissiveIntensity: 0.7, hasRings: true },
    { name: 'Uranus', radius: 2.0, color: 0xadf8ff, distance: 95, orbitSpeed: 0.001, rotationSpeed: 0.06, emissiveIntensity: 0.5 },
    { name: 'Neptune', radius: 1.9, color: 0x7aa0ff, distance: 115, orbitSpeed: 0.0008, rotationSpeed: 0.055, emissiveIntensity: 0.5 },
];

// Store planet objects for animation
const planetObjects = [];

// --- Helper Functions (createSphere, createOrbitPath, createLabel - unchanged) ---

function createSphere(radius, color, emissiveIntensity = 0) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: emissiveIntensity,
        roughness: 0.8,
        metalness: 0.1
     });
    return new THREE.Mesh(geometry, material);
}

function createOrbitPath(radius) {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x444444 });
    return new THREE.LineLoop(geometry, material);
}

function createLabel(text) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = text;
    const label = new CSS2DObject(div);
    label.position.set(0, 1.5, 0);
    label.layers.set(0);
    return label;
}

// --- Create Starfield ---
function createStarfield() {
    const starCount = 10000; // Number of stars
    const starVertices = [];
    const starRadius = 1500; // Radius within which stars are generated

    for (let i = 0; i < starCount; i++) {
        // Generate random points on the surface of a sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u; // Azimuthal angle
        const phi = Math.acos(2 * v - 1); // Polar angle

        const x = starRadius * Math.sin(phi) * Math.cos(theta);
        const y = starRadius * Math.sin(phi) * Math.sin(theta);
        const z = starRadius * Math.cos(phi);

        starVertices.push(x, y, z);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // White stars
        size: 1.0, // Adjust size as needed
        sizeAttenuation: true, // Stars farther away appear smaller
        transparent: true, // Allows for softer edges if using a texture map later
        opacity: 0.8 // Slightly transparent
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

createStarfield(); // Call the function to add stars to the scene

// --- Create Sun ---
const sunRadius = 5;
const sun = createSphere(sunRadius, 0xffcc33, 1.2);
scene.add(sun);
pointLight.position.copy(sun.position);


// --- Create Planets, Moons, Rings, Labels, and Orbits (Code unchanged)---
planetsData.forEach(data => {
    const orbit = new THREE.Object3D();
    scene.add(orbit);
    const planetMesh = createSphere(data.radius, data.color, data.emissiveIntensity);
    planetMesh.position.x = data.distance;
    orbit.add(planetMesh);
    const orbitPath = createOrbitPath(data.distance);
    scene.add(orbitPath);
    const label = createLabel(data.name);
    label.position.y = data.radius * 1.3 + 0.5;
    planetMesh.add(label);
    const planetInfo = { mesh: planetMesh, orbit: orbit, label: label, data: data };
    planetObjects.push(planetInfo);
    if (data.moons) {
        data.moons.forEach(moonData => {
            const moonOrbit = new THREE.Object3D();
            planetMesh.add(moonOrbit);
            const moonMesh = createSphere(moonData.radius, moonData.color, moonData.emissiveIntensity);
            moonMesh.position.x = moonData.distance;
            moonOrbit.add(moonMesh);
            const moonLabel = createLabel(moonData.name);
            moonLabel.position.y = moonData.radius * 1.3 + 0.2;
            moonMesh.add(moonLabel);
            const moonOrbitPath = createOrbitPath(moonData.distance);
            planetMesh.add(moonOrbitPath);
            if (!planetInfo.moonSystems) planetInfo.moonSystems = [];
            planetInfo.moonSystems.push({
                mesh: moonMesh, orbit: moonOrbit, label: moonLabel, data: moonData
            });
        });
    }
    if (data.hasRings) {
        const innerRadius = data.radius * 1.3;
        const outerRadius = data.radius * 2.2;
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        ringGeometry.rotateX(-Math.PI / 2);
        const ringMaterial = new THREE.MeshBasicMaterial({
             color: 0xeeeeee, side: THREE.DoubleSide, transparent: true, opacity: 0.5
            });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        planetMesh.add(ringMesh);
        planetInfo.rings = ringMesh;
    }
});


// --- Camera Position ---
camera.position.set(0, 80, 180); // Pulled camera back slightly more
camera.lookAt(scene.position);

// --- Animation Loop (Unchanged) ---
const clock = new THREE.Clock();
const simulationSpeedFactor = 0.7;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    sun.rotation.y += 0.001 * simulationSpeedFactor;

    planetObjects.forEach(p => {
        p.orbit.rotation.y += p.data.orbitSpeed * simulationSpeedFactor;
        p.mesh.rotation.y += p.data.rotationSpeed * simulationSpeedFactor;
        if (p.moonSystems) {
            p.moonSystems.forEach(m => {
                m.orbit.rotation.y += m.data.orbitSpeed * simulationSpeedFactor;
                m.mesh.rotation.y += m.data.rotationSpeed * simulationSpeedFactor;
            });
        }
    });

    controls.update();
    renderer.render(scene, camera);
    css2dRenderer.render(scene, camera);
}

// --- Handle Window Resize (Unchanged) ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    css2dRenderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// --- Start Animation ---
animate();