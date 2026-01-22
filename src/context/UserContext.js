import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
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
    savedRecipes: {},
    dailyPlan: []
  });

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const resetUserData = () => {
    setUserData({
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
      savedRecipes: {},
      dailyPlan: []
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, resetUserData }}>
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
