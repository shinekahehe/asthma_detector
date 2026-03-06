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

const ROLES = [
    { key: 'patient', label: '🧑‍⚕️ Patient', desc: 'Monitor my own breathing' },
    { key: 'caretaker', label: '👨‍👩‍👦 Caretaker', desc: 'Monitor a linked patient' },
];

export const RegisterScreen = ({ navigation }) => {
    const { register, loading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');
        if (!name.trim() || !email.trim() || !password) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        try {
            await register(name.trim(), email.trim(), password, role);
            // Auth state change → RootNavigator auto-navigates
        } catch (e) {
            setError(e.message || 'Registration failed. Please try again.');
        }
    };

    const content = (
        <View style={styles.contentWrapper}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoIcon}>🫁</Text>
                </View>
                <Text style={styles.appName}>AsthmaCare</Text>
                <Text style={styles.tagline}>Create your account</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Register</Text>
                <Text style={styles.cardSubtitle}>Choose your role and sign up</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                ) : null}

                {/* Role selector */}
                <Text style={styles.label}>I am a…</Text>
                <View style={styles.roleRow}>
                    {ROLES.map((r) => (
                        <TouchableOpacity
                            key={r.key}
                            style={[
                                styles.roleCard,
                                role === r.key && styles.roleCardActive,
                            ]}
                            onPress={() => setRole(r.key)}
                        >
                            <Text style={styles.roleLabel}>{r.label}</Text>
                            <Text style={styles.roleDesc}>{r.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Priya Sharma"
                        placeholderTextColor={COLORS.gray400}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                </View>

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
                        placeholder="Min. 6 characters"
                        placeholderTextColor={COLORS.gray400}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.gray400}
                        value={confirm}
                        onChangeText={setConfirm}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.btnText}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.linkText}>
                        Already have an account?{' '}
                        <Text style={styles.linkBold}>Sign In</Text>
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
    kav: { flex: 1 },
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
        marginBottom: 28,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoIcon: { fontSize: 40 },
    appName: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.white,
    },
    tagline: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 4,
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
        marginBottom: 20,
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
    roleRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    roleCard: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        padding: 12,
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    roleCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}10`,
    },
    roleLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.gray900,
        marginBottom: 4,
        textAlign: 'center',
    },
    roleDesc: {
        fontSize: 11,
        color: COLORS.gray500,
        textAlign: 'center',
    },
    field: { marginBottom: 16 },
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
    btnDisabled: { opacity: 0.6 },
    btnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
    },
    linkRow: {
        alignItems: 'center',
        marginTop: 18,
    },
    linkText: { fontSize: 14, color: COLORS.gray500 },
    linkBold: { color: COLORS.primary, fontWeight: '700' },
});
