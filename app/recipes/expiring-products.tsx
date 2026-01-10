import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import recipeService from '@/services/recipe.service';
import { ExpiringProductsRecipe } from '@/types/recipe';
import { RecipeMetaCard } from '@/components/recipes/RecipeMetaCard';
import { RecipeIngredientCard, IngredientStatus } from '@/components/recipes/RecipeIngredientCard';
import { RecipeInstructionsCard } from '@/components/recipes/RecipeInstructionsCard';

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

    const getIngredientStatus = (): IngredientStatus[] => {
        if (!data?.suggestedRecipe) return [];

        return data.suggestedRecipe.ingredients.map(ing => ({
            productName: ing.productName,
            amount: ing.amount,
            unit: ing.unit,
        }));
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
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                                <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
                            </TouchableOpacity>
                        ),
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
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                                <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
                            </TouchableOpacity>
                        ),
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

                <View style={styles.suggestedRecipeHeader}>
                    <Ionicons name="restaurant" size={24} color={Colors.primary} />
                    <Text style={styles.suggestedRecipeText}>
                        {t('RECIPES.SUGGESTED_RECIPE')}
                    </Text>
                </View>

                <RecipeMetaCard
                    name={recipe.name}
                    description={recipe.description}
                    category={recipe.category}
                    servings={recipe.servings}
                    cookingTime={recipe.cookingTime}
                    calories={recipe.calories}
                />

                <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                <RecipeIngredientCard ingredients={getIngredientStatus()} />

                <View style={{ height: 24 }} />

                <Text style={styles.sectionTitle}>{t('RECIPES.INSTRUCTIONS')}</Text>
                <RecipeInstructionsCard instructions={recipe.instructions} />

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
    suggestedRecipeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGreen,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    suggestedRecipeText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        marginLeft: 8,
        textTransform: 'uppercase',
    },
    buttonsContainer: {
        marginTop: 24,
    },
});