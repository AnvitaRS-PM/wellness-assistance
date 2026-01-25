# 📱 New Screens Documentation

This document provides detailed specifications for the three new screens added to the Wellness Assistance App: Log Meal Confirmation, Swap Ingredients, and Load Recipe.

---

## Screen 08: Log Meal Confirmation

### Primary Action
This screen shows a popup on the Recipe and Nutrients screen that confirms that the meal is logged. This happens when the user clicks on the "Log Meal" button.

### Screen Components

#### Popup Display
- **Title**: Displays the meal name (e.g., "Eggs Poached + Toast")
- **Message**: "Meal Logged" confirmation text
- **Design**: Centered popup with a light background overlay
- **Animation**: Smooth fade-in animation when appearing

### User Actions

#### Close Popup
- **Action**: User can tap/click a button or tap outside the popup to dismiss it
- **Result**: Returns to Screen 07 (Recipe and Nutrients Screen)
- **Behavior**: The logged meal is now saved to the user's daily intake log

### Navigation Flow
```
Recipe and Nutrients Screen (07)
    ↓ (Click "Log Meal")
Log Meal Confirmation Popup (08)
    ↓ (Close popup)
Recipe and Nutrients Screen (07)
```

### Technical Implementation Notes
- Implement as a modal overlay
- Should not be a full screen navigation
- Auto-dismiss option after 2-3 seconds (optional)
- Store meal data in user's daily intake log
- Update meal history in app state

---

## Screen 09: Swap Ingredients

### Primary Action
This screen shows replacement suggestions for ingredients that could be swapped to make the meal healthier. It appears when the "Swap Ingredients" button is clicked on the Recipe and Nutrients screen as a popup/modal.

### Screen Components

#### Header
- **Meal Title**: Display the name of the recipe (e.g., "Eggs Poached + Toast")

#### Section 1: Original Recipe Display
**Purpose**: Shows the baseline recipe for comparison

**Ingredients List**:
- Display all ingredients from the original recipe
- Example:
  1. Eggs
  2. Toast Multigrain Ezekiel Bread
  3. Sprouted Grain

**Nutrients**:
- Display original nutritional values
- Format: "Protein: 20gms Zinc: 2gms Vitamin D: 3gms"
- Secondary line: "Protein: 5gms Zinc: 3gms Magnesium: 2gms"

#### Section 2: Swap Ingredient Suggestions
**Purpose**: Shows healthier alternatives with nutritional comparisons

**Display Format**:
- **Original Ingredient**: "Multigrain Ezekiel Bread Sprouted Grain"
- **Replace with**: "Almond flour tortilla"
- **Original Nutrients**: Full nutritional profile of original ingredient
- **New Nutrients**: Full nutritional profile of replacement ingredient
  - Example: "Protein: 10gms Vitamin E: 2gms Magnesium: 2gms"

**Visual Design**:
- Clear distinction between original and replacement
- Side-by-side or before/after comparison layout
- Highlight improvements in nutritional values (e.g., higher protein, lower carbs)

#### Section 3: Updated Instructions
**Purpose**: Provide modified cooking instructions based on ingredient swaps

**Content**:
- Step-by-step instructions adapted for new ingredients
- Example:
  1. "Poach Eggs"
  2. "Heat Almond flour tortilla"
- Cooking times may be adjusted based on ingredient changes
- Notes about taste/texture expectations: "Outcome should be close to original, just healthier"

### User Actions

#### Save Recipe Button
- **Action**: Save the modified recipe with swapped ingredients
- **Result**: Recipe is added to user's saved recipes collection
- **Navigation**: Can remain on screen or show confirmation

#### Log Meal Button
- **Action**: Log this modified meal to user's daily intake
- **Result**: Opens Log Meal Confirmation popup (Screen 08)
- **Data**: Saves meal with updated nutritional values from swapped ingredients

### Navigation Flow
```
Recipe and Nutrients Screen (07)
    ↓ (Click "Swap Ingredients")
Swap Ingredients Screen (09)
    ↓ (Click "Save Recipe")
Recipe saved confirmation
    OR
    ↓ (Click "Log Meal")
Log Meal Confirmation Popup (08)
```

### Technical Implementation Notes
- Calculate nutritional differences between original and swapped ingredients
- Use AI/database to suggest appropriate ingredient swaps
- Ensure swapped ingredients maintain recipe integrity
- Store both original and modified versions
- Allow users to see why each swap is healthier (optional tooltips)

