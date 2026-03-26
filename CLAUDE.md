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

## QMD Lookup (query for details)

| Topic | Query |
|-------|-------|
| Site architecture | `site-overview` |
| Orchestrator protocol | `orchestrator-protocol` |
| Design system | `color-tokens` or `design-system` |
| SEO | `seo rules` |
| Astro gotchas | `astro-v5-gotchas` |
| Known issues | `known-issues` |