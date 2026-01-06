import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import planningService from '@/services/planning.service';
import { MealPlan } from '@/types/api';

type DayOfWeek = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ' | 'НД';
type MealTypeKey = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

interface WeekDay {
    date: Date;
    dayName: DayOfWeek;
    dayNumber: number;
    isToday: boolean;
}

const MEAL_TYPES: { key: MealTypeKey; label: string; icon: string; color: string }[] = [
    { key: 'BREAKFAST', label: 'Сніданок', icon: 'sunny', color: '#FFB84D' },
    { key: 'LUNCH', label: 'Обід', icon: 'restaurant', color: '#FF6B6B' },
    { key: 'DINNER', label: 'Вечеря', icon: 'moon', color: '#4ECDC4' },
    { key: 'SNACK', label: 'Перекус', icon: 'nutrition', color: '#95E1D3' },
];

export default function Plans() {
    const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        initializeWeek();
        loadMealPlans();
    }, []);

    const initializeWeek = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);

        const diff = currentDay === 0 ? -6 : 1 - currentDay;
        monday.setDate(today.getDate() + diff);

        const days: WeekDay[] = [];
        const dayNames: DayOfWeek[] = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);

            days.push({
                date,
                dayName: dayNames[i],
                dayNumber: date.getDate(),
                isToday: date.toDateString() === today.toDateString(),
            });
        }

        setWeekDays(days);
        setSelectedDate(today);
    };

    const loadMealPlans = useCallback(async (showRefreshControl = false) => {
        try {
            if (showRefreshControl) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const plans = await planningService.getWeekPlan();
            setMealPlans(plans);
        } catch (error: any) {
            console.error('Error loading meal plans:', error);
            Alert.alert('Помилка', error.message || 'Не вдалося завантажити плани');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const onRefresh = useCallback(() => {
        loadMealPlans(true);
    }, [loadMealPlans]);

    const getMealForDateTime = (date: Date, mealType: MealTypeKey): MealPlan | undefined => {
        return planningService.getMealByDateTime(mealPlans, date, mealType);
    };

    const handleGenerateWeeklyPlan = async () => {
        Alert.alert(
            'Згенерувати план на тиждень?',
            'AI створить персоналізований план харчування на весь тиждень на основі вашого бюджету та цілей.',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Згенерувати',
                    onPress: async () => {
                        setIsGenerating(true);
                        try {
                            await planningService.generateWeeklyPlan();
                            Alert.alert('Успіх! 🎉', 'План харчування на тиждень успішно згенеровано');
                            await loadMealPlans();
                        } catch (error: any) {
                            Alert.alert('Помилка', error.message || 'Не вдалося згенерувати план');
                        } finally {
                            setIsGenerating(false);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteMeal = async (planId: string) => {
        Alert.alert(
            'Видалити страву?',
            'Ви впевнені, що хочете видалити цю страву з плану?',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Видалити',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await planningService.removeMeal(planId);
                            setMealPlans(prev => prev.filter(p => p.id !== planId));
                            Alert.alert('Успіх', 'Страву видалено з плану');
                        } catch (error: any) {
                            Alert.alert('Помилка', error.message || 'Не вдалося видалити страву');
                        }
                    }
                }
            ]
        );
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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={SharedStyles.containerMain}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.weekCalendar}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {weekDays.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCard,
                                    selectedDate.toDateString() === day.date.toDateString() && styles.dayCardSelected,
                                    day.isToday && styles.dayCardToday,
                                ]}
                                onPress={() => setSelectedDate(day.date)}
                            >
                                <Text
                                    style={[
                                        styles.dayName,
                                        selectedDate.toDateString() === day.date.toDateString() && styles.dayNameSelected,
                                    ]}
                                >
                                    {day.dayName}
                                </Text>
                                <Text
                                    style={[
                                        styles.dayNumber,
                                        selectedDate.toDateString() === day.date.toDateString() && styles.dayNumberSelected,
                                    ]}
                                >
                                    {day.dayNumber}
                                </Text>
                                {day.isToday && (
                                    <View style={styles.todayDot} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={handleGenerateWeeklyPlan}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <ActivityIndicator color={Colors.primary} />
                    ) : (
                        <>
                            <Ionicons name="sparkles" size={20} color={Colors.primary} />
                            <Text style={styles.generateButtonText}>Згенерувати план на тиждень</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Meals for Selected Day */}
                <View style={styles.mealsContainer}>
                    <Text style={styles.dateHeader}>
                        {selectedDate.toLocaleDateString('uk-UA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>

                    {MEAL_TYPES.map((mealType) => {
                        const meal = getMealForDateTime(selectedDate, mealType.key);
                        return (
                            <View key={mealType.key} style={styles.mealCard}>
                                <View style={[styles.mealTypeHeader, { borderLeftColor: mealType.color }]}>
                                    <View style={styles.mealTypeLeft}>
                                        <View style={[styles.mealTypeIcon, { backgroundColor: mealType.color + '20' }]}>
                                            <Ionicons name={mealType.icon as any} size={20} color={mealType.color} />
                                        </View>
                                        <Text style={styles.mealTypeLabel}>{mealType.label}</Text>
                                    </View>

                                    {meal && (
                                        <TouchableOpacity
                                            onPress={() => handleDeleteMeal(meal.id)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {meal ? (
                                    <View style={styles.mealContent}>
                                        <Text style={styles.mealTitle}>
                                            {meal.recipe?.title || meal.customNote || 'Без назви'}
                                        </Text>
                                        {meal.recipe?.description && (
                                            <Text style={styles.mealDescription} numberOfLines={2}>
                                                {meal.recipe.description}
                                            </Text>
                                        )}
                                        {meal.recipe && (
                                            <View style={styles.mealMeta}>
                                                {meal.recipe.cookingTime && (
                                                    <Text style={styles.metaText}>⏱ {meal.recipe.cookingTime}</Text>
                                                )}
                                                {meal.recipe.calories && (
                                                    <Text style={styles.metaText}>🔥 {meal.recipe.calories}</Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.emptyMeal}>
                                        <Ionicons name="add-circle-outline" size={24} color={Colors.textGray} />
                                        <Text style={styles.emptyMealText}>Додати страву</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    weekCalendar: {
        marginBottom: 20,
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    dayCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 70,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        position: 'relative',
    },
    dayCardSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    dayCardToday: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    dayName: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textGray,
        marginBottom: 4,
    },
    dayNameSelected: {
        color: Colors.white,
    },
    dayNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.secondary,
    },
    dayNumberSelected: {
        color: Colors.white,
    },
    todayDot: {
        position: 'absolute',
        bottom: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightGreen,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 8,
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary,
    },
    mealsContainer: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    mealCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    mealTypeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderLeftWidth: 4,
    },
    mealTypeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mealTypeIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealTypeLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
    },
    mealContent: {
        padding: 16,
        paddingTop: 0,
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
    mealMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    metaText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    emptyMeal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 8,
    },
    emptyMealText: {
        fontSize: 14,
        color: Colors.textGray,
        fontWeight: '600',
    },
});