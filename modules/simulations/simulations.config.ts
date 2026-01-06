import dynamic from "next/dynamic";

export interface Simulation {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  controls: string[];
}

// Dynamically import Three.js components (client-side only)
export const simulations: Simulation[] = [
  {
    id: "gravity-sandbox",
    name: "Gravity Sandbox",
    description: "Create and throw objects in a gravity field",
    component: dynamic(() => import("./GravitySandbox"), { ssr: false }),
    category: "Classical Mechanics",
    difficulty: "beginner",
    controls: ["Click & Drag", "WASD Movement", "Space to Jump", "R to Reset"],
  },
  // {
  //   id: "rigid-body-collisions",
  //   name: "Rigid Body Collisions",
  //   description: "Real-time physics collisions with various shapes",
  //   component: dynamic(() => import("./RigidBodyCollisions"), { ssr: false }),
  //   category: "Classical Mechanics",
  //   difficulty: "intermediate",
  //   controls: ["Click to Add Objects", "Drag to Throw", "C to Change Shape"],
  // },
  // {
  //   id: "double-pendulum-3d",
  //   name: "3D Double Pendulum",
  //   description: "Chaotic motion in three dimensions",
  //   component: dynamic(() => import("./DoublePendulum3D"), { ssr: false }),
  //   category: "Chaos Theory",
  //   difficulty: "advanced",
  //   controls: ["Mouse Drag to Rotate", "Scroll to Zoom", "P to Pause"],
  // },
  // {
  //   id: "fluid-simulation",
  //   name: "Fluid Simulation",
  //   description: "Interactive fluid dynamics with particles",
  //   component: dynamic(() => import("./FluidSimulation"), { ssr: false }),
  //   category: "Fluid Dynamics",
  //   difficulty: "advanced",
  //   controls: ["Click to Add Fluid", "Drag to Create Flow", "Adjust Viscosity"],
  // },
  // {
  //   id: "orbital-mechanics",
  //   name: "Orbital Mechanics",
  //   description: "Planetary orbits and gravitational pull",
  //   component: dynamic(() => import("./OrbitalMechanics"), { ssr: false }),
  //   category: "Astrophysics",
  //   difficulty: "intermediate",
  //   controls: ["Click Planets", "Adjust Mass", "Time Controls"],
  // },
  // {
  //   id: "cloth-physics",
  //   name: "Cloth Physics",
  //   description: "Real-time cloth simulation with wind",
  //   component: dynamic(() => import("./ClothPhysics"), { ssr: false }),
  //   category: "Soft Body Physics",
  //   difficulty: "intermediate",
  //   controls: ["Drag Points", "Adjust Wind", "T to Tear"],
  // },
    {
      id: "newton-cradle",
      name: "Newton's Cradle",
      description: "",
      component: dynamic(()=>import("./NewtonsCradle"), {ssr: false}),
      category: "Collision",
      difficulty: "beginner",
      controls: ["Drag points"]
    }
] as const;

export type SimulationId = (typeof simulations)[number]["id"];
export type SimulationCategory = (typeof simulations)[number]["category"];

export const getSimulationById = (id: string) => {
  return simulations.find((sim) => sim.id === id);
};

export const getCategories = (): SimulationCategory[] => {
  const categories = simulations.map((sim) => sim.category);
  return Array.from(new Set(categories));
};

export const getSimulationsByCategory = (category: string) => {
  return simulations.filter((sim) => sim.category === category);
};
