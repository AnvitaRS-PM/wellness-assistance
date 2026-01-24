import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

export default function WellnessLogo({ size = 120, color = '#A8D5BA' }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Heart Shape */}
        <Path
          d="M60 105C60 105 15 80 15 50C15 35 25 25 40 25C50 25 60 35 60 35C60 35 70 25 80 25C95 25 105 35 105 50C105 80 60 105 60 105Z"
          fill={color}
          opacity="0.9"
        />
        
        {/* Flexed Arm Silhouette - Upper Arm */}
        <Path
          d="M45 50C45 50 48 45 52 45C56 45 58 48 58 52C58 56 56 62 56 62"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Forearm */}
        <Path
          d="M56 62C56 62 58 68 60 72"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Bicep Muscle Bulge */}
        <Path
          d="M50 50C50 50 54 48 58 50C58 50 60 54 58 58C56 60 52 60 50 58C48 56 48 52 50 50Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        
        {/* Hand/Fist */}
        <Path
          d="M60 72C60 72 62 74 65 74C68 74 70 72 70 69C70 66 68 64 65 64C62 64 60 66 60 69"
          fill="#FFFFFF"
          opacity="0.9"
        />
        
        {/* Additional muscle definition lines */}
        <Path
          d="M52 54L54 56M54 58L56 60"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
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
