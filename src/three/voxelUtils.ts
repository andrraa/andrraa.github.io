import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  Scene,
  WebGLRenderer,
} from 'three';

export interface VoxelSpec {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  color: number;
  role?: string;
  outline?: boolean;
}

export interface VoxelGroupHandle {
  group: Group;
  meshes: Mesh[];
  setRoleColor: (role: string, hex: number) => void;
  setOutlineColor: (hex: number) => void;
  dispose: () => void;
}

/**
 * Builds a group of flat-shaded voxel boxes with crisp neobrutalist edge outlines.
 */
export function buildVoxelGroup(specs: VoxelSpec[], outlineColor: number): VoxelGroupHandle {
  const group = new Group();
  const meshes: Mesh[] = [];
  const roleMaterials = new Map<string, MeshLambertMaterial[]>();
  const outlineMaterials: LineBasicMaterial[] = [];
  const geometries: Array<{ dispose: () => void }> = [];
  const materials: Array<{ dispose: () => void }> = [];

  for (const spec of specs) {
    const geo = new BoxGeometry(spec.w, spec.h, spec.d);
    const mat = new MeshLambertMaterial({
      color: spec.color,
      flatShading: true,
    });
    const mesh = new Mesh(geo, mat);
    mesh.position.set(spec.x, spec.y, spec.z);

    geometries.push(geo);
    materials.push(mat);
    meshes.push(mesh);

    if (spec.role) {
      const list = roleMaterials.get(spec.role) ?? [];
      list.push(mat);
      roleMaterials.set(spec.role, list);
    }

    if (spec.outline !== false) {
      const edgesGeo = new EdgesGeometry(geo);
      const lineMat = new LineBasicMaterial({ color: outlineColor });
      const lines = new LineSegments(edgesGeo, lineMat);
      lines.scale.setScalar(1.004);
      mesh.add(lines);

      geometries.push(edgesGeo);
      materials.push(lineMat);
      outlineMaterials.push(lineMat);
    }

    group.add(mesh);
  }

  return {
    group,
    meshes,
    setRoleColor(role, hex) {
      const mats = roleMaterials.get(role);
      if (!mats) return;
      for (const mat of mats) {
        mat.color.setHex(hex);
      }
    },
    setOutlineColor(hex) {
      for (const mat of outlineMaterials) {
        mat.color.setHex(hex);
      }
    },
    dispose() {
      for (const geo of geometries) geo.dispose();
      for (const mat of materials) mat.dispose();
    },
  };
}

/**
 * High-key lighting tuned so flat voxel faces keep sharp contrast without muddy shadows.
 */
export function createNeobrutalLights(scene: Scene, isDark: boolean) {
  const ambient = new AmbientLight(0xffffff, isDark ? 1.35 : 1.55);
  const key = new DirectionalLight(0xffffff, isDark ? 1.1 : 1.0);
  key.position.set(5, 8, 6);

  const fill = new DirectionalLight(0xffffff, isDark ? 0.5 : 0.4);
  fill.position.set(-5, 3, -4);

  scene.add(ambient, key, fill);

  return {
    setTheme(nextDark: boolean) {
      ambient.intensity = nextDark ? 1.35 : 1.55;
      key.intensity = nextDark ? 1.1 : 1.0;
      fill.intensity = nextDark ? 0.5 : 0.4;
    },
  };
}

/**
 * Manages WebGLRenderer sizing, IntersectionObserver/visibility pausing, and GPU cleanup.
 */
export function createManagedLoop(
  container: HTMLElement,
  renderer: WebGLRenderer,
  onResize: (width: number, height: number) => void,
  onTick: (dt: number, elapsed: number) => void,
  onContextLost?: () => void
) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  container.appendChild(renderer.domElement);

  const updateSize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h, false);
    onResize(w, h);
  };

  updateSize();

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', updateSize);
  }

  let inView = true;
  let tabVisible = !document.hidden;
  let rafId = 0;
  let disposed = false;
  let lastTime = performance.now();
  let elapsed = 0;

  const stopLoop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const loop = (now: number) => {
    if (disposed || !inView || !tabVisible) {
      rafId = 0;
      return;
    }
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += dt;
    onTick(dt, elapsed);
    rafId = requestAnimationFrame(loop);
  };

  const syncLoop = () => {
    if (disposed) return;
    if (inView && tabVisible) {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    } else {
      stopLoop();
    }
  };

  let intersectionObserver: IntersectionObserver | null = null;
  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        syncLoop();
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);
  }

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    syncLoop();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const handleContextLost = (e: Event) => {
    e.preventDefault();
    stopLoop();
    onContextLost?.();
  };
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

  syncLoop();

  return {
    dispose() {
      disposed = true;
      stopLoop();
      resizeObserver?.disconnect();
      if (!resizeObserver) {
        window.removeEventListener('resize', updateSize);
      }
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    },
  };
}
