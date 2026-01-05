"use client";

import { Simulation } from "@/modules/simulations/simulations.config";

interface SimulationListProps {
  simulations: Simulation[];
  selectedId: string;
  onSelectSimulation: (id: string) => void;
}

export default function SimulationList({
  simulations,
  selectedId,
  onSelectSimulation,
}: SimulationListProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Available Simulations</h2>
      <div className="space-y-2">
        {simulations.map((simulation) => (
          <button
            key={simulation.id}
            onClick={() => onSelectSimulation(simulation.id)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              selectedId === simulation.id
                ? "bg-blue-600/20 border-l-4 border-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{simulation.name}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {simulation.description}
                </p>
              </div>
              {simulation.category && (
                <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                  {simulation.category}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {simulations.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No simulations found in this category
        </div>
      )}
    </div>
  );
}
