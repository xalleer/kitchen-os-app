import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
    message: string;
    type?: ToastType;
    duration?: number;
    icon?: keyof typeof Ionicons.glyphMap;
}

interface ToastContextValue {
    showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

const TOAST_COLORS: Record<ToastType, { bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
    success: {
        bg: '#2ECC71',
        icon: 'checkmark-circle',
    },
    error: {
        bg: '#E74C3C',
        icon: 'close-circle',
    },
    warning: {
        bg: '#F39C12',
        icon: 'warning',
    },
    info: {
        bg: '#3498DB',
        icon: 'information-circle',
    },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<(ToastConfig & { id: string; opacity: Animated.Value })[]>([]);

    const showToast = useCallback((config: ToastConfig) => {
        const id = Date.now().toString();
        const opacity = new Animated.Value(0);

        setToasts((prev) => [...prev, { ...config, id, opacity }]);

        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(config.duration || 3000),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        });
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={styles.container} pointerEvents="box-none">
                {toasts.map((toast) => {
                    const type = toast.type || 'info';
                    const colors = TOAST_COLORS[type];
                    const iconName = toast.icon || colors.icon;

                    return (
                        <Animated.View
                            key={toast.id}
                            style={[
                                styles.toast,
                                { backgroundColor: colors.bg, opacity: toast.opacity },
                            ]}
                        >
                            <Ionicons name={iconName} size={24} color="#FFF" style={styles.icon} />
                            <Text style={styles.message} numberOfLines={2}>
                                {toast.message}
                            </Text>
                        </Animated.View>
                    );
                })}
            </View>
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: 20,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 10,
        minWidth: Dimensions.get('window').width - 40,
        maxWidth: Dimensions.get('window').width - 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    icon: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },
});