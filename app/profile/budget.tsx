import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function BudgetScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { profile, updateBudget, isLoading } = useUserStore();

    const [budgetLimit, setBudgetLimit] = useState('');

    useEffect(() => {
        if (profile?.family?.budgetLimit) {
            setBudgetLimit(profile.family.budgetLimit.toString());
        }
    }, [profile]);

    const handleSave = async () => {
        const budget = parseFloat(budgetLimit);

        if (isNaN(budget) || budget < 0) {
            showToast({
                message: t('ERRORS.INVALID_BUDGET'),
                type: 'warning',
            });
            return;
        }

        try {
            await updateBudget(budget);
            showToast({
                message: t('SUCCESS.BUDGET_UPDATED'),
                type: 'success',
                icon: 'checkmark-circle',
            });
            router.back();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('WEEKLY_BUDGET'),
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerBackTitle: '',
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.description}>
                    {t('BUDGET_DESCRIPTION')}
                </Text>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>{t('CURRENT_BUDGET')}</Text>
                    <Text style={styles.infoValue}>
                        {profile?.family?.budgetLimit || 0} {t('CURRENCY.UAH')}
                    </Text>
                </View>

                <Text style={styles.label}>{t('NEW_BUDGET')} ({t('CURRENCY.UAH')})</Text>
                <ThemeInput
                    keyboardType="numeric"
                    placeholder="0"
                    value={budgetLimit}
                    onChangeText={setBudgetLimit}
                    rightIcon={<Text style={styles.currencyIcon}>₴</Text>}
                />
                <Text style={styles.hint}>
                    {t('BUDGET_HINT')}
                </Text>

                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={t('BUTTONS.SAVE')}
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading || !budgetLimit}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 120,
    },
    description: {
        fontSize: 14,
        color: Colors.textGray,
        marginBottom: 24,
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 14,
        color: Colors.textGray,
        marginBottom: 8,
    },
    infoValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    currencyIcon: {
        color: Colors.textGray,
        fontWeight: '600',
        fontSize: 18,
    },
    hint: {
        fontSize: 12,
        color: Colors.textGray,
        marginTop: 8,
        marginLeft: 4,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
});