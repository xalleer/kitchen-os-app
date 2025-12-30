import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SocialButton } from '@/components/ui/SocialButton';
import {useTranslation} from "react-i18next";

const PlaceholderBackground = ({children}: any) => (
    <View style={{flex: 1,}}>{children}</View>
);

export default function Welcome() {
    const router = useRouter();

    const { t } = useTranslation();

    return (
        <ImageBackground source={require('@/assets/images/welcome.png')} style={styles.bg}>
        <PlaceholderBackground>
            <View style={styles.overlayContent}>
                <View style={SharedStyles.glassCard}>
                    <Ionicons name="nutrition" size={48} color={Colors.primary} style={{ marginBottom: 20 }} />
                    <Text style={styles.cardTitle}>{t('APP_NAME')}</Text>
                    <Text style={styles.cardSubtitle}>{t('WELCOME_TITLE')}</Text>

                    <PrimaryButton
                        title={t('GET_STARTED')}
                        onPress={() => router.push('/(auth)/register/step1')}
                        style={{ marginBottom: 16 }}
                    />

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>{t('CONTINUE_WITH')}</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={{marginBottom: 16, gap: 16, width: '100%', justifyContent: 'center'}}>
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

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.textGray }}>{t('HAVE_ACCOUNT')} </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={{ color: Colors.primary, fontWeight: '600' }}>{t('SIGN_IN')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </PlaceholderBackground>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlayContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 24,
        paddingBottom: 50,
    },
    cardTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.secondary,
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 16,
        color: Colors.secondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
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
});