// Calm Wellness Theme Configuration
// Soft, soothing colors for a peaceful user experience

export const CalmTheme = {
  // Primary Colors - Soft, calming palette
  colors: {
    // Main brand colors - Soft sage and lavender
    primary: '#A8D5BA',        // Soft Sage Green - calming, natural
    primaryLight: '#C8E6D0',   // Lighter sage
    primaryDark: '#88B59A',    // Deeper sage
    
    secondary: '#B8A8D5',      // Soft Lavender - peaceful, relaxing
    secondaryLight: '#D0C8E6', // Lighter lavender
    secondaryDark: '#9A88B5',  // Deeper lavender
    
    // Accent colors - Warm and welcoming
    accent: '#E8C4A8',         // Soft Peach - warm, friendly
    accentPink: '#F5C8D0',     // Soft Pink - gentle, caring
    accentBlue: '#A8C4E8',     // Soft Sky Blue - calm, clear
    
    // Neutrals - Warm grays and creams
    background: '#F8F6F3',     // Warm off-white
    surface: '#FFFFFF',        // Pure white
    cardBg: '#FDFCFB',         // Subtle cream
    
    // Text colors - Soft and readable
    text: '#4A5568',           // Warm dark gray
    textLight: '#718096',      // Medium gray
    textLighter: '#A0AEC0',    // Light gray
    
    // Functional colors - Muted versions
    success: '#9BC995',        // Soft green
    warning: '#F5D99C',        // Soft amber
    error: '#E8A8A8',          // Soft rose
    info: '#A8C4E8',           // Soft blue
    
    // UI elements
    border: '#E2E8F0',         // Very light gray
    divider: '#EDF2F7',        // Barely visible gray
    shadow: 'rgba(74, 85, 104, 0.1)', // Soft shadow
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      display: 32,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing (using 4px base unit)
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
  
  // Border radius - More rounded for calm feel
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  // Shadows - Softer, more subtle
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
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  
  // Component-specific styles
  components: {
    button: {
      primary: {
        bg: '#A8D5BA',
        text: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
      secondary: {
        bg: '#B8A8D5',
        text: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
      accent: {
        bg: '#E8C4A8',
        text: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
      ghost: {
        bg: 'transparent',
        text: '#A8D5BA',
        border: '#A8D5BA',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
    },
    card: {
      bg: '#FDFCFB',
      borderRadius: 20,
      padding: 20,
      shadow: 'md',
    },
    input: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderFocus: '#A8D5BA',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
  },
};

export default CalmTheme;
