import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const ThemeInputComponent = forwardRef<TextInput, TextInputProps>((props, ref) => {
    return (
        <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={Colors.textGray}
            {...props}
        />
    );
});

ThemeInputComponent.displayName = 'ThemeInput';

export const ThemeInput = ThemeInputComponent;

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        padding: 18,
        fontSize: 16,
        color: Colors.secondary,
        marginBottom: 16,
        width: '100%',
    },
});