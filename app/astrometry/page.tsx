import { SectionHeading } from "@/components/SectionHeading";
import { AstrometryLab } from "@/components/AstrometryLab";
import { SharedAstronomyModel } from "@/components/SharedAstronomyModel";

export default function AstrometryPage() {
  return <div className="page"><SectionHeading eyebrow="PHYSICAL SIMULATIONS / 011" title="Astrometry Lab">Explore habitability, spectra, eclipses, relativity, procedural systems, classroom tools, and sonified signals.</SectionHeading><SharedAstronomyModel /><AstrometryLab /></div>;
}
