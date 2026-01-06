import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import aiChefService from '@/services/ai-chef.service';
import { AIGeneratedRecipe } from '@/types/api';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function Dishes() {
    const [recipe, setRecipe] = useState<AIGeneratedRecipe | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCooking, setIsCooking] = useState(false);
    const [showRecipeModal, setShowRecipeModal] = useState(false);

    const handleGenerateRecipe = async () => {
        setIsGenerating(true);
        try {
            const generatedRecipe = await aiChefService.generateRecipe();
            setRecipe(generatedRecipe);
            setShowRecipeModal(true);
        } catch (error: any) {
            Alert.alert(
                'Помилка генерації',
                error.message || 'Не вдалося згенерувати рецепт. Переконайтеся, що у вас є продукти в холодильнику.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCookRecipe = async () => {
        if (!recipe) return;

        Alert.alert(
            'Приготувати страву?',
            'Це спише інгредієнти з холодильника та додасть рецепт до меню на сьогодні.',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Приготувати',
                    onPress: async () => {
                        setIsCooking(true);
                        try {
                            const result = await aiChefService.cookRecipe(recipe);
                            Alert.alert('Смачного! 🍽️', result.message);
                            setShowRecipeModal(false);
                            setRecipe(null);
                        } catch (error: any) {
                            Alert.alert('Помилка', error.message || 'Не вдалося приготувати страву');
                        } finally {
                            setIsCooking(false);
                        }
                    }
                }
            ]
        );
    };

    const handleRegenerate = () => {
        setShowRecipeModal(false);
        setRecipe(null);
        setTimeout(() => handleGenerateRecipe(), 300);
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView style={SharedStyles.containerMain} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="restaurant" size={48} color={Colors.primary} />
                    </View>
                    <Text style={styles.heroTitle}>AI Chef</Text>
                    <Text style={styles.heroSubtitle}>
                        Наш AI аналізує продукти у вашому холодильнику та створює ідеальний рецепт
                    </Text>
                </View>

                <View style={styles.featuresContainer}>
                    <FeatureItem
                        icon="nutrition"
                        title="Персоналізовано"
                        description="Враховує ваші цілі та харчові потреби"
                    />
                    <FeatureItem
                        icon="leaf"
                        title="Без відходів"
                        description="Використовує наявні продукти"
                    />
                    <FeatureItem
                        icon="time"
                        title="Швидко"
                        description="Рецепти за лічені секунди"
                    />
                </View>

                <View style={styles.generateSection}>
                    <PrimaryButton
                        title={isGenerating ? 'Генерую рецепт...' : 'Згенерувати рецепт'}
                        onPress={handleGenerateRecipe}
                        loading={isGenerating}
                        disabled={isGenerating}
                        showArrow={!isGenerating}
                    />
                    <Text style={styles.hint}>
                        💡 Переконайтеся, що у вашому холодильнику є продукти
                    </Text>
                </View>

                <View style={styles.howItWorksCard}>
                    <Text style={styles.sectionTitle}>Як це працює?</Text>
                    <StepItem number={1} text="AI аналізує продукти у холодильнику" />
                    <StepItem number={2} text="Враховує ваші харчові цілі та вподобання" />
                    <StepItem number={3} text="Генерує унікальний рецепт з покроковими інструкціями" />
                    <StepItem number={4} text="Автоматично списує використані інгредієнти" />
                </View>
            </ScrollView>

            <Modal
                visible={showRecipeModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowRecipeModal(false)}
            >
                {recipe && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                onPress={() => setShowRecipeModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={28} color={Colors.secondary} />
                            </TouchableOpacity>
                            <Text style={styles.modalHeaderTitle}>Ваш рецепт</Text>
                            <TouchableOpacity onPress={handleRegenerate} style={styles.regenerateButton}>
                                <Ionicons name="refresh" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                            <View style={styles.recipeHeader}>
                                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                <Text style={styles.recipeDescription}>{recipe.description}</Text>

                                <View style={styles.recipeMetaRow}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={20} color={Colors.primary} />
                                        <Text style={styles.metaText}>{recipe.cookingTime}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="flame-outline" size={20} color={Colors.primary} />
                                        <Text style={styles.metaText}>{recipe.calories}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Ingredients */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Інгредієнти</Text>
                                {recipe.ingredients.map((ing, index) => (
                                    <View key={index} style={styles.ingredientItem}>
                                        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                                        <Text style={styles.ingredientText}>
                                            {ing.name} - {ing.amount}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Steps */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Інструкція</Text>
                                {recipe.steps.map((step, index) => (
                                    <View key={index} style={styles.stepItem}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.stepText}>{step}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={{ height: 100 }} />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <PrimaryButton
                                title={isCooking ? 'Приготовую...' : 'Приготувати страву'}
                                onPress={handleCookRecipe}
                                loading={isCooking}
                                disabled={isCooking}
                            />
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
}

const FeatureItem = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
            <Ionicons name={icon as any} size={24} color={Colors.primary} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
    </View>
);

const StepItem = ({ number, text }: { number: number; text: string }) => (
    <View style={styles.stepItemSmall}>
        <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{number}</Text>
        </View>
        <Text style={styles.stepTextSmall}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    heroCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.secondary,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    featureItem: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 4,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 12,
        color: Colors.textGray,
        textAlign: 'center',
    },
    generateSection: {
        marginBottom: 24,
    },
    hint: {
        textAlign: 'center',
        color: Colors.textGray,
        fontSize: 14,
        marginTop: 12,
    },
    howItWorksCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    stepItemSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },
    stepTextSmall: {
        flex: 1,
        fontSize: 14,
        color: Colors.secondary,
        lineHeight: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
    },
    regenerateButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 24,
    },
    recipeHeader: {
        paddingVertical: 24,
    },
    recipeTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.secondary,
        marginBottom: 12,
    },
    recipeDescription: {
        fontSize: 16,
        color: Colors.textGray,
        lineHeight: 24,
        marginBottom: 16,
    },
    recipeMetaRow: {
        flexDirection: 'row',
        gap: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
    },
    section: {
        marginBottom: 24,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 12,
    },
    ingredientText: {
        fontSize: 16,
        color: Colors.secondary,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.white,
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        color: Colors.secondary,
        lineHeight: 24,
    },
    modalFooter: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.background,
    },
});