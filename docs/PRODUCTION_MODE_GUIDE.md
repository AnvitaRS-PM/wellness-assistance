# 🚀 HOW TO RUN IN PRODUCTION MODE

## STEP 1: Stop Current Server

In your terminal where the app is running, press:
```
Ctrl+C
```

## STEP 2: Start in Production Mode

Run this command:
```bash
npx expo start --no-dev --minify
```

## STEP 3: Reload

When Metro Bundler starts, you'll see a menu. Press:
```
i  (for iOS simulator)
```

Then in the simulator, press:
```
Cmd+R  (to reload)
```

---

## WHY THIS HELPS

**Development mode has MASSIVE overhead:**
- ✅ Extra debugging code
- ✅ Hot reload monitoring
- ✅ Source maps generation
- ✅ Performance profiling
- ✅ All warnings/errors in detail

**Production mode removes ALL of this!**

Expected improvement: **5-10x faster**

---

## YOUR SIMULATOR MIGHT BE THE PROBLEM

3 seconds per keystroke suggests:
1. **Simulator is on a slow Mac** (old CPU, low RAM)
2. **Too many apps running** (close everything else)
3. **Simulator is using too much CPU** (restart simulator)

### Check Your Mac Performance:

1. **Open Activity Monitor**
2. **Look for:**
   - Simulator using >100% CPU
   - Low available RAM
   - High "Memory Pressure"

If your Mac is old or has <8GB RAM, the simulator will be VERY slow!

---

## ALTERNATIVE: TRY WEB INSTEAD

Web is often faster than iOS Simulator:

```bash
# Stop current server (Ctrl+C)

# Start for web:
npm run web
```

This will open in your browser - usually much faster!

---

## RUN THIS NOW:

```bash
npx expo start --no-dev --minify
```

Then press `i` for iOS, then `Cmd+R` in simulator to reload.

**Tell me if this helps!**
