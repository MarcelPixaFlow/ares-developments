import { useEffect, useRef } from "react";
import type * as ThreeNamespace from "three";
import { heliosZones } from "./heliosData";

type ThreeModule = typeof ThreeNamespace;

type HeliosMapProps = {
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
};

const CLEAR_COLOR = 0x0c0b0d;
const SELECTED = 0xe63946;

type MatOptions = {
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
  emissive?: number;
  emissiveIntensity?: number;
};

function mat(THREE: ThreeModule, color: number, options: MatOptions = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.74,
    metalness: options.metalness ?? 0.16,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
}

function isStandardMaterial(
  material: ThreeNamespace.Material | ThreeNamespace.Material[],
): material is ThreeNamespace.MeshStandardMaterial {
  return !Array.isArray(material) && "emissive" in material && "emissiveIntensity" in material;
}

function tag(mesh: ThreeNamespace.Mesh, zoneId: string) {
  const current = mesh.material;
  if (isStandardMaterial(current)) {
    const cloned = current.clone();
    cloned.userData["baseEmissive"] = cloned.emissive.getHex();
    cloned.userData["baseEmissiveIntensity"] = cloned.emissiveIntensity;
    mesh.material = cloned;
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData["zoneId"] = zoneId;
  return mesh;
}

function zoneIdOf(object: ThreeNamespace.Object3D) {
  const value = object.userData["zoneId"];
  return typeof value === "string" ? value : undefined;
}

function addBox(
  THREE: ThreeModule,
  group: ThreeNamespace.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  material: ThreeNamespace.Material,
  zoneId?: string,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (zoneId) tag(mesh, zoneId);
  group.add(mesh);
  return mesh;
}

function addCyl(
  THREE: ThreeModule,
  group: ThreeNamespace.Group,
  rTop: number,
  rBot: number,
  h: number,
  x: number,
  y: number,
  z: number,
  material: ThreeNamespace.Material,
  zoneId?: string,
  segments = 28,
) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segments), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (zoneId) tag(mesh, zoneId);
  group.add(mesh);
  return mesh;
}

function createStarField(THREE: ThreeModule) {
  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = Math.random() * 70 + 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xf2ece4,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    }),
  );
}

