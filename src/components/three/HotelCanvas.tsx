import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  CameraPreset,
  HotspotItem,
  MaterialTheme,
  TimeOfDay
} from '../../types/hotel';
import { ROOM_HOTSPOTS } from '../../data/hotelData';
import {
  buildOceanSuiteModel,
  buildPoolVillaModel,
  buildPenthouseModel,
  buildResortOverviewModel,
  createRoomMaterials
} from './proceduralModels';
import { Sparkles, Eye, Sun, Compass, Maximize2 } from 'lucide-react';

interface HotelCanvasProps {
  activeModelType: 'resort' | 'ocean_suite' | 'pool_villa' | 'penthouse';
  cameraPreset: CameraPreset;
  timeOfDay: TimeOfDay;
  materialTheme: MaterialTheme;
  showHotspots: boolean;
  onSelectHotspot?: (hotspot: HotspotItem | null) => void;
  activeHotspotId?: string | null;
}

export const HotelCanvas: React.FC<HotelCanvasProps> = ({
  activeModelType,
  cameraPreset,
  timeOfDay,
  materialTheme,
  showHotspots,
  onSelectHotspot,
  activeHotspotId,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Target animation state
  const targetCamPos = useRef(new THREE.Vector3(7, 5, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const isTransitioning = useRef(false);

  // Hotspots 3D objects
  const hotspotMeshesRef = useRef<THREE.Mesh[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Active hotspots data list
  const currentHotspots: HotspotItem[] = activeModelType === 'resort'
    ? [
        {
          id: 'pavilion',
          title: 'Grand Reception & Lobby Lounge',
          description: 'Soaring limestone columns and artisan glass dome welcoming guests with chilled white tea infusions.',
          position: [0, 1.9, 1.5],
          cameraTarget: [0, 1.2, 1.5],
          cameraPos: [2.5, 3.2, 5.0],
          tag: 'Lobby',
        },
        {
          id: 'ocean-wing',
          title: 'Cliffside Ocean Suites Terraces',
          description: 'Tiered suites featuring panoramic Aegean sea vistas and secluded sun loungers.',
          position: [-5.0, 1.8, 0.4],
          cameraTarget: [-5.0, 1.2, 0.4],
          cameraPos: [-2.0, 3.8, 4.0],
          tag: 'Accommodations',
        },
        {
          id: 'infinity-lagoon',
          title: 'Olympic Infinity Saltwater Lagoon',
          description: 'Seamless glass overflow rim creating an unbroken illusion with the azure horizon.',
          position: [0, 0.6, -2.5],
          cameraTarget: [0, 0.3, -2.5],
          cameraPos: [2.0, 2.5, -0.5],
          tag: 'Hydro Wellness',
        },
      ]
    : (ROOM_HOTSPOTS[activeModelType] || []);

  // Update selected hotspot callback to parent
  useEffect(() => {
    if (onSelectHotspot) {
      onSelectHotspot(selectedHotspot);
    }
  }, [selectedHotspot, onSelectHotspot]);

  // Handle external activeHotspotId changes
  useEffect(() => {
    if (!activeHotspotId) {
      setSelectedHotspot(null);
      return;
    }
    const found = currentHotspots.find((h) => h.id === activeHotspotId);
    if (found) {
      setSelectedHotspot(found);
      targetCamPos.current.set(...found.cameraPos);
      targetLookAt.current.set(...found.cameraTarget);
      isTransitioning.current = true;
    }
  }, [activeHotspotId, currentHotspots]);

  // Handle Camera Presets
  useEffect(() => {
    let cp: [number, number, number] = [6.5, 5.0, 7.5];
    let lt: [number, number, number] = [0, 1.0, 0];

    if (activeModelType === 'resort') {
      switch (cameraPreset) {
        case 'overview':
          cp = [13, 10, 14];
          lt = [0, 1.0, 0];
          break;
        case 'bed':
        case 'balcony':
          cp = [5, 4, -4];
          lt = [0, 1, -1];
          break;
        case 'lounge':
          cp = [3, 4, 6];
          lt = [0, 1.2, 1.5];
          break;
        case 'topdown':
          cp = [0, 20, 0.1];
          lt = [0, 0, 0];
          break;
      }
    } else {
      switch (cameraPreset) {
        case 'overview':
          cp = [6.5, 4.8, 7.2];
          lt = [0, 0.9, 0];
          break;
        case 'bed':
          cp = [0, 2.6, 4.2];
          lt = [0, 0.9, 0.8];
          break;
        case 'balcony':
          cp = [0.2, 2.3, -1.8];
          lt = [0, 0.8, -4.2];
          break;
        case 'lounge':
          cp = [-1.4, 2.2, 1.6];
          lt = [-2.8, 0.8, -0.8];
          break;
        case 'topdown':
          cp = [0, 14, 0.05];
          lt = [0, 0, 0];
          break;
      }
    }

    targetCamPos.current.set(...cp);
    targetLookAt.current.set(...lt);
    isTransitioning.current = true;
  }, [cameraPreset, activeModelType]);

  // Lighting & Background adjustment by TimeOfDay
  const updateLighting = useCallback((scene: THREE.Scene, time: TimeOfDay) => {
    // Clear old lights
    const lightsToRemove: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Light) {
        lightsToRemove.push(child);
      }
    });
    lightsToRemove.forEach((l) => scene.remove(l));

    let skyColor = 0xFFFBF2;
    let groundColor = 0xE6DFD5;
    let dirColor = 0xFFF5E6;
    let dirIntensity = 1.4;
    let dirPos: [number, number, number] = [8, 14, 6];
    let bgColor = 0xFAF8F5;

    switch (time) {
      case 'morning':
        skyColor = 0xF7F8FA;
        groundColor = 0xEDE8DC;
        dirColor = 0xFFEED1;
        dirIntensity = 1.35;
        dirPos = [10, 10, 5];
        bgColor = 0xF9F8F5;
        break;
      case 'daylight':
        skyColor = 0xFFFFFF;
        groundColor = 0xEAE5DC;
        dirColor = 0xFFFAF0;
        dirIntensity = 1.5;
        dirPos = [6, 16, 7];
        bgColor = 0xFAF9F6;
        break;
      case 'golden':
        skyColor = 0xFFEACC;
        groundColor = 0xDEC29B;
        dirColor = 0xFFA94D;
        dirIntensity = 1.8;
        dirPos = [12, 6, 8];
        bgColor = 0xFBF5ED;
        break;
      case 'dusk':
        skyColor = 0xE1D9EC;
        groundColor = 0xB5A8C4;
        dirColor = 0xBA94D1;
        dirIntensity = 0.9;
        dirPos = [8, 5, -8];
        bgColor = 0xF3EFF6;
        break;
    }

    scene.background = new THREE.Color(bgColor);

    // Warm key light
    const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
    dirLight.position.set(...dirPos);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 35;
    dirLight.shadow.bias = -0.0005;
    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Soft sky-ground hemisphere fill
    const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0.7);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    // Subtle warm interior accent light
    const warmPendant = new THREE.PointLight(0xFFE2B0, time === 'dusk' ? 1.6 : 0.8, 12);
    warmPendant.position.set(0, 3.2, 0);
    scene.add(warmPendant);
  }, []);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(7, 5, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Environment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn('RoomEnvironment fallback', e);
    }

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.5;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't flip under the floor
    controls.target.set(0, 1.0, 0);

    // User interaction pauses camera transition
    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // Initial Light setup
    updateLighting(scene, timeOfDay);

    // Build Model Object
    const materials = createRoomMaterials(materialTheme);
    let activeModelGroup: THREE.Group;

    switch (activeModelType) {
      case 'resort':
        activeModelGroup = buildResortOverviewModel(materials);
        break;
      case 'pool_villa':
        activeModelGroup = buildPoolVillaModel(materials);
        break;
      case 'penthouse':
        activeModelGroup = buildPenthouseModel(materials);
        break;
      case 'ocean_suite':
      default:
        activeModelGroup = buildOceanSuiteModel(materials);
        break;
    }
    scene.add(activeModelGroup);

    // Architectural Grounding Pedestal & Soft Contact Shadow
    const pedestalGeo = new THREE.CylinderGeometry(10, 10.2, 0.25, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xFDFCF9,
      roughness: 0.9,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.35;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Soft circular contact shadow
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x8C8275,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.48;
    scene.add(shadowPlane);

    // -------------------------------------------------------------
    // Hotspot Markers in 3D
    // -------------------------------------------------------------
    hotspotMeshesRef.current = [];
    const hotspotGroup = new THREE.Group();
    hotspotGroup.name = 'hotspots';

    if (showHotspots) {
      currentHotspots.forEach((spot) => {
        const marker = new THREE.Group();
        marker.position.set(...spot.position);

        // Outer Glowing Ring
        const ringGeo = new THREE.RingGeometry(0.12, 0.18, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xC5A880,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;

        // Inner Core Dot
        const coreGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x9A7B56,
          emissive: 0xC5A880,
          emissiveIntensity: 0.8,
          roughness: 0.3,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.userData = { hotspot: spot };

        marker.add(ring, core);
        hotspotGroup.add(marker);
        hotspotMeshesRef.current.push(core);
      });
      scene.add(hotspotGroup);
    }

    // -------------------------------------------------------------
    // Interactive Raycasting for Hotspots
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshesRef.current);
      if (intersects.length > 0) {
        const targetSpot = intersects[0].object.userData.hotspot as HotspotItem;
        if (targetSpot) {
          setSelectedHotspot(targetSpot);
          targetCamPos.current.set(...targetSpot.cameraPos);
          targetLookAt.current.set(...targetSpot.cameraTarget);
          isTransitioning.current = true;
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // -------------------------------------------------------------
    // Resize Handler
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // Render Loop with Smooth Damping
    // -------------------------------------------------------------
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Smooth Camera & Target Interpolation
      if (isTransitioning.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.5, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAt.current.x, 3.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAt.current.y, 3.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAt.current.z, 3.5, delta);

        if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
          isTransitioning.current = false;
        }
      } else if (isRotating) {
        // Subtle ambient continuous drift when idle
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.55;
      } else {
        controls.autoRotate = false;
      }

      controls.update();

      // Subtle pulse on hotspot rings
      const time = clock.getElapsedTime();
      hotspotGroup.children.forEach((child, idx) => {
        const ring = child.children[0] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(time * 2.5 + idx) * 0.18;
          ring.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
    };
  }, [activeModelType, materialTheme, showHotspots, isRotating, updateLighting]);

  // Listen to timeOfDay change dynamically
  useEffect(() => {
    if (sceneRef.current) {
      updateLighting(sceneRef.current, timeOfDay);
    }
  }, [timeOfDay, updateLighting]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#FAF8F5]">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport Status Top Indicators (Minimal, Static, Non-pulsating) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold tracking-wider text-stone-700 uppercase">
            3D Spatial Viewer
          </span>
          <span className="text-stone-300">|</span>
          <span className="text-xs text-stone-500 font-medium">
            {activeModelType === 'resort'
              ? 'Sanctuary Masterplan'
              : activeModelType === 'ocean_suite'
              ? 'Azure Ocean Suite'
              : activeModelType === 'pool_villa'
              ? 'Private Pool Villa'
              : 'Skyline Penthouse'}
          </span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          title={isRotating ? 'Pause subtle rotation' : 'Start auto-orbit'}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 shadow-xs ${
            isRotating
              ? 'bg-amber-50/90 text-amber-900 border-amber-300'
              : 'bg-white/90 text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{isRotating ? 'Orbit: Active' : 'Orbit: Paused'}</span>
        </button>

        <button
          onClick={() => {
            targetCamPos.current.set(7, 5, 8);
            targetLookAt.current.set(0, 1, 0);
            isTransitioning.current = true;
            setSelectedHotspot(null);
          }}
          title="Reset Camera View"
          className="bg-white/90 text-stone-700 border border-stone-200 hover:bg-stone-50 px-3 py-1.5 text-xs font-medium rounded-full shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Interactive Hotspot Details Overlay Popover (when user selects or clicks hotspot) */}
      {selectedHotspot && (
        <div className="absolute top-16 left-4 z-20 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200/90 shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                {selectedHotspot.tag}
              </span>
              <span className="text-xs text-stone-400">Spatial Hotspot</span>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-stone-400 hover:text-stone-700 text-sm font-semibold p-1 leading-none rounded-md hover:bg-stone-100"
            >
              ✕
            </button>
          </div>
          <h4 className="font-serif text-base font-semibold text-stone-900 leading-snug">
            {selectedHotspot.title}
          </h4>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            {selectedHotspot.description}
          </p>
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Verified Architecture
            </span>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-xs font-medium text-amber-900 hover:text-amber-950 underline underline-offset-2"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Orbit interaction hint */}
      <div className="absolute bottom-20 right-4 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 text-[11px] text-stone-400 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/60 shadow-xs">
        <Eye className="w-3 h-3" />
        <span>Drag to rotate • Scroll to zoom • Right-click to pan</span>
      </div>
    </div>
  );
};
