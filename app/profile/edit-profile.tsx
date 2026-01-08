import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/ToastProvider';
import { validateEmail, validateName } from '@/utils/validation';

export default function EditProfileScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { profile, updateProfile, isLoading } = useUserStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState({ name: false, email: false });

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);

    const handleSave = async () => {
        if (!validateName(name) || !validateEmail(email)) {
            setTouched({ name: true, email: true });
            return;
        }

        try {
            await updateProfile({ name, email });
            showToast({
                message: t('SUCCESS.PROFILE_UPDATED'),
                type: 'success',
                icon: 'checkmark-circle',
            });
            router.back();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
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
                    headerTitle: t('EDIT_PROFILE'),
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
                <Text style={styles.sectionTitle}>{t('BASIC_INFO')}</Text>

                <ThemeInput
                    label={t('YOUR_NAME')}
                    value={name}
                    onChangeText={setName}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    error={touched.name && !validateName(name) ? t('VALIDATORS.NAME') : undefined}
                />

                <ThemeInput
                    label={t('EMAIL')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={() => setTouched({ ...touched, email: true })}
                    error={touched.email && !validateEmail(email) ? t('VALIDATORS.EMAIL') : undefined}
                />

                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={t('BUTTONS.SAVE')}
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading || !validateName(name) || !validateEmail(email)}
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
});