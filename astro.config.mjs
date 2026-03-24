import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'

export default defineConfig({
  site: 'https://nightious.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap(),
    robotsTxt(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
