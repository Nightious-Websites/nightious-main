# Production Hardening Section — Detailed Implementation Log

## Purpose of this document

This document is a technical handoff artifact for future engineers and agents.
It captures, in detail, what was changed during the production hardening section, what was removed, what was added, and why each change was made.

The intent is to preserve implementation context so follow-up work can safely extend this foundation without re-discovering prior decisions.

---

## Scope covered

The hardening section touched five major areas:

1. **Delivery quality gates (CI + local checks)**
2. **Media/runtime performance controls**
3. **Accessibility automation and keyboard UX hardening**
4. **SEO/content metadata and internal linking improvements**
5. **Security + operational reliability controls**

---

## 1) Delivery quality gates (CI + local checks)

### Added

- **GitHub Actions workflow**: `.github/workflows/quality.yml`
  - Triggered on pull requests and pushes to `main`.
  - Runs:
    - dependency install (`npm ci`),
    - static build (`npm run build`),
    - media budget check (`npm run check:media`),
    - Playwright browser install,
    - accessibility check (`npm run check:a11y`),
    - Lighthouse CI (`npm run lhci`).

### Why

- Move quality checks from “manual best effort” to **merge/deploy gate**.
- Catch regressions in performance, accessibility, and payload growth before release.

### Operational effect

- Every PR/main push is validated against the same baseline checks.
- Local scripts mirror CI behavior to reduce “works on my machine” drift.

---

## 2) Media/runtime performance controls

### Added

- **Media utility module**: `src/utils/media.ts`
  - Implements managed autoplay and lazy video upgrade logic.
  - Restricts runtime work to explicitly opted-in elements via data attributes.

- **Media budget checker**: `scripts/check-media-budget.mjs`
  - Recursively scans `/public/videos`.
  - Enforces:
    - per-file size ceiling,
    - aggregate folder size ceiling.
  - Exits non-zero on violations.

### Changed

- **Base layout initialization**: `src/layouts/BaseLayout.astro`
  - Replaced broad replay behavior with explicit calls to media utility initializers.
  - Hooks page-load lifecycle once and keeps initialization scoped.

- **Video elements annotated for controlled behavior**:
  - `src/components/sections/Hero.astro`
  - `src/pages/contact.astro`
  - `src/pages/services/[slug].astro`
  - Added data attributes for managed autoplay and lazy upgrade.

### Why

- Previous broad autoplay handling reprocessed too many media nodes on navigation.
- New approach prevents unnecessary decode/rebuffer cost and respects device/user constraints (reduced-motion/save-data paths in utility logic).
- Media budgets prevent long-term payload creep.

### Removed / replaced behavior

- Removed reliance on generalized “replay all autoplay videos” strategy in layout runtime.
- Replaced with selective, opt-in, route-aware media initialization.

---

## 3) Accessibility automation and keyboard UX hardening

### Added

- **Accessibility scanner**: `scripts/check-a11y.mjs`
  - Launches local preview.
  - Runs Axe via Playwright against critical routes:
    - `/`, `/services`, `/contact`, `/blog/welcome`.
  - Fails process with violation details.

- **Playwright bootstrap script**: `scripts/ensure-playwright.sh`
  - Ensures browser binary presence before running local accessibility checks.
  - Prevents local failures caused by missing browser installation.

### Changed

- **NPM scripts** (`package.json`)
  - Added/updated:
    - `check:a11y`
    - `check:media`
    - `lhci`
    - `lhci:local`
    - `screenshot:capture`

- **Desktop nav keyboard behavior**: `src/components/ui/NavBar.astro`
  - Added keyboard support improvements in services dropdown:
    - open/focus on ArrowDown,
    - directional navigation with arrows,
    - Home/End item navigation.

- **Semantic/accessibility fixes from audit findings**:
  - `src/pages/services/index.astro`
    - removed invalid role assignment from service list container.
  - `src/pages/contact.astro`
    - replaced nested landmark usage that triggered landmark hierarchy violations.

### Why

- Accessibility must be validated continuously, not ad hoc.
- Keyboard interaction in complex navs is a frequent real-world failure point.
- Axe findings were turned into deterministic code fixes and CI checks.

---

## 4) SEO/content metadata and internal linking improvements

### Added

- **Blog structured data component**: `src/components/seo/SchemaBlogPosting.astro`
  - Emits `BlogPosting` JSON-LD for article pages.

### Changed

- **Blog detail template**: `src/pages/blog/[slug].astro`
  - Includes `SchemaBlogPosting`.
  - Adds a related-services block to strengthen blog → service internal linking.
  - Uses tag-informed mapping with fallback service links.

- **Content schema**: `src/content/config.ts`
  - Extended editorial metadata fields to support richer article SEO and consistency checks:
    - `updatedDate`
    - `canonical`
    - `ogImage` (with image handling support)

### Why

- Article pages should express explicit `BlogPosting` semantics for rich result compatibility.
- Internal links from informational content to conversion pages improve both crawl graph and user intent flow.
- Additional content fields support future editorial QA and consistent social previews.

---

## 5) Security + operational reliability controls

### Added / changed

- **Response security headers** moved/managed at platform layer: `vercel.json`
  - Includes CSP and other baseline headers (frame/referrer/content-type/HSTS/etc.).

