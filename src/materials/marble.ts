import * as THREE from 'three';
import BaseMap from './textures/marble/Marble_Blue_003_COLOR.jpg';
import HeightMap from './textures/marble/Marble_Blue_003_DISP.png';
import NormalMap from './textures/marble/Marble_Blue_003_NORM.jpg';
import RoughnessMap from './textures/marble/Marble_Blue_003_ROUGH.jpg';
import AmbientOcclusionMap from './textures/marble/Marble_Blue_003_OCC.jpg';


const textureLoader = new THREE.TextureLoader();

const marbleBaseColor = textureLoader.load(BaseMap);
const marbleNormalMap = textureLoader.load(NormalMap);
const marbleHeightMap = textureLoader.load(HeightMap);
const marbleRoughnessMap = textureLoader.load(RoughnessMap);
const marbleAmbientOcclusionMap = textureLoader.load(AmbientOcclusionMap);


export const makeMarbleMaterial = (envMap?: THREE.Texture) => new THREE.MeshStandardMaterial(
  {
    map: marbleBaseColor,
    normalMap: marbleNormalMap,
    // displacementMap: marbleHeightMap,
    // displacementScale: 0.05,
    roughnessMap: marbleRoughnessMap,
    roughness: 0.5,
    aoMap: marbleAmbientOcclusionMap,
    metalness: 1, 
    envMap: envMap,
  },
);