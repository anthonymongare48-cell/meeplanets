import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export default function MoonPage() {
  return <div className="page"><SectionHeading eyebrow="NATURAL SATELLITE / 003" title="The Moon">Earth’s tidally locked companion and a living record of early impacts.</SectionHeading><div className="telemetry-grid"><div className="metric"><span>DIAMETER</span><strong>3,475 km</strong></div><div className="metric"><span>GRAVITY</span><strong>1.62 m/s²</strong></div><div className="metric"><span>ESCAPE VELOCITY</span><strong>2.4 km/s</strong></div><div className="metric"><span>AXIAL TILT</span><strong>6.7°</strong></div><div className="metric"><span>MONTH</span><strong>27.3 days</strong></div><div className="metric"><span>ATMOSPHERE</span><strong>Exosphere</strong></div></div><Link className="button" href="/learning-lab">OPEN CLASSROOM LAB ↗</Link></div>;
}
