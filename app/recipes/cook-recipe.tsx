import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useRecipeStore } from '@/store/recipeStore';
import { GeneratedRecipe } from '@/types/recipe';

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
        if (!recipe) return;

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

    const renderInstructions = (instructions: string | string[]) => {
        const instructionArray = Array.isArray(instructions)
            ? instructions
            : instructions.split('\n').filter(i => i.trim());

        return instructionArray.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>
        ));
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
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                <View style={styles.recipeCard}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>

                    {recipe.description && (
                        <Text style={styles.recipeDescription}>
                            {recipe.description}
                        </Text>
                    )}

                    <View style={styles.recipeMetaContainer}>
                        {recipe.servings && (
                            <View style={styles.recipeMeta}>
                                <Ionicons
                                    name="people-outline"
                                    size={16}
                                    color={Colors.textGray}
                                />
                                <Text style={styles.recipeMetaText}>
                                    {recipe.servings} {t('RECIPES.SERVINGS')}
                                </Text>
                            </View>
                        )}
                        {recipe.cookingTime && (
                            <View style={styles.recipeMeta}>
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color={Colors.textGray}
                                />
                                <Text style={styles.recipeMetaText}>
                                    {recipe.cookingTime} {t('RECIPES.MINUTES')}
                                </Text>
                            </View>
                        )}
                        {recipe.calories && (
                            <View style={styles.recipeMeta}>
                                <Ionicons
                                    name="flame-outline"
                                    size={16}
                                    color={Colors.textGray}
                                />
                                <Text style={styles.recipeMetaText}>
                                    {recipe.calories} {t('RECIPES.KCAL')}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

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
                <View style={styles.ingredientsContainer}>
                    {recipe.ingredients.map((ing, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={[
                                styles.ingredientDot,
                                !ing.available && styles.ingredientDotUnavailable
                            ]} />
                            <Text style={[
                                styles.ingredientText,
                                !ing.available && styles.ingredientTextUnavailable
                            ]}>
                                {ing.productName} - {ing.amount} {ing.unit}
                                {!ing.available && (
                                    <Text style={styles.unavailableText}>
                                        {' '}({t('RECIPES.NOT_AVAILABLE')})
                                    </Text>
                                )}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>{t('RECIPES.INSTRUCTIONS')}</Text>
                <View style={styles.instructionsContainer}>
                    {renderInstructions(recipe.instructions)}
                </View>

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
    recipeCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    recipeName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    recipeDescription: {
        fontSize: 16,
        color: Colors.textGray,
        marginBottom: 16,
        lineHeight: 24,
    },
    recipeMetaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    recipeMetaText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGreen,
        padding: 16,
        borderRadius: 12,
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
    ingredientDotUnavailable: {
        backgroundColor: Colors.textGray,
    },
    ingredientText: {
        flex: 1,
        fontSize: 15,
        color: Colors.secondary,
    },
    ingredientTextUnavailable: {
        color: Colors.textGray,
    },
    unavailableText: {
        fontSize: 13,
        color: Colors.danger,
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
    buttonsContainer: {
        marginTop: 16,
    },
});