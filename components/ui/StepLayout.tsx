import React from 'react';
import {
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, ScrollView, View
} from 'react-native';
import { SharedStyles } from '@/constants/SharedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StepLayoutProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const StepLayout = ({ children, footer }: StepLayoutProps) => {
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: SharedStyles.containerMain.backgroundColor }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={SharedStyles.containerMain}
                        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 20 }}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                        <View style={{ flex: 1, minHeight: 10 }} />
                        {footer && (
                            <View style={{ paddingBottom: Math.max(insets.bottom, 20), marginTop: 10 }}>
                                {footer}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};