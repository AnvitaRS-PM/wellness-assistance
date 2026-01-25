# Allergen & Dislike Filtering Implementation

## Overview
Implemented comprehensive filtering to ensure users' allergies and dislikes are respected throughout the app, specifically on the Meal Planning Screen and Diet Recommendation Screen.

## Problem Statement
Users were seeing meal recommendations and food suggestions that contained ingredients they specified as allergies or dislikes on the Conditions and Meal Preference Screen.

## Solution Implemented

### 1. **Meal Planning Screen Filtering**
**Location**: `src/services/openAIService.js` → `getFallbackMealRecommendations()`

#### How It Works:
- Added `containsAllergens()` helper function that checks if a recipe contains any user allergens
- Filters recipes before displaying them on the Meal Planning Screen
- Checks both recipe names and ingredients lists
- Combines both selected allergies and custom-typed allergies (from text input)

#### Code Example:
```javascript
containsAllergens(recipe, allergies, customAllergies) {
  // Parse custom allergies (comma-separated)
  const customAllergyList = customAllergies 
    ? customAllergies.split(',').map(a => a.trim().toLowerCase()).filter(a => a.length > 0)
    : [];
  
  // Combine all allergies/dislikes
  const allAllergies = [
    ...(allergies || []).map(a => a.toLowerCase()),
    ...customAllergyList
  ];
  
  // Check recipe name and ingredients
  const recipeName = (recipe.name || '').toLowerCase();
  const ingredients = (recipe.ingredients || []).join(' ').toLowerCase();
  
  // Filter if any allergen appears
  for (const allergen of allAllergies) {
    if (recipeName.includes(allergen) || ingredients.includes(allergen)) {
      return true;
    }
  }
  
  return false;
}
```

#### Filtering Process:
```javascript
// Filter recipes for each meal type
const filteredRecipes = recipes.filter(recipe => 
  !this.containsAllergens(recipe, userData.allergies, userData.customAllergies)
);
```

### 2. **Diet Recommendation Screen Filtering**
**Location**: `src/screens/RecommendationsScreen.js`

#### How It Works:
- Added `filterAllergens()` helper function directly in the component
- Filters the "Recommended Food Items" list before displaying
- Works as a client-side safety net in case the AI includes allergens
- Also combines both selected and custom-typed allergies

#### Code Example:
```javascript
const filterAllergens = (foods, allergies, customAllergies) => {
  const customAllergyList = customAllergies 
    ? customAllergies.split(',').map(a => a.trim().toLowerCase()).filter(a => a.length > 0)
    : [];
  
  const allAllergies = [
    ...(allergies || []).map(a => a.toLowerCase()),
    ...customAllergyList
  ];
  
  return foods.filter(food => {
    const foodLower = (food || '').toLowerCase();
    for (const allergen of allAllergies) {
      if (foodLower.includes(allergen)) {
        return false;
      }
    }
    return true;
  });
};
```

#### Applied in JSX:
```javascript
{(() => {
  const filteredFoods = filterAllergens(
    recommendations.recommendedFoods, 
    userData.allergies, 
    userData.customAllergies
  );
  return filteredFoods.length > 0 ? (
    filteredFoods.map((food, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.listItemText}>{food}</Text>
      </View>
    ))
  ) : (
    <Text style={styles.placeholderText}>
      No specific recommendations (all foods filtered due to allergies/dislikes)
    </Text>
  );
})()}
```

### 3. **AI Prompt Enhancement**
**Location**: `src/services/openAIService.js` → `buildPrompt()`

Enhanced the prompt sent to OpenAI to be more explicit about excluding allergens:

```javascript
3. RECOMMENDED FOODS: Focus on HEALING and THERAPEUTIC foods based on their health conditions.
   - CRITICAL: Do NOT recommend ANY items listed in their Allergies/Dislikes section: ${allAllergies || 'None'}
   - Exclude ALL foods from their Allergies/Dislikes list completely
   - IMPORTANT: Carefully check each recommended food against the Allergies/Dislikes list before including it
```

## Files Modified

