---
tags: [nightious, project, astro, tailwind, typescript]
client: Nightious
stack: Astro 5, Tailwind v4, TypeScript, GSAP
status: pre-launch
---

# Nightious — Project Reference
IT & digital solutions company. Website: nightious.com
> Workspace conventions: `Websites/CLAUDE.md`. Paths below are relative to project root.

## Commands
`npm run dev` · `npm run build` · `npm run preview` — no test runner, `astro build` is the correctness check.

## Gotchas
`entry.id` includes `.md` — use `entrySlug()` from `@/utils/services`. Never add `slug` to Zod schemas.

## Workflow
1. Check `.claude/queue.md`
2. Search with `/qmd-mastery:qmd` skill
3. Write back — update queue + write findings to `docs/`

→ Query `orchestrator-protocol` for preflight, routing, and workflow details.

## Key Paths

| What | QMD Collection |
|------|----------------|
| Knowledge | `.claude/docs/` → `nightious-docs` |
| Rules | `.claude/rules/` → `nightious-rules` |
| Queue | `.claude/queue.md` |
| Brainstorms | `.claude/brainstorms/` |

## SEO Files — Maintenance Rules

| File | How generated | When to update |
|------|--------------|----------------|
| `sitemap-index.xml` | Auto at `astro build` | Edit `astro.config.mjs` `sitemap()` options |
| `robots.txt` | Auto at `astro build` | Edit `astro.config.mjs` `robotsTxt()` options |
| `public/llms.txt` | **Static — manual** | Update whenever a page is added, removed, or renamed |

**Rule:** Any time you add or remove a page in `src/pages/`, open `public/llms.txt` and add/remove the corresponding entry. Match the section: core pages → `## Pages`, audience bundle pages → `## Audience Pages`, service pages → `## Services`. Query `seo rules` in QMD for the full maintenance spec.

## QMD Lookup (query for details)

| Topic | Query |
|-------|-------|
| Site architecture | `site-overview` |
| Orchestrator protocol | `orchestrator-protocol` |
| Design system | `color-tokens` or `design-system` |
| SEO | `seo rules` |
| Astro gotchas | `astro-v5-gotchas` |
| Known issues | `known-issues` |