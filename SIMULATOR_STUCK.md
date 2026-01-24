# SIMULATOR STUCK - FORCE RELOAD GUIDE

## STEP 1: Force Reload in Simulator

In your iOS Simulator window, press:
```
Cmd + R
```

Or click: **Device → Erase All Content and Settings** then relaunch

---

## STEP 2: If Still Stuck, Kill and Restart

In your terminal where the app is running:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Kill all processes:
killall node
killall Simulator

# 3. Clear Metro cache:
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# 4. Restart:
npm start
```

Then when Metro starts, press `i` for iOS

---

## STEP 3: Reopen Simulator Manually

If simulator won't open:

1. Close the Simulator app
2. Open it from Applications
3. In terminal, press `i` again

---

## TRY THIS NOW:

In Simulator: **Press Cmd+R** (Command + R)

This should force reload immediately!

---

If that doesn't work, tell me and I'll help you do a complete restart.
