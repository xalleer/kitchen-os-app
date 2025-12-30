import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';
import '../i18n/i18n';
export default function RootLayout() {
  return (
      <OnboardingProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      </OnboardingProvider>
  );
}