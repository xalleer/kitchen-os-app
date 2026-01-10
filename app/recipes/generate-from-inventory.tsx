import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useRecipeStore } from '@/store/recipeStore';
import { GeneratedRecipe } from '@/types/recipe';
import { RecipeMetaCard } from '@/components/recipes/RecipeMetaCard';
import { RecipeIngredientCard, IngredientStatus } from '@/components/recipes/RecipeIngredientCard';
import { RecipeInstructionsCard } from '@/components/recipes/RecipeInstructionsCard';

export default function GenerateFromInventoryScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const { generateFromInventory, isGenerating } = useRecipeStore();

    const [portions, setPortions] = useState('2');
    const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);

    const handleGenerate = async () => {
        try {
            const portionsNum = parseInt(portions) || 2;
            const recipe = await generateFromInventory({ portions: portionsNum });
            setGeneratedRecipe(recipe);

            showToast({
                message: t('SUCCESS.RECIPE_GENERATED'),
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

    const handleCookNow = () => {
        if (generatedRecipe) {
            router.push({
                pathname: '/recipes/cook-recipe',
                params: { recipeData: JSON.stringify(generatedRecipe) },
            });
        }
    };

    const handleSaveRecipe = () => {
        if (generatedRecipe) {
            router.push({
                pathname: '/recipes/save-recipe',
                params: { recipeData: JSON.stringify(generatedRecipe) },
            });
        }
    };

    const getIngredientStatus = (): IngredientStatus[] => {
        if (!generatedRecipe) return [];

        return generatedRecipe.ingredients.map(ing => ({
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('RECIPES.FROM_INVENTORY'),
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
                keyboardShouldPersistTaps="handled"
            >
                {!generatedRecipe ? (
                    <>
                        <View style={styles.infoCard}>
                            <Ionicons
                                name="information-circle"
                                size={24}
                                color={Colors.primary}
                            />
                            <Text style={styles.infoText}>
                                {t('RECIPES.FROM_INVENTORY_INFO')}
                            </Text>
                        </View>

                        <Text style={styles.label}>{t('RECIPES.PORTIONS')}</Text>
                        <ThemeInput
                            keyboardType="numeric"
                            placeholder="2"
                            value={portions}
                            onChangeText={setPortions}
                        />

                        <View style={{ height: 20 }} />

                        {isGenerating ? (
                            <View style={styles.generatingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Text style={styles.generatingText}>
                                    {t('RECIPES.GENERATING')}
                                </Text>
                            </View>
                        ) : (
                            <PrimaryButton
                                title={t('RECIPES.GENERATE_BUTTON')}
                                onPress={handleGenerate}
                                disabled={isGenerating}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <RecipeMetaCard
                            name={generatedRecipe.name}
                            description={generatedRecipe.description}
                            category={generatedRecipe.category}
                            servings={generatedRecipe.servings}
                            cookingTime={generatedRecipe.cookingTime}
                            calories={generatedRecipe.calories}
                            canCook={generatedRecipe.canCook}
                            missingProducts={generatedRecipe.missingProducts}
                        />

                        {!generatedRecipe.canCook && (
                            <View style={styles.insufficientCard}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={24}
                                    color="#F39C12"
                                />
                                <View style={styles.insufficientContent}>
                                    <Text style={styles.insufficientTitle}>
                                        {t('RECIPES.INSUFFICIENT_INGREDIENTS')}
                                    </Text>
                                    <Text style={styles.insufficientText}>
                                        {t('RECIPES.INSUFFICIENT_INGREDIENTS_DESC')}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                        <RecipeIngredientCard ingredients={getIngredientStatus()} />

                        <View style={{ height: 24 }} />

                        <Text style={styles.sectionTitle}>{t('RECIPES.INSTRUCTIONS')}</Text>
                        <RecipeInstructionsCard instructions={generatedRecipe.instructions} />

                        <View style={styles.buttonsContainer}>
                            {generatedRecipe.canCook && (
                                <PrimaryButton
                                    title={t('RECIPES.COOK_NOW')}
                                    onPress={handleCookNow}
                                />
                            )}
                            <PrimaryButton
                                title={t('RECIPES.SAVE')}
                                onPress={handleSaveRecipe}
                                style={{
                                    backgroundColor: Colors.secondary,
                                    marginTop: generatedRecipe.canCook ? 12 : 0
                                }}
                            />
                            <PrimaryButton
                                title={t('RECIPES.GENERATE_NEW')}
                                onPress={() => setGeneratedRecipe(null)}
                                style={{ backgroundColor: Colors.textGray, marginTop: 12 }}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
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
    insufficientCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E6',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F39C12',
    },
    insufficientContent: {
        flex: 1,
        marginLeft: 12,
    },
    insufficientTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F39C12',
        marginBottom: 4,
    },
    insufficientText: {
        fontSize: 13,
        color: Colors.secondary,
        lineHeight: 18,
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