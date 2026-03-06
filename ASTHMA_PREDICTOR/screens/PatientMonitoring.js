import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';
import { Card } from '../components';
import { predict } from '../services/api';
import { PATIENT_DATA } from '../constants/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a synthetic feature vector for demo purposes.
 *
 * In production, replace this with actual sensor/audio feature extraction
 * (e.g. MFCC coefficients from a 15-second breath recording).
 */
function generateDemoFeatures(length = 40) {
  return Array.from({ length }, () => Math.random());
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PatientMonitoring = ({ navigation }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const waveAnimation = useMemo(() => new Animated.Value(0), []);

  // Keep a stable ref so the stop handler always sees the latest value
  const isMonitoringRef = useRef(true);
  isMonitoringRef.current = isMonitoring;

  // Timer
  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Wave animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [waveAnimation]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const waveScale = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  // ── Stop monitoring: call API, show result, navigate back ────────────────
  const handleStop = async () => {
    setIsMonitoring(false);
    setPredicting(true);

    try {
      const features = generateDemoFeatures(40);
      const result = await predict(features, PATIENT_DATA.name);

      const statusLabel =
        result.status === 'attack'
          ? '⚠️ Attack Suspected'
          : result.status === 'mild'
            ? '😐 Mild Abnormality'
            : '✅ Normal';

      Alert.alert(
        'Prediction Result',
        `Status: ${statusLabel}\nConfidence: ${result.confidence}%`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert(
        'Server Unavailable',
        'Could not get a prediction from the server. Please check your connection.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setPredicting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monitoring Active</Text>
        <Text style={styles.subtitle}>
          {predicting ? 'Analysing data...' : 'Collecting data...'}
        </Text>
      </View>

      {/* Waveform Placeholder */}
      <View style={styles.waveformContainer}>
        <Card style={styles.waveformCard}>
          <Text style={styles.waveformLabel}>📡 Sensor Data</Text>
          <Animated.View
            style={[
              styles.waveform,
              {
                transform: [{ scale: waveScale }],
              },
            ]}
          >
            <View style={styles.waveLine} />
            <View style={styles.waveAmplitude} />
            <View style={styles.waveLine} />
          </Animated.View>
          <Text style={styles.waveformStatus}>
            {predicting ? 'Sending to backend...' : 'Recording breath sounds...'}
          </Text>
        </Card>
      </View>

      {/* Timer */}
      <Card style={styles.timerCard}>
        <Text style={styles.timerLabel}>Elapsed Time</Text>
        <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
        <Text style={styles.timerInfo}>Recording 15s every 30s</Text>
      </Card>

      {/* Status Info */}
      <Card style={styles.statusCard}>
        <View style={styles.statusItem}>
          <Text style={styles.statusIcon}>✓</Text>
          <Text style={styles.statusText}>Device connected</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusIcon}>✓</Text>
          <Text style={styles.statusText}>Signal quality: Good</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={[styles.statusIcon, predicting && { color: COLORS.warning }]}>
            {predicting ? '⟳' : '✓'}
          </Text>
          <Text style={styles.statusText}>
            {predicting ? 'Syncing with backend...' : 'Data synced'}
          </Text>
        </View>
      </Card>

      {/* Stop Button */}
      <TouchableOpacity
        style={[styles.stopButton, predicting && styles.stopButtonDisabled]}
        onPress={handleStop}
        disabled={predicting}
      >
        <Text style={styles.stopButtonText}>
          {predicting ? '⏳ Analysing...' : '⏹️ Stop Monitoring'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  waveformContainer: {
    marginBottom: 20,
  },
  waveformCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  waveformLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 16,
  },
  waveform: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  waveLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: 4,
  },
  waveAmplitude: {
    width: '80%',
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.lightBlue,
    marginVertical: 4,
  },
  waveformStatus: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
  },
  timerCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 20,
  },
  timerLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 8,
    fontWeight: '500',
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    fontFamily: 'Menlo',
  },
  timerInfo: {
    fontSize: 13,
    color: COLORS.gray500,
  },
  statusCard: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  statusIcon: {
    fontSize: 18,
    color: COLORS.success,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 14,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  stopButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  stopButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  stopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