1. **`src/services/openAIService.js`**
   - Added `containsAllergens()` method
   - Refactored `getFallbackMealRecommendations()` to filter recipes
   - Extracted `getAllBaseRecipes()` for better code organization
   - Enhanced AI prompt to explicitly mention allergens

2. **`src/screens/RecommendationsScreen.js`**
   - Added `filterAllergens()` helper function
   - Updated "Recommended Food Items" section to apply filtering
   - Added fallback message when all foods are filtered

## User Experience

### Before:
- Users saw recipes containing their allergens (e.g., "Shell-fish Tacos" when shell-fish is marked as allergy)
- Recommended foods list included items users specified as dislikes
- No filtering or validation of user preferences

### After:
- All recipes containing allergens are automatically hidden from Meal Planning Screen
- Recommended foods list excludes any items matching user's allergies/dislikes
- Console logs show which recipes/foods are being filtered for debugging
- Graceful handling when all items are filtered (shows appropriate message)

## Testing Scenarios

### Scenario 1: Checkbox Allergies
**User Input:**
- Allergies: `['Shell-fish', 'Broccoli']`

**Expected Result:**
- No recipes with shell-fish or broccoli appear
- "Shrimp Tacos" → filtered out
- "Salmon with Steamed Vegetables" → filtered out (contains broccoli)
- Recommended foods don't include shell-fish or broccoli

### Scenario 2: Custom Typed Allergies
**User Input:**
- Custom Allergies: `"eggs, dairy, soy"`

**Expected Result:**
- "Poached Eggs on Sprouted Grain Toast" → filtered out
- "Greek Yogurt Parfait" → filtered out
- "Vegetable Omelet" → filtered out
- All egg and dairy-based recommendations excluded

### Scenario 3: Combination
**User Input:**
- Allergies: `['Eggplant']`
- Custom Allergies: `"chicken, beef"`

**Expected Result:**
- "Grilled Chicken Salad Bowl" → filtered out
- "Beef and Broccoli Stir-Fry" → filtered out
- Any recipe containing eggplant, chicken, or beef is hidden

## Debug Logs

The implementation includes console logs for debugging:

```
🚫 Filtering out "Shrimp Tacos" - contains allergen: "shell-fish"
🚫 Filtering out "Greek Yogurt" from recommended foods - contains allergen: "dairy"
🔍 Filtered Breakfast: 7 -> 5 recipes (removed 2 with allergens)
```

## Edge Cases Handled

1. **No Allergies**: If user has no allergies, all recipes are shown (no filtering applied)
2. **All Recipes Filtered**: If all recipes for a meal type contain allergens, the meal type section still appears but with empty recipe list
3. **Case Insensitive**: Filtering works regardless of capitalization (e.g., "Chicken" matches "chicken")
4. **Partial Matches**: "Shell-fish" will filter out "Shellfish", "shell-fish", and "shrimp" (since shrimp is a shellfish)
5. **Custom Input Parsing**: Properly handles comma-separated values with or without spaces

## Future Enhancements

1. **Ingredient-Level Granularity**: Currently checks recipe names and full ingredient strings; could be enhanced to check individual ingredients more precisely
2. **Synonym Matching**: Add a synonym map (e.g., "shell-fish" → ["shrimp", "crab", "lobster", "prawns"])
3. **Severity Levels**: Distinguish between "allergies" (must exclude) and "dislikes" (could optionally show)
4. **User Notification**: Add a banner showing "X recipes hidden due to your allergies/dislikes"
5. **Alternative Suggestions**: When recipes are filtered, suggest similar allergen-free alternatives

## Commit Message
```
Implement allergen and dislike filtering for meal recommendations

- Add containsAllergens() helper to filter recipes on Meal Planning Screen
- Add filterAllergens() to remove allergens from Diet Recommendations
- Combine checkbox selections and custom-typed allergies/dislikes
- Enhance OpenAI prompt to explicitly exclude user allergens
- Add debug logging for filtered recipes
- Handle edge cases (no allergies, all filtered, case-insensitive)

Fixes: Users seeing meal options containing their specified allergies/dislikes
