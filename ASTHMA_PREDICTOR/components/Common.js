import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';

export const Card = ({ children, style, elevated = true }) => {
  return (
    <View
      style={[
        styles.card,
        elevated ? SHADOWS.md : SHADOWS.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const SafeAreaView = ({ children, style }) => {
  return <View style={[styles.safeArea, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
