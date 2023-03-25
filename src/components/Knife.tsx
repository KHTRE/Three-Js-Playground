/** @jsxImportSource @emotion/react */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { animate, createCamera, createLight, createRenderer, createScene, rotateObject } from './helpers';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { makeDamascusMaterial } from '../materials/damascus';
import * as TWEEN from "@tweenjs/tween.js";
import { InteractionManager } from "three.interactive";
import { css } from '@emotion/react';

// @ts-expect-error
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// @ts-expect-error
import KnifeModel from '../models/knife.glb';

const styles = {
  test: css`      
    height: 500px;
    width: 500px;
    position: absolute;
  `,
};

type Props = {};


const Knife: React.FC<Props> = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderer = createRenderer(divRef.current);
    const scene = createScene();
    const camera = createCamera();
    camera.position.z = 5;
    const light = createLight();
    scene.add(light);
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 7.0;

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    scene.add(new THREE.AxesHelper(5));
    
    const cubeRendererTarget = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipMapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });
    const cubeCamera = new THREE.CubeCamera(1, 10000, cubeRendererTarget);

    const damascusMaterial = makeDamascusMaterial(cubeRendererTarget.texture);

    const gltfLoader = new GLTFLoader();


    gltfLoader.load(KnifeModel, 
      function ( object: any ) {
        rotateObject(object.scene, 'x', -90);    
        object.scene.position.set(0, -1, 0);    
    
        object.scene.traverse(function (child: THREE.Mesh) {
          if (child instanceof THREE.Mesh) {
            child.material = damascusMaterial;        
          }
        });


        object.scene.addEventListener("click", (event: any) => {
          event.stopPropagation();
          console.log(`knife cube was clicked`);
          const knifeObject = event.target; 
      
          const knifeObjectRotation = {degZ: knifeObject.rotation.z};
          console.log(knifeObjectRotation);
          const coords = { x: camera.position.x, y: camera.position.y };      
      
          new TWEEN.Tween(knifeObjectRotation)
            .to({ degZ: Math.PI * 0.5, }) //конечная точка
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                cube.rotation.set(cube.rotation.x, cube.rotation.y, -knifeObjectRotation.degZ);          
              }
            )
            .start()
            .onComplete(() => {
              // Will move camera
              // new TWEEN.Tween(coords)
              //   .to({ y: cube.position.y }) //можно добавить х
              //   .easing(TWEEN.Easing.Quadratic.Out)
              //   .onUpdate(() => {
              //       camera.position.set(coords.x, coords.y, camera.position.z);          
              //     }
              //   )
              //   .start();
            });
        });
      
        interactionManager.add(object.scene);
    
        scene.add( object.scene );    
      },
    );
    

    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, damascusMaterial);
    scene.add(cube);


    animate((time) => {    
      controls.update();
      cubeCamera.update(renderer, scene);  // reflections
      renderer.render(scene, camera);
      interactionManager.update();
      TWEEN.update(time);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
  }, [divRef]);




  return (
    <div>
      <div css={styles.test}>123</div>
      <div ref={divRef}/>
    </div>    
  );
}

export default Knife;