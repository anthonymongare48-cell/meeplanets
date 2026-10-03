import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlanet, planets } from "@/lib/planets";
import { SectionHeading } from "@/components/SectionHeading";
import { PlanetLearningPanel } from "@/components/PlanetLearningPanel";

export function generateStaticParams() { return planets.map(({ id }) => ({ id })); }

export default async function PlanetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const planet = getPlanet(id);
  if (!planet) notFound();
  return <div className="page planet-page"><Link href="/" className="back-link">← ALL WORLDS</Link><section className="planet-hero"><div><span className="eyebrow">TELEMETRY / {planet.id.toUpperCase()}</span><h1 style={{ color: planet.accent }}>{planet.name}</h1><p className="tagline">{planet.tagline}</p><p className="description">{planet.description}</p></div><div className={`planet-visual planet-visual-${planet.id}`} style={{ "--planet-color": planet.accent } as React.CSSProperties}><div className="planet-sphere" /><div className="planet-shadow" /></div></section><section className="telemetry"><SectionHeading eyebrow="LIVE READOUT" title="Planetary telemetry" /><div className="telemetry-grid">{[["ORBITAL DISTANCE", planet.distance], ["SURFACE TEMPERATURE", planet.temperature], ["SURFACE GRAVITY", planet.gravity], ["KNOWN MOONS", String(planet.moons).padStart(3, "0")], ["DIAMETER", planet.diameter], ["DAY LENGTH", planet.day], ["ORBITAL PERIOD", planet.year], ["ESCAPE VELOCITY", planet.escapeVelocity], ["AXIAL TILT", planet.axialTilt], ["SURFACE PRESSURE", planet.surfacePressure], ["ATMOSPHERE", planet.atmosphere], ["RINGS", planet.rings]].map(([label, value]) => <div className="metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section><section className="telemetry"><SectionHeading eyebrow="ANALYSIS / 02" title="Atmosphere & geology" /><div className="history-grid"><article className="history-card"><span className="eyebrow">WEATHER</span><h2>Atmospheric dynamics</h2><p>{planet.weather}</p></article><article className="history-card"><span className="eyebrow">MINERALS & INTERIOR</span><h2>{planet.geology}</h2><p>{planet.minerals}</p></article><article className="history-card"><span className="eyebrow">SATELLITES</span><h2>{planet.moons} confirmed moons</h2><p>{planet.notableMoons}. {planet.rings}. Satellite counts are time-sensitive and should be read with their source date.</p></article></div></section><PlanetLearningPanel planet={planet} /></div>;
}
