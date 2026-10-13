import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

const metrics = [
  ["SYSTEM MASS", "99.8%", "of the solar system's mass"],
  ["EARTH DISTANCE", "150 million km", "about 93 million miles"],
  ["PHOTOSPHERE", "~5,500°C", "visible surface temperature"],
  ["CORE", ">15 million°C", "fusion region temperature"],
  ["COMPOSITION", "73% hydrogen", "about 25% helium"],
  ["CLASSIFICATION", "G-type star", "main-sequence yellow dwarf"],
];

export default function SunPage() {
  return (
    <div className="page celestial-page sun-page">
      <SectionHeading eyebrow="CENTRAL STAR / 000" title="The Sun">
        A G-type main-sequence star whose gravity holds the solar system together and whose fusion powers life on Earth.
      </SectionHeading>

      <section className="celestial-hero sun-hero" aria-label="Sun overview">
        <div className="celestial-hero__image">
          <Image
            src="/space-missions/sun.jpg"
            alt="The Sun's active surface glowing in orange light, with a plasma prominence extending from its edge"
            width={321}
            height={321}
            priority
          />
          <span className="celestial-image-caption">SOL · ACTIVE PLASMA</span>
        </div>
        <div className="celestial-hero__copy">
          <span className="eyebrow">A STAR IN MOTION</span>
          <h2>Gravity, plasma, fusion.</h2>
          <p>The Sun is a nearly spherical star made of electrically charged hot plasma. Its immense gravity binds the planets, moons, asteroids, and comets into one system.</p>
          <p>Deep below its visible surface, hydrogen nuclei fuse into helium. The released energy travels outward and eventually reaches Earth as sunlight and heat.</p>
        </div>
      </section>

      <div className="telemetry-grid celestial-metrics">
        {metrics.map(([label, value, detail]) => (
          <div className="metric" key={label}><span>{label}</span><strong>{value}</strong><p>{detail}</p></div>
        ))}
      </div>

      <section className="celestial-science">
        <div className="celestial-section-heading">
          <span className="eyebrow">INSIDE THE STAR / SOLAR PHYSICS</span>
          <h2>Fusion lights the system</h2>
        </div>
        <div className="celestial-card-grid">
          <article className="celestial-info-card">
            <span className="eyebrow">01 / CORE MECHANISM</span>
            <h3>Hydrogen becomes helium</h3>
            <p>At temperatures above 15 million °C and under enormous gravitational pressure, hydrogen nuclei fuse through the proton–proton chain. A small amount of mass becomes energy, which ultimately escapes as sunlight.</p>
          </article>
          <article className="celestial-info-card">
            <span className="eyebrow">02 / VISIBLE SURFACE</span>
            <h3>The photosphere</h3>
            <p>The layer we see shines at roughly 5,500 °C. Its changing brightness and texture reveal magnetic activity taking place throughout the Sun’s atmosphere.</p>
          </article>
          <article className="celestial-info-card">
            <span className="eyebrow">03 / SOLAR WEATHER</span>
            <h3>Magnetism in action</h3>
            <p>Strong magnetic fields create cooler sunspots and can power solar flares and coronal mass ejections—eruptions that send radiation and plasma into interplanetary space.</p>
          </article>
        </div>
        <p className="celestial-note">Composition percentages are approximate by mass and vary by layer; the Sun is plasma, not a solid sphere.</p>
      </section>

      <Link className="button" href="/observatory">EXPLORE SPACE MISSIONS ↗</Link>
    </div>
  );
}
