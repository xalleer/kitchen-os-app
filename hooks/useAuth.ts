import { useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import authService from '@/services/auth.service';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const authenticated = await authService.isAuthenticated();
            setIsAuthenticated(authenticated);
        } catch (error) {
            console.error('Auth check error:', error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated === null) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (isAuthenticated && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!isAuthenticated && inTabsGroup) {
            router.replace('/(auth)/welcome');
        }
    }, [isAuthenticated, segments]);

    const login = async (email: string, password: string) => {
        await authService.login({ email, password });
        setIsAuthenticated(true);
    };

    const register = async (data: any) => {
        await authService.register(data);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await authService.logout();
        setIsAuthenticated(false);
        router.replace('/(auth)/welcome');
    };

    return {
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
    };
}