import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { SharedAstronomyModel } from "@/components/SharedAstronomyModel";

const simulations = [
  {
    href: "/#orbital-view",
    label: "01 / SOLAR SYSTEM",
    title: "Orbital simulator",
    text: "Watch the eight planets orbit and rotate alongside the asteroid belt and a passing meteoroid. Select a planet, adjust speed, or switch projection.",
    visual: "exchange",
    readout: "ORBITAL MECHANICS · LIVE",
  },
  {
    href: "/mission-control",
    label: "02 / EXPLORATION MISSIONS",
    title: "Probe & rover missions",
    text: "Pilot the Mars rover, visit waypoints, scan terrain, and run safe mission scripts in the mission-control simulator.",
    visual: "gravity",
    readout: "MISSION OPERATIONS",
  },
  {
    href: "/astrometry",
    label: "03 / STARS & SIGNALS",
    title: "Transit observatory",
    text: "Move a world across its star, measure the simulated light-curve dip, and inspect the signal.",
    visual: "shadow",
    readout: "TRANSIT PHOTOMETRY",
  },
  {
    href: "/advanced-observatory",
    label: "04 / ADVANCED INSTRUMENTS",
    title: "Observatory console",
    text: "Explore satellite tracking, eclipse geometry, coordinate pins, collision flight, and instrument rendering controls.",
    visual: "render",
    readout: "OBSERVATION & TRACKING",
  },
  {
    href: "/interactive-physics",
    label: "05 / GRAVITY & EXOPLANETS",
    title: "Interactive physics",
    text: "Adjust a gravity-assist encounter and explore the climate of a fictional exoplanet.",
    visual: "gravity",
    readout: "PHYSICS LAB",
  },
  {
    href: "/mining-exchange",
    label: "06 / ASTEROID DYNAMICS",
    title: "Asteroid exchange",
    text: "Deploy extractors across a seeded asteroid belt and trade simulated water and metal.",
    visual: "exchange",
    readout: "MINING & MARKET",
  },
  {
    href: "/observatory",
    label: "07 / TIME & CONSTELLATIONS",
    title: "Astronomy observatory",
    text: "Scrub the astronomy timeline, inspect constellation geometry, and explore identified telemetry.",
    visual: "shadow",
    readout: "OBSERVING TOOLS",
  },
  {
    href: "/learning-lab",
    label: "08 / GUIDED LEARNING",
    title: "Learning lab",
    text: "Explore structured lessons, planetary cross-sections, interactive notes, and narrated instruction.",
    visual: "render",
    readout: "CLASSROOM MODE",
  },
  {
    href: "/catalog",
    label: "09 / SMALL BODIES",
    title: "Meteors & minor worlds",
    text: "Explore the asteroid and meteoroid artwork, classify meteorites, and browse the minor-body catalog.",
    visual: "meteors",
    readout: "SMALL-BODY CATALOG",
  },
  {
    href: "/matrix",
    label: "10 / PLANET COMPARISON",
    title: "Planet comparison matrix",
    text: "Compare two to eight worlds by size, mass, gravity, distance, temperature, and moons.",
    visual: "render",
    readout: "COMPARATIVE TELEMETRY",
  },
  {
    href: "/soundscape",
    label: "11 / AMBIENT AUDIO",
    title: "Space soundscape",
    text: "Choose an environment, shape the sound intensity, and play the generated ambient audio.",
    visual: "shadow",
    readout: "AUDIO EXPERIENCE",
  },
  {
    href: "/audio-expedition",
    label: "12 / GUIDED JOURNEY",
    title: "Audio expedition",
    text: "Take a narrated journey through the solar system and its planetary destinations.",
    visual: "meteors",
    readout: "NARRATED EXPLORATION",
  },
  {
    href: "/quiz",
    label: "13 / KNOWLEDGE CHECK",
    title: "Astronomy quiz",
    text: "Test your astronomy knowledge with an interactive quiz and review your results.",
    visual: "gravity",
    readout: "MISSION ASSESSMENT",
  },
];

export default function SimulationsPage() {
  return <div className="page">
    <SectionHeading eyebrow="INTERACTIVE SYSTEMS / 007" title="Simulation center">All interactive models, mission tools, and learning experiences in one place. Choose a simulation to open its controls and explore.</SectionHeading>
    <p className="description"><Link href="/labs">Looking for the hands-on labs? Browse the complete lab directory ↗</Link></p>
    <SharedAstronomyModel />
    <div className="simulation-matrix">{simulations.map((simulation) => <Link className={`matrix-panel matrix-panel--${simulation.visual}`} href={simulation.href} key={simulation.href}>
      <div className="matrix-panel__top"><span>{simulation.label}</span><span className="matrix-panel__live"><i /> READY</span></div>
      <div className="matrix-panel__visual" aria-hidden="true"><i /><i /><i /><i /><i /><b /><em /></div>
      <div className="matrix-panel__body"><span className="matrix-panel__readout">{simulation.readout}</span><h2>{simulation.title}</h2><p>{simulation.text}</p><span className="matrix-panel__launch">OPEN SIMULATION <b>↗</b></span></div>
    </Link>)}</div>
  </div>;
}
