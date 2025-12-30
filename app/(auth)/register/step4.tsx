import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Stepper } from '@/components/ui/Stepper';
import { useOnboarding } from '@/context/OnboardingContext';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { Ionicons } from '@expo/vector-icons';

export default function Step4() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [isLoading, setIsLoading] = useState(false);

    const [localBudget, setLocalBudget] = useState(data.budget);

    const handleBudgetComplete = useCallback((val: number) => {
        updateData({ budget: val });
    }, [updateData]);

    const handleFinish = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('Відправка на NestJS:', data);

            // Тут має бути API запит
            // await api.register(data);

            // Симулюємо затримку мережі
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.replace('/(tabs)');
        } catch (error) {
            console.error('Registration error:', error);
            // Тут має бути обробка помилок
        } finally {
            setIsLoading(false);
        }
    }, [data, router]);

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title="Завершити налаштування"
                    onPress={handleFinish}
                    loading={isLoading}
                    disabled={isLoading}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={4} totalSteps={4} />
            }} />

            <Ionicons
                name="home-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>Твій Household</Text>
            <Text style={SharedStyles.subtitle}>Налаштуй параметри для своєї сім'ї.</Text>

            <Stepper
                label="Членів сім'ї"
                value={data.familySize || 1}
                onValueChange={(val) => updateData({ familySize: val })}
            />

            <View style={styles.budgetCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.budgetLabel}>Тижневий бюджет</Text>
                    <Text style={styles.budgetValue}>
                        {localBudget} <Text style={{fontSize: 16}}>UAH</Text>
                    </Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40, marginTop: 10 }}
                    minimumValue={500}
                    maximumValue={10000}
                    step={100}
                    value={localBudget}
                    onValueChange={setLocalBudget}
                    onSlidingComplete={handleBudgetComplete}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.inputBorder}
                    thumbTintColor={Colors.primary}
                />
                <Text style={styles.hint}>AI підбере рецепти, щоб вписатися в цю суму.</Text>
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    budgetCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        marginTop: 20
    },
    budgetLabel: { fontSize: 18, fontWeight: '600', color: Colors.secondary },
    budgetValue: { fontSize: 28, fontWeight: '800', color: Colors.primary },
    hint: { color: Colors.textGray, fontSize: 14, marginTop: 10, textAlign: 'center' },
});