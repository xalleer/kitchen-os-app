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

export interface FamilyMemberDto extends BaseMemberSettingsDto {}

export interface FamilyMember {
    id: string;
    name: string;
    gender: Gender;
    age?: number;
    weight?: number;
    height?: number;
    goal: Goal;
}