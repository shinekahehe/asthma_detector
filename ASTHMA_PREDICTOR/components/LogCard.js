import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';

export const LogCard = ({ date, time, severity, confidence, style }) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'attack':
        return { bg: COLORS.lightRed, text: COLORS.danger };
      case 'mild':
        return { bg: COLORS.lightYellow, text: COLORS.warning };
      case 'normal':
        return { bg: COLORS.lightGreen, text: COLORS.success };
      default:
        return { bg: COLORS.gray100, text: COLORS.gray500 };
    }
  };

  const getSeverityLabel = () => {
    switch (severity) {
      case 'attack':
        return 'Attack Suspected';
      case 'mild':
        return 'Mild Abnormality';
      case 'normal':
        return 'Normal';
      default:
        return 'Unknown';
    }
  };

  const { bg, text } = getSeverityColor();

  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      <View style={styles.header}>
        <View style={styles.dateTimeSection}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: bg }]}>
          <Text style={[styles.severityText, { color: text }]}>
            {getSeverityLabel()}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.confidenceLabel}>Confidence</Text>
        <Text style={styles.confidenceValue}>{confidence}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dateTimeSection: {
    flex: 1,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
