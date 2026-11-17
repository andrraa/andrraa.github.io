import { portfolioData, type TechItem } from '../data/portfolio';

const TONE_STYLES: Record<TechItem['tone'], string> = {
  yellow: 'bg-[#FFE500] text-[#121212] dark:bg-[#FFE500] dark:text-[#121212]',
  coral: 'bg-[#FF8A70] text-[#121212] dark:bg-[#FF5E3A] dark:text-[#121212]',
  sky: 'bg-[#93C5FD] text-[#121212] dark:bg-[#1E1E26] dark:text-[#F5F5F0]',
  mint: 'bg-[#86EFAC] text-[#121212] dark:bg-[#18181D] dark:text-[#F5F5F0]',
  paper: 'bg-[var(--surface)] text-[var(--ink)]',
};

const BADGE_STYLES: Record<TechItem['tone'], string> = {
  yellow: 'bg-[#121212] text-[#FFE500] dark:bg-[#0F0F12] dark:text-[#FFE500]',
  coral: 'bg-[#121212] text-[#FF8A70] dark:bg-[#0F0F12] dark:text-[#FF5E3A]',
  sky: 'bg-[#121212] text-[#93C5FD] dark:bg-[#FFE500] dark:text-[#121212]',
  mint: 'bg-[#121212] text-[#86EFAC] dark:bg-[#FF5E3A] dark:text-[#121212]',
  paper: 'bg-[var(--ink)] text-[var(--surface)]',
};

export function TechStack() {
  return (
    <section id="stack" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tech Stack</h2>
        <span className="font-mono-tech text-xs text-[var(--muted)]">
          {portfolioData.techStack.length} core tools
        </span>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {portfolioData.techStack.map((item) => {
          const isWide = item.span === 'wide';

          return (
            <div
              key={item.name}
              data-cursor={item.code}
              className={[
                'brutal-interactive flex flex-col justify-between border-2 border-[var(--ink)] p-3.5 sm:p-5',
                isWide ? 'col-span-2' : 'col-span-1',
                TONE_STYLES[item.tone],
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={[
                    'font-mono-tech inline-flex h-8 min-w-8 items-center justify-center border-2 border-[var(--ink)] px-1.5 text-[11px] font-bold tracking-wider sm:h-10 sm:min-w-10 sm:px-2 sm:text-xs',
                    BADGE_STYLES[item.tone],
                  ].join(' ')}
                >
                  {item.code}
                </span>

                <span className="font-mono-tech border-2 border-[var(--ink)] bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[var(--ink)] sm:px-2 sm:text-[10px]">
                  {item.category}
                </span>
              </div>

              <div className="mt-4 sm:mt-6">
                <h3 className="text-base font-bold tracking-tight sm:text-xl lg:text-2xl">
                  {item.name}
                </h3>
                <p className="font-mono-tech mt-1 text-[11px] opacity-80 sm:text-xs">
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
