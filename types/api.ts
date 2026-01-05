
export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    familyName: string;
    weeklyBudget: number;
    height?: number;
    weight?: number;
    goal?: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE';
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}


export interface User {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    familyId: string | null;
    roleInFamily: 'OWNER' | 'MEMBER';
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    height: number | null;
    weight: number | null;
    birthDate: string | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'HIGH' | 'ATHLETE' | null;
    goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE' | null;
    excludedProducts: string[];
}


export interface AddFridgeItemDto {
    name: string;
    quantity: number;
    unit: string;
    expirationDate?: string;
    productId?: string;
}

export interface FridgeItem {
    id: string;
    familyId: string;
    productId: string | null;
    customName: string | null;
    quantity: number;
    unit: string;
    expirationDate: string | null;
    createdAt: string;
    updatedAt: string;
    product?: Product | null;
}

export interface Product {
    id: string;
    name: string;
    barcode: string | null;
    category: string | null;
    imageUrl: string | null;
    unit: string;
    averagePrice: number | null;
}


export interface RecipeIngredient {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string | null;
    instructions: string;
    imageUrl: string | null;
    cookingTime: string | null;
    calories: string | null;
    servings: number;
    ingredients: RecipeIngredient[];
    isPublic: boolean;
    shareToken: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AIGeneratedRecipe {
    title: string;
    description: string;
    cookingTime: string;
    calories: string;
    steps: string[];
    ingredients: Array<{
        name: string;
        amount: string;
    }>;
    itemsToDeduct: Array<{
        id: string;
        amountUsed: number;
    }>;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface CreateMealPlanDto {
    date: string;
    mealType: MealType;
    recipeId?: string;
    customNote?: string;
}

export interface MealPlan {
    id: string;
    familyId: string;
    date: string;
    mealType: string;
    recipeId: string | null;
    customNote: string | null;
    recipe?: Recipe | null;
    createdAt: string;
    updatedAt: string;
}

export interface ShoppingListItem {
    id: string;
    familyId: string;
    productId: string | null;
    customName: string | null;
    estimatedPrice: number;
    quantity: number;
    unit: string;
    isBought: boolean;
    createdAt: string;
    updatedAt: string;
    product?: Product | null;
}

export interface Family {
    id: string;
    name: string;
    inviteCode: string;
    budgetLimit: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    members?: User[];
}

export interface DashboardStats {
    currency: string;
    totalBudget: number;
    spent: number;
    planned: number;
    remaining: number;
    projectedRemaining: number;
    status: 'DANGER' | 'OK';
}

export interface InviteMemberDto {
    inviteCode: string;
}

export interface UpdateFamilyDto {
    name?: string;
    budgetLimit?: number;
    currency?: string;
}


export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp?: string;
}