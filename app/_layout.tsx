import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';

export default function RootLayout() {
  return (
      <OnboardingProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/register/step1" />
          <Stack.Screen name="(auth)/register/step2" />
          <Stack.Screen name="(auth)/register/step3" />
          {/* Додай інші екрани сюди */}
        </Stack>
      </OnboardingProvider>
  );
}