import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const ThemeInput: React.FC<TextInputProps> = (props) => {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textGray}
            {...props}
        />
    );
};

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