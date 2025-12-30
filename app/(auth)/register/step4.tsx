import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Stepper } from '@/components/ui/Stepper';
import { useOnboarding } from '@/context/OnboardingContext';
import { StepHeader } from '@/components/navigation/StepHeader';


export default function Step4() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    const handleFinish = async () => {
        console.log('Відправка на NestJS:', data);
        // Тут буде твій запит:
        // await axios.post('http://your-api/auth/register', data);
        router.replace('/(tabs)'); // Після успіху йдемо в додаток
    };

    return (
        <ScrollView style={SharedStyles.containerMain}>
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={4} totalSteps={4} />
            }} />

            <Text style={SharedStyles.title}>Твій Household</Text>
            <Text style={SharedStyles.subtitle}>Налаштуй параметри для своєї сім'ї.</Text>

            <Stepper
                label="Членів сім'ї"
                value={data.familySize || 1}
                onValueChange={(val) => updateData({ familySize: val })}
            />

            <View style={styles.budgetCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.budgetLabel}>Тижневий бюджет</Text>
                    <Text style={styles.budgetValue}>{data.budget} <Text style={{fontSize: 16}}>UAH</Text></Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40, marginTop: 10 }}
                    minimumValue={500}
                    maximumValue={10000}
                    step={100}
                    value={data.budget}
                    onValueChange={(val) => updateData({ budget: val })}
                    minimumTrackTintColor={Colors.primary}
                    thumbTintColor={Colors.primary}
                />
                <Text style={styles.hint}>AI підбере рецепти, щоб вписатися в цю суму.</Text>
            </View>

            <View style={{ height: 40 }} />
            <PrimaryButton
                title="Завершити налаштування"
                onPress={handleFinish}
                style={{ marginBottom: 50 }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    budgetCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    budgetLabel: { fontSize: 18, fontWeight: '600', color: Colors.secondary },
    budgetValue: { fontSize: 28, fontWeight: '800', color: Colors.primary },
    hint: { color: Colors.textGray, fontSize: 14, marginTop: 10, textAlign: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.inputBorder },
    dotActive: { backgroundColor: Colors.primary, width: 24 }
});