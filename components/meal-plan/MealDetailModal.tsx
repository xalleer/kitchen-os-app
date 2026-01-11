import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Modal } from '@/components/ui/Modal';
import { Meal } from '@/store/mealPlanStore';

interface MealDetailModalProps {
    visible: boolean;
    meal: Meal | null;
    onClose: () => void;
    onCook: () => void;
    onSave: () => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
                                                                    visible,
                                                                    meal,
                                                                    onClose,
                                                                    onCook,
                                                                    onSave,
                                                                }) => {
    if (!meal) return null;

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            animationType="slide"
            fullScreen
        >
            <View style={detailStyles.container}>
                <View style={detailStyles.header}>
                    <TouchableOpacity onPress={onClose} style={detailStyles.closeButton}>
                        <Ionicons name="close" size={28} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSave} style={detailStyles.saveButton}>
                        <Ionicons name="bookmark-outline" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={detailStyles.content}>
                    <Text style={detailStyles.title}>{meal.name}</Text>
                    {meal.description && (
                        <Text style={detailStyles.description}>{meal.description}</Text>
                    )}

                    <View style={detailStyles.metaContainer}>
                        <View style={detailStyles.metaItem}>
                            <Ionicons name="flame" size={24} color="#FF6B6B" />
                            <Text style={detailStyles.metaValue}>{meal.calories}</Text>
                            <Text style={detailStyles.metaLabel}>ккал</Text>
                        </View>
                        <View style={detailStyles.metaItem}>
                            <Ionicons name="time" size={24} color="#4ECDC4" />
                            <Text style={detailStyles.metaValue}>{meal.cookingTime}</Text>
                            <Text style={detailStyles.metaLabel}>хв</Text>
                        </View>
                        <View style={detailStyles.metaItem}>
                            <Ionicons name="people" size={24} color="#95E1D3" />
                            <Text style={detailStyles.metaValue}>{meal.servings}</Text>
                            <Text style={detailStyles.metaLabel}>порц.</Text>
                        </View>
                    </View>

                    <View style={detailStyles.section}>
                        <Text style={detailStyles.sectionTitle}>Інгредієнти</Text>
                        {meal.ingredients.map((ingredient, index) => (
                            <View key={index} style={detailStyles.ingredientItem}>
                                <View style={detailStyles.ingredientDot} />
                                <Text style={detailStyles.ingredientText}>
                                    {ingredient.name} - {ingredient.amount} {ingredient.unit}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={detailStyles.section}>
                        <Text style={detailStyles.sectionTitle}>Інструкція приготування</Text>
                        {meal.instructions.map((instruction, index) => (
                            <View key={index} style={detailStyles.instructionItem}>
                                <View style={detailStyles.stepNumber}>
                                    <Text style={detailStyles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={detailStyles.instructionText}>{instruction}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={detailStyles.footer}>
                    <TouchableOpacity
                        style={detailStyles.cookButton}
                        onPress={onCook}
                    >
                        <Ionicons name="restaurant" size={24} color={Colors.white} />
                        <Text style={detailStyles.cookButtonText}>Приготувати</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const detailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
    },
    closeButton: {
        padding: 8,
    },
    saveButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: Colors.textGray,
        lineHeight: 24,
        marginBottom: 24,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    metaItem: {
        alignItems: 'center',
        gap: 8,
    },
    metaValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.secondary,
    },
    metaLabel: {
        fontSize: 12,
        color: Colors.textGray,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 12,
    },
    ingredientDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginTop: 8,
        marginRight: 12,
    },
    ingredientText: {
        flex: 1,
        fontSize: 15,
        color: Colors.secondary,
        lineHeight: 22,
    },
    instructionItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
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
    instructionText: {
        flex: 1,
        fontSize: 15,
        color: Colors.secondary,
        lineHeight: 22,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    },
    cookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
    },
    cookButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
});