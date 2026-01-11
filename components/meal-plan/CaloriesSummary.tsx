import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { DayMealPlan } from '@/store/mealPlanStore';

interface CaloriesSummaryProps {
    totalCalories: number;
    targetCalories: number;
    meals: DayMealPlan;
}

export const CaloriesSummary: React.FC<CaloriesSummaryProps> = ({
                                                                    totalCalories,
                                                                    targetCalories,
                                                                    meals,
                                                                }) => {
    const percentage = Math.min((totalCalories / targetCalories) * 100, 100);
    const isOverTarget = totalCalories > targetCalories;
    const difference = Math.abs(totalCalories - targetCalories);

    const mealBreakdown = [
        { key: 'breakfast', label: 'Сніданок', color: '#FFB74D', calories: meals.breakfast?.calories || 0 },
        { key: 'lunch', label: 'Обід', color: '#4FC3F7', calories: meals.lunch?.calories || 0 },
        { key: 'dinner', label: 'Вечеря', color: '#9575CD', calories: meals.dinner?.calories || 0 },
        { key: 'snack', label: 'Перекус', color: '#81C784', calories: meals.snack?.calories || 0 },
    ].filter(meal => meal.calories > 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Калорії за день</Text>
                <View style={[
                    styles.badge,
                    { backgroundColor: isOverTarget ? '#FFEBEE' : Colors.lightGreen }
                ]}>
                    <Text style={[
                        styles.badgeText,
                        { color: isOverTarget ? Colors.danger : Colors.primary }
                    ]}>
                        {isOverTarget ? '+' : '-'}{difference} ккал
                    </Text>
                </View>
            </View>

            <View style={styles.caloriesDisplay}>
                <Text style={styles.caloriesValue}>{totalCalories}</Text>
                <Text style={styles.caloriesUnit}>ккал</Text>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${percentage}%`,
                                backgroundColor: isOverTarget ? Colors.danger : Colors.primary,
                            },
                        ]}
                    />
                </View>
                <Text style={styles.targetText}>Ціль: {targetCalories} ккал</Text>
            </View>

            <View style={styles.breakdown}>
                {mealBreakdown.map((meal, index) => (
                    <View key={meal.key} style={styles.breakdownItem}>
                        <View style={[styles.breakdownDot, { backgroundColor: meal.color }]} />
                        <Text style={styles.breakdownLabel}>{meal.label}</Text>
                        <Text style={styles.breakdownValue}>{meal.calories} ккал</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    caloriesDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    caloriesValue: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.secondary,
    },
    caloriesUnit: {
        fontSize: 16,
        color: Colors.textGray,
        marginLeft: 8,
    },
    progressBarContainer: {
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.inputBackground,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    targetText: {
        fontSize: 12,
        color: Colors.textGray,
    },
    breakdown: {
        gap: 12,
    },
    breakdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breakdownDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    breakdownLabel: {
        flex: 1,
        fontSize: 14,
        color: Colors.secondary,
    },
    breakdownValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
    },
});