import { SectionHeading } from "@/components/SectionHeading";
import { MilkyWayExperience } from "@/components/MilkyWayExperience";

export default function GalaxyPage() {
  return (
    <div className="page galaxy-page">
      <SectionHeading eyebrow="GALACTIC ATLAS / 014" title="The Milky Way">
        Leave the planetary neighborhood and fly through a procedural, barred-spiral model of our galaxy.
      </SectionHeading>
      <MilkyWayExperience />
      <p className="galaxy-method-note">Visual model for exploration and scale intuition only. Star positions, dust lanes, and colors are illustrative, not observationally measured locations.</p>
    </div>
  );
}
