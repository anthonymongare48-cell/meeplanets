"use client";

import { useEffect, useRef, useState } from "react";

type MilkyWayCanvasProps = {
  tourProgress: number;
};

const STAR_COUNT = 90000;

const vertexShader = `#version 300 es
in vec3 aPosition;
in vec3 aColor;
in float aSize;
in float aBrightness;
uniform float uTime;
uniform float uTour;
uniform float uAspect;
uniform float uYaw;
uniform float uPitch;
out vec3 vColor;
out float vBrightness;
out float vRadius;
out float vDust;
vec2 catmullRom(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
  float t2 = t * t;
  float t3 = t2 * t;
  return 0.5 * ((2.0 * p1) + (-p0 + p2) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2 + (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3);
}
void main() {
  float c = cos(uYaw);
  float s = sin(uYaw);
  vec3 p = vec3(aPosition.x * c - aPosition.y * s, aPosition.x * s + aPosition.y * c, aPosition.z);
  float cp = cos(uPitch);
  float sp = sin(uPitch);
  p = vec3(p.x, p.y * cp - p.z * sp, p.y * sp + p.z * cp);
  float zoom = mix(0.72, 1.34, smoothstep(0.0, 1.0, uTour));
  vec2 cameraTrack = catmullRom(vec2(-0.32, 0.18), vec2(-0.17, -0.1), vec2(0.035, -0.025), vec2(0.0, 0.08), smoothstep(0.0, 1.0, uTour));
  vec2 projected = (p.xy - cameraTrack) * zoom;
  projected.x /= uAspect;
  float depth = 1.0 / (1.25 + max(-0.7, p.z * 0.16));
  gl_Position = vec4(projected, clamp(p.z * 0.12, -0.85, 0.85), 1.0);
  gl_PointSize = clamp(aSize * depth, 1.0, 9.0);
  vColor = aColor;
  vBrightness = aBrightness * (0.91 + 0.09 * sin(uTime * 0.7 + aPosition.x * 11.0));
  vRadius = length(aPosition.xy);
  vDust = aPosition.z;
}`;

const fragmentShader = `#version 300 es
precision highp float;
in vec3 vColor;
in float vBrightness;
in float vRadius;
in float vDust;
uniform float uTime;
out vec4 outColor;
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = exp(-d * 12.0);
  float halo = exp(-d * 5.0);
  float alpha = 1.0 - smoothstep(0.0, 0.5, d);
  float dustLane = smoothstep(0.11, 0.015, abs(vDust + 0.11 * sin(vRadius * 7.0)));
  float dustFade = 1.0 - dustLane * 0.52 * smoothstep(0.12, 0.48, vRadius);
  vec3 color = vColor * vBrightness * dustFade;
  color += vec3(0.08, 0.12, 0.2) * halo;
  color = aces(color * (1.0 + core * 0.8));
  float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.025;
  outColor = vec4(color, alpha * clamp(vBrightness * dustFade, 0.12, 0.95));
}`;

function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function buildGalaxy() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const brightness = new Float32Array(STAR_COUNT);
  const arms = 4;
  const coreCount = Math.floor(STAR_COUNT * 0.2);

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const base = index * 3;
    const seed = index + 1;
    const isCore = index < coreCount;
    let x: number;
    let y: number;
    let z: number;
    let radius: number;
    if (isCore) {
      radius = Math.pow(random(seed * 2), 1.8) * 0.19;
      const angle = random(seed * 3) * Math.PI * 2;
      x = Math.cos(angle) * radius * (0.82 + random(seed * 5) * 0.3);
      y = Math.sin(angle) * radius * (0.82 + random(seed * 7) * 0.3);
      z = (random(seed * 11) - 0.5) * (0.2 * (1 - radius * 3));
    } else {
      const arm = Math.floor(random(seed * 13) * arms);
      radius = Math.pow(random(seed * 17), 0.62) * 0.92 + 0.045;
      const angle = arm * (Math.PI * 2 / arms) + Math.log(radius + 0.1) * 1.65 + (random(seed * 19) - 0.5) * 0.62;
      const bar = Math.exp(-Math.pow(radius / 0.2, 2)) * 0.18;
      const scatter = (0.008 + radius * 0.055);
      x = Math.cos(angle) * radius + Math.cos(angle) * bar + (random(seed * 23) - 0.5) * scatter;
      y = Math.sin(angle) * radius + Math.sin(angle) * bar + (random(seed * 29) - 0.5) * scatter;
      z = (random(seed * 31) - 0.5) * (0.035 + radius * 0.075);
    }
    positions[base] = x;
    positions[base + 1] = y;
    positions[base + 2] = z;

    const youngStar = random(seed * 37) > 0.91 && !isCore;
    const warm = isCore || (!youngStar && random(seed * 41) > 0.58);
    colors[base] = youngStar ? 0.45 : warm ? 1.0 : 0.82;
    colors[base + 1] = youngStar ? 0.72 : warm ? 0.72 + random(seed * 43) * 0.2 : 0.88;
    colors[base + 2] = youngStar ? 1.0 : warm ? 0.38 : 1.0;
    sizes[index] = isCore ? 1.5 + random(seed * 47) * 3.4 : 0.65 + random(seed * 53) * 2.3;
    brightness[index] = isCore ? 0.55 + random(seed * 59) * 0.8 : 0.24 + random(seed * 61) * 0.92;
  }
  return { positions, colors, sizes, brightness };
}

