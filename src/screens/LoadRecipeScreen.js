import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';
import MealTypePicker from '../components/MealTypePicker';

export default function LoadRecipeScreen({ navigation }) {
  const { userData, saveRecipe } = useUser();
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [recipeImage, setRecipeImage] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [calculatedPrepTime, setCalculatedPrepTime] = useState('15 mins');

  // Extract meal types from user's diet recommendations
  const getMealTypes = () => {
    const schedule = userData.recommendations?.mealSchedule || 'Breakfast, Lunch, Dinner';
    // Parse meal types from schedule
    const types = schedule.split(/,|;|\+/).map(part => {
      return part
        .replace(/\([^)]*\)/g, '') // Remove parentheses
        .replace(/\bat\b.*/i, '') // Remove "at" phrases
        .replace(/\d+:?\d*\s*(AM|PM|am|pm)/gi, '') // Remove times
        .trim();
    }).filter(t => t.length > 0);
    
    return types.length > 0 ? types : ['Breakfast', 'Lunch', 'Dinner'];
  };

  const mealTypes = getMealTypes();

  // Estimate nutrients per ingredient (simplified - in production, use nutrition API)
  const estimateIngredientNutrients = (ingredient) => {
    const ing = ingredient.toLowerCase();
    
    // Simple calorie estimation based on keywords
    if (ing.includes('egg')) return { calories: 70, protein: 6, carbs: 0, fat: 5, fiber: 0 };
    if (ing.includes('chicken')) return { calories: 150, protein: 30, carbs: 0, fat: 3, fiber: 0 };
    if (ing.includes('salmon')) return { calories: 200, protein: 25, carbs: 0, fat: 12, fiber: 0 };
    if (ing.includes('rice')) return { calories: 130, protein: 3, carbs: 28, fat: 0, fiber: 1 };
    if (ing.includes('quinoa')) return { calories: 120, protein: 4, carbs: 21, fat: 2, fiber: 3 };
    if (ing.includes('avocado')) return { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 };
    if (ing.includes('spinach')) return { calories: 20, protein: 2, carbs: 3, fat: 0, fiber: 2 };
    if (ing.includes('bread') || ing.includes('toast')) return { calories: 80, protein: 3, carbs: 15, fat: 1, fiber: 2 };
    if (ing.includes('pasta')) return { calories: 200, protein: 7, carbs: 40, fat: 1, fiber: 2 };
    if (ing.includes('oil') || ing.includes('butter')) return { calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0 };
    if (ing.includes('milk')) return { calories: 60, protein: 3, carbs: 5, fat: 3, fiber: 0 };
    if (ing.includes('yogurt')) return { calories: 100, protein: 10, carbs: 12, fat: 2, fiber: 0 };
    if (ing.includes('cheese')) return { calories: 110, protein: 7, carbs: 1, fat: 9, fiber: 0 };
    if (ing.includes('nut') || ing.includes('almond')) return { calories: 160, protein: 6, carbs: 6, fat: 14, fiber: 3 };
    if (ing.includes('fruit') || ing.includes('berry') || ing.includes('apple') || ing.includes('banana')) 
      return { calories: 60, protein: 1, carbs: 15, fat: 0, fiber: 3 };
    if (ing.includes('vegetable') || ing.includes('carrot') || ing.includes('broccoli'))
      return { calories: 30, protein: 2, carbs: 6, fat: 0, fiber: 2 };
    
    // Default for unknown ingredients
    return { calories: 50, protein: 2, carbs: 8, fat: 1, fiber: 1 };
  };

  // Recalculate nutrition when ingredients change
  useEffect(() => {
    const totals = ingredients.reduce((acc, ing) => {
      const nutrients = estimateIngredientNutrients(ing);
      return {
        calories: acc.calories + nutrients.calories,
        protein: acc.protein + nutrients.protein,
        carbs: acc.carbs + nutrients.carbs,
        fat: acc.fat + nutrients.fat,
        fiber: acc.fiber + nutrients.fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    setCalculatedCalories(Math.round(totals.calories));

    // Update prep time based on number of ingredients and instructions
    const basePrepMins = 10 + (ingredients.length * 2) + (instructions.length * 3);
    setCalculatedPrepTime(`${basePrepMins}-${basePrepMins + 5} mins`);
  }, [ingredients, instructions]);

  const handleAddIngredient = () => {
    if (currentIngredient.trim() === '') {
      Alert.alert('Error', 'Please enter an ingredient');
      return;
    }
    setIngredients([...ingredients, currentIngredient.trim()]);
    setCurrentIngredient('');
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    if (currentInstruction.trim() === '') {
      Alert.alert('Error', 'Please enter an instruction');
      return;
    }
    setInstructions([...instructions, currentInstruction.trim()]);
    setCurrentInstruction('');
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(newInstructions);
  };

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to add an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setRecipeImage(result.assets[0].uri);
    }
  };

  const handleSwapIngredients = () => {
    if (ingredients.length === 0) {
      Alert.alert('No Ingredients', 'Please add ingredients before swapping');
      return;
    }

    const totals = ingredients.reduce((acc, ing) => {
      const nutrients = estimateIngredientNutrients(ing);
      return {
        protein: acc.protein + nutrients.protein,
        carbs: acc.carbs + nutrients.carbs,
        fat: acc.fat + nutrients.fat,
        fiber: acc.fiber + nutrients.fiber
      };
    }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const recipe = {
      name: recipeName || 'Custom Recipe',
      ingredients: ingredients,
      instructions: instructions,
      prepTime: calculatedPrepTime,
      isCustom: true,
      calories: calculatedCalories,
      nutrients: [
        { name: 'Protein', value: `${Math.round(totals.protein)}g` },
        { name: 'Carbs', value: `${Math.round(totals.carbs)}g` },
        { name: 'Fat', value: `${Math.round(totals.fat)}g` },
        { name: 'Fiber', value: `${Math.round(totals.fiber)}g` }
      ],
    };

    navigation.navigate('SwapIngredients', { recipe, mealType: selectedMealType });
  };

  const handleAddRecipe = () => {
    if (!recipeName.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return;
    }
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }
    if (instructions.length === 0) {
      Alert.alert('Error', 'Please add at least one instruction');
      return;
    }

    const totals = ingredients.reduce((acc, ing) => {
      const nutrients = estimateIngredientNutrients(ing);
      return {
        protein: acc.protein + nutrients.protein,
        carbs: acc.carbs + nutrients.carbs,
        fat: acc.fat + nutrients.fat,
        fiber: acc.fiber + nutrients.fiber
      };
    }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const newRecipe = {
      name: recipeName,
      mealType: selectedMealType,
      ingredients: ingredients,
      instructions: instructions,
      prepTime: calculatedPrepTime,
      calories: calculatedCalories,
      isCustom: true,
      nutrients: [
        { name: 'Protein', value: `${Math.round(totals.protein)}g` },
        { name: 'Carbs', value: `${Math.round(totals.carbs)}g` },
        { name: 'Fat', value: `${Math.round(totals.fat)}g` },
        { name: 'Fiber', value: `${Math.round(totals.fiber)}g` },
        { name: 'Vitamin A', value: '100mcg' },
        { name: 'Vitamin C', value: '10mg' },
        { name: 'Iron', value: '2mg' },
        { name: 'Calcium', value: '80mg' }
      ],
    };

    // Save to context
    saveRecipe(newRecipe);

    Alert.alert(
      'Success',
      `${recipeName} has been added to ${selectedMealType} in Meal Planning!`,
      [{ text: 'OK', onPress: () => navigation.navigate('MealRecommendations') }]
    );
  };

  const renderIngredientWithNutrients = (ingredient, index) => {
    const nutrients = estimateIngredientNutrients(ingredient);
    return (
      <View key={index} style={styles.listItem}>
        <View style={styles.ingredientHeader}>
          <Text style={styles.itemNumber}>{index + 1}.</Text>
          <Text style={styles.itemText}>{ingredient}</Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveIngredient(index)}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nutrientSummary}>
          <Text style={styles.nutrientSmall}>~{nutrients.calories} cal</Text>
          <Text style={styles.nutrientSmall}>P: {nutrients.protein}g</Text>
          <Text style={styles.nutrientSmall}>C: {nutrients.carbs}g</Text>
          <Text style={styles.nutrientSmall}>F: {nutrients.fat}g</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Load Your Recipe</Text>
        <Text style={styles.subtitle}>Add your own custom recipe with automatic nutrition calculation</Text>

        {/* Recipe Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter recipe name..."
            value={recipeName}
            onChangeText={setRecipeName}
          />
        </View>

        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <MealTypePicker
            selectedValue={selectedMealType}
            onValueChange={setSelectedMealType}
            mealTypes={mealTypes}
          />
        </View>

        {/* Recipe Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Image (Optional)</Text>
          {recipeImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipeImage }} style={styles.recipeImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setRecipeImage(null)}
              >
                <Text style={styles.removeImageText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Text style={styles.addImageText}>📷 Add Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ingredients Section with Nutrient Calculation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.length > 0 && (
            <>
              <View style={styles.itemsList}>
                {ingredients.map((ingredient, index) => renderIngredientWithNutrients(ingredient, index))}
              </View>
              <View style={styles.totalNutrition}>
                <Text style={styles.totalLabel}>Total Calories:</Text>
                <Text style={styles.totalValue}>{calculatedCalories} Kcal</Text>
              </View>
              <View style={styles.prepTimeCard}>
                <Text style={styles.prepTimeLabel}>Estimated Prep Time:</Text>
                <Text style={styles.prepTimeValue}>{calculatedPrepTime}</Text>
              </View>
            </>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredient (e.g., 2 eggs, 1 cup rice)..."
              value={currentIngredient}
              onChangeText={setCurrentIngredient}
              onSubmitEditing={handleAddIngredient}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {instructions.length > 0 && (
            <View style={styles.itemsList}>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.itemNumber}>{index + 1}.</Text>
                  <Text style={styles.itemText}>{instruction}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveInstruction(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.instructionInput]}
              placeholder="Enter instruction step..."
              value={currentInstruction}
              onChangeText={setCurrentInstruction}
              onSubmitEditing={handleAddInstruction}
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddInstruction}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.addRecipeButton} 
            onPress={handleAddRecipe}
          >
            <Text style={styles.buttonText}>✓ Add Recipe to {selectedMealType}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.swapButton} 
            onPress={handleSwapIngredients}
          >
            <Text style={styles.buttonText}>Swap Ingredients</Text>
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
  nameInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  imageContainer: {
    alignItems: 'center',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  removeImageButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  removeImageText: {
    color: '#fff',
    fontWeight: '600',
  },
  addImageButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  itemsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  listItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90E2',
    marginRight: 8,
    minWidth: 20,
  },
  itemText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
    lineHeight: 22,
  },
  removeButton: {
    backgroundColor: '#E74C3C',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  nutrientSummary: {
    flexDirection: 'row',
    marginLeft: 28,
    gap: 12,
  },
  nutrientSmall: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '600',
  },
  totalNutrition: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5F8D',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  prepTimeCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prepTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  prepTimeValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  instructionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#5FD4C4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionsContainer: {
    marginTop: 12,
  },
  addRecipeButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  swapButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
