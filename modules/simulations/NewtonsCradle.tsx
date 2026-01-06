"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import SceneInit from "@/lib/threeUtils";
import { AxesHelper } from "three";

export default function NewtonsCradle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneInitRef = useRef<SceneInit | null>(null);

  // State for UI updates
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for event handlers (to capture latest state)
  const isDraggingRef = useRef(false);
  const selectedBallRef = useRef<number | null>(null);
  const draggedConstraintRef = useRef<CANNON.Constraint | null>(null);

  // Refs for Three.js and Cannon.js objects
  const ballsRef = useRef<THREE.Mesh[]>([]);
  const bodiesRef = useRef<CANNON.Body[]>([]);
  const stringLinesRef = useRef<THREE.Line[]>([]);
  const worldRef = useRef<CANNON.World | null>(null);
  const constraintsRef = useRef<CANNON.Constraint[]>([]);

  useEffect(() => {
    if (!canvasRef.current || sceneInitRef.current) return;

    // Initialize scene with utility class
    const sceneInit = new SceneInit({
      canvas: canvasRef.current, // Use the canvas element directly
      fov: 60,
      nearPlane: 0.1,
      farPlane: 1000,
      cameraPosition: { x: 0, y: 0, z: 8 },
      enableShadows: true,
      enableControls: false,
      backgroundColor: 0xf0f0f0,
      ambientLightIntensity: 0.6,
      directionalLightIntensity: 1,
      directionalLightPosition: { x: 5, y: 10, z: 5 },
    });

    const axesHelper = new AxesHelper(50);
    sceneInit.scene.add(axesHelper);

    if (!sceneInit.initialize()) {
      console.error("Failed to initialize scene");
      return;
    }

    sceneInitRef.current = sceneInit;

    // Physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    worldRef.current = world;

    const ballMaterial = new CANNON.Material("ballMaterial");
    const ballContactMaterial = new CANNON.ContactMaterial(
      ballMaterial,
      ballMaterial,
      {
        friction: 0.05,
        restitution: 1.0,
        contactEquationStiffness: 1e6,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
      }
    );
    world.addContactMaterial(ballContactMaterial);

    // Parameters
    const numBalls = 5;
    const ballRadius = 0.3;
    const stringLength = 3;
    const spacing = ballRadius * 2.01;

    const balls: THREE.Mesh[] = [];
    const bodies: CANNON.Body[] = [];
    const stringLines: THREE.Line[] = [];
    const constraints: CANNON.Constraint[] = [];

    // Create frame structure
    const frameGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

    const leftPost = new THREE.Mesh(frameGeometry, frameMaterial);
    leftPost.position.set(-3, 2.5, 0);
    leftPost.castShadow = true;
    sceneInit.scene.add(leftPost);

    const rightPost = new THREE.Mesh(frameGeometry, frameMaterial);
    rightPost.position.set(3, 2.5, 0);
    rightPost.castShadow = true;
    sceneInit.scene.add(rightPost);

    const topBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 6, 8),
      frameMaterial
    );
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0, 5, 0);
    topBar.castShadow = true;
    sceneInit.scene.add(topBar);

    // Create balls and physics
    for (let i = 0; i < numBalls; i++) {
      const x = (i - (numBalls - 1) / 2) * spacing;

      // Three.js ball
      const geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x2196f3,
        metalness: 0.7,
        roughness: 0.01,
      });
      const ball = new THREE.Mesh(geometry, material);
      ball.castShadow = true;
      ball.receiveShadow = true;
      sceneInit.scene.add(ball);
      balls.push(ball);

      // Cannon.js body
      const shape = new CANNON.Sphere(ballRadius);
      const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(x, 5 - stringLength, 0),
        material: ballMaterial,
        linearDamping: 0.05,
        angularDamping: 0.05,
        collisionResponse: true,
      });
      world.addBody(body);
      bodies.push(body);

      // String constraint
      const pivotPoint = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(x, 5, 0),
      });
      world.addBody(pivotPoint);

      const constraint = new CANNON.DistanceConstraint(
        body,
        pivotPoint,
        stringLength,
        1e4
      );
      world.addConstraint(constraint);
      constraints.push(constraint);

      // Visual string
      const stringGeometry = new THREE.BufferGeometry();
      const stringMaterial = new THREE.LineBasicMaterial({
        color: 0x666666,
        linewidth: 2,
      });
      const stringLine = new THREE.Line(stringGeometry, stringMaterial);
      sceneInit.scene.add(stringLine);
      stringLines.push(stringLine);
    }

    // Store refs for cleanup and event handlers
    ballsRef.current = balls;
    bodiesRef.current = bodies;
    stringLinesRef.current = stringLines;
    constraintsRef.current = constraints;

    // Pull back first ball to start motion
    bodies[0].position.x -= 1.5;
    bodies[0].position.y += 1;
    bodies[1].position.x -= 1.5;
    bodies[1].position.y += 1;
    bodies[2].position.x -= 1.5;
    bodies[2].position.y += 1;

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
      const canvas = sceneInit.renderer.domElement;
      const rect = canvas.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, sceneInit.camera);
      const intersects = raycaster.intersectObjects(ballsRef.current);

      if (intersects.length > 0) {
        const ballIndex = ballsRef.current.indexOf(
          intersects[0].object as THREE.Mesh
        );

        // Update both state and refs
        setIsDragging(true);
        isDraggingRef.current = true;
        setSelectedBall(ballIndex);
        selectedBallRef.current = ballIndex;

        const constraint = constraintsRef.current[ballIndex];
        draggedConstraintRef.current = constraint;
        world.removeConstraint(constraint);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      // Use refs for state in event handler
      if (!isDraggingRef.current || selectedBallRef.current === null) {
        return;
      }

      const canvas = sceneInit.renderer.domElement;
      const rect = canvas.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, sceneInit.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectPoint = new THREE.Vector3();

      // Check if ray intersects the plane
      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        const ballIndex = selectedBallRef.current;
        const body = bodiesRef.current[ballIndex];
        const maxDist = stringLength * 0.9;
        const pivotX = (ballIndex - (numBalls - 1) / 2) * spacing;
        const dx = intersectPoint.x - pivotX;
        const dy = intersectPoint.y - 5;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // if (dist > maxDist) {
        //   const scale = maxDist / dist;
        //   body.position.x = pivotX + dx * scale;
        //   body.position.y = 5 + dy * scale;
        // } else {
        body.position.x = intersectPoint.x;
        body.position.y = intersectPoint.y;
        // }

        // Reset velocity when dragging
        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);
        body.wakeUp(); // Wake up the body if it was sleeping
      }
    };

    const onMouseUp = () => {
      // Re-enable the constraint when releasing
      if (draggedConstraintRef.current) {
        world.addConstraint(draggedConstraintRef.current);
        draggedConstraintRef.current = null;
      }

      setIsDragging(false);
      isDraggingRef.current = false;
      setSelectedBall(null);
      selectedBallRef.current = null;
    };

    const canvasElement = sceneInit.renderer.domElement;
    canvasElement.addEventListener("mousedown", onMouseDown);
    canvasElement.addEventListener("mousemove", onMouseMove);
    canvasElement.addEventListener("mouseup", onMouseUp);

    // Custom animation loop with physics
    const animateWithPhysics = (delta: number) => {
      // Fixed time step for stable physics
      const fixedTimeStep = 1 / 120;
      const maxSubSteps = 10;

      // Update physics with fixed time step
      world.step(fixedTimeStep, delta, maxSubSteps);

      // Update ball positions and strings
      ballsRef.current.forEach((ball, i) => {
        const cannonPos = bodiesRef.current[i].position;

        // Update Three.js ball position
        ball.position.set(cannonPos.x, cannonPos.y, cannonPos.z);

        // Update ball rotation
        const cannonQuat = bodiesRef.current[i].quaternion;
        ball.quaternion.set(
          cannonQuat.x,
          cannonQuat.y,
          cannonQuat.z,
          cannonQuat.w
        );

        // Update string visualization
        const pivotX = (i - (numBalls - 1) / 2) * spacing;
        const positions = new Float32Array([
          pivotX,
          5,
          0,
          cannonPos.x,
          cannonPos.y,
          cannonPos.z,
        ]);

        stringLinesRef.current[i].geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        stringLinesRef.current[i].geometry.attributes.position.needsUpdate =
          true;
      });
    };

    sceneInit.animate(animateWithPhysics);

    return () => {
      // Remove event listeners
      const canvasElement = sceneInit.renderer.domElement;
      canvasElement.removeEventListener("mousedown", onMouseDown);
      canvasElement.removeEventListener("mousemove", onMouseMove);
      canvasElement.removeEventListener("mouseup", onMouseUp);

      // Clean up physics
      if (worldRef.current) {
        // Remove constraints
        constraintsRef.current.forEach((constraint) => {
          worldRef.current?.removeConstraint(constraint);
        });

        // Remove bodies
        bodiesRef.current.forEach((body) => {
          worldRef.current?.removeBody(body);
        });
      }

      // Clean up Three.js objects
      ballsRef.current.forEach((ball) => {
        ball.geometry.dispose();
        (ball.material as THREE.Material).dispose();
        sceneInit.scene.remove(ball);
      });

      stringLinesRef.current.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
        sceneInit.scene.remove(line);
      });

      // Clear arrays
      ballsRef.current = [];
      bodiesRef.current = [];
      stringLinesRef.current = [];
      constraintsRef.current = [];

      // Dispose scene
      sceneInit.dispose();
      sceneInitRef.current = null;
      worldRef.current = null;
    };
  }, []);

  // Update cursor based on dragging state
  const cursorStyle = isDragging ? "grabbing" : "grab";

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {selectedBall !== null && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 4,
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          Dragging ball #{selectedBall + 1}
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: cursorStyle,
        }}
      />
    </div>
  );
}
