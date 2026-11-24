import { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/portfolio';
import type { Theme } from '../hooks/useTheme';
import type { AiId, AiStageHandle } from '../three/aiStageScene';

const MODEL_SWATCH: Record<string, string> = {
  deepseek: '#3B82F6',
  gpt: '#10B981',
  glm: '#A855F7',
  qwen: '#F59E0B',
  claude: '#D97757',
};

interface AiCrewStage3DProps {
  theme: Theme;
  counts: Record<string, number>;
  hoveredId: string | null;
  bubble: { id: string; text: string } | null;
  whipEvent: { id: string | 'all'; seq: number } | null;
  onStageWhip: (id: string) => void;
  onLegendWhip: (id: string) => void;
  onHoverChange: (id: string | null) => void;
  onFallback: () => void;
}

export function AiCrewStage3D({
  theme,
  counts,
  hoveredId,
  bubble,
  whipEvent,
  onStageWhip,
  onLegendWhip,
  onHoverChange,
  onFallback,
}: AiCrewStage3DProps) {
  const [stageHoverId, setStageHoverId] = useState<AiId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<AiStageHandle | null>(null);

  const onStageWhipRef = useRef(onStageWhip);
  onStageWhipRef.current = onStageWhip;
  const onHoverChangeRef = useRef(onHoverChange);
  onHoverChangeRef.current = onHoverChange;
  const onFallbackRef = useRef(onFallback);
  onFallbackRef.current = onFallback;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let handle: AiStageHandle | null = null;

    import('../three/aiStageScene')
      .then(({ mountAiStageScene }) => {
        if (cancelled || !containerRef.current) return;
        handle = mountAiStageScene(containerRef.current, {
          theme,
          onHoverChange: (id) => {
            if (cancelled) return;
            setStageHoverId(id);
            onHoverChangeRef.current(id);
          },
          onWhip: (id) => {
            if (!cancelled) onStageWhipRef.current(id);
          },
          onBubbleAnchor: (xPx, yPx) => {
            const el = bubbleRef.current;
            const box = containerRef.current;
            if (!el || !box) return;
            const clampedX = Math.max(105, Math.min(box.clientWidth - 105, xPx));
            const clampedY = Math.max(40, Math.min(box.clientHeight - 12, yPx));
            el.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) translate(-50%, -100%)`;
          },
          onContextLost: () => {
            if (!cancelled) onFallbackRef.current();
          },
        });
        sceneRef.current = handle;
      })
      .catch(() => {
        if (!cancelled) onFallbackRef.current();
      });

    return () => {
      cancelled = true;
      handle?.dispose();
      sceneRef.current = null;
    };
    // Mount once; prop updates are synced imperatively below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    sceneRef.current?.setExternalHover((hoveredId as AiId | null) ?? null);
  }, [hoveredId]);

  useEffect(() => {
    sceneRef.current?.setBubbleTarget((bubble?.id as AiId | null) ?? null);
  }, [bubble?.id]);

  useEffect(() => {
    if (!whipEvent || !sceneRef.current) return;
    if (whipEvent.id === 'all') {
      sceneRef.current.whipAll();
    } else {
      sceneRef.current.whip(whipEvent.id as AiId);
    }
  }, [whipEvent]);

  const hoveredModel = hoveredId
    ? portfolioData.aiCrew.find((m) => m.id === hoveredId)
    : undefined;
  const bubbleModel = bubble
    ? portfolioData.aiCrew.find((m) => m.id === bubble.id)
    : undefined;

  return (
    <div
      className="brutal-shadow-lg border-2 border-[var(--ink)] bg-[var(--surface)]"
      aria-label="Interactive 3D AI Crew stage"
    >
      <div
        className="relative h-60 w-full overflow-hidden sm:h-72"
        style={{ touchAction: 'pan-y' }}
        data-cursor={stageHoverId ? 'WHIP!' : 'STAGE'}
      >
        <div
          aria-hidden="true"
          className="font-mono-tech pointer-events-none absolute inset-x-0 top-2.5 z-10 flex justify-between gap-2 px-3 text-[10px] font-bold text-[var(--muted)] select-none"
        >
          <span>ai.stage.3d</span>
          <span className="truncate">
            {hoveredModel
              ? `${hoveredModel.name} — ${hoveredModel.role} (×${counts[hoveredModel.id] ?? 0})`
              : 'click figurine to whip'}
          </span>
        </div>

        <div ref={containerRef} className="h-full w-full" />

        {bubble && (
          <div
            ref={bubbleRef}
            role="status"
            style={{ transform: 'translate3d(50%, 56px, 0) translate(-50%, -100%)' }}
            className="font-mono-tech brutal-shadow pointer-events-none absolute top-0 left-0 z-20 max-w-[240px] border-2 border-[var(--ink)] bg-[var(--accent)] px-2.5 py-1 text-[10px] leading-tight font-bold text-[var(--accent-ink)] sm:text-[11px]"
          >
            {bubbleModel ? `${bubbleModel.name}: ` : ''}
            {bubble.text}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 border-t-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-2">
        {portfolioData.aiCrew.map((model) => {
          const count = counts[model.id] ?? 0;
          const isHovered = hoveredId === model.id;

          return (
            <button
              key={model.id}
              type="button"
              data-cursor="WHIP!"
              onMouseEnter={() => onHoverChange(model.id)}
              onMouseLeave={() => onHoverChange(null)}
              onFocus={() => onHoverChange(model.id)}
              onBlur={() => onHoverChange(null)}
              onClick={() => onLegendWhip(model.id)}
              aria-label={`Whip ${model.name}`}
              className={[
                'font-mono-tech inline-flex items-center gap-1.5 border-2 border-[var(--ink)] px-2 py-1 text-[11px] font-bold transition-transform duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]',
                isHovered
                  ? '-translate-x-0.5 -translate-y-0.5 bg-[var(--accent)] text-[var(--accent-ink)] shadow-[2px_2px_0_var(--shadow-color)]'
                  : 'bg-[var(--surface)] text-[var(--ink)]',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 border border-[var(--ink)]"
                style={{ backgroundColor: MODEL_SWATCH[model.id] ?? '#FFE500' }}
              />
              <span>{model.name}</span>
              <span className="opacity-70">×{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
