import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';

export const ModeSelection = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>AsthmaCare AI</Text>
          <Text style={styles.subtitle}>Choose Your Role</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.modeButton, styles.patientButton]}
            onPress={() => navigation.navigate('PatientStack')}
          >
            <Text style={styles.buttonIcon}>👤</Text>
            <Text style={styles.buttonTitle}>Patient Mode</Text>
            <Text style={styles.buttonDescription}>
              Monitor your asthma health
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, styles.caretakerButton]}
            onPress={() => navigation.navigate('CaretakerStack')}
          >
            <Text style={styles.buttonIcon}>🏥</Text>
            <Text style={styles.buttonTitle}>Caretaker Mode</Text>
            <Text style={styles.buttonDescription}>
              Monitor patient health
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray600,
  },
  buttonContainer: {
    gap: 16,
  },
  modeButton: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  patientButton: {
    backgroundColor: COLORS.lightBlue,
  },
  caretakerButton: {
    backgroundColor: COLORS.lightGreen,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: 'center',
  },
});
