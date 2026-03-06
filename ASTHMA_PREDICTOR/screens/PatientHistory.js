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
import { LogCard } from '../components';
import { getHistory } from '../services/api';
import { PATIENT_DATA, PATIENT_HISTORY } from '../constants/mockData';

export const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setError(null);
      const data = await getHistory(PATIENT_DATA.name, 50);
      setHistory(data);
    } catch (e) {
      setError('Could not load history from server. Showing local data.');
      setHistory(PATIENT_HISTORY);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [fetchHistory]);

  // Map backend doc → what LogCard expects
  const formatItem = (item) => ({
    id: item._id ?? item.id,
    date: item.timestamp
      ? new Date(item.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      : item.date,
    time: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      : item.time,
    severity: item.status ?? item.severity,
    confidence: item.confidence,
  });

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
        <Text style={styles.title}>Health History</Text>
        <Text style={styles.subtitle}>{history.length} readings logged</Text>
        {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
      </View>

      <View style={Platform.OS === 'web' ? [styles.flatListContainer, { maxHeight: Dimensions.get('window').height - 200 }] : styles.flatListContainer}>
        <FlatList
          data={history}
          keyExtractor={(item) => (item._id ?? item.id)?.toString()}
          renderItem={({ item }) => {
            const f = formatItem(item);
            return (
              <LogCard
                date={f.date}
                time={f.time}
                severity={f.severity}
                confidence={f.confidence}
              />
            );
          }}
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
