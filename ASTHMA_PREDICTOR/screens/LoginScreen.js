import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
    Dimensions,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';

export const LoginScreen = ({ navigation }) => {
    const { login, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }
        try {
            const user = await login(email.trim(), password);
            setAuthToken(useAuth().token); // sync token into api module
            // Navigation handled by RootNavigator based on auth state
        } catch (e) {
            setError(e.message || 'Login failed. Please try again.');
        }
    };

    const content = (
        <View style={styles.contentWrapper}>
            {/* Logo / Header */}
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoIcon}>🫁</Text>
                </View>
                <Text style={styles.appName}>AsthmaCare</Text>
                <Text style={styles.tagline}>Monitor. Detect. Breathe Easy.</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>Sign in to continue</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                ) : null}

                <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="you@example.com"
                        placeholderTextColor={COLORS.gray400}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.gray400}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.btnText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.linkText}>
                        Don't have an account?{' '}
                        <Text style={styles.linkBold}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'web' ? (
                <View style={[styles.webScrollContainer, { maxHeight: Dimensions.get('window').height - 100 }]}>
                    <ScrollView
                        scrollEnabled={true}
                        contentContainerStyle={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={true}
                        overScrollMode="always"
                    >
                        {content}
                    </ScrollView>
                </View>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.kav}
                >
                    <ScrollView
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        contentContainerStyle={styles.scroll}
                        style={styles.scrollViewContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={true}
                    >
                        {content}
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    kav: {
        flex: 1,
    },
    scrollViewContainer: {
        flex: 1,
    },
    webScrollContainer: {
        width: '100%',
        overflow: 'auto',
    },
    contentWrapper: {
        width: '100%',
    },
    scroll: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingBottom: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    logoIcon: {
        fontSize: 44,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 6,
        fontWeight: '500',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 28,
        ...SHADOWS.lg,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.gray900,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: COLORS.gray500,
        marginBottom: 24,
    },
    errorBox: {
        backgroundColor: '#FFF0F0',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
    },
    errorText: {
        fontSize: 13,
        color: COLORS.danger,
        fontWeight: '500',
    },
    field: {
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.gray700,
        marginBottom: 6,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.gray900,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    btn: {
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        ...SHADOWS.md,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    linkRow: {
        alignItems: 'center',
        marginTop: 20,
    },
    linkText: {
        fontSize: 14,
        color: COLORS.gray500,
    },
    linkBold: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});
