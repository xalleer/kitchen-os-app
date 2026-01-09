import { create } from 'zustand';
import {
    GeneratedRecipe,
    SavedRecipe,
    GenerateRecipeFromInventoryDto,
    GenerateRecipeFromProductsDto,
    GenerateCustomRecipeDto,
    SaveRecipeDto,
} from '@/types/recipe';
import recipeService from '@/services/recipe.service';

interface RecipeState {
    savedRecipes: SavedRecipe[];
    currentRecipe: GeneratedRecipe | SavedRecipe | null;
    isLoading: boolean;
    isGenerating: boolean;
    error: string | null;

    fetchSavedRecipes: () => Promise<void>;
    fetchRecipeById: (recipeId: string) => Promise<void>;
    generateFromInventory: (data?: GenerateRecipeFromInventoryDto) => Promise<GeneratedRecipe>;
    generateFromProducts: (data: GenerateRecipeFromProductsDto) => Promise<GeneratedRecipe>;
    generateCustom: (data: GenerateCustomRecipeDto) => Promise<GeneratedRecipe>;
    saveRecipe: (data: SaveRecipeDto) => Promise<SavedRecipe>;
    cookRecipe: (recipeId: string) => Promise<void>;
    deleteRecipe: (recipeId: string) => Promise<void>;
    setCurrentRecipe: (recipe: GeneratedRecipe | SavedRecipe | null) => void;
    clearError: () => void;
    reset: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
    savedRecipes: [],
    currentRecipe: null,
    isLoading: false,
    isGenerating: false,
    error: null,

    fetchSavedRecipes: async () => {
        set({ isLoading: true, error: null });
        try {
            const recipes = await recipeService.getSavedRecipes();
            set({ savedRecipes: recipes, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    fetchRecipeById: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
            const recipe = await recipeService.getRecipeById(recipeId);
            set({ currentRecipe: recipe, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    generateFromInventory: async (data) => {
        set({ isGenerating: true, error: null });
        try {
            const recipe = await recipeService.generateRecipeFromInventory(data);
            set({ currentRecipe: recipe, isGenerating: false });
            return recipe;
        } catch (error: any) {
            set({ error: error.message, isGenerating: false });
            throw error;
        }
    },

    generateFromProducts: async (data) => {
        set({ isGenerating: true, error: null });
        try {
            const recipe = await recipeService.generateRecipeFromProducts(data);
            set({ currentRecipe: recipe, isGenerating: false });
            return recipe;
        } catch (error: any) {
            set({ error: error.message, isGenerating: false });
            throw error;
        }
    },

    generateCustom: async (data) => {
        set({ isGenerating: true, error: null });
        try {
            const recipe = await recipeService.generateCustomRecipe(data);
            set({ currentRecipe: recipe, isGenerating: false });
            return recipe;
        } catch (error: any) {
            set({ error: error.message, isGenerating: false });
            throw error;
        }
    },

    saveRecipe: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const recipe = await recipeService.saveRecipe(data);
            set({
                savedRecipes: [recipe, ...get().savedRecipes],
                isLoading: false
            });
            return recipe;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    cookRecipe: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
            await recipeService.cookRecipe({ recipeId });
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteRecipe: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
            await recipeService.deleteRecipe(recipeId);
            set({
                savedRecipes: get().savedRecipes.filter(r => r.id !== recipeId),
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),

    clearError: () => set({ error: null }),

    reset: () => set({
        savedRecipes: [],
        currentRecipe: null,
        isLoading: false,
        isGenerating: false,
        error: null,
    }),
}));