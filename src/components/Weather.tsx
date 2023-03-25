/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { animate, createCamera, createLight, createRenderer, createScene, rotateObject } from './helpers';
import { InteractionManager } from "three.interactive";
import { css } from '@emotion/react';
// @ts-expect-error
import SkyHDRIBlur from '../materials/textures/hdri/HDR_029_Sky_Cloudy_Env.hdr';
// @ts-expect-error
import SkyHDRISharp from '../materials/textures/hdri/HDR_029_Sky_Cloudy_Ref.hdr';
// @ts-expect-error
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-expect-error
import { GLTFLoader, GltfAsset } from 'three/addons/loaders/GLTFLoader.js';
// @ts-expect-error
import Monday from '../models/days/Monday.glb';
import { makeDamascusMaterial } from '../materials/damascus';
import { Group, Texture } from 'three';
import { makeMarbleMaterial } from '../materials/marble';
import LoadingSpinner from './LoadingSpinner';


const styles = {
  counter: css`    
    position: fixed;
    top: 0;
    z-index: 3;
    background-color: red;
  `,

  loader: css`
    position: absolute;
    z-index: 2;
    background-color: rgba(10, 50, 80, 0.9);
    width: 100%;
    height: 100%;
  `,

  three: css`
    position: fixed;
    top: 0;
  `,
};

type Props = {};

enum Conditions {
  Sunny = 'sunny',
  Snowing = 'snowing',
  Clouds = 'clouds',
  Rain = 'rain',
}

type WeatherType = {
  temp: number;
  pressure: number;
  conditions: Conditions;
  wind: number;
};

enum Days {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
};





const Weather: React.FC<Props> = () => {
  const [envMap, setEnvMap] = useState<Texture | undefined>();
  const [monday, setMonday] = useState();
  const [loading, setLoading] = useState<boolean>(false);

  const divRef = useRef<HTMLDivElement>(null);
  
  const manager = new THREE.LoadingManager();
  manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    setLoading(true);
  };

  manager.onLoad = function ( ) {
    console.log( 'Loading complete!');
    setLoading(false);
  };

  const gltfLoader = new GLTFLoader(manager); 
  const rgbeLoader = new RGBELoader(manager);

  const generateWeatherForTheDay = (): WeatherType => {
    const randomNumber = Math.round(Math.random()*4);

    let conditions = Conditions.Sunny;

    switch (randomNumber) {
      case 1:
        conditions = Conditions.Sunny;
        break;
      case 2:
        conditions = Conditions.Snowing;
        break;
      case 3:
        conditions = Conditions.Clouds;
        break;
      case 4:
        conditions = Conditions.Rain;
        break;
    }

    return {
      temp: Math.round(Math.random()*24),
      conditions: conditions,
      pressure: Math.round(Math.random()*1000),
      wind: Math.round(Math.random()*24),
    };
  };


  useEffect(() => {
    const renderer = createRenderer(divRef.current);

    // setting HDRI background texture
    rgbeLoader.load(SkyHDRISharp, 
      ( hdrmap: any ) => {        
        hdrmap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = hdrmap;
        scene.environment = hdrmap;

        let generator = new THREE.PMREMGenerator(renderer);
        let envmap = generator.fromEquirectangular(hdrmap);
        // const ballMaterial = {
        //   // ...
        //   envMap: envmap.texture
        // };

        setEnvMap(envmap.texture);
      },      
    );

    let monday: Group; 

    gltfLoader.load(Monday, 
      ( object: any ) => {
        // setLoaders(prev => ({...prev, gltf: false}));
        const damascusMaterial = makeDamascusMaterial(envMap);
        const marbleMaterial = makeDamascusMaterial(envMap);
    
        object.scene.traverse(function (child: THREE.Mesh) {
          if (child instanceof THREE.Mesh) {
            child.material = damascusMaterial;
          }
        });
  
        object.scene.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 1, 0 ) ); // moove the geometry. pivot will stay
        rotateObject(object.scene, 'x', 90); 
        setMonday(object.scene.position);
        scene.add( object.scene );
        monday = object.scene;
      },
    );

    const scene = createScene();
    const camera = createCamera();
    camera.position.z = 3;
    camera.position.y = 0;
  
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    renderer.outputEncoding = THREE.sRGBEncoding;
    camera.position.z = 3;
    camera.position.y = 0; 

    const light = createLight();
    light.position.z = 0;
    light.position.y = 7;
    light.position.x = 7;

    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 7;

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    scene.add(new THREE.AxesHelper(5));

    const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
    rotateObject(gridHelper, 'x', -90);
    scene.add(gridHelper)
    
 
    // const clockDisplay = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({color: 0x23ffbb}));
    // clockDisplay.scale.set(2, 2, 0.5);
    // scene.add(clockDisplay);
    // camera.lookAt(clockDisplay.position)

    // setting background texture
    // const textureLoader = new THREE.TextureLoader();
    // const roomBackgroundTexture = textureLoader.load(RoomBackgroundTexture);
    // scene.background = roomBackgroundTexture;
   



    // Look to the center (0, 0, 0)
    camera.lookAt(new THREE.Vector3())


    // will make parallax effect
    const windowHalfWidth = window.innerWidth / 2;
    const windowHalfHeight = window.innerHeight / 2;
    let oldX = windowHalfWidth;
    let oldY = windowHalfHeight;

    window.onmousemove = (ev) => {
      let changeX = ev.x - oldX;
      let changeY = ev.y - oldY;

      camera.position.x += changeX / 1000;
      camera.position.y -= changeY / 500;

      oldX = ev.x;
      oldY = ev.y;
    };
   


    animate((time) => {
      if (monday) {
        monday.rotation.x += 0.01
      }

      // camera.rotation.z = 0;
      // camera.position.y = 0;
      
      controls.update();

      renderer.render(scene, camera);
      interactionManager.update();
      // TWEEN.update(time);
    });
  }, [divRef]);

  return (
    <div>
      <LoadingSpinner isLoading={loading}/>
      

      <div ref={divRef} css={styles.three}/>
    </div>    
  );
}

export default Weather;