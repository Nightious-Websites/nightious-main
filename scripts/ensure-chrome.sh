#!/usr/bin/env bash
set -euo pipefail

if command -v google-chrome >/dev/null 2>&1; then
  echo "✅ google-chrome already available"
  exit 0
fi

if command -v google-chrome-stable >/dev/null 2>&1; then
  echo "✅ google-chrome-stable already available"
  exit 0
fi

echo "ℹ️ Chrome not found. Installing Google Chrome..."

apt-get update
apt-get install -y wget
wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O /tmp/google-chrome.deb
apt-get install -y /tmp/google-chrome.deb

if command -v google-chrome >/dev/null 2>&1 || command -v google-chrome-stable >/dev/null 2>&1; then
  echo "✅ Chrome installed successfully"
else
  echo "❌ Chrome installation finished but binary not found in PATH" >&2
  exit 1
fi
