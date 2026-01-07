import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import authService from '@/services/auth.service';
import { RegisterDto } from '@/types/auth';

export default function Step5() {
    const router = useRouter();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        email, password, name,
        ownerProfile, familyMembers,
        budgetLimit, setBudgetLimit,
        resetData
    } = useOnboardingStore();

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
            Alert.alert(
                t('ERRORS.REGISTRATION_FAILED'),
                error.response?.data?.message || 'Something went wrong',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    }, [email, password, name, ownerProfile, familyMembers, budgetLimit, router]);

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

            <Ionicons name="wallet-outline" size={48} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

            <Text style={SharedStyles.title}>{t('BUDGET_AND_REVIEW')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP5_SUBTITLE')}</Text>

            <View style={{ marginBottom: 30 }}>
                <Text style={SharedStyles.label}>{t('WEEKLY_BUDGET')} (UAH)</Text>
                <ThemeInput
                    keyboardType="numeric"
                    placeholder="0"
                    value={budgetLimit ? budgetLimit.toString() : ''}
                    onChangeText={(val) => setBudgetLimit(parseFloat(val) || 0)}
                    rightIcon={<Text style={{color: Colors.textGray, fontWeight: '600'}}>₴</Text>}
                />
                <Text style={styles.hintText}>{t('BUDGET_HINT')}</Text>
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>{t('SUMMARY')}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>{t('ACCOUNT')}</Text>
                    <Text style={styles.value}>{name}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{t('GOAL')}</Text>
                    <Text style={styles.value}>{ownerProfile.goal ? t(`TARGETS.${ownerProfile.goal}`) : '-'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>{t('FAMILY_SIZE')}</Text>
                    <Text style={styles.value}>{1 + familyMembers.length} {t('PEOPLE')}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{t('TOTAL_ALLERGIES')}</Text>
                    <Text style={styles.value}>
                        {(ownerProfile.allergyIds?.length || 0) +
                            familyMembers.reduce((acc, m) => acc + (m.allergyIds?.length || 0), 0)}
                    </Text>
                </View>
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    hintText: { fontSize: 12, color: Colors.textGray, marginTop: -8, marginLeft: 4 },
    summaryCard: {
        backgroundColor: Colors.white, padding: 20, borderRadius: 20,
        borderWidth: 1, borderColor: Colors.inputBorder
    },
    summaryTitle: { fontSize: 18, fontWeight: '700', color: Colors.secondary, marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { color: Colors.textGray, fontSize: 16 },
    value: { color: Colors.secondary, fontWeight: '600', fontSize: 16 },
    divider: { height: 1, backgroundColor: Colors.inputBorder, marginVertical: 12 }
});