import React, { useMemo, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { SharedStyles } from '@/constants/SharedStyles';
import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { useOnboardingStore } from '@/store/onboardingStore';
import authService from '@/services/auth.service';
import { validateEmail, validateName, validatePassword } from '@/utils/validation';

interface TouchedFields {
    name: boolean;
    email: boolean;
    password: boolean;
}

export default function Step1() {
    const router = useRouter();
    const { t } = useTranslation();
    const { name, email, password, updateAccount, updateOwnerProfile } = useOnboardingStore();

    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [touched, setTouched] = useState<TouchedFields>({
        name: false,
        email: false,
        password: false,
    });

    const validation = useMemo(() => {
        const nameValid = validateName(name || '');
        const emailValid = validateEmail(email || '');
        const passwordValid = validatePassword(password || '');

        return {
            name: nameValid,
            email: emailValid,
            password: passwordValid,
            isFormValid: nameValid && emailValid && passwordValid,
        };
    }, [name, email, password]);

    const handleNameChange = (val: string) => {
        updateAccount({ name: val });
        updateOwnerProfile({ name: val });
    };

    const handleEmailChange = (val: string) => {
        updateAccount({ email: val });
        setEmailExistsError(false);
    };

    const handleContinue = async () => {
        if (!validation.isFormValid) return;

        setIsCheckingEmail(true);
        setEmailExistsError(false);

        try {
            const exists = await authService.isExistentUser(email);
            if (exists) {
                setEmailExistsError(true);
                Alert.alert(t('ERRORS.EMAIL_EXISTS'), t('ERRORS.EMAIL_EXISTS_MESSAGE'));
            } else {
                router.push('/(auth)/register/step2');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            Alert.alert(t('ERRORS.GENERIC'), t('ERRORS.TRY_AGAIN'));
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleBlur = (field: keyof TouchedFields) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.CONTINUE')}
                    showArrow
                    loading={isCheckingEmail}
                    disabled={!validation.isFormValid || emailExistsError}
                    onPress={handleContinue}
                />
            }
        >
            <Stack.Screen
                options={{
                    headerTitle: () => <StepHeader currentStep={1} />,
                }}
            />

            <Ionicons
                name="person-add-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('LETS_MEET')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP1_TITLE')}</Text>

            <View>
                <ThemeInput
                    label={t('YOUR_NAME')}
                    placeholder={t('PLACEHOLDERS.NAME')}
                    value={name}
                    onChangeText={handleNameChange}
                    onBlur={() => handleBlur('name')}
                    error={touched.name && !validation.name ? t('VALIDATORS.NAME') : undefined}
                />

                <ThemeInput
                    label={t('EMAIL')}
                    placeholder={t('PLACEHOLDERS.EMAIL_EXAMPLE')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    error={
                        emailExistsError
                            ? t('ERRORS.EMAIL_EXISTS')
                            : touched.email && !validation.email
                                ? t('VALIDATORS.EMAIL')
                                : undefined
                    }
                />

                <ThemeInput
                    label={t('PASSWORD')}
                    placeholder={t('PLACEHOLDERS.MIN_LEN')}
                    secureTextEntry
                    value={password}
                    onChangeText={(val) => updateAccount({ password: val })}
                    onBlur={() => handleBlur('password')}
                    error={touched.password && !validation.password ? t('VALIDATORS.PASSWORD') : undefined}
                />
            </View>
        </StepLayout>
    );
}