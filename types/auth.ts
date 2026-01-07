import { FamilyMemberDto, OwnerProfileDto } from './family';

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

export interface AuthResponse {
    access_token: string;
}

export interface GoogleLoginDto {
    token: string;
}