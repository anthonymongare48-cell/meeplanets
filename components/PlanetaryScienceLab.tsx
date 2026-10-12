"use client";

import { useState } from "react";

type LabTab = "interiors" | "clouds" | "magnetic" | "spectroscopy" | "oddities" | "ocean-worlds";

const tabs: { id: LabTab; label: string }[] = [
  { id: "interiors", label: "DEEP INTERIORS" },
  { id: "clouds", label: "CLOUD DECKS" },
  { id: "magnetic", label: "MAGNETIC SHIELDS" },
  { id: "spectroscopy", label: "SPECTROSCOPY" },
  { id: "oddities", label: "ODD WORLDS" },
  { id: "ocean-worlds", label: "OCEAN WORLDS" },
];

const engines = [
  {
    id: "jupiter",
    name: "JUPITER",
    label: "Metallic hydrogen dynamo",
    detail: "Deep pressure turns hydrogen into an electrically conducting fluid. Convection and Jupiter’s rapid rotation power a dynamo that generates the strongest planetary magnetic field in the solar system.",
    layers: ["Ammonia-rich clouds", "Molecular hydrogen", "Liquid metallic hydrogen", "Diffuse heavy-element core"],
    note: "The core may be partly diluted rather than a sharply bounded solid sphere.",
  },
  {
    id: "saturn",
    name: "SATURN",
    label: "Helium rain",
    detail: "At depth, helium can separate from hydrogen and fall inward as droplets through the metallic-hydrogen region. This gravitational settling releases energy and helps explain Saturn’s excess internal heat.",
    layers: ["Ammonia cloud tops", "Hydrogen and helium", "Metallic hydrogen + helium droplets", "Rock, ice, and heavy elements"],
    note: "Helium phase separation is a leading explanation for Saturn’s excess heat; the process is inferred from models and observations.",
  },
  {
    id: "uranus",
    name: "URANUS",
    label: "Superionic ice-giant mantle",
    detail: "Models predict that the hot, compressed water-rich mantle may host superionic water: oxygen atoms occupy a lattice while hydrogen ions move through it. This is a high-pressure fluid, not familiar surface ice.",
    layers: ["Methane-bearing atmosphere", "Water and ammonia-rich fluid", "Possible superionic water", "Rock-rich interior"],
    note: "Superionic water is a laboratory-supported high-pressure phase; its exact abundance and structure inside Uranus remain uncertain.",
  },
  {
    id: "neptune",
    name: "NEPTUNE",
    label: "Carbon under pressure",
    detail: "Experiments and models suggest extreme pressures can break methane apart. Carbon may crystallize and sink through the deep mantle, a process often described as diamond rain.",
    layers: ["Methane-ice cloud tops", "Hydrogen and helium", "Water, ammonia, and methane fluid", "Dense rocky interior"],
    note: "Diamond precipitation is a proposed deep-interior process, not directly observed inside Neptune.",
  },
];

const cloudProfiles = [
  {
    id: "jupiter",
    name: "JUPITER",
    note: "A conceptual three-deck model: cloud altitudes overlap and vary with latitude, storms, and local conditions.",
    layers: [
      { name: "Ammonia ice", altitude: "Upper deck", color: "#f4ead3", detail: "Bright ammonia-ice clouds form the visible upper deck." },
      { name: "Ammonium hydrosulfide", altitude: "Middle deck", color: "#bd8256", detail: "A deeper chemical cloud layer contributes to the complex colors and chemistry of the banded atmosphere." },
      { name: "Water clouds", altitude: "Deep deck", color: "#54738d", detail: "Deep water clouds and moist convection fuel powerful thunderstorms and lightning." },
    ],
  },
  {
    id: "saturn",
    name: "SATURN",
    note: "Cloud decks are schematic; their depth and composition vary across Saturn’s atmosphere.",
    layers: [
      { name: "Ammonia ice", altitude: "Upper deck", color: "#efe1c1", detail: "Pale ammonia clouds and photochemical haze form the visible cloud tops." },
      { name: "Ammonium hydrosulfide", altitude: "Middle deck", color: "#bd9564", detail: "A deeper cloud layer expected from the pressure-temperature profile." },
      { name: "Water clouds", altitude: "Deep deck", color: "#647d93", detail: "Deep water clouds are associated with energetic convection and storms." },
    ],
  },
  {
    id: "venus",
    name: "VENUS",
    note: "Venus’s global sulfuric-acid cloud system is often described in upper, middle, and lower cloud regions.",
    layers: [
      { name: "Upper haze", altitude: "≈ 65–70 km", color: "#e9d4aa", detail: "A thin upper haze sits above the main cloud deck." },
      { name: "Sulfuric-acid clouds", altitude: "≈ 50–65 km", color: "#d7b37d", detail: "The thick, reflective main clouds consist primarily of sulfuric-acid droplets." },
      { name: "Lower cloud / haze", altitude: "≈ 47–50 km", color: "#a77e56", detail: "A lower haze and cloud region sits over a hot, dense carbon-dioxide atmosphere." },
    ],
  },
  {
    id: "earth",
    name: "EARTH",
    note: "The troposphere contains most weather; the ozone-rich stratosphere warms with altitude and limits vertical mixing.",
    layers: [
      { name: "Stratosphere · ozone", altitude: "≈ 12–50 km", color: "#a77de0", detail: "Ozone absorbs ultraviolet sunlight, warming the stratosphere with increasing altitude and forming a stable layer above most weather." },
      { name: "Troposphere · weather", altitude: "Surface–≈ 12 km", color: "#54a6ce", detail: "Water clouds, convection, rain, snow, and most familiar weather occur in this lowest layer." },
      { name: "Surface boundary layer", altitude: "Lowest atmosphere", color: "#63a675", detail: "The ground and ocean exchange heat and moisture with the air above." },
    ],
  },
];

