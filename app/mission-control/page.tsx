import { MissionOperationsSimulator } from "@/components/MissionOperationsSimulator";
import { SectionHeading } from "@/components/SectionHeading";
import { SharedAstronomyModel } from "@/components/SharedAstronomyModel";

export default function MissionControlPage() {
  return (
    <div className="page">
      <SectionHeading eyebrow="OPERATIONS / 009" title="Mission control">
        Operate an orbiter above Mars, command a rover on the surface, and inspect simulated vehicle telemetry.
      </SectionHeading>
      <SharedAstronomyModel fixedPlanetId="mars" />
      <MissionOperationsSimulator />
    </div>
  );
}
