#!/bin/bash

cd ~/Desktop
PROJECT="/Users/dsaksena/Desktop/GenAI/Cursor/Wellness Assistance"
mkdir -p "$PROJECT/demos"

echo "🎬 Converting 13 Screen Recordings..."
echo ""

# Find each file by pattern and convert
for file in WA-*Welcome*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/01_welcome_screen.gif" -y >/dev/null 2>&1 && echo "✅ 01 Welcome"
done

for file in 02_*Person*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/02_personalization_screen.gif" -y >/dev/null 2>&1 && echo "✅ 02 Personalization"
done

for file in 03_*Goal*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/03_goals_screen.gif" -y >/dev/null 2>&1 && echo "✅ 03 Goals"
done

for file in 04_*Condition*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/04_conditions_screen.gif" -y >/dev/null 2>&1 && echo "✅ 04 Conditions"
done

for file in 05_*Diet*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/05_diet_recommendation_screen.gif" -y >/dev/null 2>&1 && echo "✅ 05 Diet Recommendation"
done

for file in 06_*Meal*Planning*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/06_meal_planning_screen.gif" -y >/dev/null 2>&1 && echo "✅ 06 Meal Planning"
done

for file in 07_*Recipe*Nutrient*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/07_recipe_nutrients_screen.gif" -y >/dev/null 2>&1 && echo "✅ 07 Recipe & Nutrients"
done

for file in 08_*Log*Meal*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/08_log_meal_confirmation_screen.gif" -y >/dev/null 2>&1 && echo "✅ 08 Log Meal Confirmation"
done

for file in 09_*Saved*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/09_saved_recipe_screen.gif" -y >/dev/null 2>&1 && echo "✅ 09 Saved Recipe"
done

for file in 10_*Swap*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/10_swap_ingredients_screen.gif" -y >/dev/null 2>&1 && echo "✅ 10 Swap Ingredients"
done

for file in 11_*Load*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/11_load_recipe_screen.gif" -y >/dev/null 2>&1 && echo "✅ 11 Load Recipe"
done

for file in 12_*Today*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/12_todays_metrics_screen.gif" -y >/dev/null 2>&1 && echo "✅ 12 Todays Intake"
done

for file in 13_*Grocer*.mov; do
  [ -f "$file" ] && ffmpeg -i "$file" -vf "fps=10,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$PROJECT/demos/13_groceries_screen.gif" -y >/dev/null 2>&1 && echo "✅ 13 Grocery List"
done

echo ""
echo "✅ ALL CONVERSIONS COMPLETE!"
echo ""
ls -lh "$PROJECT/demos"/*.gif 2>/dev/null || echo "Checking files..."
echo ""
