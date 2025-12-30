import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function Step1() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false
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
                    title="Продовжити"
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

            <Text style={SharedStyles.title}>Давай знайомитись</Text>
            <Text style={SharedStyles.subtitle}>Створи свій акаунт для Kitchen OS.</Text>

            <View>
                <Text style={SharedStyles.label}>Твоє ім'я</Text>
                <ThemeInput
                    placeholder="Введи ім'я"
                    value={data.name}
                    onChangeText={(val) => updateData({ name: val })}
                    onBlur={handleNameBlur}
                />
                {touched.name && !validation.name && (
                    <Text style={{ color: Colors.danger, fontSize: 12, marginTop: -12, marginBottom: 12 }}>
                        Ім'я має бути більше 1 символу
                    </Text>
                )}

                <Text style={SharedStyles.label}>Email</Text>
                <ThemeInput
                    placeholder="example@mail.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={data.email}
                    onChangeText={(val) => updateData({ email: val })}
                    onBlur={handleEmailBlur}
                />
                {touched.email && !validation.email && (
                    <Text style={{ color: Colors.danger, fontSize: 12, marginTop: -12, marginBottom: 12 }}>
                        Введи коректний email
                    </Text>
                )}

                <Text style={SharedStyles.label}>Пароль</Text>
                <ThemeInput
                    placeholder="Мінімум 6 символів"
                    secureTextEntry
                    value={data.password}
                    onChangeText={(val) => updateData({ password: val })}
                    onBlur={handlePasswordBlur}
                />
                {touched.password && !validation.password && (
                    <Text style={{ color: Colors.danger, fontSize: 12, marginTop: -12, marginBottom: 12 }}>
                        Пароль має містити мінімум 6 символів
                    </Text>
                )}
            </View>
        </StepLayout>
    );
}