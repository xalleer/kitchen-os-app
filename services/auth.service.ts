import apiClient from '@/config/api';
import { AuthResponse, LoginDto, RegisterDto, GoogleLoginDto } from '@/types';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

class AuthService {
    private googleConfig = {
        expoClientId: process.env.EXPO_PUBLIC_WEB_GOOGLE_CLIENT_ID as string,
        iosClientId: process.env.EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID as string,
        androidClientId: '',
        webClientId: process.env.EXPO_PUBLIC_WEB_GOOGLE_CLIENT_ID as string,
    };

    /**
     * Register with email and password
     */
    async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    }

    /**
     * Login with email and password
     */
    async login(data: LoginDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    }

    /**
     * Login with Google OAuth
     */
    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/google-login', {
            token: idToken,
        });
        return response.data;
    }

    /**
     * Get Google Auth configuration
     */
    getGoogleConfig() {
        return {
            expoClientId: this.googleConfig.expoClientId,
            iosClientId: this.googleConfig.iosClientId,
            androidClientId: this.googleConfig.androidClientId,
            webClientId: this.googleConfig.webClientId,
        };
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        try {
            // This could verify token with backend
            const response = await apiClient.get('/auth/me');
            return !!response.data;
        } catch {
            return false;
        }
    }
}

export default new AuthService();