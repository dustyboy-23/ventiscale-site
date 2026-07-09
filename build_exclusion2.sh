#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b

echo "=== identify the bulk creation commit(s) to EXCLUDE from exclusion-building ==="
git log origin/fix/audit-findings-2026-07-05 --oneline | grep -i "Ship 3 weeks" || true

echo ""
echo "=== all commit subjects that are NOT the bulk-creation commit, touching blog page.tsx ==="
# List all commits touching blog page.tsx files, with subject, oldest first
git log origin/fix/audit-findings-2026-07-05 --reverse --pretty=format:'%H %s' -- 'app/(marketing)/blog/*/page.tsx' > /tmp/all_blog_commits.txt
wc -l /tmp/all_blog_commits.txt
echo "--- first 5 (likely bulk creation) ---"
head -5 /tmp/all_blog_commits.txt
echo "--- unique subject patterns ---"
cut -d' ' -f2- /tmp/all_blog_commits.txt | sed -E 's/[a-z0-9-]{15,}/<slug>/' | sort | uniq -c | sort -rn | head -30
