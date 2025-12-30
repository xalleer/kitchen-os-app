import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SocialButton } from '@/components/ui/SocialButton';
import { Ionicons } from '@expo/vector-icons';
import {useTranslation} from "react-i18next";

export default function Login() {
    const router = useRouter();
    const { t } = useTranslation();

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

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ScrollView
                        automaticallyAdjustKeyboardInsets={true}
                        contentContainerStyle={[SharedStyles.containerMain, { flexGrow: 1 }]}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        <Ionicons name="restaurant" size={48} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={SharedStyles.title}>{t('WELCOME_BACK')}</Text>
                        <Text style={SharedStyles.subtitle}>{t('SIGN_IN_TITLE')}</Text>

                        <ThemeInput label={t('EMAIL')} placeholder={t('PLACEHOLDERS.EMAIL')} keyboardType="email-address" />

                        <ThemeInput label={t('PASSWORD')} placeholder={t('PLACEHOLDERS.PASSWORD')} secureTextEntry />

                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 30 }}>
                            <Text style={{ color: Colors.textGray }}>{ t('FORGOT_PASSWORD') }</Text>
                        </TouchableOpacity>

                        <PrimaryButton title={t('SIGN_IN')} showArrow onPress={() => router.push('/(tabs)')} />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>{t('CONTINUE_WITH')}</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socials}>
                            <SocialButton
                                title="Google"
                                icon="logo-google"
                                onPress={() => console.log('Google login')}
                            />
                            <SocialButton
                                title="Apple"
                                icon="logo-apple"
                                onPress={() => console.log('Apple login')}
                            />
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
    },
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
        gap: 16

    }
});