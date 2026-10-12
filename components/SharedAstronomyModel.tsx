"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import { planets, planetImages, planetModelColors, planetRotationSpeeds } from "@/lib/planets";
import { useCosmosStore } from "@/store/useCosmosStore";

export function SharedAstronomyModel({ fixedPlanetId, onPlanetSelect }: { fixedPlanetId?: string; onPlanetSelect?: (planetId: string) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const selectedId = useCosmosStore((state) => state.selectedPlanet);
  const selectPlanet = useCosmosStore((state) => state.selectPlanet);
  const planet = planets.find((item) => item.id === (fixedPlanetId ?? selectedId)) ?? planets[2];
  const dragRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setError(null);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (cause) {
      console.error("Unable to initialize the shared planet model renderer.", cause);
      setError("3D rendering is unavailable in this browser.");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor("#07131b", 0);
    renderer.domElement.setAttribute("aria-label", `Interactive textured 3D model of ${planet.name}. Drag to rotate and scroll to zoom.`);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, 4.4);
    cameraRef.current = camera;
    scene.add(new THREE.HemisphereLight("#b8dfff", "#181119", 2));
    const keyLight = new THREE.DirectionalLight("#fff0d6", 3.2);
    keyLight.position.set(-3, 2, 4);
    scene.add(keyLight);

    const geometry = new THREE.SphereGeometry(1.15, 64, 48);
    const material = new THREE.MeshStandardMaterial({
      color: planetModelColors[planet.id],
      roughness: planet.id === "earth" || planet.id === "venus" ? 0.88 : 0.95,
      metalness: 0.01,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    let ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> | undefined;
    if (planet.id === "saturn" || planet.id === "uranus") {
      ring = new THREE.Mesh(
        new THREE.RingGeometry(1.45, 2.05, 96),
        new THREE.MeshBasicMaterial({ color: planet.id === "saturn" ? "#d9c492" : "#86c9ce", side: THREE.DoubleSide, transparent: true, opacity: 0.66 }),
      );
      ring.rotation.x = Math.PI / 2.45;
      ring.rotation.y = 0.16;
      globe.add(ring);
    }

    const image = planetImages[planet.id];
    let texture: THREE.Texture | undefined;
    let disposed = false;
    if (image) {
      new THREE.TextureLoader().load(
        image.src,
        (loadedTexture) => {
          if (disposed) {
            loadedTexture.dispose();
            return;
          }
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          material.map = loadedTexture;
          material.color.set("#ffffff");
          material.needsUpdate = true;
          texture = loadedTexture;
          setError(null);
        },
        undefined,
        (cause) => {
          console.error(`Unable to load the ${planet.name} texture from ${image.src}.`, cause);
          setError(`The ${planet.name.toLowerCase()} texture could not be loaded; showing its model color instead.`);
        },
      );
    }

    const onPointerDown = (event: PointerEvent) => {
      dragRef.current = { x: event.clientX, y: event.clientY, active: true };
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      const deltaX = event.clientX - dragRef.current.x;
      const deltaY = event.clientY - dragRef.current.y;
      dragRef.current = { x: event.clientX, y: event.clientY, active: true };
      globe.rotation.y += deltaX * 0.008;
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + deltaY * 0.008, -1.2, 1.2);
    };
    const onPointerUp = () => { dragRef.current.active = false; };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let frame = 0;
    let previous = 0;
    const animate = (time: number) => {
      const delta = Math.min((time - previous) / 1000, 0.05);
      previous = time;
      if (!dragRef.current.active) globe.rotation.y += delta * planetRotationSpeeds[planet.id] * 16;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      cameraRef.current = null;
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      ring?.geometry.dispose();
      ring?.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [planet]);

  return (
    <section className="shared-model" aria-labelledby="shared-model-title">
      <div className="shared-model__intro">
        <span className="eyebrow">SHARED ASTRONOMY MODEL / {fixedPlanetId ? "MISSION TARGET" : "LIVE SELECTION"}</span>
        <h2 id="shared-model-title">{fixedPlanetId ? `${planet.name} mission target` : "One world model across every simulation"}</h2>
        <p>{fixedPlanetId ? "This mission is staged at Mars; its globe, color, and telemetry use the same Mars entry as the orbital and planetary views." : "Choose a planet once to use the same catalog data and surface texture across the orbital view and simulation instruments."}</p>
      </div>
      <div className="shared-model__content">
        <div
          className="shared-model__canvas"
          ref={hostRef}
          onWheel={(event) => {
            event.preventDefault();
            const camera = cameraRef.current;
            if (camera) {
              camera.position.z = THREE.MathUtils.clamp(camera.position.z + Math.sign(event.deltaY) * 0.25, 3.2, 6.5);
            }
          }}
        >
          <span className="shared-model__hint">DRAG TO ROTATE · SCROLL TO ZOOM</span>
          {error && <span className="shared-model__error" role="status">{error}</span>}
        </div>
        <div className="shared-model__details">
          <div className="shared-model__selected"><span className="eyebrow">ACTIVE BODY / {planet.className}</span><h3 style={{ color: planet.accent }}>{planet.name}</h3><p>{planet.description}</p></div>
          <div className="shared-model__metrics">
            <span>ORBITAL DISTANCE<strong>{planet.distance}</strong></span>
            <span>DIAMETER<strong>{planet.diameter}</strong></span>
            <span>MASS / EARTH<strong>{planet.massEarth.toLocaleString()}×</strong></span>
            <span>SURFACE GRAVITY<strong>{planet.gravity}</strong></span>
            <span>MOONS<strong>{planet.moons}</strong></span>
            <span>ATMOSPHERE<strong>{planet.atmosphere}</strong></span>
          </div>
          {!fixedPlanetId && <div className="shared-model__selector" aria-label="Select shared planet model">
            {planets.map((item) => <button key={item.id} type="button" className={planet.id === item.id ? "is-active" : ""} onClick={() => { selectPlanet(item.id); onPlanetSelect?.(item.id); }} aria-pressed={planet.id === item.id} title={`Show ${item.name.toLowerCase()} in all shared models`} style={{ "--model-accent": item.accent } as CSSProperties}>{item.name.slice(0, 3)}</button>)}
          </div>}
        </div>
      </div>
    </section>
  );
}
