# Fluid Glass Aesthetic Upgrade — Homepage Design Spec

**Date:** 2026-03-28
**Status:** Implemented
**Mockup:** `.superpowers/brainstorm/732447-1774671854/content/fluid-glass-v2.html`
**Build verified:** 19 pages, 3.68s, zero errors

---

## Context

Visual refinement of the Nightious homepage, applying pure-CSS patterns extracted from two external prompt libraries:

1. **MotionSites.ai paid library** (8 prompts) — Viktor Oddy's dark animated landing page prompts. Indexed at `.claude/docs/design-system/motionsites-prompts.md`.
2. **ViralMedia prompt** — A single dark-themed agency landing page prompt with liquid glass, scroll-reveal text, social proof avatars, and italic accent typography.

Both libraries target React + Framer Motion + shadcn/ui — an incompatible stack. This spec extracts only the **pure CSS patterns, layout ideas, and visual techniques** that are safe to apply within the existing Astro 5 + GSAP + Tailwind v4 architecture. No npm packages are added. No components are created or removed. All 7 homepage sections keep their existing functionality.

**What prompted it:** User purchased MotionSites and shared all 8 paid prompts plus the ViralMedia prompt. After reviewing the patterns, user chose to apply the glass border upgrade, pill badge eyebrows, video fade overlays, and typography accents to the existing homepage sections.

**Intended outcome:** A more polished, cohesive glass aesthetic across the homepage — gradient shimmer borders instead of flat lines, translucent pill badges instead of dashed eyebrows, and subtle typographic contrast that adds visual interest without changing the design language.

---

## Source Prompts — What Was Extracted

### MotionSites.ai Paid Prompts (8 total)

All 8 prompts are indexed with full text and safety annotations at:
`nightious/.claude/docs/design-system/motionsites-prompts.md`

#### Safe patterns extracted:

| Pattern | Found In | Applied To |
|---------|----------|------------|
| `::before` gradient border with `mask-composite: exclude` | All 8 prompts | `.glass` and `.glass-strong` upgrade in `global.css` |
| `background-blend-mode: luminosity` on glass elements | Prompts 2, 3, 8 | `.glass` utility enhancement |
| `padding: 1.4px` on `::before` border (thicker than our 1px) | Prompts 1, 2, 4-8 | `.glass::before` border thickness |
| Video top/bottom gradient fade overlays | Prompts 4, 5, 6, 7, 8 | Hero video fade divs |
| `mix-blend-mode: screen` on video | Prompt 1 | Noted for future use, not applied in this pass |
| Pill badge eyebrow labels | All 8 prompts | New `.glass-pill` utility class |
| `@keyframes marquee` infinite scroll | Prompts 1, 6 | Already exists as StatsTicker — validated pattern |
| Dashboard in glassmorphic frame | Prompt 8 | Not applied (no dashboard on homepage) |
| BlurText word-by-word reveal | Prompt 5 | Noted for future GSAP stagger implementation |
| Overlapping avatar social proof | Prompt 3 | Hero social proof row |

#### Conflicts — NOT ported:

| Their Stack | Our Stack | Why It Conflicts |
|-------------|-----------|------------------|
| React + Vite | Astro 5 | Incompatible component model |
| `motion/react` (Framer Motion) | GSAP + ScrollTrigger | 40KB+ new dep; conflicts with View Transitions lifecycle |
| `shadcn/ui` | None | Pulls Radix UI + Tailwind v3 config patterns |
| Google Fonts (Poppins, Barlow, Geist, etc.) | Self-hosted Orbitron + Exo 2 | Third-party DNS lookup kills LCP; violates perf budget |
| `@fontsource/*` packages | Self-hosted WOFF2 | Unnecessary npm dep |
| Tailwind v3 config (`extend: { fontFamily }`) | Tailwind v4 CSS-only | v4 has no config file |
| Custom CSS var systems (`--background`, `--foreground`) | Our token system (`--color-bg-deep`, etc.) | Direct collision |
| `hls.js` | Native `<video>` MP4 | Safe future enhancement, needs CSP update — deferred |
| `react-use-measure`, `clsx`, `tailwind-merge` | N/A | React/utility deps not needed in Astro |

