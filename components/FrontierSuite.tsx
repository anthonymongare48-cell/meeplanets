"use client";

import { useEffect, useRef, useState } from "react";
import { useCosmosStore } from "@/store/useCosmosStore";

type Log = { kind: "ok" | "info" | "error"; text: string };
const commands = ["say", "wait", "thrust", "turn", "scan"] as const;

export function MissionSandbox() {
  const [code, setCode] = useState("say('Probe online')\nscan()\nthrust(2)\nturn(35)\nsay('Trajectory plotted')");
  const [logs, setLogs] = useState<Log[]>([]);
  const [points, setPoints] = useState<number[]>([0]);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | undefined>();
  const stop = () => { if (timer.current) window.clearTimeout(timer.current); setRunning(false); setLogs((l) => [...l, { kind: "info", text: "Execution stopped by operator." }]); };
  const run = () => {
    stop(); setLogs([]); setPoints([0]); setRunning(true);
    const lines = code.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 40);
    let index = 0, position = 0;
    const step = () => {
      if (index >= lines.length) { setRunning(false); setLogs((l) => [...l, { kind: "ok", text: "Mission complete — sandbox released." }]); return; }
      const line = lines[index++]; const match = line.match(/^([a-z]+)\s*\((.*)\)$/i); const name = match?.[1]?.toLowerCase();
      if (!match || !name || !commands.includes(name as typeof commands[number])) setLogs((l) => [...l, { kind: "error", text: `Line ${index}: unsupported command. Allowed: ${commands.join(", ")}` }]);
      else {
        const argument = match[2].replace(/^['"]|['"]$/g, "");
        if (name === "say") setLogs((l) => [...l, { kind: "info", text: `ROVER › ${argument.slice(0, 100)}` }]);
        if (name === "scan") setLogs((l) => [...l, { kind: "ok", text: "SCAN › mineral trace 0.72 / horizon clear" }]);
        if (name === "thrust" || name === "turn") { position += Number.parseFloat(argument) || 1; setPoints((p) => [...p, position]); setLogs((l) => [...l, { kind: "ok", text: `${name.toUpperCase()} › vector updated (${argument})` }]); }
        if (name === "wait") setLogs((l) => [...l, { kind: "info", text: `WAIT › ${argument || "1"} tick` }]);
      }
      timer.current = window.setTimeout(step, name === "wait" ? 600 : 260);
    };
    step();
  };
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return <div className="suite-grid"><section className="suite-card"><span className="eyebrow">SAFE INTERPRETER / JS-LIKE COMMANDS</span><h2>Command sandbox</h2><p className="description">A deliberately tiny interpreter. It never evaluates JavaScript; only say, wait, thrust, turn, and scan are accepted.</p><textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} aria-label="Probe command editor" /><div className="button-row"><button className="button" onClick={run} disabled={running}>RUN SCRIPT <span>▶</span></button><button className="text-button" onClick={stop}>STOP</button><button className="text-button" onClick={() => { stop(); setCode("say('Probe online')\nscan()\nthrust(2)\nturn(35)"); setLogs([]); setPoints([0]); }}>RESET</button></div><div className="console" aria-live="polite">{logs.length ? logs.map((log, i) => <div className={`console-${log.kind}`} key={`${log.text}-${i}`}>{log.text}</div>) : "Console ready — waiting for a mission."}</div></section><section className="suite-card"><span className="eyebrow">LIVE TELEMETRY / TRAJECTORY</span><h2>Flight path</h2><div className="trajectory-map">{points.map((point, i) => <i key={i} style={{ left: `${8 + (i / Math.max(points.length - 1, 1)) * 82}%`, top: `${58 - Math.sin(point / 18) * 28}%` }} />)}<b /></div><div className="mini-stats"><span>WAYPOINTS <strong>{points.length}</strong></span><span>STATUS <strong>{running ? "RUNNING" : "IDLE"}</strong></span></div></section></div>;
}

