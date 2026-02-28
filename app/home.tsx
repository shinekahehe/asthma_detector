import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { BottomNav } from '@/components/BottomNav';
import { RiskBadge } from '@/components/RiskBadge';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NUM_BARS = 40;

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const [breathingRate, setBreathingRate] = useState(16);
    const [isMonitoring, setIsMonitoring] = useState(true);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const barAnims = useRef(
        Array.from({ length: NUM_BARS }, () => new Animated.Value(0.3))
    ).current;

    // Simulate breathing rate
    useEffect(() => {
        if (!isMonitoring) return;
        const interval = setInterval(() => {
            setBreathingRate(prev => {
                const variation = (Math.random() - 0.5) * 2;
                return Math.max(12, Math.min(20, prev + variation));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [isMonitoring]);

    // Pulse animation for live dot
    useEffect(() => {
        if (!isMonitoring) return;
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [isMonitoring]);

    // Waveform bar animation
    useEffect(() => {
        if (!isMonitoring) {
            barAnims.forEach(a => Animated.timing(a, { toValue: 0.1, duration: 300, useNativeDriver: false }).start());
            return;
        }
        const animations = barAnims.map((anim, i) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: Math.random() * 0.7 + 0.2,
                        duration: 400 + Math.random() * 400,
                        useNativeDriver: false,
                    }),
                    Animated.timing(anim, {
                        toValue: Math.random() * 0.4 + 0.1,
                        duration: 400 + Math.random() * 400,
                        useNativeDriver: false,
                    }),
                ])
            )
        );
        const staggered = Animated.stagger(20, animations);
        staggered.start();
        return () => staggered.stop();
    }, [isMonitoring]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hello, User</Text>
                <Text style={styles.headerSubtitle}>Continuous breathing monitor</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Monitoring Card */}
                <View style={styles.monitorCard}>
                    <View style={styles.monitorCardTop}>
                        <View style={styles.liveBadge}>
                            {isMonitoring ? (
                                <>
                                    <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                                    <Text style={styles.liveText}>Live Monitoring</Text>
                                </>
                            ) : (
                                <>
                                    <View style={[styles.liveDot, { backgroundColor: '#9CA3AF' }]} />
                                    <Text style={styles.liveText}>Monitoring Paused</Text>
                                </>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.pauseBtn}
                            onPress={() => setIsMonitoring(!isMonitoring)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.pauseIcon}>{isMonitoring ? '⏸' : '▶️'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Breathing Rate */}
                    <View style={styles.breathingSection}>
                        <Text style={styles.breathingLabel}>Breathing Rate</Text>
                        <View style={styles.breathingRow}>
                            <Text style={styles.breathingValue}>
                                {isMonitoring ? Math.round(breathingRate) : '--'}
                            </Text>
                            <Text style={styles.breathingUnit}>breaths/min</Text>
                        </View>
                    </View>

                    {/* Waveform */}
                    <View style={styles.waveformContainer}>
                        {barAnims.map((anim, i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.waveBar,
                                    {
                                        height: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 80] }),
                                        opacity: isMonitoring ? 0.7 : 0.2,
                                    },
                                ]}
                            />
                        ))}
                    </View>

                    {/* Analyze Button */}
                    <TouchableOpacity
                        style={[styles.analyzeBtn, !isMonitoring && styles.analyzeBtnDisabled]}
                        onPress={() => isMonitoring && router.push('/processing')}
                        activeOpacity={isMonitoring ? 0.85 : 1}
                    >
                        <Text style={styles.analyzeBtnText}>
                            {isMonitoring ? 'Run AI Analysis' : 'Start monitoring to analyze'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statEmoji}>📈</Text>
                            <Text style={styles.statLabel}>Status</Text>
                        </View>
                        <Text style={styles.statValue}>Normal</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statEmoji}>⚡</Text>
                            <Text style={styles.statLabel}>Uptime</Text>
                        </View>
                        <Text style={styles.statValue}>24/7</Text>
                    </View>
                </View>

                {/* Last AI Analysis Card */}
                <View style={styles.lastCard}>
                    <View style={styles.lastCardHeader}>
                        <Text style={styles.lastCardTitle}>Last AI Analysis</Text>
                        <TouchableOpacity onPress={() => router.push('/report/last')}>
                            <Text style={styles.viewLink}>View ›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lastCardBody}>
                        <View style={styles.lastCardRow}>
                            <Text style={styles.lastCardLabel}>Risk Level</Text>
                            <RiskBadge level="normal" size="sm" />
                        </View>
                        <View style={styles.lastCardRow}>
                            <Text style={styles.lastCardLabel}>Date</Text>
                            <Text style={styles.lastCardValue}>Feb 24, 2026</Text>
                        </View>
                        <View style={[styles.lastCardRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.lastCardLabel}>Confidence</Text>
                            <Text style={styles.lastCardValue}>94%</Text>
                        </View>
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
    monitorCard: {
        background: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    monitorCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
    },
    liveText: {
        color: Colors.white,
        fontSize: 14,
    },
    pauseBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseIcon: {
        fontSize: 18,
    },
    breathingSection: {
        marginBottom: 20,
    },
    breathingLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginBottom: 4,
    },
    breathingRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    breathingValue: {
        fontSize: 52,
        fontWeight: '300',
        color: Colors.white,
        lineHeight: 60,
    },
    breathingUnit: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    waveformContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 20,
        overflow: 'hidden',
    },
    waveBar: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 4,
        minWidth: 4,
    },
    analyzeBtn: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    analyzeBtnDisabled: {
        opacity: 0.5,
    },
    analyzeBtnText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '600',
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
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    lastCard: {
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
    lastCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    lastCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    viewLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    lastCardBody: {
        gap: 2,
    },
    lastCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    lastCardLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    lastCardValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
});
