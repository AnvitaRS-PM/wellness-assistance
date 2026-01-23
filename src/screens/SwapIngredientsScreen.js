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

  // Generate healthier ingredient swaps with detailed nutrition
  const generateSwaps = () => {
    const swapSuggestions = (recipe.ingredients || []).map((ingredient, index) => {
      // Simplified swap logic - in production, use AI
      const swapMap = {
        'white': { replacement: 'whole wheat', fiberBoost: 3, proteinBoost: 2, carbReduction: 5 },
        'pasta': { replacement: 'chickpea pasta', fiberBoost: 6, proteinBoost: 7, carbReduction: 8 },
        'rice': { replacement: 'quinoa', fiberBoost: 4, proteinBoost: 4, carbReduction: 3 },
        'sugar': { replacement: 'honey', fiberBoost: 0, proteinBoost: 0, carbReduction: 5 },
        'butter': { replacement: 'olive oil', fiberBoost: 0, proteinBoost: 0, carbReduction: 0 },
        'milk': { replacement: 'almond milk', fiberBoost: 1, proteinBoost: 0, carbReduction: 8 },
      };

      let swapInfo = null;
      for (const [key, value] of Object.entries(swapMap)) {
        if (ingredient.toLowerCase().includes(key)) {
          swapInfo = value;
          break;
        }
      }

      if (!swapInfo) {
        // Default swap for unmatched ingredients
        return {
          original: ingredient,
          replacement: `Organic ${ingredient}`,
          fiberBoost: 1,
          proteinBoost: 1,
          carbReduction: 2,
          reason: 'Cleaner, more nutrient-dense option'
        };
      }

      return {
        original: ingredient,
        replacement: ingredient.replace(new RegExp(Object.keys(swapMap).join('|'), 'gi'), swapInfo.replacement),
        ...swapInfo,
        reason: 'Higher nutrition density and better for health'
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

    // Calculate boosts based on selected swaps
    const totalFiberBoost = swaps.reduce((sum, swap, idx) => {
      return sum + (ingredientChoices[idx] ? swap.fiberBoost : 0);
    }, 0);

    const totalProteinBoost = swaps.reduce((sum, swap, idx) => {
      return sum + (ingredientChoices[idx] ? swap.proteinBoost : 0);
    }, 0);

    const totalCarbReduction = swaps.reduce((sum, swap, idx) => {
      return sum + (ingredientChoices[idx] ? swap.carbReduction : 0);
    }, 0);

    // Update nutrients
    const updatedNutrients = baseNutrients.map(nutrient => {
      const value = parseInt(nutrient.value);
      let newValue = value;

      if (nutrient.name === 'Fiber') {
        newValue = value + totalFiberBoost;
      } else if (nutrient.name === 'Protein') {
        newValue = value + totalProteinBoost;
      } else if (nutrient.name === 'Carbs') {
        newValue = Math.max(5, value - totalCarbReduction);
      }

      return { ...nutrient, value: `${newValue}g` };
    });

    setCalculatedNutrients(updatedNutrients);

    // Update calories (rough estimate: -10 cal per swap)
    const calorieReduction = swapCount * 10;
    setCalculatedCalories(Math.max(100, (recipe.calories || 300) - calorieReduction));

    // Update prep time (swaps might add a few minutes)
    const basePrepMins = parseInt(recipe.prepTime) || 20;
    const newPrepMins = basePrepMins + swapCount;
    setCalculatedPrepTime(`${newPrepMins}-${newPrepMins + 5} mins`);
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
