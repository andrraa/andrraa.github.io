import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../hooks/useTheme';
import type { AvatarSceneHandle } from '../three/avatarScene';
import { canRender3D } from '../utils/webgl';

interface Avatar3DProps {
  theme: Theme;
}

export function Avatar3D({ theme }: Avatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<AvatarSceneHandle | null>(null);
  const [mode, setMode] = useState<'fallback' | '3d'>('fallback');
  const [isDragging, setIsDragging] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canRender3D()) return;

    let cancelled = false;
    let handle: AvatarSceneHandle | null = null;

    import('../three/avatarScene')
      .then(({ mountAvatarScene }) => {
        if (cancelled || !containerRef.current) return;
        handle = mountAvatarScene(containerRef.current, theme, {
          onDragChange: (dragging) => {
            if (!cancelled) setIsDragging(dragging);
          },
          onContextLost: () => {
            if (!cancelled) setMode('fallback');
          },
        });
        sceneRef.current = handle;
        setMode('3d');
      })
      .catch(() => {
        if (!cancelled) setMode('fallback');
      });

    return () => {
      cancelled = true;
      handle?.dispose();
      sceneRef.current = null;
    };
    // Mount once; theme updates are applied imperatively in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  return (
    <div className="mx-auto w-full max-w-[220px]">
      <div className="brutal-shadow border-2 border-[var(--ink)] bg-[var(--bg)] p-3">
        <div
          ref={containerRef}
          role="button"
          tabIndex={0}
          data-cursor={mode === '3d' ? (isDragging ? 'SPIN' : 'DRAG 3D') : 'AVATAR'}
          aria-label="Interactive developer avatar — drag to rotate or press Enter to interact"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              sceneRef.current?.triggerReaction();
            }
          }}
          className={[
            'relative flex aspect-square items-center justify-center overflow-hidden border-2 border-[var(--ink)] touch-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]',
            mode === '3d' ? 'p-0' : 'p-2',
            isDark ? 'bg-[#171717]' : 'bg-[#FFE500]',
          ].join(' ')}
        >
          {mode !== '3d' && <PixelAvatar isDark={isDark} />}
        </div>
        <div className="font-mono-tech mt-2.5 flex items-center justify-between text-[11px] font-bold">
          <span>{mode === '3d' ? 'AVATAR.3D' : 'AVATAR.PX'}</span>
          <span className="text-[var(--muted)]">{mode === '3d' ? 'DRAG' : '16×16'}</span>
        </div>
      </div>
    </div>
  );
}

function PixelAvatar({ isDark }: { isDark: boolean }) {
  const outline = isDark ? '#F5F5F0' : '#121212';
  const skin = '#F4C7A1';
  const hair = '#1E1E24';
  const hoodie = isDark ? '#FFE500' : '#FF5E3A';
  const glasses = isDark ? '#FFE500' : '#121212';
  const lens = isDark ? '#0F0F12' : '#FFFFFF';
  const mug = isDark ? '#F5F5F0' : '#FFFFFF';

  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel art developer avatar"
    >
      {/* Hair */}
      <rect x="4" y="1" width="8" height="2" fill={hair} />
      <rect x="3" y="2" width="10" height="2" fill={hair} />
      <rect x="3" y="4" width="1" height="3" fill={hair} />
      <rect x="12" y="4" width="1" height="3" fill={hair} />

      {/* Face */}
      <rect x="4" y="4" width="8" height="6" fill={skin} />

      {/* Glasses */}
      <rect x="4" y="5" width="3" height="2" fill={glasses} />
      <rect x="9" y="5" width="3" height="2" fill={glasses} />
      <rect x="7" y="5" width="2" height="1" fill={glasses} />
      <rect x="5" y="5" width="1" height="1" fill={lens} />
      <rect x="10" y="5" width="1" height="1" fill={lens} />

      {/* Smile */}
      <rect x="7" y="8" width="2" height="1" fill={outline} />

      {/* Hoodie / Shoulders */}
      <rect x="2" y="10" width="12" height="5" fill={hoodie} />
      <rect x="2" y="10" width="12" height="1" fill={outline} />
      <rect x="1" y="11" width="1" height="4" fill={outline} />
      <rect x="14" y="11" width="1" height="4" fill={outline} />
      <rect x="6" y="10" width="4" height="2" fill={skin} />

      {/* Coffee Mug */}
      <rect x="11" y="12" width="3" height="3" fill={mug} />
      <rect x="14" y="13" width="1" height="1" fill={outline} />
      <rect x="12" y="10" width="1" height="1" fill={outline} />
    </svg>
  );
}
