# Bundle Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 3 audience-targeted landing pages (/for-businesses, /for-creators, /for-individuals) with an interactive "Living Grid" bento layout, 3D tilt effects, and cursor-tracking glow.

**Architecture:** A shared `BundleLayout.astro` wraps `BaseLayout.astro`. Each page passes audience-specific service data to reusable section components (`BundleHero`, `LivingGrid`, `CrossSell`). GSAP handles all animations with established `astro:page-load` / `astro:before-swap` lifecycle.

**Tech Stack:** Astro 5 . Tailwind v4 . GSAP + ScrollTrigger . Existing CSS tokens from `global.css`

**Verification:** No test runner -- `npm run build` is the correctness check after each task.

**Spec:** `docs/superpowers/specs/2026-03-25-bundle-pages-design.md`

---

## File Map

| File | Action | What it does |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Add 3 accent color tokens |
| `src/layouts/BundleLayout.astro` | **Create** | Shared layout extending BaseLayout, passes accent color via CSS custom property |
| `src/components/sections/BundleHero.astro` | **Create** | Hero section with particle field in accent color |
| `src/components/sections/LivingGrid.astro` | **Create** | Bento grid with tiles, GSAP tilt/glow/expand |
| `src/components/sections/CrossSell.astro` | **Create** | "Not what you're looking for?" banner |
| `src/pages/for-businesses.astro` | **Create** | Businesses bundle page (10 services, blue) |
| `src/pages/for-creators.astro` | **Create** | Creators bundle page (9 services, pink) |
| `src/pages/for-individuals.astro` | **Create** | Individuals bundle page (5 services, green) |
| `src/components/ui/NavBar.astro` | Modify | Add 3 color-coded bundle pills |

---

## Task 1: Add accent color tokens to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add accent tokens after existing design tokens**

In `src/styles/global.css`, inside the `:root` block (after line 48, after `--glass-shadow-ring`), add:

```css
  /* Bundle accent colors (RGB tuples for rgba() usage) */
  --color-accent-business:   59, 130, 246;
  --color-accent-creator:    236, 72, 153;
  --color-accent-individual: 34, 197, 94;
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: No errors. Tokens are passive until used.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add bundle accent color tokens to global.css"
```

---

## Task 2: Create BundleLayout.astro

**Files:**
- Create: `src/layouts/BundleLayout.astro`

- [ ] **Step 1: Create the shared bundle layout**

This layout extends `BaseLayout.astro` and sets up the accent color as a CSS custom property on a wrapper div so all children can use `var(--accent)` and `var(--accent-rgb)`.

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro'

export interface Props {
  title: string
  description: string
  audience: string
  accentColor: string
  accentRgb: string
  ogImage?: string
}

const { title, description, audience, accentColor, accentRgb, ogImage } = Astro.props
---

<BaseLayout title={title} description={description} ogImage={ogImage}>
  <div style={`--accent: ${accentColor}; --accent-rgb: ${accentRgb};`}>
    <slot name="hero" />
    <slot name="grid" />
    <slot name="crosssell" />

    <!-- CTA -->
    <section class="py-16 text-center" style="background-color: var(--color-bg-deep);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 justify-center items-center flex-wrap">
        <a
          href="/services"
          class="btn-ghost cursor-pointer"
          style={`border-color: rgba(${accentRgb}, 0.4); color: rgba(${accentRgb}, 1);`}
        >
          View All Services &rarr;
        </a>
        <a href="/contact" class="btn-primary cursor-pointer">Talk to Us &rarr;</a>
      </div>
    </section>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BundleLayout.astro
git commit -m "feat: create BundleLayout extending BaseLayout with accent color support"
```

---

## Task 3: Create BundleHero.astro

**Files:**
- Create: `src/components/sections/BundleHero.astro`

- [ ] **Step 1: Create the hero section component**

```astro
---
interface Props {
  audience: string
  headline: string
  tagline: string
  accentRgb: string
  serviceCount: number
}

const { audience, headline, tagline, accentRgb, serviceCount } = Astro.props
---

<section
  class="relative py-24 lg:py-32 overflow-hidden"
  aria-label={`Services for ${audience}`}
  style="background-color: var(--color-bg-deep);"
>
  <div
    class="absolute inset-0 pointer-events-none"
    style={`background-image: radial-gradient(circle, rgba(${accentRgb}, 0.4) 1px, transparent 1px); background-size: 28px 28px; opacity: 0.15;`}
    aria-hidden="true"
  ></div>
  <div
    class="absolute inset-0 pointer-events-none"
    style={`background: radial-gradient(ellipse at center, rgba(${accentRgb}, 0.1) 0%, transparent 65%);`}
    aria-hidden="true"
  ></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p class="font-display text-xs tracking-[0.25em] mb-4" style={`color: rgba(${accentRgb}, 0.8);`}>
      FOR {audience.toUpperCase()}
    </p>
    <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wide mb-4" style="color: var(--color-text-primary);">
      {headline}
    </h1>
    <p class="text-base sm:text-lg max-w-2xl mx-auto" style="color: var(--color-text-muted);">
      {serviceCount} services {tagline}
    </p>
  </div>
