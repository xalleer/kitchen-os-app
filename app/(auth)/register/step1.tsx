import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StepHeader } from '@/components/navigation/StepHeader';
import { useOnboarding } from '@/context/OnboardingContext';

export default function Step1() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    const isFormValid = useMemo(() => {
        const emailRegex = /\S+@\S+\.\S+/;
        return (
            (data.name?.trim().length || 0) > 1 &&
            emailRegex.test(data.email || '') &&
            (data.password?.length || 0) >= 6
        );
    }, [data.name, data.email, data.password]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={1} />,
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                        <Text style={{ color: Colors.primary, fontWeight: '600' }}>Skip</Text>
                    </TouchableOpacity>
                )
            }} />

            <ScrollView contentContainerStyle={[SharedStyles.containerMain, { flexGrow: 1 }]} bounces={false}>
                <Text style={SharedStyles.title}>Давай знайомитись</Text>
                <Text style={SharedStyles.subtitle}>Створи свій акаунт для Kitchen OS.</Text>

                <View style={{ marginTop: 20 }}>
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

                <View style={{ flex: 1 }} />

                <PrimaryButton
                    title="Продовжити"
                    showArrow
                    disabled={!isFormValid}
                    onPress={() => router.push('/(auth)/register/step2')}
                    style={{ marginBottom: 30 }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}