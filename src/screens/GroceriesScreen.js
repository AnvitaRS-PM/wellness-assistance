import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';

export default function GroceriesScreen({ navigation }) {
  const { userData } = useUser();
  const [groceryItems, setGroceryItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  // Generate grocery list from saved recipes
  useEffect(() => {
    generateGroceryList();
  }, [userData.savedRecipes]);
  
  // Load saved custom items on mount
  useEffect(() => {
    loadSavedGroceryList();
  }, []);

  const generateGroceryList = () => {
    console.log('🛒 Generating grocery list...');
    console.log('Saved recipes count:', userData.savedRecipes?.length || 0);
    
    if (!userData.savedRecipes || userData.savedRecipes.length === 0) {
      console.log('No saved recipes found');
      setGroceryItems([]);
      return;
    }

    // Aggregate ingredients from all saved recipes
    const ingredientMap = {};
    
    userData.savedRecipes.forEach((recipe, recipeIndex) => {
      console.log(`Processing recipe ${recipeIndex + 1}: ${recipe.name}`);
      
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
          // Parse ingredient to extract quantity, unit, and name
          const parsed = parseIngredient(ingredient);
          const key = parsed.name.toLowerCase().trim();
          
          console.log(`  - Parsed: ${ingredient} → ${parsed.quantity} ${parsed.unit} ${parsed.name}`);
          
          if (ingredientMap[key]) {
            // Aggregate quantities if same ingredient and unit
            if (ingredientMap[key].unit.toLowerCase() === parsed.unit.toLowerCase()) {
              const oldQty = parseFloat(ingredientMap[key].quantity);
              const newQty = parseFloat(parsed.quantity);
              const totalQty = oldQty + newQty;
              
              ingredientMap[key].quantity = totalQty.toString();
              
              // Add recipe to list if not already there
              if (!ingredientMap[key].recipes.includes(recipe.name)) {
                ingredientMap[key].recipes.push(recipe.name);
              }
              
              console.log(`    → Aggregated: ${oldQty} + ${newQty} = ${totalQty} ${parsed.unit}`);
            } else {
              // Different units - create separate entry
              const newKey = `${key}_${parsed.unit.toLowerCase()}`;
              if (ingredientMap[newKey]) {
                const oldQty = parseFloat(ingredientMap[newKey].quantity);
                const newQty = parseFloat(parsed.quantity);
                const totalQty = oldQty + newQty;
                
                ingredientMap[newKey].quantity = totalQty.toString();
                
                if (!ingredientMap[newKey].recipes.includes(recipe.name)) {
                  ingredientMap[newKey].recipes.push(recipe.name);
                }
                
                console.log(`    → Aggregated (${parsed.unit}): ${oldQty} + ${newQty} = ${totalQty}`);
              } else {
                ingredientMap[newKey] = {
                  name: parsed.name,
                  quantity: parsed.quantity,
                  unit: parsed.unit,
                  recipes: [recipe.name]
                };
                console.log(`    → New entry (different unit): ${parsed.quantity} ${parsed.unit}`);
              }
            }
          } else {
            ingredientMap[key] = {
              name: parsed.name,
              quantity: parsed.quantity,
              unit: parsed.unit,
              recipes: [recipe.name]
            };
            console.log(`    → New entry: ${parsed.quantity} ${parsed.unit}`);
          }
        });
      }
    });

    // Convert map to array
    const items = Object.values(ingredientMap).map((item, index) => ({
      id: index + 1,
      name: item.name,
      quantity: (Math.round(parseFloat(item.quantity) * 10) / 10).toString(), // Round to 1 decimal and convert to string
      unit: item.unit,
      recipe: item.recipes.length > 1 ? 'Multiple recipes' : item.recipes[0]
    }));

    console.log(`✅ Generated ${items.length} grocery items`);
    setGroceryItems(items);
  };

  // Parse ingredient string to extract quantity, unit, and name
  const parseIngredient = (ingredient) => {
    // Common patterns:
    // "150g chicken breast" -> quantity: 150, unit: g, name: chicken breast
    // "2 cups spinach" -> quantity: 2, unit: cups, name: spinach
    // "1/2 avocado" -> quantity: 0.5, unit: whole, name: avocado
    // "Salt and pepper" -> quantity: 1, unit: pinch, name: Salt and pepper
    
    const patterns = [
      // Pattern: "150g chicken"
      /^(\d+\.?\d*)\s*([a-z]+)\s+(.+)$/i,
      // Pattern: "2 cups spinach"
      /^(\d+\.?\d*)\s+(cup|cups|tbsp|tsp|teaspoon|tablespoon|oz|lb|lbs)\s+(.+)$/i,
      // Pattern: "1/2 avocado"
      /^(\d+\/\d+)\s+(.+)$/,
      // Pattern: "2 medium carrots"
      /^(\d+)\s+(small|medium|large|whole|cloves?|slices?|stalks?)\s+(.+)$/i,
    ];

    for (const pattern of patterns) {
      const match = ingredient.match(pattern);
      if (match) {
        let quantity = match[1];
        
        // Handle fractions
        if (quantity.includes('/')) {
          const parts = quantity.split('/');
          quantity = (parseFloat(parts[0]) / parseFloat(parts[1])).toString();
        }
        
        // For pattern 1 (150g chicken), unit is match[2], name is match[3]
        // For pattern 2 (2 cups), unit is match[2], name is match[3]
        // For pattern 3 (1/2 avocado), unit is 'whole', name is match[2]
        // For pattern 4 (2 medium carrots), unit is match[2], name is match[3]
        
        if (pattern === patterns[2]) {
          // Pattern 3: fraction without unit
          return {
            quantity: quantity,
            unit: 'whole',
            name: match[2]
          };
        } else {
          return {
            quantity: quantity,
            unit: match[2],
            name: match[3] || match[2]
          };
        }
      }
    }

    // If no pattern matches, return whole ingredient as name
    return {
      quantity: '1',
      unit: 'item',
      name: ingredient
    };
  };

  const handleEditStart = (id) => {
    setEditingId(id);
  };

  const handleEditEnd = () => {
    setEditingId(null);
  };

  const updateQuantity = (id, newQuantity) => {
    setGroceryItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateUnit = (id, newUnit) => {
    setGroceryItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, unit: newUnit } : item
      )
    );
  };

  const updateName = (id, newName) => {
    setGroceryItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  const deleteItem = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from your grocery list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setGroceryItems(prevItems => prevItems.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const handleShareList = () => {
    Alert.alert('Share List', 'Grocery list sharing feature coming soon!');
  };

  const handleClearList = () => {
    Alert.alert(
      'Clear List',
      'Are you sure you want to clear all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setGroceryItems([]);
            saveGroceryListToStorage([]);
          },
        },
      ]
    );
  };
  
  // Load saved grocery list from AsyncStorage
  const loadSavedGroceryList = async () => {
    try {
      const saved = await AsyncStorage.getItem('grocery_list_custom_items');
      if (saved) {
        const customItems = JSON.parse(saved);
        // These will be merged with recipe-generated items
        console.log('Loaded custom grocery items:', customItems.length);
      }
    } catch (error) {
      console.error('Error loading grocery list:', error);
    }
  };
  
  // Save current grocery list to AsyncStorage
  const saveGroceryListToStorage = async (items) => {
    try {
      await AsyncStorage.setItem('grocery_list', JSON.stringify(items));
      console.log('✅ Grocery list saved!');
    } catch (error) {
      console.error('Error saving grocery list:', error);
    }
  };
  
  // Handle save list button
  const handleSaveList = () => {
    saveGroceryListToStorage(groceryItems);
    Alert.alert('Success', 'Your grocery list has been saved!');
  };
  
  // Handle add new item
  const handleAddNewItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    if (!newItemQuantity.trim()) {
      Alert.alert('Error', 'Please enter a quantity');
      return;
    }
    
    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim(),
      unit: newItemUnit.trim() || 'item',
      recipe: 'Manually added'
    };
    
    setGroceryItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemUnit('');
    setShowAddForm(false);
    
    Alert.alert('Success', `${newItem.name} added to your list!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Grocery List</Text>
            <Text style={styles.subtitle}>Based on your saved recipes</Text>
          </View>
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{groceryItems.length}</Text>
            <Text style={styles.itemCountLabel}>items</Text>
          </View>
        </View>

        {groceryItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🛒</Text>
            <Text style={styles.emptyStateTitle}>No items in your list</Text>
            <Text style={styles.emptyStateText}>
              Save recipes from Meal Planning to automatically generate your grocery list, or add items manually
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('MealRecommendations')}
            >
              <Text style={styles.emptyStateButtonText}>Go to Meal Planning</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emptyStateButton, styles.addItemButton]}
              onPress={() => setShowAddForm(true)}
            >
              <Text style={styles.emptyStateButtonText}>+ Add Item Manually</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Add Item Form */}
            {showAddForm && (
              <View style={styles.addForm}>
                <Text style={styles.addFormTitle}>Add New Item</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Item name (e.g., Milk)"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.formInput, styles.formInputSmall]}
                    placeholder="Quantity"
                    value={newItemQuantity}
                    onChangeText={setNewItemQuantity}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.formInput, styles.formInputSmall]}
                    placeholder="Unit (e.g., cups)"
                    value={newItemUnit}
                    onChangeText={setNewItemUnit}
                  />
                </View>
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => {
                      setShowAddForm(false);
                      setNewItemName('');
                      setNewItemQuantity('');
                      setNewItemUnit('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formButton, styles.addButton]}
                    onPress={handleAddNewItem}
                  >
                    <Text style={styles.addButtonText}>Add Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {/* Group items by recipe */}
            <View style={styles.itemsContainer}>
              {groceryItems.map((item) => (
                <View key={item.id} style={styles.groceryCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.checkboxContainer}>
                      <TouchableOpacity style={styles.checkbox}>
                        <Text style={styles.checkboxText}>✓</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.itemDetails}>
                      {editingId === item.id ? (
                        <TextInput
                          style={styles.itemNameInput}
                          value={item.name}
                          onChangeText={(text) => updateName(item.id, text)}
                          onBlur={handleEditEnd}
                          autoFocus
                        />
                      ) : (
                        <TouchableOpacity onPress={() => handleEditStart(item.id)}>
                          <Text style={styles.itemName}>{item.name}</Text>
                        </TouchableOpacity>
                      )}

                      <View style={styles.quantityRow}>
                        {editingId === item.id ? (
                          <>
                            <TextInput
                              style={styles.quantityInput}
                              value={item.quantity}
                              onChangeText={(text) => updateQuantity(item.id, text)}
                              keyboardType="numeric"
                            />
                            <TextInput
                              style={styles.unitInput}
                              value={item.unit}
                              onChangeText={(text) => updateUnit(item.id, text)}
                            />
                          </>
                        ) : (
                          <TouchableOpacity onPress={() => handleEditStart(item.id)}>
                            <Text style={styles.quantityText}>
                              {item.quantity} {item.unit}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <Text style={styles.recipeTag}>From: {item.recipe}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteItem(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  {editingId === item.id && (
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={handleEditEnd}
                    >
                      <Text style={styles.doneButtonText}>Done Editing</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.addItemButtonSmall]}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.actionButtonText}>➕ Add Item</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveList}
              >
                <Text style={styles.actionButtonText}>💾 Save List</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShareList}
              >
                <Text style={styles.actionButtonText}>📤 Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={handleClearList}
              >
                <Text style={styles.actionButtonText}>🗑️ Clear</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Main Action Buttons */}
        {groceryItems.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.todaysIntakeButton}
              onPress={() => navigation.navigate('TodaysMetrics')}
            >
              <Text style={styles.buttonText}>Today's Intake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mealPlanningButton}
              onPress={() => navigation.navigate('MealRecommendations')}
            >
              <Text style={styles.mealPlanningButtonText}>Meal Planning</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            💡 Tap any item to edit its name, quantity, or unit
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  itemCount: {
    backgroundColor: '#5FD4C4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  itemCountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemCountLabel: {
    fontSize: 12,
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyStateButton: {
    backgroundColor: '#5FD4C4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  groceryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5FD4C4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5FD4C4',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 14,
    color: '#5FD4C4',
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemNameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#5FD4C4',
  },
  quantityRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quantityText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  quantityInput: {
    fontSize: 16,
    color: '#4A90E2',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minWidth: 60,
  },
  unitInput: {
    fontSize: 16,
    color: '#4A90E2',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minWidth: 80,
  },
  recipeTag: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#E74C3C',
    fontWeight: 'bold',
    lineHeight: 28,
  },
  doneButton: {
    backgroundColor: '#5FD4C4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#4A90E2',
  },
  clearButton: {
    backgroundColor: '#E74C3C',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  todaysIntakeButton: {
    backgroundColor: '#9C27B0',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  mealPlanningButton: {
    backgroundColor: '#5FD4C4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  mealPlanningButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  infoNote: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoNoteText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  addForm: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#5FD4C4',
  },
  addFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formInputSmall: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#5FD4C4',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addItemButton: {
    backgroundColor: '#4A90E2',
    marginTop: 12,
  },
  addItemButtonSmall: {
    backgroundColor: '#4A90E2',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});
