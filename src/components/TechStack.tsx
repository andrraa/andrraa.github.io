import { portfolioData, type CapabilityItem } from '../data/portfolio';

const TONE_STYLES: Record<CapabilityItem['tone'], string> = {
  yellow: 'bg-[#FFE500] text-[#121212] dark:bg-[#FFE500] dark:text-[#121212]',
  coral: 'bg-[#FF8A70] text-[#121212] dark:bg-[#FF5E3A] dark:text-[#121212]',
  sky: 'bg-[#93C5FD] text-[#121212] dark:bg-[#1E1E26] dark:text-[#F5F5F0]',
  paper: 'bg-[var(--surface)] text-[var(--ink)]',
};

const BADGE_STYLES: Record<CapabilityItem['tone'], string> = {
  yellow: 'bg-[#121212] text-[#FFE500] dark:bg-[#0F0F12] dark:text-[#FFE500]',
  coral: 'bg-[#121212] text-[#FF8A70] dark:bg-[#0F0F12] dark:text-[#FF5E3A]',
  sky: 'bg-[#121212] text-[#93C5FD] dark:bg-[#FFE500] dark:text-[#121212]',
  paper: 'bg-[var(--ink)] text-[var(--surface)]',
};

export function TechStack() {
  return (
    <section id="stack" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What I Handle</h2>
        <span className="font-mono-tech text-xs text-[var(--muted)]">
          Problems &gt; logos
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {portfolioData.capabilities.map((item) => (
          <div
            key={item.code}
            data-cursor={item.code}
            className={[
              'brutal-interactive flex flex-col justify-between border-2 border-[var(--ink)] p-4 sm:p-6',
              TONE_STYLES[item.tone],
            ].join(' ')}
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={[
                    'font-mono-tech inline-flex h-8 min-w-8 items-center justify-center border-2 border-[var(--ink)] px-2 text-xs font-bold',
                    BADGE_STYLES[item.tone],
                  ].join(' ')}
                >
                  {item.code}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-85">{item.summary}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {item.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono-tech border-2 border-[var(--ink)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-bold text-[var(--ink)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
