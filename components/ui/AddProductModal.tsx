import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {BarCodeScanner} from "expo-barcode-scanner";

const Colors = {
    primary: '#2ECC71',
    secondary: '#2C3E50',
    textGray: '#7F8C8D',
    background: '#FFFFFF',
    inputBackground: '#F8F9F9',
    inputBorder: '#E5E8E8',
    white: '#FFFFFF',
    danger: '#E74C3C',
};

const ThemeInput = ({ label, value, onChangeText, placeholder, ...props }) => (
    <View style={{ marginBottom: 16 }}>
        {label && <Text style={styles.label}>{label}</Text>}
        <input
            style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: `1.5px solid ${Colors.inputBorder}`,
                borderRadius: '12px',
                backgroundColor: Colors.inputBackground,
                fontFamily: 'inherit',
            }}
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder}
            {...props}
        />
    </View>
);

const PrimaryButton = ({ title, onPress, loading, disabled }) => (
    <button
        onClick={onPress}
        disabled={disabled || loading}
        style={{
            width: '100%',
            padding: '18px',
            backgroundColor: disabled ? Colors.inputBorder : Colors.primary,
            color: Colors.white,
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        }}
    >
        {loading ? <ActivityIndicator color={Colors.white} /> : title}
    </button>
);

export default function AddProductModal({ visible, onClose, onAdd }) {
    const [mode, setMode] = useState('manual'); // 'manual' or 'barcode'
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('шт');
    const [expirationDate, setExpirationDate] = useState('');
    const [barcode, setBarcode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const units = ['шт', 'кг', 'г', 'л', 'мл', 'упак'];

    const handleScanBarcode = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Помилка', 'Потрібен доступ до камери');
            return;
        }
        setIsScanning(true);
        // TODO: Implement barcode scanner using expo-barcode-scanner
        setTimeout(() => {
            const mockBarcode = '1234567890123';
            setBarcode(mockBarcode);
            handleBarcodeScanned(mockBarcode);
            setIsScanning(false);
        }, 2000);
    };

    const handleBarcodeScanned = async (scannedBarcode) => {
        setIsLoading(true);
        try {
            // TODO: Call API to find product by barcode
            // const product = await inventoryService.findProductByBarcode(scannedBarcode);

            // Mock response
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
            Alert.alert('Помилка', 'Продукт не знайдено за штрих-кодом');
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

            // Reset form
            setProductName('');
            setQuantity('1');
            setUnit('шт');
            setExpirationDate('');
            setBarcode('');

            onClose();
        } catch (error) {
            Alert.alert('Помилка', error.message || 'Не вдалося додати продукт');
        } finally {
            setIsLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: Colors.white,
                borderRadius: '24px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: `1px solid ${Colors.inputBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: Colors.secondary }}>
                        Додати продукт
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '28px',
                            cursor: 'pointer',
                            color: Colors.secondary
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Mode selector */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '20px',
                    borderBottom: `1px solid ${Colors.inputBorder}`
                }}>
                    <button
                        onClick={() => setMode('manual')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: `2px solid ${mode === 'manual' ? Colors.primary : Colors.inputBorder}`,
                            borderRadius: '12px',
                            backgroundColor: mode === 'manual' ? `${Colors.primary}20` : Colors.white,
                            color: Colors.secondary,
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        ✍️ Вручну
                    </button>
                    <button
                        onClick={() => setMode('barcode')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: `2px solid ${mode === 'barcode' ? Colors.primary : Colors.inputBorder}`,
                            borderRadius: '12px',
                            backgroundColor: mode === 'barcode' ? `${Colors.primary}20` : Colors.white,
                            color: Colors.secondary,
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        📷 Штрих-код
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {mode === 'barcode' && (
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={handleScanBarcode}
                                disabled={isScanning}
                                style={{
                                    width: '100%',
                                    padding: '60px 20px',
                                    border: `2px dashed ${Colors.primary}`,
                                    borderRadius: '16px',
                                    backgroundColor: `${Colors.primary}10`,
                                    color: Colors.primary,
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: isScanning ? 'wait' : 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                {isScanning ? (
                                    <>
                                        <ActivityIndicator color={Colors.primary} />
                                        <span>Сканування...</span>
                                    </>
                                ) : (
                                    <>
                                        <span style={{ fontSize: '48px' }}>📷</span>
                                        <span>Натисніть для сканування</span>
                                    </>
                                )}
                            </button>
                            {barcode && (
                                <p style={{ textAlign: 'center', color: Colors.textGray, marginTop: '8px' }}>
                                    Штрих-код: {barcode}
                                </p>
                            )}
                        </div>
                    )}

                    <ThemeInput
                        label="Назва продукту"
                        value={productName}
                        onChangeText={setProductName}
                        placeholder="Наприклад: Молоко"
                    />

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 2 }}>
                            <Text style={styles.label}>Кількість</Text>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="1"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `1.5px solid ${Colors.inputBorder}`,
                                    borderRadius: '12px',
                                    backgroundColor: Colors.inputBackground,
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text style={styles.label}>Одиниці</Text>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `1.5px solid ${Colors.inputBorder}`,
                                    borderRadius: '12px',
                                    backgroundColor: Colors.inputBackground,
                                }}
                            >
                                {units.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <ThemeInput
                        label="Термін придатності (опціонально)"
                        type="date"
                        value={expirationDate}
                        onChangeText={setExpirationDate}
                    />
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px',
                    borderTop: `1px solid ${Colors.inputBorder}`
                }}>
                    <PrimaryButton
                        title="Додати в холодильник"
                        onPress={handleAdd}
                        loading={isLoading}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

const styles = {
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: '8px',
        display: 'block'
    }
};