import { createRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { AxesHelper, Quaternion, Vector3 } from 'three';
import CannonDebugger from 'cannon-es-debugger';


type Props = {};


const Physics: React.FC<Props> = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 7;
    camera.position.y = 7;
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (divRef.current) {
      divRef.current.appendChild(renderer.domElement);
    }


    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    // camera.position.z = 5;



    scene.add(new THREE.AxesHelper(5));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 1;
    // controls.maxDistance = 7;




    // Physics starts here    
    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // @ts-expect-error
    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
      // color: 0xa5bfc5,
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      //  infinite plane
      shape: new CANNON.Plane(),
    });

    // rotate by 90 deg
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);

    const radius = 1;

    const sphereBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(radius),
    });
    sphereBody.position.set(0, 7, 0);
    physicsWorld.addBody(sphereBody);

    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshNormalMaterial();
    const sphereMesh = new THREE.Mesh(geometry, material)
    scene.add(sphereMesh);

    const boxBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });
    boxBody.position.set(1,10, 0);
    physicsWorld.addBody(boxBody);

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boxMesh);




    const carBody = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(0, 6, 5),
      shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
    });

    const vehicle = new CANNON.RigidVehicle({
      chassisBody: carBody,
    });

    

    const mass = 1;
    const axisWidth = 5;
    const wheelShape = new CANNON.Sphere(1);
    const wheelMaterial = new CANNON.Material('wheel');
    const down = new CANNON.Vec3(0, -1, 0);

    const wheelBody1 = new CANNON.Body({
      mass: mass,
      material: wheelMaterial,
    });
    wheelBody1.addShape(wheelShape);
    wheelBody1.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody1,
      position: new CANNON.Vec3(-2, 0, axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody2 = new CANNON.Body({
      mass: mass,
      material: wheelMaterial,
    });
    wheelBody2.addShape(wheelShape);
    wheelBody2.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody2,
      position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody3 = new CANNON.Body({
      mass: mass,
      material: wheelMaterial,
    });
    wheelBody3.addShape(wheelShape);
    wheelBody3.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody3,
      position: new CANNON.Vec3(2, 0, axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody4 = new CANNON.Body({
      mass: mass,
      material: wheelMaterial,
    });
    wheelBody4.addShape(wheelShape);
    wheelBody4.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody4,
      position: new CANNON.Vec3(2, 0, -axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    vehicle.addToWorld(physicsWorld);

    //  Add controls for car
    document.addEventListener('keydown', (event) => {
      const maxSteerVal = Math.PI / 8;
      const maxForce = 10;

      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          vehicle.setWheelForce(maxForce, 0); // 0 - number of wheel in wheels array
          vehicle.setWheelForce(maxForce, 1);
          break;

        case 's':
        case 'ArrowDown':
          vehicle.setWheelForce(-maxForce / 2, 0);
          vehicle.setWheelForce(-maxForce / 2, 1);
          break;

        case 'a':
        case 'ArrowLeft':
          vehicle.setSteeringValue(maxSteerVal, 0);
          vehicle.setSteeringValue(maxSteerVal, 1);
          break;

        case 'd':
        case 'ArrowRight':
          vehicle.setSteeringValue(-maxSteerVal, 0);
          vehicle.setSteeringValue(-maxSteerVal, 1);
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          vehicle.setWheelForce(0, 0); // 0 - number of wheel in wheels array
          vehicle.setWheelForce(0, 1);
          break;

        case 's':
        case 'ArrowDown':
          vehicle.setWheelForce(0, 0);
          vehicle.setWheelForce(0, 1);
          break;

        case 'a':
        case 'ArrowLeft':
          vehicle.setSteeringValue(0, 0);
          vehicle.setSteeringValue(0, 1);
          break;

        case 'd':
        case 'ArrowRight':
          vehicle.setSteeringValue(0, 0);
          vehicle.setSteeringValue(0, 1);
          break;
      }
    });




    const animate = () => {
      physicsWorld.fixedStep();
      cannonDebugger.update();
      
      sphereMesh.position.copy(sphereBody.position as unknown as Vector3);
      sphereMesh.quaternion.copy(sphereBody.quaternion as unknown as Quaternion);
      boxMesh.position.copy(boxBody.position as unknown as Vector3);
      boxMesh.quaternion.copy(boxBody.quaternion as unknown as Quaternion);

      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();





  }, [divRef]);

  return <div ref={divRef} />;
}

export default Physics;