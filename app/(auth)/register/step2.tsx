import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Slider from '@react-native-community/slider'; // Не забудь встановити!
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { StepHeader } from '@/components/navigation/StepHeader';


export default function Step2() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    const bmi = (data.weight / ((data.height / 100) * (data.height / 100))).toFixed(1);

    return (
        <View style={SharedStyles.containerMain}>
            <Stack.Screen options={{
                headerTitle: () => <StepHeader currentStep={2} />
            }} />

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
                <View style={styles.rulerContainer}>
                    {[...Array(11)].map((_, i) => (
                        <View key={i} style={[styles.rulerMark, i % 5 === 0 ? { height: 10 } : {}]} />
                    ))}
                </View>
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
                <View style={styles.rulerContainer}>
                    {[...Array(11)].map((_, i) => (
                        <View key={i} style={[styles.rulerMark, i % 5 === 0 ? { height: 10 } : {}]} />
                    ))}
                </View>
            </View>

            <View style={[styles.metricCard, SharedStyles.rowBetween, { backgroundColor: Colors.inputBackground }]}>
                <View>
                    <Text style={{color: Colors.textGray, fontSize: 12}}>Estimated BMI</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                        <Text style={{fontSize: 24, fontWeight: '700', color: Colors.secondary, marginRight: 8}}>{bmi}</Text>
                        <View style={{backgroundColor: Colors.lightGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8}}>
                            <Text style={{color: Colors.primary, fontSize: 12, fontWeight: '600'}}>NORMAL</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1 }} />
            <PrimaryButton title="Continue" showArrow onPress={() => router.push('/(auth)/register/step3')} style={{marginBottom: 30}} />
        </View>
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
    metricLabel: {
        fontSize: 18,
        color: Colors.secondary,
        fontWeight: '600',
    },
    metricValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.secondary,
    },
    metricUnit: {
        fontSize: 16,
        color: Colors.textGray,
        fontWeight: '500',
    },
    rulerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: -10,
    },
    rulerMark: {
        width: 2,
        height: 6,
        backgroundColor: Colors.inputBorder,
        borderRadius: 2,
    },
    dot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.inputBorder
    },
    dotActive: {
        backgroundColor: Colors.primary, width: 24
    }
});