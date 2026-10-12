"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Planet } from "@/lib/planets";
import { planetImages, planetModelColors, planetRotationSpeeds } from "@/lib/planets";

type ScaleMode = "visible" | "proportional";

type SolarSystemSceneProps = {
  planets: Planet[];
  selectedPlanet: string;
  onSelectPlanet: (id: string) => void;
  mode: "2D" | "3D";
  zoom: number;
  playing: boolean;
  speed: number;
  scaleMode: ScaleMode;
  showLabels: boolean;
  resetViewVersion: number;
};

type PlanetMotion = {
  data: Planet;
  orbit: THREE.Group;
  orbitLine: THREE.LineLoop;
  body: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  label: THREE.Sprite;
  angle: number;
  rotationSpeed: number;
  visibleRadius: number;
  trueRadius: number;
  visibleDistance: number;
  trueDistance: number;
};

const visibleDistances = [3.5, 5.2, 7.2, 9.2, 12.5, 16, 19.5, 22.5];
const trueDistances = [4.5, 6.5, 9, 11.5, 16, 21, 26, 31];
const visibleRadii = [0.35, 0.55, 0.6, 0.45, 1.2, 1, 0.8, 0.78];
const trueRadii = [0.15, 0.35, 0.38, 0.2, 1.1, 0.9, 0.55, 0.52];
const orbitalPeriods = [0.24, 0.62, 1, 1.88, 4, 7, 10, 14];

function createTextSprite(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the canvas context for planet labels.");
  context.font = "500 40px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(245, 241, 233, 0.94)";
  context.shadowColor = "rgba(0, 0, 0, 0.9)";
  context.shadowBlur = 10;
  context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.3, 0.82, 1);
  sprite.renderOrder = 10;
  return sprite;
}

