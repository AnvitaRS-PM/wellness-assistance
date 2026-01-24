#!/bin/bash

# NUCLEAR OPTION - Strip ALL console.log and disable AsyncStorage

echo "🔥 NUCLEAR PERFORMANCE FIX"
echo "=========================="

cd "$(dirname "$0")"

# Backup original files
echo "1. Creating backups..."
mkdir -p .backups
cp -r src .backups/src_$(date +%s)

# Remove ALL console statements from JavaScript files
echo "2. Removing ALL console.log/warn/error/info/debug statements..."

find src -name "*.js" -type f | while read file; do
    # Comment out all console statements
    sed -i.bak 's/^[[:space:]]*console\.\(log\|warn\|error\|info\|debug\)/\/\/ console.\1/g' "$file"
    # Remove backup files
    rm -f "${file}.bak"
done

echo "3. Done! All console statements commented out"
echo ""
echo "RESTART YOUR APP NOW:"
echo "  npm start -- --reset-cache"
echo ""
