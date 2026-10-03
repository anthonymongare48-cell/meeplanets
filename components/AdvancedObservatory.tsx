"use client";

import { useEffect, useMemo, useState } from "react";
import { WebGLStarfield } from "./WebGLStarfield";

const objects = [
  { name: "ISS", kind: "SATELLITE", detail: "Low Earth orbit · crewed laboratory" },
  { name: "HUBBLE", kind: "OBSERVATORY", detail: "Low Earth orbit · optical telescope" },
  { name: "MAKEMAKE", kind: "DWARF PLANET", detail: "45.8 AU · Kuiper Belt object" },
  { name: "HAUMEA", kind: "DWARF PLANET", detail: "43.1 AU · fast rotating world" },
  { name: "SEDNA", kind: "TNO", detail: "518 AU · scattered-disc candidate" },
];

export function AdvancedObservatory() {
  const [mode, setMode] = useState("HOLOGRAPHIC");
  const [tracking, setTracking] = useState(true);
  const [phase, setPhase] = useState(1);
  const [trail, setTrail] = useState(65);
  const [light, setLight] = useState(70);
  const [ambient, setAmbient] = useState("#ff6b22");
  const [pin, setPin] = useState(false);
  const [frameRate, setFrameRate] = useState(30);
  const [score, setScore] = useState(0);
  const [impact, setImpact] = useState(false);
  const [assessment, setAssessment] = useState(false);
  const [feed, setFeed] = useState("Fallback orbit cache active");
  const [neoFeed, setNeoFeed] = useState("NEO fallback catalog active");
  const [videoUrl, setVideoUrl] = useState("");
  const [captionUrl, setCaptionUrl] = useState("");

  useEffect(() => {
    if (!tracking) return;
    const controller = new AbortController();
    fetch("https://api.wheretheiss.at/v1/satellites/25544", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("unavailable")))
      .then((data) => setFeed(`ISS live · ${Number(data.latitude).toFixed(2)}° lat · ${Number(data.longitude).toFixed(2)}° lon`))
      .catch(() => setFeed("Fallback orbit cache active · live API unavailable"));
    return () => controller.abort();
  }, [tracking]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("unavailable")))
      .then((data: { near_earth_objects?: Record<string, unknown[]> }) => {
        const count = Object.values(data.near_earth_objects ?? {}).flat().length;
        setNeoFeed(`${count} near-Earth objects in the current feed`);
      })
      .catch(() => setNeoFeed("NEO fallback catalog active · NASA feed unavailable"));
    return () => controller.abort();
  }, []);

  const eclipseLabel = ["CONTACT I", "TOTALITY", "CONTACT IV"][phase];
  const scaleLabel = useMemo(() => ["PLANETARY", "STELLAR", "GALACTIC", "COSMIC WEB"][Math.min(3, Math.floor(trail / 26))], [trail]);

  function flyProbe() {
    setImpact(false);
    setScore((value) => value + Math.max(1, Math.round(trail / 10)));
    window.setTimeout(() => setImpact(true), 700);
  }

  return <div className="advanced-lab">
    <section className="advanced-card"><span className="eyebrow">01 / LIVE TRACKING</span><h2>Satellites & observatories</h2><p>{feed}</p><div className="chip-row">{objects.map((object) => <button className="chip" key={object.name} onClick={() => setTracking(true)}>{object.name}</button>)}</div><button className="text-button" onClick={() => setTracking((value) => !value)}>{tracking ? "PAUSE LIVE TRACKING" : "RESUME SGP4-STYLE TRACKING"}</button><div className="trajectory-map"><div className="earth-map" /><div className="trajectory-path" /><span>REAL-TIME ORBITAL TRAJECTORY</span></div></section>
    <section className="advanced-card"><span className="eyebrow">02 / CINEMATIC TOUR</span><h2>Eclipse alignment</h2><p>Advance through a guided solar-eclipse sequence while the alignment model moves Sun, Moon, and Earth through contact phases.</p><div className="tour-stage"><div className={`eclipse-moon phase-${phase}`} /><div className="tour-orbit" /><span>{eclipseLabel}</span></div><div className="chip-row">{[0, 1, 2].map((step) => <button className={`chip ${phase === step ? "active" : ""}`} key={step} onClick={() => setPhase(step)}>PHASE {step + 1}</button>)}</div></section>
    <section className="advanced-card"><span className="eyebrow">03 / ASSESSMENT</span><h2>Bloom&apos;s mission check</h2><p>Recall identifies facts; analysis interprets telemetry; evaluation supports a habitability claim with evidence.</p><div className="assessment-path"><span>REMEMBER</span><span>ANALYZE</span><span>EVALUATE</span></div><button className="button" onClick={() => setAssessment((value) => !value)}>{assessment ? "HIDE VISUAL TASK" : "START ASSURE VISUAL TASK"} <span>↗</span></button>{assessment && <div className="history-card"><strong>Identify the geological feature on the Mars visual, then justify your answer using gravity and albedo.</strong><button className="text-button" onClick={() => setScore((value) => value + 10)}>SUBMIT OBSERVATION</button></div>}</section>
    <section className="advanced-card"><span className="eyebrow">04 / MINOR-BODY CATALOG</span><h2>Beyond the eight planets</h2><p>{neoFeed}</p><div className="minor-body-stage"><i className="belt main-belt" /><i className="belt trojans" /><i className="belt kuiper" /><span>MAIN ASTEROID BELT</span><span>JUPITER TROJANS</span><span>KUIPER BELT</span><span>SCATTERED DISC</span></div><div className="chip-row">{["MAIN BELT", "TROJANS", "KUIPER", "SCATTERED"].map((label) => <button className="chip active" key={label}>{label}</button>)}</div></section>
    <section className="advanced-card"><span className="eyebrow">05 / RENDERING STUDIO</span><h2>Scene controls</h2><p>Switch material language, atmospheric glow, starfield depth, lighting, and camera performance targets.</p><div className="chip-row">{["NASA PBR", "CLAY", "HOLOGRAPHIC", "WIREFRAME"].map((value) => <button className={`chip ${mode === value ? "active" : ""}`} key={value} onClick={() => setMode(value)}>{value}</button>)}</div><label>Studio light {light}%<input type="range" min="0" max="100" value={light} onChange={(event) => setLight(Number(event.target.value))} /></label><label>Trail length {trail}%<input type="range" min="0" max="100" value={trail} onChange={(event) => setTrail(Number(event.target.value))} /></label><label>Ambient color<input type="color" value={ambient} onChange={(event) => setAmbient(event.target.value)} /></label><div className="render-preview" style={{ "--render-accent": ambient, opacity: .45 + light / 180 } as React.CSSProperties}><span>{mode} · {scaleLabel} · {frameRate} FPS</span></div><WebGLStarfield /></section>
    <section className="advanced-card"><span className="eyebrow">06 / COORDINATE PINS</span><h2>Educator markers</h2><p>Place a geographic pin on a planetary mesh and open a localized mission note.</p><button className="text-button" onClick={() => setPin((value) => !value)}>{pin ? "REMOVE PERSEVERANCE PIN" : "PLACE PERSEVERANCE PIN"}</button><div className="planet-pin-stage"><div className="pin-planet" />{pin && <button className="coordinate-pin" onClick={() => setScore((value) => value + 5)} aria-label="Perseverance landing site">●<small>Jezero Crater</small></button>}</div></section>
    <section className="advanced-card"><span className="eyebrow">07 / COLLISION ARCADE</span><h2>Asteroid run</h2><p>Pilot a probe through a lightweight collision field. Distance and clean passes increase the score.</p><div className="arcade-stage">{[1, 2, 3, 4, 5].map((asteroid) => <i className={`asteroid asteroid-${asteroid}`} key={asteroid} />)}<button className="probe" onClick={flyProbe} aria-label="Pilot probe">◆</button>{impact && <strong className="impact">IMPACT / RETRY</strong>}</div><div className="astro-values"><strong>SCORE {score}</strong><button className="text-button" onClick={flyProbe}>FLY PROBE</button><label>Frame cap<select value={frameRate} onChange={(event) => setFrameRate(Number(event.target.value))}><option value="30">30 FPS</option><option value="45">45 FPS</option><option value="60">60 FPS</option></select></label></div></section>
    <section className="advanced-card"><span className="eyebrow">08 / VIDEO PROJECTION</span><h2>Telemetry surface</h2><p>Project an ISS walk, rover clip, or local recording onto a floating surface. Paste a browser-accessible video URL to preview it.</p><label>Video URL<input className="video-url" placeholder="https://example.com/mission.mp4" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} /></label>{videoUrl ? <><label>Caption track URL (optional)<input className="video-url" placeholder="https://example.com/captions.vtt" value={captionUrl} onChange={(event) => setCaptionUrl(event.target.value)} /></label><video className="video-projection" controls playsInline src={videoUrl}><track kind="captions" src={captionUrl || "/captions-unavailable.vtt"} srcLang="en" label={captionUrl ? "English captions" : "Captions unavailable"} default /></video>{!captionUrl && <p className="fallback-note">This video has no captions. Add a WebVTT caption track URL to make its audio accessible.</p>}</> : <div className="video-placeholder">VIDEO PROJECTION READY</div>}</section>
  </div>;
}
