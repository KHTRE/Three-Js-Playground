/** @jsxImportSource @emotion/react */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { animate, createCamera, createLight, createRenderer, createScene, rotateObject } from './helpers';
import { InteractionManager } from "three.interactive";
import { css } from '@emotion/react';
import RoomBackgroundTexture from '../materials/textures/room.jpg';

const styles = {
  counter: css`    
    position: fixed;
    top: 0;
    z-index: 3;
    background-color: red;
  `,

  text: css`
    position: absolute;
    top: 0;
    z-index: 2;
    background-color: rgba(10, 50, 80, 0.9);
    width: 200px;
  `,

  listItem: css`
    margin: 12px;
    padding: 8px;
    background-color: bisque;
  `,

  activeItem: css`
    position: absolute;
    right: -100px;
    top: 25px;
    background-color: beige;
  `,

  three: css`
    position: fixed;
    top: 0;
  `,
};

type Props = {};


const Clock: React.FC<Props> = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const textureLoader = new THREE.TextureLoader();

  useEffect(() => {
    const renderer = createRenderer(divRef.current);
    const scene = createScene();
    const camera = createCamera();
    camera.position.z = 3;
    camera.position.y = 0;


    const light = createLight();
    light.position.z = 2;

    scene.add(light);
    // const controls = new TrackballControls(camera, renderer.domElement);
    // controls.rotateSpeed = 7.0;

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    scene.add(new THREE.AxesHelper(5));

    const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
    rotateObject(gridHelper, 'x', -90);
    scene.add(gridHelper)
    
 
    const clockDisplay = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({color: 0x23ffbb}));
    clockDisplay.scale.set(2, 2, 1);
    scene.add(clockDisplay);

    const arrow = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({color: 0xff68aa}));
    arrow.scale.set(0.1, 0.7, 0.05);
    arrow.position.set(0, 0, 0.6);
    // arrow.rotation.z = 2;
    // rotateObject(arrow, 'z', 190);
    arrow.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.45, 1 ) ); // moove the geometry. pivot will stay
    scene.add(arrow);

    const arrowSmall = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({color: 0x116aa7}));
    arrowSmall.scale.set(0.07, 0.9, 0.05);
    arrowSmall.position.set(0, 0, 0.65);
    arrowSmall.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.45, 1 ) ); // moove the geometry. pivot will stay
    scene.add(arrowSmall);

    camera.lookAt(clockDisplay.position)



    let scrollPercent = 0

    const getRotationChange = (x: number, y: number, a: number) => {
      return -((1 - a) * x + a * y)
    };

    const getScalePercent = (start: number, end: number) => {
      return (scrollPercent - start) / (end - start);
    }

    const animationScripts: { start: number; end: number; func: () => void }[] = []

    //add an animation that rotates the cube between 40-60 percent of scroll
    animationScripts.push({
      start: 0,
      end: 100,
      func: () => {
        arrow.rotation.z = getRotationChange(0, 4 * Math.PI, getScalePercent(0, 100)) // 4 === 2 full turns
        arrowSmall.rotation.z = getRotationChange(0, 48 * Math.PI, getScalePercent(0, 100)) // 48 === 24 full turns
      },
    })




    const playScrollAnimations = () => {
      animationScripts.forEach((a) => {
          if (scrollPercent >= a.start && scrollPercent < a.end) {
              a.func()
          }
      })
    }



    document.body.onscroll = () => {
      console.log('scroll');
      //calculate the current scroll progress as a percentage
      scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) /
              ((document.documentElement.scrollHeight ||
                  document.body.scrollHeight) -
                  document.documentElement.clientHeight)) * 100;
      
      (document.getElementById('scrollProgress') as HTMLDivElement).innerText =
          'Scroll Progress : ' + scrollPercent.toFixed(2);
    }



    window.scrollTo({ top: 0, behavior: 'smooth' })


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


    // setting background texture
    const roomBackgroundTexture = textureLoader.load(RoomBackgroundTexture);
    scene.background = roomBackgroundTexture;


    animate((time) => {   
      playScrollAnimations(); 
      // controls.update();
      renderer.render(scene, camera);
      interactionManager.update();
      // TWEEN.update(time);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
    });
  }, [divRef, textureLoader]);



  // 96 - number of items if one item each 15 min
  const dataArray = (new Array(96)).fill({}).map((item, index) => ({
    time: 15 * index,
    text: 'Some funky thing to do',
  }));

  console.log(dataArray);

  return (
    <div>
      <div css={styles.counter} id='scrollProgress'>123</div>
      <div css={styles.text}>   
        <div css={styles.activeItem}>{'<----------'}</div>   
        {dataArray.map(item => (
          <li css={styles.listItem}>
            {item.text} - {Math.floor(item.time / 60)} : {item.time % 60}
          </li>
        ))}
      </div>
      <div ref={divRef} css={styles.three}/>
    </div>    
  );
}

export default Clock;