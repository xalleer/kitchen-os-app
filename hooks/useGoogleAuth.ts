import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import authService from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export const useGoogleAuth = () => {
    const router = useRouter();
    const { setToken } = useAuthStore();

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        authService.getGoogleConfig()
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleLogin(id_token);
        }
    }, [response]);

    const handleGoogleLogin = async (idToken: string) => {
        try {
            const authResponse = await authService.loginWithGoogle(idToken);
            await setToken(authResponse.access_token);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Google login failed:', error);
            throw error;
        }
    };

    const login = () => {
        promptAsync();
    };

    return {
        login,
        isLoading: !request,
    };
};