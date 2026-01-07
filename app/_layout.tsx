import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/context/OnboardingContext';
import '../i18n/i18n';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  return (
      <OnboardingProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" options={{
              contentStyle: { backgroundColor: Colors.background},
              gestureEnabled: false,
              animation: 'fade',
          }}/>

        </Stack>
      </OnboardingProvider>
  );
}