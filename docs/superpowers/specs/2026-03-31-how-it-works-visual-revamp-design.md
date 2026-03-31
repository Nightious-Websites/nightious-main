# How It Works — Visual Revamp Design Spec

**Date:** 2026-03-31
**Component:** `src/components/sections/HowItWorks.astro`
**Scope:** Visual richness + card content upgrades. Layout and scroll mechanics unchanged.

---

## Summary

The existing HowItWorks timeline section has solid bones — sticky spine, scroll-linked GSAP animations, per-card activation — but the visual presentation feels bland. This revamp adds three layers of visual depth while preserving the existing layout and scroll behavior:

1. **Canvas aurora background** — ambient atmosphere behind the entire section
2. **Scroll-tracking glow zones** — radial light bloom that follows the active card
3. **Upgraded card interiors** — SVG gradient blobs + duration indicator pills

---

## Layer 1: Canvas Aurora Background

### What
A full-section canvas element drawing 3–4 soft radial gradient ellipses that drift slowly, creating a subtle aurora/nebula atmosphere behind the timeline.

### Technical Details
- **Canvas implementation** using the existing `src/utils/canvasAnimation.ts` utility (DPR scaling, ResizeObserver, rAF loop, cleanup — all built in)
- **Blobs:** 3–4 large soft ellipses drawn with `ctx.createRadialGradient()`, each with independent sinusoidal drift paths (varying amplitude, frequency, phase)
- **Colors:**
  - Blob 1: Purple `rgba(168, 85, 247, 0.15)` — top-left region
  - Blob 2: Emerald `rgba(34, 197, 94, 0.10)` — bottom-right region
  - Blob 3: Purple-blue `rgba(139, 92, 246, 0.08)` — center, largest
  - Blob 4: Teal `rgba(45, 212, 191, 0.06)` — mid-right accent
- **FPS:** Throttled to 15 FPS via delta-time check in the rAF callback. Smooth enough to feel alive, light enough for performance.
- **Blur:** Achieved through large gradient radii and `globalCompositeOperation: 'lighter'` for natural soft blending — no CSS `filter: blur()` needed.
- **Positioning:** Canvas is `position: absolute; inset: 0; z-index: 0` within `.hiw-section`. All existing content sits above it.

### Cleanup
- `astro:before-swap` kills the rAF loop via the stop function returned by `startCanvasLoop()`
- `astro:page-load` re-initializes (same pattern as existing animations in this component)

### Mobile (< 768px)
- Canvas disabled entirely — not rendered
- Replaced with a static CSS background using layered `radial-gradient()` values on `.hiw-section`:
  ```css
  background:
    radial-gradient(ellipse at 20% 30%, rgba(168,85,247,0.1) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 70%, rgba(34,197,94,0.06) 0%, transparent 60%),
    var(--color-bg-deep);
  ```
- Same mood, zero JS cost

---

## Layer 2: Active Step Glow Zones

### What
A single absolutely-positioned div with a large radial gradient that repositions vertically to sit behind the currently active card, creating a "spotlight following your progress" effect.

### Technical Details
- **Element:** A `<div class="hiw-glow-zone">` positioned absolutely within `.hiw-split`, behind the cards (`z-index: 0`)
- **Size:** ~70% width, ~35% height of the split container, centered on the right (card) column
- **Movement:** GSAP animates the `top` property inside the existing `activateStep()` function to match the active card's vertical offset
- **Easing:** `duration: 0.6, ease: 'power2.out'` — matching the spine fill animation for cohesion
- **Color shift across steps:**
  - Step 1: `rgba(168, 85, 247, 0.18)` — purple
  - Step 2: `rgba(129, 140, 248, 0.15)` — indigo
  - Step 3: `rgba(94, 168, 247, 0.15)` — blue
  - Step 4: `rgba(34, 197, 94, 0.14)` — emerald
- **GSAP also animates** the gradient color when stepping via a CSS custom property (`--glow-color`) on the glow div, updated in `activateStep()`
- **Blur:** `filter: blur(40px)` on the glow div for soft edges

### Mobile
- Glow zone becomes a static centered element behind the card stack (no repositioning — mobile has no `activateStep()` calls)
- Fixed position at vertical center of the cards column with the purple base color
- Still provides ambient depth without any JS overhead

---

## Layer 3: Upgraded Card Interiors

### 3a: SVG Gradient Blobs

