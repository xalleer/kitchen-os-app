import { create } from 'zustand';
import { Gender, Goal } from '@/types/enums';
import { FamilyMemberDto, OwnerProfileDto } from '@/types/family';

interface OnboardingState {
    email: string;
    password: string;
    name: string;

    ownerProfile: OwnerProfileDto;
    familyMembers: FamilyMemberDto[];
    budgetLimit: number;

    updateAccount: (data: Partial<{ email: string; password: string; name: string }>) => void;
    updateOwnerProfile: (data: Partial<OwnerProfileDto>) => void;

    addFamilyMember: (member: FamilyMemberDto) => void;
    removeFamilyMember: (index: number) => void;
    updateFamilyMember: (index: number, data: Partial<FamilyMemberDto>) => void;

    setBudgetLimit: (limit: number) => void;
    resetData: () => void;
}

const initialOwnerProfile: OwnerProfileDto = {
    name: '',
    gender: Gender.UNSPECIFIED,
    height: 175,
    weight: 70,
    age: undefined,
    goal: Goal.MAINTAIN,
    allergyIds: [],
    eatsBreakfast: true,
    eatsLunch: true,
    eatsDinner: true,
    eatsSnack: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
    email: '',
    password: '',
    name: '',
    ownerProfile: { ...initialOwnerProfile },
    familyMembers: [],
    budgetLimit: 0,

    updateAccount: (data) =>
        set((state) => ({ ...state, ...data })),

    updateOwnerProfile: (data) =>
        set((state) => ({
            ownerProfile: { ...state.ownerProfile, ...data },
            name: data.name ? data.name : state.name
        })),

    addFamilyMember: (member) =>
        set((state) => ({
            familyMembers: [...state.familyMembers, member]
        })),

    removeFamilyMember: (index) =>
        set((state) => ({
            familyMembers: state.familyMembers.filter((_, i) => i !== index)
        })),

    updateFamilyMember: (index, data) =>
        set((state) => {
            const updatedMembers = [...state.familyMembers];
            if (updatedMembers[index]) {
                updatedMembers[index] = { ...updatedMembers[index], ...data };
            }
            return { familyMembers: updatedMembers };
        }),

    setBudgetLimit: (limit) => set({ budgetLimit: limit }),

    resetData: () =>
        set({
            email: '',
            password: '',
            name: '',
            ownerProfile: { ...initialOwnerProfile },
            familyMembers: [],
            budgetLimit: 0,
        }),
}));