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
  
  // Typography - Moderate reduction for performance and readability
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 11,      // was 12, reasonable reduction
      sm: 13,      // was 14, reasonable reduction
      base: 15,    // was 16, reasonable reduction
      lg: 17,      // was 18, reasonable reduction
      xl: 19,      // was 20, reasonable reduction
      xxl: 22,     // was 24, reasonable reduction
      xxxl: 26,    // was 28, reasonable reduction
      display: 30, // was 32, reasonable reduction
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  // Spacing - Moderate reduction for performance
  spacing: {
    xs: 4,       // was 4, keep reasonable
    sm: 6,       // was 8, small reduction
    md: 10,      // was 12, small reduction
    base: 14,    // was 16, small reduction
    lg: 18,      // was 20, small reduction
    xl: 22,      // was 24, small reduction
    xxl: 28,     // was 32, small reduction
    xxxl: 36,    // was 40, small reduction
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
  
  // Component-specific styles - Balanced for performance and space
  components: {
    button: {
      primary: {
        bg: '#A8D5BA',
        text: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
      },
      secondary: {
        bg: '#B8A8D5',
        text: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
      },
      accent: {
        bg: '#E8C4A8',
        text: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
      },
      ghost: {
        bg: 'transparent',
        text: '#A8D5BA',
        border: '#A8D5BA',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 18,
      },
    },
    card: {
      bg: '#FDFCFB',
      borderRadius: 14,
      padding: 14,
      shadow: 'md',
    },
    input: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderFocus: '#A8D5BA',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
  },
};

export default CalmTheme;
