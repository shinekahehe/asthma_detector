import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { BottomNav } from '@/components/BottomNav';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const trendData = [
    { date: 'Feb 15', score: 92 },
    { date: 'Feb 18', score: 95 },
    { date: 'Feb 20', score: 87 },
    { date: 'Feb 24', score: 91 },
    { date: 'Feb 26', score: 94 },
];

const MAX_SCORE = 100;
const MIN_SCORE = 80;

const tips = [
    'Take tests regularly for better tracking',
    'Ensure quiet environment for accurate results',
    'Consult a doctor if you notice unusual patterns',
];

export default function InsightsScreen() {
    const insets = useSafeAreaInsets();

    const chartHeight = 140;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Health Insights</Text>
                <Text style={styles.headerSubtitle}>Track your respiratory health</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statEmoji}>⚡</Text>
                            <Text style={styles.statLabel}>Avg Score</Text>
                        </View>
                        <Text style={styles.statValue}>92%</Text>
                        <Text style={styles.statTrend}>📈 +3% this week</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statEmoji}>📅</Text>
                            <Text style={styles.statLabel}>Tests</Text>
                        </View>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statSub}>This month</Text>
                    </View>
                </View>

                {/* Trend Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.cardTitle}>Health Trend</Text>

                    {/* Custom bar chart */}
                    <View style={styles.chartArea}>
                        {trendData.map((item, i) => {
                            const pct = (item.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
                            const barH = Math.max(pct * chartHeight, 10);
                            return (
                                <View key={i} style={styles.chartColumn}>
                                    <Text style={styles.chartScoreLabel}>{item.score}</Text>
                                    <View style={[styles.chartBar, { height: barH }]} />
                                    <Text style={styles.chartDateLabel}>{item.date.replace('Feb ', '')}</Text>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.chartLegend}>
                        <Text style={styles.chartLegendText}>Score (80–100)</Text>
                    </View>
                </View>

                {/* Health Tips */}
                <View style={styles.tipsCard}>
                    <Text style={styles.cardTitle}>Health Tips</Text>
                    <View style={styles.tipsList}>
                        {tips.map((tip, i) => (
                            <View key={i} style={styles.tipItem}>
                                <Text style={styles.tipBullet}>•</Text>
                                <Text style={styles.tipText}>{tip}</Text>
                            </View>
                        ))}
                    </View>
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
        padding: 18,
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
        marginBottom: 10,
    },
    statEmoji: {
        fontSize: 18,
    },
    statLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
    },
    statTrend: {
        fontSize: 12,
        color: '#059669',
        marginTop: 4,
    },
    statSub: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    chartCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    chartArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 180,
        paddingTop: 24,
    },
    chartColumn: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
        flex: 1,
    },
    chartScoreLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    chartBar: {
        width: '60%',
        backgroundColor: Colors.primary,
        borderRadius: 6,
        opacity: 0.85,
        minWidth: 20,
    },
    chartDateLabel: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    chartLegend: {
        marginTop: 12,
        alignItems: 'center',
    },
    chartLegendText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    tipsCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    tipsList: {
        gap: 10,
    },
    tipItem: {
        flexDirection: 'row',
        gap: 10,
    },
    tipBullet: {
        color: Colors.primary,
        fontSize: 16,
        lineHeight: 22,
    },
    tipText: {
        fontSize: 14,
        color: '#1E40AF',
        flex: 1,
        lineHeight: 22,
    },
});
