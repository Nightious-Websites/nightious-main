import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { chromium } from '@playwright/test'

const [, , targetUrl = 'http://127.0.0.1:4321', outputPath = 'artifacts/screenshot.png'] = process.argv

async function main() {
  const outDir = path.dirname(outputPath)
  await fs.mkdir(outDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  await page.goto(targetUrl, { waitUntil: 'networkidle' })
  await page.screenshot({ path: outputPath, fullPage: true })

  await context.close()
  await browser.close()

  console.log(`Screenshot saved to ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
