import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';

export default function GroceriesScreen({ navigation }) {
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: 'Eggs', quantity: '6', unit: 'whole', recipe: 'Eggs Poached + Toast' },
    { id: 2, name: 'Multigrain Bread', quantity: '4', unit: 'slices', recipe: 'Eggs Poached + Toast' },
    { id: 3, name: 'Sprouted Grain', quantity: '50', unit: 'g', recipe: 'Eggs Poached + Toast' },
    { id: 4, name: 'Chicken Breast', quantity: '200', unit: 'g', recipe: 'Grilled Chicken Salad' },
    { id: 5, name: 'Mixed Greens', quantity: '150', unit: 'g', recipe: 'Grilled Chicken Salad' },
    { id: 6, name: 'Cherry Tomatoes', quantity: '100', unit: 'g', recipe: 'Grilled Chicken Salad' },
    { id: 7, name: 'Quinoa', quantity: '100', unit: 'g', recipe: 'Quinoa Bowl' },
    { id: 8, name: 'Black Beans', quantity: '150', unit: 'g', recipe: 'Quinoa Bowl' },
    { id: 9, name: 'Avocado', quantity: '1', unit: 'whole', recipe: 'Quinoa Bowl' },
    { id: 10, name: 'Olive Oil', quantity: '30', unit: 'ml', recipe: 'Multiple recipes' },
    { id: 11, name: 'Lemon', quantity: '2', unit: 'whole', recipe: 'Multiple recipes' },
    { id: 12, name: 'Garlic', quantity: '6', unit: 'cloves', recipe: 'Multiple recipes' },
  ]);

  const [editingId, setEditingId] = useState(null);

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
          onPress: () => setGroceryItems([]),
        },
      ]
    );
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
              Save recipes from Meal Planning to automatically generate your grocery list
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('MealRecommendations')}
            >
              <Text style={styles.emptyStateButtonText}>Go to Meal Planning</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShareList}
              >
                <Text style={styles.actionButtonText}>📤 Share List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={handleClearList}
              >
                <Text style={styles.actionButtonText}>🗑️ Clear All</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Main Action Buttons */}
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
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
});
