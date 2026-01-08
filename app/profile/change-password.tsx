import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { validatePassword } from '@/utils/validation';
import userService from '@/services/user.service';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const validation = {
        oldPassword: validatePassword(oldPassword),
        newPassword: validatePassword(newPassword),
        confirmPassword: newPassword === confirmPassword && confirmPassword.length > 0,
        isFormValid:
            validatePassword(oldPassword) &&
            validatePassword(newPassword) &&
            newPassword === confirmPassword,
    };

    const handleChangePassword = async () => {
        if (!validation.isFormValid) {
            setTouched({
                oldPassword: true,
                newPassword: true,
                confirmPassword: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            await userService.changePassword({
                oldPassword,
                newPassword,
            });

            showToast({
                message: t('SUCCESS.PASSWORD_CHANGED'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            router.back();
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
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('CHANGE_PASSWORD'),
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
                    {t('CHANGE_PASSWORD_DESCRIPTION')}
                </Text>

                <ThemeInput
                    label={t('CURRENT_PASSWORD')}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                    onBlur={() => setTouched({ ...touched, oldPassword: true })}
                    error={
                        touched.oldPassword && !validation.oldPassword
                            ? t('VALIDATORS.PASSWORD')
                            : undefined
                    }
                />

                <ThemeInput
                    label={t('NEW_PASSWORD')}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    onBlur={() => setTouched({ ...touched, newPassword: true })}
                    error={
                        touched.newPassword && !validation.newPassword
                            ? t('VALIDATORS.PASSWORD')
                            : undefined
                    }
                />

                <ThemeInput
                    label={t('CONFIRM_NEW_PASSWORD')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                    error={
                        touched.confirmPassword && !validation.confirmPassword
                            ? t('VALIDATORS.PASSWORD_MISMATCH')
                            : undefined
                    }
                />

                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={t('BUTTONS.CHANGE_PASSWORD')}
                    onPress={handleChangePassword}
                    loading={isLoading}
                    disabled={isLoading || !validation.isFormValid}
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
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
});