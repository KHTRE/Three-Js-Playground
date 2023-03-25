import * as THREE from 'three';
import BaseMap from './textures/damascus/Metal_Damascus_Steel_001_basecolor.jpg';
import HeightMap from './textures/damascus/Metal_Damascus_Steel_001_height.png';
import NormalMap from './textures/damascus/Metal_Damascus_Steel_001_normal.jpg';
import MetallicMap from './textures/damascus/Metal_Damascus_Steel_001_metallic.jpg';
import RoughnessMap from './textures/damascus/Metal_Damascus_Steel_001_roughness.jpg';
import AmbientOcclusionMap from './textures/damascus/Metal_Damascus_Steel_001_ambientOcclusion.jpg';


const textureLoader = new THREE.TextureLoader();

const damascusBaseColor = textureLoader.load(BaseMap);
const damascusNormalMap = textureLoader.load(NormalMap);
const damascusHeightMap = textureLoader.load(HeightMap);
const damascusRoughnessMap = textureLoader.load(RoughnessMap);
const damascusAmbientOcclusionMap = textureLoader.load(AmbientOcclusionMap);
const damascusMetallic = textureLoader.load(MetallicMap);


export const makeDamascusMaterial = (envMap?: THREE.Texture) => new THREE.MeshStandardMaterial(
  {
    map: damascusBaseColor,
    normalMap: damascusNormalMap,
    // displacementMap: damascusHeightMap,
    // displacementScale: 0.05,
    roughnessMap: damascusRoughnessMap,
    roughness: 0.5,
    aoMap: damascusAmbientOcclusionMap,
    metalnessMap: damascusMetallic,
    metalness: 1, 
    envMap: envMap,
  },
);