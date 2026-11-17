import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../hooks/useTheme';

interface CustomCursorProps {
  theme: Theme;
}

export function CustomCursor({ theme }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      setEnabled(false);
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        'a, button, [data-cursor]'
      );
      if (el) {
        setHoverLabel(el.dataset.cursor || 'OPEN');
      } else {
        setHoverLabel(null);
      }
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      targetX = -100;
      targetY = -100;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  const isHovering = hoverLabel !== null;
  const isDark = theme === 'dark';

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      {isHovering ? (
        <div
          className={[
            'font-mono-tech flex items-center gap-1 border-2 px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase transition-transform duration-100',
            pressed ? 'scale-90' : 'scale-100',
            isDark
              ? 'border-[#F5F5F0] bg-[#FFE500] text-[#121212] shadow-[3px_3px_0_#F5F5F0]'
              : 'border-[#121212] bg-[#FFE500] text-[#121212] shadow-[3px_3px_0_#121212]',
          ].join(' ')}
        >
          <span>{hoverLabel}</span>
        </div>
      ) : (
        <div
          className={[
            'relative flex items-center justify-center transition-transform duration-75',
            pressed ? 'scale-75' : 'scale-100',
            isDark
              ? 'h-6 w-6 border-2 border-[#FFE500] bg-[#0F0F12]/85'
              : 'h-5 w-5 border-2 border-[#121212] bg-[#121212]',
          ].join(' ')}
        >
          <span
            className={[
              'block',
              isDark ? 'h-1.5 w-1.5 bg-[#FFE500]' : 'h-1.5 w-1.5 bg-[#FFE500]',
            ].join(' ')}
          />
        </div>
      )}
    </div>
  );
}
