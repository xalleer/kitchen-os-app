export enum Unit {
    G = 'G',
    ML = 'ML',
    PCS = 'PCS'
}

export enum Role {
    OWNER = 'OWNER',
    MEMBER = 'MEMBER'
}

export enum Goal {
    LOSE_WEIGHT = 'LOSE_WEIGHT',
    GAIN_WEIGHT = 'GAIN_WEIGHT',
    MAINTAIN = 'MAINTAIN',
    SAVE_BUDGET = 'SAVE_BUDGET',
    HEALTHY = 'HEALTHY'
}

export enum MealType {
    BREAKFAST = 'BREAKFAST',
    LUNCH = 'LUNCH',
    DINNER = 'DINNER',
    SNACK = 'SNACK'
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    age?: number;
    weight: number;
    height: number;
    goal: Goal;
    allergies?: string[];
    dislikedProducts?: string[];
    eatsBreakfast?: boolean;
    eatsLunch?: boolean;
    eatsDinner?: boolean;
    eatsSnack?: boolean;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface GoogleLoginDto {
    token: string;
}

export interface AuthResponse {
    access_token: string;
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    familyId: string | null;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface UserPreference {
    id: string;
    userId: string;
    weight: number | null;
    height: number | null;
    age: number | null;
    goal: Goal;
    allergies: string[];
    dislikedProducts: string[];
    eatsBreakfast: boolean;
    eatsLunch: boolean;
    eatsDinner: boolean;
    eatsSnack: boolean;
}

export interface Family {
    id: string;
    name: string;
    budgetLimit: number | null;
    members?: User[];
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    name: string;
    category: string | null;
    baseUnit: Unit;
    caloriesPer100: number | null;
    standardAmount: number | null;
}

export interface InventoryItem {
    id: string;
    familyId: string;
    productId: string;
    quantity: number;
    expiryDate: string | null;
    createdAt: string;
    updatedAt: string;
    product?: Product;
}

export interface Recipe {
    id: string;
    name: string;
    instructions: string;
    ingredients?: RecipeIngredient[];
}

export interface RecipeIngredient {
    id: string;
    recipeId: string;
    productId: string;
    amount: number;
    product?: Product;
}

export interface MealPlan {
    id: string;
    familyId: string;
    date: string;
    type: MealType;
    recipeId: string;
    recipe?: Recipe;
}

export interface ShoppingListItem {
    id: string;
    familyId: string;
    productId: string;
    quantity: number;
    isBought: boolean;
    manualNote: string | null;
    product?: Product;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp?: string;
}

export interface OnboardingData {
    name: string;
    email: string;
    password: string;
    age?: number;
    height: number;
    weight: number;
    goal: Goal | null;
    allergies: string[];
    dislikedProducts: string[];
    eatsBreakfast: boolean;
    eatsLunch: boolean;
    eatsDinner: boolean;
    eatsSnack: boolean;
}