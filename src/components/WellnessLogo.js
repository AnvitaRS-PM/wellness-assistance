import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function WellnessLogo({ size = 120, color = '#A8D5BA' }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Heart Shape */}
        <Path
          d="M60 105C60 105 15 80 15 50C15 35 25 25 37.5 25C47.5 25 55 32 60 40C65 32 72.5 25 82.5 25C95 25 105 35 105 50C105 80 60 105 60 105Z"
          fill={color}
          opacity="0.9"
        />
        
        {/* Dumbbells - Two crossed dumbbells */}
        
        {/* First Dumbbell (left-leaning) */}
        {/* Left weight plate */}
        <Rect
          x="32"
          y="42"
          width="10"
          height="18"
          rx="2"
          fill="#FFFFFF"
          transform="rotate(-35 37 51)"
        />
        {/* Left handle connector */}
        <Rect
          x="40"
          y="47"
          width="4"
          height="8"
          rx="1"
          fill="#FFFFFF"
          transform="rotate(-35 42 51)"
        />
        {/* Center bar */}
        <Rect
          x="42"
          y="48"
          width="30"
          height="6"
          rx="2"
          fill="#FFFFFF"
          transform="rotate(-35 57 51)"
        />
        {/* Right handle connector */}
        <Rect
          x="70"
          y="47"
          width="4"
          height="8"
          rx="1"
          fill="#FFFFFF"
          transform="rotate(-35 72 51)"
        />
        {/* Right weight plate */}
        <Rect
          x="72"
          y="42"
          width="10"
          height="18"
          rx="2"
          fill="#FFFFFF"
          transform="rotate(-35 77 51)"
        />
        
        {/* Second Dumbbell (right-leaning, crossing over) */}
        {/* Left weight plate */}
        <Rect
          x="38"
          y="47"
          width="10"
          height="18"
          rx="2"
          fill="#FFFFFF"
          transform="rotate(35 43 56)"
        />
        {/* Left handle connector */}
        <Rect
          x="46"
          y="52"
          width="4"
          height="8"
          rx="1"
          fill="#FFFFFF"
          transform="rotate(35 48 56)"
        />
        {/* Center bar */}
        <Rect
          x="48"
          y="53"
          width="30"
          height="6"
          rx="2"
          fill="#FFFFFF"
          transform="rotate(35 63 56)"
        />
        {/* Right handle connector */}
        <Rect
          x="76"
          y="52"
          width="4"
          height="8"
          rx="1"
          fill="#FFFFFF"
          transform="rotate(35 78 56)"
        />
        {/* Right weight plate */}
        <Rect
          x="78"
          y="47"
          width="10"
          height="18"
          rx="2"
          fill="#FFFFFF"
          transform="rotate(35 83 56)"
        />
        
        {/* Center circle highlight (where dumbbells cross) */}
        <Circle
          cx="60"
          cy="54"
          r="8"
          fill="#FFFFFF"
          opacity="0.3"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
