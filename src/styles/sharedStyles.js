// Shared styles for consistent UI across the app
// Now using the Calm Theme for a peaceful, soothing experience
import { StyleSheet } from 'react-native';
import CalmTheme from './CalmTheme';

export const COLORS = CalmTheme.colors;

export const sharedStyles = StyleSheet.create({
  // Centered Title Styles
  titleCentered: {
    fontSize: CalmTheme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: CalmTheme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitleCentered: {
    fontSize: CalmTheme.typography.fontSize.base,
    color: CalmTheme.colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Calm Theme Button Styles
  primaryButton: {
    backgroundColor: CalmTheme.colors.primary,
    padding: 18,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: 8,
    ...CalmTheme.shadows.md,
  },
  secondaryButton: {
    backgroundColor: CalmTheme.colors.secondary,
    padding: 18,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: 8,
    ...CalmTheme.shadows.md,
  },
  accentButton: {
    backgroundColor: CalmTheme.colors.accent,
    padding: 18,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: 8,
    ...CalmTheme.shadows.md,
  },
  successButton: {
    backgroundColor: CalmTheme.colors.success,
    padding: 18,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: 8,
    ...CalmTheme.shadows.md,
  },
  warningButton: {
    backgroundColor: CalmTheme.colors.warning,
    padding: 18,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: 8,
    ...CalmTheme.shadows.md,
  },
  infoButton: {
    backgroundColor: CalmTheme.colors.info,
    padding: 18,
    borderRadius: CalmTheme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: 8,
    ...CalmTheme.shadows.md,
  },
  buttonText: {
    fontSize: CalmTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonTextSmall: {
    fontSize: CalmTheme.typography.fontSize.base,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  // Card styles
  card: {
    backgroundColor: CalmTheme.colors.cardBg,
    borderRadius: CalmTheme.borderRadius.xl,
    padding: CalmTheme.spacing.xl,
    marginVertical: CalmTheme.spacing.md,
    ...CalmTheme.shadows.md,
  },
  
  // Input styles
  input: {
    backgroundColor: CalmTheme.colors.surface,
    borderWidth: 1,
    borderColor: CalmTheme.colors.border,
    borderRadius: CalmTheme.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: CalmTheme.typography.fontSize.base,
    color: CalmTheme.colors.text,
  },
});

export default sharedStyles;
