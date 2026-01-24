import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // User Identity
    userId: null,
    name: '',
    dateOfBirth: '',
    age: '',
    
    // Screen 02 - Personalization
    gender: '',
    currentWeight: '',
    goalWeight: '',
    height: '',
    daysToAchieve: '',
    
    // Screen 03 - Goals
    goals: [],
    customGoals: '',
    
    // Screen 04 - Conditions & Preferences
    conditions: [],
    customConditions: '',
    dietType: '',
    foodPreferences: [],
    customFoodPreferences: '',
    allergies: [],
    customAllergies: '',
    
    // Screen 05 - Recommendations
    recommendations: null,
    
    // Screen 06 - Meal Planning
    mealRecommendations: null,
    savedRecipes: [],
    customRecipes: {}, // Stores user-loaded recipes by mealType
    
    // Today's Metrics - Logged Meals
    loggedMeals: [],
    todayDate: new Date().toDateString(),
    
    // Metadata
    lastUpdated: null,
    isDataLoaded: false
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Save data whenever userData changes (except initial load)
  useEffect(() => {
    if (userData.isDataLoaded && userData.name && userData.dateOfBirth) {
      saveUserData();
    }
  }, [userData]);

  // Generate storage key from name and DOB
  const getStorageKey = (name, dob) => {
    if (!name || !dob) return null;
    return `user_${name.toLowerCase().replace(/\s+/g, '_')}_${dob}`;
  };

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => key.startsWith('user_'));
      
      // For now, just mark as loaded. User will authenticate with name + DOB
      setUserData(prev => ({ ...prev, isDataLoaded: true }));
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData(prev => ({ ...prev, isDataLoaded: true }));
    }
  };

  // Check if user exists and load their data
  const checkAndLoadUser = async (name, dob) => {
    try {
      const key = getStorageKey(name, dob);
      if (!key) return null;

      const savedData = await AsyncStorage.getItem(key);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Error checking user:', error);
      return null;
    }
  };

  // Save user data to AsyncStorage
  const saveUserData = async () => {
    try {
      const key = getStorageKey(userData.name, userData.dateOfBirth);
      if (!key) return;

      const dataToSave = {
        ...userData,
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(key, JSON.stringify(dataToSave));
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({ 
      ...prev, 
      ...newData,
      lastUpdated: new Date().toISOString()
    }));
  };

  const loadExistingUser = async (name, dob) => {
    const existingData = await checkAndLoadUser(name, dob);
    if (existingData) {
      setUserData({
        ...existingData,
        isDataLoaded: true
      });
      return true;
    }
    return false;
  };

  const resetUserData = () => {
    setUserData({
      userId: null,
      name: '',
      dateOfBirth: '',
      age: '',
      gender: '',
      currentWeight: '',
      goalWeight: '',
      height: '',
      daysToAchieve: '',
      goals: [],
      customGoals: '',
      conditions: [],
      customConditions: '',
      dietType: '',
      foodPreferences: [],
      customFoodPreferences: '',
      allergies: [],
      customAllergies: '',
      recommendations: null,
      mealRecommendations: null,
      savedRecipes: [],
      customRecipes: {},
      loggedMeals: [],
      todayDate: new Date().toDateString(),
      lastUpdated: null,
      isDataLoaded: true
    });
  };

  // Helper function to add a logged meal
  const logMeal = (mealData) => {
    const logEntry = {
      date: new Date().toDateString(),
      timestamp: new Date().toISOString(),
      ...mealData
    };
    setUserData(prev => ({
      ...prev,
      loggedMeals: [...prev.loggedMeals, logEntry]
    }));
  };

  // Helper function to save a recipe
  const saveRecipe = (recipe) => {
    setUserData(prev => {
      const exists = prev.savedRecipes.some(r => r.name === recipe.name && r.mealType === recipe.mealType);
      if (exists) {
        return prev;
      }
      
      let newState = {
        ...prev,
        savedRecipes: [...prev.savedRecipes, recipe]
      };
      
      // If it's a custom recipe, also add it to customRecipes by mealType
      if (recipe.isCustom) {
        const mealType = recipe.mealType;
        const existingCustom = prev.customRecipes[mealType] || [];
        const customExists = existingCustom.some(r => r.name === recipe.name);
        
        if (!customExists) {
          newState.customRecipes = {
            ...prev.customRecipes,
            [mealType]: [...existingCustom, recipe]
          };
        }
      }
      
      return newState;
    });
  };

  // Helper function to unsave a recipe
  const unsaveRecipe = (recipeName, mealType) => {
    setUserData(prev => ({
      ...prev,
      savedRecipes: prev.savedRecipes.filter(r => !(r.name === recipeName && r.mealType === mealType))
    }));
  };

  // Helper function to check if recipe is saved
  const isRecipeSaved = (recipeName, mealType) => {
    return userData.savedRecipes.some(r => r.name === recipeName && r.mealType === mealType);
  };

  // Helper function to get today's logged meals
  const getTodaysMeals = () => {
    const today = new Date().toDateString();
    return userData.loggedMeals.filter(meal => meal.date === today);
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      updateUserData, 
      resetUserData,
      logMeal,
      saveRecipe,
      unsaveRecipe,
      isRecipeSaved,
      getTodaysMeals,
      checkAndLoadUser,
      loadExistingUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
