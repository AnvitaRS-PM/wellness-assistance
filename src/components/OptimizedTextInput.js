import React, { useState, useCallback } from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import CalmTheme from '../styles/CalmTheme';

/**
 * OptimizedTextInput - Prevents input lag by reducing re-renders
 * 
 * Features:
 * - Internal state management for smooth typing
 * - Debounced updates to parent component
 * - Memoized to prevent unnecessary re-renders
 */
const OptimizedTextInput = React.memo(({
  value,
  onChangeText,
  debounceMs = 300,
  style,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleChange = useCallback((text) => {
    // Update internal state immediately for smooth typing
    setInternalValue(text);

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Debounce updates to parent
    const newTimeoutId = setTimeout(() => {
      onChangeText(text);
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  }, [onChangeText, debounceMs, timeoutId]);

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
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: CalmTheme.typography.fontSize.base,
    color: CalmTheme.colors.text,
  },
});

export default OptimizedTextInput;
