import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function MealPlanLayout() {
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
            <Stack.Screen name="[id]" />
        </Stack>
    );
}