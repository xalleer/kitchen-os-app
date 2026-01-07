import React from 'react';
import { View, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectableCard } from '@/components/ui/auth/SelectableCard';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { Goal } from '@/types';

export default function Step3() {
    const router = useRouter();
    const { t } = useTranslation();

    // Отримуємо дані зі store
    const goal = useOnboardingStore((state) => state.goal);
    const updateData = useOnboardingStore((state) => state.updateData);

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.CONTINUE')}
                    showArrow
                    disabled={!goal}
                    onPress={() => router.push('/(auth)/register/step4')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={3} />,
            }} />

            <Ionicons
                name="flag-outline"
                size={48}
                color={Colors.primary}
                style={{ alignSelf: 'center', marginBottom: 20 }}
            />

            <Text style={SharedStyles.title}>{t('YOUR_TARGET')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP3_TITLE')}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                <SelectableCard
                    title={t('TARGETS.LOSE_WEIGHT')}
                    iconName="body"
                    isSelected={goal === Goal.LOSE_WEIGHT}
                    onPress={() => updateData({ goal: Goal.LOSE_WEIGHT })}
                />
                <SelectableCard
                    title={t('TARGETS.GAIN_WEIGHT')}
                    iconName="barbell"
                    isSelected={goal === Goal.GAIN_WEIGHT}
                    onPress={() => updateData({ goal: Goal.GAIN_WEIGHT })}
                />
                <SelectableCard
                    title={t('TARGETS.MAINTAIN')}
                    iconName="heart"
                    isSelected={goal === Goal.MAINTAIN}
                    onPress={() => updateData({ goal: Goal.MAINTAIN })}
                />
                <SelectableCard
                    title={t('TARGETS.HEALTHY')}
                    iconName="leaf"
                    isSelected={goal === Goal.HEALTHY}
                    onPress={() => updateData({ goal: Goal.HEALTHY })}
                />
            </View>
        </StepLayout>
    );
}