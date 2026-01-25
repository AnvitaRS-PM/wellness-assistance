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
  // DISABLED AUTO-SAVE - Only save on explicit action
  // This was causing massive performance issues
  /*
  useEffect(() => {
    if (userData.isDataLoaded && userData.name && userData.dateOfBirth) {
      const timeoutId = setTimeout(() => {
        saveUserData();
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [userData]);
  */

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
      // Silent fail
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
      // Silent fail
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
      // Silent success
    } catch (error) {
      // Silent fail
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({ 
      ...prev, 
      ...newData,
      lastUpdated: new Date().toISOString()
    }));
    // Save after updating - with small delay to batch multiple updates
    setTimeout(() => {
      saveUserData();
    }, 500);
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
      loggedMeals: [...prev.loggedMeals, logEntry],
      lastUpdated: new Date().toISOString()
    }));
    // Save after logging meal
    setTimeout(() => {
      saveUserData();
    }, 500);
  };

  // Helper function to save a recipe
  const saveRecipe = (recipe) => {
    setUserData(prev => {
      // If this is a modified recipe that replaces an original, remove the original first
      let savedRecipes = prev.savedRecipes;
      if (recipe.isModified && recipe.originalRecipeName) {
        savedRecipes = savedRecipes.filter(r => 
          !(r.name === recipe.originalRecipeName && r.mealType === recipe.mealType)
        );
      }
      
      // Check if this exact recipe already exists
      const exists = savedRecipes.some(r => r.name === recipe.name && r.mealType === recipe.mealType);
      if (exists) {
        // Update existing recipe instead of adding duplicate
        savedRecipes = savedRecipes.map(r => 
          r.name === recipe.name && r.mealType === recipe.mealType ? recipe : r
        );
      } else {
        // Add new recipe
        savedRecipes = [...savedRecipes, recipe];
      }
      
      let newState = {
        ...prev,
        savedRecipes,
        lastUpdated: new Date().toISOString()
      };
      
      // If it's a custom recipe, also add it to customRecipes by mealType
      if (recipe.isCustom || recipe.isModified) {
        const mealType = recipe.mealType;
        const existingCustom = prev.customRecipes[mealType] || [];
        
        // Remove original if this replaces it
        let filteredCustom = existingCustom;
        if (recipe.isModified && recipe.originalRecipeName) {
          filteredCustom = existingCustom.filter(r => r.name !== recipe.originalRecipeName);
        }
        
        // Check if this recipe already exists in custom
        const customExists = filteredCustom.some(r => r.name === recipe.name);
        if (!customExists) {
          newState.customRecipes = {
            ...prev.customRecipes,
            [mealType]: [...filteredCustom, recipe]
          };
        }
      }
      
      return newState;
    });
    // Save after adding recipe
    setTimeout(() => {
      saveUserData();
    }, 500);
  };

  // Helper function to unsave a recipe
  const unsaveRecipe = (recipeName, mealType) => {
    setUserData(prev => ({
      ...prev,
      savedRecipes: prev.savedRecipes.filter(r => !(r.name === recipeName && r.mealType === mealType)),
      lastUpdated: new Date().toISOString()
    }));
    // Save after removing recipe
    setTimeout(() => {
      saveUserData();
    }, 500);
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
