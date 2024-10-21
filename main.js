import gsap from "/node_modules/.vite/deps/gsap.js?v=6697872f";
import * as THREE from "/node_modules/.vite/deps/three.js?v=6697872f";
import { OrbitControls } from "/node_modules/.vite/deps/three_examples_jsm_controls_OrbitControls__js.js?v=6697872f";
import { RGBELoader } from "/node_modules/.vite/deps/three_examples_jsm_loaders_RGBELoader__js.js?v=6697872f"; // Import the RGBELoader
import { TextureLoader } from "/node_modules/.vite/deps/three.js?v=6697872f"; // Import the TextureLoader

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 10;

// Real-time loader for dynamic content
const loader = new THREE.LoadingManager();
loader.onStart = (url, itemsLoaded, totalItems) => {
    console.log(`Starting to load... ${itemsLoaded} items loaded ${totalItems}`);
    // Animation for loader start
    gsap.to('.loader', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
    });
};
loader.onLoad = () => {
    console.log("Loading complete.");
    // Animation for loader complete
    gsap.to('.loader', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            // Optionally, you can add a delay before hiding the loader
            setTimeout(() => {
                document.querySelector('.loader').style.display = 'none';
            }, 1000);
        }
    });
};
loader.onProgress = (url, itemsLoaded, totalItems) => {
    console.log(`Loading item ${itemsLoaded}/${totalItems}`);
    // Optionally, you can animate the progress bar here
    
};
loader.onError = (url) => {
    console.log(`Error loading ${url}`);
    // Optionally, you can animate an error message here
};

const rgbLoader = new RGBELoader(loader); // Create an instance of RGBELoader with the loader
rgbLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rogland_moonlit_night_2k.hdr', (texture) => { // Load your HDR image
    texture.mapping = THREE.EquirectangularReflectionMapping; // Set the mapping
    scene.environment = texture; // Set the environment map
    // scene.background = texture; // Optionally set the background
});
 
// Enhanced sphere rendering for better texture display
const radius = 1.2;
const segments = 100;
const spheres = new THREE.Group();
const cos =  4.3;
const textures = ["/public/csilla/color.png","/public/earth/map.jpg",'/public/venus/map.jpg','/public/volcanic/color1.png']
const bigSphereGeometry = new THREE.SphereGeometry(50, 64, 65);
const bigSphereTextureLoader = new THREE.TextureLoader(loader);
const bigSphereTexture = bigSphereTextureLoader.load('/public/stars.jpg');
const bigSphereMaterial = new THREE.MeshPhysicalMaterial({ map: bigSphereTexture, side: THREE.BackSide,});
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
// Rotate the sphere by 90 degrees on the x-axis
scene.add(bigSphere);
const spheresMesh = [];
for(let i = 0; i<4; i++){
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const textureLoader = new TextureLoader(loader); // Create an instance of TextureLoader with the loader
    const texture = textureLoader.load(textures[i]); // Load the texture
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Example of applying the texture to the material
    const material = new THREE.MeshStandardMaterial({
        map: texture, // Apply the loaded texture   ,
        roughness: 0.8,
        metalness: 0.5,
        emissive: new THREE.Color(0x000000), // Add emissive color for soft lighting
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    spheresMesh.push(sphere);
    const angle = (i / 4) * (Math.PI * 2);
    sphere.position.x = cos * Math.cos(angle);
    sphere.position.z = cos * Math.sin(angle);

    spheres.add(sphere); 
}
spheres.rotation.x = 0.15;
spheres.position.y = -0.54;
scene.add(spheres);

// Animation for a dynamic view
// setInterval(() => {
//     gsap.to(spheres.rotation, {
//         y: `+=${Math.PI / 2}`,
//         duration: 2.3,
//         // repeat: Infinity,
//         ease: "linear"
//     });
// }, 5000);

// Throttle function
let lastWheelTime = 0;
const throttleTime =  2000;
const throttle = (fn, limit) => (event) => {
    const currentTime = Date.now();
    if(currentTime - lastWheelTime >= throttleTime){
        lastWheelTime = currentTime;
        fn(event);
    }
};

let scrollcount  = 0;
// Wheel event handler
const handleWheel = (event) => {
    // scrollcount++;
    scrollcount = (scrollcount + 1)% 4;
    const direction = event.deltaY < 0 ? 'up' : 'down';
    const heading = document.querySelectorAll('.heading');
    const paragraph = document.querySelectorAll('.paragraph');
    gsap.to(heading, {
        y: `-=${100}%`,
        duration: 1,
        ease: "power2.out",
     
    });
    gsap.to(paragraph, {
        y: `-=${100}%`,
        duration: 1,
        ease: "power2.out",
     
    });
    gsap.to(spheres.rotation, {
        y: `-=${Math.PI / 2}`,
        duration: 1,
        ease: "linear"
    });
   if(scrollcount === 0){
    gsap.to(heading, {
        y: 0,
        duration: 1,
        ease: "power2.out",
    })
    gsap.to(paragraph, {
        y: 0,
        duration: 1,
        ease: "power2.out",
    })
   }
    console.log(scrollcount);
}

// Attach throttled wheel event
const throttledWheelHandler = throttle(handleWheel, 2000);
window.addEventListener('wheel', throttledWheelHandler);

const clock = new THREE.Clock();
const animate = () => {
    requestAnimationFrame(animate);
    for(let i = 0; i<spheresMesh.length; i++){
        const sphere = spheresMesh[i];
        
        sphere.rotation.y = clock.getElapsedTime() * Math.PI * 2 * 0.003;
    }
    // controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
onWindowResize(); // Call once to set initial size
