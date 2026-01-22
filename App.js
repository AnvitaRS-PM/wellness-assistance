import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import PersonalizationScreen from './src/screens/PersonalizationScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import ConditionsScreen from './src/screens/ConditionsScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';
import MealRecommendationsScreen from './src/screens/MealRecommendationsScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import LoadRecipeScreen from './src/screens/LoadRecipeScreen';
import SwapIngredientsScreen from './src/screens/SwapIngredientsScreen';
import LogMealConfirmationScreen from './src/screens/LogMealConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ 
              title: 'Wellness Assistance',
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="Personalization" 
            component={PersonalizationScreen}
            options={{ 
              title: 'Personalization',
            }}
          />
          <Stack.Screen 
            name="Goals" 
            component={GoalsScreen}
            options={{ 
              title: 'Your Goals',
            }}
          />
          <Stack.Screen 
            name="Conditions" 
            component={ConditionsScreen}
            options={{ 
              title: 'Health & Preferences',
            }}
          />
          <Stack.Screen 
            name="Recommendations" 
            component={RecommendationsScreen}
            options={{ 
              title: 'Your Diet Plan',
            }}
          />
          <Stack.Screen 
            name="MealRecommendations" 
            component={MealRecommendationsScreen}
            options={{ 
              title: 'Meal Planning',
            }}
          />
          <Stack.Screen 
            name="RecipeDetail" 
            component={RecipeDetailScreen}
            options={{ 
              title: 'Recipe & Nutrients',
            }}
          />
          <Stack.Screen 
            name="LoadRecipe" 
            component={LoadRecipeScreen}
            options={{ 
              title: 'Load Recipe',
            }}
          />
          <Stack.Screen 
            name="SwapIngredients" 
            component={SwapIngredientsScreen}
            options={{ 
              title: 'Swap Ingredients',
            }}
          />
          <Stack.Screen 
            name="LogMealConfirmation" 
            component={LogMealConfirmationScreen}
            options={{ 
              title: 'Meal Logged',
              presentation: 'transparentModal',
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
