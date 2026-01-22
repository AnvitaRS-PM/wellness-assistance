import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function LoadRecipeScreen({ navigation }) {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [recipeImage, setRecipeImage] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');

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

    const recipe = {
      name: recipeName || 'Custom Recipe',
      ingredients: ingredients,
      instructions: instructions,
      isCustom: true,
      calories: 'Calculating...',
      nutrients: [],
    };

    navigation.navigate('SwapIngredients', { recipe, mealType: 'Custom' });
  };

  const handleSaveRecipe = () => {
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }
    if (instructions.length === 0) {
      Alert.alert('Error', 'Please add at least one instruction');
      return;
    }

    // Save the recipe
    Alert.alert(
      'Success',
      `${recipeName || 'Recipe'} has been saved!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Load Your Recipe</Text>
        <Text style={styles.subtitle}>Add your own custom recipe with ingredients and instructions</Text>

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

        {/* Recipe Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Image</Text>
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

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.length > 0 && (
            <View style={styles.itemsList}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.itemNumber}>{index + 1}.</Text>
                  <Text style={styles.itemText}>{ingredient}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveIngredient(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredient..."
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
            style={styles.swapButton} 
            onPress={handleSwapIngredients}
          >
            <Text style={styles.buttonText}>Swap Ingredients</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveRecipe}
          >
            <Text style={styles.buttonText}>Save Recipe</Text>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  swapButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#5FD4C4',
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
