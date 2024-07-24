console.log("Bienvenido a mi portafolio!");

// Basic Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000080);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional for softer shadows

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Stylized lighting setup
// Ambient light for basic illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft white light
scene.add(ambientLight);

// Directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5); // Position the light source
directionalLight.castShadow = true; // Enable shadows
directionalLight.shadow.mapSize.width = 2048; // Optional for higher quality shadows
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
scene.add(directionalLight);

// Point light for dramatic effect
const pointLight = new THREE.PointLight(0xff0000, 1, 100); // Red light
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true; // Enable shadows
pointLight.shadow.mapSize.width = 2048; // Optional for higher quality shadows
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 500;
scene.add(pointLight);

// Camera position
camera.position.set(0, 5, 10);

// Load models
const loader = new THREE.GLTFLoader();
let ship, pillars;
let shipBox, pillarBoxes = [];

loader.load('assets/ship.glb', (gltf) => {
    ship = gltf.scene;
    ship.position.set(0, 2, 0); // Set the initial position higher on the Y axis
    ship.rotation.y = THREE.Math.degToRad(45); // Rotate the ship 45 degrees counterclockwise around the Y-axis
    ship.scale.set(0.25, 0.25, 0.25); // Scale the ship to 0.25
    
    ship.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(ship);
    createBoundingBoxes();
});

loader.load('assets/pillars.glb', (gltf) => {
    pillars = gltf.scene;
    pillars.position.set(0, 0, 0);
    
    pillars.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(pillars);
    createBoundingBoxes();
});

function createBoundingBoxes() {
    if (ship) {
        shipBox = new THREE.Box3().setFromObject(ship);
    }
    if (pillars) {
        pillars.traverse((child) => {
            if (child.isMesh) {
                const box = new THREE.Box3().setFromObject(child);
                pillarBoxes.push(box);
            }
        });
    }
}

function checkCollisions() {
    if (ship) {
        shipBox.setFromObject(ship);
        for (let i = 0; i < pillarBoxes.length; i++) {
            if (shipBox.intersectsBox(pillarBoxes[i])) {
                console.log('Collision detected!');
                // Handle collision (e.g., stop movement, bounce back, etc.)
            }
        }
    }
}

let keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function update() {
    if (ship) {
        // Update ship position based on keys
        if (keys['ArrowUp']) ship.position.z -= 0.1;
        if (keys['ArrowDown']) ship.position.z += 0.1;
        if (keys['ArrowLeft']) ship.position.x -= 0.1;
        if (keys['ArrowRight']) ship.position.x += 0.1;
        
        // Check collisions
        checkCollisions();
        
        // Make the camera follow the ship
        camera.position.set(ship.position.x, ship.position.y + 5, ship.position.z + 10);
        camera.lookAt(ship.position);
    }
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}