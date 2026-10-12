"use client";

import { useState } from "react";
import Link from "next/link";
import type { Planet } from "@/lib/planets";
import { planets } from "@/lib/planets";
import { planetInteriorProfiles } from "@/lib/planet-interiors";

type View = "interior" | "atmosphere" | "weather";

const views: { id: View; label: string }[] = [
  { id: "interior", label: "INTERIOR" },
  { id: "atmosphere", label: "ATMOSPHERE" },
  { id: "weather", label: "WEATHER" },
];

export function PlanetInteriorExplorer({ planet }: { planet: Planet }) {
  const [selectedPlanetId, setSelectedPlanetId] = useState(planet.id);
  const [view, setView] = useState<View>("interior");
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const selectedPlanet = planets.find((item) => item.id === selectedPlanetId) ?? planet;
  const profile = planetInteriorProfiles[selectedPlanet.id];
  const selectedLayer = profile.layers.find((layer) => layer.id === selectedLayerId) ?? profile.layers[0];

  const changePlanet = (id: string) => {
    setSelectedPlanetId(id);
    setSelectedLayerId(null);
  };

  return (
    <section className="interior-explorer" aria-labelledby="interior-explorer-title" style={{ "--interior-accent": selectedPlanet.accent } as React.CSSProperties}>
      <header className="interior-explorer-heading">
        <div>
          <span className="eyebrow">PLANETARY CROSS-SECTION / INTERACTIVE MODEL</span>
          <h2 id="interior-explorer-title">Inside a world</h2>
          <p>Trace each planet from its outer atmosphere to its deepest interior.</p>
        </div>
        <span className={`interior-surface-status ${profile.surfaceType === "no solid surface" ? "fluid" : ""}`}>
          <i />{profile.surfaceType === "no solid surface" ? "NO SOLID SURFACE" : "ROCKY SURFACE"}
        </span>
      </header>

      <div className="interior-planet-picker" role="group" aria-label="Choose a planet for the cross-section">
        {planets.map((item) => (
          <button
            key={item.id}
            className={item.id === selectedPlanet.id ? "active" : ""}
            onClick={() => changePlanet(item.id)}
            aria-pressed={item.id === selectedPlanet.id}
            style={{ "--planet-accent": item.accent } as React.CSSProperties}
          >
            <i />{item.name}
          </button>
        ))}
      </div>

      <div className="interior-view-tabs" role="tablist" aria-label="Cross-section data view">
        {views.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={view === item.id}
            className={view === item.id ? "active" : ""}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "interior" && (
        <div className={`interior-explorer-content ${profile.surfaceType === "no solid surface" ? "giant" : ""}`} role="tabpanel">
          <div className="interior-visual-column">
            <div className="interior-cross-section" role="img" aria-label={`Illustrative cross-section of ${selectedPlanet.name}, with ${profile.layers.map((layer) => layer.name).join(", ")}`}>
              <div className="interior-cross-glow" />
              {profile.layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`cross-layer ${selectedLayer.id === layer.id ? "selected" : ""}`}
                  style={{
                    "--layer-radius": `${layer.radius}%`,
                    "--layer-color": layer.color,
                    "--layer-order": index,
                  } as React.CSSProperties}
                  aria-hidden="true"
                />
              ))}
              <span className="cross-section-center-mark">CORE</span>
              <span className="cross-section-scale">NOT TO SCALE</span>
            </div>
            <p className="interior-visual-caption">
              <span className="status-pulse" />{profile.surfaceType === "no solid surface" ? "Atmosphere transitions into high-pressure fluid layers" : "Rocky layers shown from surface to center"}
            </p>
          </div>

          <div className="interior-layer-details">
            <div className="interior-layer-list" role="group" aria-label={`${selectedPlanet.name} interior layers`}>
              {profile.layers.map((layer, index) => (
                <button
                  key={layer.id}
                  className={`interior-layer-option ${selectedLayer.id === layer.id ? "active" : ""}`}
                  onClick={() => setSelectedLayerId(layer.id)}
                  aria-pressed={selectedLayer.id === layer.id}
                  style={{ "--layer-color": layer.color } as React.CSSProperties}
                >
                  <span className="layer-index">0{index + 1}</span>
                  <span className="layer-name">{layer.name}</span>
                  <span className="layer-arrow">↗</span>
                </button>
              ))}
            </div>
            <article className="interior-layer-note" aria-live="polite">
              <span className="eyebrow">SELECTED LAYER / {selectedLayer.id.toUpperCase()}</span>
              <h3>{selectedLayer.name}</h3>
              <p>{selectedLayer.detail}</p>
              {profile.surfaceType === "no solid surface" && (
                <p className="interior-science-note">The giant planets have no defined solid ground: pressure and temperature increase continuously into dense fluid interiors.</p>
              )}
            </article>
          </div>
        </div>
      )}

      {view === "atmosphere" && (
        <div className="atmosphere-explorer-content" role="tabpanel">
          <div className="atmosphere-visual" aria-hidden="true">
            <span className="atmosphere-horizon" />
            <span className="atmosphere-cloud atmosphere-cloud-one" />
            <span className="atmosphere-cloud atmosphere-cloud-two" />
            <span className="atmosphere-label">UPPER CLOUD LAYERS</span>
            <span className="atmosphere-depth">DEPTH ↓</span>
          </div>
          <div className="atmosphere-data">
            <span className="eyebrow">ATMOSPHERIC PROFILE / {selectedPlanet.name}</span>
            <h3>{profile.atmosphere.summary}</h3>
            <div className="atmosphere-composition">
              {profile.atmosphere.components.map((component) => (
                <div className="gas-row" key={component.name}>
                  <div className="gas-row-label"><span>{component.name}</span><strong>{component.amount}</strong></div>
                  <div className="gas-meter" role="meter" aria-label={`${component.name} relative abundance`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={component.proportion}>
                    <span style={{ width: `${component.proportion}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="atmosphere-cloud-note">{profile.atmosphere.cloudNote}</p>
          </div>
        </div>
      )}

      {view === "weather" && (
        <div className={`weather-explorer-content weather-${selectedPlanet.id}`} role="tabpanel">
          <div className="weather-visual" aria-hidden="true">
            <div className="weather-orb">
              <span className="weather-band weather-band-one" />
              <span className="weather-band weather-band-two" />
              <span className="weather-storm" />
            </div>
            <span className="weather-grid-lines" />
            <span className="weather-visual-label">ATMOSPHERIC DYNAMICS</span>
          </div>
          <div className="weather-data">
            <span className="eyebrow">WEATHER SYSTEM / {selectedPlanet.name}</span>
            <strong className="weather-temperature">{profile.weather.temperature}</strong>
            <h3>{profile.weather.headline}</h3>
            <p>{profile.weather.detail}</p>
            <Link href={`/planets/${selectedPlanet.id}`} className="interior-more-link">OPEN {selectedPlanet.name} TELEMETRY ↗</Link>
          </div>
        </div>
      )}
      <p className="interior-explorer-caveat">Illustrative visualization. Planetary layer boundaries are simplified; interiors are inferred from observations and scientific models.</p>
    </section>
  );
}
