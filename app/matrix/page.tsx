"use client";

import Link from "next/link";
import { useState } from "react";
import { planets } from "@/lib/planets";
import { SectionHeading } from "@/components/SectionHeading";

const presets: Record<string, string[]> = {
  "EARTH / MARS": ["earth", "mars"],
  "GAS GIANTS": ["jupiter", "saturn"],
  "INNER WORLDS": ["mercury", "venus", "earth", "mars"],
};

export default function MatrixPage() {
  const [selected, setSelected] = useState(["earth", "mars"]);
  const visible = planets.filter((planet) => selected.includes(planet.id));
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.length > 2 ? current.filter((item) => item !== id) : current
        : [...current, id],
    );

  return <div className="page">
    <SectionHeading eyebrow="COMPARATIVE INDEX / 002" title="The matrix">Build a side-by-side readout from two to eight worlds.</SectionHeading>
    <div className="matrix-tools">
      <div className="chip-row">{Object.entries(presets).map(([label, ids]) => <button className="chip" key={label} onClick={() => setSelected(ids)}>{label}</button>)}</div>
      <div className="chip-row">{planets.map((planet, index) => <button className={`chip ${selected.includes(planet.id) ? "active" : ""}`} key={planet.id} onClick={() => toggle(planet.id)}>{String(index + 1).padStart(2, "0")} {planet.name}</button>)}</div>
    </div>
    <div className="matrix matrix-comparison">
      <div className="matrix-row matrix-head"><span>METRIC</span>{visible.map((planet) => <strong style={{ color: planet.accent }} key={planet.id}>{planet.name}</strong>)}</div>
      {[
        ["CLASS", (id: string) => planets.find((planet) => planet.id === id)?.className],
        ["DIAMETER", (id: string) => planets.find((planet) => planet.id === id)?.diameter],
        ["MASS / EARTH", (id: string) => ({ mercury: "0.055×", venus: "0.815×", earth: "1.000×", mars: "0.107×", jupiter: "317.8×", saturn: "95.2×", uranus: "14.5×", neptune: "17.1×" }[id])],
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
