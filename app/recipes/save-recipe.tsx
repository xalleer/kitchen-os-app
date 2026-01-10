import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useRecipeStore } from '@/store/recipeStore';
import { GeneratedRecipe } from '@/types/recipe';

export default function SaveRecipeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const params = useLocalSearchParams();
    const { saveRecipe, isLoading } = useRecipeStore();

    const recipe: GeneratedRecipe = params.recipeData
        ? JSON.parse(params.recipeData as string)
        : null;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [servings, setServings] = useState('');
    const [calories, setCalories] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (recipe) {
            setName(recipe.name || '');
            setDescription(recipe.description || '');
            setCookingTime(recipe.cookingTime?.toString() || '');
            setServings(recipe.servings?.toString() || '');
            setCalories(recipe.calories?.toString() || '');
            setCategory(recipe.category || '');
        }
    }, [recipe]);

    const handleSave = async () => {
        if (!recipe) {
            showToast({
                message: t('ERRORS.RECIPE_NOT_FOUND'),
                type: 'error',
            });
            return;
        }

        if (!name.trim()) {
            showToast({
                message: t('ERRORS.RECIPE_NAME_REQUIRED'),
                type: 'warning',
            });
            return;
        }

        try {
            const instructionsStr = Array.isArray(recipe.instructions)
                ? recipe.instructions.join('\n')
                : recipe.instructions;

            const ingredients = recipe.ingredients.map(ing => ({
                productId: ing.productId || '',
                amount: ing.amount,
            })).filter(ing => ing.productId);

            await saveRecipe({
                name: name.trim(),
                description: description.trim() || undefined,
                instructions: instructionsStr,
                cookingTime: cookingTime ? parseInt(cookingTime) : undefined,
                servings: servings ? parseInt(servings) : undefined,
                calories: calories ? parseInt(calories) : undefined,
                category: category.trim() || undefined,
                ingredients,
            });

            showToast({
                message: t('SUCCESS.RECIPE_SAVED'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            router.replace('/(tabs)/recipes');
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    if (!recipe) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{t('ERRORS.RECIPE_NOT_FOUND')}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('RECIPES.SAVE_RECIPE'),
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
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={20} color={Colors.primary} />
                    <Text style={styles.infoText}>
                        {t('RECIPES.SAVE_RECIPE_INFO')}
                    </Text>
                </View>

                <Text style={styles.label}>{t('RECIPES.RECIPE_NAME')} *</Text>
                <ThemeInput
                    placeholder={t('RECIPES.RECIPE_NAME_PLACEHOLDER')}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>{t('RECIPES.DESCRIPTION')}</Text>
                <ThemeInput
                    placeholder={t('RECIPES.DESCRIPTION_PLACEHOLDER')}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    style={{ minHeight: 80 }}
                />

                <Text style={styles.label}>{t('RECIPES.COOKING_TIME')} ({t('RECIPES.MINUTES')})</Text>
                <ThemeInput
                    placeholder="30"
                    value={cookingTime}
                    onChangeText={setCookingTime}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>{t('RECIPES.SERVINGS')}</Text>
                <ThemeInput
                    placeholder="2"
                    value={servings}
                    onChangeText={setServings}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>{t('RECIPES.CALORIES')} ({t('RECIPES.KCAL')})</Text>
                <ThemeInput
                    placeholder="500"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>{t('RECIPES.CATEGORY')}</Text>
                <ThemeInput
                    placeholder={t('RECIPES.CATEGORY_PLACEHOLDER')}
                    value={category}
                    onChangeText={setCategory}
                />

                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={t('RECIPES.SAVE')}
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading || !name.trim()}
                />
            </View>
        </KeyboardAvoidingView>
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
        paddingBottom: 120,
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
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'flex-start',
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
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
});