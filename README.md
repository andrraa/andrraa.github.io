# Andra Ramadan — Portfolio

A 1-page Neobrutalist static portfolio built with React, TypeScript, Tailwind CSS v4, and Lenis.

Live site: [https://andrraa.github.io](https://andrraa.github.io)

## Highlights

- **Neobrutalism (Light + Dark)**: Warm paper in Light mode and deep carbon in Dark mode, with hard-offset shadows and zero-blur borders.
- **Interactive Hero**: Framed 16×16 pixel-art avatar and 5 patrolling pixel AI mascots (`Claude`, `DeepSeek`, `GPT`, `GLM`, `Qwen`) that yell dev complaints and jump on click.
- **Bento Tech Stack**: Asymmetric grid covering `Go`, `Laravel`, `PHP`, `Next.js`, `PostgreSQL`, `MySQL`, `SQL Server`, `Docker`, and `Git`.
- **AI Crew ("Whip the AI")**: Interactive meme section where AI models complain and can be whipped back to work.
- **Theme-Aware Custom Cursor**: Smooth `requestAnimationFrame` reticle on desktop fine pointers that adapts to Light/Dark mode and hover targets.

## Local Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — Start local Vite dev server
- `npm test` — Run Vitest unit tests
- `npm run build` — Typecheck and build static output to `dist/`

## Customize Content

Edit [src/data/portfolio.ts](src/data/portfolio.ts) to update bio copy, tech stack items, AI quotes, and contact links.
