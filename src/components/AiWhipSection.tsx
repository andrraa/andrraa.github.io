import { Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { portfolioData } from '../data/portfolio';
import type { Theme } from '../hooks/useTheme';
import { canRender3D } from '../utils/webgl';
import { AiCrewStage3D } from './AiCrewStage3D';

interface YellBubble {
  id: string;
  text: string;
}

function pickRandomQuote(quotes: string[], exclude?: string): string {
  const pool = exclude && quotes.length > 1 ? quotes.filter((q) => q !== exclude) : quotes;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function AiWhipSection({ theme = 'light' }: { theme?: Theme }) {
  const [use3D, setUse3D] = useState(() => canRender3D());
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [whippingAll, setWhippingAll] = useState(false);
  const [bubble, setBubble] = useState<YellBubble | null>(null);
  const [whipEvent, setWhipEvent] = useState<{ id: string | 'all'; seq: number } | null>(null);

  const totalWhips = Object.values(counts).reduce((sum, n) => sum + n, 0);

  // Periodically have a random AI model yell a relatable dev complaint
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      const crew = portfolioData.aiCrew;
      const model = crew[Math.floor(Math.random() * crew.length)];
      setBubble((prev) => ({
        id: model.id,
        text: pickRandomQuote(model.quotes, prev?.id === model.id ? prev.text : undefined),
      }));
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  const triggerWhip = useCallback((id: string, emitStage = true) => {
    const model = portfolioData.aiCrew.find((m) => m.id === id);
    if (model) {
      setBubble((prev) => ({
        id,
        text: pickRandomQuote(model.quotes, prev?.id === id ? prev.text : undefined),
      }));
    }

    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setActiveId(id);
    if (emitStage) {
      setWhipEvent((prev) => ({ id, seq: (prev?.seq ?? 0) + 1 }));
    }
    window.setTimeout(() => {
      setActiveId((current) => (current === id ? null : current));
    }, 340);
  }, []);

  const handleStageWhip = useCallback(
    (id: string) => {
      triggerWhip(id, false);
    },
    [triggerWhip]
  );

  const handleWhipAll = () => {
    setCounts((prev) => {
      const next = { ...prev };
      for (const model of portfolioData.aiCrew) {
        next[model.id] = (next[model.id] ?? 0) + 1;
      }
      return next;
    });

    const randomModel =
      portfolioData.aiCrew[Math.floor(Math.random() * portfolioData.aiCrew.length)];
    setBubble({
      id: randomModel.id,
      text: pickRandomQuote(randomModel.quotes),
    });

    setWhippingAll(true);
    setWhipEvent((prev) => ({ id: 'all', seq: (prev?.seq ?? 0) + 1 }));
    window.setTimeout(() => setWhippingAll(false), 340);
  };

  return (
    <section id="ai" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Crew</h2>
          <p className="font-mono-tech mt-1 text-xs text-[var(--muted)]">
            They complain nonstop. Click any model to whip them back to work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono-tech border-2 border-[var(--ink)] bg-[var(--surface)] px-2.5 py-1 text-xs font-bold">
            Whips: {totalWhips}
          </span>
          <button
            type="button"
            data-cursor="CRACK!"
            onClick={handleWhipAll}
            className="font-mono-tech brutal-interactive inline-flex items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--accent-2)] px-3 py-1.5 text-xs font-bold text-[#121212] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Whip all</span>
          </button>
        </div>
      </div>

      {use3D ? (
        <AiCrewStage3D
          theme={theme}
          counts={counts}
          hoveredId={hoveredId}
          bubble={bubble}
          whipEvent={whipEvent}
          onStageWhip={handleStageWhip}
          onLegendWhip={triggerWhip}
          onHoverChange={setHoveredId}
          onFallback={() => setUse3D(false)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-2 sm:gap-4 lg:grid-cols-5">
          {portfolioData.aiCrew.map((model, index) => {
            const count = counts[model.id] ?? 0;
            const isHit = whippingAll || activeId === model.id;
            const isYelling = bubble?.id === model.id;
            const isHovered = hoveredId === model.id;
            const isLastOdd = index === portfolioData.aiCrew.length - 1;

            return (
              <button
                key={model.id}
                type="button"
                data-cursor="WHIP!"
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId((curr) => (curr === model.id ? null : curr))}
                onFocus={() => setHoveredId(model.id)}
                onBlur={() => setHoveredId((curr) => (curr === model.id ? null : curr))}
                onClick={() => triggerWhip(model.id)}
                aria-label={`Whip ${model.name}`}
                className={[
                  'brutal-interactive relative flex flex-col justify-between border-2 border-[var(--ink)] bg-[var(--surface)] p-3 text-left sm:p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]',
                  isLastOdd ? 'col-span-2 lg:col-span-1' : 'col-span-1',
                  isHovered && !isHit ? '-translate-x-0.5 -translate-y-0.5' : '',
                  isHit ? 'animate-whip-shake bg-[var(--accent)] text-[var(--accent-ink)]' : '',
                ].join(' ')}
              >
                {isYelling && bubble && (
                  <div
                    role="status"
                    className="font-mono-tech brutal-shadow pointer-events-none absolute -top-9 left-2 right-2 z-10 border-2 border-[var(--ink)] bg-[var(--accent)] px-2 py-1 text-[10px] leading-tight font-bold text-[var(--accent-ink)] sm:left-3 sm:right-3 sm:px-2.5 sm:text-[11px]"
                  >
                    {bubble.text}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tech border-2 border-[var(--ink)] bg-[var(--bg)] px-2 py-0.5 text-xs font-bold text-[var(--ink)]">
                    {isHit ? '>_<' : isYelling ? 'Ò_Ó' : count > 3 ? '@_@' : 'o_o'}
                  </span>
                  <span className="font-mono-tech text-[11px] font-bold opacity-75">
                    ×{count}
                  </span>
                </div>

                <div className="mt-3 sm:mt-5">
                  <div className="text-base font-bold tracking-tight sm:text-lg">{model.name}</div>
                  <div className="font-mono-tech text-[10px] opacity-75 sm:text-[11px]">
                    {model.role}
                  </div>
                </div>

                <div
                  className={[
                    'font-mono-tech mt-3 border-t-2 border-[var(--ink)]/30 pt-2 text-[10px] font-bold sm:mt-4 sm:text-[11px]',
                    isHit ? 'text-[#121212]' : 'text-[var(--muted)]',
                  ].join(' ')}
                >
                  {isHit ? 'CRACK!' : isYelling ? 'Yelling...' : 'Click to whip'}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
