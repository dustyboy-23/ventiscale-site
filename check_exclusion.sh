#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b
echo "=== git log check: what does --name-only actually show, unfiltered ==="
git log origin/fix/audit-findings-2026-07-05 --oneline | head -20
echo "=== number of commits on this branch ==="
git log origin/fix/audit-findings-2026-07-05 --oneline | wc -l
echo "=== diff between main/master and this branch - files touched ==="
git merge-base origin/fix/audit-findings-2026-07-05 origin/main 2>/dev/null || git merge-base origin/fix/audit-findings-2026-07-05 origin/master 2>/dev/null || echo "no common base found with main/master"
