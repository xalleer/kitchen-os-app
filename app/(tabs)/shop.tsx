import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import shoppingService from '@/services/shopping.service';
import { ShoppingListItem } from '@/types/api';

export default function Shop() {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [stats, setStats] = useState({
        totalItems: 0,
        boughtItems: 0,
        remainingItems: 0,
        totalPrice: 0,
        boughtPrice: 0,
        remainingPrice: 0,
    });

    useEffect(() => {
        loadShoppingList();
    }, []);

    const loadShoppingList = useCallback(async (showRefreshControl = false) => {
        try {
            if (showRefreshControl) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const data = await shoppingService.getShoppingList();
            setItems(data);

            const statsData = await shoppingService.getShoppingStats(data);
            setStats(statsData);
        } catch (error: any) {
            console.error('Error loading shopping list:', error);
            Alert.alert('Помилка', error.message || 'Не вдалося завантажити список покупок');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const onRefresh = useCallback(() => {
        loadShoppingList(true);
    }, [loadShoppingList]);

    const handleGenerateList = async () => {
        setIsGenerating(true);
        try {
            await shoppingService.generateShoppingList();
            Alert.alert('Успіх! 🛒', 'Список покупок успішно згенеровано на основі ваших планів');
            await loadShoppingList();
        } catch (error: any) {
            Alert.alert('Помилка', error.message || 'Не вдалося згенерувати список');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
        try {
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, isBought: !currentStatus } : item
                )
            );

            if (!currentStatus) {
                await shoppingService.markAsBought(itemId);
            }

            const updatedItems = items.map(item =>
                item.id === itemId ? { ...item, isBought: !currentStatus } : item
            );
            const statsData = await shoppingService.getShoppingStats(updatedItems);
            setStats(statsData);
        } catch (error: any) {
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, isBought: currentStatus } : item
                )
            );
            Alert.alert('Помилка', error.message || 'Не вдалося оновити статус');
        }
    };

    const getProgressPercentage = () => {
        if (stats.totalItems === 0) return 0;
        return Math.round((stats.boughtItems / stats.totalItems) * 100);
    };

    const remainingItems = items.filter(item => !item.isBought);
    const boughtItems = items.filter(item => item.isBought);

    if (isLoading) {
        return (
            <View style={[SharedStyles.containerMain, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 10, color: Colors.textGray }}>Завантаження...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={SharedStyles.containerMain}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <View>
                            <Text style={styles.statsLabel}>Витрачено</Text>
                            <Text style={styles.statsValue}>
                                {stats.boughtPrice.toFixed(0)} <Text style={styles.currency}>грн</Text>
                            </Text>
                        </View>
                        <View style={styles.statsRight}>
                            <Text style={styles.statsLabel}>Залишилось</Text>
                            <Text style={styles.statsValue}>
                                {stats.remainingPrice.toFixed(0)} <Text style={styles.currency}>грн</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${getProgressPercentage()}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {stats.boughtItems} з {stats.totalItems} куплено
                        </Text>
                    </View>
                </View>

                {/* Generate Button */}
                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={handleGenerateList}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <ActivityIndicator color={Colors.primary} />
                    ) : (
                        <>
                            <Ionicons name="sparkles" size={20} color={Colors.primary} />
                            <Text style={styles.generateButtonText}>Згенерувати список AI</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Shopping List */}
                {items.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cart-outline" size={60} color={Colors.inputBorder} />
                        <Text style={styles.emptyStateTitle}>Список порожній</Text>
                        <Text style={styles.emptyStateText}>
                            Натисніть "Згенерувати список AI" щоб створити список покупок на основі ваших планів
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* To Buy Section */}
                        {remainingItems.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Купити ({remainingItems.length})
                                </Text>
                                {remainingItems.map((item) => (
                                    <ShoppingItem
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggleItem}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Bought Section */}
                        {boughtItems.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Куплено ({boughtItems.length})
                                </Text>
                                {boughtItems.map((item) => (
                                    <ShoppingItem
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggleItem}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const ShoppingItem = ({
                          item,
                          onToggle,
                      }: {
    item: ShoppingListItem;
    onToggle: (id: string, currentStatus: boolean) => void;
}) => {
    return (
        <TouchableOpacity
            style={[styles.itemCard, item.isBought && styles.itemCardBought]}
            onPress={() => onToggle(item.id, item.isBought)}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.checkbox, item.isBought && styles.checkboxChecked]}>
                    {item.isBought && (
                        <Ionicons name="checkmark" size={18} color={Colors.white} />
                    )}
                </View>
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, item.isBought && styles.itemNameBought]}>
                        {item.product?.name || item.customName}
                    </Text>
                    <Text style={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                    </Text>
                </View>
            </View>
            <View style={styles.itemRight}>
                <Text style={[styles.itemPrice, item.isBought && styles.itemPriceBought]}>
                    {item.estimatedPrice.toFixed(0)} грн
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statsRight: {
        alignItems: 'flex-end',
    },
    statsLabel: {
        fontSize: 14,
        color: Colors.textGray,
        marginBottom: 4,
    },
    statsValue: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.secondary,
    },
    currency: {
        fontSize: 16,
        fontWeight: '600',
    },
    progressContainer: {
        gap: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.inputBackground,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: Colors.textGray,
        textAlign: 'center',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightGreen,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 8,
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 12,
    },
    itemCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    itemCardBought: {
        backgroundColor: Colors.inputBackground,
        opacity: 0.7,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 2,
    },
    itemNameBought: {
        textDecorationLine: 'line-through',
        color: Colors.textGray,
    },
    itemQuantity: {
        fontSize: 14,
        color: Colors.textGray,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
    },
    itemPriceBought: {
        color: Colors.textGray,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: Colors.textGray,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 40,
    },
});