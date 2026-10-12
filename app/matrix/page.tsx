"use client";

import Link from "next/link";
import { useState } from "react";
import { planets } from "@/lib/planets";
import { SectionHeading } from "@/components/SectionHeading";
import { SharedAstronomyModel } from "@/components/SharedAstronomyModel";
import { useCosmosStore } from "@/store/useCosmosStore";

const presets: Record<string, string[]> = {
  "EARTH / MARS": ["earth", "mars"],
  "GAS GIANTS": ["jupiter", "saturn"],
  "INNER WORLDS": ["mercury", "venus", "earth", "mars"],
};

export default function MatrixPage() {
  const [selected, setSelected] = useState(() => {
    const activePlanet = useCosmosStore.getState().selectedPlanet;
    const comparisonPlanet = activePlanet === "earth" ? "mars" : "earth";
    return [activePlanet, comparisonPlanet];
  });
  const selectPlanet = useCosmosStore((state) => state.selectPlanet);
  const visible = planets.filter((planet) => selected.includes(planet.id));
  const toggle = (id: string) => {
    const current = selected;
    if (current.includes(id)) {
      const next = current.length > 2 ? current.filter((item) => item !== id) : current;
      if (next !== current && id === useCosmosStore.getState().selectedPlanet) selectPlanet(next[0]);
      setSelected(next);
      return;
    }
    selectPlanet(id);
    setSelected([...current, id]);
  };

  return <div className="page">
    <SectionHeading eyebrow="COMPARATIVE INDEX / 002" title="The matrix">Build a side-by-side readout from two to eight worlds.</SectionHeading>
    <SharedAstronomyModel onPlanetSelect={(id) => setSelected((current) => current.includes(id) ? current : [...current, id])} />
    <div className="matrix-tools">
      <div className="chip-row">{Object.entries(presets).map(([label, ids]) => <button className="chip" key={label} onClick={() => { setSelected(ids); selectPlanet(ids[0]); }}>{label}</button>)}</div>
      <div className="chip-row">{planets.map((planet, index) => <button className={`chip ${selected.includes(planet.id) ? "active" : ""}`} key={planet.id} onClick={() => toggle(planet.id)}>{String(index + 1).padStart(2, "0")} {planet.name}</button>)}</div>
    </div>
    <div className="matrix matrix-comparison">
      <div className="matrix-row matrix-head"><span>METRIC</span>{visible.map((planet) => <strong style={{ color: planet.accent }} key={planet.id}>{planet.name}</strong>)}</div>
      {[
        ["CLASS", (id: string) => planets.find((planet) => planet.id === id)?.className],
        ["DIAMETER", (id: string) => planets.find((planet) => planet.id === id)?.diameter],
        ["MASS / EARTH", (id: string) => `${planets.find((planet) => planet.id === id)?.massEarth.toLocaleString()}×`],
        ["GRAVITY", (id: string) => planets.find((planet) => planet.id === id)?.gravity],
        ["DISTANCE", (id: string) => planets.find((planet) => planet.id === id)?.distance],
        ["TEMPERATURE", (id: string) => planets.find((planet) => planet.id === id)?.temperature],
        ["MOONS", (id: string) => String(planets.find((planet) => planet.id === id)?.moons)],
      ].map(([label, read]) => <div className="matrix-row" key={label as string}><span>{label as string}</span>{visible.map((planet) => <span key={planet.id}>{(read as (id: string) => string | undefined)(planet.id)}</span>)}</div>)}
    </div>
    <p className="muted">Select a world to open its full telemetry dossier.</p>
    <div className="chip-row">{visible.map((planet) => <Link className="button secondary" href={`/planets/${planet.id}`} key={planet.id}>OPEN {planet.name} ↗</Link>)}</div>
  </div>;
}