</section>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/BundleHero.astro
git commit -m "feat: create BundleHero with accent-colored particle field"
```

---

## Task 4: Create LivingGrid.astro -- HTML structure, CSS, and GSAP

**Files:**
- Create: `src/components/sections/LivingGrid.astro`

This is the most complex component. It renders the bento grid with hero/standard/compact tiers and includes all GSAP interactions (tilt, glow, stagger, expand overlay).

- [ ] **Step 1: Create the complete LivingGrid component**

The component receives service arrays and accent color. All tile data (slug, title, description, features) is stored as `data-*` attributes on each tile button so the expand overlay can read them via safe DOM access (no innerHTML needed).

Key patterns:
- Each tile is a `<button>` with `data-slug`, `data-title`, `data-description`, `data-features` (JSON) attributes
- The expand overlay reads these attributes with `dataset` and builds DOM nodes with `createElement`/`textContent`
- GSAP handles staggered entrance, cursor-tracking glow, 3D tilt, and expand animation
- `AbortController` cleans up the `mousemove` listener on `astro:before-swap`
- `prefers-reduced-motion` and mobile checks skip animations appropriately

The tile markup, `<style>` block, and `<script>` block are all in one file. The implementer should follow the spec Section 3 closely for grid structure (responsive columns, tile types, FLIP overlay approach, interactions).

**Important implementation details:**

Grid columns:
- Desktop (lg+): `lg:grid-cols-[1.5fr_1fr_1fr]` for 3-col, `md:grid-cols-[1.5fr_1fr]` for 2-col (Individuals)
- Tablet (md-lg): `md:grid-cols-2`
- Mobile: `grid-cols-1`

Compact row uses CSS custom property trick for dynamic columns:
```css
@media (min-width: 768px) {
  [style*="--compact-cols"] {
    grid-template-columns: var(--compact-cols);
  }
}
```

Expand overlay approach (NOT grid-column animation):
1. Read tile data from `data-*` attributes
2. Build overlay content with `document.createElement` and `textContent` (safe DOM -- no innerHTML)
3. Show fixed overlay panel centered on screen
4. Dim background with backdrop div
5. Close on backdrop click, close button, or Escape key

Light reflection CSS:
```css
.grid-tile::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--reflect-x, 50%) var(--reflect-y, 50%),
    rgba(255,255,255,0.06) 0%, transparent 60%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.grid-tile:hover::after { opacity: 1; }
```

GSAP lifecycle:
```js
let gridTl: gsap.core.Timeline | null = null
let controller: AbortController | null = null

document.addEventListener('astro:before-swap', () => {
  gridTl?.kill(); gridTl = null
  controller?.abort(); controller = null
})
document.addEventListener('astro:page-load', initLivingGrid)
```

Noscript fallback: `<noscript><style>.grid-tile { opacity: 1 !important; }</style></noscript>`

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/LivingGrid.astro
git commit -m "feat: create LivingGrid bento component with GSAP tilt, glow, and expand overlay"
```

---

## Task 5: Create CrossSell.astro

**Files:**
- Create: `src/components/sections/CrossSell.astro`

- [ ] **Step 1: Create the cross-sell banner component**

```astro
---
interface CrossSellBundle {
  href: string
  label: string
  accentRgb: string
  count: number
}

interface Props {
  bundles: CrossSellBundle[]
}

const { bundles } = Astro.props
---

<section class="py-12" style="background-color: var(--color-bg-deep);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p class="text-sm mb-6" style="color: var(--color-text-muted);">Not quite what you're looking for?</p>
    <div class="flex gap-4 justify-center flex-wrap">
      {bundles.map(b => (
        <a
          href={b.href}
          class="glass card-hover px-6 py-4 text-center rounded-lg"
          style={`border-color: rgba(${b.accentRgb}, 0.2);`}
        >
          <p class="font-display text-sm mb-1" style={`color: rgba(${b.accentRgb}, 1);`}>
            {b.label} &rarr;
          </p>
          <p class="text-xs" style="color: var(--color-text-muted);">{b.count} services</p>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/CrossSell.astro
git commit -m "feat: create CrossSell banner component for bundle pages"
```

---

## Task 6: Create the For Businesses page

**Files:**
- Create: `src/pages/for-businesses.astro`

- [ ] **Step 1: Create the page with all 10 service entries**

Each service object needs: `slug`, `title`, `icon` (Heroicons outline SVG path), `tier` (`hero`/`standard`/`compact`), `description` (audience-tailored), `features` (3-4 string array).

Use the service-to-bundle mapping from spec Section 2 (For Businesses table) for descriptions and tier assignments. Use Heroicons outline paths for each service's icon field.

The page imports `BundleLayout`, `BundleHero`, `LivingGrid`, `CrossSell` and wires them together via named slots. See spec Section 2 for the full service data.

Key values:
- `accentRgb = '59, 130, 246'` (blue)
- `accentColor = '#3b82f6'`
- `columnCount = 3`
- Hero service: AI Integration
- Cross-sell: Creators (pink) + Individuals (green)

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: `/for-businesses` route appears in build output.

