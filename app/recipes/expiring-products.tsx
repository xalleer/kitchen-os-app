import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import recipeService from '@/services/recipe.service';
import { ExpiringProductsRecipe } from '@/types/recipe';

export default function ExpiringProductsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const [data, setData] = useState<ExpiringProductsRecipe | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadExpiringRecipes();
    }, []);

    const loadExpiringRecipes = async () => {
        setIsLoading(true);
        try {
            const result = await recipeService.getExpiringProductsRecipes();
            setData(result);
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRecipe = () => {
        if (data?.suggestedRecipe) {
            router.push({
                pathname: '/recipes/save-recipe',
                params: { recipeData: JSON.stringify(data.suggestedRecipe) },
            });
        }
    };

    const handleCookNow = () => {
        if (data?.suggestedRecipe) {
            router.push({
                pathname: '/recipes/cook-recipe',
                params: { recipeData: JSON.stringify(data.suggestedRecipe) },
            });
        }
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

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: t('RECIPES.EXPIRING'),
                        headerTintColor: Colors.secondary,
                        headerShadowVisible: false,
                        headerBackTitle: '',
                    }}
                />
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!data || data.expiringProducts.length === 0) {
        return (
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: t('RECIPES.EXPIRING'),
                        headerTintColor: Colors.secondary,
                        headerShadowVisible: false,
                        headerBackTitle: '',
                    }}
                />
                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
                    <Text style={styles.emptyTitle}>{t('RECIPES.NO_EXPIRING_PRODUCTS')}</Text>
                    <Text style={styles.emptySubtitle}>
                        {t('RECIPES.NO_EXPIRING_PRODUCTS_DESC')}
                    </Text>
                </View>
            </View>
        );
    }

    const recipe = data.suggestedRecipe;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('RECIPES.EXPIRING'),
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerBackTitle: '',
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                <View style={styles.warningCard}>
                    <Ionicons name="warning" size={24} color="#FF9800" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.warningTitle}>
                            {t('RECIPES.PRODUCTS_EXPIRING_SOON')}
                        </Text>
                        <Text style={styles.warningText}>
                            {data.expiringProducts.length} {t('RECIPES.PRODUCTS_EXPIRING')}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t('RECIPES.EXPIRING_PRODUCTS_LIST')}</Text>
                <View style={styles.productsContainer}>
                    {data.expiringProducts.map((product, index) => (
                        <View key={index} style={styles.productItem}>
                            <View style={styles.productDot} />
                            <Text style={styles.productText}>
                                {product.name} - {product.quantity}{' '}
                                {product.expiryDate && (
                                    <Text style={styles.expiryText}>
                                        ({t('FRIDGE.EXPIRES_ON', {
                                        date: new Date(product.expiryDate).toLocaleDateString()
                                    })})
                                    </Text>
                                )}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.recipeCard}>
                    <View style={styles.recipeHeader}>
                        <Ionicons name="restaurant" size={24} color={Colors.primary} />
                        <Text style={styles.recipeHeaderText}>
                            {t('RECIPES.SUGGESTED_RECIPE')}
                        </Text>
                    </View>

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

                <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                <View style={styles.ingredientsContainer}>
                    {recipe.ingredients.map((ing, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.ingredientDot} />
                            <Text style={styles.ingredientText}>
                                {ing.productName} - {ing.amount} {ing.unit}
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
                        onPress={handleCookNow}
                    />
                    <PrimaryButton
                        title={t('RECIPES.SAVE')}
                        onPress={handleSaveRecipe}
                        style={{ backgroundColor: Colors.secondary, marginTop: 12 }}
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
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
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
    warningCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#FF9800',
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF9800',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 14,
        color: Colors.secondary,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    productsContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF9800',
        marginRight: 12,
        marginTop: 6,
    },
    productText: {
        flex: 1,
        fontSize: 15,
        color: Colors.secondary,
    },
    expiryText: {
        fontSize: 13,
        color: Colors.textGray,
    },
    recipeCard: {
        backgroundColor: Colors.lightGreen,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    recipeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    recipeHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        marginLeft: 8,
        textTransform: 'uppercase',
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