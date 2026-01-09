import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function RecipesLayout() {
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
            <Stack.Screen name="generate-from-inventory" />
            <Stack.Screen name="generate-custom" />
            <Stack.Screen name="expiring-products" />
            <Stack.Screen name="save-recipe" />
            <Stack.Screen name="cook-recipe" />
            <Stack.Screen name="[id]" />
        </Stack>
    );
}