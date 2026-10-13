import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

const metrics = [
  ["DIAMETER", "3,475 km", "fifth-largest moon in the solar system"],
  ["MEAN DISTANCE", "384,400 km", "238,855 miles from Earth"],
  ["ORBIT & ROTATION", "27.3 days", "one rotation per orbit"],
  ["SURFACE GRAVITY", "1.62 m/s²", "about one-sixth of Earth's"],
  ["DAYTIME HIGH", "~120°C", "sunlit surface"],
  ["NIGHTTIME LOW", "~-130°C", "lunar night"],
];

export default function MoonPage() {
  return (
    <div className="page celestial-page moon-page">
      <SectionHeading eyebrow="NATURAL SATELLITE / 003" title="The Moon">
        Earth’s only natural satellite: a tidally locked, airless world preserving a record of ancient impacts and volcanism.
      </SectionHeading>

      <section className="celestial-hero moon-hero" aria-label="Moon overview">
        <div className="celestial-hero__image">
          <Image
            src="/space-missions/moon.jpg"
            alt="The Moon showing a heavily cratered surface and bright lunar highlands"
            width={704}
            height={451}
            priority
          />
          <span className="celestial-image-caption">LUNA · CRATERED HIGHLANDS</span>
        </div>
        <div className="celestial-hero__copy">
          <span className="eyebrow">EARTH’S COMPANION</span>
          <h2>One face to Earth.</h2>
          <p>The Moon is a rocky, differentiated world with an iron-rich core, a semi-fluid mantle, and a rigid crust. It rotates once in about 27.3 days—the same time it takes to orbit Earth—so the same hemisphere generally faces us.</p>
          <p>Its weak exosphere cannot retain heat. Sunlit ground can reach about 120°C, while nighttime temperatures can fall near −130°C.</p>
        </div>
      </section>

      <div className="telemetry-grid celestial-metrics">
        {metrics.map(([label, value, detail]) => (
          <div className="metric" key={label}><span>{label}</span><strong>{value}</strong><p>{detail}</p></div>
        ))}
      </div>

      <section className="celestial-science">
        <div className="celestial-section-heading">
          <span className="eyebrow">LUNAR FIELD NOTES / SURFACE & ORBIT</span>
          <h2>A world shaped by impacts and tides</h2>
        </div>
        <div className="celestial-card-grid">
          <article className="celestial-info-card">
            <span className="eyebrow">01 / ANCIENT TERRAIN</span>
            <h3>Highlands &amp; maria</h3>
            <p>The bright highlands are ancient, heavily cratered crust. The darker maria are broad plains where basaltic lava filled impact basins billions of years ago.</p>
          </article>
          <article className="celestial-info-card">
            <span className="eyebrow">02 / SYNCHRONOUS ROTATION</span>
            <h3>Tidally locked</h3>
            <p>The Moon’s rotation and orbital periods are both about 27.3 days. This synchronous rotation keeps nearly the same lunar hemisphere turned toward Earth as the Moon travels around us.</p>
          </article>
          <article className="celestial-info-card">
            <span className="eyebrow">03 / EARTH CONNECTION</span>
            <h3>Tides &amp; axial stability</h3>
            <p>Lunar gravity is the primary driver of Earth’s ocean tides and helps stabilize Earth’s axial tilt, moderating long-term variations in our planet’s seasons.</p>
          </article>
        </div>
        <p className="celestial-note">The Moon has an extremely tenuous exosphere rather than a breathable atmosphere. Surface temperatures vary with illumination and location.</p>
      </section>

      <Link className="button" href="/learning-lab">OPEN CLASSROOM LAB ↗</Link>
    </div>
  );
}
