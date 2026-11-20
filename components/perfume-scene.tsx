"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export default function PerfumeScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setError(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const pivot = new THREE.Group();
    scene.add(pivot);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xf8e8dc, 0x57101a, 2.2);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffe4cc, 4.2);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff7b73, 3.6);
    rim.position.set(4, 1, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffd8b7, 28, 14, 2);
    fill.position.set(2, -2, 4);
    scene.add(fill);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;
    room.dispose();
    pmrem.dispose();

    camera.position.set(0, 0, 5.9);
    camera.lookAt(0, 0, 0);

    let loaded = false;
    const loader = new GLTFLoader();
    loader.load(
      "/parfum.glb",
      (gltf) => {
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        const dimensions = bounds.getSize(new THREE.Vector3());
        const longestSide = Math.max(dimensions.x, dimensions.y, dimensions.z);

        model.position.sub(center);
        model.scale.setScalar(2.85 / longestSide);
        pivot.position.x = window.innerWidth > 760 ? 0.72 : 0.15;
        pivot.add(model);
        loaded = true;
      },
      undefined,
      () => setError(true),
    );

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 760 ? 6.6 : 5.9;
      camera.updateProjectionMatrix();
      pivot.position.x = width > 760 ? 0.72 : 0.15;
    };
    resize();

    let targetRotation = 0;
    let currentRotation = 0;
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      targetRotation = progress * Math.PI * 2.2;
    };
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    let frame = 0;
    const clock = new THREE.Clock();
    const draw = () => {
      frame = window.requestAnimationFrame(draw);
      const t = clock.getElapsedTime();
      currentRotation += (targetRotation - currentRotation) * 0.075;
      pivot.rotation.y = currentRotation;
      if (loaded && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        pivot.position.y = Math.sin(t * 0.7) * 0.055;
      }
      renderer.render(scene, camera);
    };
    draw();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={hostRef} className="scene-shell" aria-label="Modèle 3D du parfum Julia, animé par le défilement" role="img">
      <div className="scene-aura" />
      {error && <div className="model-error">JULIA — ÉDITION 01</div>}
    </div>
  );
}
