#!/bin/bash

# Performance Fix Script for Wellness Assistance App
# This script clears caches and optimizes the app

echo "🚀 Starting Performance Optimization..."
echo ""

# 1. Clear Metro Bundler Cache
echo "1️⃣ Clearing Metro Bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-map-* 2>/dev/null || true
echo "   ✅ Metro cache cleared"
echo ""

# 2. Clear Watchman (if installed)
echo "2️⃣ Clearing Watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all 2>/dev/null || true
    echo "   ✅ Watchman cleared"
else
    echo "   ⚠️  Watchman not installed (optional)"
fi
echo ""

# 3. Clear React Native cache
echo "3️⃣ Clearing React Native cache..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
echo "   ✅ React Native cache cleared"
echo ""

# 4. Clear node_modules cache
echo "4️⃣ Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true
echo "   ✅ node_modules cache cleared"
echo ""

# 5. Clear iOS build (if exists)
echo "5️⃣ Clearing iOS build cache..."
rm -rf ios/build 2>/dev/null || true
rm -rf ios/Pods 2>/dev/null || true
echo "   ✅ iOS cache cleared"
echo ""

# 6. Clear Android build (if exists)
echo "6️⃣ Clearing Android build cache..."
rm -rf android/build 2>/dev/null || true
rm -rf android/app/build 2>/dev/null || true
echo "   ✅ Android cache cleared"
echo ""

echo "✨ All caches cleared!"
echo ""
echo "📱 To start the app with a clean cache, run:"
echo "   npm start -- --reset-cache"
echo ""
echo "   OR press 'r' in the terminal after starting to reload"
echo ""
