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

// Add a callback for when all items are loaded
loader.onLoad = () => {
    console.log('All items loaded!');
    // Hide loader animation or perform any other actions needed
    gsap.to('.loader', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
};

const textures = ["/public/csilla/color.png","/public/earth/map.jpg",'/public/venus/map.jpg','/public/volcanic/color.png', '/public/stars.jpg']; // Added stars texture

const bigSphereTextureLoader = new THREE.TextureLoader(loader); // Ensure this loader is aware of the big sphere texture
const bigSphereTexture = bigSphereTextureLoader.load('/public/stars.jpg'); // Load the big sphere texture

for(let i = 0; i<textures.length; i++){ // Ensure all textures are loaded
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const textureLoader = new THREE.TextureLoader(loader); // Create an instance of TextureLoader with the loader
    const texture = textureLoader.load(textures[i]); // Load the texture
    // ... existing code ...
}
