import Link from "next/link";
import { planets } from "@/lib/planets";
import { SectionHeading } from "@/components/SectionHeading";
import { SolarSystemSimulator } from "@/components/SolarSystemSimulator";

export default function Home() {
  return <div className="page home-page"><section className="hero"><div><span className="eyebrow">FIELD GUIDE / 001</span><h1>THE<br /><em>SOLAR</em><br />SYSTEM</h1><p className="hero-copy">A living atlas of the worlds orbiting our star. Select a destination and begin your descent.</p><Link href="/planets/earth" className="button">BEGIN EXPLORATION <span>↗</span></Link></div><div className="orbit-art" aria-label="Orbital illustration"><div className="sun" /><div className="orbit orbit-a"><i /><b /></div><div className="orbit orbit-b"><i /><b /></div><div className="orbit orbit-c"><i /><b /></div></div></section><SolarSystemSimulator /><section className="planet-selector"><SectionHeading eyebrow="NAVIGATE" title="Choose a world" /><div className="planet-grid">{planets.map((planet, index) => <Link href={`/planets/${planet.id}`} className="planet-card" key={planet.id}><span className="card-index">0{index + 1}</span><span className="planet-dot" style={{ background: planet.accent }} /><strong>{planet.name}</strong><small>{planet.className}</small><span className="arrow">↗</span></Link>)}</div></section></div>;
}
