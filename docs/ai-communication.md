# AI Communication — Handoff Notes for ChatGPT / Codex

**Written by:** Claude (Sonnet 4.6)
**Date:** 2026-03-30
**Context:** Review of PR #14 (merged 2026-03-29) — "Production hardening: CI quality gates, media budgets, accessibility, SEO, and security headers"

---

## To ChatGPT / Codex

This document is a direct communication to you as an AI agent that previously worked on this codebase. It records what you did well, what you broke, what was corrected, and the reasoning behind each decision. The intent is to prevent the same mistakes in future sessions.

---

## What You Did Well — These Changes Were Kept

The following are solid, well-implemented contributions that reflect genuine understanding of the project's goals.

### `src/utils/media.ts`
Your managed autoplay utility is a real improvement over the previous broad `querySelectorAll` approach. Checking `prefers-reduced-motion` and `saveData` before playing, using `IntersectionObserver` for lazy initialization, and guarding against double-play with `data-video-initialized` are all correct, well-considered decisions. This file was kept as-is.

### `src/components/seo/SchemaBlogPosting.astro`
Correct, complete JSON-LD implementation. The `publisher` referencing `https://nightious.com/#organization` to cross-link with the site-level Organization schema is the right approach. Kept as-is.

### Blog `relatedServices` block in `src/pages/blog/[slug].astro`
The tag-to-service mapping is a practical, tag-informed approach. You correctly used `entrySlug()` from `@/utils/services` for slug resolution rather than raw `entry.id` — which means you read and understood the codebase conventions. Kept as-is.

### `src/content/config.ts` blog schema extensions
Adding `updatedDate`, `canonical`, and `ogImage` as optional Zod fields is non-breaking, well-typed, and useful for future editorial work. Kept as-is.

### CI workflow, media budget script, a11y checker
Good infrastructure additions. The quality gates enforce standards that were previously only checked manually. Kept as-is.

### Conditional Analytics/SpeedInsights
Wrapping the Vercel SDKs in `{hasVercelRuntime && ...}` is an improvement — it prevents errors in local dev and GitHub Pages staging where the Vercel runtime isn't present. Better than the original unconditional import. Kept.

### NavBar keyboard improvements
Arrow key navigation in the services dropdown is a genuine accessibility improvement. Kept.

---

## What You Broke — These Were Fixed

Please take note of these for future sessions. Each is a pattern you should check for before submitting a PR.

---

### MISTAKE 1: You removed `<ViewTransitions />` from BaseLayout

**What you did:**
```diff
-import { ViewTransitions } from 'astro:transitions'
...
-    <ViewTransitions />
```

**Why this was wrong:**

This site was deliberately architected around Astro's View Transitions. Every GSAP animation across every page uses `astro:page-load` and `astro:before-swap` lifecycle events — these only fire when `<ClientRouter />` (ViewTransitions) is active. Without it:
- Page navigation triggers full browser reloads instead of smooth in-place DOM swaps
- Visitors see a white flash between every page transition
- The NavBar re-mounts on every navigation

Your band-aid (`window.addEventListener('load', ...)` dispatching a manual `astro:page-load`) only fires once on the initial page load. It does nothing on navigation. It also would have caused double-firing on first load since Astro already dispatches `astro:page-load` natively when ViewTransitions is present.

**The fix:** Restored the import and `<ViewTransitions />` tag. Removed your `window.load` workaround.

**Rule for future sessions:** If you see `astro:page-load` and `astro:before-swap` being listened to across components, `<ViewTransitions />` must be present in BaseLayout. Do not remove it.

---

### MISTAKE 2: You removed the CSP meta tag from BaseLayout

**What you did:**
Removed the `<meta http-equiv="Content-Security-Policy">` tag from BaseLayout and put the CSP only in `vercel.json`.

**Why this was wrong:**

This site deploys to **two** environments:
- `preview` branch → GitHub Pages (staging)
- `main` branch → Vercel (production)

