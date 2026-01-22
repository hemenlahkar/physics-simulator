"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

// Simplified SceneInit for this example
class SceneInit {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    this.camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 3, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Handle resize
    window.addEventListener("resize", () => this.onResize(canvas));
  }

  onResize(canvas: HTMLCanvasElement) {
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  animate(callback: (delta: number) => void) {
    let lastTime = performance.now();
    const animateLoop = () => {
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      callback(delta);
      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(animateLoop);
    };
    animateLoop();
  }

  dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }
}

export default function NewtonsCradle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneInitRef = useRef<SceneInit | null>(null);

  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const selectedBallRef = useRef<number | null>(null);
  const draggedConstraintRef = useRef<CANNON.Constraint | null>(null);

  const ballsRef = useRef<THREE.Mesh[]>([]);
  const bodiesRef = useRef<CANNON.Body[]>([]);
  const stringLinesRef = useRef<THREE.Line[]>([]);
  const worldRef = useRef<CANNON.World | null>(null);
  const constraintsRef = useRef<CANNON.Constraint[]>([]);

  useEffect(() => {
    if (!canvasRef.current || sceneInitRef.current) return;

    const sceneInit = new SceneInit(canvasRef.current);
    sceneInitRef.current = sceneInit;

    // Physics world with OPTIMIZED settings
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // CRITICAL: High solver iterations for stable collisions
    (world.solver as CANNON.GSSolver).iterations = 30; // Increased from default 10
    (world.solver as CANNON.GSSolver).tolerance = 0; // Set to 0 for maximum accuracy

    // IMPORTANT: Use Split solver for better stability
    const solver = new CANNON.GSSolver();
    solver.iterations = 30;
    solver.tolerance = 0;
    world.solver = solver;

    // Allow sleeping for performance, but with stricter thresholds
    world.allowSleep = true;
    // world.sleepSpeedLimit = 0.01; // Lower threshold
    // world.sleepTimeLimit = 0.5; // Shorter time before sleep

    worldRef.current = world;

    // CRITICAL: Contact material with very high stiffness
    const ballMaterial = new CANNON.Material("ballMaterial");
    const ballContactMaterial = new CANNON.ContactMaterial(
      ballMaterial,
      ballMaterial,
      {
        friction: 0.0, // Zero friction for ideal transfer
        restitution: 0.999, // Slightly less than 1.0 for stability
        contactEquationStiffness: 1e10, // VERY high stiffness
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e10,
      }
    );
    world.addContactMaterial(ballContactMaterial);

    // Parameters
    const numBalls = 5;
    const ballRadius = 0.3;
    const stringLength = 3;
    const spacing = ballRadius * 2.005; // Tiny gap to prevent initial contact

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
        metalness: 1,
        roughness: 0.000001,
      });
      const ball = new THREE.Mesh(geometry, material);
      ball.castShadow = true;
      ball.receiveShadow = true;
      sceneInit.scene.add(ball);
      balls.push(ball);

      // Cannon.js body with OPTIMIZED settings
      const shape = new CANNON.Sphere(ballRadius);
      const body = new CANNON.Body({
        mass: 1, // Use mass 1 for numerical stability
        shape: shape,
        position: new CANNON.Vec3(x, 5 - stringLength, 0),
        material: ballMaterial,
        linearDamping: 0.0, // Zero damping
        angularDamping: 0.0, // Zero damping
        collisionResponse: true,
        sleepSpeedLimit: 0.01,
        sleepTimeLimit: 0.5,
      });
      world.addBody(body);
      bodies.push(body);

      // String constraint with VERY HIGH stiffness
      const pivotPoint = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(x, 5, 0),
      });
      world.addBody(pivotPoint);

      // IMPORTANT: Use higher maxForce for stiffer strings
      const constraint = new CANNON.DistanceConstraint(
        body,
        pivotPoint,
        stringLength,
        1e8 // Very high force to minimize stretching
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

    ballsRef.current = balls;
    bodiesRef.current = bodies;
    stringLinesRef.current = stringLines;
    constraintsRef.current = constraints;

    // Pull back first ball to start motion
    bodies[0].position.x -= 1.5;
    bodies[0].position.y += 1;

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

      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        const ballIndex = selectedBallRef.current;
        const body = bodiesRef.current[ballIndex];

        body.position.x = intersectPoint.x;
        body.position.y = intersectPoint.y;

        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);
        body.wakeUp();
      }
    };

    const onMouseUp = () => {
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

    // Animation loop with SMALLER time step
    const animateWithPhysics = (delta: number) => {
      // CRITICAL: Smaller fixed time step for better accuracy
      const fixedTimeStep = 1 / 240; // Increased from 1/120
      const maxSubSteps = 20; // Increased for catching up

      // Clamp delta to prevent spiral of death
      const clampedDelta = Math.min(delta, 0.1);

      world.step(fixedTimeStep, clampedDelta, maxSubSteps);

      ballsRef.current.forEach((ball, i) => {
        const cannonPos = bodiesRef.current[i].position;

        ball.position.set(cannonPos.x, cannonPos.y, cannonPos.z);

        const cannonQuat = bodiesRef.current[i].quaternion;
        ball.quaternion.set(
          cannonQuat.x,
          cannonQuat.y,
          cannonQuat.z,
          cannonQuat.w
        );

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
      const canvasElement = sceneInit.renderer.domElement;
      canvasElement.removeEventListener("mousedown", onMouseDown);
      canvasElement.removeEventListener("mousemove", onMouseMove);
      canvasElement.removeEventListener("mouseup", onMouseUp);

      if (worldRef.current) {
        constraintsRef.current.forEach((constraint) => {
          worldRef.current?.removeConstraint(constraint);
        });

        bodiesRef.current.forEach((body) => {
          worldRef.current?.removeBody(body);
        });
      }

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

      ballsRef.current = [];
      bodiesRef.current = [];
      stringLinesRef.current = [];
      constraintsRef.current = [];

      sceneInit.dispose();
      sceneInitRef.current = null;
      worldRef.current = null;
    };
  }, []);

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
