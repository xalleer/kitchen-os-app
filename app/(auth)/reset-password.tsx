import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import authService from '@/services/auth.service';
import { validatePassword } from '@/utils/validation';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const params = useLocalSearchParams();

    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({
        code: false,
        newPassword: false,
        confirmPassword: false,
    });

    const email = params.email as string;

    const validation = {
        code: code.length === 6 && /^\d+$/.test(code),
        newPassword: validatePassword(newPassword),
        confirmPassword: newPassword === confirmPassword && confirmPassword.length > 0,
        isFormValid:
            code.length === 6 &&
            /^\d+$/.test(code) &&
            validatePassword(newPassword) &&
            newPassword === confirmPassword,
    };

    const handleResetPassword = async () => {
        if (!validation.isFormValid) {
            setTouched({
                code: true,
                newPassword: true,
                confirmPassword: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({
                email,
                code,
                newPassword,
            });

            showToast({
                message: t('SUCCESS.PASSWORD_RESET'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            setTimeout(() => {
                router.replace('/(auth)/login');
            }, 1000);
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
                    name="key-outline"
                    size={64}
                    color={Colors.primary}
                    style={styles.icon}
                />

                <Text style={SharedStyles.title}>{t('RESET_PASSWORD')}</Text>
                <Text style={styles.subtitle}>
                    {t('RESET_PASSWORD_DESCRIPTION', { email })}
                </Text>

                <ThemeInput
                    label={t('VERIFICATION_CODE')}
                    placeholder="000000"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                    onBlur={() => setTouched({ ...touched, code: true })}
                    error={
                        touched.code && !validation.code
                            ? t('VALIDATORS.CODE')
                            : undefined
                    }
                />

                <ThemeInput
                    label={t('NEW_PASSWORD')}
                    placeholder={t('PLACEHOLDERS.MIN_LEN')}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    onBlur={() => setTouched({ ...touched, newPassword: true })}
                    error={
                        touched.newPassword && !validation.newPassword
                            ? t('VALIDATORS.PASSWORD')
                            : undefined
                    }
                />

                <ThemeInput
                    label={t('CONFIRM_NEW_PASSWORD')}
                    placeholder={t('PLACEHOLDERS.MIN_LEN')}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                    error={
                        touched.confirmPassword && !validation.confirmPassword
                            ? t('VALIDATORS.PASSWORD_MISMATCH')
                            : undefined
                    }
                />

                <PrimaryButton
                    title={t('BUTTONS.RESET_PASSWORD')}
                    onPress={handleResetPassword}
                    loading={isLoading}
                    disabled={isLoading || !validation.isFormValid}
                />

                <View style={styles.infoBox}>
                    <Ionicons
                        name="time-outline"
                        size={20}
                        color={Colors.primary}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>
                        {t('CODE_EXPIRES_INFO')}
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