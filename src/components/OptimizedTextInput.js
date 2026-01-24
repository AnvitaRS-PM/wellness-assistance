import React, { useState, useCallback, useRef } from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import CalmTheme from '../styles/CalmTheme';

/**
 * OptimizedTextInput - Prevents input lag by reducing re-renders
 * 
 * Features:
 * - Internal state management for smooth typing
 * - Heavily debounced updates to parent component
 * - Memoized to prevent unnecessary re-renders
 * - Optimized for maximum performance
 */
const OptimizedTextInput = React.memo(({
  value,
  onChangeText,
  debounceMs = 500, // Increased from 300ms
  style,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const timeoutRef = useRef(null);

  const handleChange = useCallback((text) => {
    // Update internal state immediately for smooth typing
    setInternalValue(text);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce updates to parent
    timeoutRef.current = setTimeout(() => {
      onChangeText(text);
    }, debounceMs);
  }, [onChangeText, debounceMs]);

  // Sync internal value when prop changes externally
  React.useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <RNTextInput
      {...props}
      value={internalValue}
      onChangeText={handleChange}
      style={[styles.input, style]}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: CalmTheme.colors.surface,
    borderWidth: 1,
    borderColor: CalmTheme.colors.border,
    borderRadius: CalmTheme.borderRadius.md,
    paddingVertical: 10,  // Reduced from 14
    paddingHorizontal: 12, // Reduced from 16
    fontSize: CalmTheme.typography.fontSize.base, // Now 14 instead of 16
    color: CalmTheme.colors.text,
  },
});

export default OptimizedTextInput;