### ViralMedia Prompt

Single prompt for a dark-themed AI web design agency page. Not indexed as a separate doc — patterns extracted inline below.

#### Safe patterns extracted:

| Pattern | How Applied |
|---------|------------|
| Bottom-aligned hero content (`justify-content: flex-end`) | Hero layout change — content at viewport bottom |
| Overlapping avatar stack with social proof text | Hero: 4 avatars + "50+ businesses already transformed" |
| Italic serif accent font on key heading words | `Instrument Serif` italic on "Growth", "Audience", "Clarity", "Yours", "Answered", "Great" |
| Larger heading type scale (`clamp(32px, 6vw, 72px)`) | Hero h1 scale increase |
| Scroll indicator (vertical line + "Scroll" text) | Hero bottom-right |
| `background-blend-mode: luminosity` on glass | Added to `.glass` utility |
| `padding: 1.4px` on `::before` gradient border | Adopted for `.glass::before` |
| Scroll-reveal text (word-by-word opacity) | Noted for future GSAP stagger — not in this pass |
| Full-viewport CTA section | CtaBanner expanded to `min-height: 80vh` |
| Breathing aurora animation | CtaBanner: `@keyframes cta-breathe` scale pulse |

#### Conflicts — NOT ported:

Same as MotionSites (React, Framer Motion, Google Fonts, hls.js).

---

## Design Changes — Full Specification

### Change 1: Glass Border Upgrade

**What:** Replace flat `border: 1px solid` on `.glass` and `.glass-strong` with a `::before` gradient mask border.

**Why:** The `::before` mask-composite technique creates gradient borders that follow `border-radius` perfectly. This pattern is already proven on 5+ elements in the codebase (Hero button, CTA button, HowItWorks cards, Testimonials cards, FAQ cards). The `.glass` utility is the only glass element still using a flat border.

**File:** `src/styles/global.css`

**Current `.glass` (lines 87-97):**
```css
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--glass-shadow-outer), var(--glass-shadow-inner), var(--glass-shadow-ring);
}
```

**New `.glass`:**
```css
.glass {
  position: relative;
  background: var(--glass-bg);
  background-blend-mode: luminosity;
  border-radius: var(--glass-radius);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--glass-shadow-outer), var(--glass-shadow-inner), var(--glass-shadow-ring);
}
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.12) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.12) 80%,
    rgba(255, 255, 255, 0.35) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}
```

**Key decisions:**
- `padding: 1.4px` (from MotionSites/ViralMedia) instead of our existing `1px` — slightly thicker, more visible shimmer
- `background-blend-mode: luminosity` (from ViralMedia) — adds depth to the glass transparency
- Gradient is white-based (neutral), not purple — the purple glow comes from existing `box-shadow`
- `border` property removed entirely — the `::before` replaces it
- `position: relative` added — required for `::before` absolute positioning
- `z-index: 1` on `::before` — content inside cards should use `position: relative; z-index: 2` if needed

**Same pattern for `.glass-strong` (lines 231-241)** with a purple-tinted gradient:
```css
.glass-strong {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  background-blend-mode: luminosity;
  border-radius: var(--glass-radius);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  box-shadow:
    0 0 80px rgba(168, 85, 247, 0.16),
    inset 0 0 40px rgba(168, 85, 247, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}
.glass-strong::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(168, 85, 247, 0.35) 0%,
    rgba(255, 255, 255, 0.10) 30%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.10) 70%,
    rgba(168, 85, 247, 0.35) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}
```

**Cascade safety:** Components that already define their own `::before` gradient borders override `.glass::before` because component `<style>` blocks load after `global.css` in Astro's cascade:
- `.testimonial-card::before` (Testimonials.astro:143-161) — overrides
- `.hiw-step-card::before` (HowItWorks.astro:284-295) — overrides
- `.flip-front::before` (FaqSection.astro:182-195) — overrides
- ClienteleSection cards use `.glass` but have NO own `::before` — they get the new gradient border

---

### Change 2: Glass Pill Eyebrow Utility

**What:** New `.glass-pill` CSS utility class that replaces the `—— TEXT ——` dash-line eyebrow pattern across all 6 homepage section headers.

