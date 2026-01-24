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
  
  // Typography - Further reduced (total 4px smaller from original)
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 8,       // was 12, now 8 (total -4px)
      sm: 10,      // was 14, now 10 (total -4px)
      base: 12,    // was 16, now 12 (total -4px)
      lg: 14,      // was 18, now 14 (total -4px)
      xl: 16,      // was 20, now 16 (total -4px)
      xxl: 20,     // was 24, now 20 (total -4px)
      xxxl: 24,    // was 28, now 24 (total -4px)
      display: 28, // was 32, now 28 (total -4px)
    },
    lineHeight: {
      tight: 1.15,     // was 1.25, tighter
      normal: 1.3,     // was 1.5, tighter
      relaxed: 1.5,    // was 1.75, tighter
    },
  },
  
  // Spacing - Further reduced (total reduction from original)
  spacing: {
    xs: 1,       // was 4, now 1
    sm: 4,       // was 8, now 4
    md: 8,       // was 12, now 8
    base: 12,    // was 16, now 12
    lg: 16,      // was 20, now 16
    xl: 20,      // was 24, now 20
    xxl: 24,     // was 32, now 24
    xxxl: 32,    // was 40, now 32
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
  
  // Component-specific styles - Further reduced
  components: {
    button: {
      primary: {
        bg: '#A8D5BA',
        text: '#FFFFFF',
        borderRadius: 12,        // was 16, now 12
        paddingVertical: 10,     // was 16, now 10
        paddingHorizontal: 16,   // was 24, now 16
      },
      secondary: {
        bg: '#B8A8D5',
        text: '#FFFFFF',
        borderRadius: 12,        // was 16, now 12
        paddingVertical: 10,     // was 16, now 10
        paddingHorizontal: 16,   // was 24, now 16
      },
      accent: {
        bg: '#E8C4A8',
        text: '#FFFFFF',
        borderRadius: 12,        // was 16, now 12
        paddingVertical: 10,     // was 16, now 10
        paddingHorizontal: 16,   // was 24, now 16
      },
      ghost: {
        bg: 'transparent',
        text: '#A8D5BA',
        border: '#A8D5BA',
        borderRadius: 12,        // was 16, now 12
        paddingVertical: 8,      // was 14, now 8
        paddingHorizontal: 16,   // was 24, now 16
      },
    },
    card: {
      bg: '#FDFCFB',
      borderRadius: 12,    // was 20, now 12
      padding: 12,         // was 20, now 12
      shadow: 'md',
    },
    input: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderFocus: '#A8D5BA',
      borderRadius: 8,            // was 12, now 8
      paddingVertical: 8,         // was 14, now 8
      paddingHorizontal: 10,      // was 16, now 10
    },
  },
};

export default CalmTheme;
