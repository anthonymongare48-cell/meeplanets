"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const navigationBounds = 14;
const orbitCenter = { x: 688, y: 384 };
const planetOrbits = [
  { name: "Mercury", href: "/planets/mercury", radius: 48, duration: 9, color: "#b9b3aa", size: 8 },
  { name: "Venus", href: "/planets/venus", radius: 82, duration: 14, color: "#e8bd83", size: 11 },
  { name: "Earth", href: "/planets/earth", radius: 120, duration: 20, color: "#69baf4", size: 12 },
  { name: "Mars", href: "/planets/mars", radius: 160, duration: 28, color: "#e47c59", size: 10 },
  { name: "Jupiter", href: "/planets/jupiter", radius: 220, duration: 44, color: "#e8b98e", size: 18 },
  { name: "Saturn", href: "/planets/saturn", radius: 275, duration: 58, color: "#e9d09c", size: 16 },
  { name: "Uranus", href: "/planets/uranus", radius: 330, duration: 74, color: "#8bd8dc", size: 13 },
  { name: "Neptune", href: "/planets/neptune", radius: 380, duration: 92, color: "#709ef5", size: 13 },
  { name: "Pluto", href: "/catalog", radius: 425, duration: 108, color: "#c9ae9b", size: 8 },
];

export function MilkyWayExperience() {
  const [tourProgress, setTourProgress] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [galaxyRotating, setGalaxyRotating] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const [satellitePosition, setSatellitePosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const mapZoomRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const lastProgressUpdateRef = useRef(0);

  function moveSatellite(x: number, y: number) {
    setSatellitePosition((position) => ({
      x: Math.max(-navigationBounds, Math.min(navigationBounds, position.x + x)),
      y: Math.max(-navigationBounds, Math.min(navigationBounds, position.y + y)),
    }));
  }

  function applyZoom(progress: number) {
    const scale = 1 + progress * 0.65;
    mapZoomRef.current?.style.setProperty("transform", `scale(${scale}) translate3d(${-progress * 2}%, ${progress * 6}%, 0)`);
  }

  function startTour() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1;
      setTourProgress(1);
      applyZoom(1);
      return;
    }
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const initialProgress = progressRef.current >= 1 ? 0 : progressRef.current;
    const duration = 16000 * (1 - initialProgress);
    progressRef.current = initialProgress;
    applyZoom(initialProgress);
    setTourProgress(initialProgress);
    setTourPlaying(true);
    lastProgressUpdateRef.current = start;
    const animate = (now: number) => {
      const linearProgress = Math.min((now - start) / duration, 1);
      const easedProgress = linearProgress * linearProgress * (3 - 2 * linearProgress);
      const progress = Math.min(initialProgress + easedProgress * (1 - initialProgress), 1);
      progressRef.current = progress;
      applyZoom(progress);
      if (now - lastProgressUpdateRef.current >= 100 || progress >= 1) {
        setTourProgress(progress);
        lastProgressUpdateRef.current = now;
      }
      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
        setTourPlaying(false);
      }
    };
    frameRef.current = window.requestAnimationFrame(animate);
  }

  function pauseTour() {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setTourProgress(progressRef.current);
    setTourPlaying(false);
  }

  function resetTour() {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setTourPlaying(false);
    progressRef.current = 0;
    setTourProgress(0);
    applyZoom(0);
  }

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage) return;
    setFullscreenError("");
    try {
      if (document.fullscreenElement === stage) {
        await document.exitFullscreen();
      } else {
        await stage.requestFullscreen();
      }
    } catch (error) {
      console.error("Unable to change Milky Way fullscreen mode.", error);
      setFullscreenError("Fullscreen could not be changed. Check your browser permissions and try again.");
    }
  }

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current);
    };
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target !== stage && target.closest("a, button, input")) return;
      const movement: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
      };
      const direction = movement[event.key];
      if (!direction) return;
      event.preventDefault();
      moveSatellite(...direction);
    };
    stage.addEventListener("keydown", handleKeyDown);
    return () => stage.removeEventListener("keydown", handleKeyDown);
  }, []);

  const imageStyle = {
    transform: `scale(${1 + tourProgress * 0.65}) translate3d(${-tourProgress * 2}%, ${tourProgress * 6}%, 0)`,
  } satisfies CSSProperties;
  const cameraStyle = {
    transform: `translate3d(${-satellitePosition.x * 3.5}%, ${-satellitePosition.y * 3.5}%, 0)`,
  } satisfies CSSProperties;
  const satelliteStyle = {
    left: `${50 + satellitePosition.x * 3.1}%`,
    top: `${50 + satellitePosition.y * 3.1}%`,
  } satisfies CSSProperties;

  return (
    <div className="galaxy-experience">
      <div
        className={`galaxy-stage-shell${tourPlaying ? " is-touring" : ""}${galaxyRotating ? " is-rotating" : " is-rotation-paused"}`}
        role="application"
        aria-label="Interactive Milky Way map"
        aria-roledescription="interactive star map"
        tabIndex={0}
        ref={stageRef}
      >
        <button
          className="galaxy-fullscreen-button"
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen view" : "Enter fullscreen view"}
          title={isFullscreen ? "Exit fullscreen" : "View Milky Way fullscreen"}
          aria-pressed={isFullscreen}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isFullscreen ? (
              <path d="M8 3v5H3m13-5v5h5M3 16h5v5m13-5h-5v5" />
            ) : (
              <path d="M3 9V3h6m6 0h6v6M21 15v6h-6m-6 0H3v-6" />
            )}
          </svg>
          <span>{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</span>
        </button>
        {fullscreenError && <p className="galaxy-fullscreen-error" role="alert">{fullscreenError}</p>}
        <div className="galaxy-artwork-mover" style={cameraStyle}>
          <div className="galaxy-artwork-rotator">
            <Image
              className="galaxy-stage-artwork"
              src="/galaxy/solar-system-in-the-milky-way.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 200vw, 2400px"
            />
            <div className="galaxy-map-zoom" ref={mapZoomRef} style={imageStyle}>
              <svg className="galaxy-hotspots" viewBox="0 0 1376 768" preserveAspectRatio="none" aria-label="Celestial objects">
                <a href="/deep-space" aria-label="Explore the Milky Way and deep-space objects"><title>Explore the Milky Way</title><rect x="0" y="0" width="1376" height="768" /></a>
                <a href="/catalog" aria-label="Explore the asteroid belt and small bodies"><title>Asteroid belt and small bodies</title><ellipse cx="950" cy="350" rx="141" ry="73" /></a>
                <a href="/planets/mercury" aria-label="Open Mercury telemetry"><title>Mercury</title><circle cx="548" cy="426" r="28" /></a>
                <a href="/planets/venus" aria-label="Open Venus telemetry"><title>Venus</title><circle cx="840" cy="323" r="28" /></a>
                <a href="/planets/earth" aria-label="Open Earth telemetry"><title>Earth</title><circle cx="875" cy="277" r="29" /></a>
                <a href="/moon" aria-label="Explore Earth's Moon"><title>The Moon</title><circle cx="899" cy="260" r="19" /></a>
                <a href="/planets/mars" aria-label="Open Mars telemetry"><title>Mars</title><circle cx="946" cy="312" r="31" /></a>
                <a href="/planets/jupiter" aria-label="Open Jupiter telemetry"><title>Jupiter</title><circle cx="1083" cy="419" r="52" /></a>
                <a href="/planets/saturn" aria-label="Open Saturn telemetry"><title>Saturn</title><circle cx="235" cy="583" r="56" /></a>
                <a href="/planets/uranus" aria-label="Open Uranus telemetry"><title>Uranus</title><circle cx="971" cy="104" r="33" /></a>
                <a href="/planets/neptune" aria-label="Open Neptune telemetry"><title>Neptune</title><circle cx="1152" cy="127" r="34" /></a>
                <a href="/sun" aria-label="Open Sun telemetry"><title>The Sun</title><circle cx="675" cy="359" r="66" /></a>
              </svg>
            </div>
          </div>
        </div>
        <svg className="galaxy-orbit-map" viewBox="0 0 1376 768" role="group" aria-label="Clickable planets rotating around the Sun">
          {planetOrbits.map((planet) => (
            <ellipse
              className="galaxy-orbit-track"
              key={`${planet.name}-orbit`}
              cx={orbitCenter.x}
              cy={orbitCenter.y}
              rx={planet.radius}
              ry={planet.radius * 0.55}
            />
          ))}
          <a className="galaxy-asteroid-belt-link" href="/catalog" aria-label="Open the asteroid belt and small-body catalog">
            <ellipse cx={orbitCenter.x} cy={orbitCenter.y} rx="203" ry="113" />
          </a>
          <g transform={`translate(${orbitCenter.x} ${orbitCenter.y})`}>
            {planetOrbits.map((planet, index) => (
              <g key={planet.name}>
                {!reducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    additive="sum"
                    from={`${index * 37} 0 0`}
                    to={`${index * 37 + 360} 0 0`}
                    dur={`${planet.duration}s`}
                    repeatCount="indefinite"
                  />
                )}
                <a href={planet.href} aria-label={`Open ${planet.name} details`}>
                  <circle
                    className="galaxy-orbiting-body"
                    cx={planet.radius}
                    cy="0"
                    r={planet.size}
                    style={{ fill: planet.color }}
                  />
                  {planet.name === "Saturn" && (
                    <ellipse className="galaxy-orbiting-ring" cx={planet.radius} cy="0" rx="25" ry="9" />
                  )}
                </a>
                {planet.name === "Earth" && (
                  <g transform={`translate(${planet.radius} 0)`}>
                    {!reducedMotion && (
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        additive="sum"
                        from="0"
                        to="360"
                        dur="3.2s"
                        repeatCount="indefinite"
                      />
                    )}
                    <a href="/moon" aria-label="Explore the Moon orbiting Earth">
                      <circle className="galaxy-orbiting-moon" cx="19" cy="0" r="5" />
                    </a>
                  </g>
                )}
              </g>
            ))}
            <a href="/sun" aria-label="Open Sun details">
              <circle className="galaxy-orbiting-sun" r="17" />
            </a>
          </g>
          <g className="galaxy-asteroid-belt">
            {!reducedMotion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${orbitCenter.x} ${orbitCenter.y}`}
                to={`360 ${orbitCenter.x} ${orbitCenter.y}`}
                dur="36s"
                repeatCount="indefinite"
              />
            )}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((body) => {
              const angle = (body * 30 * Math.PI) / 180;
              const radius = body % 2 === 0 ? 188 : 204;
              return (
                <a href="/catalog" aria-label={`Open asteroid ${body + 1} details`} key={body}>
                  <circle
                    className="galaxy-orbiting-asteroid"
                    cx={orbitCenter.x + Math.cos(angle) * radius}
                    cy={orbitCenter.y + Math.sin(angle) * radius * 0.55}
                    r={body % 3 === 0 ? 5 : 3}
                  />
                </a>
              );
            })}
          </g>
          <ellipse className="galaxy-orbit-track galaxy-meteoroid-track" cx={orbitCenter.x} cy={orbitCenter.y} rx="310" ry="126" />
          <g transform={`translate(${orbitCenter.x} ${orbitCenter.y})`}>
            {!reducedMotion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                additive="sum"
                from="0"
                to="360"
                dur="31s"
                repeatCount="indefinite"
              />
            )}
            <a href="/catalog" aria-label="Open meteoroid details">
              <path className="galaxy-orbiting-meteoroid" d="M306 -4l21 -13-14 17 13 4-22 0-8 9 3-14-9-5z" />
            </a>
          </g>
        </svg>
        <svg className="galaxy-flight-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 50 Q68 31 74 48 T50 50" /></svg>
        <span className="galaxy-satellite" style={satelliteStyle} role="img" aria-label="Satellite position">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect x="12" y="12" width="8" height="8" rx="2" />
            <path d="M12 14H5v4h7m8-4h7v4h-7M16 12V7m-2 0h4m-2 13v5m-2 0h4" />
          </svg>
        </span>
        <div className="galaxy-artwork-shimmer" aria-hidden="true" />
        <span className="galaxy-artwork-label">{galaxyRotating ? "MILKY WAY ROTATING · SOLAR SYSTEM" : "MILKY WAY ROTATION READY"}</span>
        <div className="galaxy-overlay">
          <span className="eyebrow">OUR SOLAR SYSTEM · MILKY WAY</span>
          <h2>{tourProgress > 0.88 ? "Into our solar system" : tourProgress > 0.35 ? "Across the planetary orbits" : "Our place in the Milky Way"}</h2>
          <p>The Milky Way scene and its celestial objects rotate continuously. Pause the rotation whenever you want a steadier view; click an object to explore it.</p>
          <div className="galaxy-controls">
            <button
              className="button"
              type="button"
              onClick={() => {
                setGalaxyRotating((rotating) => !rotating);
              }}
              aria-pressed={galaxyRotating}
            >
              {galaxyRotating ? "STOP GALAXY ROTATION" : "ROTATE GALAXY"} <span>{galaxyRotating ? "Ⅱ" : "↻"}</span>
            </button>
            <button className="button" type="button" onClick={tourPlaying ? pauseTour : startTour}>
              {tourPlaying ? "PAUSE FLIGHT" : tourProgress > 0 && tourProgress < 1 ? "RESUME FLIGHT" : tourProgress >= 1 ? "REPLAY FLIGHT" : "START ANIMATED FLIGHT"} <span>{tourPlaying ? "Ⅱ" : "↗"}</span>
            </button>
            {tourProgress > 0 && <button className="text-button" type="button" onClick={resetTour}>RESET VIEW</button>}
          </div>
          <div className="galaxy-progress" aria-label={`Cinematic flight ${Math.round(tourProgress * 100)} percent complete`}><i style={{ width: `${tourProgress * 100}%` }} /></div>
        </div>
      </div>
      <section className="galaxy-navigation" aria-label="Satellite navigation controls">
        <div className="galaxy-navigation-readout">
          <span className="eyebrow">SATELLITE NAVIGATION</span>
          <strong>SECTOR {String(Math.round((satellitePosition.y + navigationBounds) / 4)).padStart(2, "0")} · {satellitePosition.x < 0 ? "WEST" : satellitePosition.x > 0 ? "EAST" : "CENTER"}</strong>
          <span>Use WASD, arrow keys, or the controls to fly around the galaxy.</span>
        </div>
        <div className="galaxy-navigation-pad" role="group" aria-label="Move satellite around the Milky Way">
          <button type="button" aria-label="Move satellite up" onClick={() => moveSatellite(0, -1)}>↑</button>
          <button type="button" aria-label="Move satellite left" onClick={() => moveSatellite(-1, 0)}>←</button>
          <button type="button" aria-label="Center satellite" onClick={() => setSatellitePosition({ x: 0, y: 0 })}>⌖</button>
          <button type="button" aria-label="Move satellite right" onClick={() => moveSatellite(1, 0)}>→</button>
          <button type="button" aria-label="Move satellite down" onClick={() => moveSatellite(0, 1)}>↓</button>
        </div>
      </section>
      <div className="galaxy-data">
        <article><span className="eyebrow">OUR NEIGHBORHOOD</span><h3>Solar system</h3><p>Our Sun and its planets travel through the Milky Way. The artwork is an illustration; sizes and orbital distances are not to scale.</p></article>
        <article><span className="eyebrow">THE GALAXY</span><h3>Milky Way</h3><p>The bright star field and glowing clouds provide an artistic view of our galaxy, not a precisely measured star map.</p></article>
        <article><span className="eyebrow">ANIMATED FLIGHT</span><h3>Guided close-up</h3><p>Start, pause, resume, or reset the smooth zoom toward the Sun and planetary orbits. This visual effect does not simulate physical travel.</p></article>
      </div>
      <div className="galaxy-tour-track"><span>MILKY WAY</span><i><b style={{ left: `${tourProgress * 100}%` }} /></i><span>SOLAR SYSTEM</span></div>
    </div>
  );
}
