import { Moon, Sun } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import type { Theme } from '../hooks/useTheme';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (id: string) => void;
}

export function Navbar({ theme, onToggleTheme, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--ink)] bg-[var(--bg)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#top"
          data-cursor="TOP"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#top');
          }}
          className="font-mono-tech border-2 border-[var(--ink)] bg-[var(--accent)] px-3 py-1 text-base font-bold tracking-tight text-[var(--accent-ink)] brutal-interactive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
        >
          {portfolioData.brand}
        </a>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <a
            href="#stack"
            data-cursor="STACK"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#stack');
            }}
            className="font-mono-tech hidden border-2 border-transparent px-2.5 py-1.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] sm:inline-flex"
          >
            Scope
          </a>
          <a
            href="#ai"
            data-cursor="WHIP"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#ai');
            }}
            className="font-mono-tech hidden border-2 border-transparent px-2.5 py-1.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] sm:inline-flex"
          >
            AI
          </a>
          <a
            href="#contact"
            data-cursor="PING"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#contact');
            }}
            className="font-mono-tech hidden border-2 border-transparent px-2.5 py-1.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] sm:inline-flex"
          >
            Contact
          </a>

          <button
            type="button"
            data-cursor={theme === 'dark' ? 'LIGHT' : 'DARK'}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="font-mono-tech brutal-interactive ml-1 flex items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
