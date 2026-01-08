import React, { ReactNode } from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    transparent?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
                                                visible,
                                                onClose,
                                                title,
                                                children,
                                                transparent = true,
                                                animationType = 'fade',
                                                fullScreen = false
                                            }) => {
    // For fullscreen modals, render children directly without overlay
    if (fullScreen) {
        return (
            <RNModal
                visible={visible}
                animationType={animationType}
                presentationStyle="pageSheet"
                onRequestClose={onClose}
            >
                {children}
            </RNModal>
        );
    }

    // Standard centered modal
    return (
        <RNModal
            visible={visible}
            transparent={transparent}
            animationType={animationType}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {children}
                </View>
            </View>
        </RNModal>
    );
};

interface ModalActionsProps {
    onCancel?: () => void;
    onConfirm?: () => void;
    cancelText?: string;
    confirmText?: string;
    confirmDisabled?: boolean;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
                                                              onCancel,
                                                              onConfirm,
                                                              cancelText = 'Cancel',
                                                              confirmText = 'Confirm',
                                                              confirmDisabled = false
                                                          }) => {
    return (
        <View style={styles.actions}>
            {onCancel && (
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
            )}
            {onConfirm && (
                <TouchableOpacity
                    onPress={onConfirm}
                    style={[styles.confirmButton, confirmDisabled && styles.confirmButtonDisabled]}
                    disabled={confirmDisabled}
                >
                    <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: Colors.white,
        padding: 24,
        borderRadius: 24,
        maxHeight: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: Colors.secondary,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 16,
        gap: 16,
    },
    cancelButton: {
        padding: 10,
    },
    cancelText: {
        color: Colors.textGray,
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    confirmButtonDisabled: {
        backgroundColor: Colors.inputBorder,
        opacity: 0.7,
    },
    confirmText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
});