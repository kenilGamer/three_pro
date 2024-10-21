import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // Import the RGBELoader
import { TextureLoader } from 'three'; // Import the TextureLoader

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 10;

// Real-time loader for dynamic content
const loader = new THREE.LoadingManager();
loader.onStart = function(url, itemsLoaded, totalItems) {
    console.log("Starting to load..."+ itemsLoaded + " items loaded "+ totalItems);
    // Animation for loader start
    gsap.to('.loader', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
    });
};
loader.onLoad = function() {
    console.log("Loading complete.");
    // Animation for loader complete
    gsap.to('.loader', {
        opacity: 0,
        duration: 0.5,
        // ease: 'power2.out',
        onComplete: function() {
            // Optionally, you can add a delay before hiding the loader
            setTimeout(() => {
                document.querySelector('.loader').style.display = 'none';
            }, 1000);
        }
    });
};
loader.onProgress = function(url, itemsLoaded, totalItems) {
    console.log("Loading item " + itemsLoaded + "/" + totalItems);
    // Optionally, you can animate the progress bar here
    
};
loader.onError = function(url) {
    console.log("Error loading " + url);
    // Optionally, you can animate an error message here
};

const rgbLoader = new RGBELoader(loader); // Create an instance of RGBELoader with the loader
rgbLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/klippad_dawn_1_2k.hdr', (texture) => { // Load your HDR image
    texture.mapping = THREE.EquirectangularReflectionMapping; // Set the mapping
    scene.environment = texture; // Set the environment map
    // scene.background = texture; // Optionally set the background
});
 
// Enhanced sphere rendering for better texture display
const radius = 1.2;
const segments = 100;
const spheres = new THREE.Group();
const cos =  4.3;
<<<<<<< HEAD
const textures = ["/public/csilla/color.png","/public/earth/map.jpg",'/public/venus/map.jpg','/public/volcanic/color1.png']
=======
const textures = ["/public/csilla/color.png","/public/earth/map.jpg",'/public/venus/map.jpg','/public/volcanic/color.png']
const color = ["#df33ff",   "#ffff00", "#02ff00", "#fd3022"]
>>>>>>> parent of 76c4e49 (gg)
const bigSphereGeometry = new THREE.SphereGeometry(50, 64, 65);
const bigSphereTextureLoader = new THREE.TextureLoader(loader);
const bigSphereTexture = bigSphereTextureLoader.load('/public/stars.jpg');
const bigSphereMaterial = new THREE.MeshPhysicalMaterial({ map: bigSphereTexture, side: THREE.BackSide,});
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
// Rotate the sphere by 90 degrees on the x-axis
scene.add(bigSphere);

for(let i = 0; i<4; i++){
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const textureLoader = new TextureLoader(loader); // Create an instance of TextureLoader with the loader
    const texture = textureLoader.load(textures[i]); // Load the texture

    // Example of applying the texture to the material
    const material = new THREE.MeshStandardMaterial({
        map: texture, // Apply the loaded texture   ,
        roughness: 1,
        metalness: 0.5,
    });

    const cube = new THREE.Mesh(geometry, material);
    const angle = (i / 4) * (Math.PI * 2);
    cube.position.x = cos * Math.cos(angle)
    cube.position.z = cos * Math.sin(angle)

    spheres.rotation.x = 0.15
    cube.position.y = -0.54
    spheres.add(cube); 
}
scene.add(spheres);

// Animation for a dynamic view
setInterval(() => {
    gsap.to(spheres.rotation,{
        y: `+=${Math.PI /2}`,
        duration:2.3 // Repeat the animation indefinitely.
    })
}, 5000);

function animate() {
    requestAnimationFrame(animate);
    // controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
onWindowResize(); // Call once to set initial size
