import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface SocialButtonProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    style?: ViewStyle;
}

export const SocialButton = ({ title, icon, onPress, style }: SocialButtonProps) => {
    return (
        <TouchableOpacity style={[styles.socialBtn, style]} onPress={onPress}>
            <Ionicons name={icon} size={20} color={Colors.secondary} style={{ marginRight: 10 }} />
            <Text style={styles.socialText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    socialBtn: {
        flexDirection: 'row',
        width: '47%',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.secondary,
    },
});