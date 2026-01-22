import { FamilyMemberDto, OwnerProfileDto } from './family';
import {Goal} from "@/types/enums";

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    budgetLimit?: number;
    ownerProfile: OwnerProfileDto;
    familyMembers?: FamilyMemberDto[];
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface JoinFamilyDto {
    inviteCode: string;
    email: string;
    password: string
    name?: string;
    weight?: number;
    height?: number;
    goal?: Goal
}

export interface AuthResponse {
    access_token: string;
}

export interface GoogleLoginDto {
    token: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
}