**Why:** Every MotionSites prompt and the ViralMedia prompt use pill-shaped glassmorphic badges for section labels. The current dash pattern (Orbitron text flanked by `::before`/`::after` 1px lines) is visually thin. The pill badge is more substantial, more consistent with the glass aesthetic, and consolidates 6 different per-component eyebrow CSS blocks into 1 shared utility.

**File:** `src/styles/global.css` (new section, insert after glass utilities)

```css
/* ─── Glass pill (eyebrow badge) ─────────────────────────────────────────── */
.glass-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Orbitron', monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(168, 85, 247, 0.75);
  background: rgba(168, 85, 247, 0.06);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 999px;
  padding: 7px 18px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

**Emerald variant** (for Testimonials section, which uses green):
```css
.glass-pill--emerald {
  color: rgba(34, 197, 94, 0.75);
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.15);
}
```

**Optional live dot** inside pill (animated presence indicator):
```html
<span class="glass-pill"><span class="glass-pill-dot"></span> TEXT</span>
```
```css
.glass-pill-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  animation: glass-pill-pulse 2s ease-in-out infinite;
}
@keyframes glass-pill-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

**Per-component eyebrow replacements:**

| Component | Old Element | Old CSS Lines | New HTML | Notes |
|-----------|------------|---------------|----------|-------|
| Hero.astro | `<p class="hero-eyebrow">` (lines 55-58) | Lines 207-229 | `<span id="hero-eyebrow" class="glass-pill hero-eyebrow"><span class="glass-pill-dot"></span> IT & Digital Solutions</span>` | Keep `id` + class name for GSAP targeting. Add `opacity: 0` since GSAP animates it in. Live dot added. |
| ClienteleSection.astro | `<div class="cs-eyebrow">` (line 72) | Lines 184-204 | `<span class="glass-pill">How We Help</span>` | Straightforward swap |
| HowItWorks.astro | `<div class="hiw-eyebrow">` (line 31) | Lines 118-139 | `<span class="glass-pill">The Process</span>` | Straightforward swap |
| Testimonials.astro | `<div class="testi-eyebrow">` (line 27) | Lines 93-114 | `<span class="glass-pill glass-pill--emerald"><span class="glass-pill-dot"></span> Client Results</span>` | Emerald variant + live dot |
| FaqSection.astro | `<div class="faq-eyebrow">` (line 40) | Lines 94-113 | `<span class="glass-pill">FAQ</span>` | Left-aligned (no `justify-content: center`) |
| CtaBanner.astro | `<div class="cta-eyebrow">` (line 18) | Lines 86-108 | `<span id="cta-eyebrow" class="glass-pill cta-eyebrow"><span class="glass-pill-dot"></span> Ready When You Are</span>` | Keep `id` + class for GSAP. Add `opacity: 0`. Live dot added. |

**For each component:** Delete the old `.{prefix}-eyebrow` CSS block AND its `::before`/`::after` pseudo-element rules. The `glass-pill` utility from `global.css` handles all styling.

**GSAP selector preservation:** Hero and CtaBanner eyebrows are animated by GSAP timelines that target `.hero-eyebrow` and `.cta-eyebrow`. Keep these as additional class names on the new `<span>` elements so the selectors don't break. The old CSS for those classes is deleted — only the class name persists as a GSAP hook.

---

### Change 3: Video Fade Overlays

**What:** Two gradient `<div>` elements at the top and bottom of the Hero video that fade the video edges into the page background color.

**Why:** All MotionSites prompts (4-8) and the ViralMedia prompt use top/bottom gradient fades on video sections. The current Hero has a flat overlay (`rgba(2,0,10,0.62)`) but no edge fading — the video meets adjacent sections with a hard cut.

**File:** `src/styles/global.css` (new utility section)

```css
/* ─── Video fade overlays ─────────────────────────────────────────────────── */
.video-fade-top,
.video-fade-bottom {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 2;
}
.video-fade-top {
  top: 0;
  height: 160px;
  background: linear-gradient(to bottom, var(--color-bg-deep), transparent);
}
.video-fade-bottom {
  bottom: 0;
  height: 240px;
  background: linear-gradient(to top, var(--color-bg-deep), transparent);
}
```

**File:** `src/components/sections/Hero.astro`

