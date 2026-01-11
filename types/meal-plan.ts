import { MealType } from './enums';

export interface MealIngredient {
    id: string;
    productId: string;
    productName: string;
    amount: number;
    unit: string;
    available?: boolean;
    availableQuantity?: number;
}

export interface MealNutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
}

export interface Meal {
    id: string;
    name: string;
    description?: string;
    calories: number;
    cookingTime: number; // minutes
    servings: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    cuisine?: string;
    ingredients: MealIngredient[];
    instructions: string[];
    image?: string;
    nutrition?: MealNutrition;
    tags?: string[];
    createdAt?: string;
    isGenerating?: boolean;
}

export interface DayMealPlan {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
    snack?: Meal;
}

export interface MealPlan {
    id: string;
    familyId: string;
    date: string; // YYYY-MM-DD
    meals: DayMealPlan;
    totalCalories: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFat?: number;
    isGenerated: boolean;
    generatedAt?: string;
    updatedAt?: string;
}

export interface WeeklyMealPlan {
    weekStart: string; // YYYY-MM-DD
    weekEnd: string; // YYYY-MM-DD
    plans: MealPlan[];
    totalBudget?: number;
    estimatedCost?: number;
}

export interface GenerateWeeklyPlanOptions {
    startDate?: string;
    calorieTarget?: number;
    budgetLimit?: number;
    excludeIngredients?: string[];
    preferredCuisines?: string[];
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    useFridgeProducts?: boolean;
}

export interface RegenerateMealOptions {
    date: string;
    mealType: MealType;
    excludePrevious?: boolean;
    keepIngredients?: string[];
    calorieTarget?: number;
}

export interface RegenerateDayOptions {
    date: string;
    keepMeals?: MealType[];
    calorieTarget?: number;
}

export interface MealPlanStats {
    totalDays: number;
    totalMeals: number;
    averageCalories: number;
    totalCost?: number;
    mostUsedIngredients: Array<{
        name: string;
        count: number;
    }>;
    cuisineDistribution: Array<{
        cuisine: string;
        count: number;
    }>;
}

export interface ShoppingListItem {
    productId: string;
    productName: string;
    totalAmount: number;
    unit: string;
    category?: string;
    estimatedPrice?: number;
    inInventory: boolean;
    inventoryAmount?: number;
    needToBuy?: number;
    usedInMeals: Array<{
        date: string;
        mealType: MealType;
        mealName: string;
        amount: number;
    }>;
}

export interface WeeklyShoppingList {
    weekStart: string;
    weekEnd: string;
    items: ShoppingListItem[];
    totalEstimatedCost?: number;
    categorizedItems: {
        [category: string]: ShoppingListItem[];
    };
}

export interface NutritionSummary {
    startDate: string;
    endDate: string;
    totalCalories: number;
    averageCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    dailyBreakdown: Array<{
        date: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }>;
    mealTypeBreakdown: {
        [key in MealType]: {
            totalCalories: number;
            averageCalories: number;
        };
    };
}

export interface MealPreferences {
    calorieTarget: number;
    proteinTarget?: number;
    carbsTarget?: number;
    fatTarget?: number;
    allergies: string[];
    dislikes: string[];
    preferredCuisines: string[];
    dietaryRestrictions: string[];
    cookingTimeLimit?: number;
    difficultyPreference?: 'easy' | 'medium' | 'hard';
    mealsPerDay: {
        [key in MealType]: boolean;
    };
}