"use client";

import { useEffect, useRef, useState } from "react";
import { useCosmosStore } from "@/store/useCosmosStore";

const lessons = [
  { id: "orbits", number: "01", title: "Read an orbit", detail: "Trace the ellipse: a planet moves fastest when it is closest to its star." },
  { id: "light", number: "02", title: "Decode a spectrum", detail: "Dark lines are fingerprints of atoms absorbing specific wavelengths of light." },
  { id: "layers", number: "03", title: "Meet a world in layers", detail: "A cross-section turns an opaque planet into a map of pressure, chemistry, and heat." }
];

export function LearningLab() {
  const completed = useCosmosStore((s) => s.completedLessons);
  const completeLesson = useCosmosStore((s) => s.completeLesson);
  const lowPower = useCosmosStore((s) => s.lowPowerMode);
  const setLowPower = useCosmosStore((s) => s.setLowPowerMode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [crossSection, setCrossSection] = useState(false);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const constrained = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || Boolean(nav.connection?.saveData);
    setLowPower(constrained);
  }, [setLowPower]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const paint = (event: PointerEvent) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
      ctx.stroke();
    };
    const start = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath(); ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
      ctx.strokeStyle = "#ff6b22"; ctx.lineWidth = 2; setDrawing(true);
    };
    const stop = () => { setDrawing(false); ctx.closePath(); };
    canvas.addEventListener("pointerdown", start); canvas.addEventListener("pointermove", paint);
    canvas.addEventListener("pointerup", stop); canvas.addEventListener("pointerleave", stop);
    return () => { canvas.removeEventListener("pointerdown", start); canvas.removeEventListener("pointermove", paint); canvas.removeEventListener("pointerup", stop); canvas.removeEventListener("pointerleave", stop); };
  }, [drawing]);

  const narrate = (id: string, text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setActiveAudio(null);
    setActiveAudio(id); window.speechSynthesis.speak(utterance);
  };

  return <div className={`lab-shell ${lowPower ? "low-power" : ""}`}>
    <div className="lab-toolbar"><span className="eyebrow">LEARNING LAB / FIELD NOTES</span><label className="power-toggle"><input type="checkbox" checked={lowPower} onChange={(e) => setLowPower(e.target.checked)} /> ADAPTIVE / {lowPower ? "QUIET" : "FULL"}</label></div>
    <div className="lesson-path">{lessons.map((lesson) => <article className={`lesson-card ${completed.includes(lesson.id) ? "is-complete" : ""}`} key={lesson.id}><span className="card-index">{lesson.number}</span><h2>{lesson.title}</h2><p>{lesson.detail}</p><div className="lesson-actions"><button className="audio-chip" onClick={() => narrate(lesson.id, lesson.detail)}>{activeAudio === lesson.id ? "◉ PLAYING" : "▶ LISTEN"}</button><button className="text-button" onClick={() => completeLesson(lesson.id)}>{completed.includes(lesson.id) ? "✓ LOGGED" : "MARK COMPLETE"}</button></div><small className="transcript">Transcript available: {lesson.detail}</small></article>)}</div>
    <section className="lab-visual"><div><span className="eyebrow">VISUAL LITERACY TOOL</span><h2>Annotate a planet</h2><p className="description">Pin the layers, or draw a hypothesis over the diagram. Your marks stay in this session.</p><div className={`cross-section ${crossSection ? "show-layers" : ""}`}><div className="planet-core" /><button className="pin pin-one" aria-label="Core annotation">CORE</button><button className="pin pin-two" aria-label="Atmosphere annotation">ATMOSPHERE</button><button className="pin pin-three" aria-label="Crust annotation">CRUST</button><canvas ref={canvasRef} width={520} height={300} className="draw-canvas" /></div><button className="button small-button" onClick={() => setCrossSection(!crossSection)}>{crossSection ? "HIDE CROSS-SECTION" : "REVEAL CROSS-SECTION"} <span>↗</span></button></div><aside className="legend-card"><strong>FIELD LEGEND</strong><p>Orange pins identify evidence. Use the overlay to connect observations to a claim.</p><span>◉ {completed.length}/{lessons.length} lessons logged</span></aside></section>
  </div>;
}
