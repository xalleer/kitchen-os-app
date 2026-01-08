import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useOnboardingStore } from '@/store/onboardingStore';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { StepHeader } from '@/components/navigation/StepHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { Modal, ModalActions } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { MemberCard } from '@/components/ui/MemberCard';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import dictionaryService from '@/services/dictionary.service';
import { Allergy } from '@/types/dictionaries';
import { Gender } from '@/types/enums';

type EditingTarget = { type: 'owner' } | { type: 'member'; index: number } | null;

export default function Step4() {
    const router = useRouter();
    const { t } = useTranslation();

    const {
        ownerProfile,
        updateOwnerProfile,
        familyMembers,
        addFamilyMember,
        removeFamilyMember,
        updateFamilyMember,
    } = useOnboardingStore();

    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);
    const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    useEffect(() => {
        dictionaryService
            .getAllergies()
            .then(setAllergies)
            .catch(console.error)
            .finally(() => setIsLoadingAllergies(false));
    }, []);

    const handleAddMember = () => {
        if (!newMemberName.trim()) return;
        addFamilyMember({
            name: newMemberName,
            gender: Gender.UNSPECIFIED,
            eatsBreakfast: true,
            eatsLunch: true,
            eatsDinner: true,
            eatsSnack: false,
            allergyIds: [],
        });
        setNewMemberName('');
        setIsAddMemberModalVisible(false);
    };

    const getCurrentData = () => {
        if (!editingTarget) return null;
        if (editingTarget.type === 'owner') return ownerProfile;
        return familyMembers[editingTarget.index];
    };

    const updateCurrentData = (data: any) => {
        if (!editingTarget) return;
        if (editingTarget.type === 'owner') {
            updateOwnerProfile(data);
        } else {
            updateFamilyMember(editingTarget.index, data);
        }
    };

    const toggleAllergy = (allergyId: string) => {
        const current = getCurrentData()?.allergyIds || [];
        const updated = current.includes(allergyId)
            ? current.filter((id) => id !== allergyId)
            : [...current, allergyId];
        updateCurrentData({ allergyIds: updated });
    };

    const toggleMeal = (mealKey: 'eatsBreakfast' | 'eatsLunch' | 'eatsDinner' | 'eatsSnack') => {
        const currentData = getCurrentData();
        if (!currentData) return;
        updateCurrentData({ [mealKey]: !currentData[mealKey] });
    };

    const getEditingName = () => {
        const data = getCurrentData();
        return data?.name || (editingTarget?.type === 'owner' ? t('YOU') : '');
    };

    return (
        <StepLayout
            footer={
                <PrimaryButton
                    title={t('BUTTONS.CONTINUE')}
                    showArrow
                    onPress={() => router.push('/(auth)/register/step5')}
                />
            }
        >
            <Stack.Screen options={{ headerTitle: () => <StepHeader currentStep={4} /> }} />

            <Text style={SharedStyles.title}>{t('FAMILY_AND_PREFERENCES')}</Text>
            <Text style={SharedStyles.subtitle}>{t('STEP4_SUBTITLE')}</Text>

            <View style={{ marginTop: 20 }}>
                <MemberCard
                    name={ownerProfile.name}
                    role={t('ROLES.OWNER')}
                    isOwner
                    onEdit={() => setEditingTarget({ type: 'owner' })}
                />

                {familyMembers.map((member, index) => (
                    <MemberCard
                        key={index}
                        name={member.name}
                        role={t('ROLES.MEMBER')}
                        onEdit={() => setEditingTarget({ type: 'member', index })}
                        onDelete={() => removeFamilyMember(index)}
                    />
                ))}

                <TouchableOpacity style={styles.addButton} onPress={() => setIsAddMemberModalVisible(true)}>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.addButtonLabel}>{t('ADD_FAMILY_MEMBER')}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isAddMemberModalVisible}
                onClose={() => setIsAddMemberModalVisible(false)}
                title={t('ADD_FAMILY_MEMBER')}
            >
                <ThemeInput
                    placeholder={t('PLACEHOLDERS.NAME')}
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    autoFocus
                />
                <ModalActions
                    onCancel={() => setIsAddMemberModalVisible(false)}
                    onConfirm={handleAddMember}
                    cancelText={t('BUTTONS.CANCEL')}
                    confirmText={t('BUTTONS.ADD')}
                    confirmDisabled={!newMemberName.trim()}
                />
            </Modal>

            <Modal
                visible={!!editingTarget}
                onClose={() => setEditingTarget(null)}
                animationType="slide"
                fullScreen
            >
                <View style={styles.fullScreenModal}>
                    <View style={styles.fsModalHeader}>
                        <Text style={styles.fsModalTitle}>{getEditingName()}</Text>
                        <TouchableOpacity onPress={() => setEditingTarget(null)}>
                            <Ionicons name="close-circle" size={30} color={Colors.textGray} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <Text style={styles.sectionTitle}>{t('MEALS_TITLE')}</Text>
                        <View style={styles.mealsContainer}>
                            <Checkbox
                                label={t('MEALS.BREAKFAST')}
                                isChecked={getCurrentData()?.eatsBreakfast ?? true}
                                onPress={() => toggleMeal('eatsBreakfast')}
                            />
                            <Checkbox
                                label={t('MEALS.LUNCH')}
                                isChecked={getCurrentData()?.eatsLunch ?? true}
                                onPress={() => toggleMeal('eatsLunch')}
                            />
                            <Checkbox
                                label={t('MEALS.DINNER')}
                                isChecked={getCurrentData()?.eatsDinner ?? true}
                                onPress={() => toggleMeal('eatsDinner')}
                            />
                            <Checkbox
                                label={t('MEALS.SNACK')}
                                isChecked={getCurrentData()?.eatsSnack ?? false}
                                onPress={() => toggleMeal('eatsSnack')}
                            />
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>{t('ALLERGIES_TITLE')}</Text>
                        <View style={styles.allergyGrid}>
                            {isLoadingAllergies ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : (
                                allergies.map((allergy) => {
                                    const selected = getCurrentData()?.allergyIds?.includes(allergy.id);
                                    return (
                                        <TouchableOpacity
                                            key={allergy.id}
                                            style={[styles.allergyChip, selected && styles.allergyChipSelected]}
                                            onPress={() => toggleAllergy(allergy.id)}
                                        >
                                            <Text style={[styles.allergyText, selected && styles.allergyTextSelected]}>
                                                {allergy.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.fsModalFooter}>
                        <PrimaryButton title={t('BUTTONS.SAVE')} onPress={() => setEditingTarget(null)} />
                    </View>
                </View>
            </Modal>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 16,
        backgroundColor: Colors.inputBackground,
    },
    addButtonLabel: {
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: 8,
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    fsModalHeader: {
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
    fsModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    fsModalFooter: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: Colors.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.inputBorder,
        marginVertical: 24,
    },
    mealsContainer: {
        gap: 12,
    },
    allergyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    allergyChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        backgroundColor: Colors.white,
    },
    allergyChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    allergyText: {
        color: Colors.secondary,
    },
    allergyTextSelected: {
        color: Colors.white,
        fontWeight: '600',
    },
});