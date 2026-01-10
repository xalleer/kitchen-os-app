import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

export interface IngredientStatus {
    productName: string;
    amount: number;
    unit: string;
    available?: boolean;
    availableQuantity?: number;
    missing?: number;
}

interface RecipeIngredientCardProps {
    ingredients: IngredientStatus[];
}

export const RecipeIngredientCard: React.FC<RecipeIngredientCardProps> = ({ ingredients }) => {
    const { t } = useTranslation();

    const getMissingText = (ingredient: IngredientStatus) => {
        if (ingredient.available === false) {
            return t('RECIPES.NOT_IN_INVENTORY');
        }
        if (ingredient.missing && ingredient.missing > 0) {
            return t('RECIPES.MISSING_AMOUNT', {
                amount: ingredient.missing,
                unit: ingredient.unit
            });
        }
        return null;
    };

    return (
        <View style={styles.container}>
            {ingredients.map((ingredient, index) => {
                const missingText = getMissingText(ingredient);
                const hasIssue = missingText !== null;

                return (
                    <View key={index} style={styles.ingredientItem}>
                        <View style={[
                            styles.ingredientDot,
                            hasIssue && styles.ingredientDotWarning
                        ]} />
                        <View style={styles.ingredientContent}>
                            <Text style={[
                                styles.ingredientText,
                                hasIssue && styles.ingredientTextWarning
                            ]}>
                                {ingredient.productName} - {ingredient.amount} {ingredient.unit}
                            </Text>
                            {hasIssue && (
                                <View style={styles.warningContainer}>
                                    <Ionicons
                                        name="warning-outline"
                                        size={14}
                                        color="#F39C12"
                                    />
                                    <Text style={styles.warningText}>{missingText}</Text>
                                </View>
                            )}
                            {ingredient.availableQuantity !== undefined &&
                                ingredient.availableQuantity > 0 &&
                                !hasIssue && (
                                    <Text style={styles.availableText}>
                                        {t('RECIPES.AVAILABLE')}: {ingredient.availableQuantity} {ingredient.unit}
                                    </Text>
                                )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    ingredientDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginRight: 12,
        marginTop: 6,
    },
    ingredientDotWarning: {
        backgroundColor: '#F39C12',
    },
    ingredientContent: {
        flex: 1,
    },
    ingredientText: {
        fontSize: 15,
        color: Colors.secondary,
        marginBottom: 4,
    },
    ingredientTextWarning: {
        color: Colors.textGray,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    warningText: {
        fontSize: 13,
        color: '#F39C12',
        fontWeight: '500',
    },
    availableText: {
        fontSize: 12,
        color: Colors.primary,
        marginTop: 2,
    },
});