import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useRecipeStore } from '@/store/recipeStore';
import { GeneratedRecipe } from '@/types/recipe';
import { RecipeMetaCard } from '@/components/recipes/RecipeMetaCard';
import { RecipeIngredientCard, IngredientStatus } from '@/components/recipes/RecipeIngredientCard';
import { RecipeInstructionsCard } from '@/components/recipes/RecipeInstructionsCard';

export default function CookRecipeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const params = useLocalSearchParams();
    const { cookRecipe, saveRecipe } = useRecipeStore();

    const [isLoading, setIsLoading] = useState(false);

    const recipe: GeneratedRecipe = params.recipeData
        ? JSON.parse(params.recipeData as string)
        : null;

    if (!recipe) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{t('ERRORS.RECIPE_NOT_FOUND')}</Text>
            </View>
        );
    }

    const handleCookNow = async () => {
        Alert.alert(
            t('RECIPES.CONFIRM_COOK'),
            t('RECIPES.CONFIRM_COOK_DESC'),
            [
                {
                    text: t('BUTTONS.CANCEL'),
                    style: 'cancel',
                },
                {
                    text: t('RECIPES.COOK_NOW'),
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            // Якщо рецепт вже збережений (має ID), використовуємо cookRecipe
                            if (recipe.id) {
                                await cookRecipe(recipe.id);
                            } else {
                                // Якщо рецепт не збережений, спочатку зберігаємо його
                                const instructionsStr = Array.isArray(recipe.instructions)
                                    ? recipe.instructions.join('\n')
                                    : recipe.instructions;

                                const ingredients = recipe.ingredients
                                    .map(ing => ({
                                        productId: ing.productId || '',
                                        amount: ing.amount,
                                    }))
                                    .filter(ing => ing.productId);

                                const savedRecipe = await saveRecipe({
                                    name: recipe.name,
                                    description: recipe.description,
                                    instructions: instructionsStr,
                                    cookingTime: recipe.cookingTime,
                                    servings: recipe.servings,
                                    calories: recipe.calories,
                                    category: recipe.category,
                                    ingredients,
                                });

                                // Тепер готуємо збережений рецепт
                                if (savedRecipe?.id) {
                                    await cookRecipe(savedRecipe.id);
                                }
                            }

                            showToast({
                                message: t('SUCCESS.RECIPE_COOKED'),
                                type: 'success',
                                icon: 'checkmark-circle',
                            });

                            router.replace('/(tabs)/recipes');
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const getIngredientStatus = (): IngredientStatus[] => {
        return recipe.ingredients.map(ing => ({
            productName: ing.productName,
            amount: ing.amount,
            unit: ing.unit,
            available: ing.available,
            availableQuantity: ing.availableQuantity,
            missing: ing.availableQuantity !== undefined && ing.availableQuantity < ing.amount
                ? ing.amount - ing.availableQuantity
                : undefined,
        }));
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('RECIPES.COOK_RECIPE'),
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerBackTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                <RecipeMetaCard
                    name={recipe.name}
                    description={recipe.description}
                    category={recipe.category}
                    servings={recipe.servings}
                    cookingTime={recipe.cookingTime}
                    calories={recipe.calories}
                />

                <View style={styles.infoCard}>
                    <Ionicons
                        name="information-circle"
                        size={24}
                        color={Colors.primary}
                    />
                    <Text style={styles.infoText}>
                        {t('RECIPES.COOK_INFO')}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                <RecipeIngredientCard ingredients={getIngredientStatus()} />

                <View style={{ height: 24 }} />

                <Text style={styles.sectionTitle}>{t('RECIPES.INSTRUCTIONS')}</Text>
                <RecipeInstructionsCard instructions={recipe.instructions} />

                <View style={styles.buttonsContainer}>
                    <PrimaryButton
                        title={t('RECIPES.MARK_AS_COOKED')}
                        onPress={handleCookNow}
                        loading={isLoading}
                        disabled={isLoading}
                    />
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
    errorText: {
        fontSize: 16,
        color: Colors.textGray,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGreen,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: Colors.secondary,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    buttonsContainer: {
        marginTop: 24,
    },
});