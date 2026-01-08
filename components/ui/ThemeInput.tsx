import React, { forwardRef, useState, useRef } from 'react';
import {
    TextInput,
    TextInputProps,
    StyleSheet,
    View,
    Text,
    Animated,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface EnhancedInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const ThemeInputComponent = forwardRef<TextInput, EnhancedInputProps>((props, ref) => {
    const { label, error, leftIcon, rightIcon, onFocus, onBlur, secureTextEntry, ...rest } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const focusAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = (e: any) => {
        setIsFocused(true);
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        if (onBlur) onBlur(e);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const showPasswordToggle = secureTextEntry && !rightIcon;
    const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.wrapperContainer}>
                <View style={[
                    styles.inputWrapper,
                    error ? { borderColor: '#FF3B30' } : null
                ]}>
                    {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                    <TextInput
                        ref={ref}
                        style={styles.input}
                        placeholderTextColor={Colors.textGray || '#999'}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        secureTextEntry={actualSecureTextEntry}
                        underlineColorAndroid="transparent"
                        {...rest}
                    />
                    {showPasswordToggle && (
                        <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={styles.iconRight}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color={Colors.textGray}
                            />
                        </TouchableOpacity>
                    )}
                    {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
                </View>

                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.focusBorder,
                        { opacity: focusAnim, borderColor: Colors.primary || '#007AFF' }
                    ]}
                />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
});

ThemeInputComponent.displayName = 'ThemeInput';
export const ThemeInput = ThemeInputComponent;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    wrapperContainer: {
        position: 'relative',
        minHeight: 56,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground || '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.inputBorder || '#E0E0E0',
        paddingHorizontal: 16,
        height: 56,
    },
    focusBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 12,
        borderWidth: 2,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: Colors.secondary || '#333',
        textAlignVertical: 'center',
        paddingVertical: Platform.OS === 'ios' ? 0 : 4,
    },
    iconLeft: {
        marginRight: 12
    },
    iconRight: {
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});