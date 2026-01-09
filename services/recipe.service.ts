import apiClient from '@/config/api';
import {
    GeneratedRecipe,
    SavedRecipe,
    GenerateRecipeFromInventoryDto,
    GenerateRecipeFromProductsDto,
    GenerateCustomRecipeDto,
    SaveRecipeDto,
    CookRecipeDto,
    ExpiringProductsRecipe,
} from '@/types/recipe';

class RecipeService {
    async getSavedRecipes(): Promise<SavedRecipe[]> {
        const response = await apiClient.get<SavedRecipe[]>('/recipes');
        return response.data;
    }

    async getRecipeById(recipeId: string): Promise<SavedRecipe> {
        const response = await apiClient.get<SavedRecipe>(`/recipes/${recipeId}`);
        return response.data;
    }

    async generateRecipeFromInventory(
        data: GenerateRecipeFromInventoryDto = {}
    ): Promise<GeneratedRecipe> {
        const response = await apiClient.post<GeneratedRecipe>(
            '/recipes/generate/from-inventory',
            data
        );
        return response.data;
    }

    async generateRecipeFromProducts(
        data: GenerateRecipeFromProductsDto
    ): Promise<GeneratedRecipe> {
        const response = await apiClient.post<GeneratedRecipe>(
            '/recipes/generate/from-products',
            data
        );
        return response.data;
    }

    async generateCustomRecipe(
        data: GenerateCustomRecipeDto
    ): Promise<GeneratedRecipe> {
        const response = await apiClient.post<GeneratedRecipe>(
            '/recipes/generate/custom',
            data
        );
        return response.data;
    }

    async saveRecipe(data: SaveRecipeDto): Promise<SavedRecipe> {
        const response = await apiClient.post<SavedRecipe>('/recipes/save', data);
        return response.data;
    }

    async cookRecipe(data: CookRecipeDto): Promise<any> {
        const response = await apiClient.post('/recipes/cook', data);
        return response.data;
    }

    async deleteRecipe(recipeId: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/recipes/${recipeId}`);
        return response.data;
    }

    async getExpiringProductsRecipes(): Promise<ExpiringProductsRecipe> {
        const response = await apiClient.get<ExpiringProductsRecipe>(
            '/recipes/expiring'
        );
        return response.data;
    }
}

export default new RecipeService();