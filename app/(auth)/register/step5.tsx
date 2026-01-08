import React, { useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { CardStyles } from '@/constants/CardStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import authService from '@/services/auth.service';
import { RegisterDto } from '@/types/auth';
import {useToast} from "@/components/ui/ToastProvider";

export default function Step5() {
    const router = useRouter();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const {showToast} = useToast();

    const { email, password, name, ownerProfile, familyMembers, budgetLimit, setBudgetLimit, resetData } =
        useOnboardingStore();

    const { setToken } = useAuthStore();

    const handleFinish = useCallback(async () => {
        setIsLoading(true);
        try {
            const registerPayload: RegisterDto = {
                email,
                password,
                name,
                ownerProfile,
                familyMembers,
                budgetLimit: budgetLimit || 0,
            };

            const response = await authService.register(registerPayload);
            await setToken(response.access_token);
            resetData();
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Registration error:', error);
            showToast({
                message: (t('ERRORS.REGISTRATION_FAILED'), error.message || t('ERRORS.TRY_AGAIN')),
                type: 'error'
            })
        } finally {
            setIsLoading(false);
        }
    }, [email, password, name, ownerProfile, familyMembers, budgetLimit, router, resetData, setToken, t]);

    const getTotalAllergies = () => {
        const ownerAllergies = ownerProfile.allergyIds?.length || 0;
        const memberAllergies = familyMembers.reduce((acc, m) => acc + (m.allergyIds?.length || 0), 0);
        return ownerAllergies + memberAllergies;
    };

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
            <Stack.Screen options={{ headerTitle: () => <StepHeader currentStep={5} /> }} />

            <Ionicons
                name="wallet-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('BUDGET_AND_REVIEW')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP5_SUBTITLE')}</Text>

            <View style={{ marginBottom: 30 }}>
                <Text style={SharedStyles.label}>{t('WEEKLY_BUDGET')} (UAH)</Text>
                <ThemeInput
                    keyboardType="numeric"
                    placeholder="0"
                    value={budgetLimit ? budgetLimit.toString() : ''}
                    onChangeText={(val) => setBudgetLimit(parseFloat(val) || 0)}
                    rightIcon={<Text style={{ color: Colors.textGray, fontWeight: '600' }}>₴</Text>}
                />
                <Text style={{ fontSize: 12, color: Colors.textGray, marginTop: -8, marginLeft: 4 }}>
                    {t('BUDGET_HINT')}
                </Text>
            </View>

            <View style={CardStyles.card}>
                <Text style={CardStyles.cardTitle}>{t('SUMMARY')}</Text>

                <View style={CardStyles.summaryRow}>
                    <Text style={CardStyles.summaryLabel}>{t('ACCOUNT')}</Text>
                    <Text style={CardStyles.summaryValue}>{name}</Text>
                </View>

                <View style={CardStyles.summaryRow}>
                    <Text style={CardStyles.summaryLabel}>{t('GOAL')}</Text>
                    <Text style={CardStyles.summaryValue}>
                        {ownerProfile.goal ? t(`TARGETS.${ownerProfile.goal}`) : '-'}
                    </Text>
                </View>

                <View style={CardStyles.cardDivider} />

                <View style={CardStyles.summaryRow}>
                    <Text style={CardStyles.summaryLabel}>{t('FAMILY_SIZE')}</Text>
                    <Text style={CardStyles.summaryValue}>
                        {1 + familyMembers.length} {t('PEOPLE')}
                    </Text>
                </View>

                <View style={CardStyles.summaryRow}>
                    <Text style={CardStyles.summaryLabel}>{t('TOTAL_ALLERGIES')}</Text>
                    <Text style={CardStyles.summaryValue}>{getTotalAllergies()}</Text>
                </View>
            </View>
        </StepLayout>
    );
}