function createHeliosComplex(THREE: ThreeModule) {
  const group = new THREE.Group();

  const dust = mat(THREE, 0x2b221c, { roughness: 0.96, metalness: 0.02 });
  const ridge = mat(THREE, 0x1d1713, { roughness: 0.98, metalness: 0.02 });
  const roadMat = mat(THREE, 0x3a3734, { roughness: 0.55, metalness: 0.08 });
  const plazaMat = mat(THREE, 0x2a2724, { roughness: 0.62, metalness: 0.1 });
  const concrete = mat(THREE, 0xcfc8bc, { roughness: 0.58, metalness: 0.18 });
  const concreteDark = mat(THREE, 0x7d776f, { roughness: 0.5, metalness: 0.28 });
  const steel = mat(THREE, 0x9aa0a6, { roughness: 0.32, metalness: 0.72 });
  const glass = mat(THREE, 0x8ec9d4, {
    roughness: 0.08,
    metalness: 0.55,
    transparent: true,
    opacity: 0.46,
  });
  const glassWarm = mat(THREE, 0xd7b48a, {
    roughness: 0.12,
    metalness: 0.35,
    transparent: true,
    opacity: 0.38,
    emissive: 0x6a4018,
    emissiveIntensity: 0.18,
  });
  const panel = mat(THREE, 0x1b2a3a, { roughness: 0.18, metalness: 0.78 });
  const waterMat = mat(THREE, 0xb7c2c6, { roughness: 0.22, metalness: 0.55 });
  const padMat = mat(THREE, 0x3f3d42, { roughness: 0.48, metalness: 0.22 });
  const beacon = mat(THREE, 0xe63946, { roughness: 0.3, metalness: 0.2, emissive: 0xe63946, emissiveIntensity: 0.9 });
  const lamp = mat(THREE, 0xffe6c4, { roughness: 0.4, metalness: 0.1, emissive: 0xffc27a, emissiveIntensity: 0.7 });
  const estufaGlass = mat(THREE, 0x9dcea8, {
    roughness: 0.12,
    metalness: 0.28,
    transparent: true,
    opacity: 0.4,
    emissive: 0x1d3a22,
    emissiveIntensity: 0.12,
  });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(56, 56, 72, 72), dust);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  const groundPos = ground.geometry.getAttribute("position");
  for (let i = 0; i < groundPos.count; i += 1) {
    const x = groundPos.getX(i);
    const y = groundPos.getY(i);
    const dist = Math.hypot(x, y);
    const flatten = Math.min(1, Math.max(0, (dist - 7.5) / 12));
    const relief =
      Math.sin(x * 0.19) * Math.cos(y * 0.16) * 0.42 +
      Math.sin(x * 0.47 + 1.7) * Math.cos(y * 0.39) * 0.16 +
      Math.sin(x * 1.15) * Math.sin(y * 0.92) * 0.05;
    groundPos.setZ(i, relief * flatten);
  }
  groundPos.needsUpdate = true;
  ground.geometry.computeVertexNormals();
  group.add(ground);

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + 0.2;
    const radius = 24 + (i % 3) * 1.4;
    const mound = new THREE.Mesh(new THREE.SphereGeometry(4.2 + (i % 3), 18, 12), ridge);
    mound.scale.set(1.6, 0.28, 1.1);
    mound.position.set(Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius);
    mound.receiveShadow = true;
    group.add(mound);
  }

  for (let i = 0; i < 36; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 16;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.18 + Math.random() * 0.38, 0),
      i % 2 === 0 ? dust : ridge,
    );
    rock.position.set(Math.cos(angle) * radius, 0.12, Math.sin(angle) * radius);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  addBox(THREE, group, 1.7, 0.05, 32, 0, 0.04, 0, roadMat);
  addBox(THREE, group, 30, 0.05, 1.5, 0, 0.04, 0, roadMat);
  addCyl(THREE, group, 6.2, 6.2, 0.07, 0, 0.05, 0, plazaMat, undefined, 56);

  addCyl(THREE, group, 1.15, 1.55, 5.2, 0, 2.7, 0, concrete, "nucleo", 28);
  addCyl(THREE, group, 1.18, 1.18, 0.12, 0, 1.4, 0, steel, "nucleo", 28);
  addCyl(THREE, group, 1.12, 1.12, 0.12, 0, 2.6, 0, steel, "nucleo", 28);
  addCyl(THREE, group, 1.05, 1.05, 0.12, 0, 3.8, 0, steel, "nucleo", 28);
  addCyl(THREE, group, 0.98, 0.98, 0.55, 0, 3.2, 0, glassWarm, "nucleo", 24);
  addCyl(THREE, group, 0.72, 0.72, 1.4, 0, 5.7, 0, concreteDark, "nucleo", 20);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.78, 24, 16), glass);
  cap.position.set(0, 6.5, 0);
  tag(cap, "nucleo");
  group.add(cap);
  addCyl(THREE, group, 0.06, 0.06, 1.8, 0, 7.5, 0, steel, "nucleo", 8);
  addCyl(THREE, group, 0.12, 0.12, 0.12, 0, 8.4, 0, beacon, "nucleo", 10);
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.4), steel);
  dish.position.set(1.35, 4.4, 0.2);
  dish.rotation.z = -0.7;
  tag(dish, "nucleo");
  group.add(dish);

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const x = Math.cos(angle) * 7.4;
    const z = Math.sin(angle) * 7.4;
    addCyl(THREE, group, 0.95, 1.05, 1.15, x, 0.62, z, concrete, "residencial", 18);
    addCyl(THREE, group, 1.02, 1.02, 0.08, x, 0.95, z, steel, "residencial", 18);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      glassWarm,
    );
    dome.position.set(x, 1.18, z);
    tag(dome, "residencial");
    group.add(dome);
    addBox(THREE, group, 1.6, 0.16, 0.42, x * 0.62, 0.26, z * 0.62, concreteDark, "residencial");
    addCyl(THREE, group, 0.05, 0.05, 0.12, x, 1.95, z, lamp, "residencial", 8);
  }

  const buildGreenhouse = (cx: number) => {
    addBox(THREE, group, 9.5, 1.15, 2.3, cx, 0.7, -11.2, concreteDark, "estufas");
    addBox(THREE, group, 8.8, 0.85, 1.7, cx, 0.95, -11.2, estufaGlass, "estufas");
    for (let rib = -3; rib <= 3; rib += 1) {
      addBox(THREE, group, 0.08, 1.2, 2.32, cx + rib * 1.25, 0.72, -11.2, steel, "estufas");
    }
    addBox(THREE, group, 9.5, 0.08, 2.36, cx, 1.3, -11.2, steel, "estufas");
  };
  buildGreenhouse(-4.6);
  buildGreenhouse(4.6);

  addCyl(THREE, group, 3.6, 3.6, 0.1, 11.5, 0.08, 6, padMat, "plataforma", 48);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.07, 10, 48), steel);
  torus.rotation.x = Math.PI / 2;
  torus.position.set(11.5, 0.16, 6);
  tag(torus, "plataforma");
  group.add(torus);
  addBox(THREE, group, 0.16, 0.04, 5.2, 11.5, 0.15, 6, concrete, "plataforma");
  addBox(THREE, group, 5.2, 0.04, 0.16, 11.5, 0.15, 6, concrete, "plataforma");
  addBox(THREE, group, 2.4, 0.7, 1.4, 11.5, 0.45, 9.4, concreteDark, "plataforma");
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    addCyl(
      THREE,
      group,
      0.06,
      0.06,
      0.1,
      11.5 + Math.cos(angle) * 3.15,
      0.22,
      6 + Math.sin(angle) * 3.15,
      lamp,
      "plataforma",
      8,
    );
  }

  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const x = -14.5 + col * 1.7;
      const z = -11.2 + row * 1.55;
      const panelMesh = addBox(THREE, group, 1.45, 0.04, 1.15, x, 0.55, z, panel, "solar");
      panelMesh.rotation.x = -0.45;
      addBox(THREE, group, 0.07, 0.5, 0.07, x, 0.28, z + 0.22, steel, "solar");
    }
  }

  addCyl(THREE, group, 1.15, 1.15, 2.1, -12.2, 1.1, 7.2, waterMat, "hidrica", 22);
  addCyl(THREE, group, 0.95, 0.95, 1.7, -10.1, 0.9, 8.6, waterMat, "hidrica", 22);
  addCyl(THREE, group, 0.75, 0.75, 1.35, -11.6, 0.72, 9.8, waterMat, "hidrica", 20);
  addCyl(THREE, group, 1.18, 1.18, 0.08, -12.2, 2.18, 7.2, steel, "hidrica", 22);
  addCyl(THREE, group, 0.98, 0.98, 0.08, -10.1, 1.78, 8.6, steel, "hidrica", 22);
  addBox(THREE, group, 2.8, 0.16, 0.22, -11.1, 0.7, 8.2, steel, "hidrica");
  addBox(THREE, group, 0.18, 0.18, 2.4, -11.2, 1.35, 8.0, steel, "hidrica");

  const crate = mat(THREE, 0x161616, { roughness: 0.42, metalness: 0.35 });
  addBox(THREE, group, 4.6, 1.7, 3.2, 10.2, 0.9, -8.2, concreteDark, "logistica");
  addBox(THREE, group, 1.35, 0.95, 1.55, 8.05, 0.58, -8.2, crate, "logistica");
  addBox(THREE, group, 2.2, 0.9, 2.2, 7.4, 0.5, -8.2, concrete, "logistica");
  addBox(THREE, group, 1.1, 2.4, 1.1, 12.1, 1.25, -9.4, steel, "logistica");
  addCyl(THREE, group, 0.16, 0.16, 0.12, 12.1, 2.5, -9.4, lamp, "logistica", 8);

  addBox(THREE, group, 5.4, 1.45, 3.4, 9.1, 0.82, 10.4, concrete, "laboratorios");
  addBox(THREE, group, 4.6, 0.7, 2.6, 9.1, 1.7, 10.4, glass, "laboratorios");
  addBox(THREE, group, 4.8, 0.12, 0.18, 9.1, 1.15, 12.12, lamp, "laboratorios");
  addBox(THREE, group, 3.8, 0.18, 0.55, 4.6, 0.32, 8.2, concreteDark, "laboratorios");

  return group;
}

