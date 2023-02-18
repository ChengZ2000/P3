import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.149.0/examples/jsm/loaders/GLTFLoader.js' ;
import { OrbitControls } from 'https://unpkg.com/three@0.149.0/examples/jsm/controls/OrbitControls.js' ;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000);
camera.rotation.y = 45/180*Math.PI;
camera.position.x = 800;
camera.position.y = 100;
camera.position.z = 1000;

const light = new THREE.AmbientLight( 0x404040,3 );
scene.add( light );

const directionalLight = new THREE.DirectionalLight(0xffffff,2);
directionalLight.position.set(-1,3,0);
directionalLight.castShadow = true;
scene.add(directionalLight);

const light0 = new THREE.PointLight(0xc4c4c4,0.1);
light0.position.set(0,300,500);
light0.castShadow = true;
scene.add(light0);

const light2 = new THREE.PointLight(0xc4c4c4,0.1);
light2.position.set(500,100,0);
light2.castShadow = true;
scene.add(light2);

const light3 = new THREE.PointLight(0xc4c4c4,0.1);
light3.position.set(0,100,-500);
light3.castShadow = true;
scene.add(light3);

const light4 = new THREE.PointLight(0xc4c4c4,0.1);
light4.position.set(-500,300,500);
light4.castShadow = true;
scene.add(light4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {renderer.render(scene, camera)});
controls.target.set(0, 0, 0);
controls.update();


const loader = new GLTFLoader();
loader.load('./models/mazda_rx8.glb', function (gltf){
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
    renderer.render(scene, camera);
});
