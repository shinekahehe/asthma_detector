import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RiskBadgeProps {
    level: 'normal' | 'mild' | 'high';
    size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
    const configs = {
        normal: {
            bg: '#ECFDF5',
            text: '#065F46',
            border: '#A7F3D0',
            label: 'Normal',
        },
        mild: {
            bg: '#FFFBEB',
            text: '#92400E',
            border: '#FDE68A',
            label: 'Mild Abnormality',
        },
        high: {
            bg: '#FEF2F2',
            text: '#991B1B',
            border: '#FECACA',
            label: 'High Risk',
        },
    };

    const sizeStyles = {
        sm: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
        md: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 13 },
        lg: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 15 },
    };

    const config = configs[level];
    const sz = sizeStyles[size];

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: config.bg,
                    borderColor: config.border,
                    paddingHorizontal: sz.paddingHorizontal,
                    paddingVertical: sz.paddingVertical,
                },
            ]}
        >
            <Text style={[styles.text, { color: config.text, fontSize: sz.fontSize }]}>
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: 50,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: '500',
    },
});
