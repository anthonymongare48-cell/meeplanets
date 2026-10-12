export type PlanetLayer = {
  id: string;
  name: string;
  radius: number;
  color: string;
  detail: string;
};

export type AtmosphereComponent = {
  name: string;
  amount: string;
  proportion: number;
};

export type PlanetInteriorProfile = {
  surfaceType: "rocky surface" | "no solid surface";
  layers: PlanetLayer[];
  atmosphere: {
    summary: string;
    components: AtmosphereComponent[];
    cloudNote: string;
  };
  weather: {
    temperature: string;
    headline: string;
    detail: string;
  };
};

export const planetInteriorProfiles: Record<string, PlanetInteriorProfile> = {
  mercury: {
    surfaceType: "rocky surface",
    layers: [
      { id: "crust", name: "Rocky crust", radius: 100, color: "#a99c8d", detail: "A thin, heavily cratered silicate crust exposed directly to space." },
      { id: "mantle", name: "Silicate mantle", radius: 91, color: "#806c5c", detail: "A comparatively thin rocky mantle surrounding Mercury's unusually large metallic core." },
      { id: "core", name: "Iron-rich core", radius: 85, color: "#d57945", detail: "A massive metallic core dominates the planet, spanning roughly 85% of its radius." },
    ],
    atmosphere: {
      summary: "Mercury has no substantial atmosphere; sunlight and impacts continually replenish a fragile exosphere.",
      components: [
        { name: "Oxygen", amount: "Trace", proportion: 86 },
        { name: "Sodium", amount: "Trace", proportion: 72 },
        { name: "Hydrogen", amount: "Trace", proportion: 57 },
        { name: "Helium · potassium", amount: "Trace", proportion: 41 },
      ],
      cloudNote: "Exosphere particles are sparse and do not form clouds or weather systems.",
    },
    weather: {
      temperature: "−170°C to 430°C",
      headline: "An airless world of extremes",
      detail: "With almost no atmosphere to hold heat, the sunlit ground becomes scorching while the night side loses heat rapidly. There is no rain or wind-driven storm system.",
    },
  },
  venus: {
    surfaceType: "rocky surface",
    layers: [
      { id: "crust", name: "Basaltic crust", radius: 100, color: "#d8ad70", detail: "A solid rocky crust lies beneath the dense atmosphere and global cloud deck." },
      { id: "mantle", name: "Silicate mantle", radius: 84, color: "#aa7045", detail: "Hot silicate rock transfers heat from the core and may drive volcanic resurfacing." },
      { id: "core", name: "Iron-rich core", radius: 37, color: "#ee8751", detail: "A metallic iron core beneath a rocky mantle; its exact state is still being studied." },
    ],
    atmosphere: {
      summary: "A crushing carbon-dioxide atmosphere blankets the planet at roughly 92 times Earth's surface pressure.",
      components: [
        { name: "Carbon dioxide", amount: "96.5%", proportion: 96.5 },
        { name: "Nitrogen", amount: "3.5%", proportion: 46 },
        { name: "Sulfur dioxide · traces", amount: "Trace", proportion: 18 },
      ],
      cloudNote: "Sulfuric-acid clouds circle the planet; droplets evaporate before reaching the ground.",
    },
    weather: {
      temperature: "≈ 460–480°C",
      headline: "A runaway greenhouse",
      detail: "A dense carbon-dioxide atmosphere traps heat efficiently, making Venus hotter than Mercury. High-altitude sulfuric-acid clouds and powerful winds sweep the cloud tops.",
    },
  },
  earth: {
    surfaceType: "rocky surface",
    layers: [
      { id: "crust", name: "Silicate crust", radius: 100, color: "#568c70", detail: "A thin, fragmented outer shell of oceanic and continental rock." },
      { id: "mantle", name: "Silicate mantle", radius: 86, color: "#c56f44", detail: "Hot, slowly convecting silicate rock transports heat and moves tectonic plates." },
      { id: "outer-core", name: "Liquid iron outer core", radius: 48, color: "#eb8a38", detail: "Flowing iron and nickel generate Earth's global magnetic field." },
      { id: "inner-core", name: "Solid iron inner core", radius: 27, color: "#ffe0a0", detail: "A solid iron-rich center kept solid by immense pressure despite its high temperature." },
    ],
    atmosphere: {
      summary: "A nitrogen-rich atmosphere with abundant oxygen and a variable amount of water vapor.",
      components: [
        { name: "Nitrogen", amount: "78%", proportion: 78 },
        { name: "Oxygen", amount: "21%", proportion: 70 },
        { name: "Argon · other gases", amount: "≈ 1%", proportion: 24 },
      ],
      cloudNote: "Clouds form from water droplets and ice crystals in a continuously cycling atmosphere.",
    },
    weather: {
      temperature: "≈ 15°C global mean",
      headline: "An active water cycle",
      detail: "Solar heating and planetary rotation drive winds, rain, snow, lightning, and cyclonic storms. Earth is the only known world with stable liquid water on its surface.",
    },
  },
  mars: {
    surfaceType: "rocky surface",
    layers: [
      { id: "crust", name: "Iron-rich rocky crust", radius: 100, color: "#c96542", detail: "Iron-oxide dust and basalt give the surface its familiar red color." },
      { id: "mantle", name: "Silicate mantle", radius: 82, color: "#92513b", detail: "A rocky silicate mantle separates the crust from the dense metallic interior." },
      { id: "core", name: "Iron · nickel · sulfur core", radius: 42, color: "#e88a56", detail: "A dense metallic core containing iron, nickel, and sulfur." },
    ],
    atmosphere: {
      summary: "A very thin atmosphere with less than 1% of Earth's surface pressure.",
      components: [
        { name: "Carbon dioxide", amount: "≈ 95%", proportion: 95 },
        { name: "Nitrogen", amount: "≈ 2.7%", proportion: 39 },
        { name: "Argon · other gases", amount: "≈ 2.3%", proportion: 31 },
      ],
      cloudNote: "Thin clouds and seasonal frost form in the cold, low-pressure air.",
    },
    weather: {
      temperature: "≈ −63°C mean",
      headline: "A cold, dusty desert",
      detail: "Powerful dust storms can grow large enough to encircle the planet. Mars also experiences frost and occasional carbon-dioxide snow in its thin atmosphere.",
    },
  },
  jupiter: {
    surfaceType: "no solid surface",
    layers: [
      { id: "clouds", name: "Cloud tops", radius: 100, color: "#d3aa82", detail: "Visible ammonia-rich cloud bands mark the top of a deep, turbulent atmosphere—not a solid surface." },
      { id: "molecular", name: "Molecular hydrogen", radius: 83, color: "#ad8062", detail: "With increasing depth, hydrogen gas becomes a dense, hot molecular fluid." },
      { id: "metallic", name: "Liquid metallic hydrogen", radius: 61, color: "#e0a269", detail: "Under immense pressure, hydrogen behaves like an electrically conducting liquid metal." },
      { id: "core", name: "Dense central region", radius: 31, color: "#f1d0a0", detail: "A concentrated mixture of heavy elements and rock may form a compact or partly diluted core." },
    ],
    atmosphere: {
      summary: "Hydrogen and helium dominate a vast envelope that gradually thickens into a fluid interior.",
      components: [
        { name: "Hydrogen", amount: "≈ 90%", proportion: 90 },
        { name: "Helium", amount: "≈ 10%", proportion: 62 },
        { name: "Methane · ammonia · water", amount: "Trace", proportion: 25 },
      ],
      cloudNote: "Colorful ammonia, ammonium hydrosulfide, and water clouds form layered bands and storms.",
    },
    weather: {
      temperature: "≈ −110°C at cloud tops",
      headline: "Bands, cyclones, and giant storms",
      detail: "Rapid rotation organizes powerful winds into striped jet streams. The Great Red Spot is a long-lived giant storm; deeper pressures may form diamond precipitation.",
    },
  },
  saturn: {
    surfaceType: "no solid surface",
    layers: [
      { id: "clouds", name: "Cloud tops", radius: 100, color: "#d7c29b", detail: "The visible cloud deck sits high above a deep atmosphere, with no solid ground beneath it." },
      { id: "molecular", name: "Liquid molecular hydrogen", radius: 82, color: "#b99a70", detail: "Hydrogen and helium become increasingly dense and fluid deeper in the planet." },
      { id: "metallic", name: "Liquid metallic hydrogen", radius: 59, color: "#d9a36e", detail: "At great pressure, hydrogen conducts electricity as a metallic fluid." },
      { id: "core", name: "Dense central region", radius: 29, color: "#f0d0a1", detail: "A compact or diffuse region of rock, ice, and heavy elements lies deep inside." },
    ],
    atmosphere: {
      summary: "A hydrogen-helium atmosphere merges gradually into deep, high-pressure fluid layers.",
      components: [
        { name: "Hydrogen", amount: "≈ 96%", proportion: 96 },
        { name: "Helium", amount: "≈ 3%", proportion: 55 },
        { name: "Methane · ammonia · water", amount: "Trace", proportion: 22 },
      ],
      cloudNote: "Ammonia and water clouds sit at different depths beneath a high-altitude haze.",
    },
    weather: {
      temperature: "≈ −140°C at cloud tops",
      headline: "Fast winds and polar geometry",
      detail: "Equatorial winds reach about 1,800 km/h. Saturn's north pole hosts a persistent hexagonal jet stream; planet-encircling megastorms recur every few decades.",
    },
  },
  uranus: {
    surfaceType: "no solid surface",
    layers: [
      { id: "clouds", name: "Cloud tops", radius: 100, color: "#8fd5d2", detail: "A hydrogen-helium atmosphere with methane haze; there is no solid surface to land on." },
      { id: "atmosphere", name: "Deep atmosphere", radius: 82, color: "#6db4bb", detail: "Hydrogen, helium, and methane become warmer and denser with depth." },
      { id: "mantle", name: "Water · ammonia · methane fluid", radius: 59, color: "#4a9da8", detail: "A hot, dense ionic and fluid mantle of water, ammonia, and methane—not ordinary surface ice." },
      { id: "core", name: "Rocky core", radius: 29, color: "#c8b49b", detail: "A comparatively small, dense central region of rocky material." },
    ],
    atmosphere: {
      summary: "Methane absorbs red light in a hydrogen-helium atmosphere, giving Uranus its pale blue-green appearance.",
      components: [
        { name: "Hydrogen", amount: "≈ 82.5%", proportion: 82.5 },
        { name: "Helium", amount: "≈ 15.2%", proportion: 61 },
        { name: "Methane", amount: "≈ 2.3%", proportion: 35 },
      ],
      cloudNote: "Methane clouds and hazes sit above deeper clouds of hydrogen sulfide and other compounds.",
    },
    weather: {
      temperature: "Down to ≈ −224°C",
      headline: "A cold world rotating on its side",
      detail: "Uranus has the coldest measured planetary atmosphere. Its extreme axial tilt creates decades-long seasons and storms with winds reaching about 900 km/h.",
    },
  },
  neptune: {
    surfaceType: "no solid surface",
    layers: [
      { id: "clouds", name: "Cloud tops", radius: 100, color: "#6688e1", detail: "Methane clouds and hazes mark the visible top of a deep atmosphere, not a solid surface." },
      { id: "atmosphere", name: "Deep atmosphere", radius: 82, color: "#496dcb", detail: "Hydrogen, helium, and methane become hot, dense fluids farther below the cloud tops." },
      { id: "mantle", name: "Water · ammonia · methane fluid", radius: 58, color: "#3154a4", detail: "A slushy, electrically conducting mantle of water, ammonia, and methane surrounds the core." },
      { id: "core", name: "Rocky core", radius: 28, color: "#c4b8ad", detail: "A dense central region of rock and heavier elements." },
    ],
    atmosphere: {
      summary: "Hydrogen and helium with methane produce Neptune's deep-blue atmospheric appearance.",
      components: [
        { name: "Hydrogen", amount: "≈ 80%", proportion: 80 },
        { name: "Helium", amount: "≈ 19%", proportion: 63 },
        { name: "Methane", amount: "≈ 1–2%", proportion: 33 },
      ],
      cloudNote: "High-altitude methane-ice clouds form above deeper, denser atmospheric layers.",
    },
    weather: {
      temperature: "≈ −200°C at cloud tops",
      headline: "Supersonic winds and dark storms",
      detail: "Winds exceed 2,000 km/h, among the fastest in the solar system. Dark anticyclonic storms and bright methane-ice clouds form in the active atmosphere.",
    },
  },
};
