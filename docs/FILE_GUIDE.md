# 📁 Complete File Guide

A comprehensive guide to every file in your Wellness Assistance app.

---

## 📚 Documentation Files

### START_HERE.md
**Purpose**: First file to read - quick overview and setup
**When to read**: Right now! Starting the project
**Contains**: Quick start commands, test flow, troubleshooting

### QUICKSTART.md
**Purpose**: 3-step setup guide
**When to read**: Installing and running the app
**Contains**: Installation steps, platform selection, example test data

### README.md
**Purpose**: Complete documentation
**When to read**: Need detailed information
**Contains**: Full tech stack, setup instructions, API integration details

### PROJECT_SUMMARY.md
**Purpose**: High-level project overview
**When to read**: Understanding the complete project
**Contains**: Structure, features, what works, what's next

### FEATURES.md
**Purpose**: Detailed feature breakdown
**When to read**: Exploring capabilities
**Contains**: All features, technical implementation, future enhancements

### SCREEN_DETAILS.md
**Purpose**: Screen-by-screen implementation guide
**When to read**: Modifying or understanding screens
**Contains**: Wireframe mappings, code snippets, data flow

### FILE_GUIDE.md
**Purpose**: This file - explains every file in the project
**When to read**: Understanding project structure
**Contains**: File descriptions, purposes, relationships

---

## ⚙️ Configuration Files

### package.json
**Purpose**: Project dependencies and scripts
**Key contents**:
```json
{
  "name": "wellness-assistance",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android"
  },
  "dependencies": {
    "react-native": "0.73.6",
    "expo": "~50.0.17",
    "axios": "^1.6.7",
    ...
  }
}
```
**Modify when**: Adding new npm packages
**Don't touch**: Version numbers unless upgrading

### app.json
**Purpose**: Expo configuration
**Key contents**:
```json
{
  "expo": {
    "name": "Wellness Assistance",
    "slug": "wellness-assistance",
    "version": "1.0.0",
    "orientation": "portrait",
    ...
  }
}
```
**Modify when**: Changing app name, icon, splash screen
**Don't touch**: Unless deploying to stores

### babel.config.js
**Purpose**: JavaScript transpilation configuration
**Contents**:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```
**Modify when**: Rarely - only for advanced Babel plugins
**Don't touch**: Works perfectly as-is

### .gitignore
**Purpose**: Files to exclude from version control
**Contains**: node_modules, .env, build files
**Modify when**: Adding new files to ignore
**Important**: Keeps API keys secure

---

## 📱 Main Application Files

### App.js
**Purpose**: Main application entry point
**Location**: Root directory
**What it does**:
- Sets up navigation
- Wraps app with UserProvider (state management)
- Defines all 5 screens and routes
- Configures navigation headers

**Key code**:
```javascript
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Personalization" component={PersonalizationScreen} />
          <Stack.Screen name="Goals" component={GoalsScreen} />
          <Stack.Screen name="Conditions" component={ConditionsScreen} />
          <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
