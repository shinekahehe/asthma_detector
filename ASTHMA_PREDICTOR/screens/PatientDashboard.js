import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';
import { StatusBadge, Card } from '../components';
import { getLatest } from '../services/api';
import { PATIENT_DATA } from '../constants/mockData'; // fallback name/label

export const PatientDashboard = ({ navigation }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatest = useCallback(async () => {
    try {
      setError(null);
      const data = await getLatest(PATIENT_DATA.name);
      setLatestData(data);
    } catch (e) {
      setError('Unable to reach server. Showing cached data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  // Re-fetch when returning from the monitoring screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchLatest);
    return unsubscribe;
  }, [navigation, fetchLatest]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLatest();
  }, [fetchLatest]);

  // Use live data.  Fall back to mock when offline.
  const status = latestData?.status ?? PATIENT_DATA.currentStatus;
  const confidence = latestData?.confidence ?? PATIENT_DATA.confidence;
  const lastChecked = latestData?.timestamp
    ? new Date(latestData.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    : PATIENT_DATA.lastChecked;

  const getStatusColor = () => {
    switch (status) {
      case 'normal': return COLORS.success;
      case 'mild': return COLORS.warning;
      case 'attack': return COLORS.danger;
      default: return COLORS.gray400;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'mild': return 'Mild Abnormality';
      case 'attack': return 'Attack Suspected';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={[styles.webScrollContainer, { maxHeight: Dimensions.get('window').height - 100 }]}>
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={true}
          >
            {/* Greeting Section */}
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>Hi {PATIENT_DATA.name}! 👋</Text>
              <StatusBadge
                status={latestData ? 'connected' : PATIENT_DATA.deviceStatus}
                style={{ marginTop: 12 }}
              />
            </View>

            {/* Error banner */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Status Circle */}
            <View style={styles.statusCircleContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <View
                  style={[
                    styles.statusCircle,
                    { backgroundColor: getStatusColor() },
                  ]}
                >
                  <Text style={styles.statusLabel}>{getStatusLabel()}</Text>
                  <Text style={styles.confidence}>{confidence}%</Text>
                </View>
              )}
            </View>

            {/* Info Cards */}
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Checked</Text>
                <Text style={styles.infoValue}>{lastChecked}</Text>
              </View>
            </Card>

            {/* Monitor Button Section */}
            <TouchableOpacity
              style={[
                styles.monitorButton,
                isMonitoring && styles.monitorButtonActive,
              ]}
              onPress={() => {
                setIsMonitoring(!isMonitoring);
                if (!isMonitoring) {
                  navigation.navigate('PatientMonitoring');
                }
              }}
            >
              <Text style={styles.monitorButtonText}>
                {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Begin Monitoring'}
              </Text>
            </TouchableOpacity>

            {/* Quick Links */}
            <Card style={styles.quickLinksCard}>
              <TouchableOpacity
                style={styles.quickLink}
                onPress={() => navigation.navigate('PatientHistory')}
              >
                <Text style={styles.quickLinkIcon}>📊</Text>
                <View>
                  <Text style={styles.quickLinkTitle}>View History</Text>
                  <Text style={styles.quickLinkSubtitle}>See past readings</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </Card>
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Hi {PATIENT_DATA.name}! 👋</Text>
            <StatusBadge
              status={latestData ? 'connected' : PATIENT_DATA.deviceStatus}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Error banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Status Circle */}
          <View style={styles.statusCircleContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <View
                style={[
                  styles.statusCircle,
                  { backgroundColor: getStatusColor() },
                ]}
              >
                <Text style={styles.statusLabel}>{getStatusLabel()}</Text>
                <Text style={styles.confidence}>{confidence}%</Text>
              </View>
            )}
          </View>

          {/* Info Cards */}
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Checked</Text>
              <Text style={styles.infoValue}>{lastChecked}</Text>
            </View>
          </Card>

          {/* Monitor Button Section */}
          <TouchableOpacity
            style={[
              styles.monitorButton,
              isMonitoring && styles.monitorButtonActive,
            ]}
            onPress={() => {
              setIsMonitoring(!isMonitoring);
              if (!isMonitoring) {
                navigation.navigate('PatientMonitoring');
              }
            }}
          >
            <Text style={styles.monitorButtonText}>
              {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Begin Monitoring'}
            </Text>
          </TouchableOpacity>

          {/* Quick Links */}
          <Card style={styles.quickLinksCard}>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('PatientHistory')}
            >
              <Text style={styles.quickLinkIcon}>📊</Text>
              <View>
                <Text style={styles.quickLinkTitle}>View History</Text>
                <Text style={styles.quickLinkSubtitle}>See past readings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webScrollContainer: {
    width: '100%',
    overflow: 'auto',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greetingSection: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  errorBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  errorText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '500',
  },
  statusCircleContainer: {
    alignItems: 'center',
    marginBottom: 28,
    minHeight: 200,
    justifyContent: 'center',
  },
  statusCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  confidence: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  infoCard: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  monitorButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  monitorButtonActive: {
    backgroundColor: COLORS.danger,
  },
  monitorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  quickLinksCard: {
    padding: 12,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 12,
  },
  quickLinkIcon: {
    fontSize: 28,
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  quickLinkSubtitle: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  chevron: {
    marginLeft: 'auto',
    fontSize: 20,
    color: COLORS.gray400,
  },
});
