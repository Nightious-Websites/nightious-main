# Homepage Redesign — Direction B: Liquid Glass Aurora

**Date:** 2026-03-27
**Status:** Implemented

---

## Context

Full aesthetic refresh of the Nightious homepage (nightious.com). The site's core section structure and page functions are unchanged — only the visual language was replaced. The previous design had a solid structure but a generic dark-tech look with per-audience accent colours (blue/pink/green). The new direction creates a unified, cinematic brand identity that stops scrolling.

**What prompted it:** User wanted to leverage motion-first design patterns inspired by motionsites.ai, while keeping the same homepage structure (7 sections, same CTAs, same copy direction).

**Intended outcome:** A homepage that looks premium and distinctive, matching the elevated aesthetic the Nightious brand needs to credibly sell IT services to businesses and creators.

---

## Visual Direction: Liquid Glass Aurora

| Token | Value |
|-------|-------|
| Background | `#02000a` (deep purple-black) |
| Primary accent | `#a855f7` (purple) |
| Secondary accent | `#22c55e` (emerald) |
| Glass background | `rgba(255,255,255,0.03)` |
| Backdrop blur | `blur(32px)` |
| Text primary | `rgba(233,213,255,0.93)` |
| Text muted | `rgba(233,213,255,0.42)` |
| Text dim | `rgba(233,213,255,0.22)` |

**Aurora blobs:** Animated CSS `radial-gradient` ellipses, purple and emerald, blurred 50–80px, pulsing via `@keyframes` at 6–12s intervals.

**Gradient borders:** `::before` pseudo-element with `padding: 1px`, gradient `background`, and `-webkit-mask`/`mask-composite: exclude` to show only the border — no wrapper div needed.

---

## Typography: Cinematic Contrast

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Eyebrows / labels | Orbitron | 400 | Letter-spacing 0.28–0.32em, uppercase, 8–10px |
| Headlines | Exo 2 | 900 | `clamp()` sizing, `letter-spacing: -0.035em`, `line-height: 0.95–1.0` |
| Gradient key phrase | Exo 2 | 900 | `linear-gradient(120deg, #c084fc 0%, #86efac 100%)` + `drop-shadow` |
| Body / description | Exo 2 | 200 | Thin contrast to headline weight |
| UI labels / tags | Exo 2 | 500–600 | Small, spaced |

**Font hosting:** All fonts self-hosted in `/public/fonts/`. CSP `font-src 'self'` blocks external sources. Added `Exo2-Variable.woff2` (weight range 100–900, Latin subset from Google Fonts static CDN) to serve the 200 and 900 weights without additional files.

---

## Section Designs

### 1. Hero
- **Background layers:** HTML5 `<video>` (Mixkit #18059, `assets.mixkit.co`) → dark overlay `rgba(2,0,10,0.62)` → CSS aurora blobs → JS-generated constellation particles (28 dots)
- **Content:** Orbitron status pill (emerald) → Orbitron eyebrow → Exo 2 900 headline (gradient line 2) → thin divider line → Exo 2 200 subtext → dual CTA buttons → social proof stars
- **Glass CTA button:** `backdrop-filter` + gradient-border `::before`
- **GSAP:** Staggered entrance timeline on `astro:page-load`
- **CSP change:** Added `media-src 'self' https://assets.mixkit.co`

### 2. StatsTicker
- **Style:** Holographic ribbon — 72px tall, `border-image` gradient top/bottom, `rgba(168,85,247,0.04)` fill, edge fade masks
- **Content:** 6 stat items (99.9% Uptime, 24/7 Support, <2hr Response, 12 Services, 100% UK Team, 1-Day Setup)
- **Behaviour:** CSS marquee (`translateX(-50%)`), duplicate content for seamless loop, pauses on hover

### 3. ClienteleSection
- **Structure:** Three tabs (For Businesses / For Creators / For Individuals) + 360px fixed-height glass panel
- **Left col (46%):** Animated live chat — Q bubbles (purple glass, right-aligned) → typing indicator (3-dot bounce) → A bubbles (grey glass + gradient avatar, left-aligned). Loops 3 Q/A pairs per category continuously.
- **Right col:** Orbitron label, Exo 2 900 title (plain + gradient word), Exo 2 200 description, pill tags, emerald explore link
- **Critical constraints:** All DOM via `textContent`/`createElement` (XSS hook); fixed `height: 360px` prevents layout shift on chat clear; `clearTimers()` on `astro:before-swap`

### 4. HowItWorks
- **Style:** Electric Timeline — ghost step numbers behind content (3% opacity), glass step cards with gradient-border `::before`
- **Orbs:** 52px glass circles with spinning `conic-gradient` ring (`::after`, 5s rotation), step number in Orbitron
- **Connectors:** Full-width gradient line at orb centre (desktop), shimmer animation travels left-to-right; vertical for mobile
- **GSAP:** ScrollTrigger stagger entrance + connector line `scaleX` expand

### 5. Testimonials
- **Style:** Direction B glass cards with gradient-border `::before` pseudo-element; emerald star ratings; italic 200-weight quotes
- **Behaviour:** Unchanged GSAP infinite-scroll carousel — clones cards, scrolls via `gsap.to(track, { x: -loopDistance, repeat: -1 })`, pauses on hover/touch/focus

### 6. FaqSection
- **Style:** Direction B glass cards with gradient-border on hover; Orbitron ghost numbers; Exo 2 300 answer text
- **Behaviour:** Unchanged 3D flip-card mechanic with RGB-split glitch animation at flip midpoint (275ms); ScrollTrigger stagger entrance

### 7. CtaBanner
- **Style:** Full-bleed section with purple + emerald aurora blobs; Exo 2 900 headline with gradient key phrase; Exo 2 200 subtext
- **Buttons:** Primary (gradient-border glass + purple glow on hover) + ghost secondary
- **GSAP:** ScrollTrigger staggered entrance

---

## Files Changed

| File | Change |
|------|--------|
| `public/fonts/Exo2-Variable.woff2` | Added — variable font, all weights |
| `src/styles/global.css` | Added variable font `@font-face` + Direction B tokens |
| `src/layouts/BaseLayout.astro` | Added `media-src 'self' https://assets.mixkit.co` to CSP |
| `src/components/sections/Hero.astro` | Full rewrite |
| `src/components/sections/StatsTicker.astro` | Full rewrite |
| `src/components/sections/ClienteleSection.astro` | Full rewrite |
| `src/components/sections/HowItWorks.astro` | Full rewrite |
| `src/components/sections/Testimonials.astro` | Full rewrite (carousel JS preserved) |
| `src/components/sections/FaqSection.astro` | Full rewrite (flip+glitch JS preserved) |
| `src/components/sections/CtaBanner.astro` | Full rewrite |

---

## Constraints and Decisions

- **No `innerHTML` in client JS** — XSS security hook blocks any assignment. All DOM creation uses `textContent` + `createElement` + `appendChild`.
- **Self-hosted fonts only** — `font-src 'self'` CSP. One variable font file covers all weights (Exo 2 is a variable font on Google Fonts).
- **`astro:before-swap` / `astro:page-load` lifecycle** — All GSAP timelines and setTimeout chains killed before View Transitions DOM swap.
- **ClienteleSection fixed height** — `height: 360px` (not `min-height`) prevents layout shift when chat messages clear between tab switches.
- **Testimonials and FAQ JS unchanged** — Complex mechanics (GSAP carousel with clone management; 3D flip + glitch effect) were preserved exactly; only CSS aesthetics updated.
