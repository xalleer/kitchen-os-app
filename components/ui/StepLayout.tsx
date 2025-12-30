import React from 'react';
import {
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, ScrollView, View
} from 'react-native';
import { SharedStyles } from '@/constants/SharedStyles';

interface StepLayoutProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const StepLayout = ({ children, footer }: StepLayoutProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={[SharedStyles.containerMain, { flexGrow: 1 }]}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                        <View style={{ flex: 1 }} />
                        {footer && <View style={{ paddingBottom: 30 }}>{footer}</View>}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};