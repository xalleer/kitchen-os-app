import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

interface ThemedStatusBarProps {
    style?: 'light' | 'dark' | 'auto';
    backgroundColor?: string;
}


export const ThemedStatusBar: React.FC<ThemedStatusBarProps> = ({
                                                                    style = 'dark',
                                                                    backgroundColor = 'transparent'
                                                                }) => {
    const colorScheme = useColorScheme();

    return (
        <StatusBar
            style={style}
            backgroundColor={backgroundColor}
            translucent
        />
    );
};

export const LightStatusBar = () => <ThemedStatusBar style="light" />;
export const DarkStatusBar = () => <ThemedStatusBar style="dark" />;
export const AutoStatusBar = () => <ThemedStatusBar style="auto" />;