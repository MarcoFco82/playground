import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, ship;
let shipColor = 0xffffff;
let bgColor = 0x000000;
let keys = {};

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Light setup
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // GLTF Loader
    const loader = new GLTFLoader();
    loader.load('assets/ship.glb', function (gltf) {
        ship = gltf.scene;
        ship.traverse(function (node) {
            if (node.isMesh) {
                node.material.color.setHex(shipColor);
            }
        });
        scene.add(ship);
    });

    // Event listeners
    document.getElementById('color').addEventListener('input', (event) => {
        shipColor = parseInt(event.target.value.replace('#', '0x'));
        if (ship) {
            ship.traverse(function (node) {
                if (node.isMesh) {
                    node.material.color.setHex(shipColor);
                }
            });
        }
    });

    document.getElementById('bgColor').addEventListener('input', (event) => {
        bgColor = parseInt(event.target.value.replace('#', '0x'));
        scene.background = new THREE.Color(bgColor);
    });

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (ship) {
        ship.rotation.y += 0.01;

        if (keys['ArrowUp']) ship.position.y += 0.05;
        if (keys['ArrowDown']) ship.position.y -= 0.05;
        if (keys['ArrowLeft']) ship.position.x -= 0.05;
        if (keys['ArrowRight']) ship.position.x += 0.05;
    }

    renderer.render(scene, camera);
}
