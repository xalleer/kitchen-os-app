import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { Modal } from '@/components/ui/Modal';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/ToastProvider';
import { useInventoryStore } from '@/store/inventoryStore';
import { InventoryItem } from '@/types/inventory';
import { Unit } from '@/types/enums';

interface EditInventoryModalProps {
    visible: boolean;
    onClose: () => void;
    item: InventoryItem | null;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
                                                                          visible,
                                                                          onClose,
                                                                          item,
                                                                      }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const { updateItem } = useInventoryStore();

    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible && item) {
            setQuantity(item.quantity.toString());
            setExpiryDate(
                item.expiryDate
                    ? new Date(item.expiryDate).toISOString().split('T')[0]
                    : ''
            );
        } else {
            setQuantity('');
            setExpiryDate('');
        }
    }, [visible, item]);

    const handleUpdate = async () => {
        if (!item || !quantity) {
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
            await updateItem(item.id, {
                quantity: quantityNum,
                expiryDate: expiryDate || undefined,
            });

            showToast({
                message: t('SUCCESS.ITEM_UPDATED'),
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

    if (!item) return null;

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            animationType="slide"
            fullScreen
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('EDIT_ITEM')}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={30} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.productCard}>
                        <Text style={styles.productName}>{item.product.name}</Text>
                        {item.product.category && (
                            <Text style={styles.productCategory}>
                                {item.product.category}
                            </Text>
                        )}
                    </View>

                    <Text style={styles.label}>
                        {t('QUANTITY')} ({getUnitLabel(item.product.baseUnit)}) *
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
                    <ThemeInput
                        placeholder="YYYY-MM-DD"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                    />
                    <Text style={styles.hint}>{t('EXPIRY_DATE_FORMAT')}</Text>
                </ScrollView>

                <View style={styles.footer}>
                    <PrimaryButton
                        title={t('BUTTONS.SAVE')}
                        onPress={handleUpdate}
                        loading={isSubmitting}
                        disabled={isSubmitting || !quantity}
                    />
                </View>
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
    productCard: {
        backgroundColor: Colors.lightGreen,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    productName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 4,
    },
    productCategory: {
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
});