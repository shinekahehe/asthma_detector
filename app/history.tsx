import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { BottomNav } from '@/components/BottomNav';
import { RiskBadge } from '@/components/RiskBadge';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const historyData = [
    { id: '1', date: 'Feb 26, 2026', time: '2:45 PM', risk: 'normal' as const, confidence: 94 },
    { id: '2', date: 'Feb 24, 2026', time: '10:30 AM', risk: 'normal' as const, confidence: 91 },
    { id: '3', date: 'Feb 20, 2026', time: '3:15 PM', risk: 'mild' as const, confidence: 87 },
    { id: '4', date: 'Feb 18, 2026', time: '9:20 AM', risk: 'normal' as const, confidence: 95 },
    { id: '5', date: 'Feb 15, 2026', time: '4:00 PM', risk: 'normal' as const, confidence: 92 },
];

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Test History</Text>
                <Text style={styles.headerSubtitle}>{historyData.length} tests completed</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Summary Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statEmoji}>📅</Text>
                            <Text style={styles.statLabel}>This Month</Text>
                        </View>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statSub}>tests</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statEmoji}>📉</Text>
                            <Text style={styles.statLabel}>Avg Risk</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#059669' }]}>Low</Text>
                        <Text style={styles.statSub}>overall</Text>
                    </View>
                </View>

                {/* History List */}
                <View style={styles.listContainer}>
                    {historyData.map((test, index) => (
                        <TouchableOpacity
                            key={test.id}
                            style={styles.historyItem}
                            onPress={() => router.push(`/report/${test.id}` as any)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.historyItemTop}>
                                <View>
                                    <Text style={styles.historyDate}>{test.date}</Text>
                                    <Text style={styles.historyTime}>{test.time}</Text>
                                </View>
                                <Text style={styles.chevron}>›</Text>
                            </View>
                            <View style={styles.historyItemBottom}>
                                <RiskBadge level={test.risk} size="sm" />
                                <Text style={styles.historyConfidence}>{test.confidence}% confidence</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 90,
        gap: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    statEmoji: {
        fontSize: 16,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    statSub: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    listContainer: {
        gap: 10,
    },
    historyItem: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    historyItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    historyDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    historyTime: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    chevron: {
        fontSize: 22,
        color: '#9CA3AF',
    },
    historyItemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyConfidence: {
        fontSize: 13,
        color: '#6B7280',
    },
});