const spectralMethods = [
  {
    id: "transit",
    label: "TRANSIT",
    target: "Exoplanets",
    detail: "Compare a star’s spectrum outside transit with its spectrum while a planet crosses the star. Starlight filtered through the planet’s atmospheric limb carries absorption features from its gases.",
    molecules: ["Water vapor", "Sodium", "Carbon dioxide"],
    lines: [23, 68, 34, 88, 28, 60, 94, 38, 76, 31, 55, 91, 25, 72, 43, 84, 33, 62, 96, 36, 74, 28, 57, 87],
  },
  {
    id: "reflectance",
    label: "REFLECTANCE",
    target: "Solar-system planets",
    detail: "Measure sunlight reflected by a planet. Atmospheric gases and cloud particles remove or redirect specific wavelengths, leaving absorption bands in the reflected spectrum.",
    molecules: ["Methane", "Oxygen", "Carbon dioxide"],
    lines: [76, 38, 91, 27, 62, 35, 85, 43, 70, 30, 95, 42, 66, 24, 88, 52, 78, 32, 93, 46, 68, 27, 82, 38],
  },
  {
    id: "thermal",
    label: "THERMAL EMISSION",
    target: "Infrared observations",
    detail: "Planets emit infrared light from their own heat. Molecular absorption and emission features help identify gases and probe temperature layers without relying on reflected sunlight.",
    molecules: ["Water", "Carbon monoxide", "Methane"],
    lines: [36, 83, 41, 96, 29, 67, 44, 88, 33, 76, 39, 92, 26, 64, 48, 85, 35, 72, 42, 98, 30, 61, 46, 89],
  },
];

const phenomena = [
  { title: "VENUS SPINS BACKWARD", category: "ROTATION", detail: "Venus rotates retrograde, so its Sun would rise in the west. One sidereal rotation takes about 243 Earth days—longer than its 225-day orbit." },
  { title: "URANUS ROLLS SIDEWAYS", category: "AXIAL TILT", detail: "Its axis is tilted about 98°. Each pole experiences decades of near-continuous daylight followed by decades of darkness." },
  { title: "MERCURY’S 3:2 RESONANCE", category: "ORBIT", detail: "Mercury rotates three times for every two trips around the Sun, a spin-orbit resonance shaped by solar tides." },
  { title: "RINGS BEYOND SATURN", category: "RINGS", detail: "Jupiter, Saturn, Uranus, and Neptune all have rings. Jupiter’s are dusty and faint; Saturn’s are bright and ice-rich; the ice giants’ rings are dark, with arcs at Neptune." },
  { title: "HOT JUPITERS", category: "EXOPLANETS", detail: "These gas giants orbit close to their stars, sometimes completing a year in only a few Earth days. Intense irradiation can heat and inflate their atmospheres." },
  { title: "SUPER-EARTHS", category: "EXOPLANETS", detail: "Planets more massive than Earth but lighter than Neptune. The category describes size, not whether a planet is rocky, ocean-covered, or habitable." },
  { title: "ROGUE PLANETS", category: "EXOPLANETS", detail: "Worlds that travel through interstellar space without a bound host star, possibly formed alone or ejected from their original systems." },
];

