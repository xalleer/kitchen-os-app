import apiClient from '@/config/api';
import { CreateMealPlanDto, MealPlan } from '@/types/api';

class PlanningService {
    async addMeal(data: CreateMealPlanDto): Promise<MealPlan> {
        const response = await apiClient.post<MealPlan>('/planning', data);
        return response.data;
    }

    async getPlan(startDate?: string, endDate?: string): Promise<MealPlan[]> {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get<MealPlan[]>('/planning', { params });
        return response.data;
    }

    async getWeekPlan(): Promise<MealPlan[]> {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        return this.getPlan(now.toISOString(), nextWeek.toISOString());
    }

    async getTodayPlan(): Promise<MealPlan[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return this.getPlan(today.toISOString(), tomorrow.toISOString());
    }

    async removeMeal(planId: string): Promise<void> {
        await apiClient.delete(`/planning/${planId}`);
    }

    async generateWeeklyPlan(): Promise<{ message: string }> {
        const response = await apiClient.post('/planning/generate-week');
        return response.data;
    }

    getMealByDateTime(plans: MealPlan[], date: Date, mealType: string): MealPlan | undefined {
        const targetDate = date.toISOString().split('T')[0];
        return plans.find(plan =>
            plan.date.startsWith(targetDate) && plan.mealType === mealType
        );
    }

    groupPlansByDate(plans: MealPlan[]): Record<string, MealPlan[]> {
        return plans.reduce((acc, plan) => {
            const date = plan.date.split('T')[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(plan);
            return acc;
        }, {} as Record<string, MealPlan[]>);
    }
}

export default new PlanningService();