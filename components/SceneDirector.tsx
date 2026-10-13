"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { planets } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";

const quickActions = [
  { label: "Saturn", command: "Show Saturn" },
  { label: "Earth", command: "Show Earth" },
  { label: "Mars", command: "Show Mars" },
  { label: "Play", command: "Play simulation" },
  { label: "Pause", command: "Pause simulation" },
  { label: "Speed 1×", command: "Set speed to 1x" },
  { label: "Speed 5×", command: "Set speed to 5x" },
  { label: "Speed 20×", command: "Set speed to 20x" },
  { label: "3D view", command: "Switch to 3D" },
  { label: "Top-down 2D", command: "Switch to 2D" },
  { label: "Milky Way", command: "Open the Milky Way" },
  { label: "Deep space", command: "Open deep space" },
  { label: "Observatory", command: "Open observatory" },
];

export function SceneDirector() {
  const router = useRouter();
  const selectPlanet = useCosmosStore((state) => state.selectPlanet);
  const setSpeed = useCosmosStore((state) => state.setSimulationSpeed);
  const setPlaying = useCosmosStore((state) => state.setSimulationPlaying);
  const setMode = useCosmosStore((state) => state.setSimulationMode);
  const setZoom = useCosmosStore((state) => state.setSimulationZoom);
  const [open, setOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [feedback, setFeedback] = useState("Try a command such as “Show Saturn” or “Set speed to 5x.”");
  const commandInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    commandInput.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function execute(rawCommand: string) {
    const normalized = rawCommand.trim().toLowerCase();
    if (!normalized) {
      setFeedback("Enter a scene command first.");
      return;
    }

    const planet = planets.find((item) => normalized.includes(item.name.toLowerCase()));
    if (planet && /(telemetry|atmosphere|interior|details|profile)/.test(normalized)) {
      selectPlanet(planet.id);
      router.push(`/planets/${planet.id}`);
      setFeedback(`Opening ${planet.name} telemetry.`);
      return;
    }

    const requestedSpeed = normalized.match(/(?:speed|fast|slow|set)\D{0,20}(0\.5|0\.5x|1|1x|5|5x|20|20x)/);
    if (requestedSpeed) {
      const speed = Number(requestedSpeed[1].replace("x", ""));
      setSpeed(speed);
      setFeedback(`Simulation speed set to ${speed}×.`);
      router.push("/");
      return;
    }
    if (/\b(faster|speed up)\b/.test(normalized) || /\b(slower|slow down)\b/.test(normalized)) {
      const speeds = [0.5, 1, 5, 20];
      const currentSpeed = useCosmosStore.getState().simulationSpeed;
      const currentIndex = speeds.indexOf(currentSpeed);
      const nextIndex = /\b(faster|speed up)\b/.test(normalized)
        ? Math.min(speeds.length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);
      setSpeed(speeds[nextIndex]);
      router.push("/");
      setFeedback(`Simulation speed set to ${speeds[nextIndex]}×.`);
      return;
    }

    if (/\b(pause|stop)\b/.test(normalized)) {
      setPlaying(false);
      setFeedback("Solar-system simulation paused.");
      router.push("/");
      return;
    }
    if (/\b(play|resume|continue)\b/.test(normalized)) {
      setPlaying(true);
      setFeedback("Solar-system simulation resumed.");
      router.push("/");
      return;
    }
    if (/\b(3d|three.?d|tilted view)\b/.test(normalized)) {
      setMode("3D");
      router.push("/");
      setFeedback("Switched the solar-system view to 3D.");
      return;
    }
    if (/\b(2d|top.?down|top view)\b/.test(normalized)) {
      setMode("2D");
      router.push("/");
      setFeedback("Switched the solar-system view to top-down 2D.");
      return;
    }
    if (/\b(zoom in|closer|zoom closer)\b/.test(normalized)) {
      setZoom(Math.min(1.35, useCosmosStore.getState().simulationZoom + 0.1));
      router.push("/");
      setFeedback("Zoomed in on the solar-system view.");
      return;
    }
    if (/\b(zoom out|farther|zoom back)\b/.test(normalized)) {
      setZoom(Math.max(0.75, useCosmosStore.getState().simulationZoom - 0.1));
      router.push("/");
      setFeedback("Zoomed out on the solar-system view.");
      return;
    }
    if (planet && /\b(show|view|select|focus|go to|fly to)\b/.test(normalized)) {
      selectPlanet(planet.id);
      router.push("/");
      setFeedback(`Selected ${planet.name} in the solar-system simulator.`);
      return;
    }
    if (/\b(galaxy|milky way)\b/.test(normalized)) {
      router.push("/galaxy");
      setFeedback("Opening the Milky Way procedural visualization.");
      return;
    }
    if (/\b(deep space|nebula|carina|trappist|crab nebula)\b/.test(normalized)) {
      router.push("/deep-space");
      setFeedback("Opening the deep-space catalog.");
      return;
    }
    if (/\b(solar eclipse|next eclipse|eclipse)\b/.test(normalized)) {
      router.push("/observatory");
      setFeedback("Opened Observatory. Exact future eclipse visibility and dates are not calculated by this scene director.");
      return;
    }
    if (/\b(sun|red giant)\b/.test(normalized)) {
      router.push("/sun");
      setFeedback("Opening Sun telemetry. Stellar-evolution transformation is not simulated here.");
      return;
    }
    if (/\b(observatory|iss|satellite)\b/.test(normalized)) {
      router.push("/observatory");
      setFeedback("Opening the Observatory.");
      return;
    }

    setFeedback("I couldn't map that to a scene action. Try a planet name, speed, play/pause, 2D/3D, zoom, galaxy, or observatory command.");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    execute(command);
  }

  return (
    <aside className={`scene-director ${open ? "is-open" : ""}`}>
      {open && (
        <section className="scene-director-panel" id="scene-director-panel" role="dialog" aria-labelledby="scene-director-title" aria-modal="false">
          <div className="scene-director-heading">
          <div><span className="eyebrow">QUICK CONTROLS</span><h2 id="scene-director-title">Scene Director</h2></div>
          <button className="scene-director-close" type="button" onClick={() => setOpen(false)} aria-label="Close Scene Director">×</button>
          </div>
        <p className="scene-director-description">Choose an action below, or type a command. These controls work locally with the solar-system scene.</p>
          <form className="scene-director-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="scene-command">Scene command</label>
          <input ref={commandInput} id="scene-command" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Try: Show Jupiter" autoComplete="off" />
            <button type="submit" className="button">GO</button>
          </form>
        <div className="scene-director-actions">
          <div className="scene-director-action-group"><h3>Choose a world</h3><div className="scene-quick-commands">{quickActions.slice(0, 3).map((item) => <button type="button" key={item.label} onClick={() => { setCommand(item.command); execute(item.command); }}>{item.label}</button>)}</div></div>
          <div className="scene-director-action-group"><h3>Simulation</h3><div className="scene-quick-commands">{quickActions.slice(3, 8).map((item) => <button type="button" key={item.label} onClick={() => { setCommand(item.command); execute(item.command); }}>{item.label}</button>)}</div></div>
          <div className="scene-director-action-group"><h3>View & explore</h3><div className="scene-quick-commands">{quickActions.slice(8).map((item) => <button type="button" key={item.label} onClick={() => { setCommand(item.command); execute(item.command); }}>{item.label}</button>)}</div></div>
        </div>
        <p className="scene-director-feedback" role="status" aria-live="polite">{feedback}</p>
        </section>
      )}
      <button className="scene-director-toggle" type="button" aria-expanded={open} aria-controls="scene-director-panel" aria-label={open ? "Close Scene Director" : "Open Scene Director"} onClick={() => setOpen((value) => !value)}>
        <span aria-hidden="true">✦</span> {open ? "CLOSE DIRECTOR" : "SCENE DIRECTOR"}
      </button>
    </aside>
  );
}
