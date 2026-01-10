import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

interface RecipeMetaCardProps {
    name: string;
    description?: string;
    category?: string;
    servings?: number;
    cookingTime?: number;
    calories?: number;
    canCook?: boolean;
    missingProducts?: string[];
}

export const RecipeMetaCard: React.FC<RecipeMetaCardProps> = ({
                                                                  name,
                                                                  description,
                                                                  category,
                                                                  servings,
                                                                  cookingTime,
                                                                  calories,
                                                                  canCook,
                                                                  missingProducts,
                                                              }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.recipeName}>{name}</Text>

            {description && (
                <Text style={styles.recipeDescription}>{description}</Text>
            )}

            {category && (
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{category}</Text>
                </View>
            )}

            <View style={styles.metaContainer}>
                {servings && (
                    <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={16} color={Colors.textGray} />
                        <Text style={styles.metaText}>
                            {servings} {t('RECIPES.SERVINGS')}
                        </Text>
                    </View>
                )}
                {cookingTime && (
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={Colors.textGray} />
                        <Text style={styles.metaText}>
                            {cookingTime} {t('RECIPES.MINUTES')}
                        </Text>
                    </View>
                )}
                {calories && (
                    <View style={styles.metaItem}>
                        <Ionicons name="flame-outline" size={16} color={Colors.textGray} />
                        <Text style={styles.metaText}>
                            {calories} {t('RECIPES.KCAL')}
                        </Text>
                    </View>
                )}
            </View>

            {canCook === false && missingProducts && missingProducts.length > 0 && (
                <View style={styles.warningCard}>
                    <Ionicons name="warning" size={20} color="#F39C12" />
                    <View style={styles.warningContent}>
                        <Text style={styles.warningTitle}>
                            {t('RECIPES.MISSING_PRODUCTS')}
                        </Text>
                        <Text style={styles.warningText}>
                            {missingProducts.join(', ')}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
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
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
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
        borderColor: '#F39C12',
    },
    warningContent: {
        flex: 1,
        marginLeft: 12,
    },
    warningTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F39C12',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 13,
        color: Colors.secondary,
    },
});