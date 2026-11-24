import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import type { Theme } from '../hooks/useTheme';
import {
  buildVoxelGroup,
  createManagedLoop,
  createNeobrutalLights,
  type VoxelSpec,
} from './voxelUtils';

export interface AvatarSceneHandle {
  setTheme: (theme: Theme) => void;
  triggerReaction: () => void;
  dispose: () => void;
}

interface AvatarCallbacks {
  onDragChange?: (dragging: boolean) => void;
  onContextLost?: () => void;
}

function getAvatarPalette(isDark: boolean) {
  return {
    outline: isDark ? 0xf5f5f0 : 0x121212,
    skin: 0xf4c7a1,
    hair: 0x1e1e24,
    hoodie: isDark ? 0xffe500 : 0xff5e3a,
    glasses: isDark ? 0xffe500 : 0x121212,
    lens: isDark ? 0x0f0f12 : 0xffffff,
    mug: isDark ? 0xf5f5f0 : 0xffffff,
    coffee: 0x3b2314,
    steam: isDark ? 0xffe500 : 0xffffff,
    shadow: isDark ? 0x050507 : 0x121212,
  };
}

export function mountAvatarScene(
  container: HTMLElement,
  initialTheme: Theme,
  callbacks?: AvatarCallbacks
): AvatarSceneHandle {
  let isDark = initialTheme === 'dark';
  let palette = getAvatarPalette(isDark);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.45, 7.6);
  camera.lookAt(0, 0.15, 0);

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });

  const lights = createNeobrutalLights(scene, isDark);

  const rootGroup = new Group();
  scene.add(rootGroup);

  // Ground shadow plate
  const shadowGeo = new BoxGeometry(2.5, 0.06, 1.5);
  const shadowMat = new MeshBasicMaterial({
    color: palette.shadow,
    transparent: true,
    opacity: 0.22,
  });
  const shadowMesh = new Mesh(shadowGeo, shadowMat);
  shadowMesh.position.set(0, -1.18, 0);
  rootGroup.add(shadowMesh);

  // Torso / Hoodie
  const torsoSpecs: VoxelSpec[] = [
    { x: 0, y: -0.58, z: 0, w: 2.3, h: 1.05, d: 1.22, color: palette.hoodie, role: 'hoodie' },
    { x: 0, y: -0.02, z: 0.05, w: 0.85, h: 0.3, d: 0.9, color: palette.skin, role: 'skin' },
    { x: -0.3, y: -0.45, z: 0.64, w: 0.12, h: 0.42, d: 0.08, color: palette.outline, role: 'outlineFill' },
    { x: 0.3, y: -0.45, z: 0.64, w: 0.12, h: 0.42, d: 0.08, color: palette.outline, role: 'outlineFill' },
    { x: 0, y: -0.85, z: 0.63, w: 1.25, h: 0.38, d: 0.08, color: palette.hoodie, role: 'hoodie' },
  ];
  const torso = buildVoxelGroup(torsoSpecs, palette.outline);
  rootGroup.add(torso.group);

  // Head Pivot (tracks pointer independently)
  const headPivot = new Group();
  headPivot.position.set(0, 0.68, 0);
  rootGroup.add(headPivot);

  const headSpecs: VoxelSpec[] = [
    // Face
    { x: 0, y: 0, z: 0, w: 1.5, h: 1.32, d: 1.32, color: palette.skin, role: 'skin' },
    // Hair top + back + sideburns
    { x: 0, y: 0.72, z: -0.04, w: 1.66, h: 0.42, d: 1.5, color: palette.hair, role: 'hair' },
    { x: 0, y: 0.15, z: -0.66, w: 1.58, h: 1.15, d: 0.28, color: palette.hair, role: 'hair' },
    { x: -0.78, y: 0.28, z: 0.12, w: 0.18, h: 0.68, d: 0.96, color: palette.hair, role: 'hair' },
    { x: 0.78, y: 0.28, z: 0.12, w: 0.18, h: 0.68, d: 0.96, color: palette.hair, role: 'hair' },
    // Glasses frame
    { x: -0.36, y: 0.08, z: 0.68, w: 0.56, h: 0.4, d: 0.12, color: palette.glasses, role: 'glasses' },
    { x: 0.36, y: 0.08, z: 0.68, w: 0.56, h: 0.4, d: 0.12, color: palette.glasses, role: 'glasses' },
    { x: 0, y: 0.14, z: 0.68, w: 0.2, h: 0.12, d: 0.1, color: palette.glasses, role: 'glasses' },
    // Lenses
    { x: -0.36, y: 0.08, z: 0.72, w: 0.34, h: 0.22, d: 0.08, color: palette.lens, role: 'lens', outline: false },
    { x: 0.36, y: 0.08, z: 0.72, w: 0.34, h: 0.22, d: 0.08, color: palette.lens, role: 'lens', outline: false },
    // Smile
    { x: 0, y: -0.34, z: 0.67, w: 0.38, h: 0.12, d: 0.08, color: palette.outline, role: 'outlineFill', outline: false },
  ];
  const head = buildVoxelGroup(headSpecs, palette.outline);
  headPivot.add(head.group);

  // Coffee Mug Group
  const mugPivot = new Group();
  mugPivot.position.set(1.02, -0.62, 0.75);
  rootGroup.add(mugPivot);

  const mugSpecs: VoxelSpec[] = [
    { x: 0, y: 0, z: 0, w: 0.52, h: 0.56, d: 0.52, color: palette.mug, role: 'mug' },
    { x: 0.32, y: 0, z: 0, w: 0.18, h: 0.3, d: 0.18, color: palette.mug, role: 'mug' },
    { x: 0, y: 0.27, z: 0, w: 0.4, h: 0.05, d: 0.4, color: palette.coffee, role: 'coffee', outline: false },
  ];
  const mug = buildVoxelGroup(mugSpecs, palette.outline);
  mugPivot.add(mug.group);

  // Steam voxel particles
  const steamGeo = new BoxGeometry(0.13, 0.13, 0.13);
  const steamParticles = [0, 1, 2].map((idx) => {
    const mat = new MeshBasicMaterial({
      color: palette.steam,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new Mesh(steamGeo, mat);
    mugPivot.add(mesh);
    return {
      mesh,
      mat,
      phase: idx / 3,
      speedBoost: 0,
    };
  });

  // Interaction state
  let targetLookX = 0;
  let targetLookY = 0;
  let currentLookX = 0;
  let currentLookY = 0;

  let isDragging = false;
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragDistance = 0;

  let orbitYaw = 0.18;
  let orbitPitch = 0.05;
  let velYaw = 0;
  let velPitch = 0;
  let lastDragTime = 0;

  let hopY = 0;
  let hopVel = 0;
  let mugLift = 0;
  let glintTimer = 0;

  const triggerReaction = () => {
    hopVel = 4.0;
    mugLift = 0.22;
    glintTimer = 0.24;
    head.setRoleColor('lens', isDark ? 0xffffff : 0xffe500);
    for (const p of steamParticles) {
      p.speedBoost = 1.6;
    }
  };

  const onWindowPointerMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.4)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.4)));
    targetLookX = nx * 0.45;
    targetLookY = ny * 0.22;
  };

  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragDistance = 0;
    velYaw = 0;
    velPitch = 0;
    container.setPointerCapture?.(e.pointerId);
    callbacks?.onDragChange?.(true);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragDistance += Math.hypot(e.clientX - startX, e.clientY - startY) * 0.25;

    const dYaw = dx * 0.014;
    const dPitch = dy * 0.01;
    orbitYaw += dYaw;
    orbitPitch = Math.max(-0.35, Math.min(0.45, orbitPitch + dPitch));
    velYaw = dYaw * 55;
    velPitch = dPitch * 55;
    lastDragTime = performance.now();
  };

  const endDrag = (e: PointerEvent) => {
    if (!isDragging || e.pointerId !== pointerId) return;
    isDragging = false;
    pointerId = null;
    lastDragTime = performance.now();
    container.releasePointerCapture?.(e.pointerId);
    callbacks?.onDragChange?.(false);

    if (dragDistance < 6 && Math.hypot(e.clientX - startX, e.clientY - startY) < 6) {
      triggerReaction();
    }
  };

  window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerup', endDrag);
  container.addEventListener('pointercancel', endDrag);

  const loop = createManagedLoop(
    container,
    renderer,
    (width, height) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    (dt, elapsed) => {
      // Smooth cursor look-at
      const lookLerp = 1 - Math.exp(-8 * dt);
      currentLookX += (targetLookX - currentLookX) * lookLerp;
      currentLookY += (targetLookY - currentLookY) * lookLerp;

      headPivot.rotation.y = currentLookX;
      headPivot.rotation.x = currentLookY;

      // Orbit inertia
      if (!isDragging) {
        orbitYaw += velYaw * dt;
        orbitPitch = Math.max(-0.35, Math.min(0.45, orbitPitch + velPitch * dt));
        const damping = Math.exp(-5.5 * dt);
        velYaw *= damping;
        velPitch *= damping;

        if (performance.now() - lastDragTime > 2000 && Math.abs(velYaw) < 0.05) {
          const settle = 1 - Math.exp(-2.2 * dt);
          orbitPitch += (0.05 - orbitPitch) * settle;
        }
      }

      // Click hop spring
      if (hopY > 0 || hopVel !== 0) {
        hopVel -= 22 * dt;
        hopY += hopVel * dt;
        if (hopY <= 0) {
          hopY = 0;
          hopVel = 0;
        }
      }

      mugLift += (0 - mugLift) * (1 - Math.exp(-10 * dt));
      mugPivot.position.y = -0.62 + mugLift + Math.sin(elapsed * 2.2) * 0.025;

      if (glintTimer > 0) {
        glintTimer -= dt;
        if (glintTimer <= 0) {
          head.setRoleColor('lens', palette.lens);
        }
      }

      // Steam animation
      for (let i = 0; i < steamParticles.length; i++) {
        const p = steamParticles[i];
        p.speedBoost += (0 - p.speedBoost) * (1 - Math.exp(-3 * dt));
        p.phase = (p.phase + dt * (0.45 + p.speedBoost)) % 1;
        p.mesh.position.y = 0.42 + p.phase * 0.72;
        p.mesh.position.x = Math.sin(elapsed * 2.8 + i * 2.1) * 0.07;
        const scale = 1 - p.phase * 0.55;
        p.mesh.scale.setScalar(scale);
        p.mat.opacity = (1 - p.phase) * 0.85;
      }

      rootGroup.position.y = hopY + Math.sin(elapsed * 1.8) * 0.03;
      rootGroup.rotation.y = orbitYaw + currentLookX * 0.14;
      rootGroup.rotation.x = orbitPitch;

      renderer.render(scene, camera);
    },
    callbacks?.onContextLost
  );

  return {
    setTheme(theme) {
      isDark = theme === 'dark';
      palette = getAvatarPalette(isDark);
      lights.setTheme(isDark);

      torso.setRoleColor('hoodie', palette.hoodie);
      torso.setRoleColor('outlineFill', palette.outline);
      torso.setOutlineColor(palette.outline);

      head.setRoleColor('glasses', palette.glasses);
      if (glintTimer <= 0) {
        head.setRoleColor('lens', palette.lens);
      }
      head.setRoleColor('outlineFill', palette.outline);
      head.setOutlineColor(palette.outline);

      mug.setRoleColor('mug', palette.mug);
      mug.setOutlineColor(palette.outline);

      shadowMat.color.setHex(palette.shadow);
      for (const p of steamParticles) {
        p.mat.color.setHex(palette.steam);
      }
    },
    triggerReaction,
    dispose() {
      window.removeEventListener('pointermove', onWindowPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', endDrag);
      container.removeEventListener('pointercancel', endDrag);
      loop.dispose();
      torso.dispose();
      head.dispose();
      mug.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      steamGeo.dispose();
      for (const p of steamParticles) {
        p.mat.dispose();
      }
    },
  };
}
