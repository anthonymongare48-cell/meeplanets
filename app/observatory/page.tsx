"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";

type Feed = { name: string; status: string; detail: string };

const constellationStars = [
  ["BETELGEUSE", 19, 26], ["BELLATRIX", 58, 29], ["ALNITAK", 28, 54],
  ["ALNILAM", 47, 54], ["MINTAKA", 65, 54], ["RIGEL", 58, 84],
];

export default function ObservatoryPage() {
  const [date, setDate] = useState(2026);
  const [constellations, setConstellations] = useState(true);
  const [feed, setFeed] = useState<Feed[]>([
    { name: "ISS", status: "STANDBY", detail: "Waiting for live orbital telemetry…" },
    { name: "SOLAR WEATHER", status: "READY", detail: "Live feed will update when the data service is reachable." },
    { name: "NEAR-EARTH OBJECTS", status: "READY", detail: "Use the timeline to compare mission eras and alignment context." },
  ]);
  const [mass, setMass] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.wheretheiss.at/v1/satellites/25544", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("ISS feed unavailable")))
      .then((data) => setFeed((current) => current.map((item) => item.name === "ISS" ? { name: "ISS", status: "LIVE", detail: `${Number(data.latitude).toFixed(2)}° lat · ${Number(data.longitude).toFixed(2)}° lon` } : item)))
      .catch(() => setFeed((current) => current.map((item) => item.name === "ISS" ? { ...item, status: "OFFLINE FALLBACK", detail: "Live service unavailable; simulator remains usable with cached mission context." } : item)));
    return () => controller.abort();
  }, []);

  const era = date < 1970 ? "PRE-SPACEFLIGHT" : date < 2000 ? "EXPLORATION ERA" : "CURRENT ERA";
  return <div className="page">
    <SectionHeading eyebrow="OBSERVATORY / 010" title="Time & signal">Scrub through mission history, reveal the night-sky geometry, and inspect live feeds.</SectionHeading>
    <section className="lab-visual">
      <div>
        <span className="eyebrow">HISTORICAL TIMELINE</span>
        <h2>{date} · {era}</h2>
        <p className="description">A teaching timeline for comparing probe milestones, alignments, and the changing tools used to observe the system.</p>
        <input type="range" min="1950" max="2035" value={date} onChange={(event) => setDate(Number(event.target.value))} aria-label="Historical astronomy timeline" />
        <div className="chip-row"><span className="chip">1957 SPUTNIK</span><span className="chip">1969 APOLLO 11</span><span className="chip">1990 HUBBLE</span><span className="chip">2021 JWST</span></div>
      </div>
      <div className="history-card"><span className="eyebrow">ALIGNMENT READOUT</span><h2>{Math.abs(date - 2026) < 2 ? "LIVE SKY WINDOW" : "HISTORICAL SIMULATION"}</h2><p>Planetary positions are shown as an educational relative-phase model, not an ephemeris.</p></div>
    </section>
    <section className="lab-visual">
      <div>
        <div className="lab-toolbar"><span className="eyebrow">CONSTELLATION OVERLAY</span><button className="text-button" onClick={() => setConstellations((value) => !value)}>{constellations ? "HIDE LINES" : "SHOW LINES"}</button></div>
        <div className={`cross-section constellation-stage ${constellations ? "show-layers" : ""}`} aria-label="Interactive constellation overlay">
          {constellationStars.map(([name, left, top]) => <span className="star-pin" style={{ left: `${left}%`, top: `${top}%` }} key={name}>{name}</span>)}
          {constellations && <svg className="constellation-lines" viewBox="0 0 100 100" aria-hidden="true"><path d="M19 26 L58 29 L65 54 L58 84 M28 54 L47 54 L65 54 M28 54 L19 26" /></svg>}
        </div>
      </div>
      <div className="history-card"><span className="eyebrow">ORBITAL MECHANICS</span><h2>Kepler / N-body sandbox</h2><p>Increase the test mass to see how a simplified gravitational perturbation changes the displayed orbit.</p><input type="range" min="1" max="10" value={mass} onChange={(event) => setMass(Number(event.target.value))} aria-label="Test mass" /><strong>{mass}× test mass · {mass === 1 ? "stable reference" : `${(mass * 4.2).toFixed(1)}% perturbation`}</strong></div>
    </section>
    <section><div className="lab-toolbar"><span className="eyebrow">LIVE TELEMETRY</span><span className="muted">Network data uses an explicit offline fallback.</span></div><div className="history-grid">{feed.map((item) => <article className="history-card" key={item.name}><span className="eyebrow">{item.status}</span><h2>{item.name}</h2><p>{item.detail}</p></article>)}</div></section>
  </div>;
}
