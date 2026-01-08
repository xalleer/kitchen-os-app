import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useToast } from '@/components/ui/ToastProvider';

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

const LANGUAGES: Language[] = [
    {
        code: 'uk',
        name: 'Ukrainian',
        nativeName: 'Українська',
        flag: '🇺🇦',
    },
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
    },
];

export default function LanguageScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { showToast } = useToast();

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const handleLanguageChange = async (languageCode: string) => {
        try {
            setSelectedLanguage(languageCode);
            await i18n.changeLanguage(languageCode);

            showToast({
                message: t('SUCCESS.LANGUAGE_CHANGED'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            setTimeout(() => {
                router.back();
            }, 500);
        } catch (error) {
            showToast({
                message: t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('LANGUAGE'),
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerBackTitle: '',
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                <Text style={styles.description}>
                    {t('LANGUAGE_DESCRIPTION')}
                </Text>

                {LANGUAGES.map((language) => {
                    const isSelected = selectedLanguage === language.code;

                    return (
                        <TouchableOpacity
                            key={language.code}
                            style={[
                                styles.languageCard,
                                isSelected && styles.languageCardSelected,
                            ]}
                            onPress={() => handleLanguageChange(language.code)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.languageLeft}>
                                <Text style={styles.flag}>{language.flag}</Text>
                                <View style={styles.languageInfo}>
                                    <Text style={styles.languageName}>
                                        {language.nativeName}
                                    </Text>
                                    <Text style={styles.languageNameEn}>
                                        {language.name}
                                    </Text>
                                </View>
                            </View>

                            {isSelected && (
                                <View style={styles.checkmarkContainer}>
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={24}
                                        color={Colors.primary}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.infoBox}>
                    <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color={Colors.primary}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>
                        {t('LANGUAGE_INFO')}
                    </Text>
                </View>
            </ScrollView>
        </View>
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
    },
    description: {
        fontSize: 14,
        color: Colors.textGray,
        marginBottom: 24,
        lineHeight: 20,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
    },
    languageCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.lightGreen,
    },
    languageLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flag: {
        fontSize: 32,
        marginRight: 16,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 2,
    },
    languageNameEn: {
        fontSize: 14,
        color: Colors.textGray,
    },
    checkmarkContainer: {
        marginLeft: 12,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.inputBackground,
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
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