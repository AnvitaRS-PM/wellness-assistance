import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';
import { openAIService } from '../services/openAIService';

export default function RecommendationsScreen({ navigation }) {
  const { userData, updateUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await openAIService.generateDietRecommendations(userData);
      setRecommendations(result);
      updateUserData({ recommendations: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    generateRecommendations();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Generating your personalized diet plan...</Text>
          <Text style={styles.subText}>This may take a few moments</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={styles.backButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Diet Assessment Based on your Conditions</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diet Type:</Text>
          <Text style={styles.cardContent}>{recommendations?.dietType || 'Not specified'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>No of Meals:</Text>
          <Text style={styles.cardContent}>{recommendations?.numberOfMeals || 'Not specified'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meal Schedule:</Text>
          <Text style={styles.cardContent}>{recommendations?.mealSchedule || 'Not specified'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Food Items (For Healing & Health)</Text>
          <Text style={styles.sectionSubtitle}>These foods are specifically chosen to help manage your health conditions and achieve your wellness goals.</Text>
          {recommendations?.recommendedFoods && recommendations.recommendedFoods.length > 0 ? (
            recommendations.recommendedFoods.map((food, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listItemText}>{food}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>No specific recommendations</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Items to Avoid</Text>
          <Text style={styles.sectionSubtitle}>These foods may worsen your conditions or hinder your progress toward your goals.</Text>
          {recommendations?.foodsToAvoid && recommendations.foodsToAvoid.length > 0 ? (
            recommendations.foodsToAvoid.map((food, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listItemText}>{food}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>No specific restrictions</Text>
          )}
        </View>

        {recommendations?.rationale && (
          <View style={styles.rationaleCard}>
            <Text style={styles.rationaleTitle}>Why this plan?</Text>
            <Text style={styles.rationaleText}>{recommendations.rationale}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => navigation.navigate('MealRecommendations')}
        >
          <Text style={styles.continueButtonText}>Continue to Meal Planning</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.secondaryButtonText}>Start Over</Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardContent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 8,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  rationaleCard: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  rationaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C5F8D',
  },
  rationaleText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
