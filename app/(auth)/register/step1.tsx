import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';

export default function Step1() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <Stack.Screen options={{
                        headerTitle: () => (
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <View style={[styles.dot, styles.dotActive]} />
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                            </View>
                        )
                    }} />

                    <ScrollView
                        contentContainerStyle={[SharedStyles.containerMain, { flexGrow: 1 }]}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={SharedStyles.title}>Давай знайомитись</Text>
                        <Text style={SharedStyles.subtitle}>
                            Створи свій акаунт Kitchen OS для персоналізації планів.
                        </Text>

                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.label}>Твоє ім'я</Text>
                            <ThemeInput
                                placeholder="Введи ім'я"
                                value={data.name}
                                onChangeText={(val) => updateData({ name: val })}
                            />

                            <Text style={styles.label}>Електронна пошта</Text>
                            <ThemeInput
                                placeholder="example@mail.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={data.email}
                                onChangeText={(val) => updateData({ email: val })}
                            />

                            <Text style={styles.label}>Пароль</Text>
                            <ThemeInput
                                placeholder="Мінімум 6 символів"
                                secureTextEntry
                                value={data.password}
                                onChangeText={(val) => updateData({ password: val })}
                            />
                        </View>

                        <View style={{ flex: 1 }} />

                        <PrimaryButton
                            title="Продовжити"
                            showArrow
                            onPress={() => router.push('/(auth)/register/step2')}
                            style={{ marginBottom: 30 }}
                        />
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.inputBorder },
    dotActive: { backgroundColor: Colors.primary, width: 24 }
});