Insert two divs inside the hero video container, after the overlay div:
```html
<div class="video-fade-top"></div>
<div class="video-fade-bottom"></div>
```

No GSAP changes. No JS. Pure CSS decorative elements.

**Bottom fade is taller (240px)** to create a smooth transition into the StatsTicker section below.

---

### Change 4: Italic Accent Typography

**What:** Apply `Instrument Serif` italic to selected emphasis words in section headings, creating visual contrast against Orbitron's geometric weight.

**Why:** The ViralMedia prompt uses this technique (`font-accent italic`) to add typographic variety. One word per heading gets the italic serif treatment, creating a sophisticated contrast between the technical Orbitron display font and the elegant serif accent.

**Implementation:** Self-hosted WOFF2 in `/public/fonts/` (consistent with Orbitron and Exo 2). Downloaded `Instrument Serif` italic 400 (22KB WOFF2, latin subset) from Google Fonts static CDN and added an `@font-face` rule alongside the existing font declarations.

**File:** `src/styles/global.css` — add font-face alongside existing self-hosted fonts:

```css
@font-face {
  font-family: 'Instrument Serif';
  src: url('/fonts/InstrumentSerif-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* ─── Italic accent ──────────────────────────────────────────────────────── */
.accent-italic {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
}
```

**File:** `/public/fonts/InstrumentSerif-Italic.woff2` — download from Google Fonts static CDN.

**No CSP changes needed** — font is self-hosted (`font-src 'self'` already covers it).

**Per-heading application (post-review — weak accent words removed by design review):**

| Section | Actual Heading | Accent Word | Notes |
|---------|---------------|-------------|-------|
| Hero | Technology made simple. / Support made personal. | `<span class="accent-italic">personal.</span>` | Emotional claim — strong choice |
| ClienteleSection | Who we work with. | *(none)* | "with" is a preposition — removed per design review |
| HowItWorks | How it works. | *(none)* | "works" is a functional verb — removed per design review |
| Testimonials | Don't take our word for it. | `<span class="accent-italic">word</span>` | Semantically loaded — strong choice |
| FaqSection | Common questions. | `<span class="accent-italic">questions.</span>` | Content noun — acceptable |
| CtaBanner | Done dealing with tech / problems on your own? | `<span class="accent-italic">tech</span>` | Problem word — reinforces tone |

**Design review guidance:** The italic accent technique works best on 3–4 headings maximum, targeting emotionally resonant or semantically loaded words. Function words (prepositions, pronouns, bare verbs) should not receive the accent.

**Performance note:** `Instrument Serif` italic is a single weight (22KB WOFF2, latin subset). It's loaded with `font-display: swap` so it doesn't block rendering. Only 4 words on the entire page use it. The font is self-hosted at `/public/fonts/InstrumentSerif-Italic.woff2` — no external CDN, no third-party DNS lookup.

---

### Change 5: Hero Layout Enhancements

**What:** Multiple visual improvements to the Hero section inspired by the ViralMedia prompt.

**File:** `src/components/sections/Hero.astro`

#### 5a. Bottom-aligned content

Change the hero flexbox from centered to bottom-aligned:
```css
.hero {
  /* existing styles... */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* was center */
  padding-bottom: 64px;
}
```
This gives the video and aurora blobs more visual space above the content, creating a more cinematic feel.

#### 5b. Larger type scale

Increase the hero h1 `font-size` from the current `clamp()` to:
```css
.hero-h1 {
  font-size: clamp(32px, 6vw, 72px);
  letter-spacing: -0.02em;
  line-height: 1.08;
}
```

#### 5c. Social proof avatar row

Add after the hero subtitle, before the CTA buttons:
```html
<div class="hero-proof">
  <div class="avatar-stack">
    <img src="/images/avatars/client-1.webp" alt="" width="32" height="32">
    <img src="/images/avatars/client-2.webp" alt="" width="32" height="32">
    <img src="/images/avatars/client-3.webp" alt="" width="32" height="32">
    <img src="/images/avatars/client-4.webp" alt="" width="32" height="32">
  </div>
  <span><strong>50+</strong> businesses already transformed</span>
</div>
```

