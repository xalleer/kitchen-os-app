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

    useEffect(() => {
        loadMealPlan();
    }, []);

    const loadMealPlan = async () => {
        try {
            await fetchMealPlan();
            // Автоматично вибираємо перший день
            const dates = Object.keys(groupedByDay).sort();
            if (dates.length > 0) {
                setSelectedDate(dates[0]);
            }
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
        try {
            await generateMealPlan(7);
            showToast({
                message: t('SUCCESS.MEAL_PLAN_GENERATED'),
                type: 'success',
                icon: 'checkmark-circle',
            });
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
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
                                message: t('SUCCESS.PLAN_DELETED'),
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('uk-UA', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    if (isLoading && mealPlans.length === 0) {
        return (
            <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
    }

    if (mealPlans.length === 0) {
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

        {isGenerating ? (
            <View style={styles.generatingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.generatingText}>
            {t('MEAL_PLAN.GENERATING')}
            </Text>
            </View>
        ) : (
            <PrimaryButton
                title={t('MEAL_PLAN.GENERATE_WEEK')}
            onPress={handleGenerate}
            style={{ marginTop: 24, width: '100%', maxWidth: 300 }}
            />
        )}
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
        {dates.map((date) => (
                <TouchableOpacity
                    key={date}
            style={[
                    styles.dayCard,
                selectedDate === date && styles.dayCardSelected,
]}
    onPress={() => setSelectedDate(date)}
>
    <Text
        style={[
            styles.dayLabel,
        selectedDate === date && styles.dayLabelSelected,
]}
>
    {formatDate(date)}
    </Text>
    <Text
    style={[
            styles.mealsCount,
        selectedDate === date && styles.mealsCountSelected,
]}
>
    {groupedByDay[date].length} {t('MEAL_PLAN.MEALS')}
    </Text>
    </TouchableOpacity>
))}
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
        >
        <Ionicons name="refresh" size={20} color={Colors.primary} />
    </TouchableOpacity>
    </View>

        {selectedMeals.map((meal) => (
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
        >
            <Ionicons
                name="refresh-outline"
            size={20}
            color={Colors.textGray}
            />
            </TouchableOpacity>
            </View>

            <TouchableOpacity
            onPress={() =>
            router.push(`/meal-plan/${meal.id}`)
        }
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
            </View>
        ))}
        </>
    )}

    <View style={styles.actionsContainer}>
    <PrimaryButton
        title={t('MEAL_PLAN.GENERATE_NEW')}
    onPress={handleGenerate}
    loading={isGenerating}
    disabled={isGenerating}
    />
    <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDeletePlan}
    >
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
    generatingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.textGray,
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
    },
    dayCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.lightGreen,
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
    },
    regenerateButton: {
        padding: 8,
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