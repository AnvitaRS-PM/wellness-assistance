import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../context/UserContext';

export default function PersonalizationScreen({ navigation }) {
  const { updateUserData, checkAndLoadUser, loadExistingUser, userData } = useUser();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [height, setHeight] = useState('');
  const [daysToAchieve, setDaysToAchieve] = useState('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const genderOptions = ['Female', 'Male', 'Transgender', 'Do not prefer to answer'];

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    return calculatedAge;
  };

  // Check for existing user when name and DOB are both set
  useEffect(() => {
    const checkUser = async () => {
      if (name && dateOfBirth && !isCheckingUser) {
        setIsCheckingUser(true);
        const dobString = dateOfBirth.toISOString().split('T')[0];
        const existingData = await checkAndLoadUser(name, dobString);
        
        if (existingData) {
          // User exists! Pre-fill all data
          Alert.alert(
            'Welcome Back!',
            `We found your previous data for ${name}. Loading your information...`,
            [
              {
                text: 'Start Fresh',
                style: 'cancel',
                onPress: () => {
                  setIsCheckingUser(false);
                }
              },
              {
                text: 'Load My Data',
                onPress: async () => {
                  await loadExistingUser(name, dobString);
                  // Navigate directly to appropriate screen based on data completeness
                  if (existingData.recommendations) {
                    navigation.navigate('MealRecommendations');
                  } else if (existingData.goals && existingData.goals.length > 0) {
                    navigation.navigate('Conditions');
                  } else {
                    navigation.navigate('Goals');
                  }
                  setIsCheckingUser(false);
                }
              }
            ]
          );
        } else {
          setIsCheckingUser(false);
        }
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkUser, 1000);
    return () => clearTimeout(timeoutId);
  }, [name, dateOfBirth]);

  // Update age when DOB changes
  useEffect(() => {
    const calculatedAge = calculateAge(dateOfBirth);
    setAge(calculatedAge.toString());
  }, [dateOfBirth]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleContinue = () => {
    if (!name || !gender || !currentWeight || !goalWeight || !height || !daysToAchieve) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }

    const calculatedAge = calculateAge(dateOfBirth);
    const dobString = dateOfBirth.toISOString().split('T')[0];

    updateUserData({
      name,
      dateOfBirth: dobString,
      age: calculatedAge.toString(),
      gender,
      currentWeight,
      goalWeight,
      height,
      daysToAchieve,
      userId: `${name}-${dobString}` // Create unique user ID from name + DOB
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
          <Text style={styles.label}>Date of Birth:</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(dateOfBirth)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Age: (Calculated automatically)</Text>
          <View style={styles.ageDisplay}>
            <Text style={styles.ageText}>{age} years old</Text>
          </View>
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
        </View>

        <View style={styles.inputRow}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Days to Achieve:</Text>
            <TextInput
              style={styles.input}
              placeholder="days"
              keyboardType="numeric"
              value={daysToAchieve}
              onChangeText={setDaysToAchieve}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            💡 Your data is saved locally and will be available next time you visit with the same name and date of birth
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
  dateButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  ageDisplay: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  ageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
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
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
