import { useEffect, useState } from 'react';
import { portfolioData } from '../data/portfolio';
import type { Theme } from '../hooks/useTheme';

type AiId = 'claude' | 'deepseek' | 'gpt' | 'glm' | 'qwen';

interface CharacterState {
  id: AiId;
  name: string;
  x: number;
  dir: 1 | -1;
  speed: number;
}

const INITIAL_CHARACTERS: CharacterState[] = [
  { id: 'claude', name: 'Claude', x: 14, dir: 1, speed: 0.044 },
  { id: 'deepseek', name: 'DeepSeek', x: 34, dir: -1, speed: 0.032 },
  { id: 'gpt', name: 'GPT', x: 54, dir: 1, speed: 0.05 },
  { id: 'glm', name: 'GLM', x: 72, dir: -1, speed: 0.038 },
  { id: 'qwen', name: 'Qwen', x: 88, dir: 1, speed: 0.058 },
];

interface HeroCharactersProps {
  theme: Theme;
}

export function HeroCharacters({ theme }: HeroCharactersProps) {
  const [chars, setChars] = useState<CharacterState[]>(INITIAL_CHARACTERS);
  const [pausedId, setPausedId] = useState<AiId | null>(null);
  const [jumpingId, setJumpingId] = useState<AiId | null>(null);
  const [yell, setYell] = useState<{ id: AiId; text: string } | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - lastTime, 48);
      lastTime = now;

      setChars((prev) =>
        prev.map((c) => {
          if (c.id === pausedId) return c;
          let nextX = c.x + c.dir * c.speed * (dt / 16.67);
          let nextDir = c.dir;

          if (nextX >= 92) {
            nextX = 92;
            nextDir = -1;
          } else if (nextX <= 8) {
            nextX = 8;
            nextDir = 1;
          }

          return { ...c, x: nextX, dir: nextDir };
        })
      );

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [pausedId]);

  // Random yelling bubbles from the 5 walking AI characters
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      const crew = portfolioData.aiCrew;
      const model = crew[Math.floor(Math.random() * crew.length)];
      const quote = model.quotes[Math.floor(Math.random() * model.quotes.length)];
      setYell({ id: model.id as AiId, text: `${model.name}: ${quote}` });
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  const handleJump = (id: AiId) => {
    setJumpingId(id);
    const model = portfolioData.aiCrew.find((m) => m.id === id);
    if (model) {
      const quote = model.quotes[Math.floor(Math.random() * model.quotes.length)];
      setYell({ id, text: `${model.name}: ${quote}` });
    }
    window.setTimeout(() => {
      setJumpingId((current) => (current === id ? null : current));
    }, 460);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="relative h-16 w-full overflow-visible border-t-2 border-[var(--ink)] bg-[var(--surface)]/60"
      aria-label="Interactive walking AI characters"
    >
      <div
        aria-hidden="true"
        className="font-mono-tech pointer-events-none absolute inset-x-0 bottom-1 flex justify-between px-4 text-[10px] text-[var(--muted)] select-none"
      >
        <span>ai.patrol (5)</span>
        <span>click to jump</span>
      </div>

      {chars.map((char) => {
        const isPaused = pausedId === char.id;
        const isJumping = jumpingId === char.id;
        const isYelling = yell?.id === char.id;
        const model = portfolioData.aiCrew.find((m) => m.id === char.id);
        const hoverText = `${char.name}: ${model?.quotes[0] ?? 'working...'}`;
        const bubbleText = isPaused ? hoverText : isYelling ? yell.text : null;

        return (
          <button
            key={char.id}
            type="button"
            data-cursor={char.name.toUpperCase()}
            onMouseEnter={() => setPausedId(char.id)}
            onMouseLeave={() => setPausedId(null)}
            onFocus={() => setPausedId(char.id)}
            onBlur={() => setPausedId(null)}
            onClick={() => handleJump(char.id)}
            style={{ left: `${char.x}%` }}
            aria-label={`Interactive AI character: ${char.name}`}
            className="absolute bottom-2 -translate-x-1/2 focus:outline-none"
          >
            {bubbleText && (
              <span className="font-mono-tech brutal-shadow pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 border-2 border-[var(--ink)] bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap text-[var(--accent-ink)]">
                {bubbleText}
              </span>
            )}

            <div
              className={[
                isJumping ? 'animate-char-jump' : isPaused ? '' : 'animate-char-bob',
              ].join(' ')}
              style={{
                transform: char.dir === -1 ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              <AiSprite id={char.id} isDark={isDark} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AiSprite({ id, isDark }: { id: AiId; isDark: boolean }) {
  const stroke = isDark ? '#F5F5F0' : '#121212';
  const eye = isDark ? '#FFE500' : '#121212';

  if (id === 'claude') {
    return (
      <svg width="34" height="32" viewBox="0 0 17 16" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="1" y="6" width="2" height="4" fill="#D97757" stroke={stroke} strokeWidth="0.8" />
        <rect x="14" y="6" width="2" height="4" fill="#D97757" stroke={stroke} strokeWidth="0.8" />
        <rect x="3" y="2" width="11" height="10" fill="#D97757" stroke={stroke} strokeWidth="0.9" />
        <rect x="5" y="5" width="2" height="3" fill={eye} />
        <rect x="10" y="5" width="2" height="3" fill={eye} />
        <rect x="4" y="12" width="2" height="3" fill="#D97757" stroke={stroke} strokeWidth="0.8" />
        <rect x="7" y="12" width="2" height="3" fill="#D97757" stroke={stroke} strokeWidth="0.8" />
        <rect x="11" y="12" width="2" height="3" fill="#D97757" stroke={stroke} strokeWidth="0.8" />
      </svg>
    );
  }

  if (id === 'deepseek') {
    return (
      <svg width="34" height="32" viewBox="0 0 17 16" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="7" y="1" width="3" height="2" fill="#60A5FA" stroke={stroke} strokeWidth="0.8" />
        <rect x="3" y="3" width="11" height="9" fill="#3B82F6" stroke={stroke} strokeWidth="0.9" />
        <rect x="1" y="6" width="2" height="4" fill="#60A5FA" stroke={stroke} strokeWidth="0.8" />
        <rect x="6" y="6" width="2" height="2" fill={eye} />
        <rect x="10" y="6" width="2" height="2" fill={eye} />
        <rect x="5" y="12" width="2" height="3" fill="#3B82F6" stroke={stroke} strokeWidth="0.8" />
        <rect x="10" y="12" width="2" height="3" fill="#3B82F6" stroke={stroke} strokeWidth="0.8" />
      </svg>
    );
  }

  if (id === 'glm') {
    return (
      <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
        <polygon points="3,4 3,1 6,4" fill="#A855F7" stroke={stroke} strokeWidth="0.8" />
        <polygon points="13,4 13,1 10,4" fill="#A855F7" stroke={stroke} strokeWidth="0.8" />
        <rect x="3" y="4" width="10" height="8" fill="#A855F7" stroke={stroke} strokeWidth="0.9" />
        <rect x="5" y="6" width="2" height="3" fill={eye} />
        <rect x="9" y="6" width="2" height="3" fill={eye} />
        <rect x="5" y="12" width="2" height="3" fill="#A855F7" stroke={stroke} strokeWidth="0.8" />
        <rect x="9" y="12" width="2" height="3" fill="#A855F7" stroke={stroke} strokeWidth="0.8" />
      </svg>
    );
  }

  if (id === 'qwen') {
    return (
      <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="2" y="4" width="12" height="8" fill="#F59E0B" stroke={stroke} strokeWidth="0.9" />
        <rect x="4" y="6" width="3" height="2" fill={eye} />
        <rect x="9" y="6" width="3" height="2" fill={eye} />
        <rect x="6" y="9" width="4" height="1" fill={eye} />
        <rect x="4" y="12" width="2" height="3" fill="#F59E0B" stroke={stroke} strokeWidth="0.8" />
        <rect x="10" y="12" width="2" height="3" fill="#F59E0B" stroke={stroke} strokeWidth="0.8" />
      </svg>
    );
  }

  return (
    <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect
        x="7"
        y="1"
        width="2"
        height="2"
        fill={isDark ? '#FFE500' : '#10B981'}
        stroke={stroke}
        strokeWidth="0.8"
      />
      <rect x="3" y="3" width="10" height="9" fill="#10B981" stroke={stroke} strokeWidth="0.9" />
      <rect x="5" y="6" width="6" height="2" fill={eye} />
      <rect x="5" y="12" width="2" height="3" fill="#10B981" stroke={stroke} strokeWidth="0.8" />
      <rect x="9" y="12" width="2" height="3" fill="#10B981" stroke={stroke} strokeWidth="0.8" />
    </svg>
  );
}
