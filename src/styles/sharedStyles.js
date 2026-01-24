// Shared styles for consistent UI across the app
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#5FD4C4',      // Teal - main brand color
  secondary: '#4A90E2',    // Blue - secondary actions
  success: '#4CAF50',      // Green - success/save actions
  danger: '#E74C3C',       // Red - delete/clear actions
  warning: '#FF9800',      // Orange - warning actions
  info: '#9C27B0',         // Purple - info actions
  dark: '#333',
  lightGray: '#F8F9FA',
  mediumGray: '#999',
  white: '#fff',
};

export const sharedStyles = StyleSheet.create({
  // Centered Title Styles
  titleCentered: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleCentered: {
    fontSize: 14,
    color: COLORS.mediumGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Vibrant Button Styles
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successButton: {
    backgroundColor: COLORS.success,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoButton: {
    backgroundColor: COLORS.info,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonTextSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