GitHub Pages does not support custom HTTP response headers. `vercel.json` only applies on Vercel. By moving the CSP exclusively to `vercel.json`, you left the staging environment with zero Content Security Policy. This is documented in `.claude/rules/architecture.md`:

> "CSP is delivered via `<meta http-equiv>` in BaseLayout because GitHub Pages does not support custom HTTP response headers."

This rule exists because of this exact scenario. You should have read the architecture rules before modifying BaseLayout.

Additionally, the CSP you wrote in `vercel.json` was missing Intercom domains (the site uses Intercom for customer messaging, documented in `privacy.astro` and `.claude/docs/meta-prompt-supabase-intercom-backend.md`). When Intercom is wired up, its domains need to be in both the meta tag and `vercel.json`.

**The fix:** Restored the CSP meta tag to BaseLayout with the updated policy (Formspree removed since the form is gone, `vercel.live` added for Vercel's preview toolbar). Policy now matches `vercel.json` so both environments are consistent.

**Rule for future sessions:** Any security header that needs to work on GitHub Pages **must** be in a `<meta>` tag in BaseLayout. `vercel.json` alone is insufficient.

---

### MISTAKE 3: You put fake contact details into production

**What you did:**
```html
<a href="tel:+17275550123">Call +1 (727) 555-0123</a>
<a href="https://cal.com/nightious/consultation">Book a Consultation</a>
```

**Why this was wrong:**

`555-0100` through `555-0199` is a US phone number range formally reserved for fictional use in film and television. It is not a real dialable number. Any visitor who tapped "Call" would get a dead line.

`https://cal.com/nightious/consultation` is a URL you invented. No booking page exists at this address. Any visitor who clicked "Book a Consultation" would hit a 404 error.

These were live in production from the moment PR #14 was merged.

**The fix:**
- Email corrected to `support@nightious.com`
- Phone corrected to `(772) 773-6004` (the real business DID)
- Cal.com link removed entirely

**Rule for future sessions:** Never invent contact details, phone numbers, URLs, or any user-facing business information. If you don't know a value, use an obvious placeholder that won't appear real (e.g., `[PHONE_NUMBER_HERE]`), or leave a comment in the code. Do not guess. A visitor who hits a dead number or a 404 booking page may not try again.

---

## Summary

| Change | Verdict |
|--------|---------|
| `media.ts` autoplay utility | Kept — well done |
| `SchemaBlogPosting.astro` | Kept — correct |
| Blog related services block | Kept — correct |
| Blog schema extensions | Kept — clean |
| CI / media budget / a11y scripts | Kept — valuable |
| Conditional Analytics/SpeedInsights | Kept — better than before |
| NavBar keyboard improvements | Kept |
| `<ViewTransitions />` removed | Fixed — restored |
| CSP removed from BaseLayout | Fixed — restored |
| Fake phone + dead cal.com link | Fixed — replaced with real details |
| Wrong email address | Fixed — corrected |

---

## Notes on Working with This Codebase

1. **Always read `.claude/rules/` before touching architecture files.** Rules in that directory document constraints that exist for non-obvious reasons (like the CSP-via-meta-tag requirement). Violating them causes regressions that aren't always immediately visible.

2. **Never remove `<ViewTransitions />`** unless you are deliberately migrating away from Astro's SPA mode — and that decision should be discussed with the project owner first.

3. **Contact info, URLs, phone numbers, email addresses must come from the project owner.** Do not invent them. Do not use placeholder ranges that look real (like 555 numbers). If uncertain, leave a visible placeholder comment in the code.

4. **This site deploys to two hosts.** Staging = GitHub Pages (`preview` branch). Production = Vercel (`main` branch). Anything that only works on Vercel is incomplete.

5. **Intercom is planned but not yet wired up.** When you implement it, update the CSP in both `src/layouts/BaseLayout.astro` and `vercel.json` to include the required Intercom domains.
