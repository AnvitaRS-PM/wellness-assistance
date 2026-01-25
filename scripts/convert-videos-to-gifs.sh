#!/bin/bash

# Convert Screen Recordings to GIFs - Matching your exact Desktop files

cd "$(dirname "$0")"

echo "🎬 Converting Your 13 Screen Recordings to GIFs"
echo "================================================"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found!"
    echo "Install it with: brew install ffmpeg"
    exit 1
fi

# Create demos folder
mkdir -p demos

echo "Converting videos..."
echo ""

# 01 - Welcome Screen
echo "01. Converting Welcome Screen..."
ffmpeg -i ~/Desktop/"WA- Welcome Screen 2026-01-24 at 5.15.44 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/01_welcome_screen.gif -y

# 02 - Personalization Screen
echo "02. Converting Personalization Screen..."
ffmpeg -i ~/Desktop/"02_Personalization Screen2026-01-24 at 5.21.14 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/02_personalization_screen.gif -y

# 03 - Goals
echo "03. Converting Goals Screen..."
ffmpeg -i ~/Desktop/"03_Goals 2026-01-24 at 5.27.00 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/03_goals_screen.gif -y

# 04 - Conditions
echo "04. Converting Conditions Screen..."
ffmpeg -i ~/Desktop/"04_ConditionsMeal Preference2026-01-24 at 5.28.23 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/04_conditions_screen.gif -y

# 05 - Diet Recommendation
echo "05. Converting Diet Recommendation Screen..."
ffmpeg -i ~/Desktop/"05_Diet Recommendation Screen Recording 2026-01-24 at 5.30.47 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/05_diet_recommendation_screen.gif -y

# 06 - Meal Planning
echo "06. Converting Meal Planning Screen..."
ffmpeg -i ~/Desktop/"06_Meal Planning Screen Recording 2026-01-24 at 5.32.35 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/06_meal_planning_screen.gif -y

# 07 - Recipe and Nutrients
echo "07. Converting Recipe and Nutrients Screen..."
ffmpeg -i ~/Desktop/"07_Recipe and Nutrients Screen Recording 2026-01-24 at 5.34.32 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/07_recipe_nutrients_screen.gif -y

# 08 - Log Meal Confirmation
echo "08. Converting Log Meal Confirmation Screen..."
ffmpeg -i ~/Desktop/"08_Log Meal Confirmation Screen Recording 2026-01-24 at 5.35.56 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/08_log_meal_confirmation_screen.gif -y

# 09 - Saved Recipe
echo "09. Converting Saved Recipe Screen..."
ffmpeg -i ~/Desktop/"09_Saved Recipe Screen Recording 2026-01-24 at 5.38.09 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/09_saved_recipe_screen.gif -y

# 10 - Swap Ingredients
echo "10. Converting Swap Ingredients Screen..."
ffmpeg -i ~/Desktop/"10_Swap Ingredients Screen Recording 2026-01-24 at 5.40.04 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/10_swap_ingredients_screen.gif -y

# 11 - Load Recipe
echo "11. Converting Load Recipe Screen..."
ffmpeg -i ~/Desktop/"11_Load Recipe Screen Recording 2026-01-24 at 5.46.42 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/11_load_recipe_screen.gif -y

# 12 - Todays Intake
echo "12. Converting Todays Intake Screen..."
ffmpeg -i ~/Desktop/"12_Todays Intake Screen Recording 2026-01-24 at 5.50.58 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/12_todays_metrics_screen.gif -y

# 13 - Grocery List
echo "13. Converting Grocery List Screen..."
ffmpeg -i ~/Desktop/"13_Grocery List Screen Recording 2026-01-24 at 6.01.37 PM.mov" \
    -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 demos/13_groceries_screen.gif -y

echo ""
echo "✅ Conversion complete!"
echo ""
echo "GIF files created:"
ls -lh demos/*.gif
echo ""
echo "Total size:"
du -sh demos/
echo ""
