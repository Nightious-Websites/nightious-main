# Release Checklist

## Environment
- [ ] `PUBLIC_FORMSPREE_ID` is set in Vercel for Production.
- [ ] Any analytics/error-monitoring keys are set for Production.

## Functional smoke tests
- [ ] Homepage loads and hero media behaves correctly.
- [ ] Contact form submits successfully in production.
- [ ] Contact form error state shows useful fallback messaging.
- [ ] Services pages render correctly and video fallbacks work.

## SEO & indexing
- [ ] `sitemap-index.xml` generated and reachable.
- [ ] `robots.txt` allows production indexing and blocks staging as intended.
- [ ] Canonical URLs point to `https://nightious.com`.
- [ ] Blog pages include BlogPosting structured data.

## Quality gates
- [ ] `npm run build` passes.
- [ ] `npm run check:media` passes.
- [ ] `npm run lhci:local` passes for every configured route in `lighthouserc.json`.
- [ ] Lighthouse `errors-in-console` audit reports `0` for every audited route.
- [ ] GitHub Actions quality workflow passes.

## Security headers
- [ ] CSP header present in deployment response.
- [ ] HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy present.

## Rollback plan
- [ ] Last known good deployment identified in Vercel.
- [ ] Rollback tested or documented by on-call owner.
