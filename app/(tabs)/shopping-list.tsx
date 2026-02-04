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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { ShoppingListItem as ShoppingListItemType } from '@/types/shopping-list';
import { Unit } from '@/types/enums';

export default function ShoppingListScreen() {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const {
        items,
        summary,
        groupedByCategory,
        isLoading,
        isGenerating,
        fetchShoppingList,
        generateShoppingList,
        markAsBought,
        deleteItem,
        completeShopping,
    } = useShoppingListStore();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadShoppingList();
    }, []);

    const loadShoppingList = async () => {
        try {
            await fetchShoppingList();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadShoppingList();
        setRefreshing(false);
    };

    const handleGenerate = async () => {
        try {
            await generateShoppingList();
            showToast({
                message: t('SUCCESS.SHOPPING_LIST_GENERATED'),
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

    const handleToggleBought = async (itemId: string, isBought: boolean) => {
        try {
            await markAsBought(itemId, { isBought: !isBought });
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const handleDelete = (itemId: string, productName: string) => {
        Alert.alert(
            t('CONFIRM_DELETE'),
            t('CONFIRM_DELETE_SHOPPING_ITEM', { name: productName }),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.DELETE'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteItem(itemId);
                            showToast({
                                message: t('SUCCESS.ITEM_DELETED'),
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

    const handleCompleteShopping = () => {
        const boughtCount = items.filter((i) => i.isBought).length;

        if (boughtCount === 0) {
            showToast({
                message: t('SHOPPING_LIST.NO_BOUGHT_ITEMS'),
                type: 'warning',
            });
            return;
        }

        Alert.alert(
            t('SHOPPING_LIST.COMPLETE_TITLE'),
            t('SHOPPING_LIST.COMPLETE_CONFIRM', { count: boughtCount }),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.COMPLETE'),
                    onPress: async () => {
                        try {
                            await completeShopping();
                            showToast({
                                message: t('SUCCESS.SHOPPING_COMPLETED'),
                                type: 'success',
                                icon: 'checkmark-circle',
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

    const getUnitLabel = (unit: Unit) => {
        switch (unit) {
            case Unit.G:
                return t('UNITS.G');
            case Unit.ML:
                return t('UNITS.ML');
            case Unit.PCS:
                return t('UNITS.PCS');
            default:
                return '';
        }
    };

    if (isLoading && items.length === 0) {
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
                {summary && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                {t('SHOPPING_LIST.TOTAL_ITEMS')}
                            </Text>
                            <Text style={styles.summaryValue}>{summary.totalItems}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                {t('SHOPPING_LIST.BOUGHT')}
                            </Text>
                            <Text style={[styles.summaryValue, { color: Colors.primary }]}>
                                {summary.boughtItems}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                {t('SHOPPING_LIST.ESTIMATED_COST')}
                            </Text>
                            <Text style={styles.summaryValue}>
                                {summary.estimatedCost} ₴
                            </Text>
                        </View>
                    </View>
                )}

                {items.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="cart-outline"
                            size={64}
                            color={Colors.textGray}
                        />
                        <Text style={styles.emptyTitle}>
                            {t('SHOPPING_LIST.EMPTY_TITLE')}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {t('SHOPPING_LIST.EMPTY_SUBTITLE')}
                        </Text>
                        <PrimaryButton
                            title={t('SHOPPING_LIST.GENERATE')}
                            onPress={handleGenerate}
                            loading={isGenerating}
                            style={{ marginTop: 24, maxWidth: 300 }}
                        />
                    </View>
                ) : (
                    <>
                        {Object.entries(groupedByCategory).map(
                            ([category, categoryItems]) => (
                                <View key={category} style={styles.categorySection}>
                                    <Text style={styles.categoryTitle}>
                                        {category || t('OTHER')} ({categoryItems.length})
                                    </Text>

                                    {categoryItems.map((item) => (
                                        <ShoppingItemCard
                                            key={item.id}
                                            item={item}
                                            onToggleBought={() =>
                                                handleToggleBought(item.id, item.isBought)
                                            }
                                            onDelete={() =>
                                                handleDelete(item.id, item.product.name)
                                            }
                                            getUnitLabel={getUnitLabel}
                                        />
                                    ))}
                                </View>
                            )
                        )}

                        <View style={styles.actionsContainer}>
                            <PrimaryButton
                                title={t('SHOPPING_LIST.COMPLETE')}
                                onPress={handleCompleteShopping}
                                disabled={items.filter((i) => i.isBought).length === 0}
                            />
                            <PrimaryButton
                                title={t('SHOPPING_LIST.REGENERATE')}
                                onPress={handleGenerate}
                                loading={isGenerating}
                                style={{ backgroundColor: Colors.secondary }}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

interface ShoppingItemCardProps {
    item: ShoppingListItemType;
    onToggleBought: () => void;
    onDelete: () => void;
    getUnitLabel: (unit: Unit) => string;
}

const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({
                                                               item,
                                                               onToggleBought,
                                                               onDelete,
                                                               getUnitLabel,
                                                           }) => {
    return (
        <View style={[styles.itemCard, item.isBought && styles.itemCardBought]}>
            <TouchableOpacity
                style={styles.itemContent}
                onPress={onToggleBought}
                activeOpacity={0.7}
            >
                <View
                    style={[
                        styles.checkbox,
                        item.isBought && styles.checkboxChecked,
                    ]}
                >
                    {item.isBought && (
                        <Ionicons name="checkmark" size={16} color={Colors.white} />
                    )}
                </View>

                {item.product.image ? (
                    <Image
                        source={{ uri: item.product.image }}
                        style={styles.productImage}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons
                            name="nutrition-outline"
                            size={20}
                            color={Colors.primary}
                        />
                    </View>
                )}

                <View style={styles.itemInfo}>
                    <Text
                        style={[
                            styles.itemName,
                            item.isBought && styles.itemNameBought,
                        ]}
                    >
                        {item.product.name}
                    </Text>
                    <Text style={styles.itemQuantity}>
                        {item.quantity} {getUnitLabel(item.product.baseUnit)}
                    </Text>
                    {item.estimatedPrice && (
                        <Text style={styles.itemPrice}>
                            ≈ {item.estimatedPrice} ₴
                        </Text>
                    )}
                </View>

                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
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
    summaryCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.textGray,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
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
    categorySection: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 12,
    },
    itemCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    itemCardBought: {
        backgroundColor: Colors.inputBackground,
        opacity: 0.7,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    productImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
    },
    placeholderImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: Colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 4,
    },
    itemNameBought: {
        textDecorationLine: 'line-through',
        color: Colors.textGray,
    },
    itemQuantity: {
        fontSize: 14,
        color: Colors.textGray,
    },
    itemPrice: {
        fontSize: 12,
        color: Colors.primary,
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
    },
    actionsContainer: {
        marginTop: 24,
        gap: 12,
    },
});