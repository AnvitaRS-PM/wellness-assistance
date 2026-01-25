# 🎬 Adding Screen Recording GIFs to README

## STEP 1: Convert QuickTime Videos to GIFs

You have .mov files from QuickTime. You need to convert them to .gif format.

### Option A: Using Online Converter (EASIEST)

1. Go to: https://ezgif.com/video-to-gif
2. Upload your .mov file
3. Click "Convert to GIF"
4. Download the .gif file
5. Repeat for each screen recording

### Option B: Using ffmpeg (Command Line)

If you have ffmpeg installed:

```bash
# Convert a single video to GIF
ffmpeg -i screen1.mov -vf "fps=10,scale=320:-1:flags=lanczos" -loop 0 screen1.gif

# Or batch convert all .mov files:
for file in *.mov; do
  ffmpeg -i "$file" -vf "fps=10,scale=320:-1:flags=lanczos" -loop 0 "${file%.mov}.gif"
done
```

---

## STEP 2: Name Your GIF Files

Name them according to screen numbers:
```
01_welcome_screen.gif
02_personalization_screen.gif
03_goals_screen.gif
04_conditions_screen.gif
05_diet_recommendation_screen.gif
06_meal_planning_screen.gif
07_recipe_nutrients_screen.gif
08_log_meal_confirmation_screen.gif
09_swap_ingredients_screen.gif
10_load_recipe_screen.gif
11_todays_metrics_screen.gif
12_groceries_screen.gif
```

---

## STEP 3: Copy GIF Files to Your Project

```bash
# Navigate to your project
cd "/Users/dsaksena/Desktop/GenAI/Cursor/Wellness Assistance"

# Create demos folder if it doesn't exist
mkdir -p demos

# Copy your GIF files there
# (Replace /path/to/your/gifs with actual path)
cp /path/to/your/gifs/*.gif demos/
```

---

## STEP 4: Add to .gitignore (IMPORTANT)

GIF files can be large. Add them to git carefully:

```bash
# Check file sizes first
ls -lh demos/

# If files are > 10MB each, consider:
# - Optimizing them (lower fps, smaller size)
# - Using a service like GitHub Releases or cloud storage
```

---

## STEP 5: I'll Update README.md for You

Once you have the GIF files in the `demos/` folder, I'll add them to README.md!

---

## 🎯 QUICK START:

1. **Convert videos to GIFs** using ezgif.com
2. **Name them** 01_welcome_screen.gif, etc.
3. **Place them here:**
   ```bash
   cd "/Users/dsaksena/Desktop/GenAI/Cursor/Wellness Assistance"
   mkdir -p demos
   # Copy your GIFs to demos/ folder
   ```
4. **Tell me when done** - I'll update README.md!

---

## 💡 TIPS:

### Keep GIFs Small:
- **Duration:** 5-10 seconds per screen
- **Size:** Aim for < 5MB per GIF
- **FPS:** 10 fps is enough for demos
- **Resolution:** 320-400px width is enough

### Best Settings for ezgif.com:
- Start time: 0
- End time: 10 (or less)
- Size: Width 400px
- Frame rate: 10
- Method: Lanczos3

---

## WHERE ARE YOUR .mov FILES?

Tell me where your QuickTime recordings are saved, and I can help you organize them!

Typical locations:
- Desktop
- Movies folder
- Documents
- Downloads

**Once you convert to GIFs and copy them to `demos/` folder, I'll update the README!**