type Asteroid = { name: string; x: number; y: number; water: number; metal: number };
const asteroids: Asteroid[] = Array.from({ length: 12 }, (_, i) => ({ name: `A-${(i + 1).toString().padStart(2, "0")}`, x: (i * 37 + 9) % 92, y: (i * 61 + 16) % 72, water: 20 + (i * 17) % 80, metal: 30 + (i * 29) % 70 }));
export function MiningExchange() {
  const [company, setCompany] = useState("Helios Prospecting"); const [deployed, setDeployed] = useState<string[]>([]); const [credits, setCredits] = useState(12000); const [ore, setOre] = useState({ water: 120, metal: 80 }); const [prices, setPrices] = useState({ water: 42, metal: 78 }); const [tradeMessage, setTradeMessage] = useState("");
  const portfolio = credits + ore.water * prices.water + ore.metal * prices.metal;
  const deploy = (a: Asteroid) => { if (!deployed.includes(a.name)) { setDeployed([...deployed, a.name]); setOre({ water: ore.water + Math.round(a.water / 5), metal: ore.metal + Math.round(a.metal / 5) }); } };
  const trade = (resource: "water" | "metal", side: "buy" | "sell") => {
    const quantity = 10;
    const total = quantity * prices[resource];
    if (side === "buy") {
      if (credits < total) { setTradeMessage("Not enough credits to buy 10 tonnes."); return; }
      setCredits((current) => current - total);
      setOre((current) => ({ ...current, [resource]: current[resource] + quantity }));
      setTradeMessage(`Bought ${quantity} tonnes of ${resource}.`);
      return;
    }
    if (ore[resource] < quantity) { setTradeMessage(`Not enough ${resource} to sell 10 tonnes.`); return; }
    setOre((current) => ({ ...current, [resource]: current[resource] - quantity }));
    setCredits((current) => current + total);
    setTradeMessage(`Sold ${quantity} tonnes of ${resource}.`);
  };
  return <div className="suite-stack"><section className="suite-card"><div className="split-heading"><div><span className="eyebrow">BELT REGISTRY / DETERMINISTIC SEED 2049</span><h2>Register an operator</h2></div><span className="portfolio-value">PORTFOLIO <strong>₡{portfolio.toLocaleString()}</strong></span></div><div className="form-row"><input value={company} onChange={(e) => setCompany(e.target.value)} aria-label="Company name" /><button className="button" onClick={() => setCompany(company.trim() || "Unnamed Operator")}>REGISTER COMPANY <span>↗</span></button></div><div className="belt-map">{asteroids.map((a) => <button className={`asteroid ${deployed.includes(a.name) ? "deployed" : ""}`} key={a.name} style={{ left: `${a.x}%`, top: `${a.y}%` }} onClick={() => deploy(a)} title={`Deploy extractor to ${a.name}`}>✦<small>{a.name}</small></button>)}</div></section><section className="suite-card"><span className="eyebrow">EXCHANGE / SIMULATION TICK 084</span><h2>Inventory & market</h2><div className="market-grid">{(["water", "metal"] as const).map((r) => <div className="market-item" key={r}><span>{r.toUpperCase()}</span><strong>{ore[r]} t</strong><small>₡{prices[r]} / t</small><div><button className="text-button" onClick={() => trade(r, "buy")}>BUY 10</button><button className="text-button" onClick={() => trade(r, "sell")}>SELL 10</button></div></div>)}</div><p className="description" role="status" aria-live="polite">{tradeMessage || `Extractors deployed: ${deployed.length} / 12 · Credits: ₡${credits.toLocaleString()} · Prices stay fixed until refreshed.`}</p><button className="text-button" onClick={() => { setPrices({ water: 30 + Math.round(Math.random() * 40), metal: 60 + Math.round(Math.random() * 50) }); setTradeMessage("Market prices refreshed."); }}>REFRESH MARKET</button></section></div>;
}

