import { ArrowUp } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t-2 border-[var(--ink)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <div className="font-mono-tech text-xs text-[var(--muted)]">
          © {year} {portfolioData.name}
        </div>

        <button
          type="button"
          data-cursor="TOP"
          onClick={() => onNavigate('#top')}
          className="font-mono-tech brutal-interactive inline-flex items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
        >
          <span>Back to top</span>
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </footer>
  );
}
