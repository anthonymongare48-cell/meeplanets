"use client";

import { useEffect, useRef, useState } from "react";
import type { Planet } from "@/lib/planets";

type FlightStage = "orbit" | "entry" | "surface";

type FlightWaypoint = { id: string; name: string; left: string; top: string; description: string };

const flightWaypoints: Record<string, FlightWaypoint[]> = {
  mercury: [
    { id: "caloris", name: "Caloris Basin", left: "28%", top: "34%", description: "One of Mercury's largest impact basins. The immense collision created rings of mountains and fractured terrain." },
    { id: "scarps", name: "Lobate Scarps", left: "68%", top: "58%", description: "Long cliffs formed as Mercury cooled and contracted, shortening its circumference over geological time." },
  ],
  venus: [
    { id: "maat", name: "Maat Mons", left: "29%", top: "34%", description: "A large shield volcano rising above Venus's volcanic plains. Radar observations reveal lava flows on its slopes." },
    { id: "maxwell", name: "Maxwell Montes", left: "67%", top: "58%", description: "The highest mountain range on Venus, located in the highlands of Ishtar Terra and mapped through the planet's cloud cover by radar." },
  ],
  earth: [
    { id: "himalaya", name: "Himalaya", left: "29%", top: "34%", description: "This mountain range continues to rise where the Indian and Eurasian tectonic plates converge." },
    { id: "mariana", name: "Mariana Trench", left: "68%", top: "58%", description: "The deepest known ocean trench, formed where one tectonic plate is forced beneath another." },
  ],
  mars: [
    { id: "olympus", name: "Olympus Mons", left: "27%", top: "34%", description: "A vast shield volcano built by repeated basaltic lava flows. Its scale reflects Mars' long-lived volcanic hotspots." },
    { id: "jezero", name: "Jezero Crater", left: "68%", top: "58%", description: "Perseverance explores this ancient impact basin and preserved river delta, whose layered rocks record past water." },
  ],
  jupiter: [
    { id: "red-spot", name: "Great Red Spot", left: "28%", top: "36%", description: "A long-lived anticyclonic storm in Jupiter's atmosphere. It is large enough to contain Earth, although its size changes over time." },
    { id: "polar-cyclones", name: "Polar Cyclones", left: "68%", top: "58%", description: "Juno observations revealed clusters of persistent cyclones arranged around Jupiter's north and south poles." },
  ],
  saturn: [
    { id: "hexagon", name: "North Polar Hexagon", left: "28%", top: "35%", description: "A persistent six-sided jet-stream pattern surrounding Saturn's north pole, first seen in Voyager images and studied in detail by Cassini." },
    { id: "equatorial-storm", name: "Equatorial Storms", left: "68%", top: "58%", description: "Saturn's atmosphere hosts powerful storms and fast eastward winds. Large storm systems can periodically encircle the planet." },
  ],
  uranus: [
    { id: "bright-clouds", name: "Bright Cloud Bands", left: "29%", top: "35%", description: "Methane absorbs red light, giving Uranus its cyan appearance. Occasional bright clouds reveal active weather high in the atmosphere." },
    { id: "polar-cap", name: "Polar Region", left: "67%", top: "58%", description: "Uranus rotates on its side, producing extreme seasons as each pole experiences decades of sunlight and darkness." },
  ],
  neptune: [
    { id: "dark-storm", name: "Dark Storms", left: "28%", top: "35%", description: "Voyager 2 observed the Great Dark Spot in 1989. Neptune's dark vortices evolve and can disappear, unlike a fixed surface landmark." },
    { id: "supersonic-winds", name: "Supersonic Winds", left: "67%", top: "58%", description: "Neptune's atmosphere has some of the fastest measured planetary winds, despite receiving little sunlight at its great distance." },
  ],
};

const atmosphericColors: Record<string, string> = {
  mercury: "#b8a99a",
  venus: "#e4a64f",
  earth: "#4d9bcc",
  mars: "#d4532f",
  jupiter: "#d9a677",
  saturn: "#c6aa7c",
  uranus: "#76cad0",
  neptune: "#537ad6",
};

