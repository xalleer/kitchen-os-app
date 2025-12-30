import React, { memo } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    View,
    StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

interface StepLayoutProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const StepLayoutComponent = ({ children, footer }: StepLayoutProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={[
                                styles.scrollContent,
                                {
                                    paddingTop: insets.top + 20,
                                    paddingBottom: Math.max(insets.bottom, 20)
                                }
                            ]}
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {children}

                            <View style={styles.spacer} />

                            {footer && (
                                <View style={styles.footerContainer}>
                                    {footer}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    keyboardView: {
        flex: 1
    },
    innerContainer: {
        flex: 1
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24
    },
    scrollContent: {
        flexGrow: 1
    },
    spacer: {
        flex: 1,
        minHeight: 10
    },
    footerContainer: {
        marginTop: 10
    }
});

export const StepLayout = memo(StepLayoutComponent);