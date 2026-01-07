import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { useOnboardingStore } from '@/store/onboardingStore';
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
    const { name, email, password, updateData } = useOnboardingStore();

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        age: false
    });

    const validation = useMemo(() => {
        const nameValid = (name?.trim().length || 0) > 1;
        const emailValid = validateEmail(email || '');
        const passwordValid = (password?.length || 0) >= 6;

        return {
            name: nameValid,
            email: emailValid,
            password: passwordValid,
            isFormValid: nameValid && emailValid && passwordValid
        };
    }, [name, email, password]);

    const handleNameBlur = () => setTouched(prev => ({ ...prev, name: true }));
    const handleEmailBlur = () => setTouched(prev => ({ ...prev, email: true }));
    const handlePasswordBlur = () => setTouched(prev => ({ ...prev, password: true }));
    const handleAgeBlur = () => setTouched(prev => ({...prev, age: true}))

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
                    value={name}
                    onChangeText={(val) => updateData({ name: val })}
                    onBlur={handleNameBlur}
                />
                {touched.name && !validation.name && (
                    <Text style={styles.errorText}>
                        {t('VALIDATORS.NAME')}
                    </Text>
                )}

                <Text style={SharedStyles.label}>{t('YOUR_AGE')} {'(' + t('OPTIONAL') + ')'}</Text>
                <ThemeInput
                    onChangeText={(val) => updateData({age: parseInt(val)})}
                    onBlur={handleAgeBlur}
                    keyboardType="numeric"
                    placeholder={'ex: 20'}
                ></ThemeInput>


                <Text style={SharedStyles.label}>{t('EMAIL')}</Text>
                <ThemeInput
                    placeholder={t('PLACEHOLDERS.EMAIL_EXAMPLE')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
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
                    value={password}
                    onChangeText={(val) => updateData({ password: val })}
                    onBlur={handlePasswordBlur}
                />
                {touched.password && !validation.password && (
                    <Text style={styles.errorText}>
                        {t('VALIDATORS.PASSWORD')}
                    </Text>
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
});