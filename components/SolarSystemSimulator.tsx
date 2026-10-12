"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { planets } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";
import { SolarSystemScene } from "@/components/SolarSystemScene";

export function SolarSystemSimulator() {
  const selected = useCosmosStore((state) => state.selectedPlanet);
  const selectPlanet = useCosmosStore((state) => state.selectPlanet);
  const playing = useCosmosStore((state) => state.simulationPlaying);
  const setPlaying = useCosmosStore((state) => state.setSimulationPlaying);
  const speed = useCosmosStore((state) => state.simulationSpeed);
  const setSpeed = useCosmosStore((state) => state.setSimulationSpeed);
  const mode = useCosmosStore((state) => state.simulationMode);
  const setMode = useCosmosStore((state) => state.setSimulationMode);
  const zoom = useCosmosStore((state) => state.simulationZoom);
  const setZoom = useCosmosStore((state) => state.setSimulationZoom);
  const frameCap = useCosmosStore((state) => state.simulationFrameCap);
  const [phase, setPhase] = useState(18.7);
  const [scaleMode, setScaleMode] = useState<"visible" | "proportional">("visible");
  const [showLabels, setShowLabels] = useState(true);
  const [resetViewVersion, setResetViewVersion] = useState(0);
  const phaseRef = useRef(18.7);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const planet = planets.find((item) => item.id === selected) ?? planets[5];
  const formattedTime = useMemo(() => {
    const total = Math.floor(phase * 3600);
    return `${String(Math.floor(total / 3600) % 24).padStart(2, "0")}:${String(Math.floor(total / 60) % 60).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }, [phase]);

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.max(.75, Math.min(1.35, nextZoom)));
  };

  useEffect(() => {
    if (!playing) {
      lastFrameRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      const previous = lastFrameRef.current ?? timestamp;
      const elapsed = timestamp - previous;
      if (elapsed >= 1000 / frameCap) {
        const deltaSeconds = Math.min(elapsed / 1000, 0.1);
        lastFrameRef.current = timestamp;
        phaseRef.current = (phaseRef.current + deltaSeconds * 0.2 * speed) % 24;
        setPhase(phaseRef.current);
      }
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastFrameRef.current = null;
    };
  }, [frameCap, playing, speed]);

  return (
    <section className="simulator-shell">
      <div className="simulator-toolbar">
        <span className="eyebrow">ORBITAL VIEW · HELIOCENTRIC</span>
        <div className="toolbar-actions">
          <button className={`small-btn ${mode === "2D" ? "active" : ""}`} onClick={() => setMode("2D")}>TOP 2D</button>
          <button className={`small-btn ${mode === "3D" ? "active" : ""}`} onClick={() => setMode("3D")}>3D</button>
          <button className="small-btn" onClick={() => updateZoom(useCosmosStore.getState().simulationZoom + .1)}>ZOOM +</button>
          <button className="small-btn" onClick={() => updateZoom(useCosmosStore.getState().simulationZoom - .1)}>ZOOM −</button>
        </div>
      </div>
      <div className={`orbit-stage orbit-${mode.toLowerCase()}`} aria-label="Interactive solar system simulator" aria-describedby="orbit-controls-hint">
        <span id="orbit-controls-hint" className="sr-only">Drag to rotate the orbital view. Scroll or pinch to zoom. Choose any planet to inspect its telemetry.</span>
        <SolarSystemScene
          planets={planets}
          selectedPlanet={selected}
          onSelectPlanet={selectPlanet}
          mode={mode}
          zoom={zoom}
          playing={playing}
          speed={speed}
          scaleMode={scaleMode}
          showLabels={showLabels}
          resetViewVersion={resetViewVersion}
        />
        <div className="orbit-overlay-controls">
          <button className={`orbit-overlay-button ${showLabels ? "active" : ""}`} onClick={() => setShowLabels((visible) => !visible)} aria-pressed={showLabels}>LABELS {showLabels ? "ON" : "OFF"}</button>
          <button className="orbit-overlay-button" onClick={() => { setZoom(1); setResetViewVersion((version) => version + 1); }}>RESET VIEW</button>
        </div>
      </div>
      <div className="simulator-playback">
        <button className="play-button" onClick={() => setPlaying(!useCosmosStore.getState().simulationPlaying)} aria-label={playing ? "Pause simulation" : "Play simulation"}>{playing ? "Ⅱ" : "▶"}</button>
        <input type="range" min="0" max="24" step=".01" value={phase} onChange={(event) => { const value = Number(event.target.value); phaseRef.current = value; setPhase(value); }} aria-label="Orbital timeline" />
        <span className="timecode">{formattedTime}</span>
        <button className="text-button" onClick={() => setScaleMode((current) => current === "visible" ? "proportional" : "visible")} aria-label="Toggle visible and proportional scale">
          {scaleMode === "visible" ? "VISIBLE SCALE" : "PROPORTIONAL SCALE"}
        </button>
      </div>
      <div className="orbit-control-deck">
        <span className="orbit-control-label">ORBIT SPEED <strong>{speed.toFixed(1)}×</strong></span>
        <input
          className="orbit-speed-slider"
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={Math.min(30, speed)}
          onChange={(event) => setSpeed(Number(event.target.value))}
          aria-label="Orbit speed"
        />
        <span className="orbit-control-range">0× <span>DRAG TO ROTATE · SCROLL TO ZOOM</span> 30×</span>
        <div className="orbit-speed-presets" aria-label="Orbit speed presets">
          {[0.5, 1, 5, 20, 30].map((preset) => (
            <button
              className={speed === preset ? "active" : ""}
              aria-pressed={speed === preset}
              onClick={() => setSpeed(preset)}
              key={preset}
            >
              {preset}×
            </button>
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
