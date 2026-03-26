import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'

const SITE_URL = 'https://nightious.com'
const isStaging = Boolean(process.env.SITE_BASE)

export default defineConfig({
  site: SITE_URL,
  base: process.env.SITE_BASE ?? '/',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // Exclude 404 — error pages must never appear in sitemaps
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        // Homepage: crawled weekly, highest priority
        if (item.url === SITE_URL || item.url === `${SITE_URL}/`) {
          return { ...item, changefreq: 'weekly', priority: 1.0 }
        }
        // Services hub: pillar page, high priority
        if (item.url === `${SITE_URL}/services`) {
          return { ...item, changefreq: 'monthly', priority: 0.9 }
        }
        // Individual service pages: core SEO targets
        if (item.url.startsWith(`${SITE_URL}/services/`)) {
          return { ...item, changefreq: 'monthly', priority: 0.8 }
        }
        // Contact, audience bundle pages (/for-businesses, /for-creators, /for-individuals)
        return { ...item, changefreq: 'monthly', priority: 0.7 }
      },
    }),
    robotsTxt({
      // Block all crawlers on staging (GitHub Pages preview) to prevent
      // duplicate-content penalties from staging URLs being indexed.
      // On production: allow everything — no disallow rules needed since
      // the 404 page returns HTTP 404 status (crawlers skip it automatically)
      // and AI crawlers (GPTBot, Google-Extended, PerplexityBot, etc.) are
      // intentionally allowed for brand visibility in AI-powered search.
      policy: isStaging
        ? [{ userAgent: '*', disallow: '/' }]
        : [{ userAgent: '*', allow: '/' }],
      sitemap: isStaging ? false : `${SITE_URL}/sitemap-index.xml`,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
