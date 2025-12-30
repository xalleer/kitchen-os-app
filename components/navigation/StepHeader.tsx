import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const StepHeader = ({ currentStep }: { currentStep: number }) => {
    const TOTAL_STEPS = 4;
    return (
        <View style={styles.container}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.dot,
                        i + 1 === currentStep ? styles.dotActive : {},
                        i + 1 < currentStep ? styles.dotCompleted : {}
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E8E8' },
    dotActive: { backgroundColor: Colors.primary, width: 24 },
    dotCompleted: { backgroundColor: Colors.primary, opacity: 0.5 }
});