const oceanWorlds = [
  {
    id: "europa",
    name: "EUROPA",
    host: "JUPITER",
    title: "An ocean beneath fractured ice",
    detail: "Europa’s fractured icy shell covers a global salty ocean. Tidal flexing supplies heat, and a rocky seafloor may provide chemical energy; whether conditions support life is unknown.",
    ocean: "Global salty ocean",
    mission: "NASA’s Europa Clipper launched in 2024 and is expected to reach Jupiter in 2030 for repeated Europa flybys.",
    color: "#b9c8cf",
  },
  {
    id: "enceladus",
    name: "ENCELADUS",
    host: "SATURN",
    title: "Ocean spray from tiger stripes",
    detail: "Water-rich plumes erupt from fractures near the south pole. Cassini sampled these jets, detecting salts and organic compounds that point to active ocean chemistry.",
    ocean: "Global subsurface ocean",
    mission: "Cassini flew through Enceladus’s plumes, giving scientists direct samples of material originating from its ocean.",
    color: "#c7dbe2",
  },
  {
    id: "titan",
    name: "TITAN",
    host: "SATURN",
    title: "A methane-weather world",
    detail: "Titan has a thick nitrogen atmosphere, methane clouds, rain, rivers, and lakes. Beneath its water-ice crust, evidence points to a deep internal water ocean.",
    ocean: "Inferred deep water ocean",
    mission: "NASA’s Dragonfly rotorcraft is planned to explore Titan’s surface; its launch and arrival schedule remains subject to mission updates.",
    color: "#d9a25f",
  },
];

function AtmosphereStack({ layers }: { layers: { name: string; altitude: string; color: string; detail: string }[] }) {
  const [activeLayer, setActiveLayer] = useState(0);
  const selected = layers[activeLayer];
  return (
    <div className="science-cloud-model">
      <div className="science-cloud-stack" aria-label={`Layered atmosphere with ${layers.map((layer) => layer.name).join(", ")}`}>
        {layers.map((layer, realIndex) => {
          return (
            <button
              key={layer.name}
              className={`science-cloud-layer ${realIndex === activeLayer ? "active" : ""}`}
              style={{ "--cloud-color": layer.color } as React.CSSProperties}
              onClick={() => setActiveLayer(realIndex)}
              aria-pressed={realIndex === activeLayer}
            >
              <span>{layer.name}</span><small>{layer.altitude}</small>
            </button>
          );
        })}
        <span className="science-ground-line">PLANET / LOWER ATMOSPHERE</span>
      </div>
      <article className="science-cloud-detail" aria-live="polite">
        <span className="eyebrow">SELECTED CLOUD DECK</span>
        <h4>{selected.name}</h4>
        <p>{selected.detail}</p>
      </article>
    </div>
  );
}

