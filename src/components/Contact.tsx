import { ArrowUpRight, Check, Clock, Copy, Mail } from 'lucide-react';
import { useState } from 'react';
import { portfolioData } from '../data/portfolio';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be blocked in insecure contexts; mailto link remains available.
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Contact</h2>
        <span className="font-mono-tech text-xs text-[var(--muted)]">Direct channels</span>
      </div>

      <div className="brutal-shadow-lg border-2 border-[var(--ink)] bg-[var(--surface)] p-6 sm:p-8">
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {portfolioData.contact.heading}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          {portfolioData.contact.subtext}
        </p>

        {/* Primary Email Row */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <a
            href={`mailto:${portfolioData.contact.email}`}
            data-cursor="MAIL"
            className="brutal-interactive flex flex-1 items-center justify-between gap-3 border-2 border-[var(--ink)] bg-[var(--accent)] px-4 py-3 text-[var(--accent-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            <span className="flex items-center gap-2.5 font-bold">
              <Mail className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span className="font-mono-tech text-sm break-all sm:text-base">
                {portfolioData.contact.email}
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          </a>

          <button
            type="button"
            data-cursor={copied ? 'COPIED' : 'COPY'}
            onClick={handleCopyEmail}
            aria-label="Copy email address"
            className="font-mono-tech brutal-interactive flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--bg)] px-4 py-3 text-sm font-bold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2.5} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" strokeWidth={2.5} />
                <span>Copy email</span>
              </>
            )}
          </button>
        </div>

        {/* Social / Git Links */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {portfolioData.contact.links.map((link) =>
            link.soon || !link.href ? (
              <div
                key={link.label}
                data-cursor={link.cursorLabel}
                aria-disabled="true"
                className="flex items-center justify-between border-2 border-dashed border-[var(--ink)]/50 bg-[var(--bg)]/60 px-4 py-3 text-[var(--muted)]"
              >
                <div>
                  <div className="text-sm font-bold">{link.label}</div>
                  <div className="font-mono-tech text-xs">{link.handle}</div>
                </div>
                <Clock className="h-4 w-4 shrink-0 opacity-70" strokeWidth={2.2} />
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={link.cursorLabel}
                className="brutal-interactive flex items-center justify-between border-2 border-[var(--ink)] bg-[var(--bg)] px-4 py-3 text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
              >
                <div>
                  <div className="text-sm font-bold">{link.label}</div>
                  <div className="font-mono-tech text-xs text-[var(--muted)]">{link.handle}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
