import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import familyService from '@/services/family.service';
import planningService from '@/services/planning.service';
import { DashboardStats, MealPlan } from '@/types/api';

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [todayMeals, setTodayMeals] = useState<MealPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(async (showRefreshControl = false) => {
        try {
            if (showRefreshControl) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const [statsData, mealsData] = await Promise.all([
                familyService.getDashboardStats(),
                planningService.getTodayPlan(),
            ]);

            setStats(statsData);
            setTodayMeals(mealsData);
        } catch (error: any) {
            console.error('Error loading dashboard:', error);
            Alert.alert('Помилка', error.message || 'Не вдалося завантажити дані');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(() => {
        loadData(true);
    }, [loadData]);

    const getBudgetPercentage = () => {
        if (!stats) return 0;
        return Math.round((stats.spent / stats.totalBudget) * 100);
    };

    const getBudgetColor = () => {
        const percentage = getBudgetPercentage();
        if (percentage >= 90) return '#E74C3C';
        if (percentage >= 70) return '#F39C12';
        return Colors.primary;
    };

    const getMealTypeLabel = (mealType: string) => {
        const labels: Record<string, string> = {
            BREAKFAST: 'Сніданок',
            LUNCH: 'Обід',
            DINNER: 'Вечеря',
            SNACK: 'Перекус',
        };
        return labels[mealType] || mealType;
    };

    if (isLoading) {
        return (
            <View style={[SharedStyles.containerMain, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 10, color: Colors.textGray }}>Завантаження...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={SharedStyles.containerMain}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            {stats && (
                <View style={[styles.budgetCard, { backgroundColor: getBudgetColor() }]}>
                    <Text style={styles.cardLabel}>Бюджет на тиждень</Text>
                    <Text style={styles.budgetValue}>
                        {stats.spent.toFixed(0)} / {stats.totalBudget.toFixed(0)}{' '}
                        <Text style={styles.currency}>{stats.currency}</Text>
                    </Text>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${Math.min(getBudgetPercentage(), 100)}%` }
                            ]}
                        />
                    </View>

                    <View style={styles.budgetDetails}>
                        <View>
                            <Text style={styles.detailLabel}>Заплановано</Text>
                            <Text style={styles.detailValue}>
                                {stats.planned.toFixed(0)} {stats.currency}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Залишок</Text>
                            <Text style={styles.detailValue}>
                                {stats.remaining.toFixed(0)} {stats.currency}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            <Text style={styles.sectionTitle}>Сьогоднішнє меню</Text>

            {todayMeals.length > 0 ? (
                todayMeals.map((meal) => (
                    <View key={meal.id} style={styles.mealCard}>
                        <View style={styles.mealHeader}>
                            <Text style={styles.mealType}>{getMealTypeLabel(meal.mealType)}</Text>
                            {meal.recipe?.cookingTime && (
                                <Text style={styles.cookingTime}>⏱ {meal.recipe.cookingTime}</Text>
                            )}
                        </View>

                        <Text style={styles.mealTitle}>
                            {meal.recipe?.title || meal.customNote || 'Без назви'}
                        </Text>

                        {meal.recipe?.description && (
                            <Text style={styles.mealDescription} numberOfLines={2}>
                                {meal.recipe.description}
                            </Text>
                        )}

                        {meal.recipe?.calories && (
                            <View style={styles.mealFooter}>
                                <Text style={styles.calories}>🔥 {meal.recipe.calories}</Text>
                                <Text style={styles.servings}>
                                    🍽 {meal.recipe.servings} порцій
                                </Text>
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <View style={styles.placeholderCard}>
                    <Text style={{ color: Colors.textGray, textAlign: 'center' }}>
                        Сьогодні ще немає запланованих страв.{'\n'}
                        Перейдіть до календаря, щоб додати меню!
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    budgetCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
    },
    cardLabel: {
        color: 'white',
        opacity: 0.8,
        fontSize: 14,
        marginBottom: 8
    },
    budgetValue: {
        color: 'white',
        fontSize: 28,
        fontWeight: '800'
    },
    currency: {
        fontSize: 16,
        fontWeight: '400'
    },
    progressBarBg: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        height: 8,
        borderRadius: 4,
        marginTop: 15,
        overflow: 'hidden'
    },
    progressBarFill: {
        backgroundColor: 'white',
        height: '100%',
        borderRadius: 4
    },
    budgetDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    detailLabel: {
        color: 'white',
        opacity: 0.8,
        fontSize: 12,
        marginBottom: 4,
    },
    detailValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 15
    },
    mealCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealType: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cookingTime: {
        fontSize: 12,
        color: Colors.textGray,
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    mealDescription: {
        fontSize: 14,
        color: Colors.textGray,
        lineHeight: 20,
        marginBottom: 12,
    },
    mealFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    },
    calories: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '600',
    },
    servings: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '600',
    },
    placeholderCard: {
        padding: 40,
        backgroundColor: Colors.inputBackground,
        borderRadius: 20,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    }
});