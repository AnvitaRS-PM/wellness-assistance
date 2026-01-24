import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function ConditionsScreen({ navigation }) {
  const { updateUserData, userData } = useUser();
  const [selectedConditions, setSelectedConditions] = useState(userData.conditions || []);
  const [customConditions, setCustomConditions] = useState(userData.customConditions || '');
  const [dietType, setDietType] = useState(userData.dietType || '');
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState(userData.foodPreferences || []);
  const [customFoodPreferences, setCustomFoodPreferences] = useState(userData.customFoodPreferences || '');
  const [selectedAllergies, setSelectedAllergies] = useState(userData.allergies || []);
  const [customAllergies, setCustomAllergies] = useState(userData.customAllergies || '');

  const conditionOptions = ['Hypothyroid', 'PCOS', 'Diabetes', 'Digestive Issues', 'Hypertension', 'No Conditions'];
  const dietOptions = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Pescatarian'];
  const foodPreferenceOptions = ['Chicken', 'Eggs', 'Chocolate', 'Coffee'];
  const allergyOptions = ['Shell-fish', 'Broccoli', 'Eggplant', 'Quinoa'];

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(item)) {
      setSelectedArray(selectedArray.filter(i => i !== item));
    } else {
      setSelectedArray([...selectedArray, item]);
    }
  };

  const handleContinue = () => {
    // Clear recommendations when conditions/preferences change
    updateUserData({
      conditions: selectedConditions,
      customConditions,
      dietType,
      foodPreferences: selectedFoodPreferences,
      customFoodPreferences,
      allergies: selectedAllergies,
      customAllergies,
      recommendations: null,  // Clear to force regeneration
      mealRecommendations: null  // Clear to force regeneration
    });
    navigation.navigate('Recommendations');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Conditions</Text>
        
        <View style={styles.optionsContainer}>
          {conditionOptions.map((condition) => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.optionButton,
                selectedConditions.includes(condition) && styles.optionButtonSelected
              ]}
              onPress={() => toggleSelection(condition, selectedConditions, setSelectedConditions)}
            >
              <Text style={[
                styles.optionButtonText,
                selectedConditions.includes(condition) && styles.optionButtonTextSelected
              ]}>
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Any other Conditions</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter any additional conditions..."
            value={customConditions}
            onChangeText={setCustomConditions}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet</Text>
          {dietOptions.map((diet) => (
            <TouchableOpacity
              key={diet}
              style={styles.checkboxContainer}
              onPress={() => setDietType(diet)}
            >
              <View style={[styles.checkbox, dietType === diet && styles.checkboxSelected]}>
                {dietType === diet && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>{diet}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Preferences</Text>
          <View style={styles.optionsContainer}>
            {foodPreferenceOptions.map((food) => (
              <TouchableOpacity
                key={food}
                style={[
                  styles.smallOptionButton,
                  selectedFoodPreferences.includes(food) && styles.optionButtonSelected
                ]}
                onPress={() => toggleSelection(food, selectedFoodPreferences, setSelectedFoodPreferences)}
              >
                <Text style={[
                  styles.optionButtonText,
                  selectedFoodPreferences.includes(food) && styles.optionButtonTextSelected
                ]}>
                  {food}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Any Others</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add your food preferences..."
            value={customFoodPreferences}
            onChangeText={setCustomFoodPreferences}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies/Dislikes</Text>
          <View style={styles.optionsContainer}>
            {allergyOptions.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                style={[
                  styles.smallOptionButton,
                  selectedAllergies.includes(allergy) && styles.optionButtonSelected
                ]}
                onPress={() => toggleSelection(allergy, selectedAllergies, setSelectedAllergies)}
              >
                <Text style={[
                  styles.optionButtonText,
                  selectedAllergies.includes(allergy) && styles.optionButtonTextSelected
                ]}>
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Any Others</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add your allergies or dislikes..."
            value={customAllergies}
            onChangeText={setCustomAllergies}
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  smallOptionButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  optionButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#333',
  },
  optionButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#D3D3D3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#5FD4C4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
