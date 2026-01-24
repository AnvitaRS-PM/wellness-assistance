import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function SwapIngredientsScreen({ route, navigation }) {
  const { recipe, mealType } = route.params;
  const { saveRecipe, isRecipeSaved, logMeal } = useUser();
  
  // Track user choices: true = swap, false = original
  const [ingredientChoices, setIngredientChoices] = useState({});
  const [calculatedNutrients, setCalculatedNutrients] = useState(recipe.nutrients || []);
  const [calculatedCalories, setCalculatedCalories] = useState(recipe.calories);
  const [calculatedPrepTime, setCalculatedPrepTime] = useState(recipe.prepTime || '20-25 mins');

  // Generate DIFFERENT and BETTER ingredient swaps with detailed nutrition
  const generateSwaps = () => {
    const swapSuggestions = (recipe.ingredients || []).map((ingredient, index) => {
      const lowerIng = ingredient.toLowerCase();
      
      // Comprehensive swap map with REAL alternatives
      const swapRules = [
        // Grains & Carbs
        { keywords: ['white bread', 'bread', 'toast'], replacement: 'whole grain sourdough bread', calories: +15, fiber: +5, protein: +3, reason: 'Better digestion, more nutrients' },
        { keywords: ['white rice', 'rice'], replacement: 'cauliflower rice', calories: -120, fiber: +3, protein: +1, reason: 'Lower carbs, more vegetables' },
        { keywords: ['pasta', 'spaghetti', 'noodles'], replacement: 'zucchini noodles (zoodles)', calories: -150, fiber: +2, protein: +1, reason: 'Veggie-based, lower calories' },
        { keywords: ['flour', 'all-purpose'], replacement: 'almond flour', calories: +50, fiber: +4, protein: +6, reason: 'Gluten-free, higher protein' },
        { keywords: ['quinoa'], replacement: 'farro', calories: +20, fiber: +2, protein: +2, reason: 'Nuttier flavor, chewy texture' },
        { keywords: ['oats', 'oatmeal'], replacement: 'steel-cut oats', calories: +10, fiber: +2, protein: +1, reason: 'Less processed, better texture' },
        
        // Proteins
        { keywords: ['chicken breast'], replacement: 'turkey breast', calories: -10, fiber: 0, protein: +2, reason: 'Leaner, similar taste' },
        { keywords: ['ground beef', 'beef'], replacement: 'ground turkey', calories: -50, fiber: 0, protein: +1, reason: 'Leaner, less saturated fat' },
        { keywords: ['bacon'], replacement: 'turkey bacon', calories: -50, fiber: 0, protein: -2, reason: 'Lower fat, similar smoky flavor' },
        { keywords: ['salmon'], replacement: 'mackerel', calories: +30, fiber: 0, protein: +3, reason: 'More omega-3s, richer flavor' },
        { keywords: ['tuna'], replacement: 'sardines', calories: +40, fiber: 0, protein: +5, reason: 'Higher omega-3, more calcium' },
        { keywords: ['egg', 'eggs'], replacement: 'egg whites + 1 whole egg', calories: -30, fiber: 0, protein: +2, reason: 'Less cholesterol, same protein' },
        { keywords: ['tofu'], replacement: 'tempeh', calories: +30, fiber: +3, protein: +5, reason: 'Fermented, nuttier taste' },
        
        // Dairy
        { keywords: ['whole milk', 'milk'], replacement: 'unsweetened almond milk', calories: -110, fiber: +1, protein: -7, reason: 'Lower calories, dairy-free' },
        { keywords: ['cream', 'heavy cream'], replacement: 'coconut cream', calories: -20, fiber: +1, protein: -1, reason: 'Dairy-free, tropical flavor' },
        { keywords: ['butter'], replacement: 'ghee', calories: +5, fiber: 0, protein: 0, reason: 'Clarified, better for high heat' },
        { keywords: ['cheese', 'cheddar'], replacement: 'nutritional yeast', calories: -80, fiber: +2, protein: +5, reason: 'Cheesy flavor, B-vitamins' },
        { keywords: ['yogurt', 'greek yogurt'], replacement: 'Icelandic skyr', calories: -20, fiber: 0, protein: +5, reason: 'Thicker, more protein' },
        { keywords: ['sour cream'], replacement: 'Greek yogurt', calories: -40, fiber: 0, protein: +8, reason: 'Higher protein, probiotic' },
        
        // Sweeteners
        { keywords: ['sugar', 'white sugar'], replacement: 'coconut sugar', calories: +5, fiber: +1, protein: 0, reason: 'Lower glycemic index' },
        { keywords: ['honey'], replacement: 'maple syrup', calories: +10, fiber: 0, protein: 0, reason: 'More antioxidants, unique flavor' },
        { keywords: ['syrup'], replacement: 'date syrup', calories: +15, fiber: +2, protein: +1, reason: 'Whole fruit sweetener, minerals' },
        
        // Fats & Oils
        { keywords: ['vegetable oil', 'canola oil'], replacement: 'avocado oil', calories: +5, fiber: 0, protein: 0, reason: 'Higher smoke point, healthier fats' },
        { keywords: ['olive oil'], replacement: 'extra virgin olive oil', calories: 0, fiber: 0, protein: 0, reason: 'More antioxidants, better quality' },
        { keywords: ['mayonnaise', 'mayo'], replacement: 'mashed avocado', calories: -40, fiber: +4, protein: +1, reason: 'Natural fats, more nutrients' },
        
        // Vegetables (enhance, don't just swap)
        { keywords: ['spinach'], replacement: 'kale', calories: +5, fiber: +2, protein: +1, reason: 'More vitamin K, heartier' },
        { keywords: ['lettuce'], replacement: 'arugula', calories: +5, fiber: +1, protein: +1, reason: 'Peppery flavor, more nutrients' },
        { keywords: ['potato', 'potatoes'], replacement: 'sweet potato', calories: +20, fiber: +2, protein: +1, reason: 'More vitamin A, lower GI' },
        { keywords: ['onion', 'onions'], replacement: 'shallots', calories: +5, fiber: +1, protein: 0, reason: 'Milder, sweeter flavor' },
        { keywords: ['bell pepper'], replacement: 'poblano pepper', calories: +5, fiber: +1, protein: 0, reason: 'Slightly spicy, richer flavor' },
        
        // Condiments & Seasonings
        { keywords: ['salt', 'table salt'], replacement: 'pink Himalayan salt', calories: 0, fiber: 0, protein: 0, reason: 'Trace minerals, less processed' },
        { keywords: ['soy sauce'], replacement: 'coconut aminos', calories: -5, fiber: 0, protein: -1, reason: 'Soy-free, lower sodium' },
        { keywords: ['ketchup'], replacement: 'sugar-free tomato paste', calories: -30, fiber: +1, protein: +1, reason: 'No added sugar, more concentrated' },
        { keywords: ['bbq sauce'], replacement: 'chipotle in adobo', calories: -20, fiber: +1, protein: 0, reason: 'Smoky flavor, less sugar' },
      ];

      // Find matching swap rule
      let swapData = null;
      for (const rule of swapRules) {
        if (rule.keywords.some(keyword => lowerIng.includes(keyword))) {
          swapData = rule;
          break;
        }
      }

      // If no specific match found, provide a generic healthy upgrade
      if (!swapData) {
        // Try to make an intelligent generic swap
        if (lowerIng.includes('cup') || lowerIng.includes('tbsp') || lowerIng.includes('tsp')) {
          // It's a measured ingredient, suggest organic version
          return {
            original: ingredient,
            replacement: `organic ${ingredient}`,
            calories: +5,
            fiber: +1,
            protein: 0,
            reason: 'Pesticide-free, cleaner option'
          };
        } else {
          // For other ingredients, suggest fresh/whole version
          return {
            original: ingredient,
            replacement: `fresh ${ingredient}`,
            calories: 0,
            fiber: +1,
            protein: 0,
            reason: 'Fresher, less processed'
          };
        }
      }

      return {
        original: ingredient,
        replacement: swapData.replacement,
        calories: swapData.calories,
        fiber: swapData.fiber,
        protein: swapData.protein,
        reason: swapData.reason
      };
    });

    return swapSuggestions;
  };

  const swaps = generateSwaps();

  // Initialize all choices to 'swap' by default
  useEffect(() => {
    const initialChoices = {};
    swaps.forEach((_, index) => {
      initialChoices[index] = true; // true = swap selected
    });
    setIngredientChoices(initialChoices);
  }, []);

  // Recalculate nutrients when choices change
  useEffect(() => {
    recalculateNutrients();
  }, [ingredientChoices]);

  const toggleIngredientChoice = (index) => {
    setIngredientChoices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const recalculateNutrients = () => {
    // Count how many swaps are selected
    const swapCount = Object.values(ingredientChoices).filter(v => v === true).length;
    
    // Base nutrients from original recipe
    const baseNutrients = recipe.nutrients || [
      { name: 'Protein', value: '20g' },
      { name: 'Carbs', value: '30g' },
      { name: 'Fat', value: '15g' },
      { name: 'Fiber', value: '3g' }
    ];

    // Calculate total changes based on selected swaps
    const totalFiberChange = swaps.reduce((sum, swap, idx) => {
      return sum + (ingredientChoices[idx] ? swap.fiber : 0);
    }, 0);

    const totalProteinChange = swaps.reduce((sum, swap, idx) => {
      return sum + (ingredientChoices[idx] ? swap.protein : 0);
    }, 0);

    const totalCalorieChange = swaps.reduce((sum, swap, idx) => {
      return sum + (ingredientChoices[idx] ? swap.calories : 0);
    }, 0);

    // Update nutrients based on changes
    const updatedNutrients = baseNutrients.map(nutrient => {
      const value = parseInt(nutrient.value) || 0;
      let newValue = value;

      if (nutrient.name === 'Fiber') {
        newValue = Math.max(1, value + totalFiberChange);
      } else if (nutrient.name === 'Protein') {
        newValue = Math.max(5, value + totalProteinChange);
      } else if (nutrient.name === 'Carbs') {
        // Carbs might go down if swapping to lower-carb alternatives
        const carbReduction = Math.floor(totalCalorieChange / -10); // Estimate carb reduction
        newValue = Math.max(5, value + carbReduction);
      }

      return { ...nutrient, value: `${newValue}g` };
    });

    setCalculatedNutrients(updatedNutrients);

    // Update total calories based on ingredient swaps
    const newCalories = Math.max(100, (recipe.calories || 300) + totalCalorieChange);
    setCalculatedCalories(newCalories);

    // Update prep time - some swaps might change prep time
    const basePrepMins = parseInt(recipe.prepTime) || 20;
    // Swaps might add or reduce time slightly
    const timeDelta = Math.floor(swapCount / 2); // Small time adjustment
    const newPrepMins = Math.max(5, basePrepMins + timeDelta);
    setCalculatedPrepTime(`${newPrepMins} mins`);
  };

  // Generate updated instructions
  const getUpdatedInstructions = () => {
    const selectedIngredients = swaps.map((swap, idx) => 
      ingredientChoices[idx] ? swap.replacement : swap.original
    );

    if (recipe.instructions && recipe.instructions.length > 0) {
      // Use original instructions with ingredient names updated
      return recipe.instructions.map(instruction => {
        let updated = instruction;
        swaps.forEach((swap, idx) => {
          if (ingredientChoices[idx]) {
            updated = updated.replace(new RegExp(swap.original, 'gi'), swap.replacement);
          }
        });
        return updated;
      });
    }

    return [
      `Prepare ${selectedIngredients.slice(0, 2).join(' and ')}`,
      'Mix ingredients following the healthy recipe modifications',
      'Cook at appropriate temperature, monitoring texture',
      'Season to taste with your chosen ingredients',
      'Serve warm and enjoy your healthier meal!'
    ];
  };

  const updatedInstructions = getUpdatedInstructions();

  const handleSaveRecipe = () => {
    const modifiedRecipe = {
      name: `${recipe.name} (Modified)`,
      mealType,
      calories: calculatedCalories,
      prepTime: calculatedPrepTime,
      ingredients: swaps.map((swap, idx) => ingredientChoices[idx] ? swap.replacement : swap.original),
      nutrients: calculatedNutrients,
      instructions: updatedInstructions
    };
    saveRecipe(modifiedRecipe);
  };

  const handleLogMeal = () => {
    // Log the meal with updated nutrition
    logMeal({
      recipeName: `${recipe.name} (Modified)`,
      mealType: mealType,
      calories: calculatedCalories,
      nutrients: calculatedNutrients,
      prepTime: calculatedPrepTime
    });
    navigation.navigate('LogMealConfirmation', { 
      recipeName: `${recipe.name} (Modified)`, 
      mealType: mealType 
    });
  };

  const isSaved = isRecipeSaved(`${recipe.name} (Modified)`, mealType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.subtitle}>Choose original or healthier alternatives</Text>
        {recipe.prepTime && (
          <Text style={styles.originalPrepTime}>Original Prep: {recipe.prepTime}</Text>
        )}
        <Text style={styles.newPrepTime}>Updated Prep: {calculatedPrepTime}</Text>

        {/* Swap Suggestions with Choice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Ingredient Choices</Text>
          <Text style={styles.sectionSubtext}>Tap to choose between original and swap</Text>
          
          {swaps.map((swap, index) => (
            <View key={index} style={styles.swapCard}>
              <View style={styles.choiceContainer}>
                {/* Original Choice */}
                <TouchableOpacity 
                  style={[
                    styles.choiceButton, 
                    !ingredientChoices[index] && styles.choiceButtonSelected
                  ]}
                  onPress={() => toggleIngredientChoice(index)}
                >
                  <Text style={[
                    styles.choiceLabel,
                    !ingredientChoices[index] && styles.choiceLabelSelected
                  ]}>Original</Text>
                  <Text style={[
                    styles.choiceIngredient,
                    !ingredientChoices[index] && styles.choiceIngredientSelected
                  ]}>{swap.original}</Text>
                </TouchableOpacity>

                <Text style={styles.vs}>VS</Text>

                {/* Swap Choice */}
                <TouchableOpacity 
                  style={[
                    styles.choiceButton,
                    styles.swapChoiceButton,
                    ingredientChoices[index] && styles.swapChoiceButtonSelected
                  ]}
                  onPress={() => toggleIngredientChoice(index)}
                >
                  <Text style={[
                    styles.choiceLabel,
                    ingredientChoices[index] && styles.swapChoiceLabelSelected
                  ]}>Healthier</Text>
                  <Text style={[
                    styles.choiceIngredient,
                    ingredientChoices[index] && styles.swapChoiceIngredientSelected
                  ]}>{swap.replacement}</Text>
                  {ingredientChoices[index] && (
                    <Text style={styles.selectedBadge}>✓ Selected</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {ingredientChoices[index] && (
                <View style={styles.reasonBadge}>
                  <Text style={styles.reasonText}>✓ {swap.reason}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Updated Nutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Recalculated Nutrients</Text>
          <View style={styles.updatedNutrientsCard}>
            {calculatedNutrients.map((nutrient, idx) => (
              <View key={idx} style={styles.nutrientRow}>
                <Text style={styles.nutrientName}>{nutrient.name}</Text>
                <Text style={styles.nutrientValue}>{nutrient.value}</Text>
              </View>
            ))}
            <View style={styles.totalCalories}>
              <Text style={styles.caloriesLabel}>Total Calories</Text>
              <Text style={styles.caloriesValue}>{calculatedCalories} Kcal</Text>
            </View>
          </View>
        </View>

        {/* Updated Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Updated Instructions</Text>
          <View style={styles.card}>
            <Text style={styles.instructionsNote}>
              Instructions adapted for your ingredient choices
            </Text>
            {updatedInstructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}.</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
            <View style={styles.tasteBadge}>
              <Text style={styles.tasteText}>
                🎯 Taste matched to original, just healthier!
              </Text>
            </View>
          </View>
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
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  originalPrepTime: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  newPrepTime: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtext: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  swapCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vs: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginHorizontal: 8,
  },
  choiceButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  choiceButtonSelected: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFEBEE',
  },
  swapChoiceButton: {
    borderColor: '#D3D3D3',
  },
  swapChoiceButtonSelected: {
    borderColor: '#27AE60',
    backgroundColor: '#E8F5E9',
  },
  choiceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  choiceLabelSelected: {
    color: '#E74C3C',
  },
  swapChoiceLabelSelected: {
    color: '#27AE60',
  },
  choiceIngredient: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  choiceIngredientSelected: {
    color: '#E74C3C',
  },
  swapChoiceIngredientSelected: {
    color: '#27AE60',
  },
  selectedBadge: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: 'bold',
    marginTop: 4,
  },
  reasonBadge: {
    backgroundColor: '#D4EDDA',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  reasonText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '500',
  },
  updatedNutrientsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nutrientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  nutrientValue: {
    fontSize: 15,
    color: '#27AE60',
    fontWeight: '600',
  },
  totalCalories: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5F8D',
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  instructionsNote: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90E2',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
    lineHeight: 22,
  },
  tasteBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tasteText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#5FD4C4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  savedButton: {
    backgroundColor: '#4CAF50',
  },
  logButton: {
    backgroundColor: '#4A90E2',
  },
  metricsButton: {
    backgroundColor: '#9C27B0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
