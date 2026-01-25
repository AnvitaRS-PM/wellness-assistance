#!/bin/bash

cd "$(dirname "$0")"
mkdir -p demos

echo "🎬 Converting 13 Screen Recordings..."
echo ""

# 01
ffmpeg -i ~/Desktop/"WA- Welcome Screen 2026-01-24 at 5.15.44 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/01_welcome_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 01 done"

# 02
ffmpeg -i ~/Desktop/"02_Personalization Screen2026-01-24 at 5.21.14 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/02_personalization_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 02 done"

# 03
ffmpeg -i ~/Desktop/"03_Goals 2026-01-24 at 5.27.00 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/03_goals_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 03 done"

# 04
ffmpeg -i ~/Desktop/"04_ConditionsMeal Preference2026-01-24 at 5.28.23 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/04_conditions_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 04 done"

# 05
ffmpeg -i ~/Desktop/"05_Diet Recommendation Screen Recording 2026-01-24 at 5.30.47 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/05_diet_recommendation_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 05 done"

# 06
ffmpeg -i ~/Desktop/"06_Meal Planning Screen Recording 2026-01-24 at 5.32.35 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/06_meal_planning_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 06 done"

# 07
ffmpeg -i ~/Desktop/"07_Recipe and Nutrients Screen Recording 2026-01-24 at 5.34.32 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/07_recipe_nutrients_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 07 done"

# 08
ffmpeg -i ~/Desktop/"08_Log Meal Confirmation Screen Recording 2026-01-24 at 5.35.56 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/08_log_meal_confirmation_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 08 done"

# 09
ffmpeg -i ~/Desktop/"09_Saved Recipe Screen Recording 2026-01-24 at 5.38.09 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/09_saved_recipe_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 09 done"

# 10
ffmpeg -i ~/Desktop/"10_Swap Ingredients Screen Recording 2026-01-24 at 5.40.04 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/10_swap_ingredients_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 10 done"

# 11
ffmpeg -i ~/Desktop/"11_Load Recipe Screen Recording 2026-01-24 at 5.46.42 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/11_load_recipe_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 11 done"

# 12
ffmpeg -i ~/Desktop/"12_Todays Intake Screen Recording 2026-01-24 at 5.50.58 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/12_todays_metrics_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 12 done"

# 13
ffmpeg -i ~/Desktop/"13_Grocery List Screen Recording 2026-01-24 at 6.01.37 PM.mov" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demos/13_groceries_screen.gif -y 2>&1 | grep -E "Output|error" || echo "✅ 13 done"

echo ""
echo "✅ ALL 13 CONVERSIONS COMPLETE!"
echo ""
ls -lh demos/*.gif
echo ""
