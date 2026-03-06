import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const StatusBadge = ({ status, style }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return COLORS.success;
      case 'disconnected':
        return COLORS.danger;
      case 'connecting':
        return COLORS.warning;
      default:
        return COLORS.gray400;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }, style]}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: COLORS.white,
            opacity: status === 'connecting' ? 0.6 : 1,
          },
        ]}
      />
      <Text style={styles.text}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
