"use client";

import { useEffect, useState } from "react";

type Position = { latitude: string; longitude: string; altitude: string; velocity: string; timestamp: string };

export function LiveMissionPanel() {
  const [position, setPosition] = useState<Position | null>(null);
  const [status, setStatus] = useState("Awaiting uplink…");
  const [vehicle, setVehicle] = useState({ x: 50, y: 50, thrust: 0 });
  const refresh = async () => {
    setStatus("Connecting to public orbital feed…");
    try {
      const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544", { cache: "no-store" });
      if (!response.ok) throw new Error("uplink unavailable");
      const data = await response.json();
      setPosition({ latitude: Number(data.latitude).toFixed(3), longitude: Number(data.longitude).toFixed(3), altitude: `${Number(data.altitude).toFixed(1)} km`, velocity: `${Number(data.velocity).toFixed(0)} km/h`, timestamp: new Date().toLocaleTimeString() });
      setStatus("LIVE · ISS uplink received");
    } catch { setStatus("OFFLINE · showing safe fallback cache"); setPosition({ latitude: "—", longitude: "—", altitude: "408 km", velocity: "27,600 km/h", timestamp: "cached" }); }
  };
  useEffect(() => { refresh(); const timer = window.setInterval(refresh, 60000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const move = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 5 : 2;
      setVehicle((current) => {
        const key = event.key.toLowerCase();
        const dx = key === "arrowright" || key === "d" ? step : key === "arrowleft" || key === "a" ? -step : 0;
        const dy = key === "arrowdown" || key === "s" ? step : key === "arrowup" || key === "w" ? -step : 0;
        return { ...current, x: Math.max(5, Math.min(95, current.x + dx)), y: Math.max(8, Math.min(92, current.y + dy)), thrust: dx || dy ? step : current.thrust };
      });
    };
    window.addEventListener("keydown", move); return () => window.removeEventListener("keydown", move);
  }, []);
  return <div className="live-mission-grid"><section className="suite-card"><div className="split-heading"><div><span className="eyebrow">MISSION CONSOLE / KEYBOARD PILOT</span><h2>Field operations</h2></div><span className="epoch-badge">WASD / ARROWS</span></div><div className="mission-field" role="application" tabIndex={0} aria-label="Mission movement field"><div className="field-grid" /><div className="mission-vehicle spacecraft" style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }}>✦</div><div className="field-target">◉</div><div className="mission-hud"><span>POS <strong>{Math.round(vehicle.x)},{Math.round(vehicle.y)}</strong></span><span>THRUST <strong>{vehicle.thrust.toFixed(1)}</strong></span><span>STATUS <strong>ACTIVE</strong></span></div></div></section><section className="suite-card"><div className="split-heading"><div><span className="eyebrow">LIVE TELEMETRY</span><h2>ISS position</h2></div><button className="small-btn" onClick={refresh}>REFRESH</button></div><p className="data-status">{status}</p><div className="iss-data">{position && <><span>LATITUDE <strong>{position.latitude}°</strong></span><span>LONGITUDE <strong>{position.longitude}°</strong></span><span>ALTITUDE <strong>{position.altitude}</strong></span><span>VELOCITY <strong>{position.velocity}</strong></span><span>STAMP <strong>{position.timestamp}</strong></span></>}</div><p className="fallback-note">Public orbital feed · fallback cache enabled</p></section></div>;
}
