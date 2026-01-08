import apiClient from '@/config/api';
import {
    ChangePasswordDto, CreateFamilyMemberDto, FamilyMember,
    UpdateFamilyBudgetDto, UpdateFamilyMemberDto,
    UpdateProfileDto,
    UpdateUserPreferencesDto,
    UserProfile
} from "@/types";

class UserService {
    async getProfile(): Promise<UserProfile> {
        const response = await apiClient.get<UserProfile>('/users/profile');
        return response.data;
    }

    async updateProfile(data: UpdateProfileDto): Promise<Partial<UserProfile>> {
        const response = await apiClient.patch('/users/profile', data);
        return response.data;
    }

    async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
        const response = await apiClient.patch('/users/password', data);
        return response.data;
    }

    async updateUserPreferences(data: UpdateUserPreferencesDto): Promise<any> {
        const response = await apiClient.patch('/users/preferences', data);
        return response.data;
    }

    async getFamilyMembers(): Promise<FamilyMember[]> {
        const response = await apiClient.get<FamilyMember[]>('/users/family/members');
        return response.data;
    }

    async createFamilyMember(data: CreateFamilyMemberDto): Promise<FamilyMember> {
        const response = await apiClient.post<FamilyMember>('/users/family/members', data);
        return response.data;
    }

    async updateFamilyMember(memberId: string, data: UpdateFamilyMemberDto): Promise<FamilyMember> {
        const response = await apiClient.patch<FamilyMember>(
            `/users/family/members/${memberId}`,
            data
        );
        return response.data;
    }

    async deleteFamilyMember(memberId: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/users/family/members/${memberId}`);
        return response.data;
    }


    async updateFamilyBudget(data: UpdateFamilyBudgetDto): Promise<any> {
        const response = await apiClient.patch('/users/family/budget', data);
        return response.data;
    }
}

export default new UserService();