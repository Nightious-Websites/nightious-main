import { spawn } from 'node:child_process'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE_URL = 'http://127.0.0.1:4321'
const ROUTES = ['/', '/services', '/contact', '/blog/welcome']
const IGNORE_RULES = [
  'color-contrast',
]

function startPreviewServer() {
  return spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4321'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
}

async function waitForServer(url, maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      // Retry until preview is up.
    }
    await sleep(500)
  }
  throw new Error(`Preview server did not become ready at ${url}`)
}

async function run() {
  const preview = startPreviewServer()

  try {
    await waitForServer(BASE_URL)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()

    const violations = []

    for (const route of ROUTES) {
      const page = await context.newPage()
      const url = `${BASE_URL}${route}`
      await page.goto(url, { waitUntil: 'networkidle' })

      const result = await new AxeBuilder({ page })
        .disableRules(IGNORE_RULES)
        .analyze()

      if (result.violations.length > 0) {
        violations.push({ route, violations: result.violations })
      }

      await page.close()
    }

    await context.close()
    await browser.close()

    if (violations.length > 0) {
      console.error('Accessibility violations found:')
      for (const item of violations) {
        console.error(`\nRoute: ${item.route}`)
        for (const v of item.violations) {
          console.error(`- [${v.impact ?? 'unknown'}] ${v.id}: ${v.help}`)
          console.error(`  ${v.helpUrl}`)
        }
      }
      process.exitCode = 1
      return
    }

    console.log(`Axe checks passed on ${ROUTES.length} routes.`)
  } finally {
    preview.kill('SIGTERM')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
