import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

const simulations = [
  {
    href: "/",
    label: "01 / ORBITAL SIMULATOR",
    title: "Solar system",
    text: "Run the eight-planet orbital model. Select worlds, switch between TOP 2D and 3D presentation, scrub time, zoom, and change simulation speed.",
    action: "LAUNCH ORBITAL VIEW",
  },
  {
    href: "/interactive-physics",
    label: "02 / PHYSICS LAB",
    title: "Gravity & exoplanets",
    text: "Tune a Jupiter gravity-assist trajectory and build an exoplanet by changing mass, orbital distance, and atmosphere.",
    action: "OPEN PHYSICS LAB",
  },
  {
    href: "/mission-control",
    label: "03 / MISSION CONTROL",
    title: "Probe & rover missions",
    text: "Write safe commands for a custom probe or rover, run the mission sequence, and inspect its simulated route.",
    action: "ENTER MISSION CONTROL",
  },
  {
    href: "/mining-exchange",
    label: "04 / ECONOMIC SIMULATION",
    title: "Asteroid exchange",
    text: "Deploy extractors into procedural asteroid belts, harvest resources, and trade them through the virtual securities exchange.",
    action: "OPEN EXCHANGE",
  },
  {
    href: "/observatory",
    label: "05 / OBSERVATORY",
    title: "Time & signal",
    text: "Scrub the historical astronomy timeline, inspect constellation geometry, adjust a simplified perturbation model, and view live telemetry.",
    action: "OPEN OBSERVATORY",
  },
  {
    href: "/learning-lab",
    label: "06 / CLASSROOM MODE",
    title: "Learning lab",
    text: "Follow structured lessons, draw over visualizations, pin notes, reveal planetary cross-sections, and use narrated instruction.",
    action: "START A LESSON",
  },
  {
    href: "/astrometry",
    label: "07 / ASTROMETRY LAB",
    title: "Stars, shadows & signals",
    text: "Explore Goldilocks zones, atmospheric spectra, transit shadows, cosmic zoom, time dilation, procedural systems, classroom physics, and sonification.",
    action: "OPEN ASTROMETRY LAB",
  },
  {
    href: "/advanced-observatory",
    label: "08 / ADVANCED OBSERVATORY",
    title: "Live data & rendering",
    text: "Track satellites, tour eclipses, explore minor bodies, tune rendering, place coordinate pins, and pilot a collision course.",
    action: "OPEN ADVANCED OBSERVATORY",
  },
  {
    href: "/catalog",
    label: "09 / SMALL BODIES",
    title: "Meteors & minor worlds",
    text: "Classify meteoroids, meteorites, asteroids, dwarf planets, spectral types, and trans-Neptunian objects.",
    action: "OPEN SMALL-BODIES CATALOG",
  },
];

export default function SimulationsPage() {
  return <div className="page">
    <SectionHeading eyebrow="INTERACTIVE SYSTEMS / 007" title="Choose a simulation">Every hands-on COSMOS experience, collected in one launch bay.</SectionHeading>
    <div className="simulation-grid">{simulations.map((simulation) => <article className="simulation-card" key={simulation.href}><span className="eyebrow">{simulation.label}</span><h2>{simulation.title}</h2><p>{simulation.text}</p><Link className="button" href={simulation.href}>{simulation.action} <span>↗</span></Link></article>)}</div>
  </div>;
}