export function PlanetaryScienceLab() {
  const [tab, setTab] = useState<LabTab>("interiors");
  const [engineId, setEngineId] = useState("jupiter");
  const [cloudId, setCloudId] = useState("jupiter");
  const [spectralId, setSpectralId] = useState("transit");
  const [phenomenonIndex, setPhenomenonIndex] = useState(0);
  const [oceanId, setOceanId] = useState("europa");
  const [solarWindOn, setSolarWindOn] = useState(true);
  const engine = engines.find((item) => item.id === engineId) ?? engines[0];
  const cloud = cloudProfiles.find((item) => item.id === cloudId) ?? cloudProfiles[0];
  const spectral = spectralMethods.find((item) => item.id === spectralId) ?? spectralMethods[0];
  const ocean = oceanWorlds.find((item) => item.id === oceanId) ?? oceanWorlds[0];
  const phenomenon = phenomena[phenomenonIndex];

  return (
    <section className="planetary-science-lab" aria-labelledby="planetary-science-title">
      <header className="planetary-science-heading">
        <span className="eyebrow">FIELD NOTES / PLANETARY PHYSICS</span>
        <h2 id="planetary-science-title">Worlds in motion</h2>
        <p>Explore the hidden engines, layered skies, and remote fingerprints that shape planetary worlds.</p>
      </header>

      <div className="science-lab-tabs" role="tablist" aria-label="Planetary science topics">
        {tabs.map((item) => (
          <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === "interiors" && (
        <div className="science-lab-panel" role="tabpanel">
          <div className="science-topic-copy">
            <span className="eyebrow">THE ENGINE BENEATH / {engine.name}</span>
            <h3>{engine.label}</h3>
            <p>{engine.detail}</p>
            <p className="science-caveat">{engine.note}</p>
            <div className="science-fact-chip">{engine.id === "jupiter" ? "STRONGEST PLANETARY MAGNETIC FIELD" : engine.id === "saturn" ? "EXCESS INTERNAL HEAT" : "EXTREME-PRESSURE PHASES"}</div>
          </div>
          <div className="science-planet-model" style={{ "--science-accent": engine.id === "jupiter" ? "#d9a677" : engine.id === "saturn" ? "#c6aa7c" : engine.id === "uranus" ? "#76cad0" : "#537ad6" } as React.CSSProperties}>
            <div className="science-pressure-rings" role="img" aria-label={`${engine.name} interior layers from cloud tops to core`}>
                {engine.layers.map((layer, index) => <div key={layer} className={`science-pressure-layer ${index === engine.layers.length - 1 ? "core" : ""}`} style={{ "--pressure-index": index } as React.CSSProperties}><span>{layer}</span></div>)}
            </div>
            <span className="science-pressure-arrow">PRESSURE INCREASES INWARD ↓</span>
          </div>
          <div className="science-choice-row">
            <span>SELECT AN INTERIOR</span>
            {engines.map((item) => <button key={item.id} className={engine.id === item.id ? "active" : ""} onClick={() => setEngineId(item.id)}>{item.name}</button>)}
          </div>
        </div>
      )}

      {tab === "clouds" && (
        <div className="science-lab-panel" role="tabpanel">
          <div className="science-topic-copy">
            <span className="eyebrow">ANATOMY OF A SKY / {cloud.name}</span>
            <h3>Clouds form in chemical decks</h3>
            <p>{cloud.note}</p>
            {cloud.id === "venus" && <p>Venus’s atmosphere super-rotates: cloud-level winds near 360 km/h circle the planet roughly 60 times faster than its slow surface rotation.</p>}
            {cloud.id === "earth" && <p>Unlike the convecting troposphere below, ozone absorbs ultraviolet radiation in the stratosphere and causes temperatures to rise with altitude.</p>}
          </div>
          <AtmosphereStack key={cloud.id} layers={cloud.layers} />
          <div className="science-choice-row">
            <span>CHOOSE A SKY</span>
            {cloudProfiles.map((item) => <button key={item.id} className={cloud.id === item.id ? "active" : ""} onClick={() => setCloudId(item.id)}>{item.name}</button>)}
          </div>
        </div>
      )}

      {tab === "magnetic" && (
        <div className="science-lab-panel" role="tabpanel">
          <div className="science-topic-copy">
            <span className="eyebrow">ATMOSPHERIC SURVIVAL / {solarWindOn ? "SOLAR WIND ON" : "SOLAR WIND PAUSED"}</span>
            <h3>{solarWindOn ? "A field can deflect charged particles" : "Without a global shield, particles reach the upper air"}</h3>
            <p>Earth’s liquid iron-nickel outer core powers a geodynamo. The magnetosphere diverts much of the solar wind around Earth, though some particles enter near the poles.</p>
            <p>Mars lost its global dynamo early in its history. Solar-wind escape helped erode its atmosphere over time, alongside other loss processes.</p>
            <button className="science-action" onClick={() => setSolarWindOn((value) => !value)}>{solarWindOn ? "PAUSE SOLAR WIND" : "RESTORE SOLAR WIND"} ↗</button>
          </div>
          <div className={`magnetosphere-diagram ${solarWindOn ? "wind-active" : "wind-paused"}`} aria-label={solarWindOn ? "Solar wind deflected by Earth's magnetosphere" : "Solar wind reaching an unshielded atmosphere"}>
            <span className="solar-wind-label">SOLAR WIND</span>
            <div className="solar-wind-particles"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="magnetosphere-field field-one" /><div className="magnetosphere-field field-two" /><div className="magnetosphere-field field-three" />
            <div className="magnetosphere-planet"><span /></div>
            <span className="magnetic-status">{solarWindOn ? "GEODYNAMO / ACTIVE" : "FIELD / WEAKENED"}</span>
            <span className="mars-comparison">MARS LOST ITS GLOBAL DYNAMO EARLY IN ITS HISTORY</span>
          </div>
        </div>
      )}

      {tab === "spectroscopy" && (
        <div className="science-lab-panel" role="tabpanel">
          <div className="science-topic-copy">
            <span className="eyebrow">READING LIGHT / {spectral.target.toUpperCase()}</span>
            <h3>Every gas leaves a spectral fingerprint</h3>
            <p>{spectral.detail}</p>
            <p className="science-caveat">Absorption lines appear as dips in a measured spectrum; hot gas can also produce emission lines. Real observations require calibration and careful separation of the star, planet, and instrument signals.</p>
            <div className="science-tool-tags"><span>VLT · GROUND TELESCOPES</span><span>JWST · INFRARED</span></div>
          </div>
          <div className="spectral-instrument">
            <div className="spectral-toolbar"><span>SIMULATED SPECTRUM</span><span>VISIBLE → INFRARED</span></div>
            <div className="spectrum-display" role="img" aria-label={`Illustrative absorption spectrum showing lines for ${spectral.molecules.join(", ")}`}>
              <div className="spectrum-line" />
              {spectral.lines.map((height, index) => <i key={index} style={{ "--spectrum-height": `${height}%`, "--spectrum-index": index } as React.CSSProperties} />)}
            </div>
            <div className="spectrum-scale"><span>SHORTER λ</span><span>WAVELENGTH</span><span>LONGER λ</span></div>
            <div className="spectral-molecules">
              {spectral.molecules.map((molecule, index) => <span key={molecule}><i style={{ "--molecule-color": ["#ee8963", "#75c5d2", "#b99ae8"][index] } as React.CSSProperties} />{molecule}</span>)}
            </div>
            <div className="science-choice-row">
              {spectralMethods.map((item) => <button key={item.id} className={spectral.id === item.id ? "active" : ""} onClick={() => setSpectralId(item.id)}>{item.label}</button>)}
            </div>
          </div>
        </div>
      )}

      {tab === "oddities" && (
        <div className="phenomena-explorer" role="tabpanel">
          <div className="phenomena-index" role="group" aria-label="Select a planetary phenomenon">
            {phenomena.map((item, index) => (
              <button key={item.title} className={index === phenomenonIndex ? "active" : ""} onClick={() => setPhenomenonIndex(index)} aria-pressed={index === phenomenonIndex}>
                <span>0{index + 1}</span><strong>{item.title}</strong><small>{item.category}</small>
              </button>
            ))}
          </div>
          <article className="phenomenon-detail" aria-live="polite">
            <span className="eyebrow">PLANETARY ANOMALY / {phenomenon.category}</span>
            <h3>{phenomenon.title}</h3>
            <p>{phenomenon.detail}</p>
            <div className="phenomenon-orbit" aria-hidden="true"><i /><b /><span /></div>
          </article>
        </div>
      )}

      {tab === "ocean-worlds" && (
        <div className="science-lab-panel ocean-world-panel" role="tabpanel">
          <div className="ocean-world-visual" style={{ "--moon-accent": ocean.color } as React.CSSProperties}>
            <div className={`ocean-moon moon-${ocean.id}`}><span className="ocean-crust" /><span className="ocean-layer" /><span className="ocean-rock" /></div>
            <div className="tidal-pull tidal-left" /><div className="tidal-pull tidal-right" />
            <span className="tidal-caption">ORBITAL TIDAL FLEXING → INTERNAL HEAT</span>
          </div>
          <div className="science-topic-copy">
            <span className="eyebrow">OCEAN WORLD / {ocean.name} · {ocean.host}</span>
            <h3>{ocean.title}</h3>
            <p>{ocean.detail}</p>
            <div className="ocean-data-points"><span><small>OCEAN</small><strong>{ocean.ocean}</strong></span><span><small>HEAT SOURCE</small><strong>TIDAL FLEXING</strong></span></div>
            <p className="science-mission-note">{ocean.mission}</p>
          </div>
          <div className="science-choice-row">
            <span>EXPLORE A MOON</span>
            {oceanWorlds.map((item) => <button key={item.id} className={ocean.id === item.id ? "active" : ""} onClick={() => setOceanId(item.id)}>{item.name}</button>)}
          </div>
        </div>
      )}
      <p className="planetary-science-caveat">Diagrams are explanatory, not to scale. Interior models, cloud boundaries, and potential biological habitability include scientific uncertainties.</p>
    </section>
  );
}
