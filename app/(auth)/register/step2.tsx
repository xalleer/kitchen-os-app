import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { StepHeader } from '@/components/navigation/StepHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { Ionicons } from '@expo/vector-icons';

export default function Step2() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    const bmiValue = parseFloat((data.weight / ((data.height / 100) * (data.height / 100))).toFixed(1));

    const getBmiStatus = (bmi: number) => {
        if (bmi < 18.5) return { label: 'UNDERWEIGHT', color: '#FFC107' };
        if (bmi < 25) return { label: 'NORMAL', color: Colors.primary };
        if (bmi < 30) return { label: 'OVERWEIGHT', color: '#FF9800' };
        return { label: 'OBESE', color: '#F44336' };
    };

    const status = getBmiStatus(bmiValue);

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title="Continue"
                    showArrow
                    onPress={() => router.push('/(auth)/register/step3')}
                />
            }
        >
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={2} />
            }} />

            <Ionicons name="body-outline" size={48} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

            <Text style={SharedStyles.title}>Body Metrics</Text>
            <Text style={SharedStyles.subtitle}>Help Kitchen OS calibrate your nutritional needs.</Text>

            <View style={styles.metricCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.metricLabel}>Height</Text>
                    <Text style={styles.metricValue}>{data.height} <Text style={styles.metricUnit}>CM</Text></Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={140}
                    maximumValue={220}
                    step={1}
                    value={data.height}
                    onValueChange={(val) => updateData({ height: val })}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.inputBorder}
                    thumbTintColor={Colors.primary}
                />
            </View>

            <View style={styles.metricCard}>
                <View style={SharedStyles.rowBetween}>
                    <Text style={styles.metricLabel}>Weight</Text>
                    <Text style={styles.metricValue}>{data.weight} <Text style={styles.metricUnit}>KG</Text></Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={40}
                    maximumValue={150}
                    step={1}
                    value={data.weight}
                    onValueChange={(val) => updateData({ weight: val })}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.inputBorder}
                    thumbTintColor={Colors.primary}
                />
            </View>

            <View style={[styles.metricCard, SharedStyles.rowBetween, { backgroundColor: Colors.inputBackground }]}>
                <View>
                    <Text style={{color: Colors.textGray, fontSize: 12}}>Estimated BMI</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                        <Text style={{fontSize: 24, fontWeight: '700', color: Colors.secondary, marginRight: 8}}>{bmiValue}</Text>
                        <View style={{backgroundColor: status.color + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8}}>
                            <Text style={{color: status.color, fontSize: 12, fontWeight: '600'}}>{status.label}</Text>
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