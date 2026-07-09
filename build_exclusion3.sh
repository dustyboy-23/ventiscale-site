#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b

# Exclusion = files touched by commits whose subject starts with "Blog sweep:"
git log origin/fix/audit-findings-2026-07-05 --pretty=format:'%H %s' -- 'app/(marketing)/blog/*/page.tsx' | grep -i '^[a-f0-9]* Blog sweep:' | cut -d' ' -f1 > /tmp/sweep_commit_hashes.txt
echo "=== sweep commit count ==="
wc -l /tmp/sweep_commit_hashes.txt

> /tmp/excluded_correct.txt
while IFS= read -r hash; do
  git show --name-only --pretty=format: "$hash" -- 'app/(marketing)/blog/*/page.tsx' >> /tmp/excluded_correct.txt
done < /tmp/sweep_commit_hashes.txt
sed -i '/^$/d' /tmp/excluded_correct.txt
sort -u /tmp/excluded_correct.txt -o /tmp/excluded_correct.txt
echo "=== total unique files excluded (correct) ==="
wc -l /tmp/excluded_correct.txt

echo ""
echo "=== my range: intersect ==="
> /tmp/my_range_excluded2.txt
> /tmp/my_range_to_process2.txt
while IFS= read -r slug; do
  fpath="app/(marketing)/blog/$slug/page.tsx"
  if grep -qxF "$fpath" /tmp/excluded_correct.txt; then
    echo "$slug" >> /tmp/my_range_excluded2.txt
  else
    echo "$slug" >> /tmp/my_range_to_process2.txt
  fi
done < /tmp/my_range_slugs.txt

echo "--- already-swept in my range (skip) ---"
[ -f /tmp/my_range_excluded2.txt ] && wc -l /tmp/my_range_excluded2.txt && cat /tmp/my_range_excluded2.txt
echo "--- to process in my range ---"
[ -f /tmp/my_range_to_process2.txt ] && wc -l /tmp/my_range_to_process2.txt && cat /tmp/my_range_to_process2.txt
