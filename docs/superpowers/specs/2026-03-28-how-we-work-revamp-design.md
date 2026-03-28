# How We Work — Sticky Split Revamp Design Spec

**Date:** 2026-03-28
**Status:** Approved
**Mockup:** `.superpowers/brainstorm/951970-1774678252/content/07-full-design.html`

---

## Context

Full revamp of the homepage "How It Works" section. The current implementation is a generic 3-step linear process (Tell us / Plan / Done) with glass cards in a 3-column grid — the most "template-looking" section on the homepage. The revamp replaces it with an innovative sticky split layout driven by scroll, featuring a morphing orb, energy flow connections, and a progress indicator.

**User goals:** Momentum & energy feel. The section should feel alive. Both content and visuals are being rethought.

**Design prompts used for inspiration:**
- MotionSites.ai: liquid glass, animated presence indicators, BlurText word-by-word reveals
- ViralMedia: scroll-reveal text, dramatic typography contrast, italic accent font pattern

---

## Design Summary

### Layout: Sticky Split with Morphing Orb

A two-column layout where:
- **Left column (sticky):** A large animated orb pinned to the viewport center. It displays the current step number, orbiting particle rings, and a progress bar below. The orb morphs (glow intensity, ring speed, number) as the user scrolls through steps.
- **Right column (scrolling):** 4 step cards that scroll naturally. The active card lights up with an energy accent bar, glass border glow, and full opacity. Inactive cards are dimmed.

Scrolling drives everything — GSAP ScrollTrigger pins the left column and triggers step transitions as each card enters the viewport.

### Heading

**"How _we_ work."** — renamed from "How it works."
- "work." uses `accent-italic` class (Instrument Serif italic) — same pattern as Hero ("personal."), Testimonials ("word"), FAQ ("questions."), CTA ("tech"). Changed from "we" to "work." during review to avoid duplicating the italic accent word with ClienteleSection ("Who _we_ work with.") directly above.
- "work." also gets the purple-to-green gradient via `hiw-grad`
- Glass pill eyebrow: "The Process" (unchanged)

### 4 Steps (new copy)

| # | Title | Body | Bold Closer | Value Emphasized |
|---|-------|------|-------------|-----------------|
| 01 | Discovery Call | Tell us what's broken. We listen, ask the right questions, and figure out the real problem — not just the symptoms. | Fast response, every time. | Responsiveness |
| 02 | Strategy & Blueprint | We map out the solution — what we'll build, the timeline, and exact costs. You see the full picture before anything starts. | No hidden fees. No lock-in. | Transparency |
| 03 | Build & Ship | We handle the work end-to-end and keep you in the loop. You get progress updates, not radio silence. | We ship when we say we will. | Reliability |
| 04 | Launch & Evolve | Go live with confidence. We make sure everything works, train your team, and stay on for support as things grow. | Your success is our success. | Partnership |

### CTA

"Start your project" (replaces "Get started") — more specific, more momentum.

---

## Technical Specification

### Component Structure

**File:** `src/components/sections/HowItWorks.astro`

Complete rewrite of the existing component. Same filename, same import in `index.astro`.

```
<section class="hiw-section">
  <div class="hiw-header">
    <span class="glass-pill">The Process</span>
    <h2 class="hiw-headline">
      How we <span class="accent-italic hiw-grad">work.</span>
    </h2>
  </div>

  <div class="hiw-split">
    <!-- LEFT: Sticky orb column -->
    <div class="hiw-orb-col">
      <div class="morph-orb-wrap">
        <div class="orb-ring-outer"></div>
        <div class="orb-ring-inner"></div>
        <div class="morph-orb">
          <span class="orb-step-num">01</span>
        </div>
      </div>
      <div class="orb-progress">
        <div class="progress-bar-track">
          <div class="progress-bar-fill"></div>
        </div>
        <span class="progress-label">Step 1 of 4</span>
      </div>
    </div>

    <!-- RIGHT: Step cards -->
    <div class="hiw-steps-col">
      {steps.map(step => <StepCard />)}
    </div>
  </div>

  <div class="hiw-cta-wrap">
    <a href="/contact" class="hiw-cta">Start your project →</a>
  </div>
</section>
```

### GSAP ScrollTrigger Implementation

**Pin behavior:**
- `.hiw-orb-col` is pinned via ScrollTrigger with `pin: true`
- Pin starts when the split layout enters viewport, ends when the last card scrolls past
- `pinType: "transform"` to avoid layout reflow (safer with View Transitions)

**Step transitions:**
Each `.hiw-step-card` gets its own ScrollTrigger:
```javascript
ScrollTrigger.create({
  trigger: card,
  start: 'top 60%',
  end: 'bottom 40%',
  onEnter: () => activateStep(i),
  onEnterBack: () => activateStep(i),
})
```

