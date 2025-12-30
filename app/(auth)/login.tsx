import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SocialButton } from '@/components/ui/SocialButton';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
    const router = useRouter();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerTintColor: Colors.secondary,
                        headerShadowVisible: false,
                        headerBackTitle: '',
                        headerBackTitleVisible: false,
                    }}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={[SharedStyles.containerMain, { justifyContent: 'center', flexGrow: 1 }]}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Ionicons name="restaurant" size={48} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={SharedStyles.title}>Welcome Back</Text>
                        <Text style={SharedStyles.subtitle}>Sign in to access your Kitchen OS.</Text>

                        <Text style={styles.label}>Email</Text>
                        <ThemeInput placeholder="Enter your email" keyboardType="email-address" />

                        <Text style={styles.label}>Password</Text>
                        <ThemeInput placeholder="Enter your password" secureTextEntry />

                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 30 }}>
                            <Text style={{ color: Colors.textGray }}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <PrimaryButton title="Log In" showArrow onPress={() => {}} />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>Or continue with</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socials}>
                            <SocialButton
                                title="Google"
                                icon="logo-google"
                                onPress={() => console.log('Google login')}
                            />
                            <SocialButton
                                title="Apple"
                                icon="logo-apple"
                                onPress={() => console.log('Apple login')}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={{ color: Colors.textGray }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register/step1')}>
                                <Text style={{ color: Colors.primary, fontWeight: '600' }}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.inputBorder,
    },
    dividerText: {
        marginHorizontal: 10,
        color: Colors.textGray,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        paddingBottom: 20,
    },
    socials: {
        alignItems: 'center',
        gap: 16

    }
});