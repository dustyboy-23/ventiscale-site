#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b

FILES=$(cat /tmp/my_range_to_process2.txt)

echo "=== Re-grep for known-failed patterns across all 24 processed files ==="
for slug in $FILES; do
  f="app/(marketing)/blog/$slug/page.tsx"
  hits=$(grep -nE '68-.84|171%|74%|30% of founder time|72% trust|Sprout Social.*71%|32\.5%|Gartner.*65%|Deep Marketing' "$f" 2>/dev/null || true)
  if [ -n "$hits" ]; then
    echo "--- $slug ---"
    echo "$hits"
  fi
done

echo ""
echo "=== Brace balance check across all 24 files ==="
for slug in $FILES; do
  f="app/(marketing)/blog/$slug/page.tsx"
  python3 -c "
s = open('$f').read()
o, c = s.count('{'), s.count('}')
if o != c:
    print('MISMATCH in $slug: braces', o, c)
"
done

echo ""
echo "=== Done ==="
