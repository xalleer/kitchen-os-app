import { Unit } from './enums';

export interface RecipeIngredient {
    productName: string;
    amount: number;
    unit: string;
    productId?: string | null;
    available?: boolean;
    availableQuantity?: number;
}

export interface Recipe {
    id?: string;
    name: string;
    description?: string;
    instructions: string | string[];
    cookingTime?: number;
    servings?: number;
    calories?: number;
    category?: string;
    ingredients: RecipeIngredient[];
}

export interface GeneratedRecipe extends Recipe {
    canCook: boolean;
    missingProducts?: string[];
}

export interface SavedRecipe extends Recipe {
    id: string;
    ingredients: Array<{
        id: string;
        amount: number;
        product: {
            id: string;
            name: string;
            baseUnit: Unit;
            caloriesPer100?: number;
            image?: string;
        };
    }>;
}

export interface GenerateRecipeFromInventoryDto {
    portions?: number;
}

export interface GenerateRecipeFromProductsDto {
    productIds: string[];
    portions?: number;
    cuisine?: string;
}

export interface GenerateCustomRecipeDto {
    dishName: string;
    portions?: number;
}

export interface SaveRecipeDto {
    name: string;
    instructions: string;
    description?: string;
    cookingTime?: number;
    servings?: number;
    calories?: number;
    category?: string;
    ingredients: Array<{
        productId: string;
        amount: number;
    }>;
}

export interface CookRecipeDto {
    recipeId: string;
}

export interface ExpiringProductsRecipe {
    expiringProducts: Array<{
        name: string;
        quantity: number;
        expiryDate: string | null;
    }>;
    suggestedRecipe: Recipe;
}