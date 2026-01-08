import { Gender, Goal } from './enums';

export interface BaseMemberSettingsDto {
    name: string;
    gender?: Gender;
    allergyIds?: string[];
    eatsBreakfast?: boolean;
    eatsLunch?: boolean;
    eatsDinner?: boolean;
    eatsSnack?: boolean;
}

export interface OwnerProfileDto extends BaseMemberSettingsDto {
    age?: number;
    weight?: number;
    height?: number;
    goal?: Goal;
}

export interface FamilyMember {
    id: string;
    name: string;
    familyId: string;
    userId?: string;
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
    user?: {
        id: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}