import apiClient from '@/config/api';
import { AIGeneratedRecipe, Recipe } from '@/types/api';

class AiChefService {
    async generateRecipe(): Promise<AIGeneratedRecipe> {
        const response = await apiClient.post<AIGeneratedRecipe>('/ai-chef/generate');
        return response.data;
    }

    async cookRecipe(recipeData: AIGeneratedRecipe): Promise<{
        message: string;
        recipe: Recipe;
    }> {
        const response = await apiClient.post('/ai-chef/cook', recipeData);
        return response.data;
    }

    async generateAndCook(): Promise<{
        message: string;
        recipe: Recipe;
    }> {
        const generatedRecipe = await this.generateRecipe();
        return await this.cookRecipe(generatedRecipe);
    }
}

export default new AiChefService();