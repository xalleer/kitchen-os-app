import apiClient from '@/config/api';
import {
    DashboardStats,
    Family,
    User,
    InviteMemberDto,
    UpdateFamilyDto,
} from '@/types/api';

class FamilyService {
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get<DashboardStats>('/family/dashboard');
        return response.data;
    }

    async getFamily(): Promise<Family> {
        const response = await apiClient.get<Family>('/family');
        return response.data;
    }

    async getFamilyMembers(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/family/members');
        return response.data;
    }

    async joinFamily(data: InviteMemberDto): Promise<{ message: string }> {
        const response = await apiClient.post('/family/join', data);
        return response.data;
    }

    async updateFamily(data: UpdateFamilyDto): Promise<Family> {
        const response = await apiClient.patch<Family>('/family', data);
        return response.data;
    }

    async removeMember(memberId: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/family/members/${memberId}`);
        return response.data;
    }

    async leaveFamily(): Promise<{ message: string }> {
        const response = await apiClient.post('/family/leave');
        return response.data;
    }

    async regenerateInviteCode(): Promise<{
        message: string;
        inviteCode: string;
    }> {
        const response = await apiClient.post('/family/regenerate-invite');
        return response.data;
    }

    calculateBudgetProgress(stats: DashboardStats): {
        percentage: number;
        status: 'success' | 'warning' | 'danger';
    } {
        const percentage = Math.round((stats.spent / stats.totalBudget) * 100);

        let status: 'success' | 'warning' | 'danger' = 'success';
        if (percentage >= 90) status = 'danger';
        else if (percentage >= 70) status = 'warning';

        return { percentage, status };
    }
}

export default new FamilyService();