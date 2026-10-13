import Link from "next/link";
import { planets, planetImages } from "@/lib/planets";
import { SectionHeading } from "@/components/SectionHeading";
import { SolarSystemSimulator } from "@/components/SolarSystemSimulator";
import { HeroOrbitIllustration } from "@/components/HeroOrbitIllustration";

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div>
          <span className="eyebrow">FIELD GUIDE / 001</span>
          <h1>THE<br /><em>SOLAR</em><br />SYSTEM</h1>
          <p className="hero-copy">A living atlas of the worlds orbiting our star. Select a destination and begin your descent.</p>
          <Link href="/planets/earth" className="button">BEGIN EXPLORATION <span>↗</span></Link>
          <Link href="/command-center" className="home-command-link">OPEN MISSION COMMAND <span aria-hidden="true">↗</span></Link>
        </div>
        <HeroOrbitIllustration />
      </section>
      <SolarSystemSimulator />
      <section className="planet-selector">
        <SectionHeading eyebrow="NAVIGATE" title="Choose a world" />
        <div className="planet-grid">
          {planets.map((planet, index) => {
            const image = planetImages[planet.id];
            return (
              <Link href={`/planets/${planet.id}`} className="planet-card" key={planet.id}>
                <span className="card-index">0{index + 1}</span>
                <span
                  className="planet-dot"
                  style={{ backgroundColor: planet.accent }}
                  aria-hidden="true"
                >{image && <img src={image.src} alt="" loading="lazy" decoding="async" style={{ objectPosition: image.position ?? "center" }} />}</span>
                <strong>{planet.name}</strong>
                <small>{planet.className}</small>
                <span className="arrow">↗</span>
                <span className="planet-card-cta">INSPECT 3D MODEL <b aria-hidden="true">↗</b></span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
