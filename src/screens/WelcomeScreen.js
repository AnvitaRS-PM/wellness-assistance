import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
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
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <WellnessLogo size={140} color={CalmTheme.colors.primary} />
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CalmTheme.colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: CalmTheme.colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: CalmTheme.colors.textLight,
    lineHeight: 24,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: CalmTheme.colors.primary,
    padding: 16,
    borderRadius: CalmTheme.borderRadius.lg,
    marginBottom: 12,
    alignItems: 'center',
    ...CalmTheme.shadows.md,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: CalmTheme.colors.secondary,
    padding: 16,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: 16,
    ...CalmTheme.shadows.md,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: CalmTheme.colors.divider,
  },
  dividerText: {
    marginHorizontal: 10,
    color: CalmTheme.colors.textLighter,
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: CalmTheme.colors.textLight,
  },
  loginLink: {
    fontSize: 14,
    color: CalmTheme.colors.primary,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: CalmTheme.colors.accent,
    padding: 16,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    ...CalmTheme.shadows.md,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
