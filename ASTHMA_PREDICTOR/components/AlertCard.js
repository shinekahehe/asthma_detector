import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';

export const AlertCard = ({ title, message, severity, timestamp, style }) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return COLORS.danger;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.success;
      default:
        return COLORS.gray400;
    }
  };

  const getSeverityBgColor = () => {
    switch (severity) {
      case 'high':
        return COLORS.lightRed;
      case 'medium':
        return COLORS.lightYellow;
      case 'low':
        return COLORS.lightGreen;
      default:
        return COLORS.gray100;
    }
  };

  return (
    <View style={[styles.card, SHADOWS.md, style]}>
      <View style={styles.header}>
        <View
          style={[
            styles.severityIndicator,
            { backgroundColor: getSeverityColor() },
          ]}
        />
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
      <View
        style={[
          styles.messageContainer,
          { backgroundColor: getSeverityBgColor() },
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  messageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  message: {
    fontSize: 13,
    color: COLORS.gray800,
    lineHeight: 18,
  },
});
