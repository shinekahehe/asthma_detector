import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { RiskBadge } from '@/components/RiskBadge';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const probabilityData = [
    { condition: 'Normal', probability: 94, color: '#3B82F6' },
    { condition: 'Asthma', probability: 4, color: '#F59E0B' },
    { condition: 'COPD', probability: 1.5, color: '#EF4444' },
    { condition: 'Pneumonia', probability: 0.5, color: '#8B5CF6' },
];

const detectionDetails = [
    { label: 'Wheezing', value: 'Not detected', ok: true },
    { label: 'Crackles', value: 'Not detected', ok: true },
    { label: 'Stridor', value: 'Not detected', ok: true },
    { label: 'Breathing Rate', value: '16 breaths/min', ok: false },
];

const waveformBars = Array.from({ length: 50 }, (_, i) => ({
    height: Math.abs(Math.sin(i * 0.3) * 40 + Math.random() * 15) + 8,
}));

export default function ReportDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.push('/history')}
                >
                    <Text style={styles.backIcon}>‹</Text>
                    <Text style={styles.backText}>Back to History</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detailed Report</Text>
                <Text style={styles.headerId}>Test ID: {id}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Test Summary</Text>
                        <Text style={styles.checkIcon}>✅</Text>
                    </View>
                    <View style={styles.summaryRows}>
                        {[
                            { label: 'Date', value: 'Feb 26, 2026' },
                            { label: 'Time', value: '2:45 PM' },
                            { label: 'Duration', value: '30 seconds' },
                        ].map((row, i) => (
                            <View key={i} style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{row.label}</Text>
                                <Text style={styles.summaryValue}>{row.value}</Text>
                            </View>
                        ))}
                        <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.summaryLabel}>Risk Level</Text>
                            <RiskBadge level="normal" size="sm" />
                        </View>
                    </View>

                    <View style={styles.confidenceBlock}>
                        <View style={styles.confidenceHeader}>
                            <Text style={styles.confidenceLabel}>Model Confidence</Text>
                            <Text style={styles.confidenceValue}>94%</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: '94%' }]} />
                        </View>
                    </View>
                </View>

                {/* Audio Waveform */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Audio Waveform</Text>
                    <View style={styles.waveformContainer}>
                        {waveformBars.map((bar, i) => (
                            <View
                                key={i}
                                style={[styles.waveBar, { height: bar.height, backgroundColor: Colors.accent }]}
                            />
                        ))}
                    </View>
                </View>

                {/* AI Probability Breakdown */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>AI Probability Breakdown</Text>
                    <View style={styles.probContainer}>
                        {probabilityData.map((item, i) => (
                            <View key={i} style={styles.probRow}>
                                <View style={styles.probLabelRow}>
                                    <Text style={styles.probCondition}>{item.condition}</Text>
                                    <Text style={[styles.probValue, { color: item.color }]}>{item.probability}%</Text>
                                </View>
                                <View style={styles.probTrack}>
                                    <View
                                        style={[
                                            styles.probFill,
                                            { width: `${item.probability}%`, backgroundColor: item.color },
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Detection Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detection Details</Text>
                    {detectionDetails.map((item, i) => (
                        <View
                            key={i}
                            style={[
                                styles.detailRow,
                                i === detectionDetails.length - 1 && { borderBottomWidth: 0 },
                            ]}
                        >
                            <Text style={styles.detailLabel}>{item.label}</Text>
                            <Text style={[styles.detailValue, item.ok ? { color: '#059669' } : { color: '#111827' }]}>
                                {item.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.btnRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary }]}>
                        <Text style={styles.actionBtnTextLight}>📥  Export PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
                        <Text style={styles.actionBtnTextDark}>📤  Share</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        paddingTop: 12,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backIcon: {
        fontSize: 22,
        color: Colors.primary,
        lineHeight: 24,
    },
    backText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    },
    headerId: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        gap: 16,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 14,
    },
    checkIcon: {
        fontSize: 20,
    },
    summaryRows: {
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    confidenceBlock: {
        backgroundColor: '#EFF6FF',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    confidenceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    confidenceLabel: {
        fontSize: 14,
        color: '#374151',
    },
    confidenceValue: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.primary,
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#BFDBFE',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    waveformContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        overflow: 'hidden',
    },
    waveBar: {
        flex: 1,
        borderRadius: 2,
        opacity: 0.7,
        minWidth: 3,
    },
    probContainer: {
        gap: 14,
    },
    probRow: {
        gap: 6,
    },
    probLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    probCondition: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    probValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    probTrack: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    probFill: {
        height: '100%',
        borderRadius: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
    },
    actionBtnSecondary: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionBtnTextLight: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
    actionBtnTextDark: {
        color: '#374151',
        fontSize: 15,
        fontWeight: '500',
    },
});
