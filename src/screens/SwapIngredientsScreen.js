import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';

export default function SwapIngredientsScreen({ route, navigation }) {
  const { recipe, mealType } = route.params;
  const { updateUserData } = useUser();
  const [saved, setSaved] = useState(false);

  // Generate healthier ingredient swaps
  const generateSwaps = () => {
    // Mock data for ingredient swaps - in production, this would use AI
    const swapSuggestions = [
      {
        original: recipe.ingredients[0] || 'White bread',
        replacement: 'Whole wheat bread',
        originalNutrients: 'Carbs: 30g, Fiber: 1g, Protein: 3g',
        newNutrients: 'Carbs: 25g, Fiber: 4g, Protein: 5g',
        reason: 'Higher fiber and protein content',
      },
      {
        original: recipe.ingredients[1] || 'Regular pasta',
        replacement: 'Chickpea pasta',
        originalNutrients: 'Carbs: 40g, Fiber: 2g, Protein: 7g',
        newNutrients: 'Carbs: 32g, Fiber: 8g, Protein: 14g',
        reason: 'More protein and fiber, gluten-free',
      },
    ];

    return swapSuggestions.slice(0, recipe.ingredients.length);
  };

  const swaps = generateSwaps();

  // Generate updated instructions based on swapped ingredients
  const getUpdatedInstructions = () => {
    if (recipe.instructions && recipe.instructions.length > 0) {
      return recipe.instructions;
    }
    return [
      'Prepare ingredients according to package instructions',
      'Cook with swapped ingredients using the same method',
      'Season to taste and serve',
    ];
  };

  const updatedInstructions = getUpdatedInstructions();

  const handleSaveRecipe = () => {
    setSaved(true);
    Alert.alert('Success', 'Modified recipe has been saved to your recipes!');
  };

  const handleLogMeal = () => {
    navigation.navigate('LogMealConfirmation', { 
      recipeName: `${recipe.name} (Modified)`, 
      mealType: mealType 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.subtitle}>Healthier ingredient alternatives</Text>

        {/* Original Recipe Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Original Recipe</Text>
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>Ingredients</Text>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                {index + 1}. {ingredient}
              </Text>
            ))}
            
            {recipe.nutrients && recipe.nutrients.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.cardSubtitle}>Original Nutrients</Text>
                <View style={styles.nutrientsRow}>
                  {recipe.nutrients.slice(0, 3).map((nutrient, index) => (
                    <Text key={index} style={styles.nutrientText}>
                      {nutrient.name}: {nutrient.value}
                    </Text>
                  ))}
                </View>
              </>
            )}
            
            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesText}>Calories: {recipe.calories} Kcal</Text>
            </View>
          </View>
        </View>

        {/* Swap Suggestions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Swap Ingredient Suggestions</Text>
          {swaps.map((swap, index) => (
            <View key={index} style={styles.swapCard}>
              <View style={styles.swapHeader}>
                <Text style={styles.swapLabel}>Replace:</Text>
                <Text style={styles.originalIngredient}>{swap.original}</Text>
              </View>
              
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>⬇️</Text>
              </View>
              
              <View style={styles.swapHeader}>
                <Text style={styles.swapLabel}>With:</Text>
                <Text style={styles.replacementIngredient}>{swap.replacement}</Text>
              </View>
              
              <View style={styles.nutritionComparison}>
                <View style={styles.nutritionColumn}>
                  <Text style={styles.nutritionLabel}>Original:</Text>
                  <Text style={styles.nutritionValue}>{swap.originalNutrients}</Text>
                </View>
                <View style={styles.nutritionColumn}>
                  <Text style={styles.nutritionLabel}>New:</Text>
                  <Text style={[styles.nutritionValue, styles.newNutrition]}>{swap.newNutrients}</Text>
                </View>
              </View>
              
              <View style={styles.reasonBadge}>
                <Text style={styles.reasonText}>✓ {swap.reason}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Updated Nutrients After Swap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updated Nutrients</Text>
          <View style={styles.updatedNutrientsCard}>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>Protein</Text>
              <View style={styles.nutrientChange}>
                <Text style={styles.oldValue}>20gms</Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.newValue}>25gms ↑</Text>
              </View>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>Fiber</Text>
              <View style={styles.nutrientChange}>
                <Text style={styles.oldValue}>2gms</Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.newValue}>6gms ↑</Text>
              </View>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>Vitamin E</Text>
              <View style={styles.nutrientChange}>
                <Text style={styles.oldValue}>1gms</Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.newValue}>3gms ↑</Text>
              </View>
            </View>
            <View style={styles.totalCalories}>
              <Text style={styles.caloriesLabel}>Total Calories</Text>
              <Text style={styles.caloriesValue}>{recipe.calories} Kcal</Text>
            </View>
          </View>
        </View>

        {/* Updated Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updated Instructions</Text>
          <View style={styles.card}>
            <Text style={styles.instructionsNote}>
              Instructions adapted for healthier ingredients
            </Text>
            {updatedInstructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}.</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
            <View style={styles.tasteBadge}>
              <Text style={styles.tasteText}>
                🎯 Outcome: Similar taste to original, just healthier!
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, saved && styles.savedButton]} 
            onPress={handleSaveRecipe}
            disabled={saved}
          >
            <Text style={styles.actionButtonText}>
              {saved ? '✓ Recipe Saved' : 'Save Recipe'}
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },
  ingredientText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  nutrientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  nutrientText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    marginBottom: 4,
  },
  caloriesBadge: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90E2',
  },
  swapCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  swapHeader: {
    marginBottom: 8,
  },
  swapLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  originalIngredient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
  replacementIngredient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27AE60',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrow: {
    fontSize: 20,
  },
  nutritionComparison: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  nutritionColumn: {
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 13,
    color: '#555',
  },
  newNutrition: {
    color: '#27AE60',
    fontWeight: '600',
  },
  reasonBadge: {
    backgroundColor: '#D4EDDA',
    borderRadius: 6,
    padding: 8,
    marginTop: 12,
  },
  reasonText: {
    fontSize: 13,
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nutrientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  nutrientChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  newValue: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
    marginLeft: 8,
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