- [ ] **Step 3: Commit**

```bash
git add src/pages/for-businesses.astro
git commit -m "feat: create For Businesses bundle page with 10 services"
```

---

## Task 7: Create For Creators and For Individuals pages

**Files:**
- Create: `src/pages/for-creators.astro`
- Create: `src/pages/for-individuals.astro`

- [ ] **Step 1: Create for-creators.astro**

Same pattern as Task 6 but:
- Pink accent: `accentRgb = '236, 72, 153'`, `accentColor = '#ec4899'`
- 9 services, Streaming Consultation as hero tile
- `columnCount = 3`
- Use creator-tailored descriptions from spec Section 2
- Cross-sell: Businesses (blue) + Individuals (green)

- [ ] **Step 2: Create for-individuals.astro**

Same pattern but:
- Green accent: `accentRgb = '34, 197, 94'`, `accentColor = '#22c55e'`
- 5 services, Online Privacy as hero tile
- `columnCount = 2` (fewer services, 2-column grid)
- Use individual-tailored descriptions from spec Section 2
- Cross-sell: Businesses (blue) + Creators (pink)

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: All 3 bundle routes appear. Page count = 19.

- [ ] **Step 4: Commit**

```bash
git add src/pages/for-creators.astro src/pages/for-individuals.astro
git commit -m "feat: create For Creators and For Individuals bundle pages"
```

---

## Task 8: Add bundle pills to NavBar

**Files:**
- Modify: `src/components/ui/NavBar.astro`

- [ ] **Step 1: Add bundleLinks array in frontmatter**

After the `services` array (line 22), add:

```typescript
const bundleLinks = [
  { href: '/for-businesses', label: 'Businesses', rgb: '59, 130, 246', color: '#93c5fd' },
  { href: '/for-creators', label: 'Creators', rgb: '236, 72, 153', color: '#f9a8d4' },
  { href: '/for-individuals', label: 'Individuals', rgb: '34, 197, 94', color: '#86efac' },
]
```

- [ ] **Step 2: Add pills to desktop nav**

In the desktop nav (inside `<div class="hidden md:flex items-center gap-8">`), after the Home link and before the Services dropdown div, add:

```astro
{bundleLinks.map(b => (
  <a
    href={b.href}
    aria-current={isActive(b.href) ? 'page' : undefined}
    class="nav-link text-xs font-semibold tracking-wide transition-colors px-3 py-1.5 rounded-md"
    style={isActive(b.href)
      ? `background: rgba(${b.rgb}, 0.2); border: 1px solid rgba(${b.rgb}, 0.3); color: ${b.color}; font-family: 'Exo 2', sans-serif;`
      : `background: rgba(${b.rgb}, 0.1); color: ${b.color}; font-family: 'Exo 2', sans-serif;`
    }
  >
    {b.label}
  </a>
))}
```

- [ ] **Step 3: Add pills to mobile drawer**

In the mobile drawer nav, after the Home link and before the services accordion, add:

```astro
<div class="flex flex-col gap-1 py-2">
  {bundleLinks.map(b => (
    <a
      href={b.href}
      aria-current={isActive(b.href) ? 'page' : undefined}
      class="drawer-link py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors"
      style={`color: ${b.color}; font-family: 'Exo 2', sans-serif; border-left: 2px solid rgba(${b.rgb}, 0.5); padding-left: 12px;`}
    >
      For {b.label}
    </a>
  ))}
</div>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/NavBar.astro
git commit -m "feat: add color-coded bundle pills to nav bar (desktop + mobile)"
```

---

## Task 9: Final build + visual review

- [ ] **Step 1: Full production build**

```bash
cd /home/xcoder/Documents/Websites/nightious && npm run build
```

Expected: 19 pages, no errors.

- [ ] **Step 2: Preview and checklist**

```bash
npm run dev
```

| Route | Check |
|-------|-------|
| Nav bar | 3 color-coded pills: blue Businesses, pink Creators, green Individuals |
| `/for-businesses` | Blue hero, 10-service grid (1 hero + 4 standard + 5 compact), cross-sell |
| `/for-creators` | Pink hero, 9-service grid (1 hero + 4 standard + 4 compact), cross-sell |
| `/for-individuals` | Green hero, 5-service grid (1 hero + 2 standard + 2 compact, 2-col), cross-sell |
| Living Grid (desktop) | Cards tilt on hover, cursor glow follows mouse, click opens overlay |
| Living Grid (mobile) | Single column, no tilt, tap opens overlay |
| Cross-sell | Other bundle links in their accent colors |
| CTA section | "View All Services" + "Talk to Us" buttons |

- [ ] **Step 3: Reduced-motion check**

DevTools -> Rendering -> `prefers-reduced-motion: reduce`. Tiles appear immediately, no tilt/glow, expand is instant.

- [ ] **Step 4: Mobile check (375px)**

DevTools device toolbar -> 375px width. Single column grid, bundle pills in mobile drawer with colored left borders.
