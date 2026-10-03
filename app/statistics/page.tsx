import { SectionHeading } from "@/components/SectionHeading";

const stats = [["PLANETS", "08", "4 terrestrial · 2 gas · 2 ice"], ["SYSTEM AGE", "4.6 BY", "Estimated formation age"], ["STAR CLASS", "G2V", "Sol · yellow dwarf"], ["BASELINE", "1.0 AU", "Earth–Sun distance"], ["KNOWN MOONS", "456", "Current dataset total"], ["ESCAPE VELOCITY", "618 km/s", "Solar surface reference"]];

export default function StatisticsPage() {
  return <div className="page"><SectionHeading eyebrow="SYSTEM TELEMETRY / 005" title="Macro statistics">The solar system in one instrument panel.</SectionHeading><div className="telemetry-grid">{stats.map(([label, value, detail]) => <article className="metric" key={label}><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>)}</div><div className="signal"><span className="pulse" /><span>DATASET 01 · SOLAR SYSTEM</span><span className="signal-line" /></div></div>;
}
