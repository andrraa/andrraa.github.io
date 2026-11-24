import { ArrowDownRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import type { Theme } from '../hooks/useTheme';
import { Avatar3D } from './Avatar3D';
import { HeroCharacters } from './HeroCharacters';

interface HeroProps {
  theme: Theme;
  onNavigate: (id: string) => void;
}

export function Hero({ theme, onNavigate }: HeroProps) {
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

          {/* Interactive 3D Voxel Portrait (with 2D Pixel Fallback) */}
          <Avatar3D theme={theme} />
        </div>

        <HeroCharacters theme={theme} />
      </div>
    </section>
  );
}
