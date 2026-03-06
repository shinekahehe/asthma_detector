import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const steps = [
    { label: 'Analyzing audio patterns', delay: 0 },
    { label: 'Running AI diagnostics', delay: 500 },
    { label: 'Calculating risk factors', delay: 1000 },
    { label: 'Generating report', delay: 1500 },
];

export default function ProcessingScreen() {
    const insets = useSafeAreaInsets();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(0.5)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const stepAnims = steps.map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        // Brain animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Pulse ring
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Progress bar
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start();

        // Step animations
        steps.forEach((step, i) => {
            setTimeout(() => {
                Animated.timing(stepAnims[i], {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }).start();
            }, step.delay);
        });

        // Navigate after 3 seconds
        const timer = setTimeout(() => {
            router.push('/results');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                {/* Animated Brain Icon */}
                <View style={styles.iconWrapper}>
                    <Animated.View
                        style={[styles.pulseRing, { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [0.5, 1.3], outputRange: [0.4, 0] }) }]}
                    />
                    <Animated.View style={[styles.iconBox, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.brainEmoji}>🧠</Text>
                    </Animated.View>
                </View>

                {/* Status */}
                <Text style={styles.title}>Analyzing with AI model...</Text>
                <Text style={styles.subtitle}>Processing your breathing patterns</Text>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                        ]}
                    />
                </View>

                {/* Steps */}
                <View style={styles.stepsContainer}>
                    {steps.map((step, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.stepItem,
                                {
                                    opacity: stepAnims[i],
                                    transform: [
                                        {
                                            translateX: stepAnims[i].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-20, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Text style={styles.stepIcon}>〰️</Text>
                            <Text style={styles.stepLabel}>{step.label}</Text>
                        </Animated.View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconWrapper: {
        width: 128,
        height: 128,
        marginBottom: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 128,
        height: 128,
        borderRadius: 32,
        backgroundColor: Colors.primary,
    },
    iconBox: {
        width: 120,
        height: 120,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12,
    },
    brainEmoji: {
        fontSize: 56,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    progressTrack: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 32,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    stepsContainer: {
        width: '100%',
        gap: 16,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepIcon: {
        fontSize: 18,
    },
    stepLabel: {
        fontSize: 15,
        color: '#6B7280',
    },
});
