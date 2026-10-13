import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

const labs = [
  {
    href: "/mission-control",
    label: "01 / MISSION OPERATIONS",
    title: "Probe & rover lab",
    text: "Drive the Mars rover, navigate waypoints, scan terrain, and inspect mission telemetry.",
    visual: "gravity",
    readout: "MISSION CONTROL",
  },
  {
    href: "/astrometry",
    label: "02 / STELLAR SIGNALS",
    title: "Astrometry lab",
    text: "Simulate a planetary transit, measure its change in starlight, and inspect the resulting signal.",
    visual: "shadow",
    readout: "TRANSIT PHOTOMETRY",
  },
  {
    href: "/advanced-observatory",
    label: "03 / INSTRUMENTS",
    title: "Advanced observatory",
    text: "Explore tracking, eclipse geometry, coordinate pins, collision flight, and instrument controls.",
    visual: "render",
    readout: "OBSERVATION TOOLS",
  },
  {
    href: "/observatory",
    label: "04 / TIME & SKY",
    title: "Astronomy observatory",
    text: "Scrub a mission timeline, explore constellation geometry, and inspect available telemetry.",
    visual: "shadow",
    readout: "SKY & TELEMETRY",
  },
  {
    href: "/interactive-physics",
    label: "05 / GRAVITY & CLIMATE",
    title: "Interactive physics lab",
    text: "Adjust a gravity-assist encounter and investigate the climate of an exoplanet.",
    visual: "gravity",
    readout: "PHYSICS LAB",
  },
  {
    href: "/mining-exchange",
    label: "06 / ASTEROID RESOURCES",
    title: "Asteroid mining lab",
    text: "Place extractors across a simulated asteroid belt and trade water and metal resources.",
    visual: "exchange",
    readout: "RESOURCE SIMULATION",
  },
  {
    href: "/learning-lab",
    label: "07 / GUIDED LEARNING",
    title: "Learning lab",
    text: "Work through astronomy lessons, planetary cross-sections, interactive notes, and narration.",
    visual: "render",
    readout: "LEARNING MODULES",
  },
  {
    href: "/catalog",
    label: "08 / SMALL BODIES",
    title: "Small-bodies lab",
    text: "Explore asteroids, meteoroids, meteorites, and the minor-body catalog.",
    visual: "meteors",
    readout: "SMALL-BODY CATALOG",
  },
  {
    href: "/matrix",
    label: "09 / COMPARATIVE SCIENCE",
    title: "Planet comparison lab",
    text: "Compare two to eight planets by diameter, mass, gravity, distance, temperature, and moons.",
    visual: "render",
    readout: "COMPARATIVE TELEMETRY",
  },
  {
    href: "/#orbital-view",
    label: "10 / ORBITAL MECHANICS",
    title: "Solar system lab",
    text: "Observe rotating planets, the asteroid belt, and a passing meteoroid; adjust speed and projection.",
    visual: "exchange",
    readout: "ORBITAL SIMULATION",
  },
];

export default function LabsPage() {
  return (
    <div className="page">
      <SectionHeading eyebrow="RESEARCH & DISCOVERY / 008" title="The labs">
        A single directory for the hands-on astronomy labs. Choose a lab to run an experiment, explore a system, or inspect its data.
      </SectionHeading>
      <div className="simulation-matrix">
        {labs.map((lab) => (
          <Link className={`matrix-panel matrix-panel--${lab.visual}`} href={lab.href} key={lab.href}>
            <div className="matrix-panel__top">
              <span>{lab.label}</span>
              <span className="matrix-panel__live"><i /> READY</span>
            </div>
            <div className="matrix-panel__visual" aria-hidden="true"><i /><i /><i /><i /><i /><b /><em /></div>
            <div className="matrix-panel__body">
              <span className="matrix-panel__readout">{lab.readout}</span>
              <h2>{lab.title}</h2>
              <p>{lab.text}</p>
              <span className="matrix-panel__launch">OPEN LAB <b>↗</b></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
