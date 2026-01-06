import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { FridgeItem as FridgeItemComponent } from "@/components/ui/FridgeItem";
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import inventoryService from '@/services/inventory.service';
import { FridgeItem } from '@/types/api';

export default function Fridge() {
    const [items, setItems] = useState<FridgeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

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

    const handleAddProduct = async (productData: any) => {
        try {
            const newItem = await inventoryService.addFridgeItem(productData);
            setItems(prev => [newItem, ...prev]);
            Alert.alert('Успіх', 'Продукт додано в холодильник');
        } catch (error: any) {
            throw error;
        }
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
                            Натисніть + щоб додати продукти
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

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowAddModal(true)}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>

            <AddProductModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddProduct}
            />
        </View>
    );
}

// Компонент модального вікна
function AddProductModal({ visible, onClose, onAdd }: any) {
    const [mode, setMode] = useState<'manual' | 'barcode'>('manual');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('шт');
    const [expirationDate, setExpirationDate] = useState('');
    const [barcode, setBarcode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const units = ['шт', 'кг', 'г', 'л', 'мл', 'упак'];

    const handleScanBarcode = async () => {
        setIsScanning(true);
        // TODO: Implement actual barcode scanner
        setTimeout(() => {
            const mockBarcode = '1234567890123';
            setBarcode(mockBarcode);
            handleBarcodeScanned(mockBarcode);
            setIsScanning(false);
        }, 2000);
    };

    const handleBarcodeScanned = async (scannedBarcode: string) => {
        setIsLoading(true);
        try {
            // TODO: Call API
            const mockProduct = {
                name: 'Молоко 2.5%',
                unit: 'л',
                defaultQuantity: 1
            };

            setProductName(mockProduct.name);
            setUnit(mockProduct.unit);
            setQuantity(String(mockProduct.defaultQuantity));

            Alert.alert('Успіх', `Знайдено: ${mockProduct.name}`);
        } catch (error) {
            Alert.alert('Помилка', 'Продукт не знайдено');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!productName.trim()) {
            Alert.alert('Помилка', 'Введіть назву продукту');
            return;
        }

        const quantityNum = parseFloat(quantity);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            Alert.alert('Помилка', 'Введіть коректну кількість');
            return;
        }

        setIsLoading(true);
        try {
            await onAdd({
                name: productName,
                quantity: quantityNum,
                unit,
                expirationDate: expirationDate || undefined
            });

            setProductName('');
            setQuantity('1');
            setUnit('шт');
            setExpirationDate('');
            setBarcode('');

            onClose();
        } catch (error: any) {
            Alert.alert('Помилка', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Додати продукт</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color={Colors.secondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.modeSelector}>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'manual' && styles.modeButtonActive]}
                        onPress={() => setMode('manual')}
                    >
                        <Text style={[styles.modeButtonText, mode === 'manual' && styles.modeButtonTextActive]}>
                            ✍️ Вручну
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'barcode' && styles.modeButtonActive]}
                        onPress={() => setMode('barcode')}
                    >
                        <Text style={[styles.modeButtonText, mode === 'barcode' && styles.modeButtonTextActive]}>
                            📷 Штрих-код
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    {mode === 'barcode' && (
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={handleScanBarcode}
                            disabled={isScanning}
                        >
                            {isScanning ? (
                                <>
                                    <ActivityIndicator color={Colors.primary} />
                                    <Text style={styles.scanButtonText}>Сканування...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="camera" size={48} color={Colors.primary} />
                                    <Text style={styles.scanButtonText}>Натисніть для сканування</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    <ThemeInput
                        label="Назва продукту"
                        value={productName}
                        onChangeText={setProductName}
                        placeholder="Наприклад: Молоко"
                    />

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 2 }}>
                            <ThemeInput
                                label="Кількість"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                placeholder="1"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Одиниці</Text>
                            <View style={styles.picker}>
                                {/* TODO: Use proper Picker component */}
                                <Text>{unit}</Text>
                            </View>
                        </View>
                    </View>

                    <ThemeInput
                        label="Термін придатності (опціонально)"
                        value={expirationDate}
                        onChangeText={setExpirationDate}
                        placeholder="YYYY-MM-DD"
                    />
                </ScrollView>

                <View style={styles.modalFooter}>
                    <PrimaryButton
                        title="Додати в холодильник"
                        onPress={handleAdd}
                        loading={isLoading}
                        disabled={isLoading}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
    },
    modeSelector: {
        flexDirection: 'row',
        gap: 12,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
    },
    modeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        alignItems: 'center',
    },
    modeButtonActive: {
        borderColor: Colors.primary,
        backgroundColor: `${Colors.primary}20`,
    },
    modeButtonText: {
        fontWeight: '600',
        color: Colors.secondary,
    },
    modeButtonTextActive: {
        color: Colors.primary,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    scanButton: {
        padding: 60,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.primary,
        borderRadius: 16,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 12,
    },
    scanButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 8,
    },
    picker: {
        padding: 14,
        borderWidth: 1.5,
        borderColor: Colors.inputBorder,
        borderRadius: 12,
        backgroundColor: Colors.inputBackground,
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    },
});