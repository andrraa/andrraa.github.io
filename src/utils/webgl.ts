/**
 * Checks whether 3D WebGL scenes should be initialized.
 * Kept free of Three.js imports so reduced-motion or non-WebGL clients
 * never download the lazy Three.js chunk.
 */
export function canRender3D(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