export function MilkyWayCanvas({ tourProgress }: MilkyWayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("INITIALIZING GALACTIC SURVEY");
  const yawRef = useRef(0);
  const pitchRef = useRef(0.26);
  const tourProgressRef = useRef(tourProgress);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    tourProgressRef.current = tourProgress;
  }, [tourProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "high-performance" });
    if (!canvas || !gl) {
      setStatus("WEBGL2 UNAVAILABLE · GALAXY VIEW CANNOT RENDER");
      return;
    }

    let program: WebGLProgram | null = null;
    const buffers: WebGLBuffer[] = [];
    let frame = 0;
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to allocate galaxy shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) ?? "Galaxy shader compilation failed";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    };

    try {
      program = gl.createProgram();
      if (!program) throw new Error("Unable to allocate galaxy render program");
      gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexShader));
      gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "Galaxy shader link failed");

      const galaxy = buildGalaxy();
      const attributes = [
        ["aPosition", galaxy.positions, 3],
        ["aColor", galaxy.colors, 3],
        ["aSize", galaxy.sizes, 1],
        ["aBrightness", galaxy.brightness, 1],
      ] as const;
      gl.useProgram(program);
      for (const [name, data, width] of attributes) {
        const location = gl.getAttribLocation(program, name);
        if (location < 0) throw new Error(`Missing shader attribute: ${name}`);
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error(`Unable to allocate ${name} buffer`);
        buffers.push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, width, gl.FLOAT, false, 0, 0);
      }

      const uniforms = {
        time: gl.getUniformLocation(program, "uTime"),
        tour: gl.getUniformLocation(program, "uTour"),
        aspect: gl.getUniformLocation(program, "uAspect"),
        yaw: gl.getUniformLocation(program, "uYaw"),
        pitch: gl.getUniformLocation(program, "uPitch"),
      };
      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
        canvas.height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      const startTime = performance.now();
      const render = (now: number) => {
        if (!program) return;
        gl.clearColor(0.004, 0.006, 0.012, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(uniforms.time, (now - startTime) / 1000);
        gl.uniform1f(uniforms.tour, tourProgressRef.current);
        gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
        gl.uniform1f(uniforms.yaw, yawRef.current + (now - startTime) * 0.000018);
        gl.uniform1f(uniforms.pitch, pitchRef.current);
        gl.drawArrays(gl.POINTS, 0, STAR_COUNT);
        frame = window.requestAnimationFrame(render);
      };
      frame = window.requestAnimationFrame(render);
      setStatus(`WEBGL2 · ${STAR_COUNT.toLocaleString()} STARS · SINGLE DRAW CALL`);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        buffers.forEach((buffer) => gl.deleteBuffer(buffer));
        if (program) gl.deleteProgram(program);
      };
    } catch (error) {
      if (program) gl.deleteProgram(program);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      setStatus(error instanceof Error ? `GALAXY RENDER ERROR · ${error.message}` : "GALAXY RENDER ERROR");
    }
  }, []);

  return (
    <div
      className="milky-way-canvas"
      onPointerDown={(event) => { dragRef.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={(event) => {
        if (!dragRef.current) return;
        const dx = event.clientX - dragRef.current.x;
        const dy = event.clientY - dragRef.current.y;
        yawRef.current += dx * 0.004;
        pitchRef.current = Math.max(-0.5, Math.min(0.8, pitchRef.current + dy * 0.003));
        dragRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={() => { dragRef.current = null; }}
      onPointerCancel={() => { dragRef.current = null; }}
      aria-label="Interactive procedural Milky Way galaxy. Drag to change viewing angle."
    >
      <canvas ref={canvasRef} />
      <span className="milky-way-status">{status}</span>
      <span className="milky-way-core-label">GALACTIC CENTER · SAGITTARIUS A*</span>
    </div>
  );
}
