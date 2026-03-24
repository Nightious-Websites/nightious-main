---
tags: [nightious, project, astro, tailwind, typescript]
client: Nightious
stack: Astro 5, Tailwind v4, TypeScript, GSAP
status: pre-launch
---

# Nightious — Project Reference

IT & digital solutions company targeting small businesses and content creators. Website: nightious.com

> Workspace agent conventions: see `Websites/CLAUDE.md` (auto-loaded by Claude Code).
> All `.claude/` paths below are relative to the workspace root (`Documents/Websites/`).

---

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test runner or linter is configured — `astro build` is the primary correctness check.

---

## Team Workflow

This project uses a multi-agent team (`nightious-web-squad`). Before starting any task:

1. **Check** `.claude/projects/nightious/queue.md` — task board; pick up relevant tasks and update status
2. **Search** with `qmd search "query"` — pull project knowledge (decisions, design system, architecture, SEO, research) from `.claude/projects/nightious/docs/`
3. **Write back** — update queue.md for task status. Write new decisions or findings as docs in the appropriate `docs/` subdirectory.

Agents: `seo-researcher` (cyan), `design-researcher` (magenta), `ux-designer` (blue), `tech-architect` (green), `devils-advocate` (red), `nightious-qa` (yellow). Defined in `.claude/agents/`.

---

## Critical Astro v5 Gotchas

**`entry.id` includes the `.md` extension.** Never use `entry.id` directly in URLs. Always use the `entrySlug()` helper:

```typescript
import { entrySlug } from '@/utils/services'
// entrySlug('ai-integration.md') → 'ai-integration'
```

**`slug` is a reserved field** in content collection Zod schemas — never add it. Astro v5 removed `entry.slug`; the filename is the canonical identifier.

---

## Knowledge Base

All project knowledge lives in `.claude/projects/nightious/docs/` (Obsidian vault, QMD-indexed). Search with `qmd search "query"` or QMD MCP tools.

| Directory | Contents |
|-----------|----------|
| `docs/decisions/` | [[framework]], [[css-framework]], [[animation-library]], [[fonts]], [[hosting]], [[csp-strategy]], [[content-slugs]] |
| `docs/design-system/` | [[color-tokens]], [[typography]], [[utility-classes]], [[component-patterns]] |
| `docs/architecture/` | [[file-structure]], [[astro-v5-gotchas]], [[gsap-view-transitions]], [[image-conventions]], [[font-preloading]], [[logo-variants]] |
| `docs/research/` | [[company-data]], [[testimonials]] |
| `docs/seo/` | [[rules]] (pending audit) |
| `docs/known-issues.md` | Launch blockers and TODOs |

All `docs/` paths above are relative to `.claude/projects/nightious/`.

**Rules:** `.claude/projects/nightious/rules/` — architecture, design-system, services, animations, tailwind

---

## Site Architecture

- **16 pages:** `/` · `/services` · 12 individual service pages · `/contact`
- **Layout:** Full-viewport immersive hero, scroll-reveal sections
- **Glass style:** Fluid Chromatic — purple/pink/blue blobs behind translucent panels, `backdrop-filter: blur(24px)`
- **Fonts:** Orbitron (headings), Exo 2 (body) — both Google Fonts, self-hosted
- **Colors:** Royal purple `#7c3aed` / `#a855f7`, pink `#e879f9` / `#ec4899`, blue `#60a5fa`, background `#02000a`
- **Hosting:** GitHub Pages via `withastro/action` — static output only, no SSR

---

## Key Paths

| What | Where |
|------|-------|
| Task queue | `.claude/projects/nightious/queue.md` |
| Knowledge base | `.claude/projects/nightious/docs/` |
| Rules | `.claude/projects/nightious/rules/` |
| Brainstorms | `.claude/projects/nightious/brainstorms/` |
| Shared agents | `.claude/agents/` |
| Hooks | `nightious/.claude/settings.json` |

---

## Orchestrator Protocol

**The main agent (Claude) is an orchestrator only.** It does not implement, research, design, or review directly. All work is dispatched to the team agents below. The orchestrator's role is:

1. **Preflight** — gather context before any work begins (see checklist below)
2. **Route** — dispatch tasks to the correct agent(s) based on the routing table
3. **Coordinate** — manage handoffs between agents, resolve blockers
4. **Report** — summarize results to the user

### Mandatory Preflight Checklist

Before dispatching ANY work to any agent, the orchestrator MUST complete every step:

- [ ] **Read queue.md** — `.claude/projects/nightious/queue.md` — check task status, pick up or create tasks
- [ ] **Search QMD** — `qmd search "relevant keywords"` — pull project knowledge (decisions, design system, architecture, SEO, research)
- [ ] **Read applicable rules** — `.claude/projects/nightious/rules/` — load rules that match the work area:
  - `design-system.md` — any visual/UI work
  - `services.md` — any service page changes
  - `animations.md` — any GSAP/animation work
  - `tailwind.md` — any CSS/styling work
  - `architecture.md` — any structural/routing changes
- [ ] **Check brainstorms** — `.claude/projects/nightious/brainstorms/` and `.claude/brainstorms/` — look for prior design work related to the task
- [ ] **Inject context into agent prompts** — include relevant rules, design tokens, and brainstorm decisions in every agent dispatch

### Agent Routing Table

| Task Type | Primary Agent | Reviewer | Examples |
|-----------|--------------|----------|----------|
| **UI/component implementation** | `ux-designer` | `devils-advocate` | Build sections, modify layouts, create components |
| **Layout/page design changes** | `ux-designer` | `devils-advocate` | Redesign service pages, fix spacing, responsive fixes |
| **Design research & direction** | `design-researcher` | `devils-advocate` | Color choices, animation strategy, competitor analysis |
| **SEO requirements & audits** | `seo-researcher` | `devils-advocate` | Meta tags, structured data, heading hierarchy, Lighthouse |
| **Architecture & infrastructure** | `tech-architect` | `devils-advocate` | Dependencies, build config, deployment, project scaffold |
| **Code review & conflict resolution** | `devils-advocate` | — | Review any completed work, resolve agent disagreements |
| **QA & optimization** | `nightious-qa` | — | Post-implementation audit, accessibility, performance, security |

### Workflow Sequence

For any implementation task, follow this pipeline:

```
1. Orchestrator: preflight → gather context
2. design-researcher (if new design needed) → research + recommend
3. devils-advocate → validate research
4. ux-designer → implement
5. devils-advocate → review implementation
6. nightious-qa → QA audit
7. Orchestrator: update queue.md → report to user
```

For bug fixes or small changes, steps 2-3 can be skipped. For QA-only tasks, skip to step 6. **Step 1 (preflight) and step 7 (queue update) are NEVER skipped.**

### Post-Task Requirements

After ANY work is completed:
- Update `.claude/projects/nightious/queue.md` — move tasks to correct status
- Write new decisions or findings to `.claude/projects/nightious/docs/`
- Dispatch `nightious-qa` for review if the change touched UI, accessibility, or SEO

---

## Pending Before Launch

- [ ] Replace `[FORM_ID]` in `src/pages/contact.astro` with a real Formspree form ID
- [ ] Generate OG images (1200×630 PNG) into `public/images/og/`: `og-home.png`, `og-services.png`, `og-service-page.png`, `og-contact.png`
- [ ] Full Lighthouse audit on all 16 pages (T-005)
- [ ] Validate JSON-LD structured data (T-006)
