import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function TodaysMetricsScreen({ navigation }) {
  const { userData } = useUser();
  const [metricsData, setMetricsData] = useState({
    caloriesConsumed: 1450,
    caloriesTarget: 1800,
    nutrients: [
      { name: 'Protein', consumed: 65, target: 80, unit: 'g' },
      { name: 'Carbs', consumed: 180, target: 200, unit: 'g' },
      { name: 'Fat', consumed: 45, target: 50, unit: 'g' },
      { name: 'Fiber', consumed: 22, target: 30, unit: 'g' },
      { name: 'Vitamin D', consumed: 12, target: 15, unit: 'mcg' },
      { name: 'Calcium', consumed: 850, target: 1000, unit: 'mg' },
      { name: 'Iron', consumed: 14, target: 18, unit: 'mg' },
      { name: 'Zinc', consumed: 8, target: 11, unit: 'mg' },
    ],
    daysCompleted: 15,
    totalDays: userData?.timeline || 90,
  });

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
    return ((metricsData.daysCompleted / metricsData.totalDays) * 100).toFixed(1);
  };

  const getDaysRemaining = () => {
    return metricsData.totalDays - metricsData.daysCompleted;
  };

  const caloriesDiff = calculateDifference(metricsData.caloriesConsumed, metricsData.caloriesTarget);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Today's Metrics</Text>
        <Text style={styles.subtitle}>Track your daily nutrition and progress</Text>

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
                Current Weight: {userData?.currentWeight || 75}kg
              </Text>
              <Text style={styles.goalDetailsText}>
                Goal Weight: {userData?.goalWeight || 65}kg
              </Text>
              <Text style={styles.goalDetailsText}>
                To Lose: {(userData?.currentWeight || 75) - (userData?.goalWeight || 65)}kg
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
