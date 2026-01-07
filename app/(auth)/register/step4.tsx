import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import authService from '@/services/auth.service';
import { RegisterDto } from '@/types';

export default function Step4() {
    const router = useRouter();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    // Fix: Select only the fields you need, not the entire state object
    const name = useOnboardingStore((state) => state.name);
    const email = useOnboardingStore((state) => state.email);
    const password = useOnboardingStore((state) => state.password);
    const age = useOnboardingStore((state) => state.age);
    const weight = useOnboardingStore((state) => state.weight);
    const height = useOnboardingStore((state) => state.height);
    const goal = useOnboardingStore((state) => state.goal);
    const allergies = useOnboardingStore((state) => state.allergies);
    const dislikedProducts = useOnboardingStore((state) => state.dislikedProducts);
    const eatsBreakfast = useOnboardingStore((state) => state.eatsBreakfast);
    const eatsLunch = useOnboardingStore((state) => state.eatsLunch);
    const eatsDinner = useOnboardingStore((state) => state.eatsDinner);
    const eatsSnack = useOnboardingStore((state) => state.eatsSnack);
    const resetOnboarding = useOnboardingStore((state) => state.resetData);

    const { setToken } = useAuthStore();

    // Memoize the data object to prevent unnecessary re-renders
    const onboardingData = useMemo(() => ({
        name,
        email,
        password,
        age,
        weight,
        height,
        goal,
        allergies,
        dislikedProducts,
        eatsBreakfast,
        eatsLunch,
        eatsDinner,
        eatsSnack,
    }), [name, email, password, age, weight, height, goal, allergies, dislikedProducts, eatsBreakfast, eatsLunch, eatsDinner, eatsSnack]);

    const handleFinish = useCallback(async () => {
        setIsLoading(true);

        try {
            if (!onboardingData.goal) {
                throw new Error('Goal is required');
            }

            const registerData: RegisterDto = {
                email: onboardingData.email,
                password: onboardingData.password,
                name: onboardingData.name,
                age: onboardingData.age,
                weight: onboardingData.weight,
                height: onboardingData.height,
                goal: onboardingData.goal,
                allergies: onboardingData.allergies,
                dislikedProducts: onboardingData.dislikedProducts,
                eatsBreakfast: onboardingData.eatsBreakfast,
                eatsLunch: onboardingData.eatsLunch,
                eatsDinner: onboardingData.eatsDinner,
                eatsSnack: onboardingData.eatsSnack,
            };

            const response = await authService.register(registerData);
            await setToken(response.access_token);
            resetOnboarding();
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
    }, [onboardingData, router, resetOnboarding, setToken]);

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
                name="checkmark-circle-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('ALMOST_DONE')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP4_TITLE')}</Text>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>{t('YOUR_PROFILE')}</Text>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('YOUR_NAME')}:</Text>
                    <Text style={styles.summaryValue}>{onboardingData.name}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('HEIGHT')}:</Text>
                    <Text style={styles.summaryValue}>{onboardingData.height} {t('UNITS.SM')}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('WEIGHT')}:</Text>
                    <Text style={styles.summaryValue}>{onboardingData.weight} {t('UNITS.KG')}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('YOUR_TARGET')}:</Text>
                    <Text style={styles.summaryValue}>
                        {onboardingData.goal ? t(`TARGETS.${onboardingData.goal}`) : '-'}
                    </Text>
                </View>
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        marginTop: 20
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 16,
        color: Colors.textGray,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
    },
});