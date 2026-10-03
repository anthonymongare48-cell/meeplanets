"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";

const objects = [
  { id: "carina", type: "STELLAR NURSERY", title: "Carina Nebula / NGC 3372", span: "460 ly", detail: "A massive star-forming region 7,600 light-years away. JWST observations reveal proto-stellar jets and sculpted dust pillars.", fact: "Central stars: Eta Carinae and Trumpler 14" },
  { id: "trappist", type: "EXOPLANET", title: "TRAPPIST-1e", span: "40 ly", detail: "A rocky, Earth-sized world in the habitable zone of an ultracool red dwarf. Atmospheric observations remain an active research target.", fact: "System: seven transiting terrestrial worlds" },
  { id: "crab", type: "SUPERNOVA REMNANT", title: "Crab Nebula / Messier 1", span: "11 ly", detail: "The expanding remnant of a supernova recorded in 1054. A rapidly spinning pulsar powers its luminous filaments.", fact: "Distance: approximately 6,500 light-years" },
];

export default function DeepSpacePage() {
  const [active, setActive] = useState(objects[0]);
  return <div className="page deep-page"><SectionHeading eyebrow="BEYOND THE SYSTEM / 003" title="Deep space">Explore stellar nurseries, exoplanets, and the remnants of dead stars.</SectionHeading>
    <div className="history-grid">{objects.map((object) => <button className={`history-card ${active.id === object.id ? "active" : ""}`} key={object.id} onClick={() => setActive(object)}><span className="card-index">{object.type}</span><h2>{object.title}</h2><p>{object.detail}</p><strong>{object.span}</strong></button>)}</div>
    <Link className="button galaxy-launch-link" href="/galaxy">ENTER THE MILKY WAY ↗</Link>
    <article className="signal dossier"><span className="eyebrow">TARGET DOSSIER / {active.type}</span><h2>{active.title}</h2><p>{active.detail}</p><div className="telemetry-grid"><div className="metric"><span>OBSERVATION</span><strong>{active.fact}</strong></div><div className="metric"><span>PHYSICAL SPAN</span><strong>{active.span}</strong></div><div className="metric"><span>STATUS</span><strong>RECEIVING DATA</strong></div></div></article>
  </div>;
}
