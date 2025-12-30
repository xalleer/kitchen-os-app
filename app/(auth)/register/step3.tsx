import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectableCard } from '@/components/ui/SelectableCard';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { useOnboarding, GoalType } from '@/context/OnboardingContext';

export default function Step3() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title="Продовжити"
                    showArrow
                    disabled={!data.goal}
                    onPress={() => router.push('/(auth)/register/step4')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={3} totalSteps={4} />,
            }} />

            <Text style={SharedStyles.title}>Яка твоя мета?</Text>
            <Text style={SharedStyles.subtitle}>Ми адаптуємо плани під твій вибір.</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                <SelectableCard
                    title="Схуднення"
                    iconName="body"
                    isSelected={data.goal === 'loss'}
                    onPress={() => updateData({ goal: 'loss' })}
                />
                <SelectableCard
                    title="Набір ваги"
                    iconName="barbell"
                    isSelected={data.goal === 'gain'}
                    onPress={() => updateData({ goal: 'gain' })}
                />
                {/* Додай інші цілі аналогічно */}
            </View>
        </StepLayout>
    );
}