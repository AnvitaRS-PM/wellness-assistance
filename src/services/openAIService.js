import axios from 'axios';
import { CONFIG } from '../config/config';

export const openAIService = {
  // Generate personalized diet recommendations based on user data
  async generateDietRecommendations(userData) {
    try {
      const prompt = this.buildPrompt(userData);
      
      const response = await axios.post(
        CONFIG.OPENAI_API_URL,
        {
          model: CONFIG.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert clinical nutritionist and medical diet specialist with deep knowledge of therapeutic diets for various health conditions (PCOS, diabetes, thyroid disorders, digestive issues, etc.). Your recommendations should be evidence-based, medically sound, and prioritize healing and disease management over personal preferences. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return this.parseRecommendations(content);
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate recommendations. Please try again.');
    }
  },

  buildPrompt(userData) {
    const {
      name,
      age,
      gender,
      currentWeight,
      goalWeight,
      height,
      daysToAchieve,
      goals,
      customGoals,
      conditions,
      customConditions,
      dietType,
      foodPreferences,
      customFoodPreferences,
      allergies,
      customAllergies
    } = userData;

    // Parse comma-separated custom inputs properly
    const parseCustomInput = (input) => {
      if (!input) return [];
      return input.split(',').map(item => item.trim()).filter(item => item.length > 0);
    };

    const customGoalsList = parseCustomInput(customGoals);
    const customConditionsList = parseCustomInput(customConditions);
    const customPreferencesList = parseCustomInput(customFoodPreferences);
    const customAllergiesList = parseCustomInput(customAllergies);

    const allGoals = [...goals, ...customGoalsList].join(', ');
    const allConditions = [...conditions, ...customConditionsList].join(', ');
    const allPreferences = [...foodPreferences, ...customPreferencesList].join(', ');
    const allAllergies = [...allergies, ...customAllergiesList].join(', ');

    return `Create a personalized diet plan for a person with the following profile:

Name: ${name || 'User'}
Age: ${age || 'Not specified'}
Gender: ${gender || 'Not specified'}
Current Weight: ${currentWeight} kg
Goal Weight: ${goalWeight} kg
Height: ${height} cm
Days to Achieve Goal: ${daysToAchieve} days
Goals: ${allGoals}
Health Conditions: ${allConditions || 'None'}
Diet Preference: ${dietType || 'No preference'}
Food Preferences: ${allPreferences || 'None specified'}
Allergies/Dislikes: ${allAllergies || 'None'}

IMPORTANT INSTRUCTIONS:

1. DIET FRAMEWORK: Recommend a specific diet framework based on their health conditions and goals. Choose from:
   - LCHF (Low Carb High Fat)
   - Keto (Ketogenic Diet)
   - Zero Carb
   - Low Fat
   - Zero Fat
   - Mediterranean Diet
   - Intermittent Fasting
   - Juice Diet
   - Plant-Based
   - Whole30
   - Paleo
   - Anti-Inflammatory Diet
   - Or suggest "Normal diet with modifications" if no specific framework is needed
   
   Base your recommendation PRIMARILY on their health conditions and goals, not just preferences.

2. MEAL SCHEDULE: Only suggest meal TYPES and TIMING. DO NOT suggest specific foods or dishes here.
   Example: "Breakfast at 8 AM, Mid-morning snack at 10:30 AM, Lunch at 1 PM, Evening snack at 4 PM, Dinner at 7 PM"
   Do NOT say things like "Breakfast: Eggs and toast" - just say "Breakfast"

3. RECOMMENDED FOODS: Focus on HEALING and THERAPEUTIC foods based on their health conditions.
   - Prioritize foods that help manage/improve their specific conditions (PCOS, diabetes, thyroid, etc.)
   - These should be foods medically beneficial for their conditions
   - CRITICAL: Do NOT recommend ANY items listed in their Allergies/Dislikes section: ${allAllergies || 'None'}
   - Exclude ALL foods from their Allergies/Dislikes list completely
   - Consider their age and gender for age-appropriate nutritional needs
   - Do NOT just recommend foods they prefer - recommend what's BEST for their health
   - Include at least 8-10 specific food items
   - IMPORTANT: Carefully check each recommended food against the Allergies/Dislikes list before including it

4. FOODS TO AVOID: List foods that are HARMFUL or COUNTERPRODUCTIVE for their health conditions and goals.
   - Base this on their medical conditions and health goals
   - Do NOT base this on their dislikes or preferences
   - Focus on foods that worsen their conditions or hinder goal achievement
   - Include at least 5-7 specific food items

Please provide a JSON response with the following structure:
{
  "dietType": "Specific diet framework name (e.g., 'LCHF (Low Carb High Fat)', 'Keto', 'Anti-Inflammatory Diet', etc.)",
  "numberOfMeals": "Number of meals per day with portion control guidance",
  "mealSchedule": "Only meal types and timing - e.g., 'Breakfast (8 AM), Mid-morning snack (10:30 AM), Lunch (1 PM), Evening snack (4 PM), Dinner (7 PM)'",
  "recommendedFoods": ["healing food 1", "healing food 2", "healing food 3", "healing food 4", "healing food 5", "healing food 6", "healing food 7", "healing food 8"],
  "foodsToAvoid": ["harmful food 1", "harmful food 2", "harmful food 3", "harmful food 4", "harmful food 5"],
  "rationale": "Brief explanation of why this diet framework and these specific foods will help their conditions and achieve their goals"
}

Remember: Prioritize HEALTH and HEALING over preferences. Be medically sound and evidence-based.`;
  },

  parseRecommendations(content) {
    try {
      // Try to parse as JSON first
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // VALIDATION: Ensure numberOfMeals matches mealSchedule
        if (parsed.mealSchedule) {
          const extractedTypes = this.extractMealTypes(parsed.mealSchedule);
          const actualCount = extractedTypes.length;
          
          console.log('📊 Diet Recommendation Validation:');
          console.log('   Meal Schedule:', parsed.mealSchedule);
          console.log('   Extracted meal types:', extractedTypes);
          console.log('   Actual count:', actualCount);
          console.log('   Reported numberOfMeals:', parsed.numberOfMeals);
          
          // Update numberOfMeals to match actual meal types
          parsed.numberOfMeals = `${actualCount} meal${actualCount !== 1 ? 's' : ''}`;
          
          if (actualCount !== extractedTypes.length) {
            console.warn('⚠️ Corrected numberOfMeals to match mealSchedule');
          }
        }
        
        return parsed;
      }
      
      // If not JSON, return a structured fallback with ONLY 3 meals (not 5+)
      console.warn('⚠️ Using fallback diet recommendations (API failed or returned invalid JSON)');
      return {
        dietType: 'Balanced Diet',
        numberOfMeals: '3 meals',
        mealSchedule: 'Breakfast (8 AM), Lunch (1 PM), Dinner (7 PM)',
        recommendedFoods: ['Lean proteins', 'Whole grains', 'Fresh vegetables', 'Fruits', 'Nuts', 'Legumes', 'Healthy fats', 'Low-fat dairy'],
        foodsToAvoid: ['Processed foods', 'Added sugar', 'Excessive salt', 'Trans fats', 'Refined carbs'],
        rationale: 'A balanced diet with 3 main meals focusing on whole foods, lean proteins, and plenty of vegetables for optimal health and nutrition.'
      };
    } catch (error) {
      console.error('Parse error:', error);
      throw new Error('Failed to parse recommendations');
    }
  },

  // Generate meal recommendations based on diet plan
  async generateMealRecommendations(userData) {
    // ALWAYS use fallback for consistency and to avoid API costs during development
    // The fallback is now smart enough to match the exact meal types
    console.log('Generating meal recommendations...');
    console.log('User has recommendations:', !!userData.recommendations);
    
    if (userData.recommendations && userData.recommendations.mealSchedule) {
      console.log('Using meal schedule:', userData.recommendations.mealSchedule);
      console.log('Number of meals:', userData.recommendations.numberOfMeals);
    }
    
    // Use fallback which now correctly filters by meal types
    return this.getFallbackMealRecommendations(userData);
    
    /* ORIGINAL AI CODE - COMMENTED OUT FOR RELIABILITY
    try {
      const prompt = this.buildMealRecommendationsPrompt(userData);
      
      const response = await axios.post(
        CONFIG.OPENAI_API_URL,
        {
          model: CONFIG.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert chef and nutritionist specializing in creating healthy, therapeutic recipes. Generate meal recommendations that align with specific diet plans and health conditions. CRITICAL: Always respond with COMPLETE and valid JSON format. Ensure all JSON objects are properly closed.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const parsedRecommendations = this.parseMealRecommendations(content);
      
      // If parsing failed, use fallback with correct meal types
      if (!parsedRecommendations) {
        console.log('Using fallback recommendations with meal types from diet plan');
        return this.getFallbackMealRecommendations(userData);
      }
      
      return parsedRecommendations;
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      // Use fallback on error
      return this.getFallbackMealRecommendations(userData);
    }
    */
  },

  buildMealRecommendationsPrompt(userData) {
    const { recommendations, dietType, conditions, allergies, customAllergies, foodPreferences, customFoodPreferences, goals, customGoals } = userData;
    
    // Parse comma-separated custom inputs
    const parseCustomInput = (input) => {
      if (!input) return [];
      return input.split(',').map(item => item.trim()).filter(item => item.length > 0);
    };

    const customAllergiesList = parseCustomInput(customAllergies);
    const customConditionsList = parseCustomInput(userData.customConditions);
    const customGoalsList = parseCustomInput(customGoals);
    const customPreferencesList = parseCustomInput(customFoodPreferences);

    const allAllergies = [...(allergies || []), ...customAllergiesList].join(', ');
    const allConditions = [...(conditions || []), ...customConditionsList].join(', ');
    const allGoals = [...(goals || []), ...customGoalsList].join(', ');
    const allPreferences = [...(foodPreferences || []), ...customPreferencesList].join(', ');

    // Parse meal schedule to identify meal types - extract just the meal names
    const mealSchedule = recommendations?.mealSchedule || 'Breakfast, Lunch, Dinner';
    
    // Extract meal types from schedule (remove times and parentheses)
    const mealTypes = this.extractMealTypes(mealSchedule);
    console.log('Extracted meal types from schedule:', mealTypes);
    console.log('Original meal schedule:', mealSchedule);
    
    return `Generate a daily meal plan with specific recipe recommendations.

User Profile:
- Goals: ${allGoals || 'General wellness'}
- Health Conditions: ${allConditions || 'None'}
- Diet Framework: ${recommendations?.dietType || dietType || 'Balanced Diet'}
- Number of Meals: ${recommendations?.numberOfMeals || '3 meals + snacks'}
- Meal Schedule: ${mealSchedule}
- Recommended Healing Foods: ${recommendations?.recommendedFoods?.join(', ') || 'Healthy whole foods'}
- Foods to Avoid: ${recommendations?.foodsToAvoid?.join(', ') || 'Processed foods'}
- Allergies/Dislikes: ${allAllergies || 'None'}
- Food Preferences: ${allPreferences || 'No specific preferences'}
- Diet Type: ${dietType || 'No preference'}

CRITICAL INSTRUCTIONS FOR JSON FORMAT:
- You MUST return COMPLETE and valid JSON
- Ensure ALL brackets and braces are properly closed
- Do NOT truncate the response
- If you run out of space, prioritize completing the JSON structure

MEAL TYPES TO GENERATE (USE THESE EXACT NAMES AS JSON KEYS):
Meal types from schedule: ${mealTypes.join(', ')}
Generate exactly 7 recipe options for EACH of these meal types.
IMPORTANT: Use these EXACT meal type names as your JSON keys (case-sensitive).

RECIPE REQUIREMENTS:
1. Each recipe must:
   - Align with the diet framework (${recommendations?.dietType || 'Balanced Diet'})
   - Use THERAPEUTIC foods from the "Recommended Healing Foods" list
   - Help achieve their goals: ${allGoals}
   - Help manage their conditions: ${allConditions}
   - Avoid ALL foods in the "Foods to Avoid" list
   - Avoid ALL allergies/dislikes
   - Be practical and easy to prepare
   - Include realistic meal prep time (e.g., "10-15 mins", "20-25 mins", "30-40 mins")
   - Include complete nutrition information

2. INGREDIENTS - BE DETAILED:
   - List 4-6 ingredients (keep concise for token limits)
   - Include EXACT quantities (e.g., "2 large eggs", "150g salmon fillet")
   - Specify types clearly (e.g., "1 cup fresh baby spinach", "150g wild-caught salmon")
   - Detail spices (e.g., "1 tsp ground turmeric", "2 cloves fresh garlic, minced")
   - Mention cooking oils (e.g., "1 tbsp extra virgin olive oil")
   
3. INSTRUCTIONS - BE DETAILED:
   - Provide 4-5 detailed steps (keep concise for token limits)
   - Include cooking temperatures (e.g., "Heat pan to medium-high heat, 375°F")
   - Specify cooking times (e.g., "Cook for 3-4 minutes until golden")
   - Describe techniques (e.g., "Sauté garlic until fragrant, about 30 seconds")
   - Include serving instructions
   
4. NUTRIENTS - Complete nutritional profile:
   - MUST include: Protein, Carbs, Fat, Fiber
   - MUST include: Vitamin A, Vitamin C, Vitamin D
   - MUST include: Zinc, Magnesium, Iron, Calcium
   - Add others if relevant: Potassium, Folate, B12

JSON STRUCTURE (MUST BE COMPLETE - NO TRUNCATION):
{
${mealTypes.map((type, idx) => `  "${type}": [
    {
      "name": "Recipe name",
      "calories": 350,
      "prepTime": "15-20 mins",
      "ingredients": ["ingredient 1", "ingredient 2", "..."],
      "nutrients": [
        {"name": "Protein", "value": "20g"},
        {"name": "Carbs", "value": "25g"},
        {"name": "Fat", "value": "18g"},
        {"name": "Fiber", "value": "8g"},
        {"name": "Vitamin A", "value": "150mcg"},
        {"name": "Vitamin C", "value": "12mg"},
        {"name": "Vitamin D", "value": "3mcg"},
        {"name": "Zinc", "value": "2mg"},
        {"name": "Magnesium", "value": "50mg"},
        {"name": "Iron", "value": "3mg"},
        {"name": "Calcium", "value": "80mg"}
      ],
      "instructions": ["step 1", "step 2", "step 3", "step 4"]
    }
    /* 6 more recipes - total 7 recipes per meal type */
  ]${idx < mealTypes.length - 1 ? ',' : ''}`).join('\n')}
}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 7 recipes per meal type (not more, not less)
2. Keep recipes CONCISE to fit within token limits (3-4 ingredients, 3-4 instructions each)
3. MUST properly close ALL JSON brackets and braces
4. DO NOT truncate - complete the entire JSON structure
5. Use THERAPEUTIC ingredients for: ${allConditions}
6. Prioritize HEALING foods from recommended list
7. Create variety across all 7 recipes per meal type

FINAL REMINDER: Your response MUST be complete, valid JSON with 7 recipes for EACH meal type. If running out of space, reduce recipe detail slightly but COMPLETE the JSON structure for all meal types: ${mealTypes.join(', ')}`;
  },

  extractMealTypes(mealSchedule) {
    // Extract meal type names from schedule like "Breakfast (8 AM), Mid-morning snack (10:30 AM), Lunch (1 PM)"
    const types = [];
    const schedule = mealSchedule || '';
    
    // Split by common delimiters
    const parts = schedule.split(/,|;|\+/).map(part => part.trim());
    
    for (const part of parts) {
      // Extract the meal type name (before parentheses or at/in keywords)
      let mealType = part
        .replace(/\([^)]*\)/g, '') // Remove content in parentheses like (8 AM)
        .replace(/\bat\b.*/i, '')   // Remove "at 8 AM" type phrases
        .replace(/\d+:?\d*\s*(AM|PM|am|pm)/gi, '') // Remove time patterns
        .trim();
      
      if (mealType) {
        // Normalize capitalization
        mealType = mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase();
        
        // Standardize common variations
        if (mealType.toLowerCase().includes('mid-morning') || mealType.toLowerCase().includes('mid morning')) {
          mealType = 'Mid-morning snack';
        } else if (mealType.toLowerCase().includes('morning') && mealType.toLowerCase().includes('snack')) {
          mealType = 'Morning snack';
        } else if (mealType.toLowerCase().includes('evening') && mealType.toLowerCase().includes('snack')) {
          mealType = 'Evening snack';
        } else if (mealType.toLowerCase().includes('afternoon') && mealType.toLowerCase().includes('snack')) {
          mealType = 'Afternoon snack';
        } else if (mealType.toLowerCase() === 'snack' || mealType.toLowerCase() === 'snacks') {
          mealType = 'Snacks';
        }
        
        // Add if not duplicate
        if (mealType && !types.includes(mealType)) {
          types.push(mealType);
        }
      }
    }
    
    // Default if nothing found
    if (types.length === 0) {
      return ['Breakfast', 'Lunch', 'Dinner'];
    }
    
    return types;
  },

  parseMealRecommendations(content) {
    try {
      // Remove markdown code blocks if present
      let cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to parse as JSON first
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed meal recommendations:', Object.keys(parsed));
          return parsed;
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError.message);
          console.error('Attempted to parse:', jsonMatch[0].substring(0, 200));
          // Try to fix common JSON errors
          let fixedJson = jsonMatch[0]
            .replace(/,\s*}/g, '}')  // Remove trailing commas
            .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
          
          try {
            const fixedParsed = JSON.parse(fixedJson);
            console.log('Successfully parsed after fixes:', Object.keys(fixedParsed));
            return fixedParsed;
          } catch (fixError) {
            console.error('Still cannot parse after fixes');
            // Return fallback - will be filtered to match expected meal types
            return null; // Signal to use fallback with proper meal types
          }
        }
      }
      
      // If not JSON, signal to use fallback
      console.warn('No JSON found in response, will use fallback');
      return null;
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  },

  // Helper function to check if recipe contains allergies/dislikes
  containsAllergens(recipe, allergies, customAllergies) {
    if (!recipe) return false;
    
    // Parse custom allergies (comma-separated)
    const customAllergyList = customAllergies 
      ? customAllergies.split(',').map(a => a.trim().toLowerCase()).filter(a => a.length > 0)
      : [];
    
    // Combine all allergies/dislikes
    const allAllergies = [
      ...(allergies || []).map(a => a.toLowerCase()),
      ...customAllergyList
    ];
    
    if (allAllergies.length === 0) return false;
    
    // Check recipe name
    const recipeName = (recipe.name || '').toLowerCase();
    
    // Check ingredients
    const ingredients = (recipe.ingredients || []).join(' ').toLowerCase();
    
    // Check if any allergen appears in recipe name or ingredients
    for (const allergen of allAllergies) {
      if (recipeName.includes(allergen) || ingredients.includes(allergen)) {
        console.log(`🚫 Filtering out "${recipe.name}" - contains allergen: "${allergen}"`);
        return true;
      }
    }
    
    return false;
  },

  getFallbackMealRecommendations(userData) {
    // Extract meal types from user's diet recommendations
    const mealSchedule = userData?.recommendations?.mealSchedule || 'Breakfast, Lunch, Dinner';
    const numberOfMeals = userData?.recommendations?.numberOfMeals || '3';
    const mealTypes = this.extractMealTypes(mealSchedule);
    
    console.log('====== FALLBACK MEAL GENERATION DEBUG ======');
    console.log('User recommendations:', userData?.recommendations);
    console.log('Number of meals from diet:', numberOfMeals);
    console.log('Meal schedule from diet:', mealSchedule);
    console.log('Extracted meal types:', mealTypes);
    console.log('Number of extracted types:', mealTypes.length);
    console.log('User allergies:', userData.allergies);
    console.log('Custom allergies:', userData.customAllergies);
    console.log('===========================================');
    
    const createRecipe = (name, calories, prepTime, ingredients, nutrients, instructions) => ({
      name, calories, prepTime, ingredients, nutrients, instructions
    });

    const basicNutrients = [
      {"name": "Protein", "value": "20g"},
      {"name": "Carbs", "value": "25g"},
      {"name": "Fat", "value": "15g"},
      {"name": "Fiber", "value": "5g"},
      {"name": "Vitamin A", "value": "120mcg"},
      {"name": "Vitamin C", "value": "15mg"},
      {"name": "Vitamin D", "value": "3mcg"},
      {"name": "Zinc", "value": "2mg"},
      {"name": "Magnesium", "value": "50mg"},
      {"name": "Iron", "value": "2.5mg"},
      {"name": "Calcium", "value": "80mg"}
    ];

    return {
      "Breakfast": [
        {
          "name": "Poached Eggs on Sprouted Grain Toast",
          "calories": 320,
          "prepTime": "15 mins",
          "ingredients": [
            "2 large organic eggs",
            "1 slice sprouted grain ezekiel bread",
            "1 tsp extra virgin olive oil",
            "1/4 tsp sea salt",
            "1/4 tsp freshly ground black pepper",
            "Fresh parsley for garnish"
          ],
          "nutrients": [
            {"name": "Protein", "value": "20g"},
            {"name": "Carbs", "value": "18g"},
            {"name": "Fat", "value": "15g"},
            {"name": "Fiber", "value": "3g"},
            {"name": "Vitamin A", "value": "120mcg"},
            {"name": "Vitamin C", "value": "5mg"},
            {"name": "Vitamin D", "value": "3mcg"},
            {"name": "Zinc", "value": "2mg"},
            {"name": "Magnesium", "value": "40mg"},
            {"name": "Iron", "value": "2.5mg"},
            {"name": "Calcium", "value": "70mg"}
          ],
          "instructions": [
            "Bring a pot of water to a gentle simmer (not boiling)",
            "Crack eggs gently into the water and poach for 3-4 minutes until whites are set",
            "While eggs cook, toast the sprouted grain bread until golden brown",
            "Remove eggs with a slotted spoon and drain excess water",
            "Drizzle toast with olive oil, place poached eggs on top",
            "Season with salt and pepper, garnish with fresh parsley and serve immediately"
          ]
        },
        {
          "name": "Avocado Toast with Seeds",
          "calories": 280,
          "prepTime": "10 mins",
          "ingredients": [
            "1/2 ripe avocado, mashed",
            "1 slice whole grain bread",
            "1 tbsp pumpkin seeds",
            "1 tsp hemp seeds",
            "1/4 tsp red pepper flakes",
            "Squeeze of fresh lemon juice",
            "Sea salt and black pepper to taste"
          ],
          "nutrients": [
            {"name": "Protein", "value": "10g"},
            {"name": "Carbs", "value": "24g"},
            {"name": "Fat", "value": "18g"},
            {"name": "Fiber", "value": "10g"},
            {"name": "Vitamin A", "value": "80mcg"},
            {"name": "Vitamin C", "value": "15mg"},
            {"name": "Vitamin D", "value": "1mcg"},
            {"name": "Zinc", "value": "2mg"},
            {"name": "Magnesium", "value": "85mg"},
            {"name": "Iron", "value": "2mg"},
            {"name": "Calcium", "value": "60mg"}
          ],
          "instructions": [
            "Toast the bread until golden and crispy",
            "In a small bowl, mash avocado with lemon juice, salt, and pepper",
            "Spread mashed avocado generously on toasted bread",
            "Sprinkle pumpkin seeds and hemp seeds evenly on top",
            "Add a pinch of red pepper flakes for a slight kick",
            "Serve immediately while toast is still warm"
          ]
        },
        {
          "name": "Greek Yogurt Parfait",
          "calories": 290,
          "prepTime": "8 mins",
          "ingredients": [
            "1 cup plain Greek yogurt",
            "1/2 cup mixed berries (blueberries, strawberries)",
            "2 tbsp chopped walnuts",
            "1 tbsp chia seeds",
            "1 tsp raw honey",
            "1/4 tsp ground cinnamon"
          ],
          "nutrients": [
            {"name": "Protein", "value": "22g"},
            {"name": "Carbs", "value": "28g"},
            {"name": "Fat", "value": "12g"},
            {"name": "Fiber", "value": "6g"},
            {"name": "Vitamin A", "value": "45mcg"},
            {"name": "Vitamin C", "value": "25mg"},
            {"name": "Vitamin D", "value": "2mcg"},
            {"name": "Zinc", "value": "1.5mg"},
            {"name": "Magnesium", "value": "55mg"},
            {"name": "Iron", "value": "1.8mg"},
            {"name": "Calcium", "value": "280mg"}
          ],
          "instructions": [
            "Place Greek yogurt in a serving bowl",
            "Wash and pat dry the berries, slice strawberries if using",
            "Layer half the berries on top of yogurt",
            "Sprinkle chia seeds and chopped walnuts over berries",
            "Add remaining berries and drizzle honey on top",
            "Finish with a sprinkle of cinnamon and serve chilled"
          ]
        },
        {
          "name": "Vegetable Omelet",
          "calories": 310,
          "prepTime": "12 mins",
          "ingredients": [
            "3 large eggs",
            "1/2 cup baby spinach, chopped",
            "1/4 cup diced bell peppers (red and yellow)",
            "2 tbsp diced onions",
            "1 tbsp olive oil",
            "1/4 tsp turmeric powder",
            "Salt and pepper to taste"
          ],
          "nutrients": [
            {"name": "Protein", "value": "24g"},
            {"name": "Carbs", "value": "8g"},
            {"name": "Fat", "value": "20g"},
            {"name": "Fiber", "value": "2g"},
            {"name": "Vitamin A", "value": "350mcg"},
            {"name": "Vitamin C", "value": "75mg"},
            {"name": "Vitamin D", "value": "4mcg"},
            {"name": "Zinc", "value": "2.5mg"},
            {"name": "Magnesium", "value": "45mg"},
            {"name": "Iron", "value": "3.5mg"},
            {"name": "Calcium", "value": "120mg"}
          ],
          "instructions": [
            "Heat olive oil in a non-stick pan over medium heat",
            "Sauté onions until translucent, about 2 minutes",
            "Add bell peppers and cook for another 2 minutes",
            "Whisk eggs with turmeric, salt, and pepper in a bowl",
            "Pour eggs into pan, add spinach, cook until edges set (2-3 min)",
            "Fold omelet in half, cook for 1 more minute, and serve hot"
          ]
        },
        {
          "name": "Oatmeal with Berries",
          "calories": 300,
          "prepTime": "10 mins",
          "ingredients": ["1/2 cup rolled oats", "1 cup almond milk", "1/2 cup mixed berries", "1 tbsp chia seeds", "1 tsp honey"],
          "nutrients": basicNutrients,
          "instructions": ["Cook oats in almond milk for 5 minutes", "Top with berries, chia seeds, and honey", "Serve warm"]
        },
        {
          "name": "Smoothie Bowl",
          "calories": 280,
          "prepTime": "8 mins",
          "ingredients": ["1 frozen banana", "1/2 cup spinach", "1/2 cup berries", "1/2 cup yogurt", "Granola topping"],
          "nutrients": basicNutrients,
          "instructions": ["Blend banana, spinach, berries, and yogurt", "Pour into bowl", "Top with granola and serve"]
        },
        {
          "name": "Whole Grain Pancakes",
          "calories": 320,
          "prepTime": "20 mins",
          "ingredients": ["1 cup whole wheat flour", "1 egg", "3/4 cup milk", "1 tbsp honey", "Berries for topping"],
          "nutrients": basicNutrients,
          "instructions": ["Mix flour, egg, milk, and honey", "Cook on griddle until golden", "Top with berries"]
        }
      ],
      "Mid-morning snack": [
        {
          "name": "Apple with Almond Butter",
          "calories": 180,
          "prepTime": "5 mins",
          "ingredients": ["1 medium apple, sliced", "2 tbsp almond butter"],
          "nutrients": basicNutrients,
          "instructions": ["Slice apple", "Serve with almond butter for dipping"]
        },
        {
          "name": "Greek Yogurt with Honey",
          "calories": 150,
          "prepTime": "3 mins",
          "ingredients": ["1 cup Greek yogurt", "1 tbsp honey", "Handful of nuts"],
          "nutrients": basicNutrients,
          "instructions": ["Place yogurt in bowl", "Drizzle with honey", "Top with nuts"]
        },
        {
          "name": "Protein Smoothie",
          "calories": 200,
          "prepTime": "5 mins",
          "ingredients": ["1 scoop protein powder", "1 banana", "1 cup almond milk", "Ice cubes"],
          "nutrients": basicNutrients,
          "instructions": ["Blend all ingredients until smooth", "Pour into glass and serve"]
        },
        {
          "name": "Hummus with Veggies",
          "calories": 160,
          "prepTime": "8 mins",
          "ingredients": ["1/4 cup hummus", "3 medium carrots, cut into sticks", "1 medium cucumber, sliced", "1 bell pepper, cut into strips"],
          "nutrients": basicNutrients,
          "instructions": ["Slice vegetables", "Serve with hummus for dipping"]
        },
        {
          "name": "Trail Mix",
          "calories": 190,
          "prepTime": "3 mins",
          "ingredients": ["1/4 cup almonds", "1/4 cup walnuts", "2 tbsp dried cranberries", "2 tbsp dark chocolate chips"],
          "nutrients": basicNutrients,
          "instructions": ["Mix all ingredients in a bowl", "Portion into snack bag"]
        },
        {
          "name": "Cottage Cheese with Fruit",
          "calories": 170,
          "prepTime": "5 mins",
          "ingredients": ["1 cup cottage cheese", "1/2 cup pineapple chunks", "Sprinkle of cinnamon"],
          "nutrients": basicNutrients,
          "instructions": ["Place cottage cheese in bowl", "Top with pineapple", "Sprinkle cinnamon"]
        },
        {
          "name": "Rice Cakes with Avocado",
          "calories": 185,
          "prepTime": "7 mins",
          "ingredients": ["2 rice cakes", "1/2 avocado, mashed", "4 cherry tomatoes, halved", "Pinch of sea salt"],
          "nutrients": basicNutrients,
          "instructions": ["Spread avocado on rice cakes", "Top with tomato slices", "Season with salt"]
        }
      ],
      "Lunch": [
        {
          "name": "Grilled Chicken Salad Bowl",
          "calories": 380,
          "prepTime": "25 mins",
          "ingredients": [
            "150g grilled chicken breast, sliced",
            "1 cup baby spinach",
            "1 cup romaine lettuce, chopped",
            "1/2 cup cherry tomatoes, halved",
            "1/4 medium cucumber, sliced",
            "2 tbsp balsamic vinaigrette",
            "1 tbsp pumpkin seeds",
            "2 tbsp fresh basil, chopped"
          ],
          "nutrients": [
            {"name": "Protein", "value": "35g"},
            {"name": "Carbs", "value": "12g"},
            {"name": "Fat", "value": "18g"},
            {"name": "Fiber", "value": "4g"},
            {"name": "Vitamin A", "value": "450mcg"},
            {"name": "Vitamin C", "value": "45mg"},
            {"name": "Vitamin D", "value": "1mcg"},
            {"name": "Zinc", "value": "2mg"},
            {"name": "Magnesium", "value": "65mg"},
            {"name": "Iron", "value": "2.8mg"},
            {"name": "Calcium", "value": "95mg"}
          ],
          "instructions": [
            "Season chicken breast with salt, pepper, and herbs",
            "Grill chicken on medium-high heat for 5-6 minutes per side",
            "Let chicken rest for 5 minutes, then slice into strips",
            "Arrange spinach and romaine lettuce in a large bowl",
            "Top with cherry tomatoes, cucumber, and sliced chicken",
            "Drizzle with balsamic vinaigrette, sprinkle pumpkin seeds and serve"
          ]
        },
        {
          "name": "Quinoa Buddha Bowl",
          "calories": 420,
          "prepTime": "30 mins",
          "ingredients": [
            "3/4 cup cooked quinoa",
            "1/2 cup roasted chickpeas",
            "1 cup steamed broccoli florets",
            "1/2 avocado, sliced",
            "2 tbsp tahini dressing",
            "1 tbsp sesame seeds",
            "Pinch of sea salt"
          ],
          "nutrients": [
            {"name": "Protein", "value": "18g"},
            {"name": "Carbs", "value": "52g"},
            {"name": "Fat", "value": "22g"},
            {"name": "Fiber", "value": "14g"},
            {"name": "Vitamin A", "value": "180mcg"},
            {"name": "Vitamin C", "value": "95mg"},
            {"name": "Vitamin D", "value": "0mcg"},
            {"name": "Zinc", "value": "3mg"},
            {"name": "Magnesium", "value": "155mg"},
            {"name": "Iron", "value": "5.5mg"},
            {"name": "Calcium", "value": "145mg"}
          ],
          "instructions": [
            "Cook quinoa according to package directions, fluff with fork",
            "Drain and rinse chickpeas, toss with olive oil and spices",
            "Roast chickpeas at 400°F for 20-25 minutes until crispy",
            "Steam broccoli until tender but still bright green, about 5 minutes",
            "Arrange quinoa in a bowl, top with broccoli, chickpeas, and avocado",
            "Drizzle tahini dressing, sprinkle sesame seeds and serve warm"
          ]
        },
        {
          "name": "Salmon with Steamed Vegetables",
          "calories": 410,
          "prepTime": "25 mins",
          "ingredients": [
            "150g wild-caught salmon fillet",
            "1/2 cup diced carrots",
            "1/2 cup diced zucchini",
            "1/3 cup diced bell peppers",
            "1 tbsp olive oil",
            "1 tsp fresh dill",
            "1 clove garlic, minced",
            "Lemon wedges",
            "Salt and pepper to taste"
          ],
          "nutrients": [
            {"name": "Protein", "value": "32g"},
            {"name": "Carbs", "value": "15g"},
            {"name": "Fat", "value": "25g"},
            {"name": "Fiber", "value": "5g"},
            {"name": "Vitamin A", "value": "520mcg"},
            {"name": "Vitamin C", "value": "65mg"},
            {"name": "Vitamin D", "value": "15mcg"},
            {"name": "Zinc", "value": "1.5mg"},
            {"name": "Magnesium", "value": "75mg"},
            {"name": "Iron", "value": "2.2mg"},
            {"name": "Calcium", "value": "85mg"}
          ],
          "instructions": [
            "Preheat oven to 400°F and line baking sheet with parchment",
            "Rub salmon with olive oil, minced garlic, salt, and pepper",
            "Bake salmon for 12-15 minutes until it flakes easily",
            "Meanwhile, steam vegetables until tender-crisp, about 6-8 minutes",
            "Remove salmon from oven and sprinkle fresh dill on top",
            "Serve salmon with steamed vegetables and lemon wedges"
          ]
        },
        {
          "name": "Lentil and Vegetable Soup",
          "calories": 340,
          "prepTime": "35 mins",
          "ingredients": [
            "1 cup cooked green lentils",
            "2 cups vegetable broth",
            "1/2 cup diced carrots",
            "1/2 cup diced celery",
            "1/4 cup diced onions",
            "2 cloves garlic, minced",
            "1 tsp cumin powder",
            "Fresh cilantro for garnish"
          ],
          "nutrients": [
            {"name": "Protein", "value": "20g"},
            {"name": "Carbs", "value": "48g"},
            {"name": "Fat", "value": "4g"},
            {"name": "Fiber", "value": "18g"},
            {"name": "Vitamin A", "value": "380mcg"},
            {"name": "Vitamin C", "value": "28mg"},
            {"name": "Vitamin D", "value": "0mcg"},
            {"name": "Zinc", "value": "3.5mg"},
            {"name": "Magnesium", "value": "95mg"},
            {"name": "Iron", "value": "6.5mg"},
            {"name": "Calcium", "value": "75mg"}
          ],
          "instructions": [
            "Heat olive oil in a large pot over medium heat",
            "Sauté onions, carrots, and celery until softened, about 5 minutes",
            "Add minced garlic and cumin, cook for 1 minute until fragrant",
            "Pour in vegetable broth and bring to a boil",
            "Add cooked lentils, reduce heat and simmer for 15 minutes",
            "Season with salt and pepper, garnish with cilantro and serve hot"
          ]
        },
        {
          "name": "Turkey Wrap",
          "calories": 350,
          "prepTime": "10 mins",
          "ingredients": ["Whole wheat tortilla", "100g sliced turkey", "Lettuce", "Tomato", "Avocado", "Mustard"],
          "nutrients": basicNutrients,
          "instructions": ["Layer turkey, lettuce, tomato, and avocado on tortilla", "Spread mustard", "Roll up and serve"]
        },
        {
          "name": "Tuna Salad",
          "calories": 320,
          "prepTime": "12 mins",
          "ingredients": ["1 can tuna", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon juice"],
          "nutrients": basicNutrients,
          "instructions": ["Drain tuna", "Mix with greens, tomatoes, and cucumber", "Dress with olive oil and lemon"]
        },
        {
          "name": "Veggie Burger Bowl",
          "calories": 380,
          "prepTime": "20 mins",
          "ingredients": ["1 veggie burger patty", "Quinoa", "Roasted vegetables", "Tahini sauce"],
          "nutrients": basicNutrients,
          "instructions": ["Cook veggie burger as directed", "Serve over quinoa with roasted vegetables", "Drizzle with tahini"]
        }
      ],
      "Afternoon snack": [
        {
          "name": "Protein Bar",
          "calories": 200,
          "prepTime": "2 mins",
          "ingredients": ["1 homemade or store-bought protein bar", "Piece of fruit"],
          "nutrients": basicNutrients,
          "instructions": ["Enjoy protein bar with fruit"]
        },
        {
          "name": "Edamame",
          "calories": 150,
          "prepTime": "8 mins",
          "ingredients": ["1 cup steamed edamame", "Sea salt"],
          "nutrients": basicNutrients,
          "instructions": ["Steam edamame for 5 minutes", "Sprinkle with sea salt"]
        },
        {
          "name": "Dark Chocolate and Almonds",
          "calories": 180,
          "prepTime": "2 mins",
          "ingredients": ["10 almonds", "2 squares dark chocolate (70% cacao)"],
          "nutrients": basicNutrients,
          "instructions": ["Enjoy almonds with dark chocolate"]
        },
        {
          "name": "Veggie Sticks with Guacamole",
          "calories": 160,
          "prepTime": "10 mins",
          "ingredients": ["2 medium carrots, cut into sticks", "2 celery stalks, cut into sticks", "1/4 cup guacamole"],
          "nutrients": basicNutrients,
          "instructions": ["Cut vegetables into sticks", "Serve with guacamole"]
        },
        {
          "name": "Boiled Eggs",
          "calories": 140,
          "prepTime": "12 mins",
          "ingredients": ["2 hard-boiled eggs", "Pinch of paprika"],
          "nutrients": basicNutrients,
          "instructions": ["Boil eggs for 10 minutes", "Peel and season with paprika"]
        },
        {
          "name": "Fruit and Nut Mix",
          "calories": 170,
          "prepTime": "5 mins",
          "ingredients": ["1/2 apple, sliced", "10 cashews", "5 dried apricots"],
          "nutrients": basicNutrients,
          "instructions": ["Slice apple", "Mix with nuts and dried fruit"]
        },
        {
          "name": "Cheese and Crackers",
          "calories": 180,
          "prepTime": "4 mins",
          "ingredients": ["4 whole grain crackers", "2 oz cheddar cheese slices", "1/2 cup red grapes"],
          "nutrients": basicNutrients,
          "instructions": ["Arrange crackers with cheese", "Serve with grapes"]
        }
      ],
      "Dinner": [
        {
          "name": "Grilled Fish with Roasted Vegetables",
          "calories": 390,
          "prepTime": "30 mins",
          "ingredients": [
            "180g white fish fillet (cod or tilapia)",
            "1/2 cup zucchini, diced",
            "1/2 cup bell peppers (red and yellow), diced",
            "1/4 cup red onion, sliced",
            "2 tbsp olive oil",
            "1 tsp paprika",
            "1 tsp garlic powder",
            "1 tbsp fresh lemon juice",
            "2 tbsp fresh parsley, chopped"
          ],
          "nutrients": [
            {"name": "Protein", "value": "38g"},
            {"name": "Carbs", "value": "18g"},
            {"name": "Fat", "value": "18g"},
            {"name": "Fiber", "value": "6g"},
            {"name": "Vitamin A", "value": "420mcg"},
            {"name": "Vitamin C", "value": "85mg"},
            {"name": "Vitamin D", "value": "8mcg"},
            {"name": "Zinc", "value": "1.8mg"},
            {"name": "Magnesium", "value": "70mg"},
            {"name": "Iron", "value": "1.5mg"},
            {"name": "Calcium", "value": "90mg"}
          ],
          "instructions": [
            "Preheat oven to 425°F and line baking sheet with foil",
            "Toss vegetables with 1 tbsp olive oil, salt, and pepper",
            "Roast vegetables for 15 minutes until slightly charred",
            "Season fish with paprika, garlic powder, salt, and remaining oil",
            "Grill or pan-sear fish for 4-5 minutes per side until opaque",
            "Squeeze fresh lemon juice over fish, garnish with parsley and serve with vegetables"
          ]
        },
        {
          "name": "Chicken Stir-Fry with Brown Rice",
          "calories": 445,
          "prepTime": "25 mins",
          "ingredients": [
            "150g chicken breast, cut into strips",
            "3/4 cup cooked brown rice",
            "1/2 cup broccoli florets",
            "1/3 cup sliced carrots",
            "1/4 cup snap peas",
            "2 tbsp low-sodium soy sauce",
            "1 tbsp sesame oil",
            "2 cloves garlic, minced",
            "1 tsp fresh ginger, grated",
            "1 tbsp sesame seeds"
          ],
          "nutrients": [
            {"name": "Protein", "value": "36g"},
            {"name": "Carbs", "value": "42g"},
            {"name": "Fat", "value": "16g"},
            {"name": "Fiber", "value": "5g"},
            {"name": "Vitamin A", "value": "280mcg"},
            {"name": "Vitamin C", "value": "55mg"},
            {"name": "Vitamin D", "value": "1mcg"},
            {"name": "Zinc", "value": "2.5mg"},
            {"name": "Magnesium", "value": "85mg"},
            {"name": "Iron", "value": "2.8mg"},
            {"name": "Calcium", "value": "110mg"}
          ],
          "instructions": [
            "Heat sesame oil in a wok or large skillet over high heat",
            "Add chicken strips and stir-fry for 5-6 minutes until cooked through",
            "Remove chicken and set aside, keep pan hot",
            "Add garlic and ginger, stir for 30 seconds until aromatic",
            "Toss in vegetables, stir-fry for 3-4 minutes until tender-crisp",
            "Return chicken to pan, add soy sauce, toss well, serve over brown rice with sesame seeds"
          ]
        },
        {
          "name": "Turkey Meatballs with Zucchini Noodles",
          "calories": 370,
          "prepTime": "35 mins",
          "ingredients": [
            "150g ground turkey",
            "2 medium zucchinis, spiralized",
            "1/4 cup breadcrumbs",
            "1 egg",
            "2 cloves garlic, minced",
            "1 cup marinara sauce (sugar-free)",
            "Italian herbs (basil, oregano)",
            "Parmesan cheese for garnish"
          ],
          "nutrients": [
            {"name": "Protein", "value": "34g"},
            {"name": "Carbs", "value": "22g"},
            {"name": "Fat", "value": "18g"},
            {"name": "Fiber", "value": "6g"},
            {"name": "Vitamin A", "value": "380mcg"},
            {"name": "Vitamin C", "value": "45mg"},
            {"name": "Vitamin D", "value": "2mcg"},
            {"name": "Zinc", "value": "3mg"},
            {"name": "Magnesium", "value": "65mg"},
            {"name": "Iron", "value": "3.2mg"},
            {"name": "Calcium", "value": "155mg"}
          ],
          "instructions": [
            "In a bowl, mix ground turkey, breadcrumbs, egg, garlic, and herbs",
            "Form mixture into 8-10 meatballs and place on baking sheet",
            "Bake at 400°F for 20-25 minutes until cooked through",
            "Heat marinara sauce in a pan over medium heat",
            "Spiralize zucchini and lightly sauté for 2-3 minutes until just tender",
            "Serve meatballs over zucchini noodles, top with marinara and parmesan"
          ]
        },
        {
          "name": "Vegetable Curry with Chickpeas",
          "calories": 400,
          "prepTime": "30 mins",
          "ingredients": [
            "1 cup cooked chickpeas",
            "1/2 cup cauliflower florets",
            "1/3 cup diced carrots",
            "1/4 cup green peas",
            "1/2 cup coconut milk (light)",
            "1 tbsp curry powder",
            "1 tsp turmeric",
            "2 cloves garlic, minced",
            "1 tsp grated ginger",
            "2 tbsp fresh cilantro, chopped"
          ],
          "nutrients": [
            {"name": "Protein", "value": "16g"},
            {"name": "Carbs", "value": "54g"},
            {"name": "Fat", "value": "14g"},
            {"name": "Fiber", "value": "14g"},
            {"name": "Vitamin A", "value": "480mcg"},
            {"name": "Vitamin C", "value": "65mg"},
            {"name": "Vitamin D", "value": "0mcg"},
            {"name": "Zinc", "value": "2.8mg"},
            {"name": "Magnesium", "value": "105mg"},
            {"name": "Iron", "value": "5.5mg"},
            {"name": "Calcium", "value": "125mg"}
          ],
          "instructions": [
            "Heat oil in a large pan over medium heat",
            "Sauté garlic and ginger until fragrant, about 1 minute",
            "Add curry powder and turmeric, toast spices for 30 seconds",
            "Add mixed vegetables and stir to coat with spices",
            "Pour in coconut milk and add chickpeas, bring to simmer",
            "Cook for 15-20 minutes until vegetables are tender, garnish with cilantro and serve"
          ]
        },
        {
          "name": "Baked Chicken with Sweet Potato",
          "calories": 420,
          "prepTime": "35 mins",
          "ingredients": ["150g chicken breast", "1 medium sweet potato", "Olive oil", "Rosemary", "Garlic"],
          "nutrients": basicNutrients,
          "instructions": ["Season chicken with rosemary and garlic", "Bake at 400°F for 25 minutes", "Serve with baked sweet potato"]
        },
        {
          "name": "Shrimp Tacos",
          "calories": 390,
          "prepTime": "20 mins",
          "ingredients": ["150g shrimp", "2 corn tortillas", "Cabbage slaw", "Avocado", "Lime", "Cilantro"],
          "nutrients": basicNutrients,
          "instructions": ["Sauté shrimp with spices", "Warm tortillas", "Fill with shrimp, slaw, and avocado"]
        },
        {
          "name": "Beef and Broccoli Stir-Fry",
          "calories": 410,
          "prepTime": "22 mins",
          "ingredients": ["150g lean beef", "2 cups broccoli", "Soy sauce", "Garlic", "Ginger", "Sesame oil"],
          "nutrients": basicNutrients,
          "instructions": ["Stir-fry beef until browned", "Add broccoli, garlic, and ginger", "Season with soy sauce and sesame oil"]
        }
      ]
    };
  }
};
