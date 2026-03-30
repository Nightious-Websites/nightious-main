/**
 * Console error checker — navigates between key pages via ViewTransitions
 * and captures any JS errors (especially GSAP) in the console.
 */
import { chromium } from '@playwright/test'

const BASE = 'http://localhost:4321'

const ROUTES = [
  '/',
  '/services',
  '/services/website-solutions',
  '/services/ai-integration',
  '/contact',
  '/blog',
]

const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []

page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    errors.push({ type: msg.type(), text: msg.text(), url: page.url() })
  }
})

page.on('pageerror', err => {
  errors.push({ type: 'pageerror', text: err.message, url: page.url() })
})

// Hard-navigate to homepage first
console.log(`\nNavigating to ${BASE}/`)
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

// Then click-navigate between routes to simulate ViewTransitions swaps
for (const route of ROUTES.slice(1)) {
  console.log(`Swapping to ${route}`)
  await page.evaluate((href) => {
    const a = document.createElement('a')
    a.href = href
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, route)
  await page.waitForTimeout(1500)
}

// Also navigate back to homepage to test return swap
console.log('Swapping back to /')
await page.evaluate(() => {
  const a = document.createElement('a')
  a.href = '/'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
})
await page.waitForTimeout(1500)

await browser.close()

if (errors.length === 0) {
  console.log('\n✓ No console errors or warnings detected across page swaps.\n')
} else {
  console.log(`\n✗ ${errors.length} issue(s) found:\n`)
  errors.forEach(({ type, text, url }) => {
    console.log(`  [${type}] on ${url}`)
    console.log(`  → ${text}\n`)
  })
  process.exit(1)
}
