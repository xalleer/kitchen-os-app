import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Stepper } from '@/components/ui/auth/Stepper';
import { useOnboarding } from '@/context/OnboardingContext';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import authService from '@/services/auth.service';

export default function Step4() {
    const router = useRouter();
    const { t } = useTranslation();
    const { data, updateData, resetData } = useOnboarding();
    const [isLoading, setIsLoading] = useState(false);
    const [localBudget, setLocalBudget] = useState(data.budget);

    const handleBudgetComplete = useCallback((val: number) => {
        updateData({ budget: val });
    }, [updateData]);

    const handleFinish = useCallback(async () => {
        setIsLoading(true);

        try {
            // Мапінг даних для API
            const goalMapping = {
                'loss': 'LOSE_WEIGHT',
                'gain': 'GAIN_MUSCLE',
                'healthy': 'MAINTAIN',
            };

            const registerData = {
                email: data.email!,
                password: data.password!,
                name: data.name!,
                familyName: `${data.name}'s Family`, // Генеруємо назву сім'ї
                weeklyBudget: data.budget,
                height: data.height,
                weight: data.weight,
                goal: goalMapping[data.goal as keyof typeof goalMapping] as any,
            };

            // Відправляємо запит на реєстрацію
            await authService.register(registerData);

            // Очищуємо дані онбордингу
            resetData();

            // Переходимо на головний екран
            router.replace('/(tabs)');

        } catch (error: any) {
            console.error('Registration error:', error);

            Alert.alert(
                'Помилка реєстрації',
                error.message || 'Щось пішло не так. Спробуйте ще раз.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    }, [data, router, resetData]);

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.FINISH')}
                    onPress={handleFinish}
                    loading={isLoading}
                    disabled={isLoading}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={4} />
            }} />

            <Ionicons
                name="home-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('HOUSEHOLD')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP4_TITLE')}</Text>

            <Stepper
                label={t('FAMILY_MEMBERS')}
                value={data.familySize || 1}
                onValueChange={(val) => updateData({ familySize: val })}
            />

            <View style={styles.budgetCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.budgetLabel}>{t('WEEKLY_BUDGET')}</Text>
                    <Text style={styles.budgetValue}>
                        {localBudget} <Text style={{fontSize: 16}}>{t('CURRENCY.UAH')}</Text>
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
                <Text style={styles.hint}>{t('STEP4_SUBTITLE')}</Text>
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