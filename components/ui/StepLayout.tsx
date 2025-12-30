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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={[
                                styles.scrollContent,
                                {
                                    paddingTop: 20,
                                    flexGrow: 1,
                                    paddingBottom: 20
                                }
                            ]}
                            bounces={true}
                            automaticallyAdjustKeyboardInsets={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                        >
                            {children}

                            {footer && <View style={{ height: 100 }} />}
                        </ScrollView>

                        {footer && (
                            <View style={[
                                styles.footerContainer,
                                {
                                    paddingBottom: Math.max(insets.bottom, 20),
                                }
                            ]}>
                                {footer}
                            </View>
                        )}
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
    footerContainer: {
        backgroundColor: Colors.background,
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    }
});

export const StepLayout = memo(StepLayoutComponent);