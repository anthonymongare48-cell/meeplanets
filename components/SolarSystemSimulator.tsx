"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { planets } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";

const orbitRadii = [16, 23, 30, 37, 48, 59, 70, 81];

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
  const speeds = [0.5, 1, 5, 20];
  const [phase, setPhase] = useState(18.7);
  const phaseRef = useRef(18.7);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const planet = planets.find((item) => item.id === selected) ?? planets[5];
  const formattedTime = useMemo(() => {
    const total = Math.floor(phase * 3600);
    return `${String(Math.floor(total / 3600) % 24).padStart(2, "0")}:${String(Math.floor(total / 60) % 60).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }, [phase]);

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
          <button className="small-btn" onClick={() => setZoom(Math.min(1.35, useCosmosStore.getState().simulationZoom + .1))}>ZOOM +</button>
          <button className="small-btn" onClick={() => setZoom(Math.max(.75, useCosmosStore.getState().simulationZoom - .1))}>ZOOM −</button>
        </div>
      </div>
      <div className={`orbit-stage orbit-${mode.toLowerCase()}`} style={{ "--orbit-zoom": zoom } as React.CSSProperties} aria-label="Interactive solar system simulator">
        <div className="star-field" />
        {orbitRadii.map((radius) => <div className="orbit-line" style={{ width: `${radius * 2}%`, height: `${radius * 2}%` }} key={radius} />)}
        <div className="sim-sun" />
        {planets.map((item, index) => {
          const angle = phase * (index + 1) * 8 + index * 38;
          const spin = phase * (index + 1) * 55;
          return <button key={item.id} className={`sim-planet planet-${item.id} ${selected === item.id ? "selected" : ""}`} aria-label={`Select ${item.name}, ${item.className}`} title={`${item.name} · ${item.className}`} onClick={() => selectPlanet(item.id)} style={{ "--radius": `${orbitRadii[index]}%`, "--angle": `${angle}deg`, "--spin": `${spin}deg`, "--color": item.accent, "--size": `${index > 4 ? 13 + index * 2 : 10 + index * 2}px` } as React.CSSProperties}><i className="sim-trail" /><span /></button>;
        })}
        <span className="sim-label sim-label-earth">EARTH</span><span className="sim-label sim-label-selected">{planet.name} <b>selected</b></span>
      </div>
      <div className="simulator-playback">
        <button className="play-button" onClick={() => setPlaying(!useCosmosStore.getState().simulationPlaying)} aria-label={playing ? "Pause simulation" : "Play simulation"}>{playing ? "Ⅱ" : "▶"}</button>
        <input type="range" min="0" max="24" step=".01" value={phase} onChange={(event) => { const value = Number(event.target.value); phaseRef.current = value; setPhase(value); }} aria-label="Orbital timeline" />
        <span className="timecode">{formattedTime}</span>
        <button className="text-button" onClick={() => setSpeed(speeds[(speeds.indexOf(useCosmosStore.getState().simulationSpeed) + 1) % speeds.length])}>{speed}× SPEED</button>
      </div>
      <aside className="simulator-details">
        <div><span className="eyebrow">SELECTED BODY</span><h2 style={{ color: planet.accent }}>{planet.name}</h2><p>{planet.description}</p></div>
        <div className="sim-detail-grid"><span>TYPE <b>{planet.className}</b></span><span>DIAMETER <b>{planet.diameter}</b></span><span>DAY LENGTH <b>{planet.day}</b></span><span>MOONS <b>{planet.moons}</b></span></div>
        <Link className="outline-btn" href={`/planets/${planet.id}`}>OPEN TELEMETRY ↗</Link>
      </aside>
    </section>
  );
}
