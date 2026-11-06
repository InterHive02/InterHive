import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, X } from 'lucide-react';

interface HiveIntroSplashProps {
  onComplete: () => void;
  /**
   * Duration in seconds before the "InterHive" text emerges from the center.
   * Defaults to 2.0 seconds.
   */
  introDuration?: number;
  /**
   * Total duration in seconds before the intro smoothly fades out to reveal the site.
   * Defaults to 3.4 seconds.
   */
  totalDuration?: number;
}

export const HiveIntroSplash: React.FC<HiveIntroSplashProps> = ({
  onComplete,
  introDuration = 2.0,
  totalDuration = 3.4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'animating-hive' | 'text-reveal' | 'fading-out'>('animating-hive');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Hard fallback safety timer: guarantee dismissal after 4.5s under all circumstances
    const safetyTimer = setTimeout(() => {
      setIsDismissed(true);
      onComplete();
    }, 4500);

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    // Viewport dimensions & camera calibration
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, isMobile ? 18.5 : 14);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Dynamic Lighting
      const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xf59e0b, 2.8);
      dirLight1.position.set(10, 15, 12);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 2.2);
      dirLight2.position.set(-12, -8, 8);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xd97706, 3.5, 30);
      pointLight.position.set(0, 0, 5);
      scene.add(pointLight);

      // Central group to hold hexagonal hive & orbiting systems
      const group = new THREE.Group();
      scene.add(group);

      // Create 3D Hexagonal Prism geometry with bevels
      const hexRadius = 1.0;
      const hexDepth = 0.55;
      const hexShape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = hexRadius * Math.cos(angle);
        const y = hexRadius * Math.sin(angle);
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
      }
      hexShape.closePath();

      const extrudeSettings = {
        depth: hexDepth,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.12,
        bevelThickness: 0.12,
      };

      const hexGeo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
      hexGeo.center();

      // Brand Materials
      const amberMaterial = new THREE.MeshPhongMaterial({
        color: 0xf59e0b,
        emissive: 0x78350f,
        specular: 0xfef3c7,
        shininess: 95,
      });

      const slateMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e293b,
        emissive: 0x0f172a,
        specular: 0x94a3b8,
        shininess: 70,
      });

      const glassMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 100,
        opacity: 0.45,
        transparent: true,
      });

      const accentMaterial = new THREE.MeshPhongMaterial({
        color: 0x0284c7,
        emissive: 0x075985,
        specular: 0xbae6fd,
        shininess: 85,
      });

      const indigoMaterial = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        emissive: 0x312e81,
        specular: 0xc7d2fe,
        shininess: 80,
      });

      // Axial hive positions
      const hexSpacingX = Math.sqrt(3) * 1.08;
      const hexSpacingY = 1.62;

      const positions = [
        { q: 0, r: 0, mat: amberMaterial, scale: 1.3 }, // Center core hexagon
        { q: 1, r: 0, mat: slateMaterial, scale: 1.05 },
        { q: -1, r: 0, mat: glassMaterial, scale: 0.95 },
        { q: 0, r: 1, mat: slateMaterial, scale: 1.0 },
        { q: 0, r: -1, mat: amberMaterial, scale: 1.1 },
        { q: 1, r: -1, mat: accentMaterial, scale: 1.0 },
        { q: -1, r: 1, mat: glassMaterial, scale: 0.9 },
        { q: 2, r: -1, mat: slateMaterial, scale: 0.85 },
        { q: -2, r: 1, mat: amberMaterial, scale: 0.8 },
        { q: 1, r: 1, mat: indigoMaterial, scale: 0.85 },
        { q: -1, r: -1, mat: slateMaterial, scale: 0.85 },
        { q: 2, r: 0, mat: accentMaterial, scale: 0.75 },
        { q: -2, r: 0, mat: glassMaterial, scale: 0.75 },
        { q: 0, r: 2, mat: accentMaterial, scale: 0.75 },
        { q: 0, r: -2, mat: amberMaterial, scale: 0.75 },
      ];

      const hexMeshes: THREE.Mesh[] = [];

      positions.forEach((p, idx) => {
        const mesh = new THREE.Mesh(hexGeo, p.mat);
        const x = hexSpacingX * (p.q + p.r / 2);
        const y = hexSpacingY * p.r;
        const z = Math.sin(idx * 1.3) * 0.6;
        mesh.position.set(x, y, z);
        mesh.scale.set(p.scale, p.scale, p.scale);
        mesh.userData = {
          initialX: x,
          initialY: y,
          initialZ: z,
          speed: 0.8 + (idx % 4) * 0.4,
          offset: idx * 0.65,
          isCenter: p.q === 0 && p.r === 0,
        };
        group.add(mesh);
        hexMeshes.push(mesh);
      });

      // =========================================================================
      // CIRCULATING POINTS & ORBITAL RINGS AROUND THE HIVE
      // =========================================================================

      // 1. Orbital Ring Guides (Subtle luminous elliptical tracks)
      const ringGroup = new THREE.Group();
      group.add(ringGroup);

      const createOrbitalTrack = (radiusX: number, radiusY: number, rotX: number, rotY: number, color: number) => {
        const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(80);
        const ringGeo = new THREE.BufferGeometry().setFromPoints(
          points.map(pt => new THREE.Vector3(pt.x, 0, pt.y))
        );
        const ringMat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.25,
        });
        const line = new THREE.LineLoop(ringGeo, ringMat);
        line.rotation.x = rotX;
        line.rotation.y = rotY;
        ringGroup.add(line);
      };

      // 3 Tilted orbital tracks circulating around the hive
      createOrbitalTrack(5.6, 5.2, Math.PI / 3, 0.2, 0xf59e0b); // Amber track
      createOrbitalTrack(6.4, 6.0, -Math.PI / 4, -0.4, 0x38bdf8); // Cyan track
      createOrbitalTrack(7.2, 6.8, Math.PI / 6, 0.7, 0x818cf8); // Indigo track

      // 2. High-Density Circulating Points
      // We create multiple streams of points with differing radii, speeds, angles, and colors
      const circulatingCount = 140;
      const sphereGeo = new THREE.SphereGeometry(0.09, 10, 10);
      const smallSphereGeo = new THREE.SphereGeometry(0.06, 8, 8);

      const pMatGold = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const pMatAmber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const pMatCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pMatNeonBlue = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
      const pMatWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const materials = [pMatGold, pMatAmber, pMatCyan, pMatNeonBlue, pMatWhite];
      const circulatingMeshes: THREE.Mesh[] = [];

      for (let i = 0; i < circulatingCount; i++) {
        const isLead = i % 5 === 0;
        const mat = materials[i % materials.length];
        const mesh = new THREE.Mesh(isLead ? sphereGeo : smallSphereGeo, mat);

        // Assign to one of 4 orbital inclinations
        const streamType = i % 4;
        let baseRadius = 5.0 + (i % 6) * 0.45;
        let inclination = 0;
        let tiltY = 0;
        let speed = 0.015 + (i % 5) * 0.005;

        if (streamType === 0) {
          // Equatorial fast orbit
          inclination = 0.25;
          tiltY = 0.1;
          speed = 0.022 + Math.random() * 0.01;
        } else if (streamType === 1) {
          // Inclined +45 deg orbit
          inclination = Math.PI / 4;
          tiltY = 0.35;
          speed = -0.018 - Math.random() * 0.008; // Counter-rotating
        } else if (streamType === 2) {
          // Inclined -35 deg orbit
          inclination = -Math.PI / 3;
          tiltY = -0.4;
          speed = 0.02 + Math.random() * 0.009;
        } else {
          // Outer halo orbit
          baseRadius = 6.8 + Math.random() * 1.6;
          inclination = (Math.random() - 0.5) * Math.PI * 0.8;
          tiltY = Math.random() * Math.PI;
          speed = 0.012 + Math.random() * 0.008;
        }

        const initialAngle = (i / circulatingCount) * Math.PI * 2 + Math.random() * 0.5;

        mesh.userData = {
          angle: initialAngle,
          baseRadius,
          inclination,
          tiltY,
          speed,
          verticalOffset: (Math.random() - 0.5) * 0.8,
          wobbleFreq: 1.5 + Math.random() * 2.0,
        };

        group.add(mesh);
        circulatingMeshes.push(mesh);
      }

      // Mouse & Touch interaction tracking
      let targetRotX = 0;
      let targetRotY = 0;

      const handlePointerMove = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const mouseX = (x / rect.width) * 2 - 1;
        const mouseY = -(y / rect.height) * 2 + 1;
        targetRotY = mouseX * 0.45;
        targetRotX = -mouseY * 0.35;
      };

      const onMouseMove = (e: MouseEvent) => {
        handlePointerMove(e.clientX, e.clientY);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      // Resize handler
      const onWindowResize = () => {
        if (!container) return;
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.position.z = width < 768 ? 18.5 : 14;
        camera.updateProjectionMatrix();
        renderer?.setSize(width, height);
      };
      window.addEventListener('resize', onWindowResize);

      // Animation Loop
      const clock = new THREE.Clock();
      let isRevealedState = false;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Check if we hit the 2.0s mark for text reveal
        if (elapsedTime >= introDuration && !isRevealedState) {
          isRevealedState = true;
          setPhase('text-reveal');
        }

        // Smooth group rotation with damping
        group.rotation.y += (targetRotY - group.rotation.y) * 0.05 + 0.003;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
        group.position.y = Math.sin(elapsedTime * 1.2) * 0.18;

        // When text reveals at 2s, hive hexagons expand slightly outward to open the center
        const expansion = isRevealedState ? 1.15 : 1.0;
        group.scale.lerp(new THREE.Vector3(expansion, expansion, expansion), 0.05);

        // Kinetic pulse of individual hexagons
        hexMeshes.forEach((mesh) => {
          const { speed, offset, initialZ, isCenter } = mesh.userData;
          if (isRevealedState && isCenter) {
            mesh.position.z = initialZ - 1.2;
            mesh.scale.lerp(new THREE.Vector3(0.7, 0.7, 0.7), 0.08);
          } else {
            mesh.position.z = initialZ + Math.sin(elapsedTime * speed + offset) * 0.35;
            mesh.rotation.z = Math.sin(elapsedTime * 0.5 + offset) * 0.08;
          }
        });

        // Update circulating points in 3D orbit around the hive
        circulatingMeshes.forEach((pMesh) => {
          const data = pMesh.userData;
          data.angle += data.speed;

          // Compute 3D orbital coordinates
          const rad = isRevealedState ? data.baseRadius * 1.1 : data.baseRadius;
          const cosA = Math.cos(data.angle);
          const sinA = Math.sin(data.angle);

          // Rotate around inclination axis
          const x0 = rad * cosA;
          const z0 = rad * sinA;
          const y0 = data.verticalOffset + Math.sin(elapsedTime * data.wobbleFreq + data.angle) * 0.25;

          // Apply inclination matrix math
          const cosInc = Math.cos(data.inclination);
          const sinInc = Math.sin(data.inclination);
          const cosTilt = Math.cos(data.tiltY);
          const sinTilt = Math.sin(data.tiltY);

          // Rotated 3D vector
          const x = x0 * cosTilt - z0 * sinTilt * cosInc;
          const y = y0 + z0 * sinInc;
          const z = x0 * sinTilt + z0 * cosTilt * cosInc;

          pMesh.position.set(x, y, z);

          // Pulse scale slightly for sparkle effect
          const scaleMultiplier = 1.0 + Math.sin(elapsedTime * 3.5 + data.angle * 2.0) * 0.25;
          pMesh.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
        });

        // Rotate orbital track rings slowly
        ringGroup.rotation.y += 0.004;
        ringGroup.rotation.z += 0.002;

        // Increase point light intensity on reveal
        if (isRevealedState) {
          pointLight.intensity = Math.min(pointLight.intensity + 0.1, 7.0);
        }

        renderer?.render(scene, camera);
      };

      animate();

      // Timeline timers
      const fadeOutTimer = setTimeout(() => {
        setPhase('fading-out');
      }, totalDuration * 1000);

      const finishTimer = setTimeout(() => {
        setIsDismissed(true);
        onComplete();
      }, (totalDuration + 0.6) * 1000);

      return () => {
        clearTimeout(safetyTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(finishTimer);
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onWindowResize);

        // Clean disposal of Three.js objects
        hexGeo.dispose();
        sphereGeo.dispose();
        smallSphereGeo.dispose();
        amberMaterial.dispose();
        slateMaterial.dispose();
        glassMaterial.dispose();
        accentMaterial.dispose();
        indigoMaterial.dispose();
        pMatGold.dispose();
        pMatAmber.dispose();
        pMatCyan.dispose();
        pMatNeonBlue.dispose();
        pMatWhite.dispose();
        renderer?.dispose();
        if (renderer?.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.warn('Three.js initialization skipped, proceeding to site:', err);
      setIsDismissed(true);
      onComplete();
    }
  }, [introDuration, totalDuration, onComplete]);

  // Immediate skip function
  const handleSkip = () => {
    setPhase('fading-out');
    setTimeout(() => {
      setIsDismissed(true);
      onComplete();
    }, 200);
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-[#030712] select-none transition-opacity duration-700 ${
        phase === 'fading-out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ overflow: 'hidden' }}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-blue-950/20 to-[#030712] pointer-events-none" />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Center "InterHive" Text Emergence (triggers after 2.0s animation) */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 transform ${
          phase === 'text-reveal' || phase === 'fading-out'
            ? 'opacity-100 scale-100 translate-y-0 blur-0'
            : 'opacity-0 scale-50 translate-y-4 blur-sm pointer-events-none'
        }`}
      >
        {/* Glowing Center Burst Ring */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-amber-500/20 blur-xl animate-ping" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-blue-600 p-0.5 shadow-2xl shadow-amber-500/50 flex items-center justify-center transform hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-[#030712]/90 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
              <img
                src="/logo.png"
                alt="InterHive Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-black text-2xl text-amber-400 logo-fallback-text hidden">H</span>
            </div>
          </div>
        </div>

        {/* Brand Headline Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
          <span>Inter</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
            Hive
          </span>
          <span className="text-amber-400 text-3xl sm:text-5xl font-light">.in</span>
        </h1>

        {/* Platform Tagline */}
        <div className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase">
            Industry-Readiness &bull; Talent Connect
          </span>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium max-w-md">
          From Academic Learning to Production-Ready Engineering
        </p>
      </div>

      {/* Top Status & Skip Control */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <span>Skip</span>
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Bottom Kinetic Pulse Indicator (visible during 0–2.0s phase) */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500 ${
          phase === 'animating-hive' ? 'opacity-90' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest text-amber-400/90 uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Entering The Hive</span>
        </div>
        {/* 2-Second Progress Bar */}
        <div className="w-36 sm:w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-blue-500 transition-all ease-linear"
            style={{
              width: phase === 'animating-hive' ? '100%' : '100%',
              transitionDuration: `${introDuration}s`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HiveIntroSplash;
