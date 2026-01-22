import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useUser } from '../context/UserContext';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe, mealType } = route.params;
  const { updateUserData } = useUser();
  const [saved, setSaved] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleSaveRecipe = () => {
    setSaved(true);
    Alert.alert('Success', `${recipe.name} has been saved to your recipes!`);
  };

  const handleLogMeal = () => {
    setLogged(true);
    navigation.navigate('LogMealConfirmation', { 
      recipeName: recipe.name, 
      mealType: mealType 
    });
  };

  const handleSwapIngredients = () => {
    navigation.navigate('SwapIngredients', { recipe, mealType });
  };

  const renderIngredient = (ingredient, index) => (
    <View key={index} style={styles.ingredientItem}>
      <Text style={styles.ingredientNumber}>{index + 1}.</Text>
      <Text style={styles.ingredientText}>{ingredient}</Text>
    </View>
  );

  const renderNutrient = (nutrient, index) => (
    <View key={index} style={styles.nutrientItem}>
      <Text style={styles.nutrientName}>{nutrient.name}:</Text>
      <Text style={styles.nutrientValue}>{nutrient.value}</Text>
    </View>
  );

  const renderInstruction = (instruction, index) => (
    <View key={index} style={styles.instructionItem}>
      <Text style={styles.instructionNumber}>{index + 1}.</Text>
      <Text style={styles.instructionText}>{instruction}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.mealType}>{mealType}</Text>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.card}>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => 
              renderIngredient(ingredient, index)
            )}
          </View>
        </View>

        {/* Nutrients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrients</Text>
          <View style={styles.nutrientsGrid}>
            {recipe.nutrients && recipe.nutrients.map((nutrient, index) => 
              renderNutrient(nutrient, index)
            )}
          </View>
          <View style={styles.caloriesCard}>
            <Text style={styles.caloriesLabel}>Total Calories</Text>
            <Text style={styles.caloriesValue}>{recipe.calories} Kcal</Text>
          </View>
        </View>

        {/* Instructions Section */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.card}>
              {recipe.instructions.map((instruction, index) => 
                renderInstruction(instruction, index)
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, saved && styles.savedActionButton]} 
            onPress={handleSaveRecipe}
            disabled={saved}
          >
            <Text style={[styles.actionButtonText, saved && styles.savedActionButtonText]}>
              {saved ? '✓ Saved' : 'Save Recipe'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logButton, logged && styles.loggedButton]} 
            onPress={handleLogMeal}
            disabled={logged}
          >
            <Text style={[styles.actionButtonText, logged && styles.loggedButtonText]}>
              {logged ? '✓ Logged' : 'Log Meal'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.swapButton]} 
            onPress={handleSwapIngredients}
          >
            <Text style={styles.actionButtonText}>Swap Ingredients</Text>
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
  mealType: {
    fontSize: 16,
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
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  ingredientNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90E2',
    marginRight: 8,
    minWidth: 20,
  },
  ingredientText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
    lineHeight: 22,
  },
  nutrientsGrid: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  nutrientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
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
    color: '#555',
  },
  caloriesCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
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
  savedActionButton: {
    backgroundColor: '#4CAF50',
  },
  logButton: {
    backgroundColor: '#4A90E2',
  },
  loggedButton: {
    backgroundColor: '#4CAF50',
  },
  swapButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  savedActionButtonText: {
    color: '#fff',
  },
  loggedButtonText: {
    color: '#fff',
  },
});
