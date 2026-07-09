#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b
for slug in facebook-marketing-small-business-2026 klaviyo-ai-autonomous-marketing-2026 meta-attribution-broken-ios-shopify-2026 month-to-month-vs-retainer-marketing; do
  echo "=== $slug ==="
  git log --oneline -- "app/(marketing)/blog/$slug/page.tsx"
  echo ""
done
