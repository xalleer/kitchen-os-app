import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { Modal } from '@/components/ui/Modal';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import productService, { Product } from '@/services/product.service';
import { useInventoryStore } from '@/store/inventoryStore';
import { Unit } from '@/types/enums';

import DateTimePickerModal from "react-native-modal-datetime-picker";

interface AddInventoryModalProps {
    visible: boolean;
    onClose: () => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
                                                                        visible,
                                                                        onClose,
                                                                    }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const { addItem } = useInventoryStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            loadProducts();
        } else {
            setSearchQuery('');
            setSelectedProduct(null);
            setQuantity('');
            setExpiryDate(null);
            setDatePickerVisibility(false);
        }
    }, [visible]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const delayDebounceFn = setTimeout(() => {
                loadProducts(searchQuery);
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            loadProducts();
        }
    }, [searchQuery]);

    const loadProducts = async (search?: string) => {
        setIsLoadingProducts(true);
        try {
            const data = await productService.getProducts({
                search,
                limit: 20,
            });
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };


    const handleConfirmDate = (date: Date) => {
        setExpiryDate(date);
        hideDatePicker();
    };

    const handleAddToInventory = async () => {
        if (!selectedProduct || !quantity) {
            showToast({
                message: t('ERRORS.FILL_REQUIRED_FIELDS'),
                type: 'warning',
            });
            return;
        }

        const quantityNum = parseFloat(quantity);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            showToast({
                message: t('ERRORS.INVALID_QUANTITY'),
                type: 'warning',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await addItem({
                productId: selectedProduct.id,
                quantity: quantityNum,
                expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : undefined,
            });

            showToast({
                message: t('SUCCESS.ITEM_ADDED'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            onClose();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
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

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            animationType="slide"
            fullScreen
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('ADD_TO_INVENTORY')}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={30} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {!selectedProduct ? (
                        <>
                            <Text style={styles.sectionTitle}>{t('SELECT_PRODUCT')}</Text>

                            <View style={styles.searchContainer}>
                                <Ionicons
                                    name="search"
                                    size={20}
                                    color={Colors.textGray}
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder={t('SEARCH_PRODUCTS')}
                                    placeholderTextColor={Colors.textGray}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            {isLoadingProducts ? (
                                <ActivityIndicator
                                    size="large"
                                    color={Colors.primary}
                                    style={styles.loader}
                                />
                            ) : (
                                <View style={styles.productList}>
                                    {products.map((product) => (
                                        <TouchableOpacity
                                            key={product.id}
                                            style={styles.productCard}
                                            onPress={() => handleSelectProduct(product)}
                                        >
                                            {product.image ? (
                                                <Image
                                                    source={{ uri: product.image }}
                                                    style={styles.searchProductImage}
                                                />
                                            ) : (
                                                <View style={styles.searchProductPlaceholder}>
                                                    <Ionicons name="fast-food-outline" size={20} color={Colors.textGray} />
                                                </View>
                                            )}
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productName}>
                                                    {product.name}
                                                </Text>
                                                {product.category && (
                                                    <Text style={styles.productCategory}>
                                                        {product.category}
                                                    </Text>
                                                )}
                                            </View>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={20}
                                                color={Colors.textGray}
                                            />
                                        </TouchableOpacity>
                                    ))}

                                    {products.length === 0 && !isLoadingProducts && (
                                        <View style={styles.emptyState}>
                                            <Text style={styles.emptyText}>
                                                {t('NO_PRODUCTS_FOUND')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => setSelectedProduct(null)}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={20}
                                    color={Colors.primary}
                                />
                                <Text style={styles.backText}>{t('CHANGE_PRODUCT')}</Text>
                            </TouchableOpacity>

                            <View style={styles.selectedProductCard}>
                                {selectedProduct.image ? (
                                    <Image
                                        source={{ uri: selectedProduct.image }}
                                        style={styles.searchProductImage}
                                    />
                                ) : (
                                    <View style={styles.searchProductPlaceholder}>
                                        <Ionicons name="fast-food-outline" size={20} color={Colors.textGray} />
                                    </View>
                                )}
                                <View>
                                    <Text style={styles.selectedProductName}>
                                        {selectedProduct.name}
                                    </Text>
                                    {selectedProduct.category && (
                                        <Text style={styles.selectedProductCategory}>
                                            {selectedProduct.category}
                                        </Text>
                                    )}
                                </View>

                            </View>

                            <Text style={styles.label}>
                                {t('QUANTITY')} ({getUnitLabel(selectedProduct.baseUnit)}) *
                            </Text>
                            <ThemeInput
                                keyboardType="numeric"
                                placeholder="0"
                                value={quantity}
                                onChangeText={setQuantity}
                            />

                            <Text style={styles.label}>
                                {t('EXPIRY_DATE')} ({t('OPTIONAL')})
                            </Text>
                            <TouchableOpacity
                                onPress={showDatePicker}
                                activeOpacity={0.7}
                                style={styles.datePickerButton}
                            >
                                <Text style={[
                                    styles.dateText,
                                    !expiryDate && styles.placeholderText
                                ]}>
                                    {expiryDate
                                        ? expiryDate.toLocaleDateString()
                                        : 'YYYY-MM-DD'}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color={Colors.textGray} />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirmDate}
                                onCancel={hideDatePicker}
                                minimumDate={new Date()}
                            />
                        </>
                    )}
                </ScrollView>

                {selectedProduct && (
                    <View style={styles.footer}>
                        <PrimaryButton
                            title={t('BUTTONS.ADD')}
                            onPress={handleAddToInventory}
                            loading={isSubmitting}
                            disabled={isSubmitting || !quantity}
                        />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: Colors.secondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: Colors.secondary,
    },
    loader: {
        marginTop: 40,
    },
    productList: {
        gap: 8,
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 12,
        color: Colors.textGray,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    backText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
    },
    selectedProductCard: {
        backgroundColor: Colors.lightGreen,
        padding: 16,
        flexDirection: 'row',
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    selectedProductName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 4,
    },
    selectedProductCategory: {
        fontSize: 14,
        color: Colors.textGray,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    hint: {
        fontSize: 12,
        color: Colors.textGray,
        marginTop: -8,
        marginBottom: 16,
        marginLeft: 4,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
    datePickerButton: {
        height: 56,
        backgroundColor: Colors.inputBackground,
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        marginBottom: 24,
    },
    dateText: {
        fontSize: 16,
        color: Colors.secondary,
    },
    placeholderText: {
        color: Colors.textGray,
    },
    searchProductImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: Colors.inputBackground,
    },
    searchProductPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: Colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
});