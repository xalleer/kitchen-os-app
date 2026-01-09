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
import { useRecipeStore } from '@/store/recipeStore';
import { useToast } from '@/components/ui/ToastProvider';
import { SavedRecipe } from '@/types/recipe';
import inventoryService from '@/services/inventory.service';


export default function RecipesScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [expiringProducts, setExpiringProducts] = useState<any>([])

    const { savedRecipes, isLoading, fetchSavedRecipes, deleteRecipe } = useRecipeStore();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRecipes();
        loadExpiringProducts()
    }, []);

    const loadExpiringProducts = async () => {
        try {
            const products = await inventoryService.getExpiringProducts();
            setExpiringProducts(products)
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error'
            })
        }
    }

    const routeToExpiringProducts = () => {
        if (expiringProducts.length === 0) {
            showToast({
                message: 'У вас немає продуктів у яких скоро закінчиться термін придатності',
                type: 'info'
            })
            return
        }
        router.push(
            `/recipes/expiring-products`
        )
    }

    const loadRecipes = async () => {
        try {
            await fetchSavedRecipes();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRecipes();
        setRefreshing(false);
    };

    const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
        Alert.alert(
            t('CONFIRM_DELETE'),
            t('CONFIRM_DELETE_RECIPE', { name: recipeName }),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
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

    if (isLoading && savedRecipes.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>{t('RECIPES.GENERATE')}</Text>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/recipes/generate-from-inventory')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="restaurant" size={24} color="#2196F3" />
                        </View>
                        <View style={styles.quickActionText}>
                            <Text style={styles.quickActionTitle}>
                                {t('RECIPES.FROM_INVENTORY')}
                            </Text>
                            <Text style={styles.quickActionSubtitle}>
                                {t('RECIPES.FROM_INVENTORY_DESC')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/recipes/generate-custom')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="create" size={24} color="#9C27B0" />
                        </View>
                        <View style={styles.quickActionText}>
                            <Text style={styles.quickActionTitle}>
                                {t('RECIPES.CUSTOM')}
                            </Text>
                            <Text style={styles.quickActionSubtitle}>
                                {t('RECIPES.CUSTOM_DESC')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.quickActionCard]}
                        onPress={routeToExpiringProducts}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="warning" size={24} color="#FF9800" />
                        </View>
                        <View style={styles.quickActionText}>
                            <Text style={styles.quickActionTitle}>
                                {t('RECIPES.EXPIRING')}
                            </Text>
                            <Text style={styles.quickActionSubtitle}>
                                {t('RECIPES.EXPIRING_DESC')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>
                    {t('RECIPES.SAVED')} ({savedRecipes.length})
                </Text>

                {savedRecipes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="book-outline" size={64} color={Colors.textGray} />
                        <Text style={styles.emptyTitle}>{t('RECIPES.EMPTY_TITLE')}</Text>
                        <Text style={styles.emptySubtitle}>
                            {t('RECIPES.EMPTY_SUBTITLE')}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.recipesGrid}>
                        {savedRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onPress={() => router.push(`/recipes/${recipe.id}`)}
                                onDelete={() => handleDeleteRecipe(recipe.id, recipe.name)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

interface RecipeCardProps {
    recipe: SavedRecipe;
    onPress: () => void;
    onDelete: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress, onDelete }) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity style={styles.recipeCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.recipeHeader}>
                <Text style={styles.recipeName} numberOfLines={2}>
                    {recipe.name}
                </Text>
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                </TouchableOpacity>
            </View>

            {recipe.description && (
                <Text style={styles.recipeDescription} numberOfLines={2}>
                    {recipe.description}
                </Text>
            )}

            <View style={styles.recipeMetaContainer}>
                {recipe.servings && (
                    <View style={styles.recipeMeta}>
                        <Ionicons name="people-outline" size={14} color={Colors.textGray} />
                        <Text style={styles.recipeMetaText}>
                            {recipe.servings} {t('RECIPES.SERVINGS')}
                        </Text>
                    </View>
                )}
                {recipe.cookingTime && (
                    <View style={styles.recipeMeta}>
                        <Ionicons name="time-outline" size={14} color={Colors.textGray} />
                        <Text style={styles.recipeMetaText}>
                            {recipe.cookingTime} {t('RECIPES.MINUTES')}
                        </Text>
                    </View>
                )}
                {recipe.ingredients && (
                    <View style={styles.recipeMeta}>
                        <Ionicons name="nutrition-outline" size={14} color={Colors.textGray} />
                        <Text style={styles.recipeMetaText}>
                            {recipe.ingredients.length} {t('RECIPES.INGREDIENTS')}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

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
    quickActionsContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    quickActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    quickActionText: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 4,
    },
    quickActionSubtitle: {
        fontSize: 13,
        color: Colors.textGray,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.inputBorder,
        marginVertical: 24,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.textGray,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    recipesGrid: {
        gap: 16,
    },
    recipeCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    recipeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    recipeName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    recipeDescription: {
        fontSize: 14,
        color: Colors.textGray,
        marginBottom: 12,
        lineHeight: 20,
    },
    recipeMetaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    recipeMetaText: {
        fontSize: 12,
        color: Colors.textGray,
    },
});