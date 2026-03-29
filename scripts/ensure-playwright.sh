#!/usr/bin/env bash
set -euo pipefail

if npx playwright --version >/dev/null 2>&1; then
  if [ -x "$HOME/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell" ]; then
    echo "✅ Playwright browser already available"
    exit 0
  fi

  if [ -d "$HOME/.cache/ms-playwright" ] && find "$HOME/.cache/ms-playwright" -maxdepth 4 -type f -name 'chrome-headless-shell' | grep -q .; then
    echo "✅ Playwright browser already available"
    exit 0
  fi
fi

echo "ℹ️ Installing Playwright Chromium browser..."
npx playwright install chromium
