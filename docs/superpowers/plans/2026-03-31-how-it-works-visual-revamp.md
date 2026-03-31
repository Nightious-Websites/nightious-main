# How It Works Visual Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual richness to the HowItWorks timeline section — canvas aurora background, scroll-tracking glow zones, and upgraded card interiors with SVG blobs and duration pills.

**Architecture:** All changes live in a single component (`HowItWorks.astro`). Three visual layers are added on top of the existing layout/scroll mechanics: a canvas aurora behind the section, a GSAP-animated glow zone behind the active card, and per-card SVG blobs + duration pills. The canvas uses the existing `canvasAnimation.ts` utility. Per-step accent colors are delivered via CSS custom properties set as inline styles.

**Tech Stack:** Astro 5, GSAP/ScrollTrigger, HTML5 Canvas via `canvasAnimation.ts`, inline SVG, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-03-31-how-it-works-visual-revamp-design.md`

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/components/sections/HowItWorks.astro` | Modify | All HTML, CSS, and JS changes — frontmatter data, template markup, styles, and script logic |

No new files. No new dependencies. The existing `src/utils/canvasAnimation.ts` is imported but not modified.

---

### Task 1: Extend Step Data with Accent Colors, Durations, and Blob Paths

**Files:**
- Modify: `src/components/sections/HowItWorks.astro` (frontmatter, lines 1–23)

- [ ] **Step 1: Replace the `steps` array in the frontmatter**

Replace the entire frontmatter block (lines 2–23) with this expanded version. Each step now includes `accentRgb` (for CSS `--accent` variable), `duration` (label text), `durationFill` (progress bar width percentage), and `blobPath` (unique SVG path data).

```astro
---
const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    bodyHtml: "Tell us what's broken. We listen, ask the right questions, and figure out the real problem — not just the symptoms. <strong>Fast response, every time.</strong>",
    accentRgb: '168, 85, 247',
    duration: '~1 week',
    durationFill: 20,
    blobPath: 'M45.2,-62.3C57.1,-53.6,64.2,-37.8,69.4,-21.3C74.6,-4.8,77.8,12.4,72.2,26.5C66.5,40.6,52,51.6,36.8,59.4C21.6,67.2,5.6,71.9,-10.8,71.1C-27.2,70.3,-43.9,64.1,-55.3,53C-66.7,41.9,-72.7,25.9,-74.5,9.4C-76.2,-7.2,-73.6,-24.2,-64.4,-36.5C-55.3,-48.8,-39.5,-56.4,-24.2,-63.6C-8.8,-70.8,6.1,-77.6,20,-74.3C33.9,-70.9,33.3,-71,45.2,-62.3Z',
  },
  {
    number: '02',
    title: 'Strategy & Blueprint',
    bodyHtml: "We map out the solution — what we'll build, the timeline, and exact costs. You see the full picture before anything starts. <strong>No hidden fees. No lock-in.</strong>",
    accentRgb: '129, 140, 248',
    duration: '1–2 weeks',
    durationFill: 25,
    blobPath: 'M42.1,-55.8C53.3,-48.2,60.1,-33.5,65.4,-18.1C70.7,-2.7,74.6,13.4,68.8,26.4C63,39.4,47.6,49.3,32.2,56.6C16.8,63.9,1.5,68.6,-14.7,67.5C-30.9,66.4,-48,59.5,-58.2,46.8C-68.4,34.1,-71.7,15.5,-69.2,-1.6C-66.7,-18.7,-58.4,-34.3,-46.3,-41.7C-34.2,-49.1,-18.3,-48.3,-1.2,-56.8C15.9,-65.3,30.9,-63.4,42.1,-55.8Z',
  },
  {
    number: '03',
    title: 'Build & Ship',
    bodyHtml: 'We handle the work end-to-end and keep you in the loop. You get progress updates, not radio silence. <strong>We ship when we say we will.</strong>',
    accentRgb: '94, 168, 247',
    duration: '3–6 weeks',
    durationFill: 60,
    blobPath: 'M38.5,-51.4C52.9,-44.7,69.5,-37.2,74.8,-24.8C80.1,-12.4,74.1,4.9,66.5,19.8C58.9,34.7,49.7,47.2,37.6,55.4C25.5,63.6,10.6,67.5,-3.1,65.8C-16.8,64.1,-29.3,56.8,-41.9,48.1C-54.5,39.4,-67.2,29.3,-71.5,16.1C-75.8,2.9,-71.8,-13.4,-63.3,-26C-54.8,-38.6,-41.8,-47.5,-29,-54.4C-16.2,-61.2,-3.5,-66,6.1,-63.8C15.8,-61.6,24.1,-58.2,38.5,-51.4Z',
  },
  {
    number: '04',
    title: 'Launch & Evolve',
    bodyHtml: "Go live with confidence. We make sure everything works, train your team, and stay on for support as things grow. <strong>Your success is our success.</strong>",
    accentRgb: '34, 197, 94',
    duration: 'Ongoing',
    durationFill: 15,
    blobPath: 'M40.6,-52.1C54.3,-46.2,68.3,-36.1,73.2,-22.6C78.1,-9.1,73.9,7.8,66.3,21.4C58.7,35,47.7,45.3,34.8,53.1C21.9,60.9,7.1,66.2,-8.4,66.1C-23.9,66,-40.1,60.5,-51.1,49.9C-62.1,39.3,-67.9,23.6,-69,7.6C-70.1,-8.4,-66.5,-24.7,-57.4,-35.8C-48.3,-46.9,-33.7,-52.8,-19.6,-58.5C-5.5,-64.2,8.1,-69.7,21.5,-67.1C34.9,-64.5,26.9,-58,40.6,-52.1Z',
  },
]
---
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "feat(hiw): extend step data with accent colors, durations, and blob paths"
```

