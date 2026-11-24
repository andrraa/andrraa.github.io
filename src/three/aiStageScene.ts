import {
  BoxGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { Theme } from '../hooks/useTheme';
import {
  buildVoxelGroup,
  createManagedLoop,
  createNeobrutalLights,
  type VoxelGroupHandle,
  type VoxelSpec,
} from './voxelUtils';

export type AiId = 'deepseek' | 'gpt' | 'glm' | 'qwen' | 'claude';

export interface AiStageOptions {
  theme: Theme;
  onHoverChange: (id: AiId | null) => void;
  onWhip: (id: AiId) => void;
  onBubbleAnchor: (xPx: number, yPx: number) => void;
  onContextLost?: () => void;
}

export interface AiStageHandle {
  setTheme: (theme: Theme) => void;
  setExternalHover: (id: AiId | null) => void;
  setBubbleTarget: (id: AiId | null) => void;
  whip: (id: AiId) => void;
  whipAll: () => void;
  dispose: () => void;
}

interface FigurineRuntime {
  id: AiId;
  root: Group;
  bodyPivot: Group;
  voxels: VoxelGroupHandle;
  ringMesh: Mesh;
  ringMat: MeshBasicMaterial;
  x: number;
  z: number;
  y: number;
  vy: number;
  vx: number;
  vz: number;
  targetX: number;
  targetZ: number;
  rotY: number;
  spinVel: number;
  squashY: number;
  speed: number;
  walkPhase: number;
}

interface ParticleRuntime {
  mesh: Mesh;
  mat: MeshBasicMaterial;
  active: boolean;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  vz: number;
}

const STAGE_HALF_X = 4.3;
const STAGE_HALF_Z = 1.15;

function getStagePalette(isDark: boolean) {
  return {
    outline: isDark ? 0xf5f5f0 : 0x121212,
    eye: isDark ? 0xffe500 : 0x121212,
    plinth: isDark ? 0x18181d : 0xffffff,
    plinthShadow: isDark ? 0x050507 : 0x121212,
    grid: isDark ? 0x2f2f38 : 0xd4d0c5,
    ring: 0xffe500,
    gptAntenna: isDark ? 0xffe500 : 0x10b981,
  };
}

function getFigurineSpecs(id: AiId, palette: ReturnType<typeof getStagePalette>): VoxelSpec[] {
  if (id === 'claude') {
    const body = 0xd97757;
    return [
      { x: 0, y: 0.62, z: 0, w: 0.88, h: 0.72, d: 0.64, color: body },
      { x: -0.52, y: 0.6, z: 0, w: 0.16, h: 0.34, d: 0.3, color: body },
      { x: 0.52, y: 0.6, z: 0, w: 0.16, h: 0.34, d: 0.3, color: body },
      { x: -0.2, y: 0.68, z: 0.34, w: 0.14, h: 0.22, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: 0.2, y: 0.68, z: 0.34, w: 0.14, h: 0.22, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: -0.28, y: 0.14, z: 0, w: 0.18, h: 0.26, d: 0.24, color: body },
      { x: 0, y: 0.14, z: 0, w: 0.18, h: 0.26, d: 0.24, color: body },
      { x: 0.28, y: 0.14, z: 0, w: 0.18, h: 0.26, d: 0.24, color: body },
    ];
  }

  if (id === 'deepseek') {
    const body = 0x3b82f6;
    const fin = 0x60a5fa;
    return [
      { x: 0, y: 0.6, z: 0, w: 0.88, h: 0.68, d: 0.7, color: body },
      { x: 0, y: 1.03, z: 0, w: 0.24, h: 0.18, d: 0.36, color: fin },
      { x: -0.52, y: 0.54, z: 0, w: 0.16, h: 0.3, d: 0.32, color: fin },
      { x: -0.18, y: 0.64, z: 0.37, w: 0.16, h: 0.16, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: 0.2, y: 0.64, z: 0.37, w: 0.16, h: 0.16, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: -0.22, y: 0.14, z: 0, w: 0.2, h: 0.26, d: 0.26, color: body },
      { x: 0.22, y: 0.14, z: 0, w: 0.2, h: 0.26, d: 0.26, color: body },
    ];
  }

  if (id === 'glm') {
    const body = 0xa855f7;
    return [
      { x: 0, y: 0.58, z: 0, w: 0.82, h: 0.66, d: 0.66, color: body },
      { x: -0.28, y: 1.02, z: 0, w: 0.22, h: 0.24, d: 0.22, color: body },
      { x: 0.28, y: 1.02, z: 0, w: 0.22, h: 0.24, d: 0.22, color: body },
      { x: -0.18, y: 0.62, z: 0.35, w: 0.14, h: 0.22, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: 0.18, y: 0.62, z: 0.35, w: 0.14, h: 0.22, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: -0.22, y: 0.14, z: 0, w: 0.2, h: 0.24, d: 0.24, color: body },
      { x: 0.22, y: 0.14, z: 0, w: 0.2, h: 0.24, d: 0.24, color: body },
    ];
  }

  if (id === 'qwen') {
    const body = 0xf59e0b;
    return [
      { x: 0, y: 0.56, z: 0, w: 0.94, h: 0.62, d: 0.68, color: body },
      { x: -0.22, y: 0.62, z: 0.36, w: 0.22, h: 0.16, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: 0.22, y: 0.62, z: 0.36, w: 0.22, h: 0.16, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: 0, y: 0.42, z: 0.36, w: 0.3, h: 0.08, d: 0.06, color: palette.eye, role: 'eye', outline: false },
      { x: -0.26, y: 0.14, z: 0, w: 0.2, h: 0.24, d: 0.24, color: body },
      { x: 0.26, y: 0.14, z: 0, w: 0.2, h: 0.24, d: 0.24, color: body },
    ];
  }

  // gpt
  const body = 0x10b981;
  return [
    { x: 0, y: 0.6, z: 0, w: 0.82, h: 0.68, d: 0.68, color: body },
    { x: 0, y: 1.04, z: 0, w: 0.18, h: 0.2, d: 0.18, color: palette.gptAntenna, role: 'antenna' },
    { x: 0, y: 0.62, z: 0.36, w: 0.48, h: 0.16, d: 0.06, color: palette.eye, role: 'eye', outline: false },
    { x: -0.22, y: 0.14, z: 0, w: 0.2, h: 0.24, d: 0.24, color: body },
    { x: 0.22, y: 0.14, z: 0, w: 0.2, h: 0.24, d: 0.24, color: body },
  ];
}

export function mountAiStageScene(
  container: HTMLElement,
  options: AiStageOptions
): AiStageHandle {
  let isDark = options.theme === 'dark';
  let palette = getStagePalette(isDark);

  const scene = new Scene();
  const camera = new OrthographicCamera(-5.8, 5.8, 2.2, -2.2, 0.1, 40);
  camera.position.set(0, 6.2, 9.2);
  camera.lookAt(0, 0.35, 0);

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });

  const lights = createNeobrutalLights(scene, isDark);

  // Stage plinth + hard-offset shadow
  const plinth = buildVoxelGroup(
    [
      { x: 0, y: -0.18, z: 0, w: 10.6, h: 0.34, d: 3.6, color: palette.plinth, role: 'plinth' },
      { x: 0.14, y: -0.38, z: 0.14, w: 10.6, h: 0.12, d: 3.6, color: palette.plinthShadow, role: 'shadow', outline: false },
    ],
    palette.outline
  );
  scene.add(plinth.group);

  // Top grid lines on stage
  const gridPoints: number[] = [];
  for (let gx = -5; gx <= 5; gx += 1) {
    gridPoints.push(gx, 0.005, -1.8, gx, 0.005, 1.8);
  }
  for (let gz = -1.5; gz <= 1.5; gz += 0.75) {
    gridPoints.push(-5.3, 0.005, gz, 5.3, 0.005, gz);
  }
  const gridGeo = new BufferGeometry();
  gridGeo.setAttribute('position', new Float32BufferAttribute(gridPoints, 3));
  const gridMat = new LineBasicMaterial({ color: palette.grid });
  const gridLines = new LineSegments(gridGeo, gridMat);
  scene.add(gridLines);

  // Figurines
  const initialSetup: Array<{ id: AiId; x: number; z: number; speed: number }> = [
    { id: 'deepseek', x: -3.6, z: 0.3, speed: 1.05 },
    { id: 'gpt', x: -1.8, z: -0.4, speed: 1.35 },
    { id: 'glm', x: 0, z: 0.45, speed: 1.15 },
    { id: 'qwen', x: 1.8, z: -0.35, speed: 1.45 },
    { id: 'claude', x: 3.6, z: 0.25, speed: 1.2 },
  ];

  const ringGeo = new BoxGeometry(1.08, 0.03, 0.92);
  const pickTargets: Mesh[] = [];

  const figurines: FigurineRuntime[] = initialSetup.map((cfg, idx) => {
    const root = new Group();
    root.position.set(cfg.x, 0, cfg.z);

    const bodyPivot = new Group();
    root.add(bodyPivot);

    const voxels = buildVoxelGroup(getFigurineSpecs(cfg.id, palette), palette.outline);
    for (const mesh of voxels.meshes) {
      mesh.userData.aiId = cfg.id;
      pickTargets.push(mesh);
    }
    bodyPivot.add(voxels.group);

    const ringMat = new MeshBasicMaterial({
      color: palette.ring,
      transparent: true,
      opacity: 0.9,
    });
    const ringMesh = new Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.02;
    ringMesh.visible = false;
    root.add(ringMesh);

    scene.add(root);

    return {
      id: cfg.id,
      root,
      bodyPivot,
      voxels,
      ringMesh,
      ringMat,
      x: cfg.x,
      z: cfg.z,
      y: 0,
      vy: 0,
      vx: 0,
      vz: 0,
      targetX: -cfg.x * 0.7,
      targetZ: idx % 2 === 0 ? -0.6 : 0.6,
      rotY: 0,
      spinVel: 0,
      squashY: 1,
      speed: cfg.speed,
      walkPhase: idx * 1.3,
    };
  });

  // Pooled impact particles (zero per-click allocation)
  const particleGeo = new BoxGeometry(0.16, 0.16, 0.16);
  const particleColors = [0xffe500, 0xff5e3a, 0x93c5fd];
  const particles: ParticleRuntime[] = Array.from({ length: 30 }, (_, i) => {
    const mat = new MeshBasicMaterial({ color: particleColors[i % particleColors.length] });
    const mesh = new Mesh(particleGeo, mat);
    mesh.visible = false;
    scene.add(mesh);
    return {
      mesh,
      mat,
      active: false,
      life: 0,
      maxLife: 0.55,
      vx: 0,
      vy: 0,
      vz: 0,
    };
  });

  const spawnBurst = (x: number, y: number, z: number, count: number) => {
    let spawned = 0;
    for (const p of particles) {
      if (p.active) continue;
      p.active = true;
      p.life = 0;
      p.maxLife = 0.42 + Math.random() * 0.2;
      p.mesh.position.set(x, y + 0.5, z);
      p.mesh.visible = true;
      p.mesh.scale.setScalar(1);
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.6 + Math.random() * 2.2;
      p.vx = Math.cos(angle) * spd;
      p.vy = 2.6 + Math.random() * 2.4;
      p.vz = Math.sin(angle) * spd * 0.7;
      spawned += 1;
      if (spawned >= count) break;
    }
  };

  let stageHoverId: AiId | null = null;
  let externalHoverId: AiId | null = null;
  let bubbleTargetId: AiId | null = null;

  const whip = (id: AiId) => {
    const fig = figurines.find((f) => f.id === id);
    if (!fig) return;
    fig.vy = 5.4 + Math.random() * 1.0;
    fig.vx = (Math.random() - 0.5) * 2.2;
    fig.vz = (Math.random() - 0.5) * 1.2;
    fig.spinVel = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 5);
    fig.squashY = 1.18;
    spawnBurst(fig.x, fig.y, fig.z, 6);
  };

  const whipAll = () => {
    for (const fig of figurines) {
      whip(fig.id);
    }
  };

  // Raycasting
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const projVec = new Vector3();
  let viewWidth = 1;
  let viewHeight = 1;

  const pickAt = (clientX: number, clientY: number): AiId | null => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickTargets, false);
    if (hits.length === 0) return null;
    return (hits[0].object.userData.aiId as AiId | undefined) ?? null;
  };

  const onPointerMove = (e: PointerEvent) => {
    const hit = pickAt(e.clientX, e.clientY);
    if (hit !== stageHoverId) {
      stageHoverId = hit;
      options.onHoverChange(hit);
    }
  };

  const onPointerLeave = () => {
    if (stageHoverId !== null) {
      stageHoverId = null;
      options.onHoverChange(null);
    }
  };

  const onClick = (e: MouseEvent) => {
    const hit = pickAt(e.clientX, e.clientY);
    if (hit) {
      whip(hit);
      options.onWhip(hit);
    }
  };

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('click', onClick);

  const loop = createManagedLoop(
    container,
    renderer,
    (width, height) => {
      viewWidth = width;
      viewHeight = height;
      const aspect = width / height;
      // Ensure full 11.4-unit stage width fits on mobile and desktop
      const halfW = Math.max(5.8, 2.05 * aspect);
      const halfH = halfW / aspect;
      camera.left = -halfW;
      camera.right = halfW;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.updateProjectionMatrix();
    },
    (dt) => {
      const activeHover = stageHoverId ?? externalHoverId;

      for (let i = 0; i < figurines.length; i++) {
        const fig = figurines[i];
        const isPaused = activeHover === fig.id && fig.y === 0;
        fig.ringMesh.visible = activeHover === fig.id;

        if (!isPaused && fig.y === 0) {
          const dx = fig.targetX - fig.x;
          const dz = fig.targetZ - fig.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 0.25) {
            fig.targetX = (Math.random() * 2 - 1) * (STAGE_HALF_X - 0.3);
            fig.targetZ = (Math.random() * 2 - 1) * (STAGE_HALF_Z - 0.15);
          } else {
            const step = Math.min(dist, fig.speed * dt);
            fig.x += (dx / dist) * step;
            fig.z += (dz / dist) * step;
            const desiredYaw = Math.atan2(dx, dz) * 0.55;
            fig.rotY += (desiredYaw - fig.rotY) * (1 - Math.exp(-8 * dt));
            fig.walkPhase += dt * fig.speed * 9;
          }

          // Gentle separation so figurines don't overlap
          for (let j = 0; j < figurines.length; j++) {
            if (i === j) continue;
            const other = figurines[j];
            const sx = fig.x - other.x;
            const sz = fig.z - other.z;
            const d = Math.hypot(sx, sz);
            if (d > 0.001 && d < 1.2) {
              const push = ((1.2 - d) / 1.2) * dt * 1.8;
              fig.x += (sx / d) * push;
              fig.z += (sz / d) * push;
            }
          }
        } else if (isPaused) {
          fig.rotY += (0 - fig.rotY) * (1 - Math.exp(-10 * dt));
        }

        // Airborne whip physics
        if (fig.y > 0 || fig.vy !== 0) {
          fig.vy -= 18 * dt;
          fig.y += fig.vy * dt;
          fig.x += fig.vx * dt;
          fig.z += fig.vz * dt;
          fig.rotY += fig.spinVel * dt;
          fig.spinVel *= Math.exp(-3 * dt);

          if (fig.y <= 0) {
            fig.y = 0;
            fig.vy = 0;
            fig.vx = 0;
            fig.vz = 0;
            fig.spinVel = 0;
            fig.squashY = 0.72;
          }
        }

        fig.x = Math.max(-STAGE_HALF_X, Math.min(STAGE_HALF_X, fig.x));
        fig.z = Math.max(-STAGE_HALF_Z, Math.min(STAGE_HALF_Z, fig.z));

        // Spring squash-and-stretch back to 1
        fig.squashY += (1 - fig.squashY) * (1 - Math.exp(-14 * dt));
        const xzScale = 1 / Math.sqrt(Math.max(0.5, fig.squashY));
        fig.bodyPivot.scale.set(xzScale, fig.squashY, xzScale);

        const walkBob = !isPaused && fig.y === 0 ? Math.abs(Math.sin(fig.walkPhase)) * 0.08 : 0;
        const waddleRoll = !isPaused && fig.y === 0 ? Math.sin(fig.walkPhase) * 0.06 : 0;

        fig.root.position.set(fig.x, fig.y, fig.z);
        fig.bodyPivot.position.y = walkBob;
        fig.bodyPivot.rotation.y = fig.rotY;
        fig.bodyPivot.rotation.z = waddleRoll;
      }

      // Update particles
      for (const p of particles) {
        if (!p.active) continue;
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          p.mesh.visible = false;
          continue;
        }
        p.vy -= 12 * dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y = Math.max(0.08, p.mesh.position.y + p.vy * dt);
        p.mesh.position.z += p.vz * dt;
        const s = 1 - p.life / p.maxLife;
        p.mesh.scale.setScalar(s);
      }

      renderer.render(scene, camera);

      // Project bubble anchor without triggering React state
      if (bubbleTargetId) {
        const target = figurines.find((f) => f.id === bubbleTargetId);
        if (target) {
          projVec.set(target.x, target.y + 1.35, target.z).project(camera);
          const xPx = (projVec.x * 0.5 + 0.5) * viewWidth;
          const yPx = (-projVec.y * 0.5 + 0.5) * viewHeight;
          options.onBubbleAnchor(xPx, yPx);
        }
      }
    },
    options.onContextLost
  );

  return {
    setTheme(theme) {
      isDark = theme === 'dark';
      palette = getStagePalette(isDark);
      lights.setTheme(isDark);

      plinth.setRoleColor('plinth', palette.plinth);
      plinth.setRoleColor('shadow', palette.plinthShadow);
      plinth.setOutlineColor(palette.outline);
      gridMat.color.setHex(palette.grid);

      for (const fig of figurines) {
        fig.voxels.setRoleColor('eye', palette.eye);
        fig.voxels.setRoleColor('antenna', palette.gptAntenna);
        fig.voxels.setOutlineColor(palette.outline);
      }
    },
    setExternalHover(id) {
      externalHoverId = id;
    },
    setBubbleTarget(id) {
      bubbleTargetId = id;
    },
    whip,
    whipAll,
    dispose() {
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      loop.dispose();
      plinth.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      ringGeo.dispose();
      for (const fig of figurines) {
        fig.voxels.dispose();
        fig.ringMat.dispose();
      }
      particleGeo.dispose();
      for (const p of particles) {
        p.mat.dispose();
      }
    },
  };
}
