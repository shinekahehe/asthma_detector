import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Colors } from '@/constants/theme';

const navItems = [
    { icon: '🏠', label: 'Home', path: '/home' },
    { icon: '📋', label: 'History', path: '/history' },
    { icon: '📊', label: 'Insights', path: '/insights' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <View style={styles.nav}>
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <TouchableOpacity
                        key={item.path}
                        style={styles.navItem}
                        onPress={() => router.push(item.path as any)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.icon, isActive && styles.iconActive]}>{item.icon}</Text>
                        <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    nav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        height: 64,
        paddingBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
    },
    icon: {
        fontSize: 20,
        opacity: 0.4,
    },
    iconActive: {
        opacity: 1,
    },
    label: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    labelActive: {
        color: Colors.primary,
    },
});
