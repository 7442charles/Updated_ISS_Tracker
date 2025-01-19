import * as THREE from "three";
import { drawThreeGeo } from './lib/threeGeoJSON.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Enable controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

var planet = new THREE.Object3D();
scene.add(planet);

// Create a sphere to make visualization easier.
var geometry = new THREE.SphereGeometry(10, 32, 32);
var material = new THREE.MeshBasicMaterial({
  color: 0x333333,
  wireframe: true,
  transparent: true
});
var sphere = new THREE.Mesh(geometry, material);

// Apply Earth's axial tilt (23.5 degrees) along the X-axis
sphere.rotation.x = THREE.MathUtils.degToRad(23.5); // Tilt the globe by 23.5 degrees

planet.add(sphere);

// Draw the GeoJSON
fetch("./test_geojson/countries.json")
  .then((response) => response.text())
  .then((text) => {
    const data = JSON.parse(text);
    // json, radius, shape, materialOptions, container
    drawThreeGeo(data, 10, 'sphere', {
      color: 0x80FF80
    }, planet);
  });

fetch("./test_geojson/rivers.geojson")
  .then((response) => response.text())
  .then((text) => {
    const data = JSON.parse(text);
    drawThreeGeo(data, 10, 'sphere', {
      color: 0x8080FF
    }, planet);
  });

// Global variable to track the ISS marker sprite
let issMarker = null;

// Function to add marker with image at given latitude and longitude
function addMarkerWithImage(latitude, longitude, radius, imageUrl) {
  const latRad = THREE.MathUtils.degToRad(latitude); // Convert latitude to radians
  const lonRad = THREE.MathUtils.degToRad(longitude); // Convert longitude to radians

  // Convert to 3D coordinates
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);

  // Load the PNG texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageUrl, (texture) => {
    // Remove the previous marker if it exists
    if (issMarker) {
      planet.remove(issMarker);
    }

    // Create the image sprite
    const imageSpriteMaterial = new THREE.SpriteMaterial({ map: texture });
    issMarker = new THREE.Sprite(imageSpriteMaterial);
    issMarker.scale.set(1, 1, 1); // Set the size of the image sprite

    // Position the sprite
    issMarker.position.set(x, y, z); // Image sprite position

    // Add the image sprite to the planet
    planet.add(issMarker);
  });
}

// Function to fetch ISS data and update marker position
function updateISSPosition() {
  const radius = 10; // Radius of the globe
  const markerImage = 'ISS.png';

  fetch("https://api.wheretheiss.at/v1/satellites/25544")
    .then(response => response.json())
    .then(data => {
      const latitude = data.latitude;
      const longitude = data.longitude;

      // Update the marker with the ISS position
      addMarkerWithImage(latitude, longitude, radius, markerImage);

      // Display the latitude and longitude in the UI
      document.getElementById("latitude").textContent = `Latitude: ${latitude.toFixed(4)}`;
      document.getElementById("longitude").textContent = `Longitude: ${longitude.toFixed(4)}`;
    })
    .catch(err => console.error("Error fetching ISS data:", err));
}

// Update the ISS position every 2 seconds
setInterval(updateISSPosition, 2000);

// Adding the Earth rotation speed indicator (Arrow)
const arrowLength = 2;
const arrowColor = 0xff0000; // Red color for the arrow
const arrowHelper = new THREE.ArrowHelper(
  new THREE.Vector3(1, 0, 0), // Direction of the arrow (along the equator or axis)
  new THREE.Vector3(0, 0, 0), // Position at the center of the globe
  arrowLength, // Length of the arrow
  arrowColor // Color of the arrow
);
planet.add(arrowHelper);

// Function to animate Earth's rotation (slowly over time)
function animateEarthRotation() {
  planet.rotation.y += 0.001; // Slow rotation to simulate Earth's spin
  controls.update();
  requestAnimationFrame(animateEarthRotation);
  renderer.render(scene, camera);
}

// Call the function to start animation
animateEarthRotation();

function render() {
  controls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
