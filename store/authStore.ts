import { create } from 'zustand';
import { FamilyMemberDto as User } from '@/types';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) => {
        set({ user, isAuthenticated: !!user });
    },

    setToken: async (token) => {
        if (token) {
            await SecureStore.setItemAsync('auth_token', token);
            set({ token, isAuthenticated: true });
        } else {
            await SecureStore.deleteItemAsync('auth_token');
            set({ token: null, isAuthenticated: false });
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
    },


    initialize: async () => {
        try {
            const token = await SecureStore.getItemAsync('auth_token');

            if (token) {
                // TODO: Verify token and fetch user data
                set({ token, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            set({ isLoading: false });
        }
    },
}));