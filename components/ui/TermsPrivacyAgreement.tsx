import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { Modal } from '@/components/ui/Modal';

interface TermsPrivacyAgreementProps {
    isChecked: boolean;
    onToggle: () => void;
}

export const TermsPrivacyAgreement: React.FC<TermsPrivacyAgreementProps> = ({
                                                                                isChecked,
                                                                                onToggle
                                                                            }) => {
    const { t } = useTranslation();
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {t('I_AGREE_TO')}{' '}
                        <Text
                            style={styles.link}
                            onPress={(e) => {
                                e.stopPropagation();
                                setShowTermsModal(true);
                            }}
                        >
                            {t('TERMS_OF_USE')}
                        </Text>
                        {' '}{t('AND')}{' '}
                        <Text
                            style={styles.link}
                            onPress={(e) => {
                                e.stopPropagation();
                                setShowPrivacyModal(true);
                            }}
                        >
                            {t('PRIVACY_POLICY')}
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Terms of Use Modal */}
            <Modal
                visible={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title={t('TERMS_OF_USE')}
                animationType="slide"
            >
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
                    <Text style={styles.modalTitle}>{t('TERMS_OF_USE')}</Text>
                    <Text style={styles.modalDate}>Last updated: January 2026</Text>

                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>
                        By accessing and using Kitchen OS, you accept and agree to be bound by the terms and provision of this agreement.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Use License</Text>
                    <Text style={styles.paragraph}>
                        Permission is granted to temporarily use Kitchen OS for personal, non-commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
                    </Text>

                    <Text style={styles.sectionTitle}>3. User Account</Text>
                    <Text style={styles.paragraph}>
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                    </Text>

                    <Text style={styles.sectionTitle}>4. User Data</Text>
                    <Text style={styles.paragraph}>
                        You retain all rights to your data. We collect and use your data in accordance with our Privacy Policy to provide and improve our services.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Prohibited Uses</Text>
                    <Text style={styles.paragraph}>
                        You may not use Kitchen OS for any illegal or unauthorized purpose. You must not transmit any worms, viruses, or code of a destructive nature.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Service Modifications</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you for any modification, suspension, or discontinuance.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>
                        Kitchen OS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Contact</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about these Terms, please contact us at support@kitchen-os.com
                    </Text>
                </ScrollView>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowTermsModal(false)}
                >
                    <Text style={styles.closeButtonText}>{t('BUTTONS.CLOSE')}</Text>
                </TouchableOpacity>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal
                visible={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                title={t('PRIVACY_POLICY')}
                animationType="slide"
            >
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
                    <Text style={styles.modalTitle}>{t('PRIVACY_POLICY')}</Text>
                    <Text style={styles.modalDate}>Last updated: January 2026</Text>

                    <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        We collect information you provide directly to us, including your name, email address, dietary preferences, family member information, and meal planning data.
                    </Text>

                    <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                    <Text style={styles.paragraph}>
                        We use the information we collect to provide, maintain, and improve our services, to generate personalized meal plans, manage your family preferences, and communicate with you.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Data Security</Text>
                    <Text style={styles.paragraph}>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Data Sharing</Text>
                    <Text style={styles.paragraph}>
                        We do not sell your personal information. We may share your information with service providers who assist us in operating our service, conducting our business, or serving our users.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Your Rights</Text>
                    <Text style={styles.paragraph}>
                        You have the right to access, correct, or delete your personal data. You can also object to processing, request data portability, and withdraw consent at any time.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Data Retention</Text>
                    <Text style={styles.paragraph}>
                        We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
                    <Text style={styles.paragraph}>
                        Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Changes to Privacy Policy</Text>
                    <Text style={styles.paragraph}>
                        We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have questions about this Privacy Policy, please contact us at privacy@kitchen-os.com
                    </Text>
                </ScrollView>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowPrivacyModal(false)}
                >
                    <Text style={styles.closeButtonText}>{t('BUTTONS.CLOSE')}</Text>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        color: Colors.secondary,
        lineHeight: 20,
    },
    link: {
        color: Colors.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    modalScroll: {
        maxHeight: 500,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    modalDate: {
        fontSize: 12,
        color: Colors.textGray,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: Colors.secondary,
        lineHeight: 22,
        marginBottom: 12,
    },
    closeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});