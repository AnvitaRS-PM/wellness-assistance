#!/bin/bash

# ULTRA PERFORMANCE MODE - Remove ALL potential bottlenecks

echo "🚀 ULTRA PERFORMANCE MODE ACTIVATED"
echo "===================================="

# 1. Kill all React Native processes
echo "1. Killing all React Native processes..."
killall -9 node 2>/dev/null || true
killall -9 Metro 2>/dev/null || true
killall -9 Simulator 2>/dev/null || true

# 2. Clear Metro Bundler cache
echo "2. Clearing Metro Bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# 3. Clear Watchman
echo "3. Clearing Watchman..."
watchman watch-del-all 2>/dev/null || true

# 4. Clear React Native cache
echo "4. Clearing React Native cache..."
rm -rf $TMPDIR/react-native-packager-cache-* 2>/dev/null || true

# 5. Clear node_modules cache
echo "5. Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# 6. Clear iOS build (if exists)
echo "6. Clearing iOS build..."
rm -rf ios/build 2>/dev/null || true
rm -rf ios/Pods 2>/dev/null || true

# 7. Clear Android build (if exists)
echo "7. Clearing Android build..."
rm -rf android/build 2>/dev/null || true
rm -rf android/app/build 2>/dev/null || true
rm -rf android/.gradle 2>/dev/null || true

# 8. Clear Expo cache
echo "8. Clearing Expo cache..."
rm -rf ~/.expo/cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true

# 9. Clear yarn/npm cache
echo "9. Clearing package manager cache..."
yarn cache clean 2>/dev/null || npm cache clean --force 2>/dev/null || true

# 10. Clear system temp
echo "10. Clearing system temp..."
rm -rf ~/Library/Developer/Xcode/DerivedData 2>/dev/null || true

echo ""
echo "✅ ALL CACHES CLEARED!"
echo "======================"
echo ""
echo "NOW RUN:"
echo "  npm start -- --reset-cache --clear"
echo ""
echo "Then press 'r' to reload"
echo ""
