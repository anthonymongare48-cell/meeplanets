"use client";

import { useEffect, useRef } from "react";

const tracks = [
  { path: "M 520 250 A 220 78 0 1 0 80 250 A 220 78 0 1 0 520 250", rotation: -28, period: 12000, phase: 0 },
  { path: "M 455 250 A 155 132 0 1 0 145 250 A 155 132 0 1 0 455 250", rotation: 64, period: 17000, phase: 0.38 },
  { path: "M 550 250 A 250 44 0 1 0 50 250 A 250 44 0 1 0 550 250", rotation: 12, period: 22000, phase: 0.72 },
];

export function HeroOrbitIllustration() {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const planets = useRef<(SVGCircleElement | null)[]>([]);
  const illustration = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lengths = tracks.map((_, index) => paths.current[index]?.getTotalLength() ?? 0);
    let frame = 0;
    let visible = true;

    const paint = (now: number) => {
      tracks.forEach((track, index) => {
        const path = paths.current[index];
        const planet = planets.current[index];
        if (!path || !planet || !lengths[index]) return;
        const point = path.getPointAtLength(((now / track.period + track.phase) % 1) * lengths[index]);
        planet.setAttribute("cx", point.x.toFixed(2));
        planet.setAttribute("cy", point.y.toFixed(2));
      });
    };

    const animate = (now: number) => {
      paint(now);
      frame = window.requestAnimationFrame(animate);
    };

    const update = () => {
      window.cancelAnimationFrame(frame);
      if (media.matches) {
        paint(0);
      } else if (!document.hidden && visible) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (illustration.current) observer.observe(illustration.current);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div className="orbit-art" ref={illustration} role="img" aria-label="Planets orbiting the Sun along three orbital paths">
      <svg viewBox="0 0 600 500" aria-hidden="true">
        <circle className="hero-orbit-sun" cx="300" cy="250" r="55" />
        {tracks.map((track, index) => (
          <g transform={`rotate(${track.rotation} 300 250)`} key={track.path}>
            <path className="hero-orbit-track" d={track.path} ref={(element) => { paths.current[index] = element; }} />
            <circle className={`hero-orbit-planet hero-orbit-planet--${index + 1}`} r={index === 1 ? 7 : 6} cx="0" cy="0" ref={(element) => { planets.current[index] = element; }} />
          </g>
        ))}
      </svg>
    </div>
  );
}
