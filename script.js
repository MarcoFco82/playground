console.log("Bienvenido a mi portafolio!");
// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);

// Camera position
camera.position.set(0, 5, 10);

// Load models
const loader = new THREE.GLTFLoader();
let ship, pillars;
let shipBox, pillarBoxes = [];

loader.load('assets/ship.glb', (gltf) => {
    ship = gltf.scene;
    ship.position.set(0, 2, 0);
    ship.rotation.y = THREE.Math.degToRad(45);
    scene.add(ship);
    createBoundingBoxes();
});

loader.load('assets/pillars.glb', (gltf) => {
    pillars = gltf.scene;
    pillars.position.set(0, 0, 0);
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
        if (keys['ArrowUp']) ship.position.z -= 0.1;
        if (keys['ArrowDown']) ship.position.z += 0.1;
        if (keys['ArrowLeft']) ship.position.x -= 0.1;
        if (keys['ArrowRight']) ship.position.x += 0.1;
        checkCollisions();
    }
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();