export function SolarSystemScene({
  planets,
  selectedPlanet,
  onSelectPlanet,
  mode,
  zoom,
  playing,
  speed,
  scaleMode,
  showLabels,
  resetViewVersion,
}: SolarSystemSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedRef = useRef(selectedPlanet);
  const onSelectRef = useRef(onSelectPlanet);
  const zoomRef = useRef(zoom);
  const modeRef = useRef(mode);
  const resetRef = useRef(resetViewVersion);
  const scaleModeRef = useRef(scaleMode);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const labelsRef = useRef(showLabels);
  const sceneApiRef = useRef<{
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    planets: PlanetMotion[];
    renderer: THREE.WebGLRenderer;
    sun: THREE.Mesh;
  } | null>(null);

  useEffect(() => { selectedRef.current = selectedPlanet; }, [selectedPlanet]);
  useEffect(() => { onSelectRef.current = onSelectPlanet; }, [onSelectPlanet]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { resetRef.current = resetViewVersion; }, [resetViewVersion]);
  useEffect(() => { scaleModeRef.current = scaleMode; }, [scaleMode]);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { labelsRef.current = showLabels; }, [showLabels]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (cause) {
      console.error("Unable to initialize the WebGL solar system renderer.", cause);
      setError("WebGL is unavailable in this browser. Enable hardware acceleration or try a WebGL-compatible browser.");
      return;
    }

    setError(null);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);
    renderer.domElement.className = "solar-system-canvas";
    renderer.domElement.setAttribute("aria-label", "Interactive three-dimensional solar system. Drag to orbit the camera and select planets.");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080b12");
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 500);
    camera.position.set(0, 20, 36);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 7;
    controls.maxDistance = 90;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI / 2 + 0.4;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xb4c4df, 0.78));
    const sunlight = new THREE.PointLight(0xffe2ae, 210, 220, 1.6);
    sunlight.position.set(0, 0, 0);
    scene.add(sunlight);

    const sunMaterial = new THREE.MeshBasicMaterial({ color: "#ffba58" });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.35, 40, 40), sunMaterial);
    scene.add(sun);
    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 32, 32),
      new THREE.MeshBasicMaterial({ color: "#ff9c38", transparent: true, opacity: 0.18, side: THREE.BackSide }),
    );
    sun.add(sunGlow);

    const starPositions = new Float32Array(720 * 3);
    for (let index = 0; index < 720; index += 1) {
      const radius = 38 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const vertical = Math.random() * 2 - 1;
      const planar = Math.sqrt(1 - vertical * vertical);
      starPositions[index * 3] = Math.cos(theta) * planar * radius;
      starPositions[index * 3 + 1] = vertical * radius;
      starPositions[index * 3 + 2] = Math.sin(theta) * planar * radius;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: "#dce5ff", size: 0.18, transparent: true, opacity: 0.75, sizeAttenuation: true }),
    );
    scene.add(stars);

    const textureLoader = new THREE.TextureLoader();
    const motion: PlanetMotion[] = [];
    planets.forEach((planet, index) => {
      const orbit = new THREE.Group();
      scene.add(orbit);
      const color = planetModelColors[planet.id];
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.04 });
      const image = planetImages[planet.id];
      if (image) {
        textureLoader.load(
          image.src,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            material.map = texture;
            material.color.set("#ffffff");
            material.needsUpdate = true;
          },
          undefined,
          (cause) => console.error(`Unable to load the ${planet.name} texture from ${image.src}.`, cause),
        );
      }
      const radius = visibleRadii[index];
      const body = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), material);
      body.position.x = visibleDistances[index];
      body.userData.planetId = planet.id;
      orbit.add(body);

      if (planet.id === "saturn" || planet.id === "uranus") {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(radius * 1.35, radius * (planet.id === "saturn" ? 2.25 : 1.8), 64),
          new THREE.MeshStandardMaterial({
            color: planet.id === "saturn" ? "#dfc895" : "#8bbac1",
            side: THREE.DoubleSide,
            transparent: true,
            opacity: planet.id === "saturn" ? 0.74 : 0.46,
            roughness: 0.95,
          }),
        );
        ring.rotation.x = -Math.PI / 2.35;
        body.add(ring);
      }

      if (planet.id === "earth") {
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshStandardMaterial({ color: "#d5d8df", roughness: 0.9 }),
        );
        moon.position.set(radius + 0.42, 0, 0);
        body.add(moon);
      }

      const linePoints: THREE.Vector3[] = [];
      for (let segment = 0; segment <= 192; segment += 1) {
        const angle = (segment / 192) * Math.PI * 2;
        linePoints.push(new THREE.Vector3(Math.cos(angle) * visibleDistances[index], 0, Math.sin(angle) * visibleDistances[index]));
      }
      const orbitLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(linePoints),
        new THREE.LineBasicMaterial({ color: "#78869e", transparent: true, opacity: 0.32 }),
      );
      orbitLine.userData.distance = visibleDistances[index];
      orbitLine.userData.planetId = planet.id;
      scene.add(orbitLine);

      const label = createTextSprite(planet.name);
      label.position.set(visibleDistances[index], radius + 0.9, 0);
      label.visible = labelsRef.current;
      orbit.add(label);

      motion.push({
        data: planet,
        orbit,
        orbitLine,
        body,
        label,
        angle: (index * 47 + 18) * Math.PI / 180,
        rotationSpeed: planetRotationSpeeds[planet.id],
        visibleRadius: visibleRadii[index],
        trueRadius: trueRadii[index],
        visibleDistance: visibleDistances[index],
        trueDistance: trueDistances[index],
      });
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown: { x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => { pointerDown = { x: event.clientX, y: event.clientY }; };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 5) {
        pointerDown = null;
        return;
      }
      pointerDown = null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(motion.map((item) => item.body), false)[0];
      if (hit && typeof hit.object.userData.planetId === "string") onSelectRef.current(hit.object.userData.planetId);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const sceneApi = { camera, controls, planets: motion, renderer, sun };
    sceneApiRef.current = sceneApi;
    let animationFrame = 0;
    let previousTime = 0;
    const animate = (time: number) => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (playingRef.current) {
        sun.rotation.y += delta * 0.12;
        for (const item of motion) {
          item.angle += delta * speedRef.current * 0.12 / orbitalPeriods[planets.indexOf(item.data)];
          item.orbit.rotation.y = item.angle;
          item.body.rotation.y += delta * item.rotationSpeed * 16 * speedRef.current;
        }
      }

      motion.forEach((item) => {
        item.body.material.emissive.set(selectedRef.current === item.data.id ? "#33220f" : "#000000");
      });
      const proportional = scaleModeRef.current === "proportional";
      motion.forEach((item) => {
        const distance = proportional ? item.trueDistance : item.visibleDistance;
        const radius = proportional ? item.trueRadius : item.visibleRadius;
        item.body.position.x += (distance - item.body.position.x) * Math.min(delta * 3, 1);
        const currentRadius = item.body.scale.x * item.visibleRadius;
        const nextRadius = currentRadius + (radius - currentRadius) * Math.min(delta * 3, 1);
        item.body.scale.setScalar(nextRadius / item.visibleRadius);
        item.label.position.set(distance, radius + 0.9, 0);
        item.label.visible = labelsRef.current;

        if (Math.abs((item.orbitLine.userData.distance as number) - distance) > 0.04) {
          item.orbitLine.geometry.dispose();
          const points: THREE.Vector3[] = [];
          for (let segment = 0; segment <= 192; segment += 1) {
            const angle = (segment / 192) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
          }
          item.orbitLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
          item.orbitLine.userData.distance = distance;
        }
      });
      controls.update();
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    });
    resizeObserver.observe(host);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      for (const item of motion) {
        item.body.geometry.dispose();
        item.body.material.map?.dispose();
        item.body.material.dispose();
        item.label.material.map?.dispose();
        item.label.material.dispose();
        item.orbit.traverse((child) => {
          if (child instanceof THREE.Mesh && child !== item.body) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
            else child.material.dispose();
          }
        });
      }
      scene.traverse((object) => {
        if (object instanceof THREE.LineLoop) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      sun.geometry.dispose();
      sun.material.dispose();
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneApiRef.current = null;
    };
  }, [planets]);

  useEffect(() => {
    const api = sceneApiRef.current;
    if (!api) return;
    const homeDistance = scaleMode === "proportional" ? 52 : 39;
    const setHome = () => {
      api.controls.target.set(0, 0, 0);
      if (mode === "2D") {
        api.camera.up.set(0, 0, -1);
        api.camera.position.set(0, homeDistance * 1.22 / zoomRef.current, 0.01 / zoomRef.current);
        api.controls.minPolarAngle = 0.001;
        api.controls.maxPolarAngle = 0.001;
      } else {
        api.camera.up.set(0, 1, 0);
        api.camera.position.set(0, homeDistance * 0.48 / zoomRef.current, homeDistance / zoomRef.current);
        api.controls.minPolarAngle = 0.12;
        api.controls.maxPolarAngle = Math.PI / 2 + 0.4;
      }
      api.controls.update();
    };
    setHome();
  }, [mode, scaleMode, resetViewVersion]);

  useEffect(() => {
    const api = sceneApiRef.current;
    if (!api) return;
    const scale = zoom / zoomRef.current;
    api.camera.position.multiplyScalar(1 / scale);
    zoomRef.current = zoom;
    api.controls.update();
  }, [zoom]);

  if (error) return <div className="solar-system-error" role="alert">{error}</div>;
  return <div className="solar-system-scene" ref={hostRef} />;
}