---

### Task 2: Add Aurora Canvas and Glow Zone HTML

**Files:**
- Modify: `src/components/sections/HowItWorks.astro` (template section)

- [ ] **Step 1: Add the aurora canvas element**

Inside `<section class="hiw-section">`, immediately after the opening tag and before the `<!-- Header -->` comment, add:

```html
  <!-- Aurora background canvas (desktop only, hidden on mobile via CSS) -->
  <canvas class="hiw-aurora" id="hiw-aurora" aria-hidden="true"></canvas>
```

- [ ] **Step 2: Add the glow zone div**

Inside `<div class="hiw-split" id="hiw-split">`, immediately after the opening tag and before the spine column comment, add:

```html
    <!-- Glow zone: tracks active card position -->
    <div class="hiw-glow-zone" id="hiw-glow-zone" aria-hidden="true"></div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "feat(hiw): add aurora canvas and glow zone HTML elements"
```

---

### Task 3: Update Card HTML with SVG Blobs and Duration Pills

**Files:**
- Modify: `src/components/sections/HowItWorks.astro` (template section, card markup)

- [ ] **Step 1: Replace the card markup**

Replace the entire `<ol class="hiw-steps-col">` block (the `{steps.map(...)}` inside it) with this updated version that adds inline `--accent` CSS variable, SVG blob, and duration pill to each card:

```astro
    <!-- RIGHT: Step Cards -->
    <ol class="hiw-steps-col" role="list">
      {steps.map((step, i) => (
        <li
          class="hiw-step-card"
          data-step={step.number}
          style={`--accent: ${step.accentRgb}`}
        >
          {/* Decorative SVG blob */}
          <svg class="step-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id={`blob-grad-${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color={`rgba(${step.accentRgb}, 0.6)`} />
                <stop offset="100%" stop-color={`rgba(${step.accentRgb}, 0)`} />
              </radialGradient>
            </defs>
            <path fill={`url(#blob-grad-${i})`} d={step.blobPath} transform="translate(100 100)" />
          </svg>

          <div class="step-num" aria-hidden="true">{step.number}</div>
          <h3 class="step-title">{step.title}</h3>
          {/* SECURITY: bodyHtml is compile-time static only. Never accept from CMS, DB, or user input without sanitization. */}
          <p class="step-body" set:html={step.bodyHtml} />

          {/* Duration indicator pill */}
          <div class="step-duration">
            <div class="step-duration-bar">
              <div class="step-duration-fill" style={`width: ${step.durationFill}%`}></div>
            </div>
            <span class="step-duration-label">{step.duration}</span>
          </div>
        </li>
      ))}
    </ol>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "feat(hiw): add SVG blobs and duration pills to step cards"
