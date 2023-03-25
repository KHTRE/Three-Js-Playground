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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// @ts-expect-error
import Monday from '../models/days/Monday.glb';
import { makeDamascusMaterial } from '../materials/damascus';

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





const WeatherAsync: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const divRef = useRef<HTMLDivElement>(null);
  
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = (url, itemsLoaded, itemsTotal ) => {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    // setLoading(true);
  };

  loadingManager.onLoad = () => {
    console.log( 'Loading complete!');
    // setLoading(false);
  };

  const gltfLoader = new GLTFLoader(loadingManager); 
  const rgbeLoader = new RGBELoader(loadingManager);  

  useEffect(() => {
    const renderer = createRenderer(divRef.current);

    const scene = createScene();
    const camera = createCamera();
    camera.position.z = 4;
    camera.position.y = 0;

    const render = () => {
      renderer.render( scene, camera );  
    }

    const onInit = () => {
      render();
      setLoading(false);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
      render();
    }

    const init = async () => {
      camera.lookAt(new THREE.Vector3());

      // const light = createLight();
      // light.position.z = 0;
      // light.position.y = 7;
      // light.position.x = 7;      

      const envMap = await rgbeLoader.loadAsync(SkyHDRISharp);
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = envMap;
      scene.environment = envMap;

      const damascusMaterial = makeDamascusMaterial(envMap);
      // const marbleMaterial = makeDamascusMaterial(envMap);  

      const monday = (await gltfLoader.loadAsync(Monday)).scene;
      monday.traverse(function (child: THREE.Mesh) {
        if (child instanceof THREE.Mesh) {
          child.material = damascusMaterial;
        }
      });
      monday.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 1, 0 ) ); // moove the geometry. pivot will stay
      rotateObject(monday, 'x', 90); 
      scene.add( monday );


      const controls = new OrbitControls(camera, renderer.domElement);
      controls.rotateSpeed = 0.5;
      controls.minDistance = 1;
      controls.maxDistance = 7;
      // controls.addEventListener( 'change', render ); // If we do not use animate()

      // const interactionManager = new InteractionManager(
      //   renderer,
      //   camera,
      //   renderer.domElement
      // );


      scene.add(new THREE.AxesHelper(5));

      const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
      rotateObject(gridHelper, 'x', -90);
      scene.add(gridHelper)

      window.addEventListener( 'resize', onWindowResize );


      animate((time) => {
        if (monday) {
          monday.rotation.x += 0.01
        }
        
        controls.update();
  
        renderer.render(scene, camera);
        // interactionManager.update();
        // TWEEN.update(time);
      });
    };

    init().then( onInit );

  }, [divRef]);

  return (
    <div>
      <LoadingSpinner isLoading={loading}/>
      

      <div ref={divRef} css={styles.three}/>
    </div>    
  );
}

export default WeatherAsync;