export function Soundscape() {
  const [mode, setMode] = useState<"orbit" | "nebula" | "lander">("orbit");
  const [intensity, setIntensity] = useState(45);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const audio = useRef<AudioContext>();
  const oscillator = useRef<OscillatorNode>();
  const gain = useRef<GainNode>();

  useEffect(() => {
    if (!oscillator.current) return;
    oscillator.current.type = mode === "nebula" ? "sine" : mode === "lander" ? "triangle" : "sawtooth";
    oscillator.current.frequency.setTargetAtTime(mode === "lander" ? 110 : mode === "nebula" ? 174 : 82, audio.current?.currentTime ?? 0, 0.08);
  }, [mode]);

  useEffect(() => {
    if (gain.current) gain.current.gain.setTargetAtTime(intensity / 1000, audio.current?.currentTime ?? 0, 0.05);
  }, [intensity]);

  useEffect(() => () => {
    oscillator.current?.stop();
    void audio.current?.close();
  }, []);

  const toggle = () => {
    if (playing) {
      oscillator.current?.stop();
      void audio.current?.close();
      oscillator.current = undefined;
      audio.current = undefined;
      gain.current = undefined;
      setPlaying(false);
      return;
    }
    try {
      const context = new AudioContext();
      const node = context.createOscillator();
      const volume = context.createGain();
      node.type = mode === "nebula" ? "sine" : mode === "lander" ? "triangle" : "sawtooth";
      node.frequency.value = mode === "lander" ? 110 : mode === "nebula" ? 174 : 82;
      volume.gain.value = intensity / 1000;
      node.connect(volume).connect(context.destination);
      node.start();
      audio.current = context;
      oscillator.current = node;
      gain.current = volume;
      setAudioError("");
      setPlaying(true);
    } catch {
      setAudioError("Audio could not start. Check browser audio permissions and try again.");
    }
  };

  return <section className="soundscape-panel suite-card"><span className="eyebrow">GENERATIVE AUDIO / LOCAL WEB AUDIO</span><h2>Cosmic soundscape</h2><p className="description">A small, offline tone engine. Change the mode to retune the oscillator; no audio leaves this device.</p><div className="mode-row">{(["orbit", "nebula", "lander"] as const).map((m) => <button className={`text-button ${mode === m ? "active" : ""}`} onClick={() => setMode(m)} key={m}>{m.toUpperCase()}</button>)}</div><label>INTENSITY <output>{intensity}%</output><input type="range" min="5" max="90" value={intensity} onChange={(e) => setIntensity(+e.target.value)} /></label><button className="button" onClick={toggle}>{playing ? "PAUSE RESONANCE" : "START RESONANCE"} <span>{playing ? "Ⅱ" : "▶"}</span></button>{audioError && <p role="alert" className="description">{audioError}</p>}<div className={`sound-wave ${playing ? "is-playing" : ""}`}><i /><i /><i /><i /><i /><i /><i /></div></section>;
}

type HardwareProfile = { blur: boolean; effects: boolean; cap: 30 | 60 | 120; battery: boolean };
const defaultHardwareProfile: HardwareProfile = { blur: true, effects: true, cap: 60, battery: false };
function isHardwareProfile(value: unknown): value is HardwareProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return typeof profile.blur === "boolean" && typeof profile.effects === "boolean" && typeof profile.battery === "boolean" && (profile.cap === 30 || profile.cap === 60 || profile.cap === 120);
}

