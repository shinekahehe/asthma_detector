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
import { Card } from '../components';
import { getLatest, getHistory } from '../services/api';
import { CARETAKER_DATA } from '../constants/mockData';

const PATIENT_NAME = 'Priya';

export const CaretakerDashboard = ({ navigation }) => {
  const [latestData, setLatestData] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [latest, historyData] = await Promise.all([
        getLatest(PATIENT_NAME),
        getHistory(PATIENT_NAME, 50),
      ]);
      setLatestData(latest);
      const today = new Date().toDateString();
      const alerts = historyData.filter(
        (h) =>
          (h.status === 'attack' || h.status === 'mild') &&
          new Date(h.timestamp).toDateString() === today
      );
      setAlertCount(alerts.length);
    } catch (e) {
      setError('Cannot reach server. Displaying cached data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const currentStatus = latestData?.status ?? CARETAKER_DATA.currentStatus;
  const lastAlertText = latestData?.timestamp
    ? `${new Date(latestData.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })} — ${latestData.status === 'attack'
      ? 'Attack Suspected'
      : latestData.status === 'mild'
        ? 'Mild Abnormality'
        : 'Normal'
    }`
    : CARETAKER_DATA.lastAlert;

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'normal': return COLORS.success;
      case 'mild': return COLORS.warning;
      case 'attack': return COLORS.danger;
      default: return COLORS.gray400;
    }
  };

  const getStatusLabel = () => {
    switch (currentStatus) {
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Patient Overview 🏥</Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Patient Card */}
        <Card style={styles.patientCard}>
          <Text style={styles.patientName}>{CARETAKER_DATA.linkedPatient}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor() },
                ]}
              >
                <Text style={styles.statusBadgeText}>{getStatusLabel()}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Alert Summary */}
        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>Latest Alert</Text>
          <Card style={styles.alertSummaryCard}>
            <Text style={styles.alertText}>{lastAlertText}</Text>
            <Text style={styles.alertTime}>Action required: Monitor closely</Text>
          </Card>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's Quick Stats</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>
                {loading ? '…' : alertCount}
              </Text>
              <Text style={styles.statLabel}>Alerts</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>
                {loading ? '…' : latestData?.confidence ?? '—'}
              </Text>
              <Text style={styles.statLabel}>Last Conf. %</Text>
            </Card>
          </View>
        </View>

        {/* View History Button */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('CaretakerHistory')}
        >
          <Text style={styles.viewButtonText}>📊 View Full History</Text>
        </TouchableOpacity>
      </ScrollView>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Patient Overview 🏥</Text>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Patient Card */}
          <Card style={styles.patientCard}>
            <Text style={styles.patientName}>{CARETAKER_DATA.linkedPatient}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Current Status:</Text>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={[styles.statusValue, { color: getStatusColor() }]}>
                  {getStatusLabel()}
                </Text>
              )}
            </View>
            <View style={styles.timestampRow}>
              <Text style={styles.timestampLabel}>📍 Last Reading</Text>
              <Text style={styles.timestamp}>{lastAlertText}</Text>
            </View>
          </Card>

          {/* Alert Summary Card */}
          <Card style={styles.alertCard}>
            <View style={styles.alertIconSection}>
              <Text style={styles.alertIcon}>⚠️</Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Today's Alerts</Text>
              <Text style={styles.alertCount}>{alertCount} abnormal readings</Text>
            </View>
          </Card>

          {/* Action Card */}
          <Card style={styles.actionCard}>
            <TouchableOpacity
              style={styles.actionLink}
              onPress={() => navigation.navigate('CaretakerHistory')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <View>
                <Text style={styles.actionTitle}>View Full History</Text>
                <Text style={styles.actionSubtitle}>See all readings & trends</Text>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.gray900,
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
  patientCard: {
    marginBottom: 20,
    paddingVertical: 18,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  alertSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 10,
  },
  alertSummaryCard: {
    paddingVertical: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
