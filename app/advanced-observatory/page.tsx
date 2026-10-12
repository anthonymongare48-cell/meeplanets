import { SectionHeading } from "@/components/SectionHeading";
import { AdvancedObservatory } from "@/components/AdvancedObservatory";
import { SharedAstronomyModel } from "@/components/SharedAstronomyModel";

export default function AdvancedObservatoryPage() {
  return <div className="page"><SectionHeading eyebrow="ADVANCED OBSERVATORY / 012" title="Beyond the canvas">Live tracking, cinematic alignments, adaptive rendering, minor bodies, and mission-grade experiments.</SectionHeading><SharedAstronomyModel /><AdvancedObservatory /></div>;
}
