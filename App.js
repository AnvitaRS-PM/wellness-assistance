import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import CalmTheme from './src/styles/CalmTheme';

// Import performance configuration (disables console logs in production)
import './src/config/performance';

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
import TodaysMetricsScreen from './src/screens/TodaysMetricsScreen';
import GroceriesScreen from './src/screens/GroceriesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: CalmTheme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerTitle: '', // Remove screen name from header
            headerBackTitleVisible: false, // Remove back button title
            headerShadowVisible: false, // Remove header shadow for cleaner look
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ 
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="Personalization" 
            component={PersonalizationScreen}
          />
          <Stack.Screen 
            name="Goals" 
            component={GoalsScreen}
          />
          <Stack.Screen 
            name="Conditions" 
            component={ConditionsScreen}
          />
          <Stack.Screen 
            name="Recommendations" 
            component={RecommendationsScreen}
          />
          <Stack.Screen 
            name="MealRecommendations" 
            component={MealRecommendationsScreen}
          />
          <Stack.Screen 
            name="RecipeDetail" 
            component={RecipeDetailScreen}
          />
          <Stack.Screen 
            name="LoadRecipe" 
            component={LoadRecipeScreen}
          />
          <Stack.Screen 
            name="SwapIngredients" 
            component={SwapIngredientsScreen}
          />
          <Stack.Screen 
            name="LogMealConfirmation" 
            component={LogMealConfirmationScreen}
            options={{ 
              presentation: 'transparentModal',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="TodaysMetrics" 
            component={TodaysMetricsScreen}
          />
          <Stack.Screen 
            name="Groceries" 
            component={GroceriesScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
