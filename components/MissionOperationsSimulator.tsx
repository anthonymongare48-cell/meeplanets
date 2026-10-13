"use client";

import { useEffect, useRef, useState } from "react";

type Log = { kind: "ok" | "info" | "warning"; text: string };
type MissionMode = "orbiter" | "rover";
type Point = { x: number; y: number };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function RoverIllustration({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 260 145" role="img" aria-label="Perseverance rover illustration">
      <g fill="none" stroke="#d4e4e4" strokeLinecap="round" strokeLinejoin="round">
        <path d="m129 51 8-19 10 18m-13-12 10-6m-19 21 23 1 4 11-6 16h-36l-5-15 6-12z" fill="#d4d2c8" strokeWidth="2" />
        <path d="m119 58 26-1m-26 8h29m-36 14h47l17 12-9 9h-66l-14-8z" fill="#bbb9ae" strokeWidth="2" />
        <path d="m108 75 20 9 20-11 13 11-9 10h-47l-10-9z" fill="#f2f0e7" strokeWidth="1.5" />
        <path d="m123 52-10-8 3-10 15 4 8 12m16 26 14 10 3 17m-65-36-17 8-5 21" strokeWidth="2" />
        <path d="m93 101-10 12m20-11-5 14m57-15 9 13m8-16 13 12" strokeWidth="3" />
        <path d="M87 113h-9m23 3h-9m80-2h-9m29-1h-9" strokeWidth="1.5" />
        <circle cx="126" cy="63" r="2" fill="#72e6df" stroke="none" />
        <circle cx="138" cy="63" r="2" fill="#72e6df" stroke="none" />
        <path d="m115 37-14-8 2-4 13 6m26 16 14-10 3 3-14 13" strokeWidth="1.4" />
      </g>
      <g fill="#10151a" stroke="#9ca9aa" strokeWidth="2">
        <circle cx="85" cy="111" r="9" /><circle cx="103" cy="111" r="9" /><circle cx="162" cy="111" r="9" /><circle cx="180" cy="109" r="9" />
      </g>
      <g fill="none" stroke="#68777b" strokeWidth="1">
        <path d="M78 111h14m-14-4 14 8m-5-13v18m23-9h14m-14-4 14 8m-7-13v18m47-9h14m-14-4 14 8m-7-13v18m18-9h14m-14-4 14 8m-7-13v18" />
      </g>
    </svg>
  );
}

