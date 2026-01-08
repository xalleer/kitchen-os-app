import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTintColor: Colors.secondary,
                headerShadowVisible: false,
                headerBackTitle: '',
                contentStyle: { backgroundColor: Colors.background }
            }}
        >
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="change-password" />
            <Stack.Screen name="family-members" />
            <Stack.Screen name="budget" />
            <Stack.Screen name="language" />
        </Stack>
    );
}