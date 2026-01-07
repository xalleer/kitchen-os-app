import { create } from 'zustand';
import { OnboardingData, Goal } from '@/types';

interface OnboardingState extends OnboardingData {
    updateData: (data: Partial<OnboardingData>) => void;
    resetData: () => void;
}

const initialState: OnboardingData = {
    name: '',
    email: '',
    password: '',
    age: undefined,
    height: 175,
    weight: 70,
    goal: null,
    allergies: [],
    dislikedProducts: [],
    eatsBreakfast: true,
    eatsLunch: true,
    eatsDinner: true,
    eatsSnack: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
    ...initialState,

    updateData: (data) => {
        set((state) => ({ ...state, ...data }));
    },

    resetData: () => {
        set(initialState);
    },
}));