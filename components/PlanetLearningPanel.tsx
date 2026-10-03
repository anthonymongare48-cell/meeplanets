"use client";

import { useState } from "react";
import type { Planet } from "@/lib/planets";
import { SurfaceFlight } from "@/components/SurfaceFlight";

type Layer = "overview" | "atmosphere" | "interior";

const marsWaypoints = [
  {
    id: "olympus",
    name: "Olympus Mons",
    position: { left: "29%", top: "35%" },
    lesson: "A shield volcano built by repeated, fluid basaltic lava flows. Mars lacks Earth-like plate recycling, so volcanic edifices could grow over long-lived hotspots.",
  },
  {
    id: "jezero",
    name: "Jezero Crater",
    position: { left: "67%", top: "61%" },
    lesson: "Perseverance explores an ancient impact basin with a preserved river delta. Its layered rocks record a past environment where liquid water once collected.",
  },
];

export function PlanetLearningPanel({ planet }: { planet: Planet }) {
  const [layer, setLayer] = useState<Layer>("overview");
  const [waypoint, setWaypoint] = useState<string | null>(null);
  const [guided, setGuided] = useState(false);

  const activeWaypoint = marsWaypoints.find((item) => item.id === waypoint);
  const guidedStep = waypoint ? (layer === "atmosphere" ? 2 : 1) : 0;

  return (
    <section className="planet-learning" aria-labelledby="learn-more-title">
      <div className="planet-learning-heading">
        <div>
          <span className="eyebrow">INTERACTIVE FIELD GUIDE</span>
          <h2 id="learn-more-title">Explore {planet.name.toLowerCase()}</h2>
          <p>Choose a layer to reveal more detail, or inspect a marked surface feature.</p>
        </div>
        {planet.id === "mars" && (
          <button className="text-button" onClick={() => { setGuided((value) => !value); setWaypoint(null); setLayer("overview"); }}>
            {guided ? "EXIT GUIDED PATH" : "START GUIDED PATH"}
          </button>
        )}
      </div>

      <div className="learning-tabs" role="tablist" aria-label="Planet information layers">
        {(["overview", "atmosphere", "interior"] as const).map((tab) => (
          <button
            className={`learning-tab ${layer === tab ? "active" : ""}`}
            key={tab}
            role="tab"
            aria-selected={layer === tab}
            onClick={() => setLayer(tab)}
          >
            {tab === "overview" ? "OVERVIEW" : tab === "atmosphere" ? "ANALYZE ATMOSPHERE" : "VIEW INTERIOR"}
          </button>
        ))}
      </div>

      <div className="learning-layer" role="tabpanel">
        {layer === "overview" && (
          <article>
            <span className="eyebrow">GLANCE</span>
            <h3>{planet.tagline}</h3>
            <p>{planet.description} Surface temperature: {planet.temperature}. Classification: {planet.className.toLowerCase()}.</p>
          </article>
        )}
        {layer === "atmosphere" && (
          <article>
            <span className="eyebrow">ATMOSPHERE & WEATHER</span>
            <h3>{planet.atmosphere} · {planet.surfacePressure}</h3>
            <p>{planet.weather}</p>
            <p className="learning-caveat">Atmospheric composition is summarized qualitatively here; exact abundances depend on altitude and measurement source.</p>
          </article>
        )}
        {layer === "interior" && (
          <article>
            <span className="eyebrow">INTERNAL STRUCTURE</span>
            <h3>{planet.geology}</h3>
            <p>{planet.minerals}</p>
            <div className="interior-diagram" role="img" aria-label={`Illustrative cutaway of ${planet.name} internal layers`}>
              <span className="interior-layer interior-crust">CRUST / CLOUD TOPS</span>
              <span className="interior-layer interior-mantle">MANTLE / DEEP ENVELOPE</span>
              <span className="interior-layer interior-core">CORE</span>
            </div>
            <p className="learning-caveat">Illustrative layer diagram; boundaries and composition are inferred from scientific models.</p>
          </article>
        )}
      </div>

      <SurfaceFlight planet={planet} />

      {planet.id === "mars" && (
        <div className={`waypoint-explorer ${guided ? "guided" : ""}`}>
          <div className="waypoint-copy">
            <span className="eyebrow">MARS / SURFACE WAYPOINTS</span>
            <h3>{guided ? `GUIDED PATH · OBJECTIVE ${Math.min(guidedStep + 1, 3)} OF 3` : "Click a feature to investigate"}</h3>
            <p>{guided && !waypoint ? "First objective: select Olympus Mons on the Mars globe." : guided && waypoint && layer !== "atmosphere" ? "Next objective: open Analyze Atmosphere to connect surface evidence with the Martian climate." : "Select Olympus Mons or Jezero Crater. Each pin opens a short field lesson tied to that location."}</p>
            <div className="waypoint-map" aria-label="Illustrative Mars globe with interactive surface waypoints">
              <div className="waypoint-globe">
                {marsWaypoints.map((point) => (
                  <button
                    key={point.id}
                    className={`waypoint-pin ${waypoint === point.id ? "selected" : ""} ${guided && !waypoint && point.id === "olympus" ? "objective" : ""}`}
                    style={point.position}
                    onClick={() => setWaypoint(point.id)}
                    aria-label={`Open field lesson: ${point.name}`}
                    aria-pressed={waypoint === point.id}
                    title={point.name}
                  >
                    <i />{point.name}
                  </button>
                ))}
              </div>
              <span className="waypoint-map-caption">ILLUSTRATIVE GLOBE · WAYPOINTS NOT TO SCALE</span>
            </div>
          </div>
          <aside className="waypoint-lesson" aria-live="polite">
            {activeWaypoint ? (
              <>
                <span className="eyebrow">FIELD NOTE / {activeWaypoint.name.toUpperCase()}</span>
                <h3>{activeWaypoint.name}</h3>
                <p>{activeWaypoint.lesson}</p>
                {guided && <button className="text-button" onClick={() => setLayer("atmosphere")}>CONTINUE TO ATMOSPHERE →</button>}
              </>
            ) : (
              <>
                <span className="eyebrow">YOUR FIELD NOTES</span>
                <h3>Choose a glowing pin</h3>
                <p>Surface labels reveal a short lesson when selected. In guided mode, the path waits for your click.</p>
              </>
            )}
            {guided && activeWaypoint && layer === "atmosphere" && <p className="guided-complete">OBJECTIVE COMPLETE · You connected a surface feature to its planetary environment.</p>}
          </aside>
        </div>
      )}
    </section>
  );
}
