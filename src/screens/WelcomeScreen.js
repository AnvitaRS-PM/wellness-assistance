import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

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
        <Text style={styles.title}>Welcome to Wellness Assistance</Text>
        
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  buttonGroup: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#D3D3D3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  secondaryButton: {
    backgroundColor: '#D3D3D3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
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
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#D3D3D3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
