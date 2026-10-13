import "./galaxy.css";
import { SectionHeading } from "@/components/SectionHeading";
import { MilkyWayExperience } from "@/components/MilkyWayExperience";

export default function GalaxyPage() {
  return (
    <div className="page galaxy-page">
      <SectionHeading eyebrow="GALACTIC ATLAS / 014" title="The Milky Way">
        Explore the supplied Milky Way artwork: select celestial objects to open their details, or navigate the map with the satellite controls.
      </SectionHeading>
      <MilkyWayExperience />
      <p className="galaxy-method-note">The supplied artwork is an illustration. The guided zoom is a visual effect, not a physical flight or measured star map.</p>
    </div>
  );
}
