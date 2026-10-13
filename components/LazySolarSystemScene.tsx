"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Planet } from "@/lib/planets";

const SolarSystemScene = dynamic(
  () => import("@/components/SolarSystemScene").then((module) => module.SolarSystemScene),
  {
    ssr: false,
    loading: () => <div className="solar-system-scene solar-system-scene-loading" role="status">INITIALIZING ORBITAL RENDERER…</div>,
  },
);

type LazySolarSystemSceneProps = {
  planets: Planet[];
  selectedPlanet: string;
  onSelectPlanet: (id: string) => void;
  mode: "2D" | "3D";
  zoom: number;
  playing: boolean;
  speed: number;
  scaleMode: "visible" | "proportional";
  showLabels: boolean;
  resetViewVersion: number;
};

export function LazySolarSystemScene(props: LazySolarSystemSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="solar-system-scene-lazy" ref={hostRef}>
      {nearViewport
        ? <SolarSystemScene {...props} />
        : <div className="solar-system-scene solar-system-scene-loading" aria-hidden="true" />}
    </div>
  );
}
