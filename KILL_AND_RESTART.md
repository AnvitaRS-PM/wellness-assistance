# KILL SIMULATOR AND FRESH RESTART

## STEP 1: Kill the iOS Simulator

**Option A: Using Menu**
1. Click on the Simulator app
2. Press `Cmd + Q` (or click Simulator → Quit Simulator)

**Option B: Force Kill**
In a new terminal window:
```bash
killall Simulator
```

---

## STEP 2: Kill Metro/Node (in your original terminal)

Press:
```
Ctrl + C
```

If that doesn't work, in a new terminal:
```bash
killall node
```

---

## STEP 3: Clear All Caches

In terminal:
```bash
cd "/Users/dsaksena/Desktop/GenAI/Cursor/Wellness Assistance"

# Clear Expo cache
rm -rf .expo

# Clear Metro cache
rm -rf /tmp/metro-*
rm -rf /tmp/react-*
rm -rf /tmp/haste-*

# Clear watchman
watchman watch-del-all
```

---

## STEP 4: Restart Everything Fresh

```bash
# Start with cleared cache
npm start -- --clear
```

---

## STEP 5: When Metro Starts

Wait for the menu, then press:
```
i
```

---

## STEP 6: If Still Stuck at "Downloading"

When simulator opens and gets stuck:

**In the Simulator, press Cmd+R immediately**

Don't wait for it to download - force it to reload!

---

## RUN THESE NOW:

```bash
# Kill simulator
killall Simulator

# In your terminal with Metro, press Ctrl+C

# Then run:
cd "/Users/dsaksena/Desktop/GenAI/Cursor/Wellness Assistance"
rm -rf .expo
rm -rf /tmp/metro-*
npm start -- --clear
```

When you see the menu, press `i`

Then when simulator opens, immediately press `Cmd+R`

Let me know what happens!
