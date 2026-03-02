import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { RiskBadge } from '@/components/RiskBadge';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const aiDetails = [
    { label: 'Wheezing', value: 'Not detected', ok: true },
    { label: 'Crackles', value: 'Not detected', ok: true },
    { label: 'Breathing rate', value: 'Normal (16/min)', ok: true },
];

export default function ResultsScreen() {
    const insets = useSafeAreaInsets();
    const cardAnim = useRef(new Animated.Value(0)).current;
    const aiAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(cardAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(aiAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(waveAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]).start();
    }, []);

    const waveformBars = Array.from({ length: 60 }, (_, i) => ({
        height: Math.abs(Math.sin(i * 0.3) * 40 + Math.random() * 15),
    }));

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Test Results</Text>
                <Text style={styles.headerSubtitle}>Completed Feb 26, 2026 at 2:45 PM</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Risk Assessment */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: cardAnim,
                            transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
                        },
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Risk Assessment</Text>
                        <Text style={styles.checkIcon}>✅</Text>
                    </View>
                    <View style={styles.riskRow}>
                        <RiskBadge level="normal" size="lg" />
                        <View style={styles.confidenceSection}>
                            <Text style={styles.confidenceValue}>94%</Text>
                            <Text style={styles.confidenceLabel}>Confidence</Text>
                        </View>
                    </View>
                    <View style={styles.normalMessage}>
                        <Text style={styles.normalMessageText}>
                            No significant respiratory abnormalities detected. Your breathing patterns appear normal.
                        </Text>
                    </View>
                </Animated.View>

                {/* AI Analysis */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: aiAnim,
                            transform: [{ translateY: aiAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        },
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 18 }}>⚠️</Text>
                            <Text style={styles.cardTitle}>AI Analysis</Text>
                        </View>
                    </View>
                    {aiDetails.map((item, i) => (
                        <View key={i} style={[styles.detailRow, i === aiDetails.length - 1 && { borderBottomWidth: 0 }]}>
                            <Text style={styles.detailLabel}>{item.label}</Text>
                            <Text style={[styles.detailValue, item.ok && { color: '#059669' }]}>{item.value}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Sound Waveform */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: waveAnim,
                            transform: [{ translateY: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        },
                    ]}
                >
                    <Text style={styles.cardTitle}>Sound Waveform</Text>
                    <View style={styles.waveformContainer}>
                        {waveformBars.map((bar, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.waveBar,
                                    { height: bar.height },
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Action Buttons */}
                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>💾  Save Report</Text>
                </TouchableOpacity>

                <View style={styles.btnRow}>
                    <TouchableOpacity
                        style={[styles.secondaryBtn, { flex: 1 }]}
                        onPress={() => router.push('/home')}
                    >
                        <Text style={styles.secondaryBtnText}>🔄  Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.secondaryBtn, { flex: 1 }]}>
                        <Text style={styles.secondaryBtnText}>📤  Share</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push('/home')}>
                    <Text style={styles.backLink}>Back to Home</Text>
                </TouchableOpacity>
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
    },
    checkIcon: {
        fontSize: 20,
    },
    riskRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    confidenceSection: {
        alignItems: 'flex-end',
    },
    confidenceValue: {
        fontSize: 32,
        fontWeight: '600',
        color: '#111827',
    },
    confidenceLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    normalMessage: {
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    normalMessageText: {
        fontSize: 13,
        color: '#065F46',
        lineHeight: 20,
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
        color: '#111827',
    },
    waveformContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 12,
        overflow: 'hidden',
    },
    waveBar: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: 2,
        opacity: 0.6,
        minWidth: 3,
    },
    primaryBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryBtnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryBtn: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    secondaryBtnText: {
        color: '#374151',
        fontSize: 15,
        fontWeight: '500',
    },
    backLink: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        paddingVertical: 12,
    },
});
