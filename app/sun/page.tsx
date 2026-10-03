import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

const metrics = [
  ["SYSTEM MASS", "99.86%", "of the solar system"],
  ["EARTH MASS", "333,000×", "relative mass"],
  ["MEAN RADIUS", "695,700 km", "109.2 Earth radii"],
  ["PHOTOSPHERE", "5,772 K", "effective surface temperature"],
  ["CORE", ">15 million K", "fusion zone"],
  ["SURFACE GRAVITY", "28× Earth", "274 m/s²"],
  ["ESCAPE VELOCITY", "617.6 km/s", "solar gravitational well"],
  ["POWER OUTPUT", "382.8 GW", "382.8 billion joules per second"],
  ["MAGNETIC FIELD", "1–3,000 G", "poles to sunspots"],
];

export default function SunPage() {
  return <div className="page"><SectionHeading eyebrow="CENTRAL STAR / 000" title="Sol">A G2V yellow dwarf and the gravitational heart of our system.</SectionHeading><div className="telemetry-grid">{metrics.map(([label, value, detail]) => <div className="metric" key={label}><span>{label}</span><strong>{value}</strong><p>{detail}</p></div>)}</div><section className="telemetry"><SectionHeading eyebrow="PHOTOSPHERE / COMPOSITION" title="Solar atmosphere" /><div className="history-grid"><article className="history-card"><span className="eyebrow">HYDROGEN</span><h2>90.965%</h2><p>Hydrogen dominates the visible photosphere and fuels the core&apos;s proton-proton fusion chain.</p></article><article className="history-card"><span className="eyebrow">HELIUM</span><h2>8.889%</h2><p>Helium is the primary fusion product accumulating in the core over the Sun&apos;s lifetime.</p></article><article className="history-card"><span className="eyebrow">TRACE ELEMENTS</span><h2>0.146%</h2><p>Oxygen, carbon, neon, nitrogen, iron, and other elements shape spectral absorption lines.</p></article></div></section><Link className="button" href="/catalog">EXPLORE SMALL BODIES ↗</Link></div>;
}
