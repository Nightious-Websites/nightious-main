# Bundle Pages — Design Spec

> **Sub-project 1 of 2.** This spec covers the 3 audience-based bundle pages + navigation changes. Sub-project 2 (Homepage V2) will follow in a separate spec.

**Goal:** Create 3 audience-targeted landing pages that showcase Nightious services grouped by customer type, with tailored descriptions and an interactive "Living Grid" layout.

**Tech Stack:** Astro 5 · Tailwind v4 · GSAP + ScrollTrigger · Existing CSS tokens from `global.css`

---

## 1. Routes & Architecture

### New Pages
| Route | Audience | Accent Color | Service Count |
|-------|----------|-------------|---------------|
| `/for-businesses` | Businesses | Blue (`#3b82f6` / `rgba(59,130,246,*)`) | 10 |
| `/for-creators` | Creators | Pink (`#ec4899` / `rgba(236,72,153,*)`) | 9 |
| `/for-individuals` | Individuals | Green (`#22c55e` / `rgba(34,197,94,*)`) | 5 |

### Shared Template
All 3 pages use a shared layout component `src/layouts/BundleLayout.astro` (alongside existing `BaseLayout.astro` and `ServiceLayout.astro`). It **extends `BaseLayout.astro`** and accepts:
- `audience`: string (display name)
- `accentColor`: CSS color value
- `accentRgb`: RGB tuple for rgba() usage (e.g., `59,130,246`)
- `tagline`: string (hero subtext)
- `services`: array of service objects (see below)
- `featuredService`: string (slug of the hero tile service)
- `crossSellBundles`: array of the other two bundles for cross-sell section
- `ogImage`: string (path to OG image for this bundle page)

Each page file (`src/pages/for-businesses.astro`, etc.) defines its content in frontmatter and passes it to the shared template.

### Service Data
Service content is pulled from the existing content collection (`src/content/services/*.md`) using `getCollection('services')` and `entrySlug()` from `@/utils/services` to resolve slugs (per project convention — `entry.id` includes `.md`, use `entrySlug()` not raw `entry.id`).

