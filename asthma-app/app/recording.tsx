import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NUM_BARS = 38;
const TOTAL_SECONDS = 30;

export default function RecordingScreen() {
    const insets = useSafeAreaInsets();
    const [timer, setTimer] = useState(0);
    const barAnims = useRef(
        Array.from({ length: NUM_BARS }, () => new Animated.Value(0.3))
    ).current;

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev >= TOTAL_SECONDS) {
                    clearInterval(interval);
                    router.push('/processing');
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animations = barAnims.map(anim =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: Math.random() * 0.8 + 0.2,
                        duration: 300 + Math.random() * 400,
                        useNativeDriver: false,
                    }),
                    Animated.timing(anim, {
                        toValue: Math.random() * 0.3 + 0.1,
                        duration: 300 + Math.random() * 400,
                        useNativeDriver: false,
                    }),
                ])
            )
        );
        const stagger = Animated.stagger(15, animations);
        stagger.start();
        return () => stagger.stop();
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const progress = timer / TOTAL_SECONDS;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                {/* Timer */}
                <View style={styles.timerSection}>
                    <Text style={styles.timerMain}>{formatTime(timer)}</Text>
                    <Text style={styles.timerTotal}>/ {formatTime(TOTAL_SECONDS)}</Text>
                </View>

                {/* Status */}
                <Text style={styles.statusText}>Recording breathing sounds...</Text>

                {/* Waveform */}
                <View style={styles.waveform}>
                    {barAnims.map((anim, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.waveBar,
                                {
                                    height: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 100] }),
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Progress Ring Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                </View>

                {/* Stop Button */}
                <TouchableOpacity
                    style={styles.stopBtn}
                    onPress={() => router.push('/processing')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.stopIcon}>⏹</Text>
                </TouchableOpacity>

                {/* Instructions */}
                <View style={styles.instructionsCard}>
                    <View style={styles.instructionsHeader}>
                        <Text style={styles.instructionsIcon}>ℹ️</Text>
                        <Text style={styles.instructionsTitle}>Instructions</Text>
                    </View>
                    <View style={styles.instructionsList}>
                        {[
                            'Place microphone on upper chest',
                            'Stay still and breathe normally',
                            'Avoid talking during recording',
                        ].map((text, i) => (
                            <View key={i} style={styles.instructionItem}>
                                <Text style={styles.instructionBullet}>•</Text>
                                <Text style={styles.instructionText}>{text}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    timerSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    timerMain: {
        fontSize: 64,
        fontWeight: '300',
        color: Colors.white,
        letterSpacing: -2,
    },
    timerTotal: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
    },
    statusText: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: '500',
        marginBottom: 32,
    },
    waveform: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginBottom: 24,
        overflow: 'hidden',
    },
    waveBar: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        minWidth: 4,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 40,
    },
    progressTrack: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.white,
        borderRadius: 2,
    },
    stopBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 12,
        marginBottom: 40,
    },
    stopIcon: {
        fontSize: 32,
    },
    instructionsCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    instructionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    instructionsIcon: {
        fontSize: 18,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    instructionsList: {
        gap: 8,
    },
    instructionItem: {
        flexDirection: 'row',
        gap: 8,
    },
    instructionBullet: {
        color: Colors.white,
        fontSize: 13,
        marginTop: 2,
    },
    instructionText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
    },
});