Each card gets a unique decorative SVG blob in the top-right corner.

- **Implementation:** Inline `<svg>` with a `<path>` using organic blob coordinates and a `<radialGradient>` fill matching the step's accent color
- **4 unique blob shapes:** Each step has a distinct organic form (generated via blob-maker-style path data)
- **Positioning:** `position: absolute; top: -20px; right: -15px; width: 120px; height: 120px` within the card (card has `overflow: hidden`)
- **Opacity:** 0.5 base opacity for subtlety
- **Activation animation:** On card activation, GSAP scales the blob from `0.9 → 1.0` and rotates `0 → 3deg` over `0.4s ease`. Reversed on deactivation.
- **Inactive state:** Blob hidden (`opacity: 0`) — only appears when the card is active
- **Color per step:**
  - Step 1: Purple `rgba(168, 85, 247)`
  - Step 2: Indigo `rgba(129, 140, 248)`
  - Step 3: Blue `rgba(94, 168, 247)`
  - Step 4: Emerald `rgba(34, 197, 94)`

### 3b: Duration Indicator Pills

A small pill-shaped badge at the bottom of each card showing the relative phase duration.

- **Structure:** Inline-flex container with a mini progress bar + monospace label
- **Progress bar:** 40px wide, 4px tall, with a gradient fill. Width proportional to phase length:
  - Step 1 "Discovery Call": 20% fill — label: `~1 week`
  - Step 2 "Strategy & Blueprint": 25% fill — label: `1–2 weeks`
  - Step 3 "Build & Ship": 60% fill — label: `3–6 weeks`
  - Step 4 "Launch & Evolve": 15% fill — label: `Ongoing`
- **Styling:** `background: rgba(accent, 0.08); border: 1px solid rgba(accent, 0.15); border-radius: 20px; padding: 5px 14px`
- **Progress bar gradient:** Matches the step's accent color (purple → indigo → blue → emerald)
- **Label font:** Orbitron (monospace), 10px, matching the existing node number style

### Card Color Progression

All accent elements within a card shift together based on step index:

| Step | Accent Color | Border | Glow | Blob | Pill |
|------|-------------|--------|------|------|------|
| 01 | `rgba(168, 85, 247)` | Purple | Purple | Purple | Purple |
| 02 | `rgba(129, 140, 248)` | Indigo | Indigo | Indigo | Indigo |
| 03 | `rgba(94, 168, 247)` | Blue | Blue | Blue | Blue |
| 04 | `rgba(34, 197, 94)` | Emerald | Emerald | Emerald | Emerald |

The left accent bar gradient on active cards also shifts from `[step color] → emerald`.

---

## Mobile Behavior Summary

| Feature | Desktop | Mobile (< 768px) |
|---------|---------|-------------------|
| Aurora background | Canvas animation (15 FPS) | Static CSS radial gradients |
| Glow zones | GSAP-repositioned per step | Static centered behind card stack |
| SVG blobs | Scale-in animation on activation | Always visible at resting scale |
| Duration pills | Visible on active card | Always visible |
| Spine | Sticky with scroll-linked progress | Hidden |
| Cards | Scroll-activated one at a time | Stagger-reveal all at once |

---

## What Stays Unchanged

- Section layout (120px spine column + 1fr cards grid)
- Spine HTML structure (track, fill, particle, nodes)
- Spine scroll-pinning behavior
- `activateStep()` function signature and card toggle logic
- Per-card ScrollTrigger setup
- Section heading and CTA button
- `astro:before-swap` / `astro:page-load` lifecycle pattern
- Mobile spine hiding
- Accessibility attributes (`aria-label`, `role="list"`, `aria-hidden`)

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/sections/HowItWorks.astro` | All changes within this single component — HTML (aurora canvas, glow div, SVG blobs, duration pills), CSS (new styles for glow zone, blobs, pills, mobile fallback), JS (canvas init via canvasAnimation.ts, glow repositioning in activateStep) |

No new files needed. No new dependencies.

---

## Performance Considerations

- Canvas throttled to 15 FPS — negligible CPU overhead
- Canvas disabled on mobile — zero cost
- SVG blobs are inline (no network requests) and resolution-independent
- Glow zone is a single div with CSS gradient — trivially lightweight
- Duration pills are static HTML — no JS overhead
- All new GSAP tweens piggyback on existing `activateStep()` calls — no new ScrollTriggers
