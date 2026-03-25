# Homepage V2 — Design Spec

> **Sub-project 2 of 2.** Homepage section redesigns. Sub-project 1 (Bundle Pages) is complete.

**Goal:** Redesign homepage sections to remove jargon-centric messaging, add the bundle gateway, make testimonials dynamic, fix the FAQ, and ensure every section is visually engaging with humanized copy.

**Tech Stack:** Astro 5 · Tailwind v4 · GSAP + ScrollTrigger · Existing CSS tokens

**Anti-slop rule:** All copy follows the anti-slop guide at `.claude/brainstorms/anti-slop-copywriting-guide.md`. No leverage, seamless, cutting-edge, empower, etc. Be specific. Vary rhythm. Write like you talk.

---

## Section Changes Overview

| # | Section | Action | What changes |
|---|---------|--------|-------------|
| 1 | Hero | **No change** | Already approved |
| 2 | StatsTicker | **Fix + rewrite content** | Fix loop bug, replace brand promises with service names |
| 3 | JargonMorph → ChatBubbles | **Replace** | New component: chat-style Q&A with service links |
| 4 | ServicesGrid → BundleGateway | **Replace** | 3 audience cards linking to bundle pages |
| 5 | HowItWorks | **Copy rewrite** | Strip jargon mentions, rewrite step descriptions |
| 6 | Testimonials | **Rewrite** | Infinite marquee wall, 2 rows, 8 testimonials |
| 7 | WhoWeHelp | **Delete** | Merged into BundleGateway |
| 8 | FaqSection | **Fix + enhance** | Fix visible answer bleed, add card glow on expand |
| 9 | CtaBanner | **No change** | Already approved |

**New section order in index.astro:**
```
Hero → StatsTicker → ChatBubbles → BundleGateway → HowItWorks → Testimonials → FaqSection → CtaBanner
```

---

## 1. StatsTicker — Fix Bug + New Content

**Bug:** Text disappears on loop. The GSAP tween resets `x` to 0 when the first copy reaches `-offsetWidth`, but if the container width changes (e.g., resize), the jump is visible. Fix: recalculate width on each repeat cycle using `onRepeat` callback, or use CSS `animation` for the marquee instead of GSAP (simpler, no JS width dependency).

**New content:** Replace brand promises with service names as a scrolling showcase:
```
Website Solutions · Email Solutions · AI Integration · Digital Marketing · Computer Services · Streaming Consultation · Online Privacy · Domain Solutions · Software Services · Organizational Effectiveness · Custom Services · Training & Documentation
```

Separator: `·` (middle dot) between each, same `gradient-text` styling.

---

## 2. ChatBubbles — New Component (replaces JargonMorph)

**File:** `src/components/sections/ChatBubbles.astro` (new)

### Content — 5 Q&A Pairs

Each pair: a real customer problem → a direct Nightious response + service link.

**Pair 1:**
- Q: "My website looks outdated and nobody can find us on Google"
- A: "We rebuild it from scratch — fast, mobile-first, SEO baked in from day one. Most clients see ranking improvements within weeks."
- Link: Website Solutions

**Pair 2:**
- Q: "We're spending hours every week on stuff that should be automated"
- A: "We build AI workflows that handle the repetitive work — routing, reporting, data entry. Your team gets back to the stuff that actually moves the needle."
- Link: AI Integration

**Pair 3:**
- Q: "I keep getting hacked and I don't know how to lock things down"
- A: "Full security audit, VPN, password manager, 2FA on every account. We find the gaps and close them. Most setups take a day."
- Link: Online Privacy

**Pair 4:**
- Q: "My stream looks amateur compared to everyone else on Twitch"
- A: "OBS setup, overlays, audio, multi-platform — we get your production quality where it needs to be in one session."
- Link: Streaming Consultation

**Pair 5:**
- Q: "We need a website, email, domain, and marketing but don't know where to start"
- A: "That's what the free consultation is for. We figure out what you actually need, build a plan, and quote it — no surprises."
- Link: Contact

### Layout
- Section heading: eyebrow "HOW WE HELP" + H2 "Real problems. Real fixes."
- Customer messages: right-aligned, purple-tinted glass bubbles (`rgba(168,85,247,0.1)` bg, purple border)
- Nightious responses: left-aligned, dark glass bubbles with Nightious icon avatar, service link below each
- Typing indicator (3 animated dots) appears before each response reveals
- Max-width: 640px centered

### Animation (GSAP)
- On scroll into view: first Q&A pair reveals immediately
- Remaining pairs reveal with stagger as user scrolls further (ScrollTrigger `start: 'top 70%'`)
- Each pair: Q slides in from right (opacity 0, x: 30 → 0), then after 300ms delay the typing indicator appears for 600ms, then the A slides in from left (opacity 0, x: -30 → 0)
- Reduced motion: all pairs visible immediately, no slide animation
- No `reveal-section` — component owns its own animation

