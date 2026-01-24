import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import CalmTheme from '../styles/CalmTheme';

/**
 * SimpleTextInput - No optimization, just a styled TextInput
 * 
 * All the "optimization" was causing slowness. This is just a basic TextInput.
 */
const SimpleTextInput = React.memo(({
  value,
  onChangeText,
  style,
  ...props
}) => {
  // NO DEBOUNCING, NO INTERNAL STATE, NO COMPLEXITY
  // Just pass everything straight through
  return (
    <RNTextInput
      {...props}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style]}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: CalmTheme.colors.surface,
    borderWidth: 1,
    borderColor: CalmTheme.colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: CalmTheme.colors.text,
  },
});

export default SimpleTextInput;
