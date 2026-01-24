import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function GoalsScreen({ navigation }) {
  const { updateUserData, userData } = useUser();
  const [selectedGoals, setSelectedGoals] = useState(userData.goals || []);
  const [customGoals, setCustomGoals] = useState(userData.customGoals || '');

  const goalOptions = [
    'Lose Weight',
    'Balance Hormones',
    'Improve Digestion',
    'Eat Healthier',
    'Glowing Skin',
    'Healthier Hair',
    'Reduce Saddlebags',
    'Reduce Waist size',
  ];

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleContinue = () => {
    // Clear recommendations when goals change - forces regeneration
    updateUserData({
      goals: selectedGoals,
      customGoals: customGoals,
      recommendations: null,  // Clear to force regeneration
      mealRecommendations: null  // Clear to force regeneration
    });
    navigation.navigate('Conditions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Goals</Text>
        <Text style={styles.subtitle}>Select your Goals</Text>

        <View style={styles.goalsGrid}>
          {goalOptions.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.goalButton,
                selectedGoals.includes(goal) && styles.goalButtonSelected
              ]}
              onPress={() => toggleGoal(goal)}
            >
              <Text style={[
                styles.goalButtonText,
                selectedGoals.includes(goal) && styles.goalButtonTextSelected
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customSection}>
          <Text style={styles.label}>Add your own Goals</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter any additional goals..."
            multiline
            numberOfLines={3}
            value={customGoals}
            onChangeText={setCustomGoals}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  goalButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    minWidth: '45%',
    alignItems: 'center',
  },
  goalButtonSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  goalButtonTextSelected: {
    color: '#fff',
  },
  customSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  textArea: {
    backgroundColor: '#D3D3D3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  continueButton: {
    backgroundColor: '#D3D3D3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