---

## Screen 10: Load Recipe

### Primary Action
This screen allows users to add their own custom recipes with ingredients and instructions. It appears when the "Load Recipe" button is clicked on the Meal Planning screen.

### Screen Components

#### Header
- **Title**: "Load Recipe"
- **Description**: Clear indication this is for adding custom recipes

#### Section 1: Ingredients Display
**Purpose**: Show all ingredients added by the user

**Display Format**:
- Numbered list of ingredients
- Example:
  1. Eggs
  2. Pepper
- Dynamically updates as user adds ingredients

**Add Ingredient Button**:
- Prominent button to add new ingredients
- Opens input field or modal for ingredient entry
- May include quantity and unit fields

#### Section 2: Instructions Display
**Purpose**: Show all cooking instructions added by the user

**Display Format**:
- Numbered list of steps
- Example:
  1. "Fold eggs in boiling water"
  2. "Add Pepper"
- Dynamically updates as user adds instructions

**Add Instruction Button**:
- Prominent button to add new instruction steps
- Opens text input for step-by-step instructions
- Instructions appear in the order they're added

#### Section 3: Recipe Image
**Purpose**: Visual representation of the recipe

**Display**:
- Image placeholder area
- Shows uploaded image once added
- Gray placeholder with camera icon if no image

**Add Image Button**:
- Opens device camera or photo library
- Allows image upload
- Optional but enhances recipe visual appeal

### User Actions

#### Add Ingredient
- **Action**: Click/tap the "Add Ingredient" button
- **Input**: Enter ingredient name, quantity (optional), unit (optional)
- **Result**: Ingredient appears in the Ingredients list
- **Validation**: Ensure ingredient name is not empty

#### Add Instruction
- **Action**: Click/tap the "Add Instruction" button
- **Input**: Enter cooking instruction step
- **Result**: Instruction appears in the Instructions list in sequence
- **Validation**: Ensure instruction is not empty

#### Add Image
- **Action**: Click/tap the "Add Image" button
- **Options**: 
  - Take photo with camera
  - Choose from photo library
- **Result**: Image displays in the image section
- **Format**: Accept common image formats (JPG, PNG)

#### Swap Ingredients
- **Action**: Click/tap the "Swap Ingredients" button
- **Requirement**: Must have at least one ingredient added
- **Navigation**: Goes to Swap Ingredients Screen (09)
- **Purpose**: Get AI-powered healthier ingredient suggestions

#### Save Recipe
- **Action**: Click/tap the "Save Recipe" button
- **Validation**: 
  - At least one ingredient required
  - At least one instruction required
  - Recipe name required (if not already provided)
- **Result**: Recipe is saved to user's recipe collection
- **Confirmation**: Show success message
- **Navigation**: Return to Meal Planning screen or show recipe saved confirmation

### Navigation Flow
```
Meal Planning Screen (06)
    ↓ (Click "Load Recipe")
Load Recipe Screen (10)
    ↓ (Click "Add Ingredient")
Add Ingredient Input
    ↓ (Click "Add Instruction")
Add Instruction Input
    ↓ (Click "Add Image")
Image Picker/Camera
    ↓ (Click "Swap Ingredients")
Swap Ingredients Screen (09)
    OR
    ↓ (Click "Save Recipe")
Recipe Saved → Return to Meal Planning
```

### Technical Implementation Notes

#### Data Structure
```json
{
  "recipeId": "unique-id",
  "recipeName": "User-defined name",
  "ingredients": [
    {
      "name": "Eggs",
      "quantity": 2,
      "unit": "whole"
    }
  ],
  "instructions": [
    {
      "stepNumber": 1,
      "instruction": "Fold eggs in boiling water"
    }
  ],
  "image": "image-url-or-base64",
  "nutrients": {
    // Calculated or entered manually
  },
  "createdDate": "timestamp",
  "isCustomRecipe": true
}
```

#### Features to Implement
1. **Ingredient Input**: Modal or inline input with quantity/unit pickers
2. **Instruction Input**: Multi-line text input with character limit
3. **Image Upload**: Integration with device camera/photo library
4. **Validation**: Real-time validation for required fields
5. **Edit Capability**: Allow users to edit/delete added ingredients and instructions
6. **Nutritional Calculation**: Optional AI-powered nutritional estimation based on ingredients
7. **Recipe Templates**: Optional pre-filled templates for common recipes

