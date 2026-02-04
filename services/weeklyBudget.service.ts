import apiClient from '@/config/api';
import { WeeklyBudgetCurrent } from '@/types';

class WeeklyBudgetService {
    async getCurrent(): Promise<WeeklyBudgetCurrent> {
        const response = await apiClient.get<WeeklyBudgetCurrent>('/weekly-budget/current');
        return response.data;
    }
}

export default new WeeklyBudgetService();
