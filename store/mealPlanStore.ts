import mealPlanService from '@/services/mealplan.service';
import { MealPlan } from '@/types/mealplan';
import { create } from 'zustand';

interface MealPlanState {
    mealPlans: MealPlan[];
    groupedByDay: { [date: string]: MealPlan[] };
    totalDays: number;
    totalMeals: number;
    isLoading: boolean;
    isGenerating: boolean;
    error: string | null;

    fetchMealPlan: (startDate?: string, endDate?: string) => Promise<void>;
    generateMealPlan: (daysCount?: number) => Promise<void>;
    regenerateDay: (date: string) => Promise<void>;
    regenerateMeal: (mealPlanId: string) => Promise<void>;
    deleteMealPlan: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
    mealPlans: [],
    groupedByDay: {},
    totalDays: 0,
    totalMeals: 0,
    isLoading: false,
    isGenerating: false,
    error: null,

    fetchMealPlan: async (startDate?, endDate?) => {
        set({ isLoading: true, error: null });
        try {
            const data = await mealPlanService.getMealPlan(startDate, endDate);
            set({
                mealPlans: data.mealPlans,
                groupedByDay: data.groupedByDay,
                totalDays: data.totalDays,
                totalMeals: data.totalMeals,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    generateMealPlan: async (daysCount = 7) => {
        set({ isGenerating: true, error: null });
        try {
            await mealPlanService.generateMealPlan(daysCount);
            await get().fetchMealPlan();
            set({ isGenerating: false });
        } catch (error: any) {
            set({ error: error.message, isGenerating: false });
            throw error;
        }
    },

    regenerateDay: async (date) => {
        set({ isLoading: true, error: null });
        try {
            await mealPlanService.regenerateDay(date);
            await get().fetchMealPlan();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    regenerateMeal: async (mealPlanId) => {
        set({ isLoading: true, error: null });
        try {
            await mealPlanService.regenerateMeal(mealPlanId);
            await get().fetchMealPlan();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteMealPlan: async () => {
        set({ isLoading: true, error: null });
        try {
            await mealPlanService.deleteMealPlan();
            set({
                mealPlans: [],
                groupedByDay: {},
                totalDays: 0,
                totalMeals: 0,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        mealPlans: [],
        groupedByDay: {},
        totalDays: 0,
        totalMeals: 0,
        isLoading: false,
        isGenerating: false,
        error: null,
    }),
}));