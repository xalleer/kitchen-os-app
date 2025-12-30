import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function Step1() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    const isFormValid = useMemo(() => {
        const emailRegex = /\S+@\S+\.\S+/;
        return (data.name?.trim().length > 1) && emailRegex.test(data.email || '') && (data.password?.length >= 6);
    }, [data.name, data.email, data.password]);

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title="Продовжити"
                    showArrow
                    disabled={!isFormValid}
                    onPress={() => router.push('/(auth)/register/step2')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={1} />,

            }} />

            <Ionicons name="person-add-outline" size={48} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

            <Text style={SharedStyles.title}>Давай знайомитись</Text>
            <Text style={SharedStyles.subtitle}>Створи свій акаунт для Kitchen OS.</Text>

            <View>
                <Text style={SharedStyles.label}>Твоє ім'я</Text>
                <ThemeInput
                    placeholder="Введи ім'я"
                    value={data.name}
                    onChangeText={(val) => updateData({ name: val })}
                />

                <Text style={SharedStyles.label}>Email</Text>
                <ThemeInput
                    placeholder="example@mail.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={data.email}
                    onChangeText={(val) => updateData({ email: val })}
                />

                <Text style={SharedStyles.label}>Пароль</Text>
                <ThemeInput
                    placeholder="Мінімум 6 символів"
                    secureTextEntry
                    value={data.password}
                    onChangeText={(val) => updateData({ password: val })}
                />
            </View>
        </StepLayout>
    );
}