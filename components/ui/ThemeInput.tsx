import React, { forwardRef, useState } from 'react';
import {
    TextInput,
    TextInputProps,
    StyleSheet,
    View,
    Text,
    Animated
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface EnhancedInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const ThemeInputComponent = forwardRef<TextInput, EnhancedInputProps>((props, ref) => {
    const { label, error, leftIcon, rightIcon, onFocus, onBlur, ...rest } = props;
    const [isFocused, setIsFocused] = useState(false);

    // Обробка фокусу для зміни стилів
    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputWrapper,
                isFocused && styles.inputFocused,
                error ? styles.inputError : null
            ]}>
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

                <TextInput
                    ref={ref}
                    style={styles.input}
                    placeholderTextColor={Colors.textGray || '#999'}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...rest}
                />

                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
});

ThemeInputComponent.displayName = 'ThemeInput';

export const ThemeInput = ThemeInputComponent;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground || '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.inputBorder || 'transparent',
        paddingHorizontal: 16,
        // Легка тінь для глибини (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Тінь для Android
        elevation: 2,
    },
    inputFocused: {
        borderColor: Colors.primary || '#007AFF', // Колір акценту при фокусі
        backgroundColor: '#FFF',
    },
    inputError: {
        borderColor: '#FF3B30', // Колір помилки
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.secondary || '#333',
    },
    iconLeft: {
        marginRight: 12,
    },
    iconRight: {
        marginLeft: 12,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});