import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { useMealPlanStore } from '@/store/mealPlanStore';
import { MealType, Unit } from '@/types/enums';

export default function MealPlanDetailScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { mealPlans, isLoading } = useMealPlanStore();

    const mealId = params.id as string;
    const [meal, setMeal] = useState(mealPlans.find((m) => m.id === mealId));

    useEffect(() => {
        const foundMeal = mealPlans.find((m) => m.id === mealId);
        setMeal(foundMeal);
    }, [mealId, mealPlans]);

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

    const getUnitLabel = (unit: Unit) => {
        return t(`UNITS.${unit}`);
    };

    const renderInstructions = (instructions: string) => {
        const instructionArray = instructions
            .split('\n')
            .filter((i) => i.trim());

        return instructionArray.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>
        ));
    };

    if (isLoading || !meal) {
        return (
            <View style={styles.centerContainer}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerTintColor: Colors.secondary,
                        headerShadowVisible: false,
                        headerBackTitle: '',
                    }}
                />
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerBackTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.headerButton}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                <View style={styles.recipeCard}>
                    <View style={styles.mealTypeBadge}>
                        <Ionicons
                            name={getMealTypeIcon(meal.type)}
                            size={16}
                            color={Colors.primary}
                        />
                        <Text style={styles.mealTypeText}>
                            {getMealTypeLabel(meal.type)}
                        </Text>
                    </View>

                    <Text style={styles.recipeName}>{meal.recipe.name}</Text>

                    <Text style={styles.dateText}>
                        {new Date(meal.date).toLocaleDateString('uk-UA', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                <View style={styles.ingredientsContainer}>
                    {meal.recipe.ingredients.map((ing, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.ingredientDot} />
                            <Text style={styles.ingredientText}>
                                {ing.product.name} - {ing.amount}{' '}
                                {getUnitLabel(ing.product.baseUnit)}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>{t('RECIPES.INSTRUCTIONS')}</Text>
                <View style={styles.instructionsContainer}>
                    {renderInstructions(meal.recipe.instructions)}
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
    headerButton: {
        padding: 8,
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    recipeCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    mealTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: Colors.lightGreen,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
        gap: 6,
    },
    mealTypeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    recipeName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: Colors.textGray,
        textTransform: 'capitalize',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    ingredientsContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ingredientDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginRight: 12,
    },
    ingredientText: {
        flex: 1,
        fontSize: 15,
        color: Colors.secondary,
    },
    instructionsContainer: {
        marginBottom: 24,
    },
    instructionItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    instructionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    instructionNumberText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 14,
    },
    instructionText: {
        flex: 1,
        fontSize: 15,
        color: Colors.secondary,
        lineHeight: 22,
    },
});