### GSAP Lifecycle
- `let chatTl: gsap.core.Timeline | null = null`
- `astro:before-swap` kills timeline
- `astro:page-load` calls `initChatBubbles`

---

## 3. BundleGateway — New Component (replaces ServicesGrid + WhoWeHelp)

**File:** `src/components/sections/BundleGateway.astro` (new)

### Content
- Eyebrow: "OUR SOLUTIONS"
- H2: "Built for how you work"
- 3 glass cards linking to bundle pages:

**Card 1 — For Businesses (blue: 59,130,246)**
- Icon/emoji: 🏢
- Tagline: "IT, websites, marketing, AI, and everything your business runs on."
- Top services: AI Integration, Website Solutions, + 8 more
- Link: `/for-businesses`

**Card 2 — For Creators (pink: 236,72,153)**
- Icon/emoji: 🎥
- Tagline: "Streaming, web presence, audience growth, and the tools to go pro."
- Top services: Streaming Setup, Digital Marketing, + 7 more
- Link: `/for-creators`

**Card 3 — For Individuals (green: 34,197,94)**
- Icon/emoji: 🔒
- Tagline: "Privacy, device support, and personal tech that just works."
- Top services: Online Privacy, Computer Services, + 3 more
- Link: `/for-individuals`

Below cards: "or view all 12 services →" link to `/services`

### Layout
- `grid grid-cols-1 md:grid-cols-3 gap-6`
- Each card: glass background, accent-colored border, hover lifts 4px + border glow brightens
- Cursor-tracking glow across all 3 cards (same technique as LivingGrid but simpler — 3 cards only)
- Staggered entrance on scroll

### Animation
- ScrollTrigger stagger: cards fade in with `opacity: 0, y: 40` → `opacity: 1, y: 0`, stagger 0.12
- Cursor glow: global mousemove, each card gets proximity-based `box-shadow`
- No `reveal-section` — component owns animation
- Standard GSAP lifecycle cleanup

---

## 4. HowItWorks — Copy Rewrite Only

**File:** Modify `src/components/sections/HowItWorks.astro` (frontmatter data only)

Strip all "plain English" / "jargon" / "we explain everything" messaging. Replace with value-focused copy:

```javascript
const steps = [
  {
    number: '01',
    heading: 'Tell us what you need',
    bodyHtml: 'Fill out the contact form or give us a call. No questionnaires, no runaround. Just tell us what\'s not working. <strong style="color: var(--color-purple-light);">We respond within 4 hours.</strong>',
  },
  {
    number: '02',
    heading: 'We send you a clear plan',
    bodyHtml: 'We look at your situation and put together a proposal. What we\'ll do, what it costs, how long it takes. <strong style="color: var(--color-purple-light);">No hidden fees. No long-term lock-in.</strong>',
  },
  {
    number: '03',
    heading: 'We get it done',
    bodyHtml: 'We handle the work end-to-end and keep you posted along the way. When it\'s finished, we make sure you know how everything works. <strong style="color: var(--color-purple-light);">Ongoing support if you need it.</strong>',
  },
]
```

No layout changes. The horizontal timeline from V1 stays.

---

## 5. Testimonials — Infinite Marquee Wall

**File:** Rewrite `src/components/sections/Testimonials.astro`

### Content — 8 Testimonials (expanded from 3)

```javascript
const testimonials = [
  { quote: "They redesigned our site in two weeks. Traffic doubled the next month.", name: "Sarah M.", role: "Mitchell & Co. Accounting", stars: 5 },
  { quote: "Set up our entire AI pipeline in a week. We've saved 20+ hours a month since.", name: "James R.", role: "Riverside Auto Services", stars: 5 },
  { quote: "Finally, an IT company that picks up the phone. Fixed our email issues same day.", name: "Emily C.", role: "Chen's Catering Co.", stars: 5 },
  { quote: "They built custom automation for our booking system. No one else even understood what we needed.", name: "Marcus T.", role: "Clearview Dental", stars: 5 },
  { quote: "My stream setup went from amateur to professional in one session. Worth every penny.", name: "Alex K.", role: "Content Creator", stars: 5 },
  { quote: "Got us off GoDaddy, set up Cloudflare, migrated our email — zero downtime.", name: "Priya N.", role: "Northside Legal Group", stars: 5 },
  { quote: "The privacy audit found three accounts that had been breached. They locked everything down that afternoon.", name: "David L.", role: "Freelance Photographer", stars: 5 },
  { quote: "We needed a site, email, and marketing plan. They handled all of it and came in under budget.", name: "Rachel W.", role: "Bloom Beauty Studio", stars: 5 },
]
```

