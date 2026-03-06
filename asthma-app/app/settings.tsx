import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { BottomNav } from '@/components/BottomNav';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const SettingRow = ({
        icon,
        label,
        onPress,
        right,
    }: {
        icon: string;
        label: string;
        onPress?: () => void;
        right?: React.ReactNode;
    }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{icon}</Text>
                <Text style={styles.settingLabel}>{label}</Text>
            </View>
            {right ?? <Text style={styles.chevron}>›</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
                <Text style={styles.headerSubtitle}>Manage your preferences</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionCard}>
                        <SettingRow icon="👤" label="Profile" />
                        <View style={styles.divider} />
                        <SettingRow
                            icon="🔔"
                            label="Notifications"
                            right={
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: '#D1D5DB', true: Colors.primary }}
                                    thumbColor={Colors.white}
                                />
                            }
                        />
                    </View>
                </View>

                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.sectionCard}>
                        <SettingRow
                            icon="🌙"
                            label="Dark Mode"
                            right={
                                <Switch
                                    value={darkMode}
                                    onValueChange={setDarkMode}
                                    trackColor={{ false: '#D1D5DB', true: Colors.primary }}
                                    thumbColor={Colors.white}
                                />
                            }
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.sectionCard}>
                        <SettingRow icon="📄" label="Terms & Privacy" />
                        <View style={styles.divider} />
                        <SettingRow icon="❓" label="Help & Support" />
                    </View>
                </View>

                <Text style={styles.version}>Version 1.0.0</Text>
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
        gap: 20,
    },
    section: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingLeft: 4,
    },
    sectionCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    settingIcon: {
        fontSize: 20,
    },
    settingLabel: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '400',
    },
    chevron: {
        fontSize: 22,
        color: '#9CA3AF',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 20,
    },
    version: {
        textAlign: 'center',
        fontSize: 13,
        color: '#9CA3AF',
        paddingVertical: 8,
    },
});
