"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MissionOperationsSimulator } from "@/components/MissionOperationsSimulator";
import { SolarSystemSimulator } from "@/components/SolarSystemSimulator";
import { planets } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";

type Diagnostics = {
  graphics: boolean;
  network: boolean;
  reducedMotion: boolean;
};

const contacts = [
  { id: "2026-QX14", type: "NEAR-EARTH OBJECT", range: "0.018 AU", velocity: "12.4 km/s", angle: 38 },
  { id: "2026-MD03", type: "METEOROID", range: "0.042 AU", velocity: "8.7 km/s", angle: 146 },
  { id: "2026-RK09", type: "ASTEROID", range: "0.071 AU", velocity: "19.2 km/s", angle: 258 },
];

function readDiagnostics(): Diagnostics {
  const canvas = document.createElement("canvas");
  const graphics = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  return {
    graphics,
    network: navigator.onLine,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

export function CommandCenterDashboard() {
  const selectedId = useCosmosStore((state) => state.selectedPlanet);
  const selectPlanet = useCosmosStore((state) => state.selectPlanet);
  const selectedPlanet = planets.find((planet) => planet.id === selectedId) ?? planets[5];
  const [scanning, setScanning] = useState(true);
  const [scanCount, setScanCount] = useState(1);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const refresh = () => {
      setDiagnostics(readDiagnostics());
      setTimestamp(new Date().toISOString());
    };
    refresh();
    const timer = window.setInterval(() => setTimestamp(new Date().toISOString()), 1000);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  const passed = diagnostics ? Number(diagnostics.graphics) + Number(diagnostics.network) + 1 : 0;
  const diagnosticRows = [
    { label: "GRAPHICS PIPELINE", value: diagnostics ? (diagnostics.graphics ? "WEBGL READY" : "WEBGL UNAVAILABLE") : "CHECKING", good: diagnostics?.graphics ?? false },
    { label: "NETWORK UPLINK", value: diagnostics ? (diagnostics.network ? "CONNECTED" : "OFFLINE") : "CHECKING", good: diagnostics?.network ?? false },
    { label: "MOTION PROFILE", value: diagnostics ? (diagnostics.reducedMotion ? "REDUCED" : "STANDARD") : "CHECKING", good: true },
  ];

  return (
    <div className="page command-center">
      <header className="cc-header">
        <div>
          <span className="eyebrow">COSMOS / DEEP SPACE NETWORK · SECTOR SOL</span>
          <h1>MISSION <em>COMMAND</em></h1>
          <p>Solar system operations, live target selection, and spacecraft telemetry.</p>
        </div>
        <div className="cc-clock">
          <span>GROUND STATION / UTC</span>
          <time dateTime={timestamp || undefined}>{timestamp ? timestamp.replace("T", " ").slice(0, 19) : "SYNCHRONIZING…"}</time>
          <span className="cc-uplink"><i /> CONTROL LINK ACTIVE</span>
        </div>
      </header>

      <div className="cc-main-grid">
        <section className="cc-module cc-orbit-module" aria-label="Solar system orbital simulator">
          <div className="cc-module-heading">
            <div><span className="cc-index">01 / ORBITAL OPERATIONS</span><h2>Solar system simulator</h2></div>
            <span className="cc-live"><i /> LIVE SIMULATION</span>
          </div>
          <SolarSystemSimulator />
        </section>

        <section className="cc-module cc-target-module" aria-labelledby="cc-target-title">
          <div className="cc-module-heading">
            <div><span className="cc-index">02 / NAVIGATION</span><h2 id="cc-target-title">Target selector</h2></div>
          </div>
          <label className="cc-select-label" htmlFor="cc-target">SELECT CELESTIAL BODY</label>
          <select id="cc-target" value={selectedPlanet.id} onChange={(event) => selectPlanet(event.target.value)}>
            {planets.map((planet) => <option key={planet.id} value={planet.id}>{planet.name} / {planet.className}</option>)}
          </select>
          <div className="cc-target-visual" style={{ "--target-color": selectedPlanet.accent } as React.CSSProperties}>
            <span className="cc-target-orbit cc-target-orbit-a" />
            <span className="cc-target-orbit cc-target-orbit-b" />
            <span className="cc-target-body" />
            <span className="cc-target-coordinates">{selectedPlanet.distance} FROM SOL</span>
          </div>
          <span className="cc-target-class">{selectedPlanet.className} · TARGET LOCKED</span>
          <h3>{selectedPlanet.name}</h3>
          <p className="cc-target-description">{selectedPlanet.description}</p>
          <dl className="cc-target-data">
            <div><dt>DIAMETER</dt><dd>{selectedPlanet.diameter}</dd></div>
            <div><dt>DAY LENGTH</dt><dd>{selectedPlanet.day}</dd></div>
            <div><dt>MOONS</dt><dd>{selectedPlanet.moons}</dd></div>
            <div><dt>TEMP</dt><dd>{selectedPlanet.temperature}</dd></div>
          </dl>
          <Link className="outline-btn cc-target-link" href={`/planets/${selectedPlanet.id}`}>OPEN TARGET TELEMETRY <span aria-hidden="true">↗</span></Link>
        </section>

        <section className="cc-module cc-radar-module" aria-labelledby="cc-radar-title">
          <div className="cc-module-heading">
            <div><span className="cc-index">03 / SPACE SURVEILLANCE</span><h2 id="cc-radar-title">Meteor radar</h2></div>
            <span className="cc-radar-count">{contacts.length.toString().padStart(2, "0")} CONTACTS</span>
          </div>
          <div className={`cc-radar${scanning ? " is-scanning" : ""}`} role="img" aria-label={`${contacts.length} simulated near-space object returns on radar`}>
            <span className="cc-radar-ring cc-radar-ring-one" />
            <span className="cc-radar-ring cc-radar-ring-two" />
            <span className="cc-radar-ring cc-radar-ring-three" />
            <span className="cc-radar-crosshair cc-radar-crosshair-x" />
            <span className="cc-radar-crosshair cc-radar-crosshair-y" />
            <span className="cc-radar-sweep" />
            {contacts.map((contact) => <i key={contact.id} className="cc-radar-contact" style={{ "--contact-angle": `${contact.angle}deg` } as React.CSSProperties} />)}
            <span className="cc-radar-center" />
            <span className="cc-radar-scale">RANGE 0.1 AU</span>
          </div>
          <p className="cc-simulated-note">SIMULATED SENSOR RETURNS · NOT LIVE ASTROMETRY</p>
          <div className="cc-contact-list">
            {contacts.map((contact) => <div className="cc-contact" key={contact.id}><span><b>{contact.id}</b><small>{contact.type}</small></span><span>{contact.range}<small>{contact.velocity}</small></span></div>)}
          </div>
          <button className="small-btn cc-scan-button" type="button" onClick={() => { setScanning((active) => !active); setScanCount((count) => count + 1); }}>{scanning ? "PAUSE RADAR SWEEP" : "RESUME RADAR SWEEP"} <span>· SWEEP {String(scanCount).padStart(2, "0")}</span></button>
        </section>

        <section className="cc-module cc-diagnostics-module" aria-labelledby="cc-diagnostics-title">
          <div className="cc-module-heading">
            <div><span className="cc-index">04 / SYSTEM HEALTH</span><h2 id="cc-diagnostics-title">Live diagnostics</h2></div>
            <span className={`cc-diagnostic-status${diagnostics && passed < 3 ? " is-warning" : ""}`}><i />{diagnostics ? (passed === 3 ? "NOMINAL" : "CHECK") : "CHECKING"}</span>
          </div>
          <div className="cc-diagnostic-list">
            {diagnosticRows.map((item) => <div className="cc-diagnostic-row" key={item.label}><span className={`cc-check${item.good ? " is-good" : diagnostics ? " is-bad" : ""}`}>{item.good ? "✓" : diagnostics ? "!" : "·"}</span><span>{item.label}</span><strong>{item.value}</strong></div>)}
          </div>
          <div className="cc-diagnostic-footer"><span>LAST SELF-TEST</span><time dateTime={timestamp || undefined}>{timestamp ? timestamp.slice(11, 19) + " UTC" : "WAITING"}</time></div>
          <button className="small-btn cc-diagnostics-button" type="button" onClick={() => { setDiagnostics(readDiagnostics()); setTimestamp(new Date().toISOString()); }}>RUN SELF-TEST <span>↻</span></button>
        </section>
      </div>

      <section className="cc-probe-section" aria-labelledby="cc-probe-title">
        <div className="cc-module-heading cc-probe-heading">
          <div><span className="cc-index">05 / MARS EXPEDITION</span><h2 id="cc-probe-title">Probe telemetry & surface operations</h2></div>
          <Link className="small-btn" href="/mission-control">FULL MISSION CONTROL ↗</Link>
        </div>
        <MissionOperationsSimulator />
      </section>

      <section className="cc-worlds" aria-label="Planet destination shortcuts">
        <div className="cc-worlds-heading"><span className="cc-index">DESTINATION INDEX</span><span>SELECT A WORLD TO UPDATE TARGET LOCK</span></div>
        <div>{planets.map((planet) => <button key={planet.id} type="button" className={planet.id === selectedPlanet.id ? "is-selected" : ""} onClick={() => selectPlanet(planet.id)}><i style={{ background: planet.accent }} />{planet.name}</button>)}</div>
      </section>

      <section className="cc-field-guide" aria-labelledby="cc-field-guide-title">
        <header className="cc-field-guide-header">
          <div>
            <span className="cc-index">REFERENCE / SOL-01 · SYSTEM OVERVIEW</span>
            <h2 id="cc-field-guide-title">A system built from stardust</h2>
            <p>From the Sun’s birth in a collapsing cloud to the distant frontier of icy worlds, explore how our planetary neighborhood fits together.</p>
          </div>
          <div className="cc-age-readout"><span>ESTIMATED SYSTEM AGE</span><strong>~4.6 <small>BILLION YEARS</small></strong></div>
        </header>

        <div className="cc-origin-strip">
          <span className="cc-origin-node"><i>01</i><b>MOLECULAR CLOUD</b><small>Gas and dust collapse under gravity</small></span>
          <span className="cc-origin-link" aria-hidden="true" />
          <span className="cc-origin-node"><i>02</i><b>SOLAR NEBULA</b><small>A young Sun forms inside a rotating disk</small></span>
          <span className="cc-origin-link" aria-hidden="true" />
          <span className="cc-origin-node"><i>03</i><b>PLANETESIMALS</b><small>Collisions build planets and smaller bodies</small></span>
          <span className="cc-origin-link" aria-hidden="true" />
          <span className="cc-origin-node"><i>04</i><b>ORBITAL SYSTEM</b><small>Worlds settle into long-lived paths</small></span>
        </div>
        <p className="cc-galactic-context">GALACTIC ADDRESS <strong>MILKY WAY · ORION SPUR</strong><span>The Sun is one of many stars in our galaxy known to host a planetary system; planets are common around other stars.</span></p>

        <div className="cc-classification-grid">
          <article className="cc-class-card cc-terrestrial">
            <span className="cc-index">INNER WORLDS / 01–04</span>
            <h3>Terrestrial planets</h3>
            <p>Relatively small, dense worlds with rocky surfaces. They have no substantial ring systems and few moons compared with the giant planets.</p>
            <div className="cc-world-facts">
              <Link href="/planets/mercury"><b>MERCURY</b><span>Smallest planet · shortest year, 88 Earth days</span></Link>
              <Link href="/planets/venus"><b>VENUS</b><span>Hottest surface · about 464°C under a thick CO₂ atmosphere</span></Link>
              <Link href="/planets/earth"><b>EARTH</b><span>Liquid-water oceans · only known world with life</span></Link>
              <Link href="/planets/mars"><b>MARS</b><span>Ancient rivers and lakes suggest past habitable environments</span></Link>
            </div>
          </article>

          <article className="cc-class-card cc-jovian">
            <span className="cc-index">OUTER WORLDS / 05–08</span>
            <h3>Jovian planets</h3>
            <p>Large planets with deep atmospheres, ring systems, and many moons. Their interiors differ: hydrogen-rich gas giants and volatile-rich ice giants.</p>
            <div className="cc-jovian-types">
              <div><span>GAS GIANTS</span><b>JUPITER · SATURN</b><small>Mostly hydrogen and helium. Jupiter is the largest planet; Saturn’s broad rings are remarkably thin.</small></div>
              <div><span>ICE GIANTS</span><b>URANUS · NEPTUNE</b><small>Water, ammonia, and methane-rich interiors beneath hydrogen-helium atmospheres. Uranus rotates on its side.</small></div>
            </div>
            <div className="cc-neptune-note">NEPTUNE · OUTERMOST PLANET · MEAN DISTANCE ~4.5 BILLION KM FROM THE SUN</div>
          </article>
        </div>

        <div className="cc-debris-heading"><span className="cc-index">BEYOND THE PLANETS</span><span>SMALL BODIES · COMET RESERVOIRS · OUTER FRONTIER</span></div>
        <div className="cc-debris-grid">
          <article><span>2.1–3.3 AU</span><h3>Asteroid belt</h3><p>A broad region between Mars and Jupiter containing rocky and metallic remnants from the solar system’s formation. It includes dwarf planet Ceres.</p></article>
          <article><span>~30–50 AU</span><h3>Kuiper Belt</h3><p>A distant disk of icy bodies beyond Neptune. Pluto and other dwarf planets reside here; many short-period comets originate in this region.</p></article>
          <article><span>HYPOTHESIZED RESERVOIR</span><h3>Oort Cloud</h3><p>A predicted, roughly spherical reservoir of icy bodies far beyond the Kuiper Belt, inferred from the paths of long-period comets. Its outer extent is not a sharp physical edge.</p></article>
        </div>
        <p className="cc-field-guide-note">Our system’s arrangement—from inner rocky worlds to distant icy reservoirs—records billions of years of formation and change, around a star that makes life on Earth possible.</p>
      </section>
    </div>
  );
}
