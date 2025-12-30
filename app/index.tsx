import { Redirect } from 'expo-router';

export default function Index() {
    // if (isAuthenticated) return <Redirect href="/(tabs)" />;

    return <Redirect href="/(auth)/welcome" />;
}