import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useOnboardingStore } from '@/store/onboardingStore';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

const calculateBMI = (weight: number, height: number): number => {
    if (!height) return 0;
    return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
};

const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'UNDERWEIGHT', color: '#FFC107' };
    if (bmi < 25) return { label: 'NORMAL', color: Colors.primary };
    if (bmi < 30) return { label: 'OVERWEIGHT', color: '#FF9800' };
    return { label: 'OBESE', color: '#F44336' };
};

export default function Step2() {
    const router = useRouter();
    const { t } = useTranslation();

    const { ownerProfile, updateOwnerProfile } = useOnboardingStore();

    const initialHeight = Number(ownerProfile.height) || 170;
    const initialWeight = Number(ownerProfile.weight) || 70;

    const [localHeight, setLocalHeight] = useState(initialHeight);
    const [localWeight, setLocalWeight] = useState(initialWeight);

    const bmiValue = useMemo(() => {
        return calculateBMI(localWeight, localHeight);
    }, [localWeight, localHeight]);

    const status = useMemo(() => getBmiStatus(bmiValue), [bmiValue]);

    const handleHeightChange = useCallback((val: number) => {
        setLocalHeight(val);
    }, []);

    const handleWeightChange = useCallback((val: number) => {
        setLocalWeight(val);
    }, []);

    const handleHeightComplete = useCallback((val: number) => {
        updateOwnerProfile({ height: val });
    }, [updateOwnerProfile]);

    const handleWeightComplete = useCallback((val: number) => {
        updateOwnerProfile({ weight: val });
    }, [updateOwnerProfile]);

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.CONTINUE')}
                    showArrow
                    onPress={() => router.push('/(auth)/register/step3')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={2} />
            }} />

            <Ionicons
                name="body-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('BODY_METRICS')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP2_TITLE')}</Text>

            <View style={styles.metricCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.metricLabel}>{t('HEIGHT')}</Text>
                    <Text style={styles.metricValue}>
                        {Math.round(localHeight)} <Text style={styles.metricUnit}>{t('UNITS.SM')}</Text>
                    </Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={140}
                    maximumValue={220}
                    step={1}
                    value={localHeight}
                    onValueChange={handleHeightChange}
                    onSlidingComplete={handleHeightComplete}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.inputBorder}
                    thumbTintColor={Colors.primary}
                />
            </View>

            <View style={styles.metricCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.metricLabel}>{t('WEIGHT')}</Text>
                    <Text style={styles.metricValue}>
                        {Math.round(localWeight)} <Text style={styles.metricUnit}>{t('UNITS.KG')}</Text>
                    </Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={40}
                    maximumValue={150}
                    step={1}
                    value={localWeight} // Slider очікує number
                    onValueChange={handleWeightChange}
                    onSlidingComplete={handleWeightComplete}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.inputBorder}
                    thumbTintColor={Colors.primary}
                />
            </View>

            <View style={[styles.metricCard, SharedStyles.rowBetween, { backgroundColor: Colors.inputBackground }]}>
                <View>
                    <Text style={{color: Colors.textGray, fontSize: 12}}>{t('ESTIMATED')} BMI</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                        <Text style={{fontSize: 24, fontWeight: '700', color: Colors.secondary, marginRight: 8}}>
                            {bmiValue}
                        </Text>
                        <View style={{
                            backgroundColor: status.color + '20',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 8
                        }}>
                            <Text style={{color: status.color, fontSize: 12, fontWeight: '600'}}>
                                {t(`BMI.${status.label}`)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    metricCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    metricLabel: { fontSize: 18, color: Colors.secondary, fontWeight: '600' },
    metricValue: { fontSize: 32, fontWeight: '700', color: Colors.secondary },
    metricUnit: { fontSize: 16, color: Colors.textGray, fontWeight: '500' },
});