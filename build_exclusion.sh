#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b
# Build exclusion list strictly from commits that are part of the "Blog sweep: remove unsourced stats" batches
# plus any earlier per-post "Blog: <slug>" fix commits, scoped to blog page.tsx files.
git log origin/fix/audit-findings-2026-07-05 --name-only --pretty=format: -- 'app/(marketing)/blog/*/page.tsx' | sort -u | sed '/^$/d' > /tmp/excluded_full.txt
wc -l /tmp/excluded_full.txt

# Now intersect with my f-m range
> /tmp/my_range_excluded.txt
> /tmp/my_range_to_process.txt
while IFS= read -r slug; do
  fpath="app/(marketing)/blog/$slug/page.tsx"
  if grep -qxF "$fpath" /tmp/excluded_full.txt; then
    echo "$slug" >> /tmp/my_range_excluded.txt
  else
    echo "$slug" >> /tmp/my_range_to_process.txt
  fi
done < /tmp/my_range_slugs.txt

echo "=== my range: already touched (skip) ==="
cat /tmp/my_range_excluded.txt 2>/dev/null | wc -l
cat /tmp/my_range_excluded.txt 2>/dev/null

echo "=== my range: to process ==="
cat /tmp/my_range_to_process.txt 2>/dev/null | wc -l
cat /tmp/my_range_to_process.txt 2>/dev/null
