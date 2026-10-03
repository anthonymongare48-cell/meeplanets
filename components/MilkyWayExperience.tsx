"use client";

import { useRef, useState } from "react";
import { MilkyWayCanvas } from "@/components/MilkyWayCanvas";

export function MilkyWayExperience() {
  const [tourProgress, setTourProgress] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  function startTour() {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    setTourPlaying(true);
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 14000, 1);
      setTourProgress(progress);
      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
        setTourPlaying(false);
      }
    };
    frameRef.current = window.requestAnimationFrame(animate);
  }

  function resetTour() {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setTourPlaying(false);
    setTourProgress(0);
  }

  return (
    <div className="galaxy-experience">
      <section className="galaxy-stage-shell">
        <MilkyWayCanvas tourProgress={tourProgress} />
        <div className="galaxy-overlay">
          <span className="eyebrow">MILKY WAY / BARRED SPIRAL GALAXY</span>
          <h2>{tourProgress > 0.88 ? "Into the galactic bulge" : tourProgress > 0.35 ? "Across the spiral arms" : "A galaxy of a hundred billion stars"}</h2>
          <p>Drag to explore the star field, or take the guided flight from the outer arms toward the galactic center.</p>
          <div className="galaxy-controls">
            <button className="button" onClick={startTour} disabled={tourPlaying}>{tourPlaying ? "CINEMATIC FLIGHT IN PROGRESS" : tourProgress >= 1 ? "REPLAY GALAXY FLIGHT" : "VIEW GALAXY"} <span>↗</span></button>
            {tourProgress > 0 && <button className="text-button" onClick={resetTour}>RESET VIEW</button>}
          </div>
          <div className="galaxy-progress" aria-label={`Cinematic flight ${Math.round(tourProgress * 100)} percent complete`}><i style={{ width: `${tourProgress * 100}%` }} /></div>
        </div>
      </section>
      <div className="galaxy-data">
        <article><span className="eyebrow">STRUCTURE</span><h3>Barred spiral</h3><p>Four logarithmic arms wind outward from a dense central bulge and elongated bar. This is a schematic visualization, not a survey map.</p></article>
        <article><span className="eyebrow">STAR POPULATIONS</span><h3>Warm core · blue arms</h3><p>Golden points suggest older stars concentrated toward the center; bright blue-white points represent young, hot stars in active arms.</p></article>
        <article><span className="eyebrow">DUST LANES</span><h3>Interstellar clouds</h3><p>Shader-masked dark bands suggest dust obscuration. The 90,000-point scene is procedurally generated and not positioned from catalog data.</p></article>
      </div>
      <div className="galaxy-tour-track"><span>OUTER ARMS</span><i><b style={{ left: `${tourProgress * 100}%` }} /></i><span>GALACTIC BULGE</span></div>
    </div>
  );
}
