# ClienteleSection — Glass & Futuristic Redesign

**Date:** 2026-03-26
**File:** `src/components/sections/ClienteleSection.astro`

---

## Goal

Strip all per-card accent colours and emojis from the ClienteleSection cards. Replace with a uniform pure-glass aesthetic using the site's single accent colour (purple) as the only chromatic element. The result should feel elegant and futuristic — not segmented by colour.

---

## Resting State (cards not hovered)

Three compact glass cards side by side, centred in the row.

**Visual:**
- Background: `rgba(255,255,255,0.03)` with `backdrop-filter: blur`
- Border: `1px solid rgba(255,255,255,0.1)` on all sides
- Top border: `2px solid rgba(168,85,247,0.55)` — the only accent, uniform across all three cards
- No emoji, no per-card colour classes (`.biz`, `.cre`, `.ind` removed entirely)
- No `border-color` overrides via inline styles or JS

**Content:**
- Label text ("For Businesses", "For Creators", "For Individuals") centred, white at ~88% opacity
- "hover to expand" hint below in muted white (~28% opacity)
- No icon or decorative element

**Sizing:**
- Cards size to their text content width (`max-width: max-content`)
- Container centres the group (`justify-content: center`)
- On hover: hovered card expands to full row width, siblings collapse to zero (existing flex animation unchanged)

---

## Expanded State (card hovered)

Card fills the full section row width. Layout splits into two zones:

### Left — Portrait illustration (280px)
- Fixed 280px width, flush to the card's left edge with no padding
- Fills the full card height (aligned `stretch`)
- Separated from right content by `1px solid rgba(168,85,247,0.12)` right border
- Contains a unique SVG illustration per card in white/grey/purple tones only (no blue, pink, or green)
- Three distinct designs:
  - **Businesses** — network topology (nodes + spokes + grid)
  - **Creators** — audio waveform (vertical bars + glow)
  - **Individuals** — shield + circuit traces + lock centre

### Right — Content column (padded, `flex: 1`)
Stacked top to bottom:
1. **Title** — bold, white at 88% opacity
2. **Horizontal divider** — `rgba(255,255,255,0.07)`
3. **Chat thread** — existing Q&A bubble pairs (question right-aligned purple, answer left-aligned grey + avatar). Chat starts on first hover, cycles through audience-relevant convos.
4. **Horizontal divider**
5. **Audience tags** — small pill tags, white/grey tones only (`rgba(255,255,255,0.4)` text, `rgba(255,255,255,0.08)` border)
6. **Explore link** — `"Explore For Businesses →"` in `rgba(168,85,247,0.7)`

---

## What Gets Removed

| Element | Action |
|---------|--------|
| `.biz`, `.cre`, `.ind` CSS classes | Deleted entirely |
| Emoji `<span>` elements | Removed from template |
| Per-card inline `border-color` / `background-color` styles | Removed |
| `data-rgb` / `data-color` attributes on card `<a>` elements | Removed (no longer used for card visuals) |
| Separate `#clientele-thread` panel below cards | Removed — chat moves inside each expanded card |
| `updateCardVisuals()` JS function | Removed — no per-card colour changes on hover |
| `.card-reveal` expand-down animation | Replaced by portrait+content side-by-side layout |
| `.card-hint` paragraph | Kept but unstyled (plain muted text) |

> **Note:** `data-rgb` / `data-color` on the mobile **pill tab** `<button>` elements are kept — pill tab coloring is separate scope and not changed by this redesign.

---

## Chat Architecture Change

Currently there is one shared `#clientele-thread` panel below the cards. The redesign moves chat **inside each card's expanded layout**.

**New structure per card:**
- Each card `<a>` contains a `.card-chat-window` div and a `.card-typing-indicator` div in its right column
- On `mouseenter`, the hovered card's own chat window is targeted (no more shared panel)
- `ColState` is keyed per card — each card maintains its own `index`, `pairEls`, `activeTl`, `pendingDc`, and `started` flag
- `switchCategory()` is removed — category is always determined by which card is hovered
- On `mouseleave` the chat window's content is preserved but hidden (card collapses); on re-hover it continues where it left off

**JS state change:** `activeState` becomes a `Map<string, ColState>` keyed by `b.id`, one entry per card. Each entry is initialised on first hover of that card.

---

## What Stays the Same

- Flex expand animation (`flex-basis: 0 → 100%`, siblings collapse) — unchanged
- GSAP card entrance animation (stagger fade-in on scroll)
- Core `runPair` / `createPairEl` logic — unchanged, just pointed at each card's own window
- Conversation data arrays (`businessConvos`, `creatorConvos`, `individualConvos`) — unchanged
- Mobile pill tabs — kept, trigger the relevant card's chat to start
- `@media (hover: none)` fallback — always shows expanded layout on touch
- `@media (prefers-reduced-motion)` — static, no animation
- `astro:before-swap` / `astro:page-load` GSAP lifecycle pattern

---

## SVG Illustration Spec

All three illustrations share the same visual language:

- Background: `rgba(168,85,247,0.03)` — very faint purple tint
- Grid lines: `rgba(168,85,247,0.08)` — subtle reference grid
- Structural lines (spokes, waveform bars, circuit traces): `rgba(168,85,247,0.18–0.22)`
- Node circles / accent dots: `rgba(168,85,247,0.1)` fill, `rgba(168,85,247,0.4)` stroke
- Centre highlight (hub, peak bar, lock dot): `rgba(168,85,247,0.9)` — the brightest element
- No other colours

Portrait aspect ratio — rendered via `preserveAspectRatio="xMidYMid slice"` so they fill the left panel regardless of card height.

---

## Mobile Behaviour

Below `768px`: cards stack vertically. Each card shows its expanded layout by default (portrait illustration visible, content below). Chat thread starts automatically with a short delay after scroll entrance. Mobile pill tabs switch between categories.

---

## Accessibility

- Collapsed cards: `tabindex="-1"`, `aria-hidden="true"` (existing pattern, unchanged)
- Portrait SVG: `aria-hidden="true"` — decorative
- Chat thread: `aria-live="polite"` on thread container (existing)
- Keyboard users: `focus-within` triggers expansion (existing)
