"use client";

import { useEffect, useRef, useState } from "react";

export function WebGLStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("WEBGL2 INITIALIZING");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setStatus("WEBGL2 UNAVAILABLE · CSS FALLBACK");
      return;
    }
    const vertex = `#version 300 es
      in vec3 position;
      uniform float uTime;
      out float depth;
      void main() {
        vec3 p = position;
        p.z = mod(p.z + uTime * 0.04 + 1.0, 2.0) - 1.0;
        depth = 1.0 - abs(p.z);
        gl_Position = vec4(p.xy, p.z, 1.0);
        gl_PointSize = 1.0 + depth * 3.0;
      }`;
    const fragment = `#version 300 es
      precision highp float;
      in float depth;
      out vec4 color;
      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float glow = smoothstep(0.5, 0.0, length(point));
        color = vec4(0.45 + depth * 0.45, 0.32 + depth * 0.25, 0.18 + depth * 0.2, glow);
      }`;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compilation failed");
      return shader;
    };
    try {
      const program = gl.createProgram();
      if (!program) throw new Error("Could not create WebGL program");
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader link failed");
      const positions = new Float32Array(1800);
      for (let index = 0; index < positions.length; index += 3) {
        positions[index] = Math.random() * 2 - 1;
        positions[index + 1] = Math.random() * 2 - 1;
        positions[index + 2] = Math.random() * 2 - 1;
      }
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
      const attribute = gl.getAttribLocation(program, "position");
      const time = gl.getUniformLocation(program, "uTime");
      gl.useProgram(program);
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(canvas.clientWidth * ratio);
        canvas.height = Math.floor(canvas.clientHeight * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);
      let frame = 0;
      const render = (now: number) => {
        gl.clearColor(0.02, 0.02, 0.02, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(time, now / 1000);
        gl.drawArrays(gl.POINTS, 0, positions.length / 3);
        frame = window.requestAnimationFrame(render);
      };
      frame = window.requestAnimationFrame(render);
      setStatus(`WEBGL2 ACTIVE · ${positions.length / 3} PARALLAX PARTICLES`);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      };
    } catch (error) {
      setStatus(error instanceof Error ? `WEBGL2 ERROR · ${error.message}` : "WEBGL2 ERROR");
    }
  }, []);

  return <div className="webgl-preview"><canvas ref={canvasRef} aria-label="Procedural WebGL parallax starfield" /><span>{status}</span></div>;
}
