import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface StepperProps {
    value: number;
    onValueChange: (val: number) => void;
    label: string;
}

export const Stepper: React.FC<StepperProps> = ({ value, onValueChange, label }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => value > 1 && onValueChange(value - 1)}
                >
                    <Ionicons name="remove" size={24} color={Colors.secondary} />
                </TouchableOpacity>

                <Text style={styles.value}>{value}</Text>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => onValueChange(value + 1)}
                >
                    <Ionicons name="add" size={24} color={Colors.secondary} />
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
    label: { fontSize: 18, fontWeight: '600', color: Colors.secondary },
    controls: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    btn: {
        backgroundColor: Colors.white,
        width: 44, height: 44,
        borderRadius: 22,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    value: { fontSize: 22, fontWeight: '700', color: Colors.secondary }
});