export function SurfaceFlight({ planet }: { planet: Planet }) {
  const [stage, setStage] = useState<FlightStage>("orbit");
  const [altitude, setAltitude] = useState(1000);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
  const frameId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const isGasGiant = planet.className === "GAS GIANT" || planet.className === "ICE GIANT";
  const hasMeaningfulAtmosphere = planet.id !== "mercury";
  const waypoints = flightWaypoints[planet.id] ?? [];
  const color = atmosphericColors[planet.id] ?? "#a5a5a5";
  const temperature = Number.parseFloat(planet.temperature);
  const depth = 1 - altitude / 1000;
  const displayedTemperature = Math.round(temperature + (isGasGiant ? depth * 15 : (1 - depth) * 30));
  const surfacePressure = Number.parseFloat(planet.surfacePressure);
  const pressure = isGasGiant
    ? `${(0.01 + depth * 0.99).toFixed(2)} bar`
    : Number.isFinite(surfacePressure)
      ? `${(depth * surfacePressure).toFixed(surfacePressure < 0.1 ? 3 : 2)} bar`
      : "Trace";
  const activeWaypoint = waypoints.find((point) => point.id === selectedWaypoint);

  useEffect(() => () => {
    if (frameId.current !== null) window.cancelAnimationFrame(frameId.current);
  }, []);

  function beginFlight() {
    if (frameId.current !== null) window.cancelAnimationFrame(frameId.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAltitude(0);
      setStage("surface");
      return;
    }
    setStage("entry");
    setAltitude(1000);
    setSelectedWaypoint(null);
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / 5000, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAltitude(Math.max(0, Math.round(1000 * (1 - eased))));
      if (progress < 1) {
        frameId.current = window.requestAnimationFrame(animate);
      } else {
        frameId.current = null;
        setStage("surface");
      }
    };
    frameId.current = window.requestAnimationFrame(animate);
  }

  function returnToOrbit() {
    if (frameId.current !== null) window.cancelAnimationFrame(frameId.current);
    frameId.current = null;
    setAltitude(1000);
    setStage("orbit");
    setSelectedWaypoint(null);
  }

  return (
    <section className={`surface-flight surface-flight-${stage}`} style={{ "--flight-color": color, "--flight-progress": `${1 - altitude / 1000}` } as React.CSSProperties} aria-label={`${planet.name} surface flight`}>
      <div className="surface-flight-heading">
        <div>
          <span className="eyebrow">CINEMATIC FIELD FLIGHT</span>
          <h3 aria-live="polite">{stage === "orbit" ? `Descend toward ${planet.name.toLowerCase()}` : stage === "entry" ? hasMeaningfulAtmosphere ? "Atmospheric entry" : "Surface approach" : isGasGiant ? "Cloud-layer observation" : "Surface observation"}</h3>
        </div>
        {stage === "orbit"
          ? <button className="text-button" onClick={beginFlight}>BEGIN FLIGHT ↘</button>
          : <button className="text-button" onClick={returnToOrbit}>RETURN TO ORBIT ↑</button>}
      </div>

      <div className="flight-viewport">
        <div className="flight-stars" />
        <div className="flight-atmosphere" />
        {stage !== "surface" && <div className="flight-planet" aria-hidden="true"><span /></div>}
        {stage === "surface" && (
          <div className={`flight-terrain flight-terrain-${planet.id} ${isGasGiant ? "cloud-terrain" : ""}`}>
            <div className="terrain-horizon" />
            {waypoints.map((point) => (
              <button
                key={point.id}
                className={`flight-waypoint ${selectedWaypoint === point.id ? "selected" : ""}`}
                style={{ left: point.left, top: point.top }}
                onClick={() => setSelectedWaypoint(point.id)}
                aria-pressed={selectedWaypoint === point.id}
              >
                <span className="waypoint-beacon" />{point.name}
              </button>
            ))}
            {activeWaypoint && (
              <aside className="flight-lesson">
                <span className="eyebrow">FIELD NOTE / {activeWaypoint.name.toUpperCase()}</span>
                <p>{activeWaypoint.description}</p>
              </aside>
            )}
          </div>
        )}

        {stage !== "orbit" && (
          <>
            <div className="flight-entry-glow" aria-hidden="true" />
            <div className="flight-altitude" aria-live="off">
              <span>ALTITUDE / REFERENCE</span>
              <strong>{altitude.toLocaleString()} <small>km</small></strong>
              <i><b style={{ width: `${100 - altitude / 10}%` }} /></i>
            </div>
            <div className="flight-telemetry">
              <span>MODELLED TEMPERATURE <b>{displayedTemperature}°C</b></span>
              <span>MODELLED PRESSURE <b>{pressure}</b></span>
              <small>{isGasGiant ? "Altitude is referenced to a nominal 1-bar cloud level; there is no solid landing surface." : "Atmospheric readings are illustrative interpolation, not a live physical simulation."}</small>
            </div>
          </>
        )}
        {stage === "entry" && <span className="flight-stage-label">{hasMeaningfulAtmosphere ? "ENTRY INTERFACE" : "SURFACE APPROACH"} · APPROACHING {planet.name}</span>}
        {stage === "surface" && <span className="flight-stage-label">{isGasGiant ? "CLOUD DECK · ILLUSTRATIVE VIEW" : "LOCAL TERRAIN · ILLUSTRATIVE VIEW"}</span>}
      </div>
      <p className="flight-disclaimer">{isGasGiant ? "Gas and ice giants have no solid surface to land on. The cloud-deck scene and atmospheric readings are illustrative, not a live physical simulation." : "Camera flight and terrain are a visual learning aid. Altitude, temperature, and pressure are illustrative; no real landing or high-resolution terrain scan is performed."} {waypoints.length > 0 && "Select a glowing marker to explore a field note."}</p>
    </section>
  );
}
