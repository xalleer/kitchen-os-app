import { create } from 'zustand';
import { UserProfile, FamilyMember } from '@/types';
import userService from '@/services/user.service';

interface UserState {
    profile: UserProfile | null;
    familyMembers: FamilyMember[];
    isLoading: boolean;
    error: string | null;

    fetchProfile: () => Promise<void>;
    fetchFamilyMembers: () => Promise<void>;
    updateProfile: (data: { email?: string; name?: string }) => Promise<void>;
    updatePreferences: (data: any) => Promise<void>;
    updateBudget: (budget: number) => Promise<void>;
    addFamilyMember: (data: any) => Promise<void>;
    updateFamilyMemberData: (memberId: string, data: any) => Promise<void>;
    removeFamilyMember: (memberId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: null,
    familyMembers: [],
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await userService.getProfile();
            set({ profile, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    fetchFamilyMembers: async () => {
        set({ isLoading: true, error: null });
        try {
            const members = await userService.getFamilyMembers();
            set({ familyMembers: members, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await userService.updateProfile(data);
            await get().fetchProfile();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updatePreferences: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await userService.updateUserPreferences(data);
            await get().fetchFamilyMembers()
            await get().fetchProfile();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateBudget: async (budget) => {
        set({ isLoading: true, error: null });
        try {
            await userService.updateFamilyBudget({ budgetLimit: budget });
            await get().fetchProfile();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    addFamilyMember: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await userService.createFamilyMember(data);
            await get().fetchFamilyMembers();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateFamilyMemberData: async (memberId, data) => {
        set({ isLoading: true, error: null });
        try {
            await userService.updateFamilyMember(memberId, data);
            await get().fetchFamilyMembers();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    removeFamilyMember: async (memberId) => {
        set({ isLoading: true, error: null });
        try {
            await userService.deleteFamilyMember(memberId);
            await get().fetchFamilyMembers();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        profile: null,
        familyMembers: [],
        isLoading: false,
        error: null,
    }),
}));