```

---

### Task 4: Add CSS for All New Visual Elements

**Files:**
- Modify: `src/components/sections/HowItWorks.astro` (style block)

- [ ] **Step 1: Add aurora canvas styles**

Add immediately after the `.hiw-section` rule (after `padding: 100px 0 0;`), still inside the same `<style>` block:

```css
  /* ── Aurora canvas ── */
  .hiw-aurora {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
```

- [ ] **Step 2: Add `position: relative` and `overflow: hidden` to `.hiw-section`**

The section needs `position: relative` so the canvas positions correctly, and `overflow: hidden` so the aurora blobs don't bleed outside the section. Update the `.hiw-section` rule:

```css
  .hiw-section {
    position: relative;
    overflow: hidden;
    background-color: var(--color-bg-deep);
    padding: 100px 0 0;
  }
```

- [ ] **Step 3: Add z-index to header, split, and CTA to sit above the canvas**

Add `position: relative; z-index: 1;` to `.hiw-header`, `.hiw-split`, and `.hiw-cta-wrap` so they render above the aurora canvas (z-index: 0):

```css
  .hiw-header {
    position: relative;
    z-index: 1;
    text-align: center;
    margin-bottom: 64px;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
```

```css
  .hiw-split {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 120px 1fr;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
    gap: 40px;
    align-items: start;
  }
```

```css
  .hiw-cta-wrap {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 40px 24px 100px;
  }
```

- [ ] **Step 4: Add glow zone styles**

Add after the `.hiw-split` rule:

```css
  /* ── Glow zone (tracks active card) ── */
  .hiw-glow-zone {
    position: absolute;
    right: 0;
    top: 0;
    width: 80%;
    height: 250px;
    background: radial-gradient(ellipse at center, rgba(var(--glow-color, 168, 85, 247), 0.18) 0%, transparent 70%);
    filter: blur(40px);
    pointer-events: none;
    z-index: 0;
  }
```

- [ ] **Step 5: Update active card styles to use `var(--accent)` instead of hardcoded purple**

Replace the active card CSS rules. The `.hiw-step-card.active` rule becomes:

```css
  .hiw-step-card.active {
    opacity: 1;
    transform: translateY(0);
    background: rgba(var(--accent), 0.04);
    border-color: rgba(var(--accent), 0.15);
    box-shadow: 0 0 40px rgba(var(--accent), 0.14);
  }
```

Replace the `.hiw-step-card.active::before` rule:

```css
  .hiw-step-card.active::before {
    background: linear-gradient(160deg, rgba(var(--accent), 0.3) 0%, rgba(255, 255, 255, 0.06) 50%, rgba(34, 197, 94, 0.15) 100%);
  }
```

Replace the `.hiw-step-card.active::after` accent bar rule:

```css
  .hiw-step-card.active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 2px;
    background: linear-gradient(180deg, rgba(var(--accent), 0.6), rgba(34, 197, 94, 0.4));
    border-radius: 1px;
    box-shadow: 0 0 8px rgba(var(--accent), 0.3);
  }
```

Replace the `.hiw-step-card.active .step-num` rule:

```css
  .hiw-step-card.active .step-num {
    color: rgba(var(--accent), 0.8);
  }
```

- [ ] **Step 6: Add `overflow: hidden` to `.hiw-step-card`**

This clips the SVG blob at the card's rounded corners. Add `overflow: hidden;` to the existing `.hiw-step-card` rule:

```css
  .hiw-step-card {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 28px 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    opacity: 0.35;
    transform: translateY(8px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease,
      background 0.5s ease,
      border-color 0.5s ease,
      box-shadow 0.5s ease;
  }
```

- [ ] **Step 7: Add SVG blob styles**

Add after the step card rules:

```css
  /* ── SVG blob (decorative per-card graphic) ── */
  .step-blob {
    position: absolute;
    top: -20px;
    right: -15px;
    width: 120px;
    height: 120px;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
    z-index: 0;
  }

  .hiw-step-card.active .step-blob {
    opacity: 0.5;
    transform: scale(1) rotate(3deg);
  }
```

- [ ] **Step 8: Add duration pill styles**

Add after the blob styles:

```css
  /* ── Duration indicator pill ── */
  .step-duration {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    background: rgba(var(--accent), 0.08);
    border: 1px solid rgba(var(--accent), 0.15);
    border-radius: 20px;
    padding: 5px 14px;
  }

  .step-duration-bar {
    position: relative;
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
  }

  .step-duration-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(90deg, rgba(var(--accent), 0.7), rgba(var(--accent), 0.4));
    border-radius: 2px;
  }

  .step-duration-label {
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    letter-spacing: 0.05em;
    color: rgba(var(--accent), 0.7);
  }
```

- [ ] **Step 9: Add mobile styles for new elements**

Add inside the existing `@media (max-width: 767px)` block:

```css
    /* Aurora: hide canvas, use static CSS gradient fallback */
    .hiw-aurora {
      display: none;
    }

    .hiw-section {
      background:
        radial-gradient(ellipse at 20% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 60%),
        var(--color-bg-deep);
    }

    /* Glow zone: static centered, no repositioning */
    .hiw-glow-zone {
      top: 50%;
      left: 50%;
      right: auto;
      transform: translate(-50%, -50%);
      width: 90%;
      height: 300px;
    }

    /* Blobs: always visible at resting scale (no activation animation) */
    .step-blob {
      opacity: 0.35;
      transform: scale(1);
    }
```

- [ ] **Step 10: Update reduced motion styles**

Add inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
    /* Aurora: disable canvas animation, use static fallback */
    .hiw-aurora {
      display: none;
    }

    .hiw-section {
      background:
        radial-gradient(ellipse at 20% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 60%),
        var(--color-bg-deep);
    }

    .step-blob {
      opacity: 0.35;
      transform: scale(1);
      transition: none;
    }

    .hiw-glow-zone {
      display: none;
    }
```

- [ ] **Step 11: Commit**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "feat(hiw): add CSS for aurora, glow zone, blobs, pills, and per-step accents"
```

---

### Task 5: Add Aurora Canvas JS Initialization

**Files:**
- Modify: `src/components/sections/HowItWorks.astro` (script block)

- [ ] **Step 1: Add canvas import and aurora state**

At the top of the `<script>` block, after the existing GSAP imports and `gsap.registerPlugin(ScrollTrigger)`, add:

```typescript
  import { startCanvasLoop } from '@/utils/canvasAnimation'

  let stopAurora: (() => void) | null = null
```

- [ ] **Step 2: Add the aurora blob configuration and draw function**

After the `STEP_LABELS` constant, add:

```typescript
  const AURORA_BLOBS = [
    { cx: 0.2, cy: 0.3, rx: 0.28, ry: 0.3, r: 168, g: 85, b: 247, a: 0.15, speed: 0.0003, amp: 30 },
    { cx: 0.8, cy: 0.7, rx: 0.25, ry: 0.28, r: 34, g: 197, b: 94, a: 0.10, speed: 0.00025, amp: 25 },
    { cx: 0.45, cy: 0.5, rx: 0.23, ry: 0.25, r: 139, g: 92, b: 246, a: 0.08, speed: 0.0002, amp: 20 },
    { cx: 0.65, cy: 0.4, rx: 0.18, ry: 0.2, r: 45, g: 212, b: 191, a: 0.06, speed: 0.00015, amp: 15 },
  ]

  const FPS_INTERVAL = 1000 / 15
  let auroraElapsed = 0
  let auroraSinceLast = 0

  function drawAurora(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) {
    auroraSinceLast += dt
    if (auroraSinceLast < FPS_INTERVAL) return
    auroraSinceLast = 0
    auroraElapsed += dt

    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'

    for (const blob of AURORA_BLOBS) {
      const cx = blob.cx * w + Math.sin(auroraElapsed * blob.speed) * blob.amp
      const cy = blob.cy * h + Math.cos(auroraElapsed * blob.speed * 0.7) * blob.amp
      const r = Math.max(blob.rx * w, blob.ry * h)

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, `rgba(${blob.r}, ${blob.g}, ${blob.b}, ${blob.a})`)
      grad.addColorStop(1, `rgba(${blob.r}, ${blob.g}, ${blob.b}, 0)`)

      ctx.beginPath()
      ctx.ellipse(cx, cy, blob.rx * w, blob.ry * h, 0, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    ctx.globalCompositeOperation = 'source-over'
  }
```

- [ ] **Step 3: Add aurora initialization inside `initHowWeWork`**

Inside the `initHowWeWork` function, after the `if (reduced) { ... return }` block and before the `const isMobile` line, add:

```typescript
    // Init aurora canvas (desktop only)
    const auroraCanvas = document.getElementById('hiw-aurora') as HTMLCanvasElement | null
    if (auroraCanvas && window.innerWidth >= 768) {
      auroraElapsed = 0
      auroraSinceLast = 0
      stopAurora = startCanvasLoop(auroraCanvas, drawAurora)
    }
```

- [ ] **Step 4: Add aurora cleanup in the `astro:before-swap` handler**

In the existing `astro:before-swap` event listener, add before the existing cleanup:

```typescript
    stopAurora?.()
    stopAurora = null
```

The full handler becomes:

```typescript
  document.addEventListener('astro:before-swap', () => {
    stopAurora?.()
    stopAurora = null
    pinInstance?.kill()
    stepTriggers.forEach(t => t.kill())
    pinInstance = null
    stepTriggers = []
  })
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "feat(hiw): add aurora canvas background with 15fps throttle and lifecycle cleanup"
```

---

### Task 6: Add Glow Zone Repositioning and Blob Animation to activateStep

**Files:**
- Modify: `src/components/sections/HowItWorks.astro` (script block, `activateStep` function)

- [ ] **Step 1: Add glow color constant**

After the `AURORA_BLOBS` constant, add:

```typescript
  const GLOW_COLORS = [
    '168, 85, 247',
    '129, 140, 248',
    '94, 168, 247',
    '34, 197, 94',
  ]
```

- [ ] **Step 2: Add glow zone repositioning to `activateStep`**

Inside the `activateStep` function, after the spine label update (`if (spineLabel)` block), add:

```typescript
    // Reposition glow zone behind active card
    const glowZone = document.getElementById('hiw-glow-zone')
    if (glowZone && cards[index]) {
      const card = cards[index] as HTMLElement
      const targetTop = card.offsetTop + card.offsetHeight / 2 - 125
      gsap.to(glowZone, {
        top: targetTop,
        duration: 0.6,
        ease: 'power2.out',
      })
      glowZone.style.setProperty('--glow-color', GLOW_COLORS[index])
    }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "feat(hiw): add glow zone tracking and per-step color shift in activateStep"
```

---

### Task 7: Build Verification

**Files:**
- No file changes — verification only

- [ ] **Step 1: Run astro build**

```bash
cd /home/xcoder/Documents/Websites/nightious && npm run build
```

Expected: Build completes with zero errors. Warnings about unused CSS are acceptable.

- [ ] **Step 2: Run console error check**

```bash
node scripts/check-console-errors.mjs
```

Expected: Zero console errors.

- [ ] **Step 3: Visual spot-check with preview**

```bash
npm run preview
```

Open `http://localhost:4321` in the browser. Navigate to the homepage and scroll to the "How we work" section. Verify:
- Aurora canvas animates with soft drifting blobs on desktop
- Glow zone repositions as you scroll through each step
- Each card shows its unique SVG blob and accent color when active
- Duration pills display below the body text on active cards
- On mobile viewport (< 768px): canvas hidden, static gradient background visible, blobs visible at resting state, glow zone centered
- On `prefers-reduced-motion`: no canvas, no glow zone, blobs visible statically

- [ ] **Step 4: Final commit (if any fixes were needed)**

```bash
git add src/components/sections/HowItWorks.astro
git commit -m "fix(hiw): address build/visual issues from revamp verification"
```

Only run this step if fixes were needed. If the build and visual check passed cleanly, skip this commit.
