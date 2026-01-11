// utils/meal-plan.utils.ts

import { MealPlan, DayMealPlan, Meal } from '@/types/meal-plan';
import { MealType } from '@/types/enums';

/**
 * Get dates for the current week (Monday to Sunday)
 */
export const getCurrentWeekDates = (): Date[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });
};

/**
 * Get start and end dates of the week
 */
export const getWeekRange = (referenceDate?: Date): { start: string; end: string } => {
    const dates = referenceDate
        ? getWeekDatesFromReference(referenceDate)
        : getCurrentWeekDates();

    return {
        start: formatDate(dates[0]),
        end: formatDate(dates[6]),
    };
};

/**
 * Get week dates from a reference date
 */
export const getWeekDatesFromReference = (date: Date): Date[] => {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const todayStr = formatDate(new Date());
    return dateStr === todayStr;
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj < today;
};

/**
 * Get day name in Ukrainian
 */
export const getDayName = (date: Date | string, locale: string = 'uk-UA'): string => {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    return dateObj.toLocaleDateString(locale, { weekday: 'long' });
};

/**
 * Get short day name
 */
export const getShortDayName = (date: Date | string): string => {
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    return days[dateObj.getDay()];
};

/**
 * Calculate total calories for a day
 */
export const calculateDayCalories = (meals: DayMealPlan): number => {
    return Object.values(meals)
        .filter((meal): meal is Meal => meal !== undefined)
        .reduce((sum, meal) => sum + meal.calories, 0);
};

/**
 * Calculate total macros for a day
 */
export const calculateDayMacros = (meals: DayMealPlan) => {
    const mealsList = Object.values(meals).filter((meal): meal is Meal => meal !== undefined);

    return {
        calories: mealsList.reduce((sum, meal) => sum + meal.calories, 0),
        protein: mealsList.reduce((sum, meal) => sum + (meal.nutrition?.protein || 0), 0),
        carbs: mealsList.reduce((sum, meal) => sum + (meal.nutrition?.carbs || 0), 0),
        fat: mealsList.reduce((sum, meal) => sum + (meal.nutrition?.fat || 0), 0),
    };
};

/**
 * Get meal type order for display
 */
export const getMealTypeOrder = (): MealType[] => {
    return [
        MealType.BREAKFAST,
        MealType.LUNCH,
        MealType.SNACK,
        MealType.DINNER,
    ];
};

/**
 * Get meal type display info
 */
export const getMealTypeInfo = (mealType: MealType) => {
    const info = {
        [MealType.BREAKFAST]: { icon: '☀️', time: '08:00', color: '#FFB74D' },
        [MealType.LUNCH]: { icon: '🌤️', time: '13:00', color: '#4FC3F7' },
        [MealType.SNACK]: { icon: '🍎', time: '16:00', color: '#81C784' },
        [MealType.DINNER]: { icon: '🌙', time: '19:00', color: '#9575CD' },
    };

    return info[mealType];
};

/**
 * Check if a meal is complete (has all required fields)
 */
export const isMealComplete = (meal: Meal): boolean => {
    return !!(
        meal.name &&
        meal.calories > 0 &&
        meal.cookingTime > 0 &&
        meal.ingredients.length > 0 &&
        meal.instructions.length > 0
    );
};

/**
 * Count total meals in a day plan
 */
export const countMeals = (meals: DayMealPlan): number => {
    return Object.values(meals).filter(meal => meal !== undefined).length;
};

/**
 * Get missing meal types in a day plan
 */
export const getMissingMealTypes = (meals: DayMealPlan): MealType[] => {
    return getMealTypeOrder().filter(type => !meals[type]);
};

/**
 * Calculate weekly totals
 */
export const calculateWeeklyTotals = (plans: MealPlan[]) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalMeals = 0;

    plans.forEach(plan => {
        totalCalories += plan.totalCalories;
        totalProtein += plan.totalProtein || 0;
        totalCarbs += plan.totalCarbs || 0;
        totalFat += plan.totalFat || 0;
        totalMeals += countMeals(plan.meals);
    });

    return {
        totalCalories,
        averageCalories: totalCalories / plans.length,
        totalProtein,
        totalCarbs,
        totalFat,
        totalMeals,
    };
};

/**
 * Get calorie status (under/over target)
 */
export const getCalorieStatus = (actual: number, target: number) => {
    const difference = actual - target;
    const percentage = (actual / target) * 100;

    return {
        difference,
        percentage,
        isOver: difference > 0,
        isUnder: difference < 0,
        isOnTarget: Math.abs(difference) < 50, // Within 50 calories
    };
};

/**
 * Format meal time
 */
export const formatMealTime = (timeStr: string): string => {
    return timeStr; // Already in HH:MM format
};

/**
 * Get next meal for today
 */
export const getNextMeal = (meals: DayMealPlan): { type: MealType; meal: Meal } | null => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const mealTimes = {
        [MealType.BREAKFAST]: 8 * 60, // 08:00
        [MealType.LUNCH]: 13 * 60, // 13:00
        [MealType.SNACK]: 16 * 60, // 16:00
        [MealType.DINNER]: 19 * 60, // 19:00
    };

    for (const type of getMealTypeOrder()) {
        const meal = meals[type];
        const mealTime = mealTimes[type];

        if (meal && mealTime > currentTime) {
            return { type, meal };
        }
    }

    return null;
};

/**
 * Check if it's time to cook a meal (within 30 minutes before)
 */
export const isTimeToCook = (mealType: MealType): boolean => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const mealTimes = {
        [MealType.BREAKFAST]: 8 * 60,
        [MealType.LUNCH]: 13 * 60,
        [MealType.SNACK]: 16 * 60,
        [MealType.DINNER]: 19 * 60,
    };

    const mealTime = mealTimes[mealType];
    const timeDiff = mealTime - currentTime;

    return timeDiff >= 0 && timeDiff <= 30; // Within 30 minutes before
};

/**
 * Sort meals by time
 */
export const sortMealsByTime = (meals: DayMealPlan): Array<{ type: MealType; meal: Meal }> => {
    return getMealTypeOrder()
        .map(type => ({ type, meal: meals[type] }))
        .filter((item): item is { type: MealType; meal: Meal } => item.meal !== undefined);
};

/**
 * Get cooking difficulty emoji
 */
export const getDifficultyEmoji = (difficulty?: string): string => {
    switch (difficulty) {
        case 'easy': return '🟢';
        case 'medium': return '🟡';
        case 'hard': return '🔴';
        default: return '⚪';
    }
};

/**
 * Estimate cooking difficulty based on time and ingredients
 */
export const estimateDifficulty = (cookingTime: number, ingredientCount: number): string => {
    if (cookingTime <= 20 && ingredientCount <= 5) return 'easy';
    if (cookingTime <= 40 && ingredientCount <= 10) return 'medium';
    return 'hard';
};