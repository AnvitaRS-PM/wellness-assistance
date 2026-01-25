# Wellness Assistance

An AI-powered health and wellness mobile app built with React Native that delivers personalized meal recommendations, healthier recipe swaps, and daily nutrition tracking based on individual goals and health conditions.

## Features

- **User Onboarding**: Multiple authentication options (Gmail, iPhone, Facebook, Email, Guest)
- **Personalization**: Collect user health metrics (weight, height, goals, timeline)
- **Goal Setting**: Multi-select wellness goals with custom goal options
- **Health Assessment**: Track conditions, dietary preferences, food preferences, and allergies
- **AI-Powered Recommendations**: Personalized diet plans using OpenAI GPT-3.5

## Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation v6
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Structure

```
wellness-assistance/
├── App.js                      # Main app entry with navigation
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── src/
│   ├── config/
│   │   └── config.js          # API keys and configuration
│   ├── context/
│   │   └── UserContext.js     # Global user state management
│   ├── services/
│   │   └── openAIService.js   # OpenAI API integration
│   └── screens/
│       ├── WelcomeScreen.js           # Screen 01: Authentication
│       ├── PersonalizationScreen.js   # Screen 02: User metrics
│       ├── GoalsScreen.js             # Screen 03: Goal selection
│       ├── ConditionsScreen.js        # Screen 04: Health & preferences
│       └── RecommendationsScreen.js   # Screen 05: AI recommendations
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure OpenAI API Key** (Already configured in `src/config/config.js`):
   - The API key is already set up
   - For production, move this to environment variables

3. **Start the development server**:
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/emulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Screen Flow

1. **Welcome Screen**: User selects authentication method (Gmail, iPhone, Facebook, Email, or Guest)
2. **Personalization Screen**: Enter gender, weight, height, and goal timeline
3. **Goals Screen**: Select health goals (weight loss, better skin, muscle gain, etc.)
4. **Conditions & Preferences Screen**: 
   - Select health conditions (PCOS, diabetes, thyroid, etc.)
   - Choose diet type (vegetarian, vegan, pescatarian, etc.)
   - Specify food preferences and allergies
5. **Recommendations Screen**: View AI-generated personalized diet plan
6. **Meal Planning Screen**: Browse and select meals based on recommendations (Breakfast, Lunch, Dinner, Snacks)
7. **Recipe & Nutrients Screen**: View detailed recipe information with ingredients, instructions, and complete nutritional breakdown
8. **Log Meal Confirmation**: Confirm meal logging to daily intake tracker
9. **Saved Recipe Screen**: Access all your saved recipes in one place
10. **Swap Ingredients Screen**: Get AI-powered healthier ingredient alternatives with nutritional comparisons
11. **Load Recipe Screen**: Add custom recipes with ingredients (with quantity counters), instructions, and auto-calculated nutrition
12. **Today's Metrics Screen**: Track daily calorie, protein, carb, fat, and fiber intake with visual progress
13. **Groceries Screen**: View and manage auto-generated shopping list from saved recipes with manual item addition

## Screenshots

### 01. Welcome Screen

**Mockup Screen:**
![Welcome Screen](./screenshots/01_welcome_screen.png)

**App Screen:**
![Welcome Screen Demo](./demos/01_welcome_screen.gif)

*Authentication options including Gmail, iPhone, Facebook, Email, and Guest mode*

---

### 02. Personalization Screen

**Mockup Screen:**
![Personalization Screen](./screenshots/02_personalization_screen.png)

**App Screen:**
![Personalization Screen Demo](./demos/02_personalization_screen.gif)

*Enter your gender, weight, height, and goal timeline for personalized recommendations*

---

### 03. Goals Screen

**Mockup Screen:**
![Goals Screen](./screenshots/03_goals_screen.png)

**App Screen:**
![Goals Screen Demo](./demos/03_goals_screen.gif)

*Select multiple wellness goals like weight loss, better skin, and more*

---

### 04. Conditions & Preferences Screen

**Mockup Screen:**
![Conditions Screen](./screenshots/04_conditions_screen.png)

**App Screen:**
![Conditions Screen Demo](./demos/04_conditions_screen.gif)

*Define your health conditions, diet type, food preferences, and allergies*

---

### 05. AI Recommendations Screen

**Mockup Screen:**
![Recommendations Screen](./screenshots/05_recommendations_screen.png)

**App Screen:**
![Recommendations Screen Demo](./demos/05_diet_recommendation_screen.gif)

*Get personalized diet plans powered by OpenAI based on your profile*

---

### 06. Meal Planning Screen

**Mockup Screen:**
![Meal Planning Screen](./screenshots/06_meal_planning_screen.png)

**App Screen:**
![Meal Planning Screen Demo](./demos/06_meal_planning_screen.gif)

*Browse breakfast, lunch, dinner, and snack options tailored to your diet*

---

### 07. Recipe & Nutrients Screen

**Mockup Screen:**
![Recipe & Nutrients Screen](./screenshots/07_recipe_nutrients_screen.png)

**App Screen:**
![Recipe & Nutrients Screen Demo](./demos/07_recipe_nutrients_screen.gif)

*View detailed recipes with ingredients, instructions, and complete nutritional breakdown*

---

### 08. Log Meal Confirmation

**Mockup Screen:**
![Log Meal Confirmation](./screenshots/08_log_meal_confirmation.png)

**App Screen:**
![Log Meal Confirmation Demo](./demos/08_log_meal_confirmation_screen.gif)

*Confirmation screen when successfully logging a meal to your daily intake*

---

### 09. Saved Recipe Screen

**Mockup Screen:**
![Saved Recipe Screen](./screenshots/09_saved_recipe_screen.png)

**App Screen:**
![Saved Recipe Screen Demo](./demos/09_saved_recipe_screen.gif)

*Access all your saved recipes in one place for easy meal logging*

---

### 10. Swap Ingredients Screen

**Mockup Screen:**
![Swap Ingredients Screen](./screenshots/10_swap_ingredients_screen.png)

**App Screen:**
![Swap Ingredients Screen Demo](./demos/10_swap_ingredients_screen.gif)

*Get AI-powered healthier ingredient alternatives with nutritional comparisons*

---

### 11. Load Recipe Screen

**Mockup Screen:**
![Load Recipe Screen](./screenshots/11_load_recipe_screen.png)

**App Screen:**
![Load Recipe Screen Demo](./demos/11_load_recipe_screen.gif)

*Create and add your own custom recipes with ingredients, quantities, and instructions*

---

### 12. Today's Metrics Screen

**Mockup Screen:**
![Today's Metrics Screen](./screenshots/12_todays_metrics_screen.png)

**App Screen:**
![Today's Metrics Screen Demo](./demos/12_todays_metrics_screen.gif)

*Track your daily calorie, protein, carb, fat, and fiber intake with visual progress*

---

### 13. Groceries Screen

**Mockup Screen:**
![Groceries Screen](./screenshots/13_groceries_screen.png)

**App Screen:**
![Groceries Screen Demo](./demos/13_groceries_screen.gif)

*Smart shopping list auto-generated from saved recipes with manual item addition*

## OpenAI Integration

The app uses OpenAI's GPT-3.5-turbo model to generate personalized diet recommendations based on:
- User health metrics (weight, height, BMI goals)
- Health conditions (PCOS, diabetes, thyroid, etc.)
- Dietary preferences (vegetarian, vegan, pescatarian, etc.)
- Food preferences and allergies
- Timeline to achieve goals

The AI provides:
- Recommended diet type (LCHF, Mediterranean, etc.)
- Meal frequency and timing
- Meal schedule suggestions
- Recommended foods for healing
- Foods to avoid
- Rationale for the recommendations

## Development Notes

### Current Features
- ✅ Complete UI for all 5 screens
- ✅ Navigation between screens
- ✅ User data collection and state management
- ✅ OpenAI API integration for diet recommendations
- ✅ Loading states and error handling

### Future Enhancements
- [ ] Actual authentication implementation (Firebase/Auth0)
- [ ] Database integration for saving user profiles
- [ ] Meal planning screen with calendar
- [ ] Food logging and nutrition tracking
- [ ] Recipe recommendations
- [ ] Progress tracking and analytics
- [ ] Push notifications for meal reminders

## API Key Security

⚠️ **Important**: The OpenAI API key is currently hardcoded in `src/config/config.js` for development purposes. For production:

1. Use environment variables
2. Store API key securely on backend
3. Make API calls through your backend server
4. Never commit API keys to version control

## Troubleshooting

### Common Issues

1. **Expo not starting**: 
   - Clear cache: `expo start -c`
   
2. **OpenAI API errors**:
   - Verify API key is valid
   - Check internet connection
   - Ensure API key has sufficient credits

3. **Navigation errors**:
   - Ensure all dependencies are installed
   - Try: `npm install --legacy-peer-deps`

## Support

For issues or questions, please check:
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## License

This project is for educational and demonstration purposes.