function applySelection(scene: ThreeNamespace.Scene, selectedZoneId: string) {
  scene.traverse((child) => {
    const mesh = child as ThreeNamespace.Mesh;
    if (!mesh.isMesh) return;
    const material = mesh.material;
    if (!isStandardMaterial(material)) return;
    const zoneId = zoneIdOf(mesh);
    if (!zoneId) return;
    const baseHex = material.userData["baseEmissive"];
    const baseIntensity = material.userData["baseEmissiveIntensity"];
    const restoredHex = typeof baseHex === "number" ? baseHex : 0x000000;
    const restoredIntensity = typeof baseIntensity === "number" ? baseIntensity : 0;
    if (zoneId === selectedZoneId) {
      material.emissive.setHex(SELECTED);
      material.emissiveIntensity = Math.max(restoredIntensity, 0.28);
    } else {
      material.emissive.setHex(restoredHex);
      material.emissiveIntensity = restoredIntensity;
    }
  });
}

function disposeObject(object: ThreeNamespace.Object3D) {
  object.traverse((child) => {
    const mesh = child as ThreeNamespace.Mesh | ThreeNamespace.Points;
    if (!("geometry" in mesh) || !mesh.geometry) return;
    mesh.geometry.dispose();
    const { material } = mesh;
    if (Array.isArray(material)) {
      material.forEach((entry) => entry.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

function downloadCanvas(canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.download = `cidadela-helios-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function HeliosMap({ selectedZoneId, onSelectZone }: HeliosMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedZoneId);
  const onSelectRef = useRef(onSelectZone);
  const sceneRef = useRef<ThreeNamespace.Scene | null>(null);

  selectedRef.current = selectedZoneId;
  onSelectRef.current = onSelectZone;

  useEffect(() => {
    if (sceneRef.current) applySelection(sceneRef.current, selectedZoneId);
  }, [selectedZoneId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let disposed = false;
    let frameId = 0;
    let renderer: ThreeNamespace.WebGLRenderer | undefined;
    let scene: ThreeNamespace.Scene | undefined;
    let controls:
      | {
          update: () => void;
          dispose: () => void;
          target: ThreeNamespace.Vector3;
        }
      | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let camera: ThreeNamespace.PerspectiveCamera | undefined;
    let desiredTarget: ThreeNamespace.Vector3 | undefined;
    let THREE: ThreeModule | undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };

    const onPointerDown = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (Math.hypot(dx, dy) > 5 || !renderer || !camera || !scene || !THREE) return;

      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const hit = hits.find((entry) => zoneIdOf(entry.object));
      const zoneId = hit ? zoneIdOf(hit.object) : undefined;
      if (zoneId) onSelectRef.current(zoneId);
    };

    const teardown = () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      controls?.dispose();
      controls = undefined;
      if (scene) {
        disposeObject(scene);
        scene = undefined;
      }
      sceneRef.current = null;
      renderer?.dispose();
      renderer = undefined;
    };

    const boot = async () => {
      try {
        THREE = await import("three");
        if (disposed || !canvasRef.current || !THREE) return;
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        if (disposed || !canvasRef.current) return;

        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(CLEAR_COLOR, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x120e0c, 26, 64);
        sceneRef.current = scene;

        camera = new THREE.PerspectiveCamera(46, 1, 0.1, 220);
        camera.position.set(18, 14, 20);
        camera.lookAt(0, 0.4, 0);

        const complex = createHeliosComplex(THREE);
        const stars = createStarField(THREE);
        const hemi = new THREE.HemisphereLight(0xc9d4e0, 0x3a2418, 0.55);
        const key = new THREE.DirectionalLight(0xffd7b0, 1.35);
        key.position.set(16, 24, 12);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.near = 2;
        key.shadow.camera.far = 70;
        key.shadow.camera.left = -24;
        key.shadow.camera.right = 24;
        key.shadow.camera.top = 24;
        key.shadow.camera.bottom = -24;
        key.shadow.bias = -0.0004;
        const fill = new THREE.DirectionalLight(0x7f93aa, 0.28);
        fill.position.set(-14, 10, -16);
        const rim = new THREE.PointLight(0xff6a3a, 18, 40, 2);
        rim.position.set(-8, 10, 14);

        scene.add(hemi, key, fill, rim, complex, stars);
        applySelection(scene, selectedRef.current);

        desiredTarget = new THREE.Vector3(0, 0.5, 0);
        const nextControls = new OrbitControls(camera, canvas);
        nextControls.enableDamping = true;
        nextControls.dampingFactor = 0.07;
        nextControls.minDistance = 10;
        nextControls.maxDistance = 42;
        nextControls.maxPolarAngle = Math.PI / 2.18;
        nextControls.target.copy(desiredTarget);
        nextControls.autoRotate = !reducedMotion;
        nextControls.autoRotateSpeed = 0.32;
        controls = nextControls;

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointerup", onPointerUp);

        const setSize = () => {
          if (!renderer || !camera) return;
          const host = wrapRef.current;
          const width = Math.max(1, Math.floor(host?.clientWidth ?? canvas.clientWidth));
          const height = Math.max(1, Math.floor(host?.clientHeight ?? canvas.clientHeight));
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        };

        const tick = () => {
          if (disposed || !renderer || !scene || !camera) return;
          const zone = heliosZones.find((item) => item.id === selectedRef.current);
          if (zone && desiredTarget && controls) {
            desiredTarget.set(zone.focus.x, zone.focus.y, zone.focus.z);
            controls.target.lerp(desiredTarget, reducedMotion ? 1 : 0.045);
          }
          controls?.update();
          renderer.render(scene, camera);
          frameId = window.requestAnimationFrame(tick);
        };

        setSize();
        tick();

        if (wrapRef.current) {
          resizeObserver = new ResizeObserver(setSize);
          resizeObserver.observe(wrapRef.current);
        }
      } catch {
        teardown();
      }
    };

    void boot();

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 bg-[#0C0B0D]">
      <canvas ref={canvasRef} className="h-full w-full touch-none" />
      <button
        type="button"
        onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) downloadCanvas(canvas);
        }}
        className="absolute right-4 top-4 z-10 border border-white/20 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm transition-colors hover:border-white/50"
      >
        Baixar vista PNG
      </button>
    </div>
  );
}
