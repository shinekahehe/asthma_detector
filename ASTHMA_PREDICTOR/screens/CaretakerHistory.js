import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { AlertCard } from '../components';
import { getHistory } from '../services/api';
import { CARETAKER_ALERTS } from '../constants/mockData';

const PATIENT_NAME = 'Priya';

export const CaretakerHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const history = await getHistory(PATIENT_NAME, 50);
      // Map backend prediction records to AlertCard props
      const mapped = history.map((h) => ({
        id: h._id,
        status: h.status,
        title:
          h.status === 'attack'
            ? 'Attack Suspected'
            : h.status === 'mild'
              ? 'Mild Abnormality'
              : 'Normal',
        severity:
          h.status === 'attack'
            ? 'high'
            : h.status === 'mild'
              ? 'medium'
              : 'low',
        message: `Confidence: ${h.confidence}%`,
        timestamp: new Date(h.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setAlerts(mapped);
    } catch (e) {
      setError('Could not load alerts from server. Showing local data.');
      setAlerts(CARETAKER_ALERTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlerts();
  }, [fetchAlerts]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alert History</Text>
        <Text style={styles.subtitle}>{alerts.length} alerts logged</Text>
        {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
      </View>

      <View style={Platform.OS === 'web' ? [styles.flatListContainer, { maxHeight: Dimensions.get('window').height - 200 }] : styles.flatListContainer}>
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <AlertCard
              title={item.title}
              message={item.message}
              severity={item.severity}
              timestamp={item.timestamp}
            />
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flatListContainer: {
    flex: 1,
    width: '100%',
    overflow: 'auto',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray600,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.warning,
    marginTop: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
