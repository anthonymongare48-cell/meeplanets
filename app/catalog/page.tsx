"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";

const objects = [
  ["Ceres", "DWARF PLANET", "939 km", "Largest asteroid-belt body and the only recognized dwarf planet in the inner solar system."],
  ["Vesta", "S-TYPE ASTEROID", "525 km", "Dawn confirmed Vesta as the parent body of HED meteorites."],
  ["Pallas", "B-TYPE ASTEROID", "512 km", "One of the four bodies containing roughly half the main belt's mass."],
  ["Hygiea", "C-TYPE ASTEROID", "434 km", "A dark, carbonaceous body with a low-albedo surface."],
  ["Pluto", "DWARF PLANET", "2,377 km", "A Kuiper Belt dwarf planet with a nitrogen-ice heart."],
  ["Eris", "DWARF PLANET", "2,326 km", "Approximately 27% more massive than Pluto."],
  ["Haumea", "DWARF PLANET", "1,632 km", "A rapidly rotating, elongated icy world."],
  ["Makemake", "DWARF PLANET", "1,430 km", "A bright, methane-rich Kuiper Belt object."],
  ["Sedna", "TNO", "995 km", "A distant scattered-disc candidate with an extreme orbit."],
];

const meteorites = [
  ["STONY", "95%+", "Chondrites preserve ancient chondrules; achondrites record differentiated melting."],
  ["IRON", "Common in collections", "Metallic cores of ancient asteroids with Widmanstätten crystal patterns."],
  ["STONY-IRON", "<2%", "Iron-nickel mixed with silicates; pallasites contain olivine crystals."],
];

export default function CatalogPage() {
  const [spectral, setSpectral] = useState("ALL");
  const filtered = objects.filter(([, type]) => spectral === "ALL" || type.includes(spectral));
  return <div className="page"><SectionHeading eyebrow="SMALL BODIES / 013" title="Meteors & minor worlds">From dust in space to the rocks that reach the ground, explore the objects between the planets.</SectionHeading><section className="history-card catalog-intro"><span className="eyebrow">IAU DEFINITION</span><h2>What makes a dwarf planet?</h2><p>It orbits the Sun, has enough mass to be mostly round, and has not cleared its orbital neighborhood of similar-sized objects.</p><strong>Recognized dwarf planets: Ceres · Pluto · Haumea · Makemake · Eris</strong></section><div className="chip-row">{["ALL", "DWARF", "ASTEROID", "TNO"].map((value) => <button className={`chip ${spectral === value ? "active" : ""}`} key={value} onClick={() => setSpectral(value)}>{value}</button>)}</div><div className="history-grid catalog-grid">{filtered.map(([name, type, size, detail]) => <article className="history-card" key={name}><span className="eyebrow">{type}</span><h2>{name}</h2><strong>{size}</strong><p>{detail}</p></article>)}</div><section className="telemetry"><SectionHeading eyebrow="METEORITE CLASSIFICATION" title="Space rock to ground truth">A meteoroid is the object in space; a meteor is its atmospheric streak; a meteorite is what survives to the ground.</SectionHeading><div className="history-grid">{meteorites.map(([name, percentage, detail]) => <article className="history-card" key={name}><span className="eyebrow">{name}</span><h2>{percentage}</h2><p>{detail}</p></article>)}</div></section><div className="signal"><span className="pulse" /><span>MAIN ASTEROID BELT · 1.1M+ DISCOVERED OBJECTS · MOSTLY EMPTY SPACE</span><span className="signal-line" /></div></div>;
}
