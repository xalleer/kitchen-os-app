import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
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
import { SavedRecipe } from '@/types/recipe';

export default function RecipeDetailScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const params = useLocalSearchParams();
    const { fetchRecipeById, cookRecipe, deleteRecipe, isLoading } = useRecipeStore();

    const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
    const [isCooking, setIsCooking] = useState(false);

    const recipeId = params.id as string;

    useEffect(() => {
        loadRecipe();
    }, [recipeId]);

    const loadRecipe = async () => {
        try {
            await fetchRecipeById(recipeId);
            const currentRecipe = useRecipeStore.getState().currentRecipe as SavedRecipe;
            setRecipe(currentRecipe);
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.RECIPE_NOT_FOUND'),
                type: 'error',
            });
            router.back();
        }
    };

    const handleCookRecipe = () => {
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
                        setIsCooking(true);
                        try {
                            await cookRecipe(recipeId);
                            showToast({
                                message: t('SUCCESS.RECIPE_COOKED'),
                                type: 'success',
                                icon: 'checkmark-circle',
                            });
                            router.back();
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        } finally {
                            setIsCooking(false);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteRecipe = () => {
        Alert.alert(
            t('CONFIRM_DELETE'),
            t('CONFIRM_DELETE_RECIPE', { name: recipe?.name }),
            [
                {
                    text: t('BUTTONS.CANCEL'),
                    style: 'cancel',
                },
                {
                    text: t('BUTTONS.DELETE'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRecipe(recipeId);
                            showToast({
                                message: t('SUCCESS.RECIPE_DELETED'),
                                type: 'success',
                                icon: 'trash',
                            });
                            router.back();
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

    const getUnitLabel = (unit: string) => {
        return t(`UNITS.${unit}`);
    };

    if (isLoading || !recipe) {
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
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                onPress={handleDeleteRecipe}
                                style={styles.headerButton}
                            >
                                <Ionicons name="trash-outline" size={22} color={Colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ),
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

                    {recipe.category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{recipe.category}</Text>
                        </View>
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

                <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                <View style={styles.ingredientsContainer}>
                    {recipe.ingredients.map((ing, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.ingredientDot} />
                            <Text style={styles.ingredientText}>
                                {ing.product.name} - {ing.amount} {getUnitLabel(ing.product.baseUnit)}
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
                        title={t('RECIPES.COOK_NOW')}
                        onPress={handleCookRecipe}
                        loading={isCooking}
                        disabled={isCooking}
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    headerButton: {
        padding: 8,
        marginLeft: 8,
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
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.lightGreen,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
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
    buttonsContainer: {
        marginTop: 16,
    },
});