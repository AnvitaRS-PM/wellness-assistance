import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useUser } from '../context/UserContext';

export default function PersonalizationScreen({ navigation }) {
  const { updateUserData } = useUser();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [height, setHeight] = useState('');
  const [daysToAchieve, setDaysToAchieve] = useState('');

  const genderOptions = ['Female', 'Male', 'Transgender', 'Do not prefer to answer'];

  const handleContinue = () => {
    if (!name || !age || !gender || !currentWeight || !goalWeight || !height || !daysToAchieve) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }

    updateUserData({
      name,
      age,
      gender,
      currentWeight,
      goalWeight,
      height,
      daysToAchieve,
      userId: `${name}-${age}-${Date.now()}` // Create unique user ID
    });

    navigation.navigate('Goals');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Tell us about yourself</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gender:</Text>
          <View style={styles.genderContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderButton,
                  gender === option && styles.genderButtonSelected
                ]}
                onPress={() => setGender(option)}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === option && styles.genderButtonTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Weight:</Text>
            <TextInput
              style={styles.input}
              placeholder="kg"
              keyboardType="numeric"
              value={currentWeight}
              onChangeText={setCurrentWeight}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Weight:</Text>
            <TextInput
              style={styles.input}
              placeholder="kg"
              keyboardType="numeric"
              value={goalWeight}
              onChangeText={setGoalWeight}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height:</Text>
            <TextInput
              style={styles.input}
              placeholder="cm"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Days to Achieve your Health Goals:</Text>
          <TextInput
            style={[styles.input, styles.fullWidthInput]}
            placeholder="Enter number of days"
            keyboardType="numeric"
            value={daysToAchieve}
            onChangeText={setDaysToAchieve}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  genderButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#333',
  },
  genderButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  fullWidthInput: {
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#D3D3D3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
