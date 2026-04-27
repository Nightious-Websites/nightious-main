# Nightious Instructions

Astro 5 + Tailwind v4 + TypeScript + GSAP site for `nightious.com`. Keep changes production-focused: SEO, accessibility, responsive behavior, and page speed.

## Commands

- `npm run dev` - local server
- `npm run build` - baseline correctness check; no separate unit test runner
- `npm run preview` - serve built site

## Workflow

- Check `git status --short --branch` first; never revert unrelated user changes.
- Read relevant files before editing; keep patches narrow and aligned with existing components, utilities, tokens, and motion patterns.
- Verify visual/routing changes in browser or preview when practical.
- For page adds/removes/renames in `src/pages/`, update SEO discovery surfaces: `public/llms.txt`, page SEO metadata, canonical/OG images, schema/breadcrumbs, and nav/footer links as applicable. Change `astro.config.mjs` for sitemap/robots behavior; generated `sitemap-index.xml` and `robots.txt` are not edited directly.

## Map

- Routes: `src/pages/`
- Layouts: `src/layouts/`
- Components: `src/components/`
- Service content: `src/content/services/`
- Service helpers: `src/utils/services.ts`, `src/utils/serviceTheme.ts`
- Public assets: `public/`
- Imported optimized assets: `src/assets/`

## Gotchas

- Service entry IDs include `.md`; use `entrySlug()` from `@/utils/services`.
- Do not add `slug` to service Zod schemas.
- `public/llms.txt` is static and manual.
- Hero backgrounds are image-based with CSS/canvas motion; do not reintroduce video backgrounds unless asked.

## Style

- Match the dark glass/aurora system.
- Keep copy concise and customer-facing.
- Use semantic HTML, accessible names, and reduced-motion support.
