import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface StepperProps {
    value: number;
    onValueChange: (val: number) => void;
    label: string;
    min?: number;
    max?: number;
}

const StepperComponent: React.FC<StepperProps> = ({
                                                      value,
                                                      onValueChange,
                                                      label,
                                                      min = 1,
                                                      max = 20
                                                  }) => {
    const handleDecrement = useCallback(() => {
        if (value > min) {
            onValueChange(value - 1);
        }
    }, [value, min, onValueChange]);

    const handleIncrement = useCallback(() => {
        if (value < max) {
            onValueChange(value + 1);
        }
    }, [value, max, onValueChange]);

    const isDecrementDisabled = value <= min;
    const isIncrementDisabled = value >= max;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.btn, isDecrementDisabled && styles.btnDisabled]}
                    onPress={handleDecrement}
                    disabled={isDecrementDisabled}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="remove"
                        size={24}
                        color={isDecrementDisabled ? Colors.textGray : Colors.secondary}
                    />
                </TouchableOpacity>

                <Text style={styles.value}>{value}</Text>

                <TouchableOpacity
                    style={[styles.btn, isIncrementDisabled && styles.btnDisabled]}
                    onPress={handleIncrement}
                    disabled={isIncrementDisabled}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="add"
                        size={24}
                        color={isIncrementDisabled ? Colors.textGray : Colors.secondary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.secondary
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    btn: {
        backgroundColor: Colors.white,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    btnDisabled: {
        opacity: 0.4
    },
    value: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.secondary,
        minWidth: 30,
        textAlign: 'center'
    }
});

export const Stepper = memo(StepperComponent);