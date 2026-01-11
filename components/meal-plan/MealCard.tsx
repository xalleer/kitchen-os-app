import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Meal } from '@/store/mealPlanStore';

interface MealCardProps {
    meal: Meal;
    mealType: {
        key: string;
        label: string;
        icon: string;
        time: string;
    };
    isRegenerating: boolean;
    onRegenerate: () => void;
    onViewDetails: () => void;
    onCook: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
                                                      meal,
                                                      mealType,
                                                      isRegenerating,
                                                      onRegenerate,
                                                      onViewDetails,
                                                      onCook,
                                                  }) => {
    const [fadeAnim] = useState(new Animated.Value(1));
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isRegenerating) {
            // Fade animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 0.5,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Pulse animation for icon
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            fadeAnim.setValue(1);
            pulseAnim.setValue(1);
        }
    }, [isRegenerating]);

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <View style={styles.mealTypeContainer}>
                    <Text style={styles.mealIcon}>{mealType.icon}</Text>
                    <View>
                        <Text style={styles.mealTypeLabel}>{mealType.label}</Text>
                        <Text style={styles.mealTime}>{mealType.time}</Text>
                    </View>
                </View>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity
                        onPress={onRegenerate}
                        disabled={isRegenerating}
                        style={styles.regenerateButton}
                    >
                        <Ionicons
                            name={isRegenerating ? 'hourglass-outline' : 'refresh'}
                            size={20}
                            color={Colors.primary}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {isRegenerating ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Генерується нова страва...</Text>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    transform: [{
                                        translateX: fadeAnim.interpolate({
                                            inputRange: [0.5, 1],
                                            outputRange: [-100, 0],
                                        }),
                                    }],
                                },
                            ]}
                        />
                    </View>
                </View>
            ) : (
                <>
                    <TouchableOpacity onPress={onViewDetails}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        {meal.description && (
                            <Text style={styles.mealDescription} numberOfLines={2}>
                                {meal.description}
                            </Text>
                        )}
                        <View style={styles.meta}>
                            <View style={styles.metaItem}>
                                <Ionicons name="flame-outline" size={16} color={Colors.textGray} />
                                <Text style={styles.metaText}>{meal.calories} ккал</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={16} color={Colors.textGray} />
                                <Text style={styles.metaText}>{meal.cookingTime} хв</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="people-outline" size={16} color={Colors.textGray} />
                                <Text style={styles.metaText}>{meal.servings} порц.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onViewDetails}
                        >
                            <Ionicons name="book-outline" size={18} color={Colors.secondary} />
                            <Text style={styles.actionButtonText}>Рецепт</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonPrimary]}
                            onPress={onCook}
                        >
                            <Ionicons name="restaurant-outline" size={18} color={Colors.white} />
                            <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                                Приготувати
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Animated.View>
    );
};

const mealCardStyles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mealIcon: {
        fontSize: 32,
    },
    mealTypeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
    },
    mealTime: {
        fontSize: 12,
        color: Colors.textGray,
        marginTop: 2,
    },
    regenerateButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.textGray,
        textAlign: 'center',
        marginBottom: 12,
    },
    progressBar: {
        height: 4,
        backgroundColor: Colors.inputBackground,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.primary,
    },
    mealName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    mealDescription: {
        fontSize: 14,
        color: Colors.textGray,
        marginBottom: 12,
        lineHeight: 20,
    },
    meta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    actionButtonPrimary: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
    },
    actionButtonTextPrimary: {
        color: Colors.white,
    },
});

const styles = mealCardStyles;