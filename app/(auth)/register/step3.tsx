import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useOnboarding, GoalType } from '@/context/OnboardingContext';
import { SelectableCard } from '@/components/ui/SelectableCard';

export default function Step3() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    const handleSelect = (goal: GoalType) => {
        updateData({ goal });
    };

    return (
        <View style={SharedStyles.containerMain}>
            <Stack.Screen options={{
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                        <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 16 }}>Skip</Text>
                    </TouchableOpacity>
                ),
                headerTitle: () => (
                    <View style={{flexDirection: 'row', gap: 8}}>
                        <View style={[styles.dot]} />
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                    </View>
                )
            }} />

            <Text style={SharedStyles.title}>What is your main goal?</Text>
            <Text style={SharedStyles.subtitle}>We'll customize your meal plans based on this choice.</Text>

            <View style={styles.gridContainer}>
                <SelectableCard
                    title="Weight Loss"
                    iconName="body" // Або інша іконка з Ionicons
                    isSelected={data.goal === 'loss'}
                    onPress={() => handleSelect('loss')}
                />
                <SelectableCard
                    title="Weight Gain"
                    iconName="barbell"
                    isSelected={data.goal === 'gain'}
                    onPress={() => handleSelect('gain')}
                />
                <SelectableCard
                    title="Eat Healthy"
                    iconName="nutrition"
                    isSelected={data.goal === 'healthy'}
                    onPress={() => handleSelect('healthy')}
                />
                <SelectableCard
                    title="Budget"
                    iconName="wallet"
                    isSelected={data.goal === 'budget'}
                    onPress={() => handleSelect('budget')}
                />
            </View>

            <View style={{ flex: 1 }} />
            <PrimaryButton
                title="Continue"
                showArrow
                // Тут логіка завершення реєстрації або переходу на наступний крок
                onPress={() => router.push('/(auth)/register/step4')}
                style={{marginBottom: 30}}
                // Можна дизейблити кнопку, якщо ціль не вибрана
                // disabled={!data.goal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    dot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.inputBorder
    },
    dotActive: {
        backgroundColor: Colors.primary, width: 24
    }
});