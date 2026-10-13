"use client";

import Link from "next/link";
import { useState } from "react";
import { planets } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";
import { LazySolarSystemScene } from "@/components/LazySolarSystemScene";

const speedPresets = [0.5, 1, 5, 20];

export function SolarSystemSimulator() {
  const selected = useCosmosStore((state) => state.selectedPlanet);
  const selectPlanet = useCosmosStore((state) => state.selectPlanet);
  const mode = useCosmosStore((state) => state.simulationMode);
  const setMode = useCosmosStore((state) => state.setSimulationMode);
  const zoom = useCosmosStore((state) => state.simulationZoom);
  const setZoom = useCosmosStore((state) => state.setSimulationZoom);
  const speed = useCosmosStore((state) => state.simulationSpeed);
  const setSpeed = useCosmosStore((state) => state.setSimulationSpeed);
  const playing = useCosmosStore((state) => state.simulationPlaying);
  const setPlaying = useCosmosStore((state) => state.setSimulationPlaying);
  const [resetViewVersion, setResetViewVersion] = useState(0);
  const planet = planets.find((item) => item.id === selected) ?? planets[5];

  return (
    <section className="simulator-shell" id="orbital-view">
      <div className="simulator-toolbar">
        <span className="eyebrow">ORBITAL VIEW · PLANETS, ASTEROIDS & METEOROIDS</span>
        <div className="toolbar-actions" aria-label="Orbital camera controls">
          <button className="small-btn" type="button" onClick={() => setZoom(Math.max(0.75, Number((zoom - 0.1).toFixed(2))))} disabled={zoom <= 0.75}>ZOOM −</button>
          <button className="small-btn" type="button" onClick={() => setZoom(Math.min(1.6, Number((zoom + 0.1).toFixed(2))))} disabled={zoom >= 1.6}>ZOOM +</button>
          <button className="small-btn" type="button" onClick={() => { setZoom(1); setResetViewVersion((version) => version + 1); }}>RESET VIEW</button>
        </div>
      </div>

      <div className={`orbit-stage orbit-simulation-stage orbit-${mode.toLowerCase()}`} aria-label="Interactive solar system with rotating planets, an asteroid belt, and a passing meteoroid">
        <LazySolarSystemScene
          planets={planets}
          selectedPlanet={selected}
          onSelectPlanet={selectPlanet}
          mode={mode}
          zoom={zoom}
          playing={playing}
          speed={speed}
          scaleMode="visible"
          showLabels
          resetViewVersion={resetViewVersion}
        />
        <div className="orbit-overlay-controls" role="group" aria-label="Projection mode">
          <button className={`orbit-overlay-button${mode === "3D" ? " active" : ""}`} type="button" onClick={() => setMode("3D")} aria-pressed={mode === "3D"}>3D VIEW</button>
          <button className={`orbit-overlay-button${mode === "2D" ? " active" : ""}`} type="button" onClick={() => setMode("2D")} aria-pressed={mode === "2D"}>TOP 2D</button>
        </div>
      </div>

      <div className="orbit-control-deck">
        <button className="play-button" type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause simulation" : "Play simulation"}>{playing ? "Ⅱ" : "▶"}</button>
        <label className="orbit-control-label" htmlFor="orbit-speed">SIMULATION SPEED <strong>{speed}×</strong></label>
        <input id="orbit-speed" className="orbit-speed-slider" type="range" min="0.5" max="20" step="0.5" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label="Simulation speed" />
        <div className="orbit-speed-presets" role="group" aria-label="Simulation speed presets">
          {speedPresets.map((preset) => (
            <button className={speed === preset ? "active" : ""} type="button" key={preset} onClick={() => setSpeed(preset)} aria-pressed={speed === preset}>{preset}×</button>
          ))}
        </div>
      </div>

      <aside className="simulator-details">
        <div><span className="eyebrow">SELECTED BODY</span><h2 style={{ color: planet.accent }}>{planet.name}</h2><p>{planet.description}</p></div>
        <div className="sim-detail-grid"><span>TYPE <b>{planet.className}</b></span><span>DIAMETER <b>{planet.diameter}</b></span><span>DAY LENGTH <b>{planet.day}</b></span><span>MOONS <b>{planet.moons}</b></span></div>
        <Link className="outline-btn" href={`/planets/${planet.id}`}>OPEN TELEMETRY ↗</Link>
      </aside>
    </section>
  );
}