#### User Experience Enhancements
- Drag-and-drop to reorder ingredients or instructions
- Voice input for hands-free cooking
- Import recipes from URLs
- Share recipes with other users
- Rate and review custom recipes

---

## Integration Points Between Screens

### Screen Flow Summary
```
Welcome (01) 
→ Personalization (02) 
→ Goals (03) 
→ Conditions & Preferences (04) 
→ AI Recommendations (05) 
→ Meal Planning (06) 
→ Recipe & Nutrients (07)
    ├→ Log Meal Confirmation (08)
    └→ Swap Ingredients (09)
          └→ Log Meal Confirmation (08)

Meal Planning (06) 
→ Load Recipe (10)
    └→ Swap Ingredients (09)
```

### Data Flow
1. **User Profile Data** (Screens 01-04) → Used for AI recommendations
2. **AI Recommendations** (Screen 05) → Populate Meal Planning suggestions
3. **Meal Planning** (Screen 06) → Source for Recipe & Nutrients details
4. **Recipe Data** → Used in Swap Ingredients for comparison
5. **Custom Recipes** (Screen 10) → Added to Meal Planning database
6. **Logged Meals** → Tracked for user's daily intake and progress

### State Management Considerations
- User authentication state
- Recipe database/cache
- User's saved recipes
- Daily meal log
- Nutritional intake tracking
- Custom recipe storage

---

## UI/UX Design Guidelines

### Consistent Design Elements
- **Color Scheme**: Use app's primary turquoise/teal color for buttons
- **Typography**: Clean, readable fonts; consistent heading hierarchy
- **Spacing**: Adequate padding and margins for touch targets
- **Buttons**: Rounded corners, clear labels, appropriate sizing (minimum 44x44pt)
- **Popups**: Semi-transparent overlay, centered content, easy dismiss

### Accessibility
- Sufficient color contrast ratios
- Screen reader support
- Clear focus indicators
- Touch targets meet minimum size requirements
- Error messages are clear and actionable

### Responsive Design
- Adapt to different screen sizes (phones, tablets)
- Portrait and landscape orientations
- Keyboard handling for text inputs
- Smooth animations and transitions

---

## Testing Checklist

### Screen 08: Log Meal Confirmation
- [ ] Popup appears when "Log Meal" is clicked
- [ ] Meal name displays correctly
- [ ] Close button dismisses popup
- [ ] Meal is saved to user's intake log
- [ ] Navigation returns to Recipe & Nutrients screen
- [ ] Popup works on different screen sizes

### Screen 09: Swap Ingredients
- [ ] Original recipe displays correctly
- [ ] Swap suggestions are relevant and healthier
- [ ] Nutritional comparison is accurate
- [ ] Instructions update appropriately
- [ ] "Save Recipe" saves modified version
- [ ] "Log Meal" logs with updated nutritional values
- [ ] Works with various ingredient types

### Screen 10: Load Recipe
- [ ] "Add Ingredient" adds ingredients to list
- [ ] "Add Instruction" adds instructions in order
- [ ] "Add Image" uploads and displays image correctly
- [ ] "Swap Ingredients" navigates correctly
- [ ] "Save Recipe" validates required fields
- [ ] Recipe is saved to user's collection
- [ ] Empty state shows helpful prompts
- [ ] Edit/delete functionality works for ingredients and instructions

---

## Future Enhancements

### Potential Features
1. **Barcode Scanner**: Scan packaged foods to auto-add ingredients
2. **Voice Commands**: Add ingredients/instructions via voice
3. **Recipe Search**: Search within saved recipes
4. **Meal History**: View previously logged meals
5. **Nutritional Goals**: Track against daily targets
6. **Shopping List**: Generate from recipes
7. **Meal Prep Calendar**: Schedule meals for the week
8. **Social Features**: Share recipes with friends
9. **Recipe Import**: Import from websites or PDFs
10. **Dietary Filters**: Filter recipes by diet type, allergies

### Analytics to Track
- Most logged meals
- Most used swap suggestions
- Custom recipe creation rate
- User engagement with different screens
- Time spent on recipe creation
- Popular ingredient swaps

---

**Document Version**: 1.0  
**Last Updated**: January 21, 2026  
**Status**: Ready for Implementation
