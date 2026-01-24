import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useUser } from '../context/UserContext';
import { openAIService } from '../services/openAIService';

export default function MealRecommendationsScreen({ navigation }) {
  const { userData, updateUserData, saveRecipe, unsaveRecipe, isRecipeSaved } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mealRecommendations, setMealRecommendations] = useState(null);
  const scrollRefs = React.useRef({});

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

  const toggleSaveRecipe = (recipe, mealType) => {
    const recipeWithMealType = { ...recipe, mealType };
    if (isRecipeSaved(recipe.name, mealType)) {
      unsaveRecipe(recipe.name, mealType);
    } else {
      saveRecipe(recipeWithMealType);
    }
  };

  const handleRecipePress = (recipe, mealType) => {
    navigation.navigate('RecipeDetail', { recipe, mealType });
  };

  const handleGroceryList = () => {
    navigation.navigate('Groceries');
  };

  const handleLoadRecipe = () => {
    navigation.navigate('LoadRecipe');
  };

  const renderRecipeCard = (recipe, mealType, index) => {
    const isSaved = isRecipeSaved(recipe.name, mealType);

    return (
      <TouchableOpacity 
        key={`${mealType}-${index}`}
        style={styles.recipeCard}
        onPress={() => handleRecipePress(recipe, mealType)}
      >
        {recipe.isCustom && (
          <View style={styles.customLabel}>
            <Text style={styles.customLabelText}>Your Recipe</Text>
          </View>
        )}
        <View style={styles.recipeContent}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.recipeCalories}>Calories: {recipe.calories} Kcal</Text>
          {recipe.prepTime && (
            <Text style={styles.recipePrepTime}>Prep: {recipe.prepTime}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSaved && styles.savedButton]}
          onPress={() => toggleSaveRecipe(recipe, mealType)}
        >
          <Text style={[styles.addButtonText, isSaved && styles.savedButtonText]}>{isSaved ? '✓' : '+'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderMealSection = (mealType, recipes) => {
    // Merge AI recipes with custom recipes for this meal type
    const customRecipesForMeal = userData.customRecipes[mealType] || [];
    const allRecipes = [...recipes, ...customRecipesForMeal];
    
    if (!allRecipes || allRecipes.length === 0) return null;

    return (
      <View key={mealType} style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{mealType}</Text>
          {customRecipesForMeal.length > 0 && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>
                +{customRecipesForMeal.length} custom
              </Text>
            </View>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesScroll}
          scrollEnabled={true}
          decelerationRate="fast"
          snapToInterval={216}
          snapToAlignment="start"
        >
          {allRecipes.map((recipe, index) => renderRecipeCard(recipe, mealType, index))}
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
        <Text style={styles.subtitle}>
          {userData.recommendations?.numberOfMeals 
            ? `Your ${userData.recommendations.numberOfMeals} personalized meal plan`
            : 'Based on your personalized diet plan'}
        </Text>

        {/* DEBUG INFO - Shows what's actually happening */}
        {__DEV__ && userData.recommendations && (
          <View style={styles.debugPanel}>
            <Text style={styles.debugTitle}>🔍 Debug Info:</Text>
            <Text style={styles.debugText}>
              Diet says: {userData.recommendations.numberOfMeals}
            </Text>
            <Text style={styles.debugText}>
              Meal Schedule: {userData.recommendations.mealSchedule}
            </Text>
            <Text style={styles.debugText}>
              Meal types on screen: {mealRecommendations ? Object.keys(mealRecommendations).join(', ') : 'None'}
            </Text>
            <Text style={styles.debugText}>
              Count: {mealRecommendations ? Object.keys(mealRecommendations).length : 0}
            </Text>
          </View>
        )}

        {mealRecommendations && Object.keys(mealRecommendations).length > 0 ? (
          Object.entries(mealRecommendations).map(([mealType, recipes]) => 
            renderMealSection(mealType, recipes)
          )
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No meal recommendations available yet.</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={generateMealRecommendations}
            >
              <Text style={styles.retryButtonText}>Generate Recommendations</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  mealSection: {
    marginBottom: 32,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  customLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  customLabelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  mealCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  recipePrepTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
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
  debugPanel: {
    backgroundColor: '#fff3cd',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
});
