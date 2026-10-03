"use client";
import { create } from "zustand";

type CosmosState = {
  audioEnabled: boolean;
  selectedPlanet: string;
  simulationSpeed: number;
  simulationPlaying: boolean;
  simulationMode: "2D" | "3D";
  simulationZoom: number;
  simulationFrameCap: 30 | 60 | 120;
  completedLessons: string[];
  lowPowerMode: boolean;
  toggleAudio: () => void;
  selectPlanet: (id: string) => void;
  setSimulationSpeed: (speed: number) => void;
  setSimulationPlaying: (playing: boolean) => void;
  setSimulationMode: (mode: "2D" | "3D") => void;
  setSimulationZoom: (zoom: number) => void;
  setSimulationFrameCap: (cap: 30 | 60 | 120) => void;
  completeLesson: (id: string) => void;
  setLowPowerMode: (enabled: boolean) => void;
};

export const useCosmosStore = create<CosmosState>((set) => ({
  audioEnabled: false,
  selectedPlanet: "saturn",
  simulationSpeed: 1,
  simulationPlaying: true,
  simulationMode: "2D",
  simulationZoom: 1,
  simulationFrameCap: 60,
  completedLessons: [],
  lowPowerMode: false,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  selectPlanet: (selectedPlanet) => set({ selectedPlanet }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),
  setSimulationPlaying: (simulationPlaying) => set({ simulationPlaying }),
  setSimulationMode: (simulationMode) => set({ simulationMode }),
  setSimulationZoom: (simulationZoom) => set({ simulationZoom }),
  setSimulationFrameCap: (simulationFrameCap) => set({ simulationFrameCap }),
  completeLesson: (id) => set((state) => ({ completedLessons: state.completedLessons.includes(id) ? state.completedLessons : [...state.completedLessons, id] })),
  setLowPowerMode: (lowPowerMode) => set({ lowPowerMode })
}));
