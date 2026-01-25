#!/bin/bash

# Convert Screen Recordings to GIFs
# This script converts your QuickTime .mov files to optimized .gif files

cd "$(dirname "$0")"

echo "🎬 Converting Screen Recordings to GIFs"
echo "========================================"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found!"
    echo ""
    echo "Please install ffmpeg first:"
    echo "  brew install ffmpeg"
    echo ""
    echo "OR use the online converter at: https://ezgif.com/video-to-gif"
    echo ""
    exit 1
fi

# Create demos folder
mkdir -p demos

# Convert each video to GIF with optimization
echo "Converting videos..."
echo ""

# 01 - Welcome Screen
if [ -f ~/Desktop/"WA- Welcome Screen 2026-01-24 at 5.15.44 PM.mov" ]; then
    echo "01. Converting Welcome Screen..."
    ffmpeg -i ~/Desktop/"WA- Welcome Screen 2026-01-24 at 5.15.44 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/01_welcome_screen.gif -y 2>/dev/null
fi

# 02 - Personalization Screen
if [ -f ~/Desktop/"02_Personalization Screen2026-01-24 at 5.21.14 PM.mov" ]; then
    echo "02. Converting Personalization Screen..."
    ffmpeg -i ~/Desktop/"02_Personalization Screen2026-01-24 at 5.21.14 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/02_personalization_screen.gif -y 2>/dev/null
fi

# 03 - Goals
if [ -f ~/Desktop/"03_Goals 2026-01-24 at 5.27.00 PM.mov" ]; then
    echo "03. Converting Goals Screen..."
    ffmpeg -i ~/Desktop/"03_Goals 2026-01-24 at 5.27.00 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/03_goals_screen.gif -y 2>/dev/null
fi

# 04 - Conditions
if [ -f ~/Desktop/"04_ConditionsMeal Preference2026-01-24 at 5.28.23 PM.mov" ]; then
    echo "04. Converting Conditions Screen..."
    ffmpeg -i ~/Desktop/"04_ConditionsMeal Preference2026-01-24 at 5.28.23 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/04_conditions_screen.gif -y 2>/dev/null
fi

# 05 - Diet Recommendation
if [ -f ~/Desktop/"05_Diet Recommendation Screen Recording 2026-01-24 at 5.30.47 PM.mov" ]; then
    echo "05. Converting Diet Recommendation Screen..."
    ffmpeg -i ~/Desktop/"05_Diet Recommendation Screen Recording 2026-01-24 at 5.30.47 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/05_diet_recommendation_screen.gif -y 2>/dev/null
fi

# 06 - Meal Planning
if [ -f ~/Desktop/"06_Meal Planning Screen Recording 2026-01-24 at 5.32.35 PM.mov" ]; then
    echo "06. Converting Meal Planning Screen..."
    ffmpeg -i ~/Desktop/"06_Meal Planning Screen Recording 2026-01-24 at 5.32.35 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/06_meal_planning_screen.gif -y 2>/dev/null
fi

# 07 - Recipe and Nutrients
if [ -f ~/Desktop/"07_Recipe and Nutrients Screen Recording 2026-01-24 at 5.34.32 PM.mov" ]; then
    echo "07. Converting Recipe and Nutrients Screen..."
    ffmpeg -i ~/Desktop/"07_Recipe and Nutrients Screen Recording 2026-01-24 at 5.34.32 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/07_recipe_nutrients_screen.gif -y 2>/dev/null
fi

# 08 - Log Meal Confirmation
if [ -f ~/Desktop/"08_Log Meal Confirmation Screen Recording 2026-01-24 at 5.35.56 PM.mov" ]; then
    echo "08. Converting Log Meal Confirmation Screen..."
    ffmpeg -i ~/Desktop/"08_Log Meal Confirmation Screen Recording 2026-01-24 at 5.35.56 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/08_log_meal_confirmation_screen.gif -y 2>/dev/null
fi

# 09 - Saved Recipe (this seems to be screen 09)
if [ -f ~/Desktop/"09_Saved Recipe Screen Recording 2026-01-24 at 5.38.09 PM.mov" ]; then
    echo "09. Converting Swap Ingredients Screen..."
    ffmpeg -i ~/Desktop/"09_Saved Recipe Screen Recording 2026-01-24 at 5.38.09 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/09_swap_ingredients_screen.gif -y 2>/dev/null
fi

# 10 - Swap Ingredients
if [ -f ~/Desktop/"10_Swap Ingredients Screen Recording 2026-01-24 at 5.40.04 PM.mov" ]; then
    echo "10. Converting Load Recipe Screen..."
    ffmpeg -i ~/Desktop/"10_Swap Ingredients Screen Recording 2026-01-24 at 5.40.04 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/10_load_recipe_screen.gif -y 2>/dev/null
fi

# 11 - Load Recipe
if [ -f ~/Desktop/"11_Load Recipe Screen Recording 2026-01-24 at 5.46.42 PM.mov" ]; then
    echo "11. Converting Todays Metrics Screen..."
    ffmpeg -i ~/Desktop/"11_Load Recipe Screen Recording 2026-01-24 at 5.46.42 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/11_todays_metrics_screen.gif -y 2>/dev/null
fi

# 12 - Todays Intake
if [ -f ~/Desktop/"12_Todays Intake Screen Recording 2026-01-24 at 5.50.58 PM.mov" ]; then
    echo "12. Converting Groceries Screen..."
    ffmpeg -i ~/Desktop/"12_Todays Intake Screen Recording 2026-01-24 at 5.50.58 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/12_groceries_screen.gif -y 2>/dev/null
fi

# 13 - Grocery List
if [ -f ~/Desktop/"13_Grocery List Screen Recording 2026-01-24 at 6.01.37 PM.mov" ]; then
    echo "13. Converting Grocery List Screen (alternate)..."
    ffmpeg -i ~/Desktop/"13_Grocery List Screen Recording 2026-01-24 at 6.01.37 PM.mov" \
        -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 demos/13_grocery_list_alternate.gif -y 2>/dev/null
fi

echo ""
echo "✅ Conversion complete!"
echo ""
echo "GIF files created in: demos/"
echo ""
ls -lh demos/*.gif 2>/dev/null || echo "Check demos/ folder for your GIFs"
echo ""
