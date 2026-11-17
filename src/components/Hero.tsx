import { ArrowDownRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import type { Theme } from '../hooks/useTheme';
import { HeroCharacters } from './HeroCharacters';

interface HeroProps {
  theme: Theme;
  onNavigate: (id: string) => void;
}

export function Hero({ theme, onNavigate }: HeroProps) {
  const isDark = theme === 'dark';

  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pt-10 pb-8 sm:px-6 sm:pt-16">
      <div className="brutal-shadow-lg border-2 border-[var(--ink)] bg-[var(--surface)]">
        <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 md:grid-cols-[1fr_220px] md:items-center md:p-12">
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono-tech inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-1 text-xs font-bold">
                <span className="inline-block h-2 w-2 bg-[var(--accent-2)]" />
                {portfolioData.name} — {portfolioData.role}
              </span>
              <span className="font-mono-tech text-xs text-[var(--muted)]">
                {portfolioData.location} / {portfolioData.availability}
              </span>
            </div>

            <h1 className="max-w-2xl text-3xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
              {portfolioData.hero.headline}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {portfolioData.hero.subtext}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                data-cursor="HELLO"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('#contact');
                }}
                className="brutal-interactive inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--accent-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
              >
                <span>{portfolioData.hero.primaryCta}</span>
                <ArrowDownRight className="h-4 w-4" strokeWidth={2.5} />
              </a>

              <a
                href="#stack"
                data-cursor="STACK"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('#stack');
                }}
                className="font-mono-tech brutal-interactive inline-flex items-center border-2 border-[var(--ink)] bg-[var(--bg)] px-5 py-3 text-sm font-bold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
              >
                {portfolioData.hero.secondaryCta}
              </a>
            </div>
          </div>

          {/* Pixel Art Portrait Frame */}
          <div className="mx-auto w-full max-w-[220px]">
            <div className="brutal-shadow border-2 border-[var(--ink)] bg-[var(--bg)] p-3">
              <div
                className={[
                  'flex aspect-square items-center justify-center border-2 border-[var(--ink)] p-2',
                  isDark ? 'bg-[#171717]' : 'bg-[#FFE500]',
                ].join(' ')}
              >
                <PixelAvatar isDark={isDark} />
              </div>
              <div className="font-mono-tech mt-2.5 flex items-center justify-between text-[11px] font-bold">
                <span>AVATAR.PX</span>
                <span className="text-[var(--muted)]">16×16</span>
              </div>
            </div>
          </div>
        </div>

        <HeroCharacters theme={theme} />
      </div>
    </section>
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
