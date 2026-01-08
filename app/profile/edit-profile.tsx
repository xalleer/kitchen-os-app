import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';

import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectableCard } from '@/components/ui/auth/SelectableCard';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/ToastProvider';
import { validateEmail, validateName } from '@/utils/validation';
import { Goal } from '@/types';

export default function EditProfileScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { profile, updateProfile, updatePreferences, isLoading } = useUserStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [goal, setGoal] = useState<Goal | undefined>(undefined);
    const [touched, setTouched] = useState({ name: false, email: false });

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
            setWeight(profile.memberProfile?.weight || 70);
            setHeight(profile.memberProfile?.height || 170);
            setGoal(profile.memberProfile?.goal);
        }
    }, [profile]);

    const handleWeightChange = useCallback((val: number) => {
        setWeight(val);
    }, []);

    const handleHeightChange = useCallback((val: number) => {
        setHeight(val);
    }, []);

    const handleSave = async () => {
        if (!validateName(name) || !validateEmail(email)) {
            setTouched({ name: true, email: true });
            return;
        }

        try {
            router.back();

            await updateProfile({ name, email });

            await updatePreferences({
                weight,
                height,
                goal,
            });

            showToast({
                message: t('SUCCESS.PROFILE_UPDATED'),
                type: 'success',
                icon: 'checkmark-circle',
            });
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

                <Text style={styles.sectionTitle}>{t('BODY_METRICS')}</Text>

                <View style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>{t('HEIGHT')}</Text>
                        <Text style={styles.metricValue}>
                            {Math.round(height)} <Text style={styles.metricUnit}>{t('UNITS.SM')}</Text>
                        </Text>
                    </View>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={140}
                        maximumValue={220}
                        step={1}
                        value={height}
                        onValueChange={handleHeightChange}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor={Colors.inputBorder}
                        thumbTintColor={Colors.primary}
                    />
                </View>

                <View style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>{t('WEIGHT')}</Text>
                        <Text style={styles.metricValue}>
                            {Math.round(weight)} <Text style={styles.metricUnit}>{t('UNITS.KG')}</Text>
                        </Text>
                    </View>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={40}
                        maximumValue={150}
                        step={1}
                        value={weight}
                        onValueChange={handleWeightChange}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor={Colors.inputBorder}
                        thumbTintColor={Colors.primary}
                    />
                </View>

                <Text style={styles.sectionTitle}>{t('YOUR_TARGET')}</Text>

                <View style={styles.goalGrid}>
                    <SelectableCard
                        title={t('TARGETS.LOSE_WEIGHT')}
                        iconName="body"
                        isSelected={goal === Goal.LOSE_WEIGHT}
                        onPress={() => setGoal(Goal.LOSE_WEIGHT)}
                    />
                    <SelectableCard
                        title={t('TARGETS.GAIN_WEIGHT')}
                        iconName="barbell"
                        isSelected={goal === Goal.GAIN_WEIGHT}
                        onPress={() => setGoal(Goal.GAIN_WEIGHT)}
                    />
                    <SelectableCard
                        title={t('TARGETS.MAINTAIN')}
                        iconName="heart"
                        isSelected={goal === Goal.MAINTAIN}
                        onPress={() => setGoal(Goal.MAINTAIN)}
                    />
                    <SelectableCard
                        title={t('TARGETS.HEALTHY')}
                        iconName="leaf"
                        isSelected={goal === Goal.HEALTHY}
                        onPress={() => setGoal(Goal.HEALTHY)}
                    />
                </View>

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
        marginTop: 8,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
    metricCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricLabel: {
        fontSize: 16,
        color: Colors.secondary,
        fontWeight: '600',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.secondary,
    },
    metricUnit: {
        fontSize: 14,
        color: Colors.textGray,
        fontWeight: '500',
    },
    goalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});