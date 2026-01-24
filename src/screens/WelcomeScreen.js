import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import WellnessLogo from '../components/WellnessLogo';
import CalmTheme from '../styles/CalmTheme';

export default function WelcomeScreen({ navigation }) {
  const handleContinueWithGmail = () => {
    // In production, integrate with Google Auth
    navigation.navigate('Personalization');
  };

  const handleContinueWithIPhone = () => {
    // In production, integrate with Apple Auth
    navigation.navigate('Personalization');
  };

  const handleContinueWithFacebook = () => {
    // In production, integrate with Facebook Auth
    navigation.navigate('Personalization');
  };

  const handleSignUpWithEmail = () => {
    // In production, show email/password form
    navigation.navigate('Personalization');
  };

  const handleLogin = () => {
    // In production, show login form
    navigation.navigate('Personalization');
  };

  const handleGuestUser = () => {
    navigation.navigate('Personalization');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <WellnessLogo size={100} color={CalmTheme.colors.primary} />
        </View>
        
        <Text style={styles.title}>Welcome to Wellness Assistance</Text>
        <Text style={styles.subtitle}>Your journey to better health starts here</Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleContinueWithGmail}>
            <Text style={styles.primaryButtonText}>Continue with Gmail</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinueWithIPhone}>
            <Text style={styles.primaryButtonText}>Continue with iPhone</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinueWithFacebook}>
            <Text style={styles.primaryButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUpWithEmail}>
          <Text style={styles.secondaryButtonText}>Sign up with Email</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuestUser}>
          <Text style={styles.guestButtonText}>Enter as a Guest User</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CalmTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: CalmTheme.colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: CalmTheme.colors.textLight,
    lineHeight: 20,
  },
  buttonGroup: {
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: CalmTheme.colors.primary,
    padding: 14,
    borderRadius: CalmTheme.borderRadius.lg,
    marginBottom: 10,
    alignItems: 'center',
    ...CalmTheme.shadows.md,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: CalmTheme.colors.secondary,
    padding: 14,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: 12,
    ...CalmTheme.shadows.md,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: CalmTheme.colors.divider,
  },
  dividerText: {
    marginHorizontal: 10,
    color: CalmTheme.colors.textLighter,
    fontSize: 12,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    fontSize: 13,
    color: CalmTheme.colors.textLight,
  },
  loginLink: {
    fontSize: 13,
    color: CalmTheme.colors.primary,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: CalmTheme.colors.accent,
    padding: 14,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: 20,
    ...CalmTheme.shadows.md,
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