**`activateStep(index)` does:**
1. Cross-fade orb step number (`gsap.to` opacity 0 → update text → opacity 1, 0.3s)
2. Update progress bar width (`gsap.to` width: `${(index + 1) / 4 * 100}%`, 0.6s)
3. Update progress label text
4. Toggle `.active` class on step cards (CSS handles the visual transition)
5. Adjust orb glow intensity via `gsap.to` on box-shadow properties:
   - Step 1: dim purple (0.15 alpha)
   - Step 2: medium purple (0.20 alpha)
   - Step 3: bright purple (0.25 alpha)
   - Step 4: purple-green (0.25 alpha + emerald ring glow)

**Orb ring speed modulation:**
- Inner ring: base 12s, accelerates by 1s per step (12s → 9s)
- Outer ring: base 20s, accelerates by 2s per step (20s → 14s)
- Achieved via `gsap.to(ring, { duration: newDuration })` on the CSS animation

### View Transitions Lifecycle

```javascript
let pinInstance: ScrollTrigger | null = null
let stepTriggers: ScrollTrigger[] = []

document.addEventListener('astro:before-swap', () => {
  pinInstance?.kill()
  stepTriggers.forEach(t => t.kill())
  pinInstance = null
  stepTriggers = []
})

document.addEventListener('astro:page-load', initHowWeWork)
```

### Mobile Behavior (< 768px)

- Sticky pinning is disabled — `position: relative` replaces `position: sticky`
- Orb shrinks to 140px and sits above the step cards (single column)
- All cards show at full opacity (no dimming) with GSAP stagger fade-in on scroll
- Progress bar and label still update, but via simple scroll-triggered class toggles
- Energy accent bars still render on the active card

### Reduced Motion

```javascript
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reduced) {
  // Show all cards at full opacity, no animations
  // Orb static at step 01, no ring rotation
  // Progress bar at 100%
  return
}
```

CSS backup:
```css
@media (prefers-reduced-motion: reduce) {
  .orb-ring-inner, .orb-ring-outer { animation: none; }
  .morph-orb { animation: none; }
  .hiw-step-card { opacity: 1; transform: none; }
}
```

### CSS Architecture

All styles scoped inside `<style>` block in `HowItWorks.astro` (same pattern as current). No changes to `global.css`. Uses existing utilities:
- `.glass-pill` (from global.css)
- `.accent-italic` (from global.css)
- `--color-bg-deep`, `--text-primary-aurora`, `--text-muted-aurora` (design tokens)

### Orb Visual Specification

```css
.morph-orb {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(168,85,247,0.25) 0%,
    rgba(34,197,94,0.12) 40%,
    transparent 70%
  );
  border: 1px solid rgba(168,85,247,0.2);
  box-shadow:
    0 0 80px rgba(168,85,247,0.15),
    inset 0 0 60px rgba(168,85,247,0.05);
  animation: orb-breathe 4s ease-in-out infinite;
}
```

Two orbiting rings:
- **Inner ring:** 1px solid `rgba(168,85,247,0.08)`, with 8px glowing particle dot, rotates clockwise at 12s
- **Outer ring:** 1px dashed `rgba(34,197,94,0.06)`, with 5px emerald particle dot, rotates counter-clockwise at 20s

### Step Card Specification

```css
.hiw-step-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 28px 24px;
  border: 1px solid rgba(255,255,255,0.06);
  opacity: 0.35;
  transform: translateY(8px);
  transition: all 0.5s ease;
}
.hiw-step-card.active {
  opacity: 1;
  transform: translateY(0);
  background: rgba(168,85,247,0.04);
  border-color: rgba(168,85,247,0.15);
  box-shadow: 0 0 40px rgba(168,85,247,0.08);
}
```

Active card gets a `::before` gradient border (mask-composite technique) and a `::after` left-side energy accent bar (2px purple-to-green gradient).

---

## Files Changed

| # | File | What Changes |
|---|------|-------------|
| 1 | `src/components/sections/HowItWorks.astro` | Complete rewrite — new HTML structure, CSS, and GSAP script |

**No other files change.** The component import in `index.astro` stays the same. No new dependencies. No changes to `global.css`.

---

## What Does NOT Change

- Component filename (`HowItWorks.astro`)
- Import in `index.astro`
- Section position in page order (after ClienteleSection, before Testimonials)
- Global CSS utilities (`.glass-pill`, `.accent-italic`, design tokens)
- No new npm packages
- View Transitions lifecycle pattern
- `prefers-reduced-motion` support

---

## Verification

1. `npm run dev` — start dev server
2. Visual checks:
   - Heading reads "How _we_ work." with italic accent on "we"
   - Orb is pinned on desktop while scrolling through steps
   - Step cards light up progressively, orb number and progress bar update
   - Energy accent bar appears on active card
   - Orb rings animate (spinning particles)
   - CTA reads "Start your project"
3. Mobile (< 768px):
   - Orb is not sticky, sits above cards
   - Cards show at full opacity with stagger reveal
   - Layout is single column
4. GSAP lifecycle:
   - Navigate to a service page and back — pin reinitializes cleanly
   - No console errors about stale ScrollTrigger instances
5. `npm run build` — confirm zero build errors
6. `prefers-reduced-motion` — all animations disabled, cards at full opacity
