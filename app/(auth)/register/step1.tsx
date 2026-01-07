import React, { useMemo, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
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
import authService from '@/services/auth.service';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function Step1() {
    const router = useRouter();
    const { t } = useTranslation();
    const { name, email, password, updateAccount, updateOwnerProfile } = useOnboardingStore();

    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        age: false
    });

    const handleNameChange = (val: string) => {
        updateAccount({ name: val });
        updateOwnerProfile({ name: val });
    };

    const handleContinue = async () => {
        if (!validation.isFormValid) return;

        setIsCheckingEmail(true);
        setEmailExistsError(false);

        try {
            const exists = await authService.isExistentUser(email);
            console.log(exists)
            if (exists) {
                setEmailExistsError(true);
                Alert.alert('Error', 'Email already exists. Please choose another one.')
            } else {
                router.push('/(auth)/register/step2');
            }
        } catch (error) {
            console.error("Помилка перевірки емейлу:", error);
        } finally {
            setIsCheckingEmail(false);
        }
    };

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

    const onInputEmail = (email: string) => {
        updateAccount({ email: email });
        setEmailExistsError(false);
    }

    const handleNameBlur = () => setTouched(prev => ({ ...prev, name: true }));
    const handleEmailBlur = () => setTouched(prev => ({ ...prev, email: true }));
    const handlePasswordBlur = () => setTouched(prev => ({ ...prev, password: true }));

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
                    onChangeText={handleNameChange}
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
                    value={email}
                    onChangeText={(val) => onInputEmail(val)}
                    // onChangeText={(val) => updateAccount({ email: val })}
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
                    onChangeText={(val) => updateAccount({ password: val })}
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