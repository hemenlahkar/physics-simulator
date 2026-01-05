"use client";
import { useEffect } from "react";
import SceneInit from "@/lib/threeUtils";
import {
  Body,
  Box,
  Material,
  Plane,
  RigidVehicle,
  Sphere,
  Vec3,
  World,
} from "cannon-es";
import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
  SphereGeometry,
} from "three";
// import CannonDebugger from "cannon-es-debugger";

const CarSimulation = () => {
  useEffect(() => {
    const test = new SceneInit("car-simulation-canvas");
    test.initialize();
    test.animate();

    const physicsWorld = new World({
      gravity: new Vec3(0, -9.8, 0),
    });
    const groundBody = new Body({
      type: Body.STATIC,
      shape: new Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);

    const carBody = new Body({
      mass: 5,
      position: new Vec3(0, 6, 0),
      shape: new Box(new Vec3(4, 0.5, 2)),
    });
    const vehicle = new RigidVehicle({
      chassisBody: carBody,
    });

    const mass = 1;
    const axisWidth = 5;
    const wheelShape = new Sphere(1);
    const wheelMaterial = new Material("wheel");
    const down = new Vec3(0, 0, 1);

    const wheelBody1 = new Body({ mass, material: wheelMaterial });
    wheelBody1.addShape(wheelShape);
    wheelBody1.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody1,
      position: new Vec3(-2, 0, axisWidth / 2),
      axis: new Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody2 = new Body({ mass, material: wheelMaterial });
    wheelBody2.addShape(wheelShape);
    wheelBody2.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody2,
      position: new Vec3(-2, 0, -axisWidth / 2),
      axis: new Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody3 = new Body({ mass, material: wheelMaterial });
    wheelBody3.addShape(wheelShape);
    wheelBody3.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody3,
      position: new Vec3(2, 0, -axisWidth / 2),
      axis: new Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody4 = new Body({ mass, material: wheelMaterial });
    wheelBody4.addShape(wheelShape);
    wheelBody4.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody4,
      position: new Vec3(2, 0, axisWidth / 2),
      axis: new Vec3(0, 0, 1),
      direction: down,
    });

    vehicle.addToWorld(physicsWorld);

    const handleKeyDown = (event: KeyboardEvent) => {
      const maxSteerVal = Math.PI / 8;
      const maxForce = 10;

      switch (event.key) {
        case "w":
        case "ArrowUp":
          vehicle.setWheelForce(maxForce, 0);
          vehicle.setWheelForce(maxForce, 1);
          break;

        case "s":
        case "ArrowDown":
          vehicle.setWheelForce(-maxForce / 2, 0);
          vehicle.setWheelForce(-maxForce / 2, 1);
          break;

        case "a":
        case "ArrowLeft":
          vehicle.setSteeringValue(maxSteerVal, 0);
          vehicle.setSteeringValue(maxSteerVal, 1);
          break;

        case "d":
        case "ArrowRight":
          vehicle.setSteeringValue(-maxSteerVal, 0);
          vehicle.setSteeringValue(-maxSteerVal, 1);
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
        case "ArrowUp":
          vehicle.setWheelForce(0, 0);
          vehicle.setWheelForce(0, 1);
          break;

        case "s":
        case "ArrowDown":
          vehicle.setWheelForce(0, 0);
          vehicle.setWheelForce(0, 1);
          break;

        case "a":
        case "ArrowLeft":
          vehicle.setSteeringValue(0, 0);
          vehicle.setSteeringValue(0, 1);
          break;

        case "d":
        case "ArrowRight":
          vehicle.setSteeringValue(0, 0);
          vehicle.setSteeringValue(0, 1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // sync game world with physics world
    const groundGeometry = new PlaneGeometry(100, 100);
    const groundMaterial = new MeshNormalMaterial();
    const groundMesh = new Mesh(groundGeometry, groundMaterial);
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);
    test.scene?.add(groundMesh);

    const carBodyGeometry = new BoxGeometry(8, 1, 4);
    const carBodyMaterial = new MeshStandardMaterial({
      color: 0xff0000,
    });
    const carBodyMesh = new Mesh(carBodyGeometry, carBodyMaterial);
    carBodyMesh.position.copy(carBody.position);
    carBodyMesh.quaternion.copy(carBody.quaternion);
    test.scene?.add(carBodyMesh);

    const sphereGeo1 = new SphereGeometry(1);
    const sphereGeo2 = new SphereGeometry(1);
    const sphereGeo3 = new SphereGeometry(1);
    const sphereGeo4 = new SphereGeometry(1);

    const sphereMat1 = new MeshStandardMaterial({ color: 0x000000 });
    const sphereMat2 = new MeshStandardMaterial({ color: 0x000000 });
    const sphereMat3 = new MeshStandardMaterial({ color: 0x000000 });
    const sphereMat4 = new MeshStandardMaterial({ color: 0x000000 });

    const sphereMesh1 = new Mesh(sphereGeo1, sphereMat1);
    const sphereMesh2 = new Mesh(sphereGeo2, sphereMat2);
    const sphereMesh3 = new Mesh(sphereGeo3, sphereMat3);
    const sphereMesh4 = new Mesh(sphereGeo4, sphereMat4);
    test.scene?.add(sphereMesh1, sphereMesh2, sphereMesh3, sphereMesh4);

    const animate = () => {
      physicsWorld.fixedStep();
      // cannonDebugger.update();
      carBodyMesh.position.copy(carBody.position);
      carBodyMesh.quaternion.copy(carBody.quaternion);
      sphereMesh1.position.copy(wheelBody1.position);
      sphereMesh1.quaternion.copy(wheelBody1.quaternion);
      sphereMesh2.position.copy(wheelBody2.position);
      sphereMesh2.quaternion.copy(wheelBody2.quaternion);
      sphereMesh3.position.copy(wheelBody3.position);
      sphereMesh3.quaternion.copy(wheelBody3.quaternion);
      sphereMesh4.position.copy(wheelBody4.position);
      sphereMesh4.quaternion.copy(wheelBody4.quaternion);

      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <main>
      <canvas id="car-simulation-canvas"></canvas>
    </main>
  );
};

export default CarSimulation;
