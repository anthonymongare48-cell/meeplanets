import Image from "next/image";

const missions = [
  {
    name: "Hubble Space Telescope",
    kind: "SPACE TELESCOPE",
    image: "/space-missions/hubble.jpg",
    alt: "Hubble Space Telescope above Earth's bright blue horizon",
    mission: "In low Earth orbit since 1990, Hubble observes in visible and ultraviolet light above the blur and filtering of Earth's atmosphere.",
    science: "Its observations helped refine the age of the universe, reveal supermassive black holes, and establish that cosmic expansion is accelerating.",
    stat: "≈ 335 MI ABOVE EARTH",
  },
  {
    name: "James Webb Space Telescope",
    kind: "SPACE TELESCOPE",
    mission: "Launched in 2021, Webb operates near the Sun–Earth L2 point about one million miles from Earth. Its infrared instruments see through cosmic dust.",
    science: "Webb observes early galaxies and analyzes exoplanet atmospheres with spectroscopy, measuring how molecules imprint themselves on starlight.",
    stat: "INFRARED · SUN–EARTH L2",
  },
  {
    name: "Juno",
    kind: "PLANETARY PROBE",
    image: "/space-missions/juno.jpg",
    alt: "Juno spacecraft with Jupiter filling the background",
    mission: "Juno arrived at Jupiter in 2016. Three 30-foot solar arrays power the spacecraft, while long, elliptical polar orbits limit time in intense radiation.",
    science: "Gravity and magnetic-field measurements reveal a diffuse, deeply mixed interior, while close passes image enormous storms and polar cyclones.",
    stat: "JUPITER · POLAR ORBIT",
  },
  {
    name: "Parker Solar Probe",
    kind: "PLANETARY PROBE",
    image: "/space-missions/parker.webp",
    alt: "Parker Solar Probe passing in front of the Sun",
    mission: "Launched in 2018, Parker uses repeated Venus flybys to tighten its orbit and pass through the Sun's outer atmosphere, the corona.",
    science: "A carbon-composite heat shield protects the spacecraft as it traces how the corona is heated and how the solar wind accelerates.",
    stat: "SOLAR CORONA · 2,500°F SHIELD",
  },
];

export function SpaceScienceMissions() {
  return (
    <section className="space-missions" aria-labelledby="space-missions-title">
      <div className="space-missions-heading">
        <span className="eyebrow">INSTRUMENTS OF DISCOVERY</span>
        <h2 id="space-missions-title">Eyes outward.<br /><em>Worlds explored.</em></h2>
        <p>Telescopes collect light from across the universe; probes travel into the environments they are built to study. Above the atmosphere, both can observe with a clarity Earthbound instruments cannot.</p>
      </div>
      <div className="space-mission-grid">
        {missions.map((item, index) => (
          <article className="space-mission-card" key={item.name}>
            <div className={`space-mission-visual ${item.image ? "" : "jwst-visual"}`}>
              {item.image ? (
                <Image src={item.image} alt={item.alt ?? ""} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" />
              ) : (
                <svg viewBox="0 0 480 240" role="img" aria-label="Illustration of the James Webb Space Telescope">
                  <defs>
                    <linearGradient id="jwst-gold" x1="0" x2="1"><stop stopColor="#9e7130" /><stop offset=".5" stopColor="#f4d487" /><stop offset="1" stopColor="#997034" /></linearGradient>
                    <linearGradient id="jwst-shield" x1="0" x2="1"><stop stopColor="#314859" /><stop offset=".5" stopColor="#8fb2c0" /><stop offset="1" stopColor="#283d4b" /></linearGradient>
                  </defs>
                  <g fill="none" stroke="#a7c5d4" strokeOpacity=".55" strokeWidth="2">
                    <path d="M170 132 79 105 34 84M310 132l91-27 45-21M240 131V49" />
                    <path d="m182 145 58 74 58-74-17-40h-82z" fill="url(#jwst-shield)" stroke="#b4d0d8" />
                  </g>
                  <g fill="#202f3a" stroke="#92adbb" strokeWidth="2">
                    <path d="m45 51 57-28 29 53-57 28zM378 76l29-53 57 28-29 53z" />
                    <path d="m214 31 26-18 26 18-26 18z" fill="url(#jwst-gold)" />
                    <path d="m186 60 19-13 19 13-19 13zM237 60l19-13 19 13-19 13zM288 60l19-13 19 13-19 13zM212 91l19-13 19 13-19 13zM263 91l19-13 19 13-19 13z" fill="url(#jwst-gold)" />
                  </g>
                  <circle cx="240" cy="73" r="7" fill="#f1c46f" />
                  <g fill="#dce8f0" opacity=".75"><circle cx="90" cy="161" r="2" /><circle cx="142" cy="40" r="1.5" /><circle cx="350" cy="174" r="2" /><circle cx="412" cy="133" r="1.5" /><circle cx="69" cy="198" r="1.5" /></g>
                </svg>
              )}
              <span className="space-mission-index">0{index + 1}</span>
              <span className="space-mission-kind">{item.kind}</span>
            </div>
            <div className="space-mission-copy">
              <h3>{item.name}</h3>
              <span className="space-mission-stat">{item.stat}</span>
              <p>{item.mission}</p>
              <p>{item.science}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
