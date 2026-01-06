import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function Step1() {
    const router = useRouter();
    const { t } = useTranslation();
    const { data, updateData } = useOnboarding();
    const [showInviteCode, setShowInviteCode] = useState(false);
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        inviteCode: false
    });

    const validation = useMemo(() => {
        const nameValid = (data.name?.trim().length || 0) > 1;
        const emailValid = validateEmail(data.email || '');
        const passwordValid = (data.password?.length || 0) >= 6;

        return {
            name: nameValid,
            email: emailValid,
            password: passwordValid,
            isFormValid: nameValid && emailValid && passwordValid
        };
    }, [data.name, data.email, data.password]);

    const handleNameBlur = () => setTouched(prev => ({ ...prev, name: true }));
    const handleEmailBlur = () => setTouched(prev => ({ ...prev, email: true }));
    const handlePasswordBlur = () => setTouched(prev => ({ ...prev, password: true }));

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.CONTINUE')}
                    showArrow
                    disabled={!validation.isFormValid}
                    onPress={() => router.push('/(auth)/register/step2')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={1} />,
            }} />

            <Ionicons
                name="person-add-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('LETS_MEET')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP1_TITLE')}</Text>

            <View>
                <Text style={SharedStyles.label}>{t('YOUR_NAME')}</Text>
                <ThemeInput
                    placeholder={t('PLACEHOLDERS.NAME')}
                    value={data.name}
                    onChangeText={(val) => updateData({ name: val })}
                    onBlur={handleNameBlur}
                />
                {touched.name && !validation.name && (
                    <Text style={styles.errorText}>
                        {t('VALIDATORS.NAME')}
                    </Text>
                )}

                <Text style={SharedStyles.label}>{t('EMAIL')}</Text>
                <ThemeInput
                    placeholder={t('PLACEHOLDERS.EMAIL_EXAMPLE')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={data.email}
                    onChangeText={(val) => updateData({ email: val })}
                    onBlur={handleEmailBlur}
                />
                {touched.email && !validation.email && (
                    <Text style={styles.errorText}>
                        {t('VALIDATORS.EMAIL')}
                    </Text>
                )}

                <Text style={SharedStyles.label}>{t('PASSWORD')}</Text>
                <ThemeInput
                    placeholder={t('PLACEHOLDERS.MIN_LEN')}
                    secureTextEntry
                    value={data.password}
                    onChangeText={(val) => updateData({ password: val })}
                    onBlur={handlePasswordBlur}
                />
                {touched.password && !validation.password && (
                    <Text style={styles.errorText}>
                        {t('VALIDATORS.PASSWORD')}
                    </Text>
                )}

                <TouchableOpacity
                    style={styles.inviteToggle}
                    onPress={() => setShowInviteCode(!showInviteCode)}
                >
                    <Ionicons
                        name={showInviteCode ? "chevron-down" : "chevron-forward"}
                        size={20}
                        color={Colors.primary}
                    />
                    <Text style={styles.inviteToggleText}>
                        {t('HAVE_INVITE_CODE')}
                    </Text>
                </TouchableOpacity>

                {showInviteCode && (
                    <>
                        <Text style={SharedStyles.label}>{t('INVITE_CODE')}</Text>
                        <ThemeInput
                            placeholder={t('PLACEHOLDERS.INVITE_CODE')}
                            autoCapitalize="characters"
                            value={data.inviteCode}
                            onChangeText={(val) => updateData({ inviteCode: val.toUpperCase() })}
                        />
                        <Text style={styles.hintText}>
                            {t('INVITE_CODE_HINT')}
                        </Text>
                    </>
                )}
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: Colors.danger,
        fontSize: 12,
        marginTop: -12,
        marginBottom: 12,
    },
    inviteToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    inviteToggleText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    hintText: {
        fontSize: 12,
        color: Colors.textGray,
        marginTop: -8,
        marginBottom: 16,
        marginLeft: 4,
    },
});