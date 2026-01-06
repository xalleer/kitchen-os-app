import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { FridgeItem as FridgeItemComponent } from "@/components/ui/FridgeItem";
import inventoryService from '@/services/inventory.service';
import { FridgeItem } from '@/types/api';

export default function Fridge() {
    const [items, setItems] = useState<FridgeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadItems = useCallback(async (showRefreshControl = false) => {
        try {
            if (showRefreshControl) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const data = await inventoryService.getFridgeItems();
            setItems(data);
        } catch (error: any) {
            console.error('Error loading fridge items:', error);
            Alert.alert('Помилка', error.message || 'Не вдалося завантажити продукти');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const onRefresh = useCallback(() => {
        loadItems(true);
    }, [loadItems]);

    const handleDeleteItem = useCallback(async (itemId: string) => {
        Alert.alert(
            'Видалити продукт?',
            'Ви впевнені, що хочете видалити цей продукт?',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Видалити',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await inventoryService.removeFridgeItem(itemId);
                            setItems(prev => prev.filter(item => item.id !== itemId));
                            Alert.alert('Успіх', 'Продукт видалено');
                        } catch (error: any) {
                            Alert.alert('Помилка', error.message || 'Не вдалося видалити продукт');
                        }
                    }
                }
            ]
        );
    }, []);

    const handleScanWithAI = () => {
        // TODO: Implement AI scanning
        Alert.alert(
            'AI Scan',
            'Функція AI сканування буде доступна незабаром!',
            [{ text: 'OK' }]
        );
    };

    const formatItemForComponent = (item: FridgeItem) => {
        const daysUntilExpiration = item.expirationDate
            ? Math.ceil((new Date(item.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

        let status = 'FRESH';
        let freshness = 100;

        if (daysUntilExpiration !== null) {
            if (daysUntilExpiration <= 0) {
                status = 'EXPIRED';
                freshness = 0;
            } else if (daysUntilExpiration <= 1) {
                status = 'LOW';
                freshness = 10;
            } else if (daysUntilExpiration <= 3) {
                status = 'OKAY';
                freshness = 50;
            } else {
                freshness = Math.min(100, Math.round((daysUntilExpiration / 7) * 100));
            }
        }

        return {
            id: item.id,
            name: item.product?.name || item.customName || 'Невідомий продукт',
            exp: daysUntilExpiration !== null
                ? daysUntilExpiration === 0
                    ? 'Сьогодні'
                    : daysUntilExpiration === 1
                        ? '1 День'
                        : `${daysUntilExpiration} Днів`
                : 'Немає даних',
            status,
            freshness: String(freshness),
            amount: `${item.quantity} ${item.unit}`,
            image: item.product?.imageUrl || 'https://via.placeholder.com/150',
            onDelete: () => handleDeleteItem(item.id),
        };
    };

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
            <View style={SharedStyles.containerMain}>
                {items.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="leaf-outline" size={60} color={Colors.inputBorder} />
                        <Text style={{ color: Colors.textGray, marginTop: 10 }}>
                            Холодильник порожній
                        </Text>
                        <Text style={{ color: Colors.textGray, marginTop: 5, fontSize: 12 }}>
                            Натисніть "AI Scan" щоб додати продукти
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                        }
                        renderItem={({ item }) => (
                            <FridgeItemComponent item={formatItemForComponent(item)} />
                        )}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.fab} onPress={handleScanWithAI}>
                <Ionicons name="camera" size={28} color="white" />
                <Text style={styles.fabText}>AI Scan</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    fabText: {
        color: 'white',
        fontWeight: '700',
        marginLeft: 10,
        fontSize: 16
    }
});