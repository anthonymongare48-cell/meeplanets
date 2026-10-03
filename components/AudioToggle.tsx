"use client";
import { useCosmosStore } from "@/store/useCosmosStore";

export function AudioToggle() {
  const { audioEnabled, toggleAudio } = useCosmosStore();
  return <button className="audio-toggle" onClick={toggleAudio} aria-label="Toggle ambient audio">{audioEnabled ? "◉ AUDIO ON" : "○ AUDIO OFF"}</button>;
}
