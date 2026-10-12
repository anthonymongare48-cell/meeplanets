"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { planets, planetModelColors } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";

const signalModes = [
  { id: "photometry", label: "PHOTOMETRY", color: "#ffac54" },
  { id: "radio", label: "RADIO", color: "#65d9ea" },
  { id: "infrared", label: "INFRARED", color: "#c593ff" },
] as const;

type SignalMode = (typeof signalModes)[number]["id"];

export function StellarSignalSimulation() {
  const selectedPlanetId = useCosmosStore((state) => state.selectedPlanet);
  const planet = planets.find((item) => item.id === selectedPlanetId) ?? planets[2];
  const [position, setPosition] = useState(50);
  const [mode, setMode] = useState<SignalMode>("photometry");
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setPhase((value) => (value + 1) % 360);
      setPosition((value) => (value >= 90 ? 10 : value + 0.35));
    }, 80);
    return () => window.clearInterval(timer);
  }, [running]);

  const selectedMode = signalModes.find((item) => item.id === mode) ?? signalModes[0];
  const planetDiameter = Number(planet.diameter.replace(/,/g, "").match(/[\d.]+/)?.[0] ?? 0);
  const worldScale = Math.min(1, planetDiameter / 139820);
  const transitDepth = Math.max(0, 1 - Math.abs(position - 50) / 26) * worldScale;
  const brightness = (1 - transitDepth * 0.24).toFixed(2);
  const curve = Array.from({ length: 52 }, (_, index) => {
    const x = (index / 51) * 100;
    const dip = Math.exp(-Math.pow((x - position) / 8, 4)) * transitDepth * 58;
    const ripple = Math.sin((index + phase / 8) * 0.62) * 1.4;
    return `${index === 0 ? "M" : "L"}${x},${20 + dip + ripple}`;
  }).join(" ");
  const waveform = Array.from({ length: 49 }, (_, index) => {
    const x = (index / 48) * 100;
    const envelope = 12 + Math.sin(index * 0.16 + phase / 18) * 4;
    const amplitude = 11 + Math.sin(index * 1.16 + phase / 11) * envelope;
    return `${index === 0 ? "M" : "L"}${x},${25 + amplitude}`;
  }).join(" ");

  return (
    <section className="stellar-signal" aria-labelledby="stellar-signal-title">
      <header className="stellar-signal__header">
        <div>
          <span className="eyebrow">ASTROMETRY INSTRUMENT / 01</span>
          <h2 id="stellar-signal-title">Stars, shadows &amp; signals</h2>
        </div>
        <span className="stellar-signal__status"><i /> SIMULATION {running ? "RUNNING" : "PAUSED"}</span>
      </header>

      <div className="stellar-signal__grid">
        <section className="stellar-signal__panel stellar-signal__occultation">
          <div className="stellar-signal__panel-heading">
            <div><span>01 / TRANSIT GEOMETRY</span><h3>Stellar shadow anatomy</h3></div>
            <span>EDGE-ON VIEW</span>
          </div>
          <div className="stellar-signal__sky">
            <div className="stellar-signal__star" />
            <div className="stellar-signal__beam stellar-signal__beam--upper" />
            <div className="stellar-signal__beam stellar-signal__beam--lower" />
            <div className="stellar-signal__shadow" style={{ left: `${position}%`, width: `${16 + 22 * Math.sqrt(worldScale)}px`, height: `${16 + 22 * Math.sqrt(worldScale)}px`, "--occulting-color": planetModelColors[planet.id] } as CSSProperties}>
              <i />
            </div>
            <span className="stellar-signal__label stellar-signal__label--umbra">UMBRA</span>
            <span className="stellar-signal__label stellar-signal__label--penumbra">PENUMBRA</span>
            <span className="stellar-signal__axis">TRANSIT CHORD / {position.toFixed(0)}%</span>
          </div>
          <label className="stellar-signal__slider">
            {planet.name} TRANSIT POSITION <output>{position.toFixed(0)}%</output>
            <input aria-label="Occulting body position" type="range" min="10" max="90" step="0.5" value={position} onChange={(event) => { setRunning(false); setPosition(Number(event.target.value)); }} />
          </label>
          <div className="stellar-signal__chart-heading"><span>RELATIVE STELLAR FLUX</span><strong>{brightness} <small>× BASELINE</small></strong></div>
          <svg className="stellar-signal__chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Simulated stellar light curve with relative flux ${brightness}`}>
            {[20, 40, 60, 80].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} />)}
            <path d={curve} />
          </svg>
          <div className="stellar-signal__chart-axis"><span>INGRESS</span><span>TRANSIT PHASE</span><span>EGRESS</span></div>
        </section>

        <section className="stellar-signal__panel stellar-signal__telemetry">
          <div className="stellar-signal__panel-heading">
            <div><span>02 / REMOTE OBSERVATION</span><h3>Signal analysis</h3></div>
            <span>SIMULATED DATA</span>
          </div>
          <div className="stellar-signal__network" aria-label="Illustrative star and observatory signal map">
            <svg viewBox="0 0 500 230" preserveAspectRatio="none" aria-hidden="true">
              <path d="M56 155 155 64 256 122 376 48 445 164M155 64 376 48M56 155 256 122 445 164" />
              <path className="stellar-signal__signal-path" d="M56 155 Q100 124 155 64 T256 122 T376 48 T445 164" />
            </svg>
            {[
              { name: "Kepler-186", x: 31, y: 28 },
              { name: "Gliese-38", x: 75, y: 21 },
              { name: "Target-04", x: 51, y: 54 },
              { name: "Array-12", x: 12, y: 68 },
              { name: "LHS-1140", x: 89, y: 72 },
            ].map((node, index) => (
              <div key={node.name} className={`stellar-signal__node stellar-signal__node--${index}`} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                <i />
                <span>{node.name}<small>{index < 3 ? "STAR SYSTEM" : "OBSERVATORY"}</small></span>
              </div>
            ))}
          </div>
          <div className="stellar-signal__mode-row" aria-label="Choose signal band">
            {signalModes.map((item) => <button type="button" key={item.id} className={mode === item.id ? "is-active" : ""} style={{ "--signal-color": item.color } as CSSProperties} onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>{item.label}</button>)}
            <button type="button" onClick={() => setRunning((value) => !value)}>{running ? "PAUSE" : "RESUME"}</button>
          </div>
          <div className="stellar-signal__chart-heading"><span>{selectedMode.label} / RECEIVED SIGNAL</span><strong>{(18 + Math.round((Math.sin(phase / 30) + 1) * 9)).toString().padStart(2, "0")} <small>MHz</small></strong></div>
          <svg className="stellar-signal__chart stellar-signal__chart--wave" viewBox="0 0 100 56" preserveAspectRatio="none" role="img" aria-label={`${selectedMode.label.toLowerCase()} signal waveform`}>
            {[14, 28, 42].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} />)}
            <path d={waveform} style={{ stroke: selectedMode.color }} />
          </svg>
          <p className="stellar-signal__note">Illustrative signal model — not a live telescope feed or confirmed exoplanet detection.</p>
        </section>
      </div>
    </section>
  );
}