export function HardwareSettings() {
  const [settings, setSettings] = useState(defaultHardwareProfile);
  const [storageMessage, setStorageMessage] = useState("");
  const setLowPowerMode = useCosmosStore((state) => state.setLowPowerMode);
  const setSimulationFrameCap = useCosmosStore((state) => state.setSimulationFrameCap);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cosmos-hardware");
      if (saved) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(saved);
        } catch (error) {
          if (!(error instanceof SyntaxError)) throw error;
          setStorageMessage("Saved preferences were unreadable; defaults are active.");
          parsed = null;
        }
        if (parsed !== null) {
          if (isHardwareProfile(parsed)) setSettings(parsed);
          else setStorageMessage("Saved preferences were invalid; defaults are active.");
        }
      }
    } catch {
      setStorageMessage("Browser storage is unavailable; preferences apply for this visit only.");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.cosmosBlur = settings.blur ? "on" : "off";
    document.documentElement.dataset.cosmosEffects = settings.effects ? "on" : "off";
    setLowPowerMode(settings.battery);
    setSimulationFrameCap(settings.cap);
  }, [settings, setLowPowerMode, setSimulationFrameCap]);

  const update = (patch: Partial<HardwareProfile>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      window.localStorage.setItem("cosmos-hardware", JSON.stringify(next));
      setStorageMessage("Preferences saved in this browser.");
    } catch {
      setStorageMessage("Could not save preferences; changes apply until you leave this page.");
    }
  };

  return <section className="suite-card settings-panel"><span className="eyebrow">DEVICE PROFILE / PERSISTED LOCALLY</span><h2>Hardware-conscious settings</h2><p className="description">Adjust interface blur, decorative motion, simulator update rate, and low-power mode. Preferences are saved in this browser.</p><label className="setting-line">Atmospheric blur<input type="checkbox" checked={settings.blur} onChange={(event) => update({ blur: event.target.checked })} /></label><label className="setting-line">Decorative effects<input type="checkbox" checked={settings.effects} onChange={(event) => update({ effects: event.target.checked })} /></label><label className="setting-line">Simulator frame cap<select value={settings.cap} onChange={(event) => update({ cap: Number(event.target.value) as HardwareProfile["cap"] })}><option value={30}>30 FPS</option><option value={60}>60 FPS</option><option value={120}>120 FPS</option></select></label><label className="setting-line">Battery / performance mode<input type="checkbox" checked={settings.battery} onChange={(event) => update({ battery: event.target.checked })} /></label><p className="description" role="status" aria-live="polite">{storageMessage}</p></section>;
}

const segments = [{ title: "Departure", text: "Mara: The airlock is green. We leave the familiar behind.\nIvo: Then let the instruments tell us what stories the dark has kept." }, { title: "The singing rocks", text: "Ivo: Listen — the dust rings are ringing against the hull.\nMara: A rhythm from a world without oceans. Record everything." }, { title: "Return signal", text: "Mara: Home is a blue point, but it is not small.\nIvo: Every expedition redraws the map inside us." }];
export function AudioExpedition() {
  const [segment, setSegment] = useState(0); const [playing, setPlaying] = useState(false); const current = segments[segment];
  useEffect(() => {
    if (!playing) { window.speechSynthesis?.cancel(); return; }
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const lines = current.text.split("\n");
    lines.forEach((line, i) => { const utterance = new SpeechSynthesisUtterance(line.replace(/^[^:]+:\s*/, "")); utterance.voice = voices[i % Math.max(voices.length, 1)]; utterance.rate = i ? .92 : 1; window.speechSynthesis?.speak(utterance); });
    const id = window.setTimeout(() => setSegment((s) => s < segments.length - 1 ? s + 1 : 0), 6000);
    return () => { window.clearTimeout(id); window.speechSynthesis?.cancel(); };
  }, [playing, segment, current.text]);
  return <section className="suite-card expedition"><span className="eyebrow">SCRIPTED FIELD RECORDING / 02 VOICES</span><h2>Beyond the quiet</h2><div className="voice-grid"><div><span className="voice-label">MARA / PILOT</span><p>{current.text.split("\n")[0]}</p></div><div><span className="voice-label">IVO / GEOLOGIST</span><p>{current.text.split("\n")[1]}</p></div></div><div className="transcript transcript-large"><strong>{current.title}</strong><br />{current.text}</div><div className="button-row"><button className="button" onClick={() => setPlaying(!playing)}>{playing ? "PAUSE" : "PLAY EXPEDITION"} <span>{playing ? "Ⅱ" : "▶"}</span></button>{segments.map((s, i) => <button className={`text-button ${i === segment ? "active" : ""}`} onClick={() => setSegment(i)} key={s.title}>{String(i + 1).padStart(2, "0")} / {s.title}</button>)}</div></section>;
}
