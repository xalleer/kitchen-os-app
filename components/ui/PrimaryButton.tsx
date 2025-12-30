import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    showArrow?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
                                                                title, onPress, style, showArrow = false, disabled = false, loading = false
                                                            }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                (disabled || loading) && styles.buttonDisabled
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={Colors.white} />
            ) : (
                <>
                    <Text style={styles.text}>{title}</Text>
                    {showArrow && (
                        <Ionicons name="arrow-forward" size={20} color={Colors.white} style={styles.icon} />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: Colors.inputBorder,
        opacity: 0.7,
    },
    text: { color: Colors.white, fontSize: 18, fontWeight: '600' },
    icon: { marginLeft: 8 },
});