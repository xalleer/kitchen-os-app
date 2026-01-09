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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { useInventoryStore } from '@/store/inventoryStore';
import { useToast } from '@/components/ui/ToastProvider';
import { InventoryItem as InventoryItemType } from '@/types/inventory';
import { Unit } from '@/types/enums';

export default function FridgeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { items, grouped, total, isLoading, fetchInventory, deleteItem } = useInventoryStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            await fetchInventory();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadInventory();
        setRefreshing(false);
    };

    const handleDeleteItem = (itemId: string, productName: string) => {
        Alert.alert(
            t('CONFIRM_DELETE'),
            t('CONFIRM_DELETE_ITEM', { name: productName }),
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

    const isExpiringSoon = (expiryDate: string | null) => {
        if (!expiryDate) return false;
        const daysUntilExpiry = Math.ceil(
            (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 2 && daysUntilExpiry >= 0;
    };

    const isExpired = (expiryDate: string | null) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
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
                {total === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="pricetag-outline" size={64} color={Colors.textGray} />
                        <Text style={styles.emptyTitle}>{t('FRIDGE.EMPTY_TITLE')}</Text>
                        <Text style={styles.emptySubtitle}>{t('FRIDGE.EMPTY_SUBTITLE')}</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>
                                {t('FRIDGE.TOTAL_ITEMS')}: {total}
                            </Text>
                        </View>

                        {Object.entries(grouped).map(([category, categoryItems]) => (
                            <View key={category} style={styles.categorySection}>
                                <Text style={styles.categoryTitle}>
                                    {category || t('FRIDGE.OTHER')} ({categoryItems.length})
                                </Text>

                                {categoryItems.map((item) => (
                                    <InventoryItemCard
                                        key={item.id}
                                        item={item}
                                        onDelete={() => handleDeleteItem(item.id, item.product.name)}
                                        onEdit={() => router.push(`/inventory/${item.id}`)}
                                        getUnitLabel={getUnitLabel}
                                        isExpiringSoon={isExpiringSoon(item.expiryDate)}
                                        isExpired={isExpired(item.expiryDate)}
                                    />
                                ))}
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/inventory/add')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color={Colors.white} />
            </TouchableOpacity>
        </View>
    );
}

interface InventoryItemCardProps {
    item: InventoryItemType;
    onDelete: () => void;
    onEdit: () => void;
    getUnitLabel: (unit: Unit) => string;
    isExpiringSoon: boolean;
    isExpired: boolean;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
                                                                 item,
                                                                 onDelete,
                                                                 onEdit,
                                                                 getUnitLabel,
                                                                 isExpiringSoon,
                                                                 isExpired,
                                                             }) => {
    const { t } = useTranslation();

    return (
        <View style={[
            styles.itemCard,
            isExpired && styles.itemCardExpired,
            isExpiringSoon && styles.itemCardExpiring
        ]}>
            <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemQuantity}>
                        {item.quantity} {getUnitLabel(item.product.baseUnit)}
                    </Text>
                </View>

                <View style={styles.itemActions}>
                    <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                        <Ionicons name="create-outline" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            {item.expiryDate && (
                <View style={styles.expiryContainer}>
                    <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={isExpired ? Colors.danger : isExpiringSoon ? '#F39C12' : Colors.textGray}
                    />
                    <Text style={[
                        styles.expiryText,
                        isExpired && styles.expiryTextExpired,
                        isExpiringSoon && styles.expiryTextExpiring
                    ]}>
                        {isExpired
                            ? t('FRIDGE.EXPIRED')
                            : isExpiringSoon
                                ? t('FRIDGE.EXPIRING_SOON')
                                : t('FRIDGE.EXPIRES_ON', {
                                    date: new Date(item.expiryDate).toLocaleDateString()
                                })}
                    </Text>
                </View>
            )}
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
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
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
    itemCardExpired: {
        borderColor: Colors.danger,
        backgroundColor: '#FFEBEE',
    },
    itemCardExpiring: {
        borderColor: '#F39C12',
        backgroundColor: '#FEF5E7',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    itemQuantity: {
        fontSize: 14,
        color: Colors.textGray,
    },
    itemActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
    },
    expiryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBackground,
        gap: 6,
    },
    expiryText: {
        fontSize: 12,
        color: Colors.textGray,
    },
    expiryTextExpired: {
        color: Colors.danger,
        fontWeight: '600',
    },
    expiryTextExpiring: {
        color: '#F39C12',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});