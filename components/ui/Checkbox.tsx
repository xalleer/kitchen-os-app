import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onPress: () => void;
    disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
                                                      label,
                                                      isChecked,
                                                      onPress,
                                                      disabled = false
                                                  }) => {
    return (
        <TouchableOpacity
            style={[styles.container, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <View style={[styles.icon, isChecked && styles.iconChecked]}>
                {isChecked && <Ionicons name="checkmark" size={16} color={Colors.white} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    disabled: {
        opacity: 0.5,
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    label: {
        fontSize: 16,
        color: Colors.secondary,
    },
});