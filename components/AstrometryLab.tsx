"use client";

import { useEffect, useMemo, useState } from "react";
import { CosmicWebCanvas } from "@/components/CosmicWebCanvas";

const gases = [
  ["Hydrogen", 74, "#ff6b22", "656 nm"],
  ["Helium", 24, "#f5c36a", "588 nm"],
  ["Methane", 1, "#65c9d7", "1,650 nm"],
  ["Other", 1, "#aaa39a", "2,300 nm"],
] as const;

const worlds = [
  { name: "Asteria", gravity: "0.94 g", albedo: "0.31", pressure: "1.02 bar", answer: "temperate terrestrial" },
  { name: "Nyx", gravity: "1.42 g", albedo: "0.48", pressure: "78 bar", answer: "venus-like world" },
  { name: "Borealis", gravity: "0.88 g", albedo: "0.62", pressure: "0.08 bar", answer: "ice world" },
];

export function AstrometryLab() {
  const [luminosity, setLuminosity] = useState(1);
  const [temperature, setTemperature] = useState(5778);
  const [transit, setTransit] = useState(46);
  const [zoom, setZoom] = useState(4);
  const [timeRate, setTimeRate] = useState(1);
  const [seed, setSeed] = useState("COSMOS-01");
  const [generated, setGenerated] = useState({ planets: 5, habitable: 1, star: "K2V" });
  const [medium, setMedium] = useState(1);
  const [quest, setQuest] = useState(0);
  const [questFeedback, setQuestFeedback] = useState<string | null>(null);
  const [presenter, setPresenter] = useState(false);
  const [audioOn, setAudioOn] = useState(false);

  const zone = useMemo(() => {
    const scale = Math.sqrt(luminosity);
    return { inner: (0.72 * scale).toFixed(2), outer: (1.77 * scale).toFixed(2), snow: (2.7 * scale).toFixed(2) };
  }, [luminosity]);

  useEffect(() => {
    if (!audioOn) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 110 + transit * 2;
    gain.gain.value = 0.025;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    return () => { oscillator.stop(); void context.close(); };
  }, [audioOn, transit]);

  function generateSystem() {
    const value = [...seed].reduce((total, character) => total + character.charCodeAt(0), 0);
    setGenerated({ planets: 3 + value % 6, habitable: value % 3, star: ["M4V", "K2V", "G2V", "F8V"][value % 4] });
  }

  return <div className="astro-lab">
    <section className="astro-card"><span className="eyebrow">01 / ASTROMETRY</span><h2>Goldilocks zone</h2><p>Adjust stellar luminosity and temperature to recalculate runaway-greenhouse, liquid-water, and snowball thresholds.</p><label>Luminosity: {luminosity.toFixed(1)} L☉<input type="range" min=".1" max="3" step=".1" value={luminosity} onChange={(event) => setLuminosity(Number(event.target.value))} /></label><label>Photosphere: {temperature} K<input type="range" min="2400" max="10000" step="10" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} /></label><div className="zone-track"><i style={{ left: "14%", width: `${Math.min(72, 35 * Math.sqrt(luminosity))}%` }} /><b style={{ left: "14%" }} /><span style={{ left: "31%" }}>RUNAWAY</span><span style={{ left: "52%" }}>LIQUID WATER</span><span style={{ left: "78%" }}>SNOWBALL</span></div><div className="astro-values"><strong>{zone.inner} AU</strong><strong>{zone.outer} AU</strong><strong>{zone.snow} AU</strong></div></section>
    <section className="astro-card"><span className="eyebrow">02 / SPECTROMETRY</span><h2>Atmospheric fingerprints</h2><p>Gas abundance and absorption lines show how remote observatories identify chemistry.</p><div className="spectrum">{Array.from({ length: 36 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 62)}%`, opacity: index % 5 === 0 ? 1 : .4 }} />)}{gases.map(([name, , color, wavelength]) => <span key={name} style={{ color }}>{name} · {wavelength}</span>)}</div><div className="gas-list">{gases.map(([name, percentage, color]) => <div key={name}><span>{name}</span><b style={{ width: `${percentage}%`, background: color }} /><small>{percentage}%</small></div>)}</div></section>
    <section className="astro-card"><span className="eyebrow">03 / TRANSIT GEOMETRY</span><h2>Umbra & penumbra</h2><p>Move the occulting body across the star. The shadow model distinguishes total and partial eclipse paths.</p><input type="range" min="10" max="90" value={transit} onChange={(event) => setTransit(Number(event.target.value))} aria-label="Transit position" /><div className="eclipse-stage"><div className="eclipse-star" /><div className="umbra" style={{ left: `${transit}%` }} /><div className="penumbra" style={{ left: `${transit}%` }} /><span>UMBRA</span><span>PENUMBRA</span></div></section>
    <section className="astro-card cosmic-scale-card"><span className="eyebrow">04 / COSMIC SCALE</span><h2>Power-of-ten navigator</h2><p>Each slider step expands distance by a factor of ten. Fine-scale views stay lightweight; the cosmic-web layer appears only beyond galactic scales and fades at the End of Greatness.</p><input type="range" min="0" max="26" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Cosmic zoom level" /><div className="zoom-readout"><strong>10<sup>{zoom}</sup> m</strong><span>{["SURFACE · 1 m", "HUMAN SCALE", "BUILDING", "MOUNTAIN", "PLANETARY LANDSCAPE", "PLANET", "EARTH-SIZED BODY", "EARTH DIAMETER", "EARTH–MOON DISTANCE", "PLANETARY NEIGHBORHOOD", "1 AU · INNER SYSTEM", "OUTER PLANETS", "HELIOSPHERE", "DISTANT SOLAR SYSTEM", "OORT CLOUD", "OORT CLOUD EDGE", "NEAREST STARS", "STELLAR NEIGHBORHOOD", "LOCAL STARS", "MILKY WAY REGION", "GALACTIC DISK", "MILKY WAY DIAMETER", "LOCAL GROUP", "SUPERCLUSTER", "COSMIC WEB · 10–100 Mpc", "END OF GREATNESS · 30–200 Mpc", "CMB · OBSERVABLE BOUNDARY"][zoom]}</span></div>{zoom >= 23 && <><CosmicWebCanvas zoom={zoom} /><div className="cosmic-facts"><article><strong>COSMIC VOIDS</strong><span>Vast underdense regions occupy roughly 80% of cosmic volume; typical spans are 10–100 Mpc.</span></article><article><strong>FILAMENTS & WALLS</strong><span>Galaxy, gas, and dark-matter strands form the boundaries and gravitational channels.</span></article><article><strong>CLUSTER NODES</strong><span>Dense galaxy clusters gather where multiple filaments converge.</span></article></div>{zoom >= 25 && <p className="cosmic-transition">{zoom === 25 ? "Across about 30–200 Mpc, the web’s distinct pattern trends toward large-scale homogeneity: the End of Greatness." : "The Cosmic Microwave Background is the observable universe’s ancient radiation boundary, not a material shell."}</p>}</>}</section>
    <section className="astro-card"><span className="eyebrow">05 / RELATIVITY</span><h2>Twin clocks</h2><p>Compare an Earth clock with a clock near a black hole. This visual uses a Schwarzschild-inspired teaching curve, not a navigation-grade calculation.</p><input type="range" min="1" max="99" value={timeRate} onChange={(event) => setTimeRate(Number(event.target.value))} aria-label="Black hole gravity" /><div className="clock-row"><div><strong>{(timeRate * 12).toFixed(1)} s</strong><span>EARTH CLOCK</span></div><div><strong>{(timeRate * (1 - timeRate / 120)).toFixed(1)} s</strong><span>BLACK-HOLE ORBIT</span></div></div></section>
    <section className="astro-card"><span className="eyebrow">06 / PROCEDURAL SYSTEM</span><h2>Seed generator</h2><p>Generate a plausible teaching system from a repeatable text or number seed.</p><div className="inline-control"><input value={seed} onChange={(event) => setSeed(event.target.value)} aria-label="Procedural system seed" /><button className="text-button" onClick={generateSystem}>GENERATE</button></div><div className="astro-values"><strong>{generated.planets} planets</strong><strong>{generated.habitable} habitable</strong><strong>{generated.star} star</strong></div></section>
    <section className="astro-card"><span className="eyebrow">07 / CLASSROOM MODE</span><h2>Presenter & buoyancy</h2><p>Presenter mode is a local classroom rehearsal surface. Toggle the host state, then compare planetary density in a common liquid.</p><button className="text-button" onClick={() => setPresenter((value) => !value)}>{presenter ? "HOSTING WAYPOINTS" : "START PRESENTER MODE"}</button><label>Medium density: {medium.toFixed(1)} g/cm³<input type="range" min=".5" max="2" step=".1" value={medium} onChange={(event) => setMedium(Number(event.target.value))} /></label><div className="buoyancy"><span style={{ transform: `translateY(${medium > .7 ? 0 : 28}px)` }}>SATURN · 0.69</span><span style={{ transform: `translateY(${medium > 1.0 ? 0 : 28}px)` }}>EARTH · 5.51</span><span style={{ transform: `translateY(${medium > 3 ? 0 : 28}px)` }}>ROCKY WORLD · 5.9</span></div></section>
    <section className="astro-card"><span className="eyebrow">08 / DEDUCTION QUEST</span><h2>Mystery world: {worlds[quest].name}</h2><p>Raw telemetry: gravity {worlds[quest].gravity} · albedo {worlds[quest].albedo} · pressure {worlds[quest].pressure}. Evaluate the evidence and choose its class.</p><div className="chip-row">{["temperate terrestrial", "venus-like world", "ice world"].map((answer) => <button className="chip" key={answer} onClick={() => setQuestFeedback(answer === worlds[quest].answer ? "Correct — your evidence-based classification is right." : "Not quite. Recheck the gravity, reflectivity, and atmospheric pressure.")}>{answer}</button>)}</div>{questFeedback && <p className="quest-feedback" aria-live="polite">{questFeedback}</p>}{questFeedback?.startsWith("Correct") && <button className="text-button" onClick={() => { setQuest((value) => (value + 1) % worlds.length); setQuestFeedback(null); }}>NEXT MYSTERY WORLD →</button>}</section>
    <section className="astro-card"><span className="eyebrow">09 / DATA SONIFICATION</span><h2>Radio & mission transmissions</h2><p>Procedural audio maps signal intensity to pitch. It is an interpretive sonification, not raw NASA or ESA audio.</p><button className="button" onClick={() => setAudioOn((value) => !value)}>{audioOn ? "STOP RADIO SONIFICATION" : "START RADIO SONIFICATION"} <span>↗</span></button><button className="text-button" onClick={() => setAudioOn((value) => !value)}>{audioOn ? "MISSION LOG PLAYING" : "PLAY MISSION TRANSMISSION"}</button></section>
  </div>;
}
