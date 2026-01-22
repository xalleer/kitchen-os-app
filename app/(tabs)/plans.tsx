// app/(tabs)/plans.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useMealPlanStore } from '@/store/mealPlanStore';
import { MealType } from '@/types/enums';

export default function MealPlanScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const {
        mealPlans,
        groupedByDay,
        totalDays,
        isLoading,
        isGenerating,
        fetchMealPlan,
        generateMealPlan,
        regenerateDay,
        regenerateMeal,
        deleteMealPlan,
    } = useMealPlanStore();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [regeneratingDay, setRegeneratingDay] = useState<string | null>(null);
    const [regeneratingMeal, setRegeneratingMeal] = useState<string | null>(null);

    // Завантаження плану при монтуванні
    useEffect(() => {
        loadMealPlan();
    }, []);

    // Автовибір сьогоднішнього дня коли є дані
    useEffect(() => {
        if (mealPlans.length > 0 && !selectedDate) {
            const today = formatDate(new Date());
            const dates = Object.keys(groupedByDay).sort();

            // Якщо є план на сьогодні - вибираємо його, інакше перший доступний день
            const dateToSelect = dates.includes(today) ? today : dates[0];
            setSelectedDate(dateToSelect);
        }
    }, [mealPlans, groupedByDay]);

    const loadMealPlan = async () => {
        try {
            await fetchMealPlan();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMealPlan();
        setRefreshing(false);
    };

    const handleGenerate = async () => {
        // Показуємо попередження про тривалість генерації
        Alert.alert(
            t('MEAL_PLAN.GENERATE_WEEK'),
            'Генерація меню займе 2-3 хвилини. Ви можете закрити додаток або перейти на іншу вкладку - процес продовжиться у фоні.',
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.CONTINUE'),
                    onPress: async () => {
                        try {
                            // Запускаємо генерацію (вона продовжиться у фоні)
                            generateMealPlan(7);

                            showToast({
                                message: t('MEAL_PLAN.GENERATING') + ' Це займе 2-3 хвилини.',
                                type: 'info',
                                duration: 5000,
                            });

                            // Періодично перевіряємо чи завершилась генерація
                            const checkInterval = setInterval(async () => {
                                const store = useMealPlanStore.getState();
                                if (!store.isGenerating) {
                                    clearInterval(checkInterval);
                                    if (store.mealPlans.length > 0) {
                                        showToast({
                                            message: t('SUCCESS.MEAL_PLAN_REGENERATED'),
                                            type: 'success',
                                            icon: 'checkmark-circle',
                                        });
                                        // Вибираємо сьогоднішній день
                                        const today = formatDate(new Date());
                                        setSelectedDate(today);
                                    }
                                }
                            }, 2000);

                            // Очищуємо інтервал через 5 хвилин (якщо щось пішло не так)
                            setTimeout(() => clearInterval(checkInterval), 300000);
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        }
                    },
                },
            ]
        );
    };

    const handleRegenerateDay = (date: string) => {
        Alert.alert(
            t('MEAL_PLAN.REGENERATE_DAY'),
            t('MEAL_PLAN.REGENERATE_DAY_CONFIRM'),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.REGENERATE'),
                    onPress: async () => {
                        setRegeneratingDay(date);
                        try {
                            await regenerateDay(date);
                            showToast({
                                message: t('SUCCESS.DAY_REGENERATED'),
                                type: 'success',
                                icon: 'refresh',
                            });
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        } finally {
                            setRegeneratingDay(null);
                        }
                    },
                },
            ]
        );
    };

    const handleRegenerateMeal = (mealId: string, mealName: string) => {
        Alert.alert(
            t('MEAL_PLAN.REGENERATE_MEAL'),
            t('MEAL_PLAN.REGENERATE_MEAL_CONFIRM', { meal: mealName }),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.REGENERATE'),
                    onPress: async () => {
                        setRegeneratingMeal(mealId);
                        try {
                            await regenerateMeal(mealId);
                            showToast({
                                message: t('SUCCESS.MEAL_REGENERATED'),
                                type: 'success',
                                icon: 'refresh',
                            });
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        } finally {
                            setRegeneratingMeal(null);
                        }
                    },
                },
            ]
        );
    };

    const handleDeletePlan = () => {
        Alert.alert(
            t('CONFIRM_DELETE'),
            t('MEAL_PLAN.DELETE_PLAN_CONFIRM'),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.DELETE'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMealPlan();
                            setSelectedDate(null);
                            showToast({
                                message: 'План харчування видалено',
                                type: 'success',
                                icon: 'trash',
                            });
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        }
                    },
                },
            ]
        );
    };

    const getMealTypeIcon = (type: MealType) => {
        switch (type) {
            case MealType.BREAKFAST:
                return 'sunny';
            case MealType.LUNCH:
                return 'restaurant';
            case MealType.DINNER:
                return 'moon';
            case MealType.SNACK:
                return 'cafe';
        }
    };

    const getMealTypeLabel = (type: MealType) => {
        return t(`MEALS.${type}`);
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toISOString().split('T')[0];
    };

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('uk-UA', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    // Якщо немає даних і йде початкове завантаження
    if (isLoading && mealPlans.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Якщо немає плану взагалі
    if (mealPlans.length === 0 && !isGenerating) {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.emptyContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <Ionicons name="calendar-outline" size={64} color={Colors.textGray} />
                    <Text style={styles.emptyTitle}>{t('MEAL_PLAN.EMPTY_TITLE')}</Text>
                    <Text style={styles.emptySubtitle}>
                        {t('MEAL_PLAN.EMPTY_SUBTITLE')}
                    </Text>

                    <PrimaryButton
                        title={t('MEAL_PLAN.GENERATE_WEEK')}
                        onPress={handleGenerate}
                        style={{ marginTop: 24, width: '100%', maxWidth: 300 }}
                    />
                </ScrollView>
            </View>
        );
    }

    // Показуємо лоадер під час генерації
    if (isGenerating && mealPlans.length === 0) {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.emptyContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.generatingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.generatingTitle}>
                            {t('MEAL_PLAN.GENERATING')}
                        </Text>
                        <Text style={styles.generatingSubtitle}>
                            Це займе 2-3 хвилини. Ви можете перейти на іншу вкладку.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const dates = Object.keys(groupedByDay).sort();
    const selectedMeals = selectedDate ? groupedByDay[selectedDate] : [];

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Календар днів */}
                <View style={styles.calendarContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.calendarScroll}
                    >
                        {dates.map((date) => {
                            const isToday = date === formatDate(new Date());
                            const isSelected = date === selectedDate;

                            return (
                                <TouchableOpacity
                                    key={date}
                                    style={[
                                        styles.dayCard,
                                        isSelected && styles.dayCardSelected,
                                        isToday && !isSelected && styles.dayCardToday,
                                    ]}
                                    onPress={() => setSelectedDate(date)}
                                >
                                    <Text
                                        style={[
                                            styles.dayLabel,
                                            isSelected && styles.dayLabelSelected,
                                        ]}
                                    >
                                        {formatDateDisplay(date)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.mealsCount,
                                            isSelected && styles.mealsCountSelected,
                                        ]}
                                    >
                                        {groupedByDay[date].length} {t('MEAL_PLAN.MEALS')}
                                    </Text>
                                    {isToday && !isSelected && (
                                        <View style={styles.todayIndicator} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {selectedDate && (
                    <>
                        <View style={styles.dayHeader}>
                            <Text style={styles.dayTitle}>
                                {new Date(selectedDate).toLocaleDateString('uk-UA', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                })}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleRegenerateDay(selectedDate)}
                                style={styles.regenerateButton}
                                disabled={regeneratingDay === selectedDate}
                            >
                                {regeneratingDay === selectedDate ? (
                                    <ActivityIndicator size="small" color={Colors.primary} />
                                ) : (
                                    <Ionicons name="refresh" size={20} color={Colors.primary} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {selectedMeals.map((meal) => {
                            const isRegenerating = regeneratingMeal === meal.id;

                            return (
                                <View key={meal.id} style={styles.mealCard}>
                                    <View style={styles.mealHeader}>
                                        <View style={styles.mealTypeContainer}>
                                            <Ionicons
                                                name={getMealTypeIcon(meal.type)}
                                                size={20}
                                                color={Colors.primary}
                                            />
                                            <Text style={styles.mealType}>
                                                {getMealTypeLabel(meal.type)}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleRegenerateMeal(meal.id, meal.recipe.name)
                                            }
                                            disabled={isRegenerating}
                                        >
                                            {isRegenerating ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color={Colors.textGray}
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="refresh-outline"
                                                    size={20}
                                                    color={Colors.textGray}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    {isRegenerating ? (
                                        <View style={styles.regeneratingMealContainer}>
                                            <Text style={styles.regeneratingMealText}>
                                                Генерується нова страва...
                                            </Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => router.push(`/meal-plan/${meal.id}`)}
                                        >
                                            <Text style={styles.recipeName}>{meal.recipe.name}</Text>
                                            <View style={styles.ingredientsPreview}>
                                                <Ionicons
                                                    name="nutrition-outline"
                                                    size={14}
                                                    color={Colors.textGray}
                                                />
                                                <Text style={styles.ingredientsText}>
                                                    {meal.recipe.ingredients.length}{' '}
                                                    {t('RECIPES.INGREDIENTS')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })}
                    </>
                )}

                <View style={styles.actionsContainer}>
                    <PrimaryButton
                        title={t('MEAL_PLAN.GENERATE_NEW')}
                        onPress={handleGenerate}
                        loading={isGenerating}
                        disabled={isGenerating}
                    />
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePlan}>
                        <Text style={styles.deleteButtonText}>
                            {t('MEAL_PLAN.DELETE_PLAN')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.textGray,
        textAlign: 'center',
    },
    generatingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    generatingTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 8,
    },
    generatingSubtitle: {
        fontSize: 14,
        color: Colors.textGray,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    calendarContainer: {
        marginBottom: 24,
    },
    calendarScroll: {
        paddingVertical: 8,
        gap: 12,
    },
    dayCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        minWidth: 120,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        position: 'relative',
    },
    dayCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.lightGreen,
    },
    dayCardToday: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    dayLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    dayLabelSelected: {
        color: Colors.primary,
    },
    mealsCount: {
        fontSize: 12,
        color: Colors.textGray,
    },
    mealsCountSelected: {
        color: Colors.primary,
    },
    todayIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        textTransform: 'capitalize',
        flex: 1,
    },
    regenerateButton: {
        padding: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mealType: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    regeneratingMealContainer: {
        paddingVertical: 12,
    },
    regeneratingMealText: {
        fontSize: 14,
        color: Colors.textGray,
        fontStyle: 'italic',
    },
    recipeName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    ingredientsPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ingredientsText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    actionsContainer: {
        marginTop: 24,
        gap: 12,
    },
    deleteButton: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.danger,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: Colors.danger,
        fontSize: 16,
        fontWeight: '600',
    },
});