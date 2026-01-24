// Simplified Theme - Performance optimized but with all needed properties
// Static values instead of complex calculations

export const CalmTheme = {
  colors: {
    primary: '#A8D5BA',
    primaryLight: '#C8E6D0',
    primaryDark: '#88B59A',
    secondary: '#B8A8D5',
    secondaryLight: '#D0C8E6',
    secondaryDark: '#9A88B5',
    accent: '#E8C4A8',
    accentPink: '#F5C8D0',
    accentBlue: '#A8C4E8',
    background: '#F8F6F3',
    surface: '#FFFFFF',
    cardBg: '#FDFCFB',
    text: '#4A5568',
    textLight: '#718096',
    textLighter: '#A0AEC0',
    success: '#9BC995',
    warning: '#F5D99C',
    error: '#E8A8A8',
    info: '#A8C4E8',
    border: '#E2E8F0',
    divider: '#EDF2F7',
    shadow: 'rgba(74, 85, 104, 0.1)',
  },
  
  // Simple typography - static values
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 11,
      sm: 13,
      base: 16,    // Back to 16 for compatibility
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      display: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Simple spacing - static values
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  // Simple border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  // Minimal shadows - just the structure
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  
  // Minimal components - just what's needed
  components: {
    button: {
      primary: {
        bg: '#A8D5BA',
        text: '#FFFFFF',
      },
    },
    card: {
      bg: '#FDFCFB',
    },
    input: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderFocus: '#A8D5BA',
    },
  },
};

export default CalmTheme;