```

**Modify when**: 
- Adding new screens
- Changing navigation structure
- Updating header styles

**Don't modify**: Unless you understand React Navigation

---

## 📱 Screen Files

All located in: `src/screens/`

### WelcomeScreen.js
**Screen**: 01 - Welcome & Authentication
**Purpose**: App entry point, user onboarding
**Size**: ~150 lines
**Key features**:
- 3 social auth buttons (Gmail, iPhone, Facebook)
- Email signup button
- Login link
- Guest user option

**State**: None (stateless)
**Navigation**: All buttons → Personalization screen
**Styling**: Gray buttons, dividers, centered layout

**Modify when**: 
- Integrating real authentication
- Changing button styles
- Adding new auth methods

---

### PersonalizationScreen.js
**Screen**: 02 - User Metrics
**Purpose**: Collect health information
**Size**: ~200 lines
**Key features**:
- Gender selection (4 options)
- Weight inputs (current & goal)
- Height input
- Timeline input
- Form validation

**State**:
```javascript
const [gender, setGender] = useState('');
const [currentWeight, setCurrentWeight] = useState('');
const [goalWeight, setGoalWeight] = useState('');
const [height, setHeight] = useState('');
const [daysToAchieve, setDaysToAchieve] = useState('');
```

**Context usage**: Saves to UserContext on Continue
**Navigation**: Continue → Goals screen
**Validation**: All fields required

**Modify when**:
- Adding new health metrics
- Changing input types
- Updating validation rules

---

### GoalsScreen.js
**Screen**: 03 - Goal Selection
**Purpose**: User selects wellness goals
**Size**: ~180 lines
**Key features**:
- 8 pre-defined goals
- Multi-select capability
- Custom goal input
- Grid layout

**State**:
```javascript
const [selectedGoals, setSelectedGoals] = useState([]);
const [customGoals, setCustomGoals] = useState('');
```

**Context usage**: Saves goals array and custom goals
**Navigation**: Continue → Conditions screen
**Interaction**: Toggle selection on tap

**Modify when**:
- Adding/removing goal options
- Changing layout
- Updating goal categories

---

### ConditionsScreen.js
**Screen**: 04 - Health & Preferences
**Purpose**: Collect health conditions and dietary preferences
**Size**: ~300 lines (most complex screen)
**Key features**:
- Health conditions (multi-select)
- Diet type (single select)
- Food preferences (multi-select)
- Allergies/dislikes (multi-select)
- Multiple custom input fields

**State**:
```javascript
const [selectedConditions, setSelectedConditions] = useState([]);
const [customConditions, setCustomConditions] = useState('');
const [dietType, setDietType] = useState('');
const [selectedFoodPreferences, setSelectedFoodPreferences] = useState([]);
const [customFoodPreferences, setCustomFoodPreferences] = useState('');
const [selectedAllergies, setSelectedAllergies] = useState([]);
const [customAllergies, setCustomAllergies] = useState('');
```

**Context usage**: Saves all health and preference data
**Navigation**: Continue → Recommendations screen
**Complexity**: Highest - manages 7 state variables

**Modify when**:
- Adding new conditions
- Changing diet options
- Adding food categories

---

### RecommendationsScreen.js
**Screen**: 05 - AI Diet Plan
**Purpose**: Display personalized recommendations
**Size**: ~250 lines
**Key features**:
- OpenAI integration
- Loading state
- Error handling with retry
- Structured recommendation display
- Card-based layout

**State**:
```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [recommendations, setRecommendations] = useState(null);
```

**Context usage**: Reads all user data, saves recommendations
**API call**: Triggers on mount via useEffect
**Navigation**: Complete → Welcome screen

**Displays**:
- Diet type
- Number of meals
- Meal schedule
- Recommended foods (list)
- Foods to avoid (list)
- Rationale

**Modify when**:
- Changing recommendation display
- Adding new recommendation types
- Updating AI prompt

---

## 🔧 Service Files

### src/services/openAIService.js
**Purpose**: OpenAI API integration
**Size**: ~100 lines
**Key functions**:

#### generateDietRecommendations(userData)
- Main function called by RecommendationsScreen
- Takes all user data as input
- Returns structured recommendations

#### buildPrompt(userData)
- Creates comprehensive prompt for OpenAI
- Includes all user metrics, goals, conditions
- Formats data for optimal AI response

#### parseRecommendations(content)
- Parses OpenAI response
- Extracts JSON structure
- Handles parsing errors

**API Configuration**:
```javascript
{
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  max_tokens: 1500
}
```

**Modify when**:
- Changing AI model
- Updating prompt structure
- Adding new recommendation types
- Adjusting response format

**Important**: This is where OpenAI magic happens!

---

## 🗂️ Context & State Management

### src/context/UserContext.js
**Purpose**: Global state management
**Size**: ~60 lines
**Pattern**: React Context API

**Provides**:
```javascript
{
  userData: {
    // All user data from all screens
  },
  updateUserData: (newData) => {...},
  resetUserData: () => {...}
}
```

**Used by**: All screens
**Data structure**:
```javascript
{
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
  recommendations: null
}
```

**Modify when**:
- Adding new data fields
- Changing data structure
- Adding new context functions

**Don't modify**: Core structure without updating all screens

---

## ⚙️ Configuration

### src/config/config.js
**Purpose**: API keys and configuration
**Size**: ~10 lines
**Contains**:
```javascript
export const CONFIG = {
  OPENAI_API_KEY: 'sk-proj-...',
  OPENAI_MODEL: 'gpt-3.5-turbo',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions'
};
```

**⚠️ SECURITY WARNING**: 
- API key is hardcoded for demo
- Move to environment variables for production
- Never commit real API keys to GitHub

**Modify when**:
- Updating API key
- Changing AI model
- Adding new API endpoints

---

## 📁 Directory Structure

```
Wellness Assistance/
│
├── 📚 Documentation (7 files)
│   ├── START_HERE.md
│   ├── QUICKSTART.md
│   ├── README.md
│   ├── PROJECT_SUMMARY.md
│   ├── FEATURES.md
│   ├── SCREEN_DETAILS.md
│   └── FILE_GUIDE.md (this file)
│
├── ⚙️ Configuration (4 files)
│   ├── package.json
│   ├── app.json
│   ├── babel.config.js
│   └── .gitignore
│
├── 📱 Main App (1 file)
│   └── App.js
│
└── 📁 src/
    ├── 📱 screens/ (5 files)
    │   ├── WelcomeScreen.js
    │   ├── PersonalizationScreen.js
    │   ├── GoalsScreen.js
    │   ├── ConditionsScreen.js
    │   └── RecommendationsScreen.js
    │
    ├── 🔧 services/ (1 file)
    │   └── openAIService.js
    │
    ├── 🗂️ context/ (1 file)
    │   └── UserContext.js
    │
    └── ⚙️ config/ (1 file)
        └── config.js