export function MissionOperationsSimulator() {
  const [mode, setMode] = useState<MissionMode>("rover");
  const [roverPosition, setRoverPosition] = useState<Point>({ x: 47, y: 68 });
  const [roverTrack, setRoverTrack] = useState<Point[]>([
    { x: 21, y: 75 }, { x: 58, y: 82 }, { x: 85, y: 53 }, { x: 116, y: 44 }, { x: 145, y: 72 },
  ]);
  const [target, setTarget] = useState<Point>({ x: 77, y: 42 });
  const [heading, setHeading] = useState(28);
  const [distance, setDistance] = useState(128.4);
  const [battery, setBattery] = useState(87);
  const [scanCount, setScanCount] = useState(0);
  const [orbitActive, setOrbitActive] = useState(true);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [orbitAltitude, setOrbitAltitude] = useState(343);
  const [orbitSpeed, setOrbitSpeed] = useState(4.2);
  const [orbitAltitudeCenter, setOrbitAltitudeCenter] = useState(343);
  const [orbitSpeedCenter, setOrbitSpeedCenter] = useState(4.2);
  const [autonavActive, setAutonavActive] = useState(false);
  const [logs, setLogs] = useState<Log[]>([
    { kind: "ok", text: "UPLINK ESTABLISHED · MARS RELAY 02" },
    { kind: "info", text: "PERSEVERANCE · AUTONOMOUS NAVIGATION READY" },
  ]);
  const [script, setScript] = useState("say('Perseverance online')\ndrive(12)\nscan()\nturn(35)\ndrive(8)");
  const [running, setRunning] = useState(false);
  const [missionClock, setMissionClock] = useState(3 * 3600 + 42 * 60 + 18);
  const timer = useRef<number | undefined>(undefined);
  const scriptTimer = useRef<number | undefined>(undefined);
  const waypointTimer = useRef<number | undefined>(undefined);
  const headingRef = useRef(heading);
  const roverPositionRef = useRef<Point>(roverPosition);
  const scanCountRef = useRef(scanCount);
  const orbitPhaseRef = useRef(0);

  const mapPoint = (point: Point): Point => ({
    x: clamp(145 + (point.x - 47) * 2.4, 12, 288),
    y: clamp(72 + (point.y - 68) * 0.9, 10, 96),
  });

  const addLog = (kind: Log["kind"], text: string) => {
    setLogs((current) => [...current.slice(-7), { kind, text }]);
  };

  const stopAutonav = () => {
    if (waypointTimer.current !== undefined) window.clearInterval(waypointTimer.current);
    waypointTimer.current = undefined;
    setAutonavActive(false);
  };

  const drive = (dx: number, dy: number) => {
    if (waypointTimer.current !== undefined) {
      stopAutonav();
      addLog("warning", "AUTONAV INTERRUPTED · MANUAL CONTROL");
    }
    const current = roverPositionRef.current;
    const next = { x: clamp(current.x + dx, 8, 92), y: clamp(current.y + dy, 25, 82) };
    roverPositionRef.current = next;
    setRoverPosition(next);
    setDistance((value) => value + Math.hypot(next.x - current.x, next.y - current.y) * 0.18);
    setTarget(next);
    setRoverTrack((track) => [...track.slice(-13), mapPoint(next)]);
    setBattery((value) => Math.max(8, value - 0.08));
  };

  const driveByHeading = (offset: number, distance: number) => {
    const angle = (headingRef.current + offset) * Math.PI / 180;
    drive(Math.cos(angle) * distance, -Math.sin(angle) * distance);
  };

  const scan = () => {
    scanCountRef.current += 1;
    setScanCount(scanCountRef.current);
    setBattery((value) => Math.max(8, value - 0.15));
    addLog("ok", `SCIENCE SCAN ${String(scanCountRef.current).padStart(2, "0")} · CHEMICAL TRACE DETECTED`);
  };

  const turn = (degrees: number) => {
    stopAutonav();
    const next = (headingRef.current + degrees + 360) % 360;
    headingRef.current = next;
    setHeading(next);
  };

  const stopScript = () => {
    if (scriptTimer.current !== undefined) window.clearTimeout(scriptTimer.current);
    scriptTimer.current = undefined;
    setRunning(false);
  };

  const runScript = () => {
    stopAutonav();
    stopScript();
    const lines = script.split("\n").map((line) => line.trim()).filter(Boolean);
    try {
      if (lines.length > 30) {
        throw new Error("Mission sequences are limited to 30 commands.");
      }
      const commands = lines.map((line, index) => {
        const match = line.match(/^([a-z]+)\s*\((.*)\)$/i);
        const command = match?.[1]?.toLowerCase();
        const argument = match?.[2]?.trim() ?? "";
        if (!match || !command || !["say", "drive", "turn", "scan", "wait"].includes(command)) {
          throw new Error(`Line ${index + 1}: use say(), drive(), turn(), scan(), or wait().`);
        }
        if (["drive", "turn", "wait"].includes(command) && (!Number.isFinite(Number(argument)) || Math.abs(Number(argument)) > 100)) {
          throw new Error(`Line ${index + 1}: numeric values must be between -100 and 100.`);
        }
        return { command, argument: argument.replace(/^['"]|['"]$/g, "") };
      });
      stopScript();
      setRunning(true);
      let index = 0;
      let sequenceHeading = headingRef.current;
      const step = () => {
        const current = commands[index++];
        if (!current) {
          setRunning(false);
          addLog("ok", "ROVER SEQUENCE COMPLETE · AUTONOMY HOLD");
          return;
        }
        const amount = Number(current.argument);
        if (current.command === "say") addLog("info", `ROVER › ${current.argument.slice(0, 72)}`);
        if (current.command === "scan") scan();
        if (current.command === "drive") drive(Math.cos(sequenceHeading * Math.PI / 180) * amount, -Math.sin(sequenceHeading * Math.PI / 180) * amount);
        if (current.command === "turn") {
          sequenceHeading = (sequenceHeading + amount + 360) % 360;
          turn(amount);
        }
        if (current.command === "wait") addLog("warning", `WAIT › ${amount} MISSION TICKS`);
        scriptTimer.current = window.setTimeout(step, current.command === "wait" ? 650 : 380);
      };
      step();
    } catch (error) {
      addLog("warning", error instanceof Error ? error.message : "Unable to parse mission script.");
    }
  };

  useEffect(() => {
    const tick = window.setInterval(() => setMissionClock((time) => time + 1), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!orbitActive) return;
    timer.current = window.setInterval(() => {
      const angle = (orbitPhaseRef.current + 1.3) % 360;
      orbitPhaseRef.current = angle;
      setOrbitAngle(angle);
      setOrbitAltitude(orbitAltitudeCenter + Math.round(Math.sin(angle * Math.PI / 180) * 8));
      setOrbitSpeed(Number((orbitSpeedCenter + Math.sin(angle * Math.PI / 4) * 0.06).toFixed(2)));
    }, 50);
    return () => {
      if (timer.current !== undefined) window.clearInterval(timer.current);
    };
  }, [orbitActive, orbitAltitudeCenter, orbitSpeedCenter]);

  useEffect(() => () => {
    if (scriptTimer.current !== undefined) window.clearTimeout(scriptTimer.current);
    if (waypointTimer.current !== undefined) window.clearInterval(waypointTimer.current);
  }, []);

  const onSurfaceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92), y: clamp(((event.clientY - rect.top) / rect.height) * 100, 25, 82) };
    if (waypointTimer.current !== undefined) window.clearInterval(waypointTimer.current);
    setTarget(point);
    setAutonavActive(true);
    addLog("info", "WAYPOINT ACCEPTED · AUTONAV ROUTE PLANNED");
    waypointTimer.current = window.setInterval(() => {
      const current = roverPositionRef.current;
      const dx = point.x - current.x;
      const dy = point.y - current.y;
      const remaining = Math.hypot(dx, dy);
      const step = Math.min(remaining, 1.2);
      if (remaining < 0.2) {
        stopAutonav();
        addLog("ok", "WAYPOINT REACHED · ROVER HOLD");
        return;
      }
      const next = { x: current.x + dx / remaining * step, y: current.y + dy / remaining * step };
      roverPositionRef.current = next;
      setRoverPosition(next);
      setDistance((value) => value + step * 0.18);
      setBattery((value) => Math.max(8, value - 0.02));
      setRoverTrack((track) => [...track.slice(-13), mapPoint(next)]);
      const nextHeading = (Math.atan2(-dy, dx) * 180 / Math.PI + 360) % 360;
      headingRef.current = nextHeading;
      setHeading(nextHeading);
      if (remaining <= step) {
        stopAutonav();
        addLog("ok", "WAYPOINT REACHED · ROVER HOLD");
      }
    }, 50);
  };

  const handleSurfaceKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const directions: Record<string, number> = {
      ArrowUp: 0, w: 0, ArrowLeft: 90, a: 90, ArrowDown: 180, s: 180, ArrowRight: 270, d: 270,
    };
    const direction = directions[event.key] ?? directions[event.key.toLowerCase()];
    if (direction !== undefined) {
      event.preventDefault();
      driveByHeading(direction, 3);
    }
  };

  const clock = `${String(Math.floor(missionClock / 3600)).padStart(2, "0")}:${String(Math.floor((missionClock % 3600) / 60)).padStart(2, "0")}:${String(missionClock % 60).padStart(2, "0")}`;

  return (
    <section className="mission-operations" aria-label="Probe and rover mission simulation">
      <header className="mission-ops-header">
        <div>
          <span className="eyebrow">DEEP SPACE NETWORK / MISSION CONTROL</span>
          <h2>MISSION <em>TRANSIT</em> SIMULATOR</h2>
        </div>
        <div className="mission-ops-status"><i /> SIMULATION ONLINE <span>·</span> SOL 284</div>
      </header>
      <div className="mission-ops-readouts">
        <div><span>MISSION ELAPSED</span><strong>{clock}</strong><small>UTC · SOL 284</small></div>
        <div><span>EARTH–MARS SIGNAL</span><strong>13m 42s</strong><small>ONE-WAY LIGHT TIME</small></div>
        <div><span>RELAY LINK</span><strong className="telemetry-live">● 98.4%</strong><small>MRO / UHF BAND</small></div>
        <div><span>ACTIVE VEHICLES</span><strong>02 <small>/ 02</small></strong><small>ORBITER + ROVER</small></div>
        <div className="mission-ops-target"><span>DESTINATION</span><strong>JEZERO CRATER</strong><small>MARS · 18.44°N 77.45°E</small></div>
      </div>

      <div className="mission-mode-tabs" role="tablist" aria-label="Active mission vehicle">
        <button role="tab" aria-selected={mode === "orbiter"} className={mode === "orbiter" ? "active" : ""} onClick={() => setMode("orbiter")}>01 / ORBITER PROBE <span>MRO RELAY</span></button>
        <button role="tab" aria-selected={mode === "rover"} className={mode === "rover" ? "active" : ""} onClick={() => setMode("rover")}>02 / SURFACE ROVER <span>PERSEVERANCE</span></button>
        <span className="mission-mode-hint">SELECT A VEHICLE TO ARM ITS CONTROLS</span>
      </div>

      <div className="mission-vehicle-grid">
        <article className={`mission-vehicle-panel ${mode === "orbiter" ? "vehicle-selected" : ""}`}>
          <div className="mission-panel-heading">
            <div><span className="eyebrow">ORBITAL INSERTION SIMULATION</span><h3>MARS RECONNAISSANCE ORBITER</h3></div>
            <span className={`mission-state ${orbitActive ? "state-live" : ""}`}>{orbitActive ? "● ACTIVE" : "○ STANDBY"}</span>
          </div>
          <div className="orbiter-stage" aria-label="Animated spacecraft in orbit around Mars">
            <div className="orbiter-stars" />
            <div className="mars-horizon" />
            <div className="mars-globe"><span>OLYMPUS MONS</span></div>
            <div className="orbital-track orbital-track-cyan" />
            <div className="orbital-track orbital-track-amber" />
            <div className="orbiter-satellite" style={{ left: `${50 + Math.cos(orbitAngle * Math.PI / 180) * 39}%`, top: `${53 + Math.sin(orbitAngle * Math.PI / 180) * 25}%` }}>
              <span className="satellite-panel satellite-panel-left" /><span className="satellite-core">✦</span><span className="satellite-panel satellite-panel-right" />
              <span className="orbiter-signal" />
            </div>
            <div className="orbit-altitude-scale"><i>400 km</i><i>300 km</i><i>200 km</i><i>100 km</i></div>
            <div className="orbiter-altitude">ALTITUDE <strong>{orbitAltitude} km</strong><br />VELOCITY <strong>{orbitSpeed} km/s</strong></div>
            <span className="orbiter-stage-caption">AREOCENTRIC INERTIAL FRAME · NOT TO SCALE</span>
            <div className="orbiter-controls">
              <button disabled={mode !== "orbiter"} onClick={() => { setOrbitActive((active) => !active); addLog("info", orbitActive ? "ORBITER HOLD · PROPULSION SAFE" : "ORBITER RESUMED · NOMINAL ORBIT"); }} aria-label={orbitActive ? "Pause orbiter" : "Resume orbiter"}>{orbitActive ? "Ⅱ PAUSE ORBIT" : "▶ RESUME ORBIT"}</button>
              <button disabled={mode !== "orbiter"} onClick={() => { setOrbitAltitudeCenter(250); setOrbitSpeedCenter(4.6); setOrbitAltitude(250); setOrbitSpeed(4.6); addLog("ok", "ORBITAL TRIM BURN · PERIAPSIS 250 KM"); }}>TRIM ORBIT ↗</button>
            </div>
          </div>
          <div className="orbiter-micro-panels">
            <div className="instrument-widget"><span>RADAR ALTIMETER</span><div className="radar-disc"><i /></div><small>GROUND RETURN · NOMINAL</small></div>
            <div className="instrument-widget"><span>MINERAL SCAN</span><div className="mineral-disc"><i /></div><small>HYDRATED SILICA · 0.72</small></div>
            <div className="instrument-widget"><span>ORBIT SOLUTION</span><div className="orbit-sparkline"><svg viewBox="0 0 120 50" aria-hidden="true"><path d="M0 40 14 38 25 15 39 30 50 10 64 28 78 23 91 32 105 12 120 17" /></svg></div><small>ECCENTRICITY · 0.014</small></div>
          </div>
        </article>

        <article className={`mission-vehicle-panel ${mode === "rover" ? "vehicle-selected" : ""}`}>
          <div className="mission-panel-heading">
            <div><span className="eyebrow">SURFACE OPERATIONS / AUTONAV</span><h3>PERSEVERANCE ROVER</h3></div>
            <span className={`mission-state ${mode === "rover" ? "state-live" : ""}`}>{mode !== "rover" ? "○ STANDBY" : autonavActive ? "● AUTONAV" : "● ACTIVE"}</span>
          </div>
          <div className="rover-stage">
            <div className="rover-sky" />
            <div className="rover-ridge ridge-far" />
            <div className="rover-ridge ridge-mid" />
            <div className="rover-terrain" />
            <div className="terrain-grid" />
            <button type="button" className="rover-waypoint-canvas" disabled={mode !== "rover"} aria-label="Set Perseverance rover waypoint. Use arrow keys or WASD to drive." onClick={onSurfaceClick} onKeyDown={handleSurfaceKey} />
            <div className="rover-surface-label surface-label-left">SCANNING · CHEMIN / PATHROCK</div>
            <div className="rover-surface-label surface-label-right">HAZARD AVOIDANCE SENSORS</div>
            <span className="terrain-target" style={{ left: `${target.x}%`, top: `${target.y}%` }}><i /> WAYPOINT</span>
            <div className="rover-marker" style={{ left: `${roverPosition.x}%`, top: `${roverPosition.y}%`, transform: "translate(-50%, -50%)" }}>
              <RoverIllustration className="rover-body" style={{ transform: `rotate(${heading}deg)` }} />
              <span>ROVER CAM · NAVCAM 1</span>
            </div>
            <div className="rover-stage-hud"><span>LOCAL TERRAIN MODEL</span><span>CAM 01 · STEREO</span><span>DRIVE SOL {distance.toFixed(1)} m</span></div>
            <div className="rover-direction-pad">
              <button disabled={mode !== "rover"} onClick={() => driveByHeading(0, 4)} aria-label="Drive rover forward">▲</button>
              <button disabled={mode !== "rover"} onClick={() => driveByHeading(90, 4)} aria-label="Drive rover left">◀</button>
              <button disabled={mode !== "rover"} onClick={() => driveByHeading(180, 4)} aria-label="Drive rover backward">▼</button>
              <button disabled={mode !== "rover"} onClick={() => driveByHeading(270, 4)} aria-label="Drive rover right">▶</button>
            </div>
            {autonavActive && <button type="button" className="rover-autonav-stop" disabled={mode !== "rover"} onClick={stopAutonav}>STOP AUTONAV</button>}
          </div>
          <div className="rover-telemetry">
            <span>ROVER UNIT: PERSEVERANCE <b>/ SOL 284</b></span>
            <div><span>BATTERY <strong>{battery.toFixed(0)}%</strong></span><span>DRIVE DISTANCE <strong>{distance.toFixed(1)} m</strong></span><span>SCIENCE SCANS <strong>{scanCount}</strong></span><span>HEADING <strong>{Math.round(heading)}° {["E", "NE", "N", "NW", "W", "SW", "S", "SE"][Math.round(heading / 45) % 8]}</strong></span></div>
          </div>
          <div className="rover-command-buttons">
            <button disabled={mode !== "rover"} onClick={scan}>⌕ RUN SCIENCE SCAN</button>
            <button disabled={mode !== "rover"} onClick={() => turn(-15)}>↶ TURN −15°</button>
            <button disabled={mode !== "rover"} onClick={() => turn(15)}>↷ TURN +15°</button>
          </div>
        </article>
      </div>

      <div className="mission-ops-lower">
        <section className="ops-lower-panel rover-command-panel">
          <div className="mission-lower-heading"><span className="eyebrow">SAFE COMMAND INTERPRETER</span><span>MAX 30 COMMANDS</span></div>
          <textarea value={script} onChange={(event) => setScript(event.target.value)} spellCheck={false} aria-label="Rover mission command script" />
          <div className="mission-script-actions">
            <button className="script-run" onClick={runScript} disabled={running || mode !== "rover"}>{running ? "SEQUENCE RUNNING…" : "▶ EXECUTE ROVER SEQUENCE"}</button>
            <button onClick={stopScript}>STOP</button>
            <button onClick={() => { stopScript(); setScript("say('Perseverance online')\ndrive(12)\nscan()\nturn(35)\ndrive(8)"); }}>LOAD SAMPLE</button>
          </div>
        </section>
        <section className="ops-lower-panel">
          <div className="mission-lower-heading"><span className="eyebrow">ROVER TRACK MAP</span><span>JEZERO · LOCAL FRAME</span></div>
          <div className="rover-track-map">
            <svg viewBox="0 0 300 105" role="img" aria-label="Rover track from landing site to current position">
              <path className="track-grid-lines" d="M0 20h300M0 45h300M0 70h300M0 95h300M25 0v105m50-105v105m50-105v105m50-105v105m50-105v105m50-105v105" />
              <polyline className="track-route" points={roverTrack.map((point) => `${point.x},${point.y}`).join(" ")} />
              <circle cx="21" cy="75" r="4" className="track-start" />
              <circle cx={mapPoint(roverPosition).x} cy={mapPoint(roverPosition).y} r="5" className="track-current" />
              <text x="12" y="100">OCTAVIA E. BUTLER LANDING</text>
              <text x={mapPoint(roverPosition).x - 28} y={mapPoint(roverPosition).y - 8}>ROVER</text>
            </svg>
          </div>
        </section>
        <section className="ops-lower-panel mission-log-panel">
          <div className="mission-lower-heading"><span className="eyebrow">MISSION EVENT LOG</span><span>DSN · LIVE</span></div>
          <div className="mission-event-log" aria-live="polite">{logs.slice(-5).map((log, index) => <p className={`event-${log.kind}`} key={`${log.text}-${index}`}><i />{log.text}</p>)}</div>
        </section>
      </div>
      <p className="mission-ops-disclaimer">EDUCATIONAL SIMULATION · vehicle motion and telemetry are illustrative and are not live NASA flight data.</p>
    </section>
  );
}
