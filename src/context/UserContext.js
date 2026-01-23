import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // User Identity
    userId: null,
    name: '',
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
    savedRecipes: [], // Array of saved recipe objects with full details
    
    // Today's Metrics - Logged Meals
    loggedMeals: [], // Array of {date, recipeName, mealType, calories, nutrients, prepTime}
    todayDate: new Date().toDateString()
  });

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const resetUserData = () => {
    setUserData({
      userId: null,
      name: '',
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
      loggedMeals: [],
      todayDate: new Date().toDateString()
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
      // Check if recipe already saved
      const exists = prev.savedRecipes.some(r => r.name === recipe.name && r.mealType === recipe.mealType);
      if (exists) {
        return prev; // Already saved
      }
      return {
        ...prev,
        savedRecipes: [...prev.savedRecipes, recipe]
      };
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
      getTodaysMeals
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
