import * as THREE from "three";

export const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // camera.position.z = 5;
  // const vector = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z );
  // camera.lookAt( vector );
  // const cameraOrt = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
  // camera.rotation.z = Math.PI * 0.5;

  camera.position.z = 0.1; //how tall is the character
  camera.position.y = -2;
  camera.rotation.x = Math.PI * 0.5;

  return camera;
}


export const createLight = () => {
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, -3, 1);
// light.position.set(0, -3, 7);  

// FOR SHADOWS
// light.castShadow = true;
// //Set up shadow properties for the light
// light.shadow.mapSize.width = 512; // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5; // default
// light.shadow.camera.far = 500; // default

return light;
}

export const createRenderer = (rootElement: HTMLDivElement | null) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // FOR SHADOWS
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (rootElement) {
    rootElement.appendChild(renderer.domElement);
  }

  return renderer;
}


export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  return scene;
}



export const animate = (callback: (time: number)=>void) => {
  function loop(time: number) {
    callback(time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}




export const rotateObject = (object: {rotation: any}, axis: string, angle: number) => {
  object.rotation[axis] = (Math.PI * 0.5) / 90 * angle;   
};
  

// export const createRectangle = ({ color, x, y, z, sizeX, sizeY, sizeZ }) => {
//   const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
//   const material = new THREE.MeshLambertMaterial({ color });
//   const rectangle = new THREE.Mesh(geometry, material);
//   rectangle.position.set(x, y, z);

//   return rectangle;
// }