### Layout — 2-Row Infinite Marquee
- Section heading: eyebrow "CLIENT RESULTS" + H2 "Don't take our word for it"
- **Row 1:** Scrolls left continuously (GSAP `x` tween, `repeat: -1`)
- **Row 2:** Scrolls right continuously (offset start position, opposite direction)
- Each row: duplicated cards for seamless loop (same technique as StatsTicker)
- Card width: ~280px, glass background, accent border, stars, quote, name, role
- **Gradient edge masks:** Left and right edges fade to `--color-bg-deep` (60px wide `linear-gradient`)
- **Hover:** Pause the row, hovered card scales up 1.03x with purple glow
- No `reveal-section` — marquee manages its own animation

### GSAP
- Two separate timelines (row1Tl, row2Tl)
- `repeat: -1`, no yoyo
- Row 1: `x: 0 → -copyWidth`, row 2: `x: -copyWidth → 0`
- Hover pauses via `tl.pause()` / `tl.resume()` on mouseenter/mouseleave
- `astro:before-swap` kills both timelines
- Reduced motion: static grid (no scrolling), show first 4 testimonials in a 2x2 grid

---

## 6. FaqSection — Fix + Visual Enhancement

**File:** Modify `src/components/sections/FaqSection.astro`

### Fixes
1. **Visible answer bleed:** The `height: 0; overflow: hidden` approach may show a pixel of content on some browsers. Add `padding: 0` to collapsed state and animate padding alongside height.
2. **Strip jargon copy:** FAQ answer for "Do I need to be technical?" — remove "We translate everything into plain English" and similar. Replace with: "No. You tell us the problem, we handle the rest. If you have questions about what we did, we'll walk you through it."

### Enhancements
- When a FAQ item is expanded, its `.glass` container gets a brighter border: `border-color: rgba(168,85,247,0.3)` (vs default `rgba(255,255,255,0.1)`)
- Smooth GSAP transition on the border color change (0.2s)
- Neon indicator stays as-is (vertical bar `scaleY` animation)
- All other layout stays (split left-label / right-accordion)

### Updated FAQ Copy (humanized)

```javascript
const faqs = [
  {
    q: 'Do you require long-term contracts?',
    a: 'No. We do project-based work and flexible retainers. If it\'s not working out, you walk. Most clients stick around anyway.',
  },
  {
    q: 'How quickly can you start?',
    a: 'We usually respond within 4 hours and can start discovery the same week. Fast turnaround is how we work, not a premium add-on.',
  },
  {
    q: 'Do I need to be technical to work with you?',
    a: 'No. You tell us the problem, we handle the rest. If you have questions about what we did, we\'ll walk you through it.',
  },
  {
    q: 'What if I\'m not sure what I need?',
    a: 'That\'s what the free consultation is for. Tell us your goal and we\'ll map out the options. No pressure toward the expensive one.',
  },
  {
    q: 'Do you work with businesses outside the US?',
    a: 'Yes. We work with clients worldwide. All communication is async-friendly, so time zones are never a problem.',
  },
]
```

---

## 7. index.astro Updates

### Import Changes
```diff
- import JargonMorph from '@/components/sections/JargonMorph.astro'
- import ServicesGrid from '@/components/sections/ServicesGrid.astro'
- import WhoWeHelp from '@/components/sections/WhoWeHelp.astro'
+ import ChatBubbles from '@/components/sections/ChatBubbles.astro'
+ import BundleGateway from '@/components/sections/BundleGateway.astro'
```

### Section Order
```astro
<Hero />
<StatsTicker />
<ChatBubbles />
<BundleGateway />
<HowItWorks />
<Testimonials />
<FaqSection />
<CtaBanner />
```

### Meta Description Update
```diff
- description="Web design, AI integration, IT support & digital marketing for small businesses. No jargon. No long contracts. Get a free quote from Nightious today."
+ description="Web design, AI integration, IT support & digital marketing for businesses, creators, and individuals. No long contracts. Free quote from Nightious."
```

---

## 8. File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/components/sections/ChatBubbles.astro` | **Create** | Chat-style Q&A section with GSAP reveal |
| `src/components/sections/BundleGateway.astro` | **Create** | 3 audience cards linking to bundle pages |
| `src/components/sections/StatsTicker.astro` | **Modify** | Fix loop bug, replace content with service names |
| `src/components/sections/HowItWorks.astro` | **Modify** | Rewrite step copy (frontmatter only) |
| `src/components/sections/Testimonials.astro` | **Rewrite** | Infinite marquee wall, 8 testimonials, 2 rows |
| `src/components/sections/FaqSection.astro` | **Modify** | Fix answer bleed, add border glow, rewrite copy |
| `src/pages/index.astro` | **Modify** | Swap imports, remove WhoWeHelp, update meta |
