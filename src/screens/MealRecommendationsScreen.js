import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useUser } from '../context/UserContext';
import { openAIService } from '../services/openAIService';

export default function MealRecommendationsScreen({ navigation }) {
  const { userData, updateUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mealRecommendations, setMealRecommendations] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState({});

  useEffect(() => {
    generateMealRecommendations();
  }, []);

  const generateMealRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await openAIService.generateMealRecommendations(userData);
      setMealRecommendations(result);
      updateUserData({ mealRecommendations: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (mealType, recipeIndex) => {
    const key = `${mealType}-${recipeIndex}`;
    setSavedRecipes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleRecipePress = (recipe, mealType) => {
    navigation.navigate('RecipeDetail', { recipe, mealType });
  };

  const handleGroceryList = () => {
    // TODO: Navigate to Grocery List screen
    alert('Grocery List feature coming soon!');
  };

  const handleLoadRecipe = () => {
    navigation.navigate('LoadRecipe');
  };

  const renderRecipeCard = (recipe, mealType, index) => {
    const key = `${mealType}-${index}`;
    const isSaved = savedRecipes[key];

    return (
      <TouchableOpacity 
        key={index}
        style={styles.recipeCard}
        onPress={() => handleRecipePress(recipe, mealType)}
      >
        <View style={styles.recipeContent}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.recipeCalories}>Calories: {recipe.calories} Kcal</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSaved && styles.savedButton]}
          onPress={() => toggleSaveRecipe(mealType, index)}
        >
          <Text style={[styles.addButtonText, isSaved && styles.savedButtonText]}>{isSaved ? '✓' : '+'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderMealSection = (mealType, recipes) => {
    if (!recipes || recipes.length === 0) return null;

    return (
      <View key={mealType} style={styles.mealSection}>
        <Text style={styles.mealTitle}>{mealType}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesScroll}
        >
          {recipes.map((recipe, index) => renderRecipeCard(recipe, mealType, index))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Creating your personalized meal plan...</Text>
          <Text style={styles.subText}>This may take a few moments</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={generateMealRecommendations}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Food Option Recommendations</Text>
        <Text style={styles.subtitle}>Based on your personalized diet plan</Text>

        {mealRecommendations && Object.entries(mealRecommendations).map(([mealType, recipes]) => 
          renderMealSection(mealType, recipes)
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.groceryButton} onPress={handleGroceryList}>
            <Text style={styles.groceryButtonText}>Grocery List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loadRecipeButton} onPress={handleLoadRecipe}>
            <Text style={styles.loadRecipeButtonText}>Load Recipe</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  mealSection: {
    marginBottom: 32,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  recipesScroll: {
    paddingRight: 24,
  },
  recipeCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  recipeContent: {
    flex: 1,
    marginRight: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  recipeCalories: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  savedButton: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  savedButtonText: {
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  groceryButton: {
    flex: 1,
    backgroundColor: '#5FD4C4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  groceryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadRecipeButton: {
    flex: 1,
    backgroundColor: '#5FD4C4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadRecipeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
