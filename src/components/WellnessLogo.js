import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function WellnessLogo({ size = 120, color = '#A8D5BA' }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Simple Heart Shape */}
        <Path
          d="M60 105C60 105 15 80 15 50C15 35 25 25 37.5 25C47.5 25 55 32 60 40C65 32 72.5 25 82.5 25C95 25 105 35 105 50C105 80 60 105 60 105Z"
          fill={color}
          opacity="0.95"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
