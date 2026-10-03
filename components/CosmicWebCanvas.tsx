"use client";

import { useEffect, useRef } from "react";

type CosmicWebCanvasProps = {
  zoom: number;
};

const WIDTH = 240;
const HEIGHT = 132;
const NODE_COUNT = 54;

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function CosmicWebCanvas({ zoom }: CosmicWebCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const points = Array.from({ length: NODE_COUNT }, (_, index) => ({
      x: seededValue(index, 1) * WIDTH,
      y: seededValue(index, 2) * HEIGHT,
    }));
    const image = context.createImageData(WIDTH, HEIGHT);
    const homogeneity = zoom >= 25 ? Math.min(0.88, (zoom - 24) * 0.42) : 0;

    for (let y = 0; y < HEIGHT; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        let nearest = Number.POSITIVE_INFINITY;
        let second = Number.POSITIVE_INFINITY;
        for (const point of points) {
          const dx = x - point.x;
          const dy = (y - point.y) * 1.16;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < nearest) {
            second = nearest;
            nearest = distance;
          } else if (distance < second) {
            second = distance;
          }
        }

        const edge = Math.exp(-Math.pow((second - nearest) / 3.1, 2));
        const faintStructure = Math.exp(-nearest / 22) * 0.25;
        const web = Math.min(1, edge * 0.9 + faintStructure);
        const intensity = web * (1 - homogeneity) + 13 * homogeneity;
        const offset = (y * WIDTH + x) * 4;
        image.data[offset] = 10 + intensity * 0.62;
        image.data[offset + 1] = 13 + intensity * 0.72;
        image.data[offset + 2] = 22 + intensity * 1.05;
        image.data[offset + 3] = 255;
      }
    }

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context.putImageData(image, 0, 0);

    const visibility = Math.max(0, 1 - homogeneity * 0.9);
    for (const [index, point] of points.entries()) {
      const radius = 8 + seededValue(index, 3) * 12;
      const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      glow.addColorStop(0, `rgba(255, 183, 112, ${0.48 * visibility})`);
      glow.addColorStop(0.35, `rgba(112, 161, 222, ${0.18 * visibility})`);
      glow.addColorStop(1, "rgba(40, 80, 140, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = `rgba(255, 221, 181, ${0.85 * visibility})`;
      context.beginPath();
      context.arc(point.x, point.y, 1 + seededValue(index, 4) * 1.5, 0, Math.PI * 2);
      context.fill();
    }

    if (zoom >= 26) {
      const opacity = Math.min(0.75, 0.34 + (zoom - 26) * 0.28);
      const cmb = context.createRadialGradient(WIDTH / 2, HEIGHT / 2, 42, WIDTH / 2, HEIGHT / 2, 108);
      cmb.addColorStop(0, "rgba(255, 255, 255, 0)");
      cmb.addColorStop(0.82, `rgba(210, 176, 126, ${opacity * 0.08})`);
      cmb.addColorStop(0.94, `rgba(255, 199, 129, ${opacity})`);
      cmb.addColorStop(1, "rgba(255, 199, 129, 0)");
      context.fillStyle = cmb;
      context.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }, [zoom]);

  return (
    <div className="cosmic-web-frame" role="img" aria-label="Procedural visualization of cosmic voids, glowing galaxy filaments, and cluster nodes">
      <canvas ref={canvasRef} />
      <span className="cosmic-web-caption">PROCEDURAL LARGE-SCALE STRUCTURE · NOT TO SCALE</span>
    </div>
  );
}