- **Direct contact model**: `src/pages/contact.astro`
  - Contact form flow was removed.
  - Direct channels are now exposed (email, phone, consultation booking).

- **Env template update**: `.env.example`
  - Formspree-related environment variables were removed after the direct-contact migration.

- **Lighthouse route/assertion config**: `lighthouserc.json`
  - Expanded route coverage to major pages and service detail pages.
  - Enforced score thresholds and console-error visibility.

- **Chrome helper**: `scripts/ensure-chrome.sh`
  - Ensures Chrome is present for local LHCI automation.

- **Screenshot helper**: `scripts/capture-screenshot.mjs`
  - Provides deterministic full-page screenshots for QA/reporting workflows.

### Dependency hygiene hardening

- `package.json` and `package-lock.json` updates included:
  - dev tooling required for accessibility/perf workflows (`@axe-core/playwright`, `@playwright/test`, `@lhci/cli`),
  - package overrides to address vulnerable transitive dependencies used by audit tooling paths.

### Why

- Security controls are stronger and easier to audit in host headers than page-level ad hoc tags.
- Form endpoint misconfiguration is a direct conversion risk; fail-fast behavior prevents silent production breakage.
- Browser-dependent tooling must be bootstrap-capable in CI and local environments.

---

## File-by-file change ledger

### Added files

- `.github/workflows/quality.yml`
- `docs/project-review-2026-03-29.md`
- `docs/release-checklist.md`
- `docs/production-hardening-section-implementation-log.md` (this file)
- `scripts/check-media-budget.mjs`
- `scripts/check-a11y.mjs`
- `scripts/ensure-chrome.sh`
- `scripts/ensure-playwright.sh`
- `scripts/capture-screenshot.mjs`
- `src/components/seo/SchemaBlogPosting.astro`
- `src/utils/media.ts`

### Modified files

- `.env.example`
- `lighthouserc.json`
- `package.json`
- `package-lock.json`
- `src/components/sections/Hero.astro`
- `src/components/ui/NavBar.astro`
- `src/content/config.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/contact.astro`
- `src/pages/services/[slug].astro`
- `src/pages/services/index.astro`
- `vercel.json`

### Behavior removed/replaced

- Broad autoplay replay strategy in layout runtime was replaced by explicit media-manager initialization for opted-in video targets.
- Accessibility and performance validation shifted from primarily manual checks to scripted + CI-enforced checks.

---

## Validation strategy used during this section

Primary commands used repeatedly while iterating:

- `npm run build`
- `npm run check:media`
- `npm run check:a11y`
- `npm run lhci:local`
- `npm audit --omit=dev`

This combination validates:

- build integrity,
- media size budgets,
- route-level accessibility regression detection,
- multi-page Lighthouse posture,
- dependency vulnerability posture.

---

## Known constraints / follow-up recommendations

1. **CSP hardening depth**
   - Current CSP allows inline execution patterns for compatibility.
   - Recommended follow-up: migrate remaining inline script/style patterns to nonce/hash-compatible delivery and remove unsafe allowances incrementally.

2. **A11y coverage breadth**
   - Current automated route set covers high-value pages.
   - Recommended follow-up: extend to all service pages and key conversion funnels.

3. **SEO content depth**
   - Technical SEO scaffolding is substantially improved.
   - Recommended follow-up: increase service-supporting blog coverage and intentional internal-link density.

4. **Operational runbooks**
   - Existing docs/checklists are a strong baseline.
   - Recommended follow-up: add incident-response notes for form endpoint outages and CI gate failures.

---

## Handoff summary (for the next AI/engineer)

The production-hardening section established a strong baseline:

- CI quality gates exist and are enforceable.
- Media runtime behavior is scoped and budgeted.
- A11y checks are automated and keyboard UX is improved.
- SEO schema/internal links and editorial metadata are in place.
- Security headers and env-driven form reliability protections are implemented.

If continuing this work, prioritize:

1. stricter CSP posture,
2. broader accessibility route coverage,
3. richer supporting content and internal-link expansion,
4. continued dependency hygiene with periodic audit lockstep updates.

---

## Post-log update: Formspree and contact-form removal

After the initial hardening phase, the site was updated to remove all Formspree usage and eliminate on-site contact form flows.

### What was removed

- Removed `PUBLIC_FORMSPREE_ID` and all Formspree references from runtime and environment documentation.
- Removed the interactive contact form implementation from `src/pages/contact.astro`, including:
  - form markup and field controls,
  - client-side submission/fetch logic,
  - form-specific success/error state rendering.
- Removed Formspree-specific references from privacy/legal-content surfaces where the site described third-party form processing.
- Removed Formspree domains and form-action policy coupling from CSP/headers configuration.

### What replaced it

- Contact page now provides **direct contact channels** (email, phone, consultation booking) rather than a submission form.
- Privacy language was updated from “contact form processing” to “direct contact data handling”.
- LLM summary page language was updated from “inquiry form” to “direct contact options”.

### Why this change was made

- Product direction changed to a direct-contact model.
- Removing form middleware simplifies data flow and reduces external data processor dependencies for lead intake.
- Compliance and privacy documentation now matches actual data collection behavior.
