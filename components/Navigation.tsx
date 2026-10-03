"use client";

import Link from "next/link";
import { useState } from "react";
import { AudioToggle } from "./AudioToggle";

const primary = [
  ["/", "EXPLORE"],
  ["/simulations", "SIMULATIONS"],
  ["/planets/earth", "PLANETS"],
  ["/matrix", "MATRIX"],
  ["/deep-space", "DEEP SPACE"],
  ["/galaxy", "Milky Way"],
  ["/astrometry", "ASTROMETRY"],
  ["/advanced-observatory", "ADVANCED"],
];

const tools = [
  ["/galaxy", "Milky Way Galaxy"],
  ["/sun", "Sun"],
  ["/moon", "Moon"],
  ["/observatory", "Observatory"],
  ["/learning-lab", "Learning Lab"],
  ["/interactive-physics", "Physics Lab"],
  ["/astrometry", "Astrometry Lab"],
  ["/catalog", "Small Bodies Catalog"],
  ["/advanced-observatory", "Advanced Observatory"],
  ["/mission-control", "Mission Control"],
  ["/mining-exchange", "Mining Exchange"],
  ["/cultural-history", "Cultural History"],
  ["/soundscape", "Soundscape"],
  ["/audio-expedition", "Audio Expedition"],
  ["/quiz", "Astronomy Quiz"],
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return <header className="nav">
    <Link href="/" className="brand" onClick={close}><span className="brand-mark">✦</span> theplanets<span className="brand-sub">/ EXPLORER</span></Link>
    <nav className="primary-nav" aria-label="Primary navigation">{primary.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <div className="nav-actions">
      <AudioToggle />
      <button className="menu-button" aria-expanded={open} aria-controls="cosmos-menu" onClick={() => setOpen((value) => !value)}>{open ? "CLOSE" : "MENU"} <span aria-hidden="true">{open ? "×" : "☰"}</span></button>
    </div>
    {open && <div className="nav-menu" id="cosmos-menu">
      <div className="nav-menu-grid">
        <div><span className="eyebrow">QUICK ACCESS</span>{primary.slice(0, 4).map(([href, label]) => <Link href={href} onClick={close} key={href}>{label}<span>↗</span></Link>)}</div>
        <div><span className="eyebrow">TOOLS & DISCOVERY</span>{tools.map(([href, label]) => <Link href={href} onClick={close} key={href}>{label}<span>↗</span></Link>)}</div>
        <div><span className="eyebrow">APP</span><Link href="/settings" onClick={close}>Settings<span>↗</span></Link><Link href="/creator" onClick={close}>Creator & contact<span>↗</span></Link></div>
      </div>
    </div>}
  </header>;
}