CSS:
```css
.hero-proof {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.avatar-stack {
  display: flex;
}
.avatar-stack img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-bg-deep);
  object-fit: cover;
  margin-left: -8px;
}
.avatar-stack img:first-child {
  margin-left: 0;
}
```

Avatar images should be self-hosted WebP in `/public/images/avatars/` (4 files, ~2KB each). Can use placeholder `pravatar.cc` images initially and replace with real client avatars later.

#### 5d. Scroll indicator

Add at the bottom-right of the hero:
```html
<div class="hero-scroll">
  <span>Scroll</span>
  <div class="hero-scroll-line"></div>
</div>
```

CSS:
```css
.hero-scroll {
  position: absolute;
  bottom: 20px;
  right: 32px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-dim-aurora);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.hero-scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(168,85,247,0.4), transparent);
}
```

This element is already targeted in the GSAP entrance timeline (line 442: `.hero-scroll`) so it will animate in with the rest of the hero content.

---

### Change 6: Micro Visual Enhancements

Small improvements applied across sections:

#### 6a. Testimonial author avatars

Replace bare text author names with avatar circles showing initials:
```html
<div class="testi-author-row">
  <div class="testi-avatar">SC</div>
  <div>
    <div class="testi-author">Sarah Chen</div>
    <div class="testi-role">CTO, TechVenture</div>
  </div>
</div>
```

```css
.testi-author-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.testi-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-purple-light);
  flex-shrink: 0;
}
```

#### 6b. Clientele accent bars

Add a colored accent line under each card icon to reinforce the audience color coding:
```html
<div class="cs-accent-bar blue"></div>
```

```css
.cs-accent-bar {
  width: 40px;
  height: 2px;
  border-radius: 1px;
  margin: 0 auto 20px;
}
.cs-accent-bar.blue { background: var(--color-blue); }
.cs-accent-bar.pink { background: var(--color-pink-deep); }
.cs-accent-bar.green { background: var(--color-emerald); }
```

#### 6c. Gradient ticker numbers

Apply `.gradient-text` to StatsTicker numbers for a purple-to-pink fill:
```html
<span class="st-num gradient-text">99.9%</span>
```

This is a class addition only — no CSS changes needed (`.gradient-text` already exists).

#### 6d. CTA Banner expanded height

