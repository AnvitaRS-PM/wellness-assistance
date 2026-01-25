import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function SwapIngredientsScreen({ route, navigation }) {
  const { recipe, mealType } = route.params;
  const { saveRecipe, isRecipeSaved, logMeal } = useUser();
  
  // Track which replacement is selected for each ingredient (or keep original)
  const [selectedSwaps, setSelectedSwaps] = useState({});
  
  // Generate 3-4 replacement options for each ingredient
  const generateSwapOptions = (ingredient) => {
    const lowerIng = ingredient.toLowerCase();
    
    // Comprehensive swap options - each ingredient gets 3-4 alternatives
    const swapOptionsMap = {
      // Proteins
      'beef': [
        { name: 'ground turkey', calories: -50, protein: +1, fiber: 0, reason: 'Leaner, less saturated fat' },
        { name: 'bison', calories: -30, protein: +3, fiber: 0, reason: 'Leaner, gamey rich flavor' },
        { name: 'lean chicken breast', calories: -40, protein: +2, fiber: 0, reason: 'Very lean, mild taste' },
        { name: 'lentils', calories: -80, protein: -5, fiber: +8, reason: 'Plant-based, high fiber' },
      ],
      'chicken': [
        { name: 'turkey breast', calories: -10, protein: +2, fiber: 0, reason: 'Leaner, similar taste' },
        { name: 'tofu', calories: -60, protein: -8, fiber: +2, reason: 'Plant-based, versatile' },
        { name: 'tempeh', calories: -30, protein: -5, fiber: +5, reason: 'Fermented, nutty flavor' },
        { name: 'duck breast', calories: +40, protein: +2, fiber: 0, reason: 'Richer flavor, juicier' },
      ],
      'pork': [
        { name: 'chicken thighs', calories: -40, protein: +2, fiber: 0, reason: 'Less fat, still juicy' },
        { name: 'turkey tenderloin', calories: -60, protein: +3, fiber: 0, reason: 'Very lean, mild' },
        { name: 'jackfruit', calories: -120, protein: -15, fiber: +3, reason: 'Plant-based, pulled texture' },
      ],
      'salmon': [
        { name: 'mackerel', calories: +30, protein: +3, fiber: 0, reason: 'More omega-3, richer' },
        { name: 'arctic char', calories: +10, protein: +1, fiber: 0, reason: 'Similar to salmon, milder' },
        { name: 'sardines', calories: +40, protein: +5, fiber: 0, reason: 'More calcium, sustainable' },
        { name: 'rainbow trout', calories: -20, protein: +1, fiber: 0, reason: 'Lighter, delicate flavor' },
      ],
      'tuna': [
        { name: 'sardines', calories: +40, protein: +5, fiber: 0, reason: 'Higher omega-3, more calcium' },
        { name: 'mackerel', calories: +30, protein: +4, fiber: 0, reason: 'Rich flavor, nutritious' },
        { name: 'wild-caught skipjack', calories: 0, protein: +1, fiber: 0, reason: 'Lower mercury, sustainable' },
      ],
      'shrimp': [
        { name: 'scallops', calories: +10, protein: +2, fiber: 0, reason: 'Sweet, meaty texture' },
        { name: 'white fish (cod)', calories: -20, protein: 0, fiber: 0, reason: 'Mild, flaky' },
        { name: 'squid', calories: -30, protein: +3, fiber: 0, reason: 'Tender, slightly sweet' },
      ],
      'egg': [
        { name: 'egg whites + 1 yolk', calories: -30, protein: +2, fiber: 0, reason: 'Less cholesterol, same protein' },
        { name: 'flax eggs', calories: -50, protein: -5, fiber: +3, reason: 'Vegan, omega-3' },
        { name: 'chia eggs', calories: -40, protein: -4, fiber: +4, reason: 'Vegan, high fiber' },
      ],
      
      // Grains & Carbs
      'rice': [
        { name: 'cauliflower rice', calories: -120, protein: +1, fiber: +3, reason: 'Low-carb, veggie-based' },
        { name: 'quinoa', calories: -30, protein: +3, fiber: +2, reason: 'Complete protein, nutty' },
        { name: 'farro', calories: -20, protein: +2, fiber: +3, reason: 'Chewy, hearty texture' },
        { name: 'bulgur wheat', calories: -40, protein: +2, fiber: +4, reason: 'Quick-cooking, nutty' },
      ],
      'pasta': [
        { name: 'zucchini noodles', calories: -150, protein: +1, fiber: +2, reason: 'Veggie-based, low calories' },
        { name: 'buckwheat noodles', calories: -50, protein: +4, fiber: +3, reason: 'Higher protein, nutty' },
        { name: 'chickpea pasta', calories: -30, protein: +8, fiber: +5, reason: 'High protein, gluten-free' },
        { name: 'shirataki noodles', calories: -180, protein: 0, fiber: +3, reason: 'Almost zero calories' },
      ],
      'noodle': [
        { name: 'buckwheat soba noodles', calories: -50, protein: +4, fiber: +3, reason: 'Nutty, higher protein' },
        { name: 'kelp noodles', calories: -150, protein: 0, fiber: +2, reason: 'Crunchy, low-calorie' },
        { name: 'rice noodles', calories: -30, protein: +1, fiber: +1, reason: 'Gluten-free, light' },
      ],
      'bread': [
        { name: 'whole grain sourdough', calories: +15, protein: +3, fiber: +5, reason: 'Fermented, easier digestion' },
        { name: 'ezekiel bread', calories: +20, protein: +4, fiber: +4, reason: 'Sprouted grains, complete protein' },
        { name: 'lettuce wraps', calories: -120, protein: +1, fiber: +1, reason: 'Low-carb, fresh' },
      ],
      'potato': [
        { name: 'sweet potato', calories: +20, protein: +1, fiber: +2, reason: 'More vitamin A, lower GI' },
        { name: 'turnips', calories: -80, protein: +1, fiber: +2, reason: 'Lower carb, similar texture' },
        { name: 'parsnips', calories: -30, protein: +1, fiber: +3, reason: 'Slightly sweet, nutty' },
      ],
      'flour': [
        { name: 'almond flour', calories: +50, protein: +6, fiber: +4, reason: 'Gluten-free, high protein' },
        { name: 'coconut flour', calories: +20, protein: +2, fiber: +8, reason: 'High fiber, absorbent' },
        { name: 'oat flour', calories: +10, protein: +3, fiber: +5, reason: 'Whole grain, heart-healthy' },
      ],
      
      // Dairy
      'milk': [
        { name: 'unsweetened almond milk', calories: -110, protein: -7, fiber: +1, reason: 'Low calorie, dairy-free' },
        { name: 'oat milk', calories: -60, protein: -5, fiber: +2, reason: 'Creamy, naturally sweet' },
        { name: 'cashew milk', calories: -90, protein: -6, fiber: +1, reason: 'Rich, creamy texture' },
      ],
      'cheese': [
        { name: 'nutritional yeast', calories: -80, protein: +5, fiber: +2, reason: 'Cheesy flavor, B-vitamins' },
        { name: 'cashew cheese', calories: -40, protein: -2, fiber: +2, reason: 'Dairy-free, creamy' },
        { name: 'feta (reduced-fat)', calories: -30, protein: +2, fiber: 0, reason: 'Tangy, less fat' },
      ],
      'butter': [
        { name: 'ghee', calories: +5, protein: 0, fiber: 0, reason: 'Clarified, high smoke point' },
        { name: 'avocado', calories: -20, protein: +1, fiber: +7, reason: 'Healthy fats, creamy' },
        { name: 'coconut oil', calories: +10, protein: 0, fiber: 0, reason: 'MCT fats, tropical flavor' },
      ],
      'cream': [
        { name: 'coconut cream', calories: -20, protein: -1, fiber: +1, reason: 'Dairy-free, rich' },
        { name: 'cashew cream', calories: -40, protein: +2, fiber: +2, reason: 'Thick, nutty flavor' },
        { name: 'Greek yogurt', calories: -60, protein: +8, fiber: 0, reason: 'High protein, tangy' },
      ],
      'yogurt': [
        { name: 'Icelandic skyr', calories: -20, protein: +5, fiber: 0, reason: 'Thicker, more protein' },
        { name: 'coconut yogurt', calories: -30, protein: -8, fiber: +1, reason: 'Dairy-free, probiotic' },
        { name: 'Greek yogurt (2%)', calories: -10, protein: +3, fiber: 0, reason: 'Creamier, more protein' },
      ],
      
      // Vegetables
      'spinach': [
        { name: 'kale', calories: +5, protein: +1, fiber: +2, reason: 'More vitamin K, heartier' },
        { name: 'swiss chard', calories: +3, protein: +1, fiber: +1, reason: 'Earthy flavor, colorful' },
        { name: 'collard greens', calories: +8, protein: +2, fiber: +3, reason: 'Sturdy, Southern classic' },
      ],
      'lettuce': [
        { name: 'arugula', calories: +5, protein: +1, fiber: +1, reason: 'Peppery, more nutrients' },
        { name: 'watercress', calories: +3, protein: +1, fiber: +1, reason: 'Peppery, vitamin K' },
        { name: 'baby kale', calories: +7, protein: +2, fiber: +2, reason: 'Tender, nutritious' },
      ],
      'onion': [
        { name: 'shallots', calories: +5, protein: 0, fiber: +1, reason: 'Milder, sweeter' },
        { name: 'leeks', calories: +10, protein: +1, fiber: +1, reason: 'Subtle onion flavor' },
        { name: 'scallions', calories: +2, protein: 0, fiber: +1, reason: 'Mild, fresh' },
      ],
      'corn': [
        { name: 'edamame', calories: -20, protein: +8, fiber: +2, reason: 'Higher protein, lower carbs' },
        { name: 'peas', calories: -30, protein: +3, fiber: +3, reason: 'Sweet, more fiber' },
        { name: 'chickpeas', calories: +40, protein: +7, fiber: +5, reason: 'High protein, hearty' },
      ],
      
      // Sweeteners
      'sugar': [
        { name: 'coconut sugar', calories: +5, protein: 0, fiber: +1, reason: 'Lower glycemic index' },
        { name: 'date paste', calories: +20, protein: +1, fiber: +2, reason: 'Whole fruit, natural' },
        { name: 'monk fruit sweetener', calories: -60, protein: 0, fiber: 0, reason: 'Zero calorie, no spike' },
      ],
      'honey': [
        { name: 'maple syrup', calories: +10, protein: 0, fiber: 0, reason: 'More antioxidants' },
        { name: 'agave nectar', calories: +5, protein: 0, fiber: 0, reason: 'Lower GI, milder' },
        { name: 'date syrup', calories: +15, protein: +1, fiber: +2, reason: 'Whole fruit sweetener' },
      ],
      
      // Oils & Fats
      'oil': [
        { name: 'avocado oil', calories: +5, protein: 0, fiber: 0, reason: 'High smoke point, healthy' },
        { name: 'extra virgin olive oil', calories: 0, protein: 0, fiber: 0, reason: 'Antioxidants, heart-healthy' },
        { name: 'coconut oil', calories: +10, protein: 0, fiber: 0, reason: 'MCT fats, stable' },
      ],
    };
    
    // Find matching options
    for (const [key, options] of Object.entries(swapOptionsMap)) {
      if (lowerIng.includes(key)) {
        return options.slice(0, 4); // Return up to 4 options
      }
    }
    
    // No specific swaps found - return null to skip this ingredient
    return null;
  };

  // Generate swap data for all ingredients
  const ingredientSwapData = recipe.ingredients.map((ingredient, index) => ({
    original: ingredient,
    index,
    options: generateSwapOptions(ingredient)
  })).filter(item => item.options !== null); // Only show ingredients with swap options

  // Initialize all selections to original (index -1 means original)
  useEffect(() => {
    const initial = {};
    ingredientSwapData.forEach(item => {
      initial[item.index] = -1; // -1 = original, 0-3 = swap option index
    });
    setSelectedSwaps(initial);
  }, []);

  // Toggle selection for an ingredient
  const selectOption = (ingredientIndex, optionIndex) => {
    setSelectedSwaps(prev => ({
      ...prev,
      [ingredientIndex]: optionIndex
    }));
  };

  // Calculate updated recipe name
  const getUpdatedRecipeName = () => {
    let newName = recipe.name;
    
    const nameChanges = [
      { keywords: ['beef'], swapKeywords: ['turkey', 'bison', 'chicken'], newName: (swap) => swap.includes('turkey') ? 'Turkey' : swap.includes('bison') ? 'Bison' : 'Chicken' },
      { keywords: ['chicken'], swapKeywords: ['turkey'], newName: () => 'Turkey' },
      { keywords: ['pork'], swapKeywords: ['chicken', 'turkey'], newName: (swap) => swap.includes('chicken') ? 'Chicken' : 'Turkey' },
      { keywords: ['salmon'], swapKeywords: ['mackerel'], newName: () => 'Mackerel' },
      { keywords: ['rice'], swapKeywords: ['cauliflower'], newName: () => 'Cauliflower' },
    ];

    ingredientSwapData.forEach(item => {
      const selectedIndex = selectedSwaps[item.index];
      if (selectedIndex >= 0) {
        const selectedSwap = item.options[selectedIndex];
        nameChanges.forEach(change => {
          if (change.keywords.some(kw => item.original.toLowerCase().includes(kw))) {
            if (change.swapKeywords.some(sw => selectedSwap.name.toLowerCase().includes(sw))) {
              const regex = new RegExp(change.keywords.join('|'), 'gi');
              newName = newName.replace(regex, change.newName(selectedSwap.name));
            }
          }
        });
      }
    });

    return newName;
  };

  // Calculate nutrients based on selections
  const calculateNutrients = () => {
    const baseCalories = recipe.calories || 400;
    const baseNutrients = recipe.nutrients || [
      { name: 'Protein', value: '25g' },
      { name: 'Carbs', value: '35g' },
      { name: 'Fat', value: '15g' },
      { name: 'Fiber', value: '5g' }
    ];

    let totalCalorieChange = 0;
    let totalProteinChange = 0;
    let totalFiberChange = 0;

    ingredientSwapData.forEach(item => {
      const selectedIndex = selectedSwaps[item.index];
      if (selectedIndex >= 0) {
        const swap = item.options[selectedIndex];
        totalCalorieChange += swap.calories;
        totalProteinChange += swap.protein;
        totalFiberChange += swap.fiber;
      }
    });

    const newCalories = Math.max(100, baseCalories + totalCalorieChange);
    const newNutrients = baseNutrients.map(n => {
      const value = parseInt(n.value) || 0;
      let newValue = value;
      if (n.name === 'Protein') newValue = Math.max(5, value + totalProteinChange);
      if (n.name === 'Fiber') newValue = Math.max(1, value + totalFiberChange);
      if (n.name === 'Carbs') newValue = Math.max(5, value + Math.floor(totalCalorieChange / -10));
      return { ...n, value: `${newValue}g` };
    });

    return { calories: newCalories, nutrients: newNutrients, calorieChange: totalCalorieChange };
  };

  const { calories, nutrients, calorieChange } = calculateNutrients();
  const updatedRecipeName = getUpdatedRecipeName();

  // Get final ingredient list
  const getFinalIngredients = () => {
    return recipe.ingredients.map((ingredient, index) => {
      const swapData = ingredientSwapData.find(item => item.index === index);
      if (!swapData) return ingredient;
      
      const selectedIndex = selectedSwaps[index];
      if (selectedIndex >= 0) {
        return swapData.options[selectedIndex].name;
      }
      return ingredient;
    });
  };

  // Update instructions
  const getUpdatedInstructions = () => {
    if (!recipe.instructions || recipe.instructions.length === 0) {
      return ['Mix all ingredients together', 'Cook according to your preference', 'Season to taste', 'Serve and enjoy!'];
    }

    let updatedInstructions = [...recipe.instructions];
    ingredientSwapData.forEach(item => {
      const selectedIndex = selectedSwaps[item.index];
      if (selectedIndex >= 0) {
        const selectedSwap = item.options[selectedIndex];
        updatedInstructions = updatedInstructions.map(instruction =>
          instruction.replace(new RegExp(item.original, 'gi'), selectedSwap.name)
        );
      }
    });
    
    return updatedInstructions;
  };

  const handleSaveRecipe = () => {
    const modifiedRecipe = {
      name: updatedRecipeName,
      mealType,
      calories,
      prepTime: recipe.prepTime || '25 mins',
      ingredients: getFinalIngredients(),
      nutrients,
      instructions: getUpdatedInstructions()
    };
    saveRecipe(modifiedRecipe);
  };

  const handleLogMeal = () => {
    logMeal({
      recipeName: updatedRecipeName,
      mealType,
      calories,
      nutrients,
      prepTime: recipe.prepTime || '25 mins'
    });
    navigation.navigate('LogMealConfirmation', { 
      recipeName: updatedRecipeName, 
      mealType 
    });
  };

  const isSaved = isRecipeSaved(updatedRecipeName, mealType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{updatedRecipeName}</Text>
        {updatedRecipeName !== recipe.name && (
          <Text style={styles.originalName}>Original: {recipe.name}</Text>
        )}
        <Text style={styles.subtitle}>Choose replacements for each ingredient</Text>

        {/* Ingredient Swaps */}
        {ingredientSwapData.map((item) => {
          const selectedIndex = selectedSwaps[item.index];
          
          return (
            <View key={item.index} style={styles.ingredientCard}>
              <Text style={styles.ingredientTitle}>Ingredient #{item.index + 1}</Text>
              
              {/* Original Option */}
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedIndex === -1 && styles.optionButtonSelected
                ]}
                onPress={() => selectOption(item.index, -1)}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionLabel, selectedIndex === -1 && styles.selectedText]}>
                    ✓ ORIGINAL
                  </Text>
                  {selectedIndex === -1 && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.optionName, selectedIndex === -1 && styles.selectedText]}>
                  {item.original}
                </Text>
              </TouchableOpacity>

              {/* Replacement Options */}
              {item.options.map((option, optIndex) => (
                <TouchableOpacity
                  key={optIndex}
                  style={[
                    styles.optionButton,
                    styles.swapOption,
                    selectedIndex === optIndex && styles.swapOptionSelected
                  ]}
                  onPress={() => selectOption(item.index, optIndex)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={[styles.optionLabel, selectedIndex === optIndex && styles.swapSelectedText]}>
                      OPTION {optIndex + 1}
                    </Text>
                    {selectedIndex === optIndex && <Text style={styles.checkmarkGreen}>✓</Text>}
                  </View>
                  <Text style={[styles.optionName, selectedIndex === optIndex && styles.swapSelectedText]}>
                    {option.name}
                  </Text>
                  <Text style={styles.nutritionChange}>
                    {option.calories > 0 ? `+${option.calories}` : option.calories} cal
                    {option.protein !== 0 && ` | ${option.protein > 0 ? '+' : ''}${option.protein}g protein`}
                    {option.fiber !== 0 && ` | ${option.fiber > 0 ? '+' : ''}${option.fiber}g fiber`}
                  </Text>
                  {selectedIndex === optIndex && (
                    <Text style={styles.reason}>💡 {option.reason}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {/* Updated Nutrition Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>📊 Nutrition Summary</Text>
          <View style={styles.calorieRow}>
            <Text style={styles.label}>Calories:</Text>
            <Text style={styles.originalCalories}>{recipe.calories} cal</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.newCalories}>{calories} cal</Text>
            {calorieChange !== 0 && (
              <Text style={[styles.change, calorieChange < 0 ? styles.positive : styles.negative]}>
                ({calorieChange > 0 ? '+' : ''}{calorieChange})
              </Text>
            )}
          </View>
          {nutrients.map((n, idx) => (
            <View key={idx} style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{n.name}:</Text>
              <Text style={styles.nutrientValue}>{n.value}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, isSaved && styles.savedButton]} 
            onPress={handleSaveRecipe}
            disabled={isSaved}
          >
            <Text style={styles.actionButtonText}>
              {isSaved ? '✓ Recipe Saved' : 'Save Modified Recipe'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logButton]} 
            onPress={handleLogMeal}
          >
            <Text style={styles.actionButtonText}>Log Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.metricsButton]} 
            onPress={() => navigation.navigate('TodaysMetrics')}
          >
            <Text style={styles.actionButtonText}>Today's Intake</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    textAlign: 'center',
  },
  originalName: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  ingredientCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ingredientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  optionButtonSelected: {
    borderColor: '#6B7280',
    backgroundColor: '#F3F4F6',
  },
  swapOption: {
    borderColor: '#D1D5DB',
  },
  swapOptionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  selectedText: {
    color: '#4B5563',
  },
  swapSelectedText: {
    color: '#10B981',
  },
  checkmark: {
    fontSize: 18,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  checkmarkGreen: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: 'bold',
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nutritionChange: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  reason: {
    fontSize: 13,
    color: '#059669',
    marginTop: 8,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 14,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E40AF',
    marginRight: 10,
  },
  originalCalories: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  arrow: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  newCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  change: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#A8D5BA',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  savedButton: {
    backgroundColor: '#10B981',
  },
  logButton: {
    backgroundColor: '#3B82F6',
  },
  metricsButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
