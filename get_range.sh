#!/bin/bash
set -e
cd /home/dustin/vs-sweep-b
find "app/(marketing)/blog" -mindepth 1 -maxdepth 1 -type d | sort > /tmp/all_slugs_paths.txt
while IFS= read -r p; do basename "$p"; done < /tmp/all_slugs_paths.txt > /tmp/all_slugs.txt
grep -iE '^[f-m]' /tmp/all_slugs.txt | sort > /tmp/my_range_slugs.txt
echo "=== all slugs count ==="
wc -l /tmp/all_slugs.txt
echo "=== my range f-m count ==="
wc -l /tmp/my_range_slugs.txt
cat /tmp/my_range_slugs.txt