Each bundle page provides **audience-tailored overrides** for:
- `description`: One-liner tailored to the audience's perspective
- `features`: 3-4 key feature pills (pulled from the service's actual offerings, phrased for the audience)
- `tier`: `'hero'` | `'standard'` | `'compact'` — determines tile size in the grid

These overrides live in each page's frontmatter — not in the content collection (avoids polluting the canonical service data).

### Icons
Service tiles use the existing content collection `icon` field (values like `cpu`, `shield`, `video`). Map these to Heroicons SVGs, consistent with how `WhoWeHelp.astro` renders icons. Do not use emoji — SVGs match the design system.

---

## 2. Service-to-Bundle Mapping

### For Businesses (10 services)
| Service | Tier | Tailored Description |
|---------|------|---------------------|
| **AI Integration** | ★ hero | Workflow automation, custom AI agents, chatbots, phone triage, and smart analytics — built around how your business actually runs. |
| Website Solutions | standard | Sites built to convert visitors into paying customers. SEO-ready, mobile-first, designed around your business goals. |
| Digital Marketing | standard | SEO, Google Ads, TikTok, Reddit — campaigns that drive qualified leads and measurable growth. |
| Computer Services | standard | Your IT backbone. Remote diagnostics, virus removal, optimization — handled fast so you can focus on running your business. |
| Software Services | standard | Google Workspace, Microsoft 365, cloud tools — deployed, configured, and managed for your team. |
| Email Solutions | compact | Professional email on your domain. SPF, DKIM, DMARC configured. Your messages land in inboxes, not spam. |
| Domain Solutions | compact | The right domain, registered and managed. DNS, SSL, CDN, and renewals — all handled. |
| Organizational Effectiveness | compact | Operational audits, bottleneck identification, process redesign — we find where your business is losing time and fix it. |
| Custom Services | compact | Integrations, hybrid solutions, and consulting for problems that don't fit a standard category. |
| Training & Documentation | compact | Hands-on training and custom documentation so your team knows how to use what was built. |

### For Creators (9 services)
| Service | Tier | Tailored Description |
|---------|------|---------------------|
| **Streaming Consultation** | ★ hero | OBS setup, multi-platform streaming, overlays, hardware recs, and monetization strategy — everything to level up your production quality. |
| Website Solutions | standard | A professional site that represents your brand. Portfolio, landing pages, e-commerce — built custom, not from a template. |
| Digital Marketing | standard | Grow your audience with SEO, content strategy, and targeted ads on YouTube, TikTok, and Reddit. |
| Domain Solutions | standard | Your brand name, locked down. Domain registration, DNS, SSL — professional from the URL up. |
| Online Privacy | standard | Protect your identity and accounts. VPN, 2FA, password management, and data broker removal for public-facing creators. |
| Email Solutions | compact | Professional email on your domain. Newsletters, transactional emails, and deliverability — configured right. |
| AI Integration | compact | Creator-focused AI workflows: scheduling, community response, uploads, audience management, and automated reporting. |
| Custom Services | compact | Something specific to your workflow? Custom integrations, hybrid solutions, and consulting. |
| Training & Documentation | compact | Learn your tools properly. Custom training and documentation for any service or platform. |

### For Individuals (5 services)
| Service | Tier | Tailored Description |
|---------|------|---------------------|
| **Online Privacy** | ★ hero | Security audit, VPN, password manager, 2FA, breach monitoring, and data broker removal — personal security made practical. |
| Computer Services | standard | Virus removal, optimization, startup repair, driver updates — your personal devices running smooth and fast. |
| Email Solutions | standard | Professional email on your own domain. Clean inbox, synced calendars, works on every device. |
| AI Integration | compact | Smart automation for personal use: AI assistants, task management, and tools configured for your workflow. |
| Custom Services | compact | Something unique? Custom integrations and consulting for problems that don't fit a standard service. |

**Grid adaptation for low service counts:** The Individuals page has only 5 services. Grid uses `grid-template-columns: 1.5fr 1fr` (2 columns instead of 3) with the hero tile spanning 2 rows in column 1, standard tiles in column 2, and compact row below at full width.

---

## 3. Page Structure (4 Sections)

### Section 1: Hero
- Particle field background (same pattern as homepage hero: `radial-gradient(circle, rgba(ACCENT, 0.4) 1px, transparent 1px)` at 28px grid, 0.15 opacity)
- Eyebrow: `"FOR BUSINESSES"` (accent color, monospace, tracking-widest)
- H1: Audience-specific headline (e.g., "Your complete tech stack")
- Subtext: Service count + value prop (e.g., "10 services tailored to run, grow, and protect your business.")
- No CTA in hero — the grid IS the action

### Section 2: The Living Grid
**Layout:** Asymmetric CSS Grid bento layout.

**Grid structure (responsive):**
- **Desktop (lg+):** `grid-template-columns: 1.5fr 1fr 1fr` (3 columns). Exception: Individuals page uses `1.5fr 1fr` (2 columns) due to lower service count.
- **Tablet (md to lg):** `grid-template-columns: 1fr 1fr` (2 columns). Hero tile spans 1 column, 2 rows.
- **Mobile (< md):** Single column stack.

**Tile types:**

1. **Hero Tile** (tier: `'hero'`) — spans 1 column, 2 rows
   - Large SVG icon with `drop-shadow` glow in accent color
   - Service name (accent color, larger font)
   - Tailored description (2-3 sentences)
   - 3-4 feature pills (`background: rgba(ACCENT, 0.08)`, small text)
   - "Explore [Service Name] →" link to full service page
   - **Cursor-tracking 3D tilt** (same as standard tiles, max ±3 degrees) — not static

2. **Standard Tiles** (tier: `'standard'`) — 1×1 each
   - SVG icon + service name (accent color)
   - One-liner tailored description
   - 3-4 feature pills visible below description (same format as hero tile but smaller)
   - "Explore →" link to full service page
   - **On click:** Tile overlays the grid as a focused detail panel (see expand behavior below)
   - 3D tilt on hover: `perspective(800px) rotateX(Xdeg) rotateY(Ydeg)` based on cursor position, max ±3 degrees

3. **Compact Row** — full grid width, sub-grid of equal columns
   - SVG icon + label only (center-aligned)
   - **On click:** Same expand/overlay behavior as standard tiles
   - Used for services with tier `'compact'` in the mapping tables above

**Click-to-Expand Behavior (FLIP Technique):**
CSS `grid-column` is a discrete property and cannot be smoothly animated. Instead, use an **overlay approach**:
1. On click, capture the tile's current `getBoundingClientRect()` position
2. Clone or reposition the tile to `position: fixed` at the captured coordinates
3. GSAP animate it to a centered overlay state: `width: min(640px, 90vw)`, centered on screen, with full content (description + feature pills + CTA)
4. Background dims: GSAP animates a semi-transparent overlay (`rgba(2,0,10,0.7)`) behind the expanded tile
5. Click the backdrop or a close button to reverse the animation
6. This avoids reflowing the grid entirely — the grid stays static, the tile "lifts off" and expands

**Other Interactions (GSAP):**
- **Cursor-tracking glow:** JavaScript tracks cursor position globally via a `mousemove` listener. Each card calculates distance from cursor and adjusts `box-shadow` intensity — closer cards glow brighter in accent color. Uses CSS custom properties `--glow-x`, `--glow-y`. **Throttled to `requestAnimationFrame`** to avoid performance issues with 10+ DOM elements.
- **3D tilt:** `mousemove` on each card calculates cursor offset from center, applies `transform: perspective(800px) rotateX(Ydeg) rotateY(Xdeg)`. Max ±3 degrees. Resets smoothly on mouseleave via GSAP `to` with `duration: 0.3`.
- **Internal light reflection:** A `::after` pseudo-element with radial gradient shifts position following cursor via CSS custom properties, simulating glass catching light.
- **Staggered entrance:** ScrollTrigger on the grid container. Cards animate in with `opacity: 0, y: 40` → `opacity: 1, y: 0`, stagger 0.08s, `power2.out`.

**Mobile (< md):**
- Single column stack
- No 3D tilt, no cursor glow, no light reflection
- Tap to expand (same overlay behavior, but full-width)
- Staggered fade-in on scroll
- Hero tile appears first, full width
- Feature pills visible on all tiles by default (no expand needed for basic info)

**Reduced motion:**
- All cards visible at full opacity immediately
- No tilt, no glow, no stagger, no light reflection
- Expand/collapse is instant (no GSAP animation, use CSS class toggle)

**JS failure fallback:**
- Cards start with `opacity: 0` for staggered entrance. Add a `<noscript><style>.living-grid .tile { opacity: 1 !important; }</style></noscript>` fallback so tiles are visible if JS fails to load.

### Section 3: Cross-Sell Banner
- Centered text: "Not quite what you're looking for?"
- Two small glass cards linking to the other two bundles
- Each card shows: audience name (in their accent color) + service count
- Subtle hover: card lifts 2px + border glow in that bundle's accent color

### Section 4: CTA
- Two buttons centered:
  - "View All Services →" — uses `btn-ghost` with inline `border-color` and `color` set to the page's accent color
  - "Talk to Us →" — uses standard `btn-primary` (purple/pink gradient, no accent override)
- Links to `/services` and `/contact` respectively

---

## 4. Navigation Changes

### Header Nav Bar
Modify `src/components/ui/NavBar.astro` to add 3 color-coded audience pills directly in the nav bar:

```
[NIGHTIOUS]  Home  [Businesses]  [Creators]  [Individuals]  Services  Contact
```

**Implementation approach:** Add a `bundleLinks` array in the component's frontmatter and render them using the same `map()` pattern as existing nav links. Each bundle link gets:
- `background: rgba(ACCENT_RGB, 0.1)` + `color: ACCENT_COLOR` as inline style via the array data
- Active state (current page matches): `background: rgba(ACCENT_RGB, 0.2)` + `border: 1px solid rgba(ACCENT_RGB, 0.3)`
- Same `font-display text-xs tracking-widest` styling as existing nav items

On mobile hamburger menu: bundles appear as a group with colored left-border indicators (`border-left: 2px solid ACCENT_COLOR`).

The existing services mega-dropdown remains unchanged — it lists all 12 services as before. The bundle nav pills are a separate discovery path.

---

## 5. Visual Assets

### Images
No photos on bundle pages. The Living Grid + particle field + cursor glow provide sufficient visual interest. SVG icons from the content collection's `icon` field serve as service identifiers.

### OG Images
Create 3 OG images (1200×630) for social sharing:
- `/images/og/og-for-businesses.png` — blue accent
- `/images/og/og-for-creators.png` — pink accent
- `/images/og/og-for-individuals.png` — green accent

These can be simple: dark background with the audience name + Nightious logo + accent color treatment. Use the same style as existing OG images.

### Color Tokens
New CSS custom properties (add to `global.css`):
```css
--color-accent-business: 59, 130, 246;    /* blue RGB */
--color-accent-creator: 236, 72, 153;     /* pink RGB */
--color-accent-individual: 34, 197, 94;   /* green RGB */
```

Used as `rgba(var(--color-accent-business), 0.15)` etc. throughout each page via the shared template's `accentRgb` prop.

---

## 6. File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/layouts/BundleLayout.astro` | **Create** | Shared bundle page layout (extends BaseLayout) |
| `src/components/sections/LivingGrid.astro` | **Create** | The bento grid with all GSAP interactions |
| `src/components/sections/BundleHero.astro` | **Create** | Hero section with particle field + accent color |
| `src/components/sections/CrossSell.astro` | **Create** | Cross-sell banner linking to other bundles |
| `src/pages/for-businesses.astro` | **Create** | Businesses bundle page |
| `src/pages/for-creators.astro` | **Create** | Creators bundle page |
| `src/pages/for-individuals.astro` | **Create** | Individuals bundle page |
| `src/components/ui/NavBar.astro` | **Modify** | Add color-coded bundle pills to nav |
| `src/styles/global.css` | **Modify** | Add accent color tokens |
| `public/images/og/og-for-businesses.png` | **Create** | OG image (blue) |
| `public/images/og/og-for-creators.png` | **Create** | OG image (pink) |
| `public/images/og/og-for-individuals.png` | **Create** | OG image (green) |

---

## 7. GSAP Lifecycle

Each page's `<script>` blocks follow the established pattern:
- `let [name]Tl: gsap.core.Timeline | null = null` for stored timeline references
- `function init[Name]()` called on `astro:page-load`
- `document.addEventListener('astro:before-swap', () => { ... })` kills all timelines, ScrollTriggers, and event listeners
- `prefers-reduced-motion` check at the top of each init function — if true, set final state immediately and return

**Cursor-tracking cleanup:** The global `mousemove` listener for cursor glow + tilt uses an `AbortController` for cleanup. This is a new pattern not used elsewhere in the codebase — existing components use direct `.kill()` on GSAP timelines. The `AbortController` is necessary here because `mousemove` is a vanilla DOM listener, not a GSAP-managed animation.

```js
let controller: AbortController | null = null

function initGrid() {
  controller = new AbortController()
  document.addEventListener('mousemove', handleGlow, { signal: controller.signal })
  // ...
}

document.addEventListener('astro:before-swap', () => {
  controller?.abort()
  controller = null
  // ... kill GSAP timelines
})
```

---

## 8. Accessibility

- Each bundle page has `aria-label="Services for [audience]"` on the main section
- Service tiles are `<button>` elements for keyboard accessibility
- Expanded tile overlay uses `aria-expanded="true/false"` and traps focus inside the expanded panel
- `Escape` key closes the expanded overlay
- Cross-sell links use descriptive text (e.g., "View services for Creators")
- All decorative elements (particle field, glow, light reflection) have `aria-hidden="true"` and `pointer-events: none`
- Color is never the sole indicator — accent colors are always paired with text labels

---

## 9. SEO

### Meta
- Businesses: `<title>IT & Digital Solutions for Businesses | Nightious</title>`
- Creators: `<title>Tech & Growth Tools for Content Creators | Nightious</title>`
- Individuals: `<title>Personal Tech Support & Privacy | Nightious</title>`
- Canonical URLs set correctly
- Each service link within the grid uses descriptive anchor text

### Structured Data
Each bundle page includes:
- `SchemaBreadcrumb`: Home → [Bundle Name] (e.g., Home → For Businesses)
- Pages are added to the sitemap (Astro handles this automatically for static pages)

### OG Tags
Each page passes its `ogImage` to `BaseLayout` for proper social sharing cards.
