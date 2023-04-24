import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.149.0/examples/jsm/loaders/GLTFLoader.js' ;
import { OrbitControls } from 'https://unpkg.com/three@0.149.0/examples/jsm/controls/OrbitControls.js' ;
import { RGBELoader } from 'https://unpkg.com/three@0.149.0/examples/jsm/loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9499a1);
// Create a perspective camera
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
// Set the camera position
camera.position.set(-5, 20, 40);
// Set the camera look-at point
camera.lookAt(0, 25, 0);

const rgbeLoader = new RGBELoader();
// Load the HDR file
rgbeLoader.load('./assets/drakensberg_solitary_mountain_puresky_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.encoding = THREE.LinearEncoding;
  scene.environment = texture;
});

const frontLightLeft = new THREE.PointLight(0xffffff, 0.5);
frontLightLeft.position.set(-10, 10, 20);
frontLightLeft.castShadow = true;
scene.add(frontLightLeft);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {renderer.render(scene, camera)});
controls.target.set(0, 10, 0);
controls.update();

let clock;
let mixer;
let activeAction;

const loader = new GLTFLoader();
let model; 
loader.load('./models/ani test.glb', function (gltf) {
  model = gltf.scene;
  model.position.set(0, -5, 0);
  scene.add(model);

  const animations = gltf.animations;
  mixer = new THREE.AnimationMixer(model);

  const clipActions = animations.map((clip) => mixer.clipAction(clip));

  activeAction = clipActions[0];
  activeAction.play();
  clock = new THREE.Clock();

  document.getElementById('animation1').addEventListener('click', () => switchAnimation(clipActions, 0));
  document.getElementById('animation2').addEventListener('click', () => switchAnimation(clipActions, 1));
  document.getElementById('animation3').addEventListener('click', () => switchAnimation(clipActions, 2));
});

function switchAnimation(clipActions, index) {
  if (activeAction !== clipActions[index]) {
      const previousAction = activeAction;
      activeAction = clipActions[index];
      previousAction.fadeOut(0.5);
      activeAction.reset().fadeIn(0.5).play();
  }
}

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  
    if (mixer) {
      const deltaSeconds = clock.getDelta();
      mixer.update(deltaSeconds);
    }
}

animate();


