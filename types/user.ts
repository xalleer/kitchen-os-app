import { Goal, Gender } from '@/types/enums';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    familyId: string;
    createdAt: string;
    family: {
        id: string;
        name: string;
        budgetLimit: number;
    };
    memberProfile: {
        id: string;
        name: string;
        gender: Gender;
        weight?: number;
        height?: number;
        age?: number;
        goal: Goal;
        eatsBreakfast: boolean;
        eatsLunch: boolean;
        eatsDinner: boolean;
        eatsSnack: boolean;
        allergies: Array<{
            id: string;
            name: string;
            slug: string;
        }>;
    };
    UserPreference?: {
        weight?: number;
        height?: number;
        age?: number;
        goal: Goal;
        allergies: string[];
        eatsBreakfast: boolean;
        eatsLunch: boolean;
        eatsDinner: boolean;
        eatsSnack: boolean;
    };
}

export interface UpdateProfileDto {
    email?: string;
    name?: string;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateUserPreferencesDto {
    weight?: number;
    height?: number;
    age?: number;
    goal?: Goal;
    allergyIds?: string[];
    eatsBreakfast?: boolean;
    eatsLunch?: boolean;
    eatsDinner?: boolean;
    eatsSnack?: boolean;
}



export interface CreateFamilyMemberDto {
    name: string;
    gender?: Gender;
    weight?: number;
    height?: number;
    age?: number;
    goal?: Goal;
    allergyIds?: string[];
    eatsBreakfast?: boolean;
    eatsLunch?: boolean;
    eatsDinner?: boolean;
    eatsSnack?: boolean;
}

export interface UpdateFamilyMemberDto {
    name?: string;
    gender?: Gender;
    weight?: number;
    height?: number;
    age?: number;
    goal?: Goal;
    allergyIds?: string[];
    eatsBreakfast?: boolean;
    eatsLunch?: boolean;
    eatsDinner?: boolean;
    eatsSnack?: boolean;
}

export interface UpdateFamilyBudgetDto {
    budgetLimit: number;
}