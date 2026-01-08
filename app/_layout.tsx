import {useEffect} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {useAuthStore} from '@/store/authStore';
import '../i18n/i18n';
import {Colors} from '@/constants/Colors';
import {ToastProvider} from "@/components/ui/ToastProvider";

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const {isAuthenticated, isLoading, initialize} = useAuthStore();

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (isAuthenticated && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!isAuthenticated && inTabsGroup) {
            router.replace('/(auth)/welcome');
        }
    }, [isAuthenticated, isLoading, segments]);

    return (
        <ToastProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        contentStyle: {backgroundColor: Colors.background},
                        gestureEnabled: false,
                        animation: 'fade',
                    }}
                />
            </Stack>
        </ToastProvider>
    );
}