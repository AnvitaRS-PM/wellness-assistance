# 🚀 Performance Optimization Guide

## ⚡ Quick Fixes (Do These First!)

### 1. Clear All Caches
```bash
# Run the automated script
./clear-caches.sh

# OR manually clear caches
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
rm -rf $TMPDIR/react-*
rm -rf node_modules/.cache

# If you have watchman installed
watchman watch-del-all
```

### 2. Start with Fresh Cache
```bash
# Stop the current dev server (Ctrl+C)

# Start with reset cache
npm start -- --reset-cache

# OR
expo start -c
```

### 3. Reload the App
- Press `r` in the terminal running metro bundler
- OR shake device/simulator and select "Reload"

---

## 🐛 Common Performance Issues & Fixes

### Issue 1: Excessive Console Logging
**Problem:** 51 console.log statements found  
**Impact:** Slows down app significantly, especially on devices  
**Fix:** Console logs are now disabled in production mode

### Issue 2: Metro Bundler Cache
**Problem:** Stale cache causing slow performance  
**Fix:** Clear caches with script above

### Issue 3: Memory Leaks
**Problem:** React components not cleaning up  
**Fix:** Already implemented with useEffect cleanup

### Issue 4: Unoptimized Images
**Problem:** Large images loading slowly  
**Fix:** Use optimized image sizes

### Issue 5: Too Many Re-renders
**Problem:** Components re-rendering unnecessarily  
**Fix:** Use React.memo for expensive components

---

## 📊 Performance Monitoring

### Check Current Performance

1. **Metro Bundler Speed**
   ```bash
   # Look for these in metro output:
   # - Bundle size
   # - Load time
   # - Number of modules
   ```

2. **App Start Time**
   - Should be < 3 seconds on device
   - If > 5 seconds, caches need clearing

3. **Navigation Speed**
   - Screen transitions should be instant
   - If sluggish, check for:
     - Heavy computations in render
     - Large state objects
     - Unoptimized images

---

## 🔧 Optimization Checklist

### Before Running App
- [ ] Clear metro cache (`npm start -- --reset-cache`)
- [ ] Restart packager
- [ ] Close other apps/simulators

### During Development
- [ ] Minimize console.log usage
- [ ] Use React DevTools to check renders
- [ ] Profile slow components
- [ ] Check for memory leaks

### For Production
- [ ] Enable Hermes engine
- [ ] Minify JavaScript
- [ ] Optimize images
- [ ] Remove debug code

---

## ⚡ Quick Performance Commands

```bash
# Clear everything and start fresh
./clear-caches.sh && npm start -- --reset-cache

# Reset iOS simulator
xcrun simctl erase all

# Check bundle size
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/index.bundle && ls -lh /tmp/index.bundle

# Profile app
npm start -- --reset-cache --verbose
```

---

## 🎯 Expected Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| App Start Time | < 3s | ? | Check |
| Screen Transition | < 100ms | ? | Check |
| Bundle Size | < 10MB | ? | Check |
| Memory Usage | < 150MB | ? | Check |

---

## 🚨 If Still Slow After Cache Clear

### 1. Check Running Processes
```bash
# Kill any hanging metro processes
lsof -ti:8081 | xargs kill -9
```

### 2. Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

### 3. Reset Simulator/Device
```bash
# iOS
xcrun simctl erase all

# Android
adb shell pm clear com.yourapp
```

### 4. Check System Resources
- Close other applications
- Check available RAM
- Check CPU usage
- Close unnecessary browser tabs

---

## 📱 Device-Specific Tips

### iOS
- Use Release build for testing performance
- Enable Hermes for better startup time
- Profile with Instruments

### Android
- Use Release APK for testing
- Enable Hermes
- Profile with Android Studio

---

## 🔍 Debugging Slow Screens

### Identify Slow Component
```javascript
import { measurePerformance } from '../config/performance';

// In component
useEffect(() => {
  measurePerformance('ScreenName render', () => {
    // Your expensive operation
  });
}, []);
```

### Common Culprits
1. **Large Lists** → Use FlatList with proper optimization
2. **Heavy Images** → Use optimized sizes, lazy load
3. **Complex Calculations** → Move to useEffect, memoize
4. **Unnecessary Re-renders** → Use React.memo, useMemo
5. **Synchronous Storage** → Use AsyncStorage properly

---

## ✅ Performance Improvements Made

1. ✅ Created performance configuration
2. ✅ Disabled console logs in production
3. ✅ Added cache clearing script
4. ✅ Added performance helpers (debounce, throttle)
5. ✅ Documented optimization strategies

---

## 🎯 Next Steps

1. Run `./clear-caches.sh`
2. Start with `npm start -- --reset-cache`
3. Reload app (press 'r')
4. Test performance
5. If still slow, check specific screens

---

**Last Updated:** January 24, 2026  
**Status:** Performance optimization tools ready