Change CtaBanner to near-full viewport for dramatic impact:
```css
.cta-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 6e. Breathing CTA aurora

Add a scale-pulse animation to the CTA aurora blob:
```css
@keyframes cta-breathe {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}
```

#### 6f. Shimmer connector line (HowItWorks)

Add a subtle opacity pulse to the connector line between steps:
```css
.hiw-connector::after {
  animation: shimmer-line 3s ease-in-out infinite;
}
@keyframes shimmer-line {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

---

## Files Changed — Complete List

| # | File | What Changed |
|---|------|-------------|
| 1 | `src/styles/global.css` | Upgraded `.glass` + `.glass-strong` (removed border, added `::before` gradient mask + `background-blend-mode: luminosity`), added `.glass-pill` + `--emerald` + `-dot`, `.video-fade-top/bottom`, `.accent-italic`, `@font-face` Instrument Serif. Refactored `.neon-top` from `::before` to `::after` (collision fix). Added unprefixed `mask` for Firefox. Added `.glass-pill-dot` to reduced-motion block. |
| 2 | `public/fonts/InstrumentSerif-Italic.woff2` | Self-hosted Instrument Serif italic font file (22KB) |
| 3 | `src/components/sections/Hero.astro` | Bottom-aligned layout (`justify-end`), video fade divs, glass pill eyebrow (no dot — status pill already has one), social proof avatar stack (CSS-only initials), scroll indicator restyled to vertical gradient line, italic accent on "personal." |
| 4 | `src/components/sections/ClienteleSection.astro` | Glass pill eyebrow, colored accent bars under card numbers, deleted old `.cs-eyebrow` CSS |
| 5 | `src/components/sections/HowItWorks.astro` | Glass pill eyebrow, shimmer-line opacity pulse on connector, deleted old `.hiw-eyebrow` CSS |
| 6 | `src/components/sections/Testimonials.astro` | Emerald glass pill eyebrow with live dot, italic accent on "word", deleted old `.testi-eyebrow` CSS |
| 7 | `src/components/sections/FaqSection.astro` | Glass pill eyebrow, italic accent on "questions.", deleted old `.faq-eyebrow` CSS |
| 8 | `src/components/sections/CtaBanner.astro` | Glass pill eyebrow with live dot, italic accent on "tech", `min-height: 80vh`, deleted old `.cta-eyebrow` CSS |
| 9 | `src/components/sections/StatsTicker.astro` | No change (`.gradient-text` addition reverted — `.st-num` already has its own gradient) |

---

## What Did NOT Change

- **No npm packages** — hls.js deferred to a future task
- **No new Astro components** — same 7 sections, same imports
- **No GSAP animation logic** — only CSS selector names preserved via dual-classing
- **One new font file** — `InstrumentSerif-Italic.woff2` (22KB WOFF2) added to `/public/fonts/`, self-hosted (no external CDN)
- **No content changes** — all copy stays the same
- **ScrollTrigger cleanup pattern** — `astro:before-swap` / `astro:page-load` lifecycle unchanged
- **View Transitions** — `<ClientRouter />` unchanged

---

## Multi-Agent Review Findings & Fixes

Implementation was reviewed by 5 specialized agents in parallel. All critical and high-severity findings were fixed before finalization.

### Fixed During Review

| Severity | Issue | Fix |
|----------|-------|-----|
| **CRITICAL** | `.glass::before` + `.neon-top::before` collision on WhoWeHelp cards | Refactored `.neon-top` to `::after` in global.css |
| **HIGH** | `.gradient-text` on StatsTicker conflicted with `.st-num`'s own gradient | Reverted — removed `.gradient-text` class |
| **HIGH** | Italic accent on weak words ("it.", "with.", "works.") | Removed from HowItWorks + ClienteleSection; changed Testimonials to "word" |
| **HIGH** | Duplicate pulsing dot in Hero (status pill already has one) | Removed dot from Hero eyebrow |
| **MEDIUM** | Missing unprefixed `mask` for Firefox | Added `mask:` alongside `-webkit-mask:` on both `.glass::before` and `.glass-strong::before` |
| **MEDIUM** | `.glass-pill-dot` not in explicit reduced-motion block | Added to `@media (prefers-reduced-motion)` block |
| **MEDIUM** | Glass pill background too faint (0.06 alpha) | Raised to 0.10 for both purple and emerald variants |

### Noted for Future Work

| Item | Notes |
|------|-------|
| `background-blend-mode: luminosity` on `.glass` | Visually imperceptible on near-black backgrounds — monitor, consider removing if no visible benefit |
| `@supports` fallback for `mask-composite` | Browsers without support see no border at all — could add flat border fallback |
| WhoWeHelp / ServicesGrid section headers | Not upgraded to glass pill / italic accent pattern (different pages, out of homepage scope) |
| Font subsetting | 22KB could be reduced by subsetting to only the ~30 glyphs actually used |

---

## Verification

1. `cd nightious && npm run dev` — start dev server
2. Visually verify each section:
   - Glass cards show gradient shimmer border (not flat white line)
   - Hero video fades smoothly at top and bottom
   - Hero content is bottom-aligned with avatar stack and vertical scroll indicator
   - All 6 eyebrows render as translucent pill badges (emerald for Testimonials)
   - Italic accent words display in serif italic on Hero, Testimonials, FAQ, CTA
   - CTA Banner fills ~80vh with breathing aurora
   - Clientele cards show colored accent bars (blue/pink/green)
   - HowItWorks connector line pulses subtly
3. Test GSAP animations:
   - Hero entrance timeline fires on page load (eyebrow, headline, buttons animate in)
   - ScrollTrigger sections trigger on scroll
   - CtaBanner entrance animation works
4. Test View Transitions:
   - Navigate to a service page and back — animations reinitialize cleanly
   - No console errors about stale ScrollTrigger instances
5. `npm run build` — confirm no build errors (verified: 19 pages, 3.68s)
6. Test `prefers-reduced-motion` — all animations disabled including `.glass-pill-dot`
7. Lighthouse: confirm no LCP regression (Instrument Serif is self-hosted, no external DNS)
