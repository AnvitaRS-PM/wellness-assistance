# Swap Ingredients Screen - Three Critical Fixes ✅

## Issue 1: Updated Instructions Not Showing

### Problem
The updated instructions were being calculated correctly but were never displayed in the UI. Users couldn't see how the recipe steps changed based on their ingredient selections.

### Solution
Added a new "Updated Instructions" section to the UI that displays all recipe steps with the selected ingredients.

**Changes Made:**
- Added instructions card after nutrition summary
- Shows numbered steps (1., 2., 3., etc.)
- Displays note: "Instructions updated with your selected ingredients"
- Green-themed card (#F0FDF4 background) for visual distinction
- Proper formatting with line spacing and readable font

**UI Structure:**
```
📝 Updated Instructions
Instructions updated with your selected ingredients

1. Prepare ground turkey and zucchini noodles
2. Heat avocado oil in a large pan over medium heat
3. Cook ground turkey until golden brown
4. Add zucchini noodles and stir-fry for 3 minutes
5. Season to taste and serve hot
```

**Code Changes:**
- Lines 421-437: Added instructionsCard component in JSX
- Lines 584-605: Added instructionsCard, instructionsNote, instructionItem, instructionNumber, and instructionText styles

---

## Issue 2: Missing Swap Options for Some Ingredients

### Problem
Some recipes didn't show all ingredients with swap options:
- **Zucchini noodles** → No swaps available
- **Turkey** → No swaps available  
- **Meatballs** → No swaps available

Users reported that "turkey meatballs and zucchini noodles" recipe had missing options.

### Root Cause
The `swapOptionsMap` was missing keyword mappings for:
- 'zucchini'
- 'turkey'
- 'meatball'

### Solution
Added comprehensive swap mappings for all missing ingredients.

**New Mappings Added:**

#### 1. Zucchini (4 options):
```javascript
'zucchini': [
  { name: 'buckwheat soba noodles', calories: +100, protein: +5, fiber: +3, reason: 'Traditional noodles, nutty' },
  { name: 'shirataki noodles', calories: -30, protein: 0, fiber: +3, reason: 'Almost zero calories' },
  { name: 'kelp noodles', calories: -120, protein: 0, fiber: +2, reason: 'Crunchy, sea flavor' },
  { name: 'whole wheat pasta', calories: +120, protein: +7, fiber: +5, reason: 'Whole grain, filling' },
]
```

#### 2. Turkey (4 options):
```javascript
'turkey': [
  { name: 'chicken breast', calories: +10, protein: -2, fiber: 0, reason: 'Similar texture, slightly fattier' },
  { name: 'lean ground beef', calories: +50, protein: +1, fiber: 0, reason: 'Richer flavor, more iron' },
  { name: 'ground pork', calories: +60, protein: -1, fiber: 0, reason: 'Juicier, more flavor' },
  { name: 'lentils', calories: -70, protein: -8, fiber: +8, reason: 'Plant-based, high fiber' },
]
```

#### 3. Meatball (4 options):
```javascript
'meatball': [
  { name: 'turkey meatballs', calories: -20, protein: +1, fiber: 0, reason: 'Leaner, similar taste' },
  { name: 'chicken meatballs', calories: -10, protein: +2, fiber: 0, reason: 'Light, tender' },
  { name: 'veggie meatballs', calories: -80, protein: -5, fiber: +6, reason: 'Plant-based, nutritious' },
  { name: 'fish cakes', calories: -30, protein: +3, fiber: 0, reason: 'Seafood version, omega-3' },
]
```

**Result:**
✅ All ingredients now have swap options
✅ Turkey meatballs recipe shows swaps for both turkey AND meatballs
✅ Zucchini noodles recipe shows 4 alternative noodle options

---

## Issue 3: Modified Recipes Not Appearing on Meal Planning Screen

### Problem
When users swapped ingredients and saved the modified recipe:
1. The modified recipe was saved as a NEW recipe
2. The original recipe remained on the Meal Planning screen
3. Users saw BOTH versions instead of just the modified one
4. Example: Both "Beef Stir Fry" and "Turkey Stir Fry" appeared

### Expected Behavior
The modified recipe should **replace** the original recipe everywhere:
- Meal Planning Screen
- Saved Recipes list
- Custom Recipes by meal type

### Root Cause
The `saveRecipe()` function in UserContext:
- Only checked for duplicate names
- Didn't remove the original recipe before adding modified version
- Treated modified recipes as completely new recipes

### Solution

#### 1. Mark Modified Recipes
Updated `SwapIngredientsScreen.js` to tag modified recipes:

```javascript
const modifiedRecipe = {
  name: updatedRecipeName,           // "Turkey Stir Fry"
  mealType,
  calories,
  prepTime: recipe.prepTime || '25 mins',
  ingredients: getFinalIngredients(),
  nutrients,
  instructions: getUpdatedInstructions(),
  isModified: true,                   // NEW: Flag as modified
  originalRecipeName: recipe.name     // NEW: "Beef Stir Fry"
};
```

#### 2. Update SaveRecipe Logic
Enhanced `UserContext.js` `saveRecipe()` function to handle replacements:

```javascript
// If this is a modified recipe that replaces an original, remove the original first
let savedRecipes = prev.savedRecipes;
if (recipe.isModified && recipe.originalRecipeName) {
  savedRecipes = savedRecipes.filter(r => 
    !(r.name === recipe.originalRecipeName && r.mealType === recipe.mealType)
  );
}

// Then add the modified recipe
savedRecipes = [...savedRecipes, recipe];
```

**Also handles:**
- Updating `customRecipes` by mealType
- Removing original from customRecipes
- Updating existing modified recipes (if user modifies twice)

### User Flow Example

**Before Fix:**
```
Meal Planning Screen:
- Beef Stir Fry (original)
- Turkey Stir Fry (modified)  ← Both visible!
```

**After Fix:**
```
Meal Planning Screen:
- Turkey Stir Fry (modified)  ← Only modified version shows!
```

**Step-by-Step:**
1. User opens "Beef Stir Fry" from Meal Planning
2. Navigates to Swap Ingredients
3. Swaps beef → turkey
4. Recipe title updates to "Turkey Stir Fry"
5. Clicks "Save Modified Recipe"
6. Backend removes "Beef Stir Fry" from savedRecipes
7. Adds "Turkey Stir Fry" with all new data
8. Meal Planning Screen refreshes
9. Only "Turkey Stir Fry" appears

---

## Testing Scenarios

### Scenario 1: Instructions Display
1. Open any recipe → Swap Ingredients
2. Select some swaps
3. Scroll down
4. Verify "📝 Updated Instructions" section appears
5. Check all steps use selected ingredient names

### Scenario 2: Zucchini Noodles
1. Open "Turkey Meatballs and Zucchini Noodles"
2. Go to Swap Ingredients
3. Find "zucchini" ingredient
4. Verify 4 swap options appear:
   - Buckwheat soba noodles
   - Shirataki noodles
   - Kelp noodles
   - Whole wheat pasta

### Scenario 3: Recipe Replacement
1. Save a recipe from Meal Planning
2. Note original name (e.g., "Beef Stir Fry")
3. Open it → Swap Ingredients
4. Swap key ingredient (beef → turkey)
5. Note new name ("Turkey Stir Fry")
6. Save modified recipe
7. Return to Meal Planning
8. Verify ONLY "Turkey Stir Fry" appears
9. Verify "Beef Stir Fry" is gone
10. Open "Turkey Stir Fry"
11. Confirm all swapped ingredients, nutrition, and instructions

### Scenario 4: Multiple Modifications
1. Modify a recipe once (Beef → Turkey)
2. Save it
3. Open the modified recipe
4. Swap again (Turkey → Chicken)
5. Save it
6. Verify only final version shows

---

## Technical Details

### Files Modified

**1. `src/screens/SwapIngredientsScreen.js`**
- Lines 71-83: Added zucchini, turkey, meatball keyword mappings
- Lines 311-318: Added isModified and originalRecipeName to saved recipe
- Lines 421-437: Added instructions UI component
- Lines 584-605: Added instruction styles

**2. `src/context/UserContext.js`**
- Lines 200-252: Completely rewrote saveRecipe() function
  - Removes original recipe if isModified
  - Updates existing recipes instead of rejecting
  - Handles customRecipes replacements
  - Filters originals from customRecipes by mealType

### Data Structure

**Modified Recipe Object:**
```javascript
{
  name: "Turkey Stir Fry",
  mealType: "Dinner",
  calories: 400,
  prepTime: "25 mins",
  ingredients: ["ground turkey", "buckwheat noodles", "..."],
  nutrients: [...],
  instructions: ["Prepare ground turkey...", "..."],
  isModified: true,                    // Indicates replacement
  originalRecipeName: "Beef Stir Fry"  // Which recipe to replace
}
```

### Replacement Algorithm

```javascript
1. Check if recipe.isModified === true
2. If yes, filter out recipe where:
   - name === recipe.originalRecipeName
   - mealType === recipe.mealType
3. Check if modified recipe already exists
4. If yes, update it
5. If no, add as new
6. Repeat for customRecipes array
7. Save to AsyncStorage
```

---

## Benefits

1. **Complete Information**: Users can now see updated instructions
2. **More Options**: All ingredients have swap possibilities
3. **Clean UI**: No duplicate recipes cluttering the Meal Planning screen
4. **Logical Flow**: Modified recipes replace originals as expected
5. **Data Integrity**: One source of truth for each recipe version
6. **Better UX**: Users can iterate on recipes without creating duplicates

---

## Before vs After

### Before:
❌ Instructions calculated but not displayed
❌ Zucchini, turkey, meatballs had no swaps
❌ Modified recipes appeared alongside originals
❌ Meal Planning screen cluttered with versions

### After:
✅ Instructions prominently displayed with step numbers
✅ All ingredients have 3-4 swap options
✅ Modified recipes replace originals seamlessly
✅ Clean Meal Planning screen with only current versions

---

*Updated: 2026-01-24*
