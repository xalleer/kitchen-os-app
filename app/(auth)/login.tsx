import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SocialButton } from '@/components/ui/SocialButton';
import authService from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { validateEmail, validatePassword } from '@/utils/validation';
import {useToast} from "@/components/ui/ToastProvider";

interface TouchedFields {
    email: boolean;
    password: boolean;
}

export default function Login() {
    const router = useRouter();
    const { t } = useTranslation();
    const { setToken } = useAuthStore();
    const { login: googleLogin, isLoading: googleLoading } = useGoogleAuth();
    const { showToast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState<TouchedFields>({
        email: false,
        password: false,
    });

    const validation = useMemo(() => {
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);

        return {
            email: emailValid,
            password: passwordValid,
            isFormValid: emailValid && passwordValid,
        };
    }, [email, password]);

    const handleLogin = async () => {
        if (!validation.isFormValid) {
            setTouched({ email: true, password: true });
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });
            await setToken(response.access_token);
            router.replace('/(tabs)');
        } catch (error: any) {
            showToast({
                message: (t('ERRORS.LOGIN_FAILED'), t('ERRORS.INVALID_CREDENTIALS')),
                type: 'error'
            })
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            googleLogin();
        } catch (error: any) {
            showToast({
                message: error.message,
                type: 'error'
            })
        }
    };

    const handleBlur = (field: keyof TouchedFields) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerTintColor: Colors.secondary,
                        headerShadowVisible: false,
                        headerBackTitle: '',
                    }}
                />

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <ScrollView
                        automaticallyAdjustKeyboardInsets={true}
                        contentContainerStyle={[SharedStyles.containerMain, { flexGrow: 1 }]}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        <Ionicons
                            name="restaurant"
                            size={48}
                            color={Colors.primary}
                            style={{ alignSelf: 'center', marginBottom: 20 }}
                        />

                        <Text style={SharedStyles.title}>{t('WELCOME_BACK')}</Text>
                        <Text style={SharedStyles.subtitle}>{t('SIGN_IN_TITLE')}</Text>

                        <ThemeInput
                            label={t('EMAIL')}
                            placeholder={t('PLACEHOLDERS.EMAIL')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            onBlur={() => handleBlur('email')}
                            error={touched.email && !validation.email ? t('VALIDATORS.EMAIL') : undefined}
                        />

                        <ThemeInput
                            label={t('PASSWORD')}
                            placeholder={t('PLACEHOLDERS.PASSWORD')}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onBlur={() => handleBlur('password')}
                            error={touched.password && !validation.password ? t('VALIDATORS.PASSWORD') : undefined}
                        />

                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', marginBottom: 30 }}
                            onPress={() => router.push('/(auth)/forgot-password')}
                        >
                            <Text style={{ color: Colors.textGray }}>{t('FORGOT_PASSWORD')}</Text>
                        </TouchableOpacity>

                        <PrimaryButton
                            title={t('SIGN_IN')}
                            showArrow
                            onPress={handleLogin}
                            loading={isLoading}
                            disabled={isLoading}
                        />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>{t('CONTINUE_WITH')}</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socials}>
                            <SocialButton title="Google" icon="logo-google" onPress={handleGoogleLogin} />
                        </View>

                        <View style={styles.footer}>
                            <Text style={{ color: Colors.textGray }}>{t('DONT_HAVE_ACCOUNT')}</Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register/step1')}>
                                <Text style={{ color: Colors.primary, fontWeight: '600' }}>{t('SIGN_UP')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.inputBorder,
    },
    dividerText: {
        marginHorizontal: 10,
        color: Colors.textGray,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        paddingBottom: 20,
    },
    socials: {
        alignItems: 'center',
        gap: 16,
    },
});