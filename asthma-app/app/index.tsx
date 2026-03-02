import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ScrollView,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

const { height } = Dimensions.get('window');

const features = [
    {
        emoji: '🫁',
        title: 'Real-time breathing analysis',
        description: 'Instant sound processing',
    },
    {
        emoji: '🧠',
        title: 'Instant risk prediction',
        description: 'AI-powered diagnostics',
    },
    {
        emoji: '🛡️',
        title: 'Clinical-grade AI model',
        description: 'Medically validated',
    },
];

export default function OnboardingScreen() {
    const logoAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const subtitleAnim = useRef(new Animated.Value(0)).current;
    const featureAnims = features.map(() => useRef(new Animated.Value(0)).current);
    const btnAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(logoAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(titleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(subtitleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.stagger(100, featureAnims.map(a =>
                Animated.timing(a, { toValue: 1, duration: 350, useNativeDriver: true })
            )),
            Animated.timing(btnAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <Animated.View
                    style={[
                        styles.logoWrap,
                        {
                            opacity: logoAnim,
                            transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                        },
                    ]}
                >
                    <View style={styles.logoBox}>
                        <Text style={styles.logoEmoji}>〰️</Text>
                    </View>
                </Animated.View>

                {/* Headline */}
                <Animated.Text
                    style={[
                        styles.title,
                        {
                            opacity: titleAnim,
                            transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        },
                    ]}
                >
                    AI-Powered Respiratory Screening
                </Animated.Text>

                {/* Subtitle */}
                <Animated.Text
                    style={[
                        styles.subtitle,
                        {
                            opacity: subtitleAnim,
                            transform: [{ translateY: subtitleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        },
                    ]}
                >
                    Use your device's microphone to detect respiratory conditions through advanced AI analysis of breathing sounds
                </Animated.Text>

                {/* Feature Cards */}
                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.featureCard,
                                {
                                    opacity: featureAnims[index],
                                    transform: [
                                        {
                                            translateX: featureAnims[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-20, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <View style={styles.featureIcon}>
                                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDesc}>{feature.description}</Text>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* CTA Buttons */}
                <Animated.View style={[styles.btnContainer, { opacity: btnAnim }]}>
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => router.push('/home')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.primaryBtnText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
                        <Text style={styles.secondaryBtnText}>Learn More</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FF',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        maxWidth: 430,
        alignSelf: 'center',
        width: '100%',
    },
    logoWrap: {
        marginBottom: 32,
    },
    logoBox: {
        width: 96,
        height: 96,
        backgroundColor: Colors.primary,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    logoEmoji: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        maxWidth: 320,
    },
    featuresContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    featureCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    featureEmoji: {
        fontSize: 22,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 13,
        color: '#6B7280',
    },
    btnContainer: {
        width: '100%',
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryBtnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryBtn: {
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
});
