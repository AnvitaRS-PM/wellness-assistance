import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function TodaysMetricsScreen({ navigation }) {
  const { userData, getTodaysMeals } = useUser();
  const [metricsData, setMetricsData] = useState(null);

  useEffect(() => {
    calculateMetrics();
  }, [userData.loggedMeals]);

  const calculateDailyTargets = () => {
    const age = parseInt(userData.age) || 30;
    const weight = parseFloat(userData.currentWeight) || 70;
    const goalWeight = parseFloat(userData.goalWeight) || 65;
    const height = parseFloat(userData.height) || 170;
    const gender = userData.gender || 'Female';
    const daysToAchieve = parseInt(userData.daysToAchieve) || 90;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'Male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Apply activity multiplier (assuming moderate activity)
    const tdee = bmr * 1.55;

    // Calculate calorie deficit needed
    const weightDiff = weight - goalWeight;
    const caloriesPerKg = 7700; // Approximate calories per kg
    const totalCalorieDeficit = weightDiff * caloriesPerKg;
    const dailyDeficitNeeded = totalCalorieDeficit / daysToAchieve;

    // Target calories (with safe minimum)
    let targetCalories = tdee - dailyDeficitNeeded;
    targetCalories = Math.max(targetCalories, 1200); // Minimum 1200 calories

    // Calculate macro targets (rough estimates)
    const proteinTarget = weight * 1.6; // 1.6g per kg body weight
    const fatTarget = (targetCalories * 0.30) / 9; // 30% of calories from fat
    const carbsTarget = (targetCalories - (proteinTarget * 4 + fatTarget * 9)) / 4;
    const fiberTarget = 25 + (gender === 'Male' ? 5 : 0);

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinTarget),
      carbs: Math.round(carbsTarget),
      fat: Math.round(fatTarget),
      fiber: Math.round(fiberTarget)
    };
  };

  const calculateMetrics = () => {
    const todaysMeals = getTodaysMeals();
    const targets = calculateDailyTargets();

    // Calculate totals from logged meals
    let totalCalories = 0;
    const nutrientTotals = {
      'Protein': 0,
      'Carbs': 0,
      'Fat': 0,
      'Fiber': 0,
      'Vitamin A': 0,
      'Vitamin C': 0,
      'Vitamin D': 0,
      'Calcium': 0,
      'Iron': 0,
      'Zinc': 0,
      'Magnesium': 0
    };

    todaysMeals.forEach(meal => {
      totalCalories += meal.calories || 0;
      
      if (meal.nutrients && Array.isArray(meal.nutrients)) {
        meal.nutrients.forEach(nutrient => {
          if (nutrientTotals.hasOwnProperty(nutrient.name)) {
            // Parse value (e.g., "25g" -> 25)
            const value = parseFloat(nutrient.value) || 0;
            nutrientTotals[nutrient.name] += value;
          }
        });
      }
    });

    // Map nutrients with targets
    const nutrients = [
      { name: 'Protein', consumed: Math.round(nutrientTotals['Protein']), target: targets.protein, unit: 'g' },
      { name: 'Carbs', consumed: Math.round(nutrientTotals['Carbs']), target: targets.carbs, unit: 'g' },
      { name: 'Fat', consumed: Math.round(nutrientTotals['Fat']), target: targets.fat, unit: 'g' },
      { name: 'Fiber', consumed: Math.round(nutrientTotals['Fiber']), target: targets.fiber, unit: 'g' },
      { name: 'Vitamin A', consumed: Math.round(nutrientTotals['Vitamin A']), target: 900, unit: 'mcg' },
      { name: 'Vitamin C', consumed: Math.round(nutrientTotals['Vitamin C']), target: 75, unit: 'mg' },
      { name: 'Vitamin D', consumed: Math.round(nutrientTotals['Vitamin D']), target: 15, unit: 'mcg' },
      { name: 'Calcium', consumed: Math.round(nutrientTotals['Calcium']), target: 1000, unit: 'mg' },
      { name: 'Iron', consumed: Math.round(nutrientTotals['Iron']), target: 18, unit: 'mg' },
      { name: 'Zinc', consumed: Math.round(nutrientTotals['Zinc']), target: 11, unit: 'mg' },
      { name: 'Magnesium', consumed: Math.round(nutrientTotals['Magnesium']), target: 310, unit: 'mg' },
    ];

    // Calculate days completed (simplified - in production, track actual start date)
    const daysCompleted = 1; // Start with day 1 for new users
    const totalDays = parseInt(userData.daysToAchieve) || 90;

    setMetricsData({
      caloriesConsumed: Math.round(totalCalories),
      caloriesTarget: targets.calories,
      nutrients,
      daysCompleted,
      totalDays,
      mealsLogged: todaysMeals.length
    });
  };

  const calculatePercentage = (consumed, target) => {
    return Math.min((consumed / target) * 100, 100);
  };

  const calculateDifference = (consumed, target) => {
    const diff = consumed - target;
    return {
      value: Math.abs(diff),
      type: diff >= 0 ? 'over' : 'under',
    };
  };

  const calculateGoalProgress = () => {
    if (!metricsData) return 0;
    return ((metricsData.daysCompleted / metricsData.totalDays) * 100).toFixed(1);
  };

  const getDaysRemaining = () => {
    if (!metricsData) return 0;
    return metricsData.totalDays - metricsData.daysCompleted;
  };

  if (!metricsData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Calculating your metrics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const caloriesDiff = calculateDifference(metricsData.caloriesConsumed, metricsData.caloriesTarget);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Today's Metrics</Text>
        <Text style={styles.subtitle}>
          {metricsData.mealsLogged === 0 
            ? 'No meals logged yet today. Start logging to track your nutrition!'
            : `Tracking ${metricsData.mealsLogged} logged meal${metricsData.mealsLogged > 1 ? 's' : ''}`
          }
        </Text>

        {/* Calories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Calorie Intake</Text>
          <View style={styles.caloriesCard}>
            <View style={styles.caloriesRow}>
              <View style={styles.caloriesInfo}>
                <Text style={styles.caloriesLabel}>Consumed</Text>
                <Text style={styles.caloriesValue}>{metricsData.caloriesConsumed}</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
              <View style={styles.dividerVertical} />
              <View style={styles.caloriesInfo}>
                <Text style={styles.caloriesLabel}>Target</Text>
                <Text style={styles.caloriesValue}>{metricsData.caloriesTarget}</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${calculatePercentage(metricsData.caloriesConsumed, metricsData.caloriesTarget)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {calculatePercentage(metricsData.caloriesConsumed, metricsData.caloriesTarget).toFixed(0)}%
              </Text>
            </View>

            <View style={[styles.differenceBadge, caloriesDiff.type === 'over' ? styles.overBadge : styles.underBadge]}>
              <Text style={styles.differenceText}>
                {caloriesDiff.type === 'over' ? '↑' : '↓'} {caloriesDiff.value} kcal {caloriesDiff.type === 'over' ? 'over' : 'under'} target
              </Text>
            </View>
          </View>
        </View>

        {/* Nutrients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥗 Nutrient Breakdown</Text>
          {metricsData.nutrients.map((nutrient, index) => {
            const diff = calculateDifference(nutrient.consumed, nutrient.target);
            const percentage = calculatePercentage(nutrient.consumed, nutrient.target);
            
            return (
              <View key={index} style={styles.nutrientCard}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>{nutrient.name}</Text>
                  <View style={styles.nutrientValues}>
                    <Text style={styles.nutrientConsumed}>{nutrient.consumed}{nutrient.unit}</Text>
                    <Text style={styles.nutrientSeparator}>/</Text>
                    <Text style={styles.nutrientTarget}>{nutrient.target}{nutrient.unit}</Text>
                  </View>
                </View>
                
                <View style={styles.nutrientProgressContainer}>
                  <View style={styles.nutrientProgressBg}>
                    <View 
                      style={[
                        styles.nutrientProgressFill,
                        { 
                          width: `${percentage}%`,
                          backgroundColor: percentage >= 80 ? '#4CAF50' : percentage >= 50 ? '#FF9800' : '#E74C3C'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.nutrientPercentage}>{percentage.toFixed(0)}%</Text>
                </View>

                <Text style={[styles.nutrientDiff, diff.type === 'over' ? styles.overText : styles.underText]}>
                  {diff.type === 'over' ? '↑' : '↓'} {diff.value}{nutrient.unit} {diff.type === 'over' ? 'over' : 'under'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Goal Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Goal Progress</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>Days Completed</Text>
                <Text style={styles.goalValue}>{metricsData.daysCompleted}</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>Total Days</Text>
                <Text style={styles.goalValue}>{metricsData.totalDays}</Text>
              </View>
            </View>

            <View style={styles.goalProgressContainer}>
              <View style={styles.goalProgressBg}>
                <View 
                  style={[styles.goalProgressFill, { width: `${calculateGoalProgress()}%` }]} 
                />
              </View>
              <Text style={styles.goalProgressText}>{calculateGoalProgress()}% Complete</Text>
            </View>

            <View style={styles.daysRemainingCard}>
              <Text style={styles.daysRemainingNumber}>{getDaysRemaining()}</Text>
              <Text style={styles.daysRemainingText}>days remaining to achieve your goal</Text>
            </View>

            <View style={styles.goalDetails}>
              <Text style={styles.goalDetailsText}>
                Name: {userData?.name || 'User'}, Age: {userData?.age || 'N/A'}
              </Text>
              <Text style={styles.goalDetailsText}>
                Gender: {userData?.gender || 'Not specified'}
              </Text>
              <Text style={styles.goalDetailsText}>
                Current Weight: {userData?.currentWeight || 70}kg
              </Text>
              <Text style={styles.goalDetailsText}>
                Goal Weight: {userData?.goalWeight || 65}kg
              </Text>
              <Text style={styles.goalDetailsText}>
                To Lose: {((userData?.currentWeight || 70) - (userData?.goalWeight || 65)).toFixed(1)}kg
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MealRecommendations')}
        >
          <Text style={styles.actionButtonText}>Meal Planning</Text>
        </TouchableOpacity>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            💡 Data updates automatically when meals are logged
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  caloriesCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  caloriesInfo: {
    alignItems: 'center',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  caloriesUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    textAlign: 'center',
  },
  differenceBadge: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  overBadge: {
    backgroundColor: '#FFE8E8',
  },
  underBadge: {
    backgroundColor: '#E8F5E9',
  },
  differenceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nutrientCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5FD4C4',
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nutrientValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nutrientConsumed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  nutrientSeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 4,
  },
  nutrientTarget: {
    fontSize: 14,
    color: '#666',
  },
  nutrientProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientProgressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  nutrientProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  nutrientPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
  nutrientDiff: {
    fontSize: 12,
    fontWeight: '500',
  },
  overText: {
    color: '#E74C3C',
  },
  underText: {
    color: '#27AE60',
  },
  goalCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  goalInfo: {
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  goalProgressContainer: {
    marginBottom: 20,
  },
  goalProgressBg: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 8,
  },
  goalProgressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    textAlign: 'center',
  },
  daysRemainingCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  daysRemainingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  daysRemainingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  goalDetails: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  goalDetailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  actionButton: {
    backgroundColor: '#5FD4C4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  infoNote: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoNoteText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
});
