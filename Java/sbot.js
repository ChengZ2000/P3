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
camera.position.set(5, 0, 0);
// Set the camera look-at point
camera.lookAt(0, 0, 0);

const rgbeLoader = new RGBELoader();
// Load the HDR file
rgbeLoader.load('./assets/drakensberg_solitary_mountain_puresky_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.encoding = THREE.LinearEncoding;
  scene.environment = texture;
});

// Add light on the left side
const frontLightLeft = new THREE.PointLight(0xffffff, 0.5);
frontLightLeft.position.set(-10, 10, 20);
frontLightLeft.castShadow = true;
scene.add(frontLightLeft);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {renderer.render(scene, camera)});
controls.target.set(0, 0, 0);
controls.update();

let clock;
let mixer;
let activeAction;

const loader = new GLTFLoader();
let model; 
loader.load('./models/security robot.glb', function (gltf) {
  model = gltf.scene;
  model.position.set(0, 0.5, 0);
  scene.add(model);

  const animations = gltf.animations;
  mixer = new THREE.AnimationMixer(model);

  const clipActions = animations.map((clip) => mixer.clipAction(clip));

  activeAction = clipActions[0];
  activeAction.play();
  clock = new THREE.Clock();

  document.getElementById('animation1').addEventListener('click', () => switchAnimation(clipActions, 0));
  document.getElementById('animation2').addEventListener('click', () => switchAnimation(clipActions, 1));
});

const activeClipActions = [];

function switchAnimation(clipActions, index) {
  if (!activeClipActions.includes(clipActions[index])) {
    activeClipActions.push(clipActions[index]);
    
    clipActions[index].reset().play();
  } else {
    const actionIndex = activeClipActions.indexOf(clipActions[index]);
    clipActions[index].stop();
    activeClipActions.splice(actionIndex, 1);
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


