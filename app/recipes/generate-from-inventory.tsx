import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
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

    const handleSaveRecipe = () => {
        if (generatedRecipe) {
            router.push({
                pathname: '/recipes/save-recipe',
                params: { recipeData: JSON.stringify(generatedRecipe) },
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
                        <View style={styles.recipeCard}>
                            <Text style={styles.recipeName}>{generatedRecipe.name}</Text>

                            {generatedRecipe.description && (
                                <Text style={styles.recipeDescription}>
                                    {generatedRecipe.description}
                                </Text>
                            )}

                            <View style={styles.recipeMetaContainer}>
                                {generatedRecipe.servings && (
                                    <View style={styles.recipeMeta}>
                                        <Ionicons
                                            name="people-outline"
                                            size={16}
                                            color={Colors.textGray}
                                        />
                                        <Text style={styles.recipeMetaText}>
                                            {generatedRecipe.servings} {t('RECIPES.SERVINGS')}
                                        </Text>
                                    </View>
                                )}
                                {generatedRecipe.cookingTime && (
                                    <View style={styles.recipeMeta}>
                                        <Ionicons
                                            name="time-outline"
                                            size={16}
                                            color={Colors.textGray}
                                        />
                                        <Text style={styles.recipeMetaText}>
                                            {generatedRecipe.cookingTime} {t('RECIPES.MINUTES')}
                                        </Text>
                                    </View>
                                )}
                                {generatedRecipe.calories && (
                                    <View style={styles.recipeMeta}>
                                        <Ionicons
                                            name="flame-outline"
                                            size={16}
                                            color={Colors.textGray}
                                        />
                                        <Text style={styles.recipeMetaText}>
                                            {generatedRecipe.calories} {t('RECIPES.KCAL')}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {!generatedRecipe.canCook && generatedRecipe.missingProducts && (
                                <View style={styles.warningCard}>
                                    <Ionicons
                                        name="warning"
                                        size={20}
                                        color="#FF9800"
                                    />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.warningTitle}>
                                            {t('RECIPES.MISSING_PRODUCTS')}
                                        </Text>
                                        <Text style={styles.warningText}>
                                            {generatedRecipe.missingProducts.join(', ')}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <Text style={styles.sectionTitle}>{t('RECIPES.INGREDIENTS')}</Text>
                        <View style={styles.ingredientsContainer}>
                            {generatedRecipe.ingredients.map((ing, index) => (
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
                            {renderInstructions(generatedRecipe.instructions)}
                        </View>

                        <View style={styles.buttonsContainer}>
                            <PrimaryButton
                                title={t('RECIPES.SAVE')}
                                onPress={handleSaveRecipe}
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
    warningCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#FF9800',
    },
    warningTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF9800',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 13,
        color: Colors.secondary,
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