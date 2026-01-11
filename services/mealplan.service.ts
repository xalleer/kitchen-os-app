import apiClient from '@/config/api';
import { MealPlan, MealPlanResponse } from '@/types/mealplan';

class MealPlanService {
    async generateMealPlan(daysCount: number = 7): Promise<MealPlanResponse> {
        const response = await apiClient.post<MealPlanResponse>(
            '/meal-plan/generate',
            { daysCount }
        );
        return response.data;
    }

    async getMealPlan(startDate?: string, endDate?: string): Promise<MealPlanResponse> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await apiClient.get<MealPlanResponse>(
            `/meal-plan?${params.toString()}`
        );
        return response.data;
    }

    async getMealPlanForDay(date: string): Promise<any> {
        const response = await apiClient.get(`/meal-plan/day/${date}`);
        return response.data;
    }

    async regenerateDay(date: string): Promise<any> {
        const response = await apiClient.post('/meal-plan/regenerate-day', { date });
        return response.data;
    }

    async regenerateMeal(mealPlanId: string): Promise<MealPlan> {
        const response = await apiClient.post<MealPlan>(
            `/meal-plan/regenerate-meal/${mealPlanId}`
        );
        return response.data;
    }

    async deleteMealPlan(): Promise<{ message: string }> {
        const response = await apiClient.delete('/meal-plan');
        return response.data;
    }
}

export default new MealPlanService();