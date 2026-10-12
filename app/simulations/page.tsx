import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { SharedAstronomyModel } from "@/components/SharedAstronomyModel";

const matrix = [
  {
    href: "/astrometry",
    label: "01 / STARS, SHADOWS & SIGNALS",
    title: "Transit observatory",
    text: "Move a world across its star, measure the simulated light-curve dip, and switch the signal band.",
    visual: "shadow",
    readout: "TRANSIT PHOTOMETRY",
  },
  {
    href: "/advanced-observatory",
    label: "02 / LIVE DATA & 3D RENDERING",
    title: "Observatory console",
    text: "Explore satellite tracking, eclipse geometry, coordinate pins, and instrument rendering controls.",
    visual: "render",
    readout: "ORBITAL INSTRUMENTS",
  },
  {
    href: "/catalog",
    label: "03 / METEORS & MINOR WORLDS",
    title: "Minor-body tracker",
    text: "Classify asteroids, meteoroids, meteorites, and distant small worlds in the catalog.",
    visual: "meteors",
    readout: "SMALL-BODY CATALOG",
  },
  {
    href: "/interactive-physics",
    label: "04 / GRAVITY & EXOPLANETS",
    title: "Gravity field lab",
    text: "Adjust a gravity-assist encounter and tune the climate of a fictional exoplanet.",
    visual: "gravity",
    readout: "TEACHING MODEL",
  },
  {
    href: "/mining-exchange",
    label: "05 / ASTEROID EXCHANGE & DYNAMICS",
    title: "Asteroid exchange",
    text: "Deploy extractors across a deterministic belt and trade simulated water and metal.",
    visual: "exchange",
    readout: "VIRTUAL MARKET",
  },
];

const additionalSimulations = [
  {
    href: "/",
    label: "01 / ORBITAL SIMULATOR",
    title: "Solar system",
    text: "Run the eight-planet orbital model. Select worlds, switch between TOP 2D and 3D presentation, scrub time, zoom, and change simulation speed.",
    action: "LAUNCH ORBITAL VIEW",
  },
  {
    href: "/mission-control",
    label: "06 / MISSION CONTROL",
    title: "Probe & rover missions",
    text: "Write safe commands for a custom probe or rover, run the mission sequence, and inspect its simulated route.",
    action: "ENTER MISSION CONTROL",
  },
  {
    href: "/observatory",
    label: "07 / OBSERVATORY",
    title: "Time & signal",
    text: "Scrub the historical astronomy timeline, inspect constellation geometry, and review clearly identified telemetry displays.",
    action: "OPEN OBSERVATORY",
  },
  {
    href: "/learning-lab",
    label: "08 / CLASSROOM MODE",
    title: "Learning lab",
    text: "Follow structured lessons, draw over visualizations, pin notes, reveal planetary cross-sections, and use narrated instruction.",
    action: "START A LESSON",
  },
];

export default function SimulationsPage() {
  return <div className="page">
    <SectionHeading eyebrow="INTERACTIVE SYSTEMS / 007" title="Cosmic simulation matrix">Select an instrument to open its working model. Visualizations and readouts are illustrative simulations unless a panel explicitly identifies an external data source.</SectionHeading>
    <SharedAstronomyModel />
    <div className="simulation-matrix">{matrix.map((simulation) => <Link className={`matrix-panel matrix-panel--${simulation.visual}`} href={simulation.href} key={simulation.href}>
      <div className="matrix-panel__top"><span>{simulation.label}</span><span className="matrix-panel__live"><i /> READY</span></div>
      <div className="matrix-panel__visual" aria-hidden="true"><i /><i /><i /><i /><i /><b /><em /></div>
      <div className="matrix-panel__body"><span className="matrix-panel__readout">{simulation.readout}</span><h2>{simulation.title}</h2><p>{simulation.text}</p><span className="matrix-panel__launch">OPEN SIMULATION <b>↗</b></span></div>
    </Link>)}</div>
    <section className="simulation-additional"><div className="simulation-additional__heading"><span className="eyebrow">MORE INSTRUMENTS</span><h2>Continue exploring</h2></div><div className="simulation-additional__grid">{additionalSimulations.map((simulation) => <article className="simulation-card" key={simulation.href}><span className="eyebrow">{simulation.label}</span><h3>{simulation.title}</h3><p>{simulation.text}</p><Link className="button" href={simulation.href}>{simulation.action} <span>↗</span></Link></article>)}</div></section>
  </div>;
}
