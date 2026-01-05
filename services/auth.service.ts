import apiClient from '@/config/api';
import * as SecureStore from 'expo-secure-store';
import {
    AuthResponse,
    LoginDto,
    RegisterDto,
    ForgotPasswordDto,
    ResetPasswordDto,
} from '@/types/api';

class AuthService {
    async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        if (response.data.access_token) {
            await this.saveToken(response.data.access_token);
        }

        return response.data;
    }

    async login(data: LoginDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);

        if (response.data.access_token) {
            await this.saveToken(response.data.access_token);
        }

        return response.data;
    }

    async logout(): Promise<void> {
        await SecureStore.deleteItemAsync('auth_token');
    }

    async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/forgot-password', data);
        return response.data;
    }

    async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/reset-password', data);
        return response.data;
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    }

    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('auth_token');
    }

    private async saveToken(token: string): Promise<void> {
        await SecureStore.setItemAsync('auth_token', token);
    }

    /**
     * OAuth Google (буде реалізовано пізніше)
     */
    async loginWithGoogle(): Promise<void> {
        // TODO: Implement Google OAuth
        throw new Error('Google OAuth not implemented yet');
    }

    /**
     * OAuth Apple (буде реалізовано пізніше)
     */
    async loginWithApple(): Promise<void> {
        // TODO: Implement Apple OAuth
        throw new Error('Apple OAuth not implemented yet');
    }
}

export default new AuthService();