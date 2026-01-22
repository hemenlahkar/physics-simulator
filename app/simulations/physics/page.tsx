"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  simulations,
  getCategories,
  Simulation,
} from "@/modules/simulations/simulations.config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Grid3x3,
  Zap,
  Globe,
  Waves,
  Orbit,
  Settings,
  X,
  ArrowLeft,
} from "lucide-react";

function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl text-gray-300">Loading Physics Engine...</p>
        <p className="text-sm text-gray-500 mt-2">
          Initializing Three.js & Cannon-es
        </p>
      </div>
    </div>
  );
}

function SimulationSelectionPanel({
  onSelectSimulation,
  selectedId,
}: {
  onSelectSimulation: (id: string) => void;
  selectedId: string | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = getCategories();

  const filteredSimulations = simulations.filter((sim) => {
    const matchesSearch =
      sim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || sim.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColor = {
    beginner: "bg-green-500/20 text-green-300",
    intermediate: "bg-yellow-500/20 text-yellow-300",
    advanced: "bg-red-500/20 text-red-300",
  };

  return (
    <div className="absolute left-8 top-8 w-96 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 z-50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Physics Simulations</h1>
          <p className="text-gray-400 text-sm mt-1">
            Interactive 3D physics with Three.js
          </p>
        </div>
        {selectedId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectSimulation("")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search simulations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setSelectedCategory}
        >
          <TabsList
            className={`grid grid-cols-${Math.min(
              categories.length + 1,
              4
            )} mb-4`}
          >
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {filteredSimulations.map((simulation) => (
            <Card
              key={simulation.id}
              className={`bg-gray-800/50 border-gray-700 cursor-pointer transition-all hover:bg-gray-800/80 hover:border-blue-500/50 ${
                selectedId === simulation.id
                  ? "border-blue-500 bg-gray-800/80"
                  : ""
              }`}
              onClick={() => onSelectSimulation(simulation.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      {simulation.name}
                      <Badge className={difficultyColor[simulation.difficulty]}>
                        {simulation.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm mt-1">
                      {simulation.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {simulation.controls.slice(0, 3).map((control, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs bg-gray-900/50"
                    >
                      {control}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Beginner</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Intermediate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Advanced</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              {filteredSimulations.length} simulations
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulationControls({
  simulation,
  onClose,
}: {
  simulation: Simulation;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [gravity, setGravity] = useState(9.8);
  const [speed, setSpeed] = useState(1);
  const [collisionEnabled, setCollisionEnabled] = useState(true);
  const [showTrails, setShowTrails] = useState(false);
  const [showForces, setShowForces] = useState(true);

  return (
    <div className="absolute right-8 top-8 w-80 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 z-50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Controls</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-gray-400 hover:text-white"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              /* Reset function */
            }}
            className="text-gray-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Gravity</label>
            <span className="text-sm text-gray-400">
              {gravity.toFixed(1)} m/s²
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Simulation Speed
            </label>
            <span className="text-sm text-gray-400">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">
            Available Controls
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {simulation.controls.map((control, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-3 text-center hover:bg-gray-800 transition-colors"
              >
                <p className="text-xs text-gray-300">{control}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Physics Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Collision Detection</span>
              <button
                onClick={() => setCollisionEnabled(!collisionEnabled)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  collisionEnabled ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    collisionEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Show Trails</span>
              <button
                onClick={() => setShowTrails(!showTrails)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  showTrails ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showTrails ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Show Forces</span>
              <button
                onClick={() => setShowForces(!showForces)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  showForces ? "bg-purple-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showForces ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulationHeader({ simulation }: { simulation: Simulation }) {
  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-800 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <h1 className="text-xl font-bold text-white">{simulation.name}</h1>
        </div>
        <Badge variant="outline" className="bg-gray-800/50">
          {simulation.category}
        </Badge>
        <div className="text-sm text-gray-400">{simulation.description}</div>
      </div>
    </div>
  );
}

function PhysicsSimulationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get("sim") || "";
  const selectedSimulation = simulations.find((s) => s.id === selectedId);

  const handleSelectSimulation = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("sim", id);
      } else {
        params.delete("sim");
      }
      router.push(`/simulations/physics?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSelectSimulation("");
      }
      if (e.key === " " && selectedSimulation) {
        e.preventDefault();
        // Handle pause/play
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSimulation, handleSelectSimulation]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.floor(Math.random() * 100)}%`,
              top: `${Math.floor(Math.random() * 100)}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {selectedSimulation ? (
        <>
          <SimulationHeader simulation={selectedSimulation} />
          <SimulationControls
            simulation={selectedSimulation}
            onClose={() => handleSelectSimulation("")}
          />

          {/* Main Simulation Area */}
          <div className="absolute inset-0">
            <selectedSimulation.component />
          </div>
        </>
      ) : (
        <SimulationSelectionPanel
          onSelectSimulation={handleSelectSimulation}
          selectedId={selectedId}
        />
      )}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/50 backdrop-blur-xl rounded-full px-6 py-2 border border-gray-800">
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <span>Three.js + Cannon-es</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4 text-green-400" />
            <span>Real-time Physics</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-400" />
            <span>Interactive 3D</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div>
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">ESC</kbd> to
            exit
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the component that uses useSearchParams in Suspense
export default function PhysicsSimulationsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PhysicsSimulationsContent />
    </Suspense>
  );
}