```

---

## 🔗 File Relationships

### Data Flow
```
App.js
  ↓ (wraps with)
UserContext.js
  ↓ (provides state to)
All Screens
  ↓ (collect data)
RecommendationsScreen
  ↓ (calls)
openAIService.js
  ↓ (uses)
config.js
```

### Navigation Flow
```
App.js (defines routes)
  ↓
WelcomeScreen → PersonalizationScreen → GoalsScreen → ConditionsScreen → RecommendationsScreen
```

### State Flow
```
UserContext (global state)
  ↑ ↓
All Screens (read/write)
```

---

## 📊 File Size Summary

| File | Lines | Complexity | Purpose |
|------|-------|------------|---------|
| App.js | ~60 | Low | Navigation setup |
| WelcomeScreen.js | ~150 | Low | Auth UI |
| PersonalizationScreen.js | ~200 | Medium | Form inputs |
| GoalsScreen.js | ~180 | Medium | Multi-select |
| ConditionsScreen.js | ~300 | High | Complex form |
| RecommendationsScreen.js | ~250 | High | AI + Display |
| openAIService.js | ~100 | Medium | API integration |
| UserContext.js | ~60 | Low | State management |
| config.js | ~10 | Low | Configuration |

**Total Code**: ~1,310 lines
**Total Documentation**: ~2,000+ lines

---

## 🎯 Quick Reference

### Need to...

**Add a new screen?**
1. Create file in `src/screens/`
2. Add route in `App.js`
3. Update navigation calls

**Change AI behavior?**
1. Edit `src/services/openAIService.js`
2. Modify `buildPrompt()` function

**Add new user data?**
1. Update `src/context/UserContext.js`
2. Add input in relevant screen
3. Update `updateUserData()` call

**Change styling?**
1. Edit `StyleSheet.create()` in screen file
2. Update color values
3. Modify layout properties

**Fix API issues?**
1. Check `src/config/config.js`
2. Verify API key
3. Check internet connection

---

## 🔍 Finding Things

### "Where is the OpenAI API key?"
→ `src/config/config.js`

### "Where are the screen designs?"
→ `src/screens/*.js` (5 files)

### "Where is user data stored?"
→ `src/context/UserContext.js`

### "Where is the AI logic?"
→ `src/services/openAIService.js`

### "Where is navigation defined?"
→ `App.js`

### "How do I add a new screen?"
→ Create in `src/screens/`, add to `App.js`

### "Where are the dependencies?"
→ `package.json`

### "Where is the app configuration?"
→ `app.json`

---

## 📝 Modification Guide

### Safe to Modify
✅ Screen styling (colors, fonts, spacing)
✅ Button text and labels
✅ Goal/condition options
✅ AI prompt in openAIService.js
✅ Documentation files

### Modify with Caution
⚠️ Navigation structure in App.js
⚠️ UserContext data structure
⚠️ OpenAI API calls
⚠️ State management logic

### Don't Modify Unless Necessary
❌ package.json (unless adding packages)
❌ babel.config.js
❌ Core React Native imports
❌ Expo configuration

---

## 🎓 Learning Path

### Beginner
1. Read START_HERE.md
2. Run the app
3. Test all screens
4. Read QUICKSTART.md

### Intermediate
1. Read FEATURES.md
2. Read SCREEN_DETAILS.md
3. Modify screen styling
4. Add new goal options

### Advanced
1. Read this file (FILE_GUIDE.md)
2. Study openAIService.js
3. Modify AI prompts
4. Add new screens
5. Integrate real authentication

---

## 🎉 Summary

**Total Files**: 20
- **Documentation**: 7 files
- **Configuration**: 4 files
- **Code**: 9 files

**Total Lines of Code**: ~1,310
**Total Documentation**: ~2,000+

**Everything is organized, documented, and ready to use!**

---

**Need help with a specific file?** Check the relevant documentation file listed at the top!
