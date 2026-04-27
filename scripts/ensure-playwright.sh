#!/usr/bin/env bash
set -euo pipefail

if node -e "import('@playwright/test').then(async ({ chromium }) => { const browser = await chromium.launch({ headless: true }); await browser.close(); }).catch(() => process.exit(1));" >/dev/null 2>&1; then
  echo "✅ Playwright browser already available"
  exit 0
fi

echo "ℹ️ Installing Playwright Chromium browser..."
npx playwright install chromium
