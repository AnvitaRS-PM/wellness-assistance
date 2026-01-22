# Quick Start Guide - Wellness Assistance

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Choose Your Platform
- Press **`i`** for iOS Simulator (Mac only)
- Press **`a`** for Android Emulator
- Scan the QR code with **Expo Go** app on your phone

## 📱 Testing the App Flow

1. **Welcome Screen**
   - Choose any sign-in option (all routes work for demo)
   - Or use "Enter as Guest"

2. **Personalization**
   - Fill in your metrics:
     - Gender: Select one
     - Current Weight: e.g., 70 (kg)
     - Goal Weight: e.g., 65 (kg)
     - Height: e.g., 165 (cm)
     - Days: e.g., 90

3. **Goals**
   - Select multiple goals (e.g., "Lose Weight", "Eat Healthier")
   - Add custom goals if needed

4. **Conditions & Preferences**
   - Select health conditions (or "No Conditions")
   - Choose diet type (Vegetarian, Vegan, etc.)
   - Select food preferences and allergies

5. **AI Recommendations** ✨
   - Wait for OpenAI to generate your personalized plan
   - View your custom diet type, meal schedule, and food recommendations

## 🧪 Example Test Data

For quick testing, use:
- **Gender**: Female
- **Current Weight**: 75 kg
- **Goal Weight**: 65 kg
- **Height**: 160 cm
- **Days**: 90
- **Goals**: Lose Weight, Improve Digestion
- **Conditions**: PCOS
- **Diet**: Vegetarian
- **Preferences**: Eggs, Coffee
- **Allergies**: None

## ⚡ Quick Commands

```bash
# Start dev server
npm start

# Start with cache cleared
expo start -c

# Run on iOS
npm run ios

# Run on Android
npm run android

# View in web browser (limited functionality)
npm run web
```

## 🔧 Troubleshooting

**App won't start?**
```bash
# Clear cache and restart
expo start -c
```

**Dependencies issue?**
```bash
# Remove and reinstall
rm -rf node_modules
npm install
```

**OpenAI not working?**
- Check internet connection
- Verify API key in `src/config/config.js`
- Ensure OpenAI account has credits

## 📂 Project Files

```
Wellness Assistance/
├── App.js                          # Main entry point
├── package.json                    # Dependencies
├── src/
│   ├── screens/                    # All 5 screens
│   ├── services/openAIService.js   # AI integration
│   ├── context/UserContext.js      # State management
│   └── config/config.js            # API configuration
└── README.md                       # Full documentation
```

## 💡 Tips

- All buttons are functional
- Navigation flows sequentially through screens
- User data persists across screens
- OpenAI generates real, personalized recommendations
- You can restart the flow from the Recommendations screen

## 🎯 What's Working

✅ Complete 5-screen flow
✅ User data collection
✅ OpenAI integration
✅ Personalized diet recommendations
✅ Loading states & error handling
✅ Responsive UI

## 📞 Need Help?

Check the main README.md for detailed documentation and troubleshooting.

---

**Ready to start?** Run `npm install` then `npm start`!
