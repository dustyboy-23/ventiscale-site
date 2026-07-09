#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b
echo "=== searching for 'verify-and-fix' commits (the new-style sweep) ==="
git log origin/fix/audit-findings-2026-07-05 --oneline --all | grep -i "verify-and-fix" || echo "none found"
echo ""
echo "=== last 40 commits full messages ==="
git log origin/fix/audit-findings-2026-07-05 --oneline | head -40
echo ""
echo "=== all branches/refs available ==="
git branch -a
