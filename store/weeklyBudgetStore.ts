import { create } from 'zustand';
import weeklyBudgetService from '@/services/weeklyBudget.service';
import { WeeklyBudgetCurrent } from '@/types';

interface WeeklyBudgetState {
    current: WeeklyBudgetCurrent | null;
    isLoading: boolean;
    error: string | null;

    fetchCurrent: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useWeeklyBudgetStore = create<WeeklyBudgetState>((set) => ({
    current: null,
    isLoading: false,
    error: null,

    fetchCurrent: async () => {
        set({ isLoading: true, error: null });
        try {
            const current = await weeklyBudgetService.getCurrent();
            set({ current, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        current: null,
        isLoading: false,
        error: null,
    }),
}));
