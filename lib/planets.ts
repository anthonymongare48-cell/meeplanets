export type Planet = {
  id: string;
  name: string;
  className: string;
  tagline: string;
  accent: string;
  distance: string;
  temperature: string;
  gravity: string;
  moons: number;
  diameter: string;
  day: string;
  year: string;
  atmosphere: string;
  geology: string;
  weather: string;
  minerals: string;
  rings: string;
  escapeVelocity: string;
  axialTilt: string;
  surfacePressure: string;
  notableMoons: string;
  description: string;
};

export const planets: Planet[] = [
  { id: "mercury", name: "MERCURY", className: "TERRESTRIAL", tagline: "The swift world", accent: "#b8a99a", distance: "0.39 AU", temperature: "167°C", gravity: "3.70 m/s²", moons: 0, diameter: "4,879 km", day: "1,408 h", year: "88 days", atmosphere: "Trace exosphere", geology: "Cratered silicate surface", weather: "Airless extremes: 427°C (800°F) by day and −184°C (−300°F) at night.", minerals: "Iron, nickel, and sulfur core beneath a silicate mantle and crust.", rings: "None", escapeVelocity: "4.3 km/s", axialTilt: "0.03°", surfacePressure: "Trace", notableMoons: "None", description: "A cratered, airless world racing around the Sun in just 88 days." },
  { id: "venus", name: "VENUS", className: "TERRESTRIAL", tagline: "The veiled world", accent: "#d99b54", distance: "0.72 AU", temperature: "464°C", gravity: "8.87 m/s²", moons: 0, diameter: "12,104 km", day: "5,832 h", year: "225 days", atmosphere: "CO₂ · nitrogen", geology: "Volcanic plains", weather: "A 464°C (867°F) runaway greenhouse under thick CO₂ and sulfuric-acid clouds.", minerals: "Dense iron-nickel core with basaltic volcanic rock and silicate minerals.", rings: "None", escapeVelocity: "10.4 km/s", axialTilt: "177.4° retrograde", surfacePressure: "92 bar", notableMoons: "None", description: "A cloud-shrouded furnace with a runaway greenhouse atmosphere." },
  { id: "earth", name: "EARTH", className: "TERRESTRIAL", tagline: "The living world", accent: "#63a7c9", distance: "1.00 AU", temperature: "15°C", gravity: "9.81 m/s²", moons: 1, diameter: "12,742 km", day: "24 h", year: "365.25 days", atmosphere: "N₂ · O₂ · H₂O", geology: "Active plate tectonics", weather: "A 15°C (59°F) life-sustaining climate powered by an active water cycle.", minerals: "Iron-nickel core; olivine, enstatite, spinel, and corundum in the crust and mantle.", rings: "None", escapeVelocity: "11.2 km/s", axialTilt: "23.4°", surfacePressure: "1 bar", notableMoons: "The Moon", description: "Our blue home, the only known world where life has taken hold." },
  { id: "mars", name: "MARS", className: "TERRESTRIAL", tagline: "The red frontier", accent: "#d4532f", distance: "1.52 AU", temperature: "-63°C", gravity: "3.71 m/s²", moons: 2, diameter: "6,779 km", day: "24.6 h", year: "687 days", atmosphere: "CO₂ · argon", geology: "Basaltic dust and ice", weather: "A −65°C (−85°F) desert climate with dust devils and planet-scale dust storms.", minerals: "Iron-nickel core and basaltic surface rich in iron oxide, clay, sulfates, and olivine.", rings: "None", escapeVelocity: "5.0 km/s", axialTilt: "25.2°", surfacePressure: "0.006 bar", notableMoons: "Phobos · Deimos", description: "A cold desert world marked by ancient rivers and towering volcanoes." },
  { id: "jupiter", name: "JUPITER", className: "GAS GIANT", tagline: "The giant", accent: "#d9a677", distance: "5.20 AU", temperature: "-110°C", gravity: "24.79 m/s²", moons: 115, diameter: "139,820 km", day: "9.9 h", year: "11.86 years", atmosphere: "Hydrogen · helium", geology: "Metallic hydrogen", weather: "Violent winds, lightning, turbulence, and the centuries-old Great Red Spot.", minerals: "Hydrogen and helium envelope with liquid metallic hydrogen and a dense rock-iron-silicate core.", rings: "Faint dust rings", escapeVelocity: "59.5 km/s", axialTilt: "3.1°", surfacePressure: "1-bar level", notableMoons: "Io · Europa · Ganymede · Callisto", description: "The solar system's largest planet, a stormy archive of the early system." },
  { id: "saturn", name: "SATURN", className: "GAS GIANT", tagline: "The ringed world", accent: "#c6aa7c", distance: "9.54 AU", temperature: "-140°C", gravity: "10.44 m/s²", moons: 293, diameter: "116,460 km", day: "10.7 h", year: "29.45 years", atmosphere: "Hydrogen · helium", geology: "Layered gas and ice", weather: "A −140°C giant with high-speed equatorial winds and a persistent north-polar hexagon.", minerals: "Hydrogen and helium compress into metallic liquid hydrogen around an iron-nickel-silicate core.", rings: "Bright ice rings", escapeVelocity: "35.5 km/s", axialTilt: "26.7°", surfacePressure: "1-bar level", notableMoons: "Titan · Enceladus", description: "A pale giant wearing the most spectacular rings in the solar system." },
  { id: "uranus", name: "URANUS", className: "ICE GIANT", tagline: "The tilted world", accent: "#76cad0", distance: "19.19 AU", temperature: "-195°C", gravity: "8.69 m/s²", moons: 29, diameter: "50,724 km", day: "17.2 h", year: "84 years", atmosphere: "Hydrogen · methane", geology: "Water-ammonia mantle", weather: "A −218°C (−360°F) ice giant with 98° tilt, 21-year seasons, and major storms.", minerals: "Fluid water, ammonia, and methane ices around a rocky silicate-iron core.", rings: "13 narrow rings", escapeVelocity: "21.3 km/s", axialTilt: "97.8°", surfacePressure: "1-bar level", notableMoons: "Titania · Oberon · icy satellites", description: "An ice giant rotating on its side beneath a blue methane haze." },
  { id: "neptune", name: "NEPTUNE", className: "ICE GIANT", tagline: "The deep blue", accent: "#537ad6", distance: "30.07 AU", temperature: "-200°C", gravity: "11.15 m/s²", moons: 16, diameter: "49,244 km", day: "16.1 h", year: "164.8 years", atmosphere: "Hydrogen · methane", geology: "Icy mantle", weather: "A −218°C (−360°F) world with the solar system's fastest supersonic winds and dark storms.", minerals: "Slushy water, ammonia, and methane mantle around an Earth-sized iron-nickel-silicate core.", rings: "5 faint rings", escapeVelocity: "23.5 km/s", axialTilt: "28.3°", surfacePressure: "1-bar level", notableMoons: "Triton · Nereid", description: "A distant blue world with the fastest winds ever measured." }
];

export function getPlanet(id: string) {
  return planets.find((planet) => planet.id === id);
}
