import React from 'react';
import { View, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectableCard } from '@/components/ui/SelectableCard';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

export default function Step3() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const { t } = useTranslation();

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.CONTINUE')}
                    showArrow
                    disabled={!data.goal}
                    onPress={() => router.push('/(auth)/register/step4')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={3} />,
            }} />

            <Ionicons name="flag-outline" size={48} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

            <Text style={SharedStyles.title}>{t('YOUR_TARGET')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP3_TITLE')}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                <SelectableCard
                    title={t('TARGETS.WEIGHT_LOSS')}
                    iconName="body"
                    isSelected={data.goal === 'loss'}
                    onPress={() => updateData({ goal: 'loss' })}
                />
                <SelectableCard
                    title={t('TARGETS.WEIGHT_GAIN')}
                    iconName="barbell"
                    isSelected={data.goal === 'gain'}
                    onPress={() => updateData({ goal: 'gain' })}
                />
                <SelectableCard
                    title={t('TARGETS.MAINTAIN_HEALTH')}
                    iconName="heart"
                    isSelected={data.goal === 'healthy'}
                    onPress={() => updateData({ goal: 'healthy' })}
                />
                <SelectableCard
                    title={t('TARGETS.SAVE_BUDGET')}
                    iconName="wallet"
                    isSelected={data.goal === 'budget'}
                    onPress={() => updateData({ goal: 'budget' })}
                />
            </View>
        </StepLayout>
    );
}