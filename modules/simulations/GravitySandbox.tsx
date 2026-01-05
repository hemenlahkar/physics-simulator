"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, useSphere, usePlane } from "@react-three/cannon";
import {
  OrbitControls,
  PerspectiveCamera,
  Stats,
  Box,
  Sphere,
  Cylinder,
} from "@react-three/drei";
import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
    type: "Static",
    material: {
      friction: 0.3,
      restitution: 0.6,
    },
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <shadowMaterial opacity={0.5} />
      <meshStandardMaterial color="#374151" />
    </mesh>
  );
}

function Ball({
  position = [0, 5, 0],
}: {
  position?: [number, number, number];
}) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position as [number, number, number],
    args: [0.5],
    material: {
      restitution: 0.7,
      friction: 0.3,
    },
  }));

  const handleClick = () => {
    api.applyImpulse([0, 5, 0], [0, 0, 0]);
  };

  return (
    <mesh ref={ref} castShadow receiveShadow onClick={handleClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#3B82F6" />
    </mesh>
  );
}

function BoxObject({
  position = [0, 2, 0],
}: {
  position?: [number, number, number];
}) {
  const [ref] = useBox(() => ({
    mass: 2,
    position: position as [number, number, number],
    args: [1, 1, 1],
    material: {
      restitution: 0.5,
      friction: 0.4,
    },
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#10B981" />
    </mesh>
  );
}

function Player() {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 1, 0],
    args: [0.5, 1.8, 0.5],
    type: "Dynamic",
    material: {
      friction: 0.1,
      restitution: 0.2,
    },
  }));

  const { forward, backward, left, right, jump } = useKeyboardControls();

  useFrame(() => {
    const impulseStrength = 0.5;
    const jumpStrength = 5;

    if (forward) {
      api.applyImpulse([0, 0, -impulseStrength], [0, 0, 0]);
    }
    if (backward) {
      api.applyImpulse([0, 0, impulseStrength], [0, 0, 0]);
    }
    if (left) {
      api.applyImpulse([-impulseStrength, 0, 0], [0, 0, 0]);
    }
    if (right) {
      api.applyImpulse([impulseStrength, 0, 0], [0, 0, 0]);
    }
    if (jump) {
      api.applyImpulse([0, jumpStrength, 0], [0, 0, 0]);
    }
  });

  return (
    <mesh ref={ref} castShadow>
      <capsuleGeometry args={[0.5, 1.8, 4, 8]} />
      <meshStandardMaterial color="#8B5CF6" />
    </mesh>
  );
}

function GravityWell({
  position = [0, 0, 0],
  strength = 50,
}: {
  position?: [number, number, number];
  strength?: number;
}) {
  const [ref] = useSphere(() => ({
    type: "Static",
    position: position as [number, number, number],
    args: [1],
  }));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F59E0B"
        emissiveIntensity={0.5}
      />
      <pointLight position={[0, 0, 0]} color="#F59E0B" intensity={2} />
    </mesh>
  );
}

function PhysicsSystem() {
  const [objects, setObjects] = useState<
    Array<{ type: "ball" | "box"; position: [number, number, number] }>
  >([]);
  const { camera, mouse } = useThree();
  const raycaster = new THREE.Raycaster();

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (event.button === 2) return; // Ignore right click

      const mouseVector = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouseVector, camera);

      // Create new object at mouse position (in world space)
      const distance = 10;
      const position = new THREE.Vector3();
      raycaster.ray.at(distance, position);

      const newObject: {
        type: "ball" | "box";
        position: [number, number, number];
      } = {
        type: Math.random() > 0.5 ? "ball" : ("box" as const),
        position: [position.x, position.y + 5, position.z],
      };

      setObjects((prev) => [...prev, newObject]);
    },
    [camera]
  );

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        setObjects([]); // Reset all objects
      }
      if (e.key === "c" || e.key === "C") {
        // Create random object at random position
        const newObject: {
          type: "ball" | "box";
          position: [number, number, number];
        } = {
          type: Math.random() > 0.5 ? "ball" : ("box" as const),
          position: [
            (Math.random() - 0.5) * 10,
            Math.random() * 10 + 5,
            (Math.random() - 0.5) * 10,
          ],
        };
        setObjects((prev) => [...prev, newObject]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Ground />
      <Player />
      <GravityWell position={[5, 0, 5]} />
      <GravityWell position={[-5, 0, -5]} strength={30} />

      {/* Static environment objects */}
      <BoxObject position={[3, 2, 3]} />
      <BoxObject position={[-3, 4, -3]} />
      <Ball position={[0, 10, 0]} />

      {/* Dynamically created objects */}
      {objects.map((obj, index) =>
        obj.type === "ball" ? (
          <Ball key={index} position={obj.position} />
        ) : (
          <BoxObject key={index} position={obj.position} />
        )
      )}
    </>
  );
}

export default function GravitySandbox() {
  return (
    <Canvas
      shadows
      camera={{ position: [10, 10, 10], fov: 75 }}
      style={{ width: "100%", height: "100vh" }}
    >
      <color attach="background" args={["#0f172a"]} />
      <fog attach="fog" args={["#0f172a", 10, 50]} />

      <Physics
        gravity={[0, -9.81, 0]}
        allowSleep={false}
        iterations={10}
        broadphase="SAP"
      >
        <PhysicsSystem />
      </Physics>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={50}
      />

      <Stats />
    </Canvas>
  );
}
