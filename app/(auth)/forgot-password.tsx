import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import authService from '@/services/auth.service';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState(false);

    const handleSendCode = async () => {
        if (!validateEmail(email)) {
            setTouched(true);
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword(email);

            showToast({
                message: t('SUCCESS.CODE_SENT'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            router.push({
                pathname: '/(auth)/reset-password',
                params: { email },
            });
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
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
                <Ionicons
                    name="lock-closed-outline"
                    size={64}
                    color={Colors.primary}
                    style={styles.icon}
                />

                <Text style={SharedStyles.title}>{t('FORGOT_PASSWORD')}</Text>
                <Text style={styles.subtitle}>
                    {t('FORGOT_PASSWORD_DESCRIPTION')}
                </Text>

                <ThemeInput
                    label={t('EMAIL')}
                    placeholder={t('PLACEHOLDERS.EMAIL')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => setTouched(true)}
                    error={touched && !validateEmail(email) ? t('VALIDATORS.EMAIL') : undefined}
                />

                <PrimaryButton
                    title={t('BUTTONS.SEND_CODE')}
                    showArrow
                    onPress={handleSendCode}
                    loading={isLoading}
                    disabled={isLoading || !validateEmail(email)}
                />

                <View style={styles.infoBox}>
                    <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color={Colors.primary}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>
                        {t('FORGOT_PASSWORD_INFO')}
                    </Text>
                </View>
            </ScrollView>
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
        padding: 24,
        paddingTop: 40,
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.inputBackground,
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: Colors.secondary,
        lineHeight: 20,
    },
});