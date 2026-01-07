import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { StepLayout } from '@/components/ui/auth/StepLayout';
import { StepHeader } from '@/components/navigation/StepHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import dictionaryService from '@/services/dictionary.service';
import { Allergy } from '@/types/dictionaries';
import { Gender } from '@/types/enums';

type EditingTarget = { type: 'owner' } | { type: 'member'; index: number } | null;

export default function Step4() {
    const router = useRouter();
    const { t } = useTranslation();

    // Store Data
    const {
        ownerProfile, updateOwnerProfile,
        familyMembers, addFamilyMember, removeFamilyMember, updateFamilyMember
    } = useOnboardingStore();

    // Local State
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);

    // Modals State
    const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    useEffect(() => {
        dictionaryService.getAllergies()
            .then(setAllergies)
            .catch(console.error)
            .finally(() => setIsLoadingAllergies(false));
    }, []);

    // --- Logic for Adding Member ---
    const handleAddMember = () => {
        if (!newMemberName.trim()) return;
        addFamilyMember({
            name: newMemberName,
            gender: Gender.UNSPECIFIED,
            eatsBreakfast: true, eatsLunch: true, eatsDinner: true, eatsSnack: false,
            allergyIds: []
        });
        setNewMemberName('');
        setIsAddMemberModalVisible(false);
    };

    // --- Helpers to get/set data for current target ---
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

    // --- Toggles ---
    const toggleAllergy = (allergyId: string) => {
        const current = getCurrentData()?.allergyIds || [];
        const updated = current.includes(allergyId)
            ? current.filter(id => id !== allergyId)
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

    // Reusable Checkbox Component for this screen
    const MealCheckbox = ({ label, isChecked, onPress }: { label: string, isChecked: boolean, onPress: () => void }) => (
        <TouchableOpacity style={styles.mealCheckbox} onPress={onPress}>
            <View style={[styles.checkboxIcon, isChecked && styles.checkboxIconChecked]}>
                {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.mealLabel}>{label}</Text>
        </TouchableOpacity>
    );

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

            {/* --- Cards List --- */}
            <View style={{ marginTop: 20 }}>
                {/* 1. Owner Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
                            <Ionicons name="person" size={20} color="#fff" />
                        </View>
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.cardName}>{ownerProfile.name} ({t('YOU')})</Text>
                            <Text style={styles.cardRole}>{t('ROLES.OWNER')}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setEditingTarget({ type: 'owner' })}
                    >
                        <Text style={styles.editButtonText}>
                            {t('EDIT_PREFERENCES')}
                        </Text>
                        <Ionicons name="settings-outline" size={16} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                {/* 2. Family Members Cards */}
                {familyMembers.map((member, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.avatar, { backgroundColor: Colors.textGray }]}>
                                <Ionicons name="people" size={20} color="#fff" />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.cardName}>{member.name}</Text>
                                <Text style={styles.cardRole}>{t('ROLES.MEMBER')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeFamilyMember(index)} style={{ padding: 4 }}>
                                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setEditingTarget({ type: 'member', index })}
                        >
                            <Text style={styles.editButtonText}>
                                {t('EDIT_PREFERENCES')}
                            </Text>
                            <Ionicons name="settings-outline" size={16} color={Colors.textGray} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* 3. Add Button */}
                <TouchableOpacity style={styles.addButton} onPress={() => setIsAddMemberModalVisible(true)}>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.addButtonLabel}>{t('ADD_FAMILY_MEMBER')}</Text>
                </TouchableOpacity>
            </View>

            {/* --- Modal: Add Member --- */}
            <Modal visible={isAddMemberModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('ADD_FAMILY_MEMBER')}</Text>
                        <ThemeInput
                            placeholder={t('PLACEHOLDERS.NAME')}
                            value={newMemberName}
                            onChangeText={setNewMemberName}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsAddMemberModalVisible(false)} style={{ padding: 10 }}>
                                <Text style={{ color: Colors.textGray }}>{t('BUTTONS.CANCEL')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddMember} style={styles.modalPrimaryButton}>
                                <Text style={{ color: '#fff', fontWeight: '600' }}>{t('BUTTONS.ADD')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- Modal: Edit Preferences (Meals & Allergies) --- */}
            <Modal visible={!!editingTarget} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.fullScreenModal}>
                    <View style={styles.fsModalHeader}>
                        <Text style={styles.fsModalTitle}>
                            {getEditingName()}
                        </Text>
                        <TouchableOpacity onPress={() => setEditingTarget(null)}>
                            <Ionicons name="close-circle" size={30} color={Colors.textGray} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 20 }}>

                        {/* 1. Meals Section */}
                        <Text style={styles.sectionTitle}>{t('MEALS_TITLE')}</Text>
                        <View style={styles.mealsContainer}>
                            <MealCheckbox
                                label={t('MEALS.BREAKFAST')}
                                isChecked={getCurrentData()?.eatsBreakfast ?? true}
                                onPress={() => toggleMeal('eatsBreakfast')}
                            />
                            <MealCheckbox
                                label={t('MEALS.LUNCH')}
                                isChecked={getCurrentData()?.eatsLunch ?? true}
                                onPress={() => toggleMeal('eatsLunch')}
                            />
                            <MealCheckbox
                                label={t('MEALS.DINNER')}
                                isChecked={getCurrentData()?.eatsDinner ?? true}
                                onPress={() => toggleMeal('eatsDinner')}
                            />
                            <MealCheckbox
                                label={t('MEALS.SNACK')}
                                isChecked={getCurrentData()?.eatsSnack ?? false}
                                onPress={() => toggleMeal('eatsSnack')}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* 2. Allergies Section */}
                        <Text style={styles.sectionTitle}>{t('ALLERGIES_TITLE')}</Text>
                        <View style={styles.allergyGrid}>
                            {isLoadingAllergies ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : (
                                allergies.map(allergy => {
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
                                    )
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
    card: {
        backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12,
        borderWidth: 1, borderColor: Colors.inputBorder,
        shadowColor: Colors.cardShadow, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    cardName: { fontSize: 16, fontWeight: '600', color: Colors.secondary },
    cardRole: { fontSize: 12, color: Colors.textGray },
    editButton: {
        marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.inputBackground,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    editButtonText: { color: Colors.textGray, fontSize: 14 },
    addButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.primary,
        borderRadius: 16, backgroundColor: Colors.inputBackground
    },
    addButtonLabel: { color: Colors.primary, fontWeight: '600', marginLeft: 8 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', padding: 24, borderRadius: 24 },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16, gap: 16 },
    modalPrimaryButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },

    // Full Screen Modal
    fullScreenModal: { flex: 1, backgroundColor: Colors.background },
    fsModalHeader: {
        padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: Colors.inputBorder
    },
    fsModalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.secondary },
    fsModalFooter: { padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: Colors.inputBorder },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: Colors.secondary },
    divider: { height: 1, backgroundColor: Colors.inputBorder, marginVertical: 24 },

    // Meals
    mealsContainer: { gap: 12 },
    mealCheckbox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    checkboxIcon: {
        width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.inputBorder,
        marginRight: 12, justifyContent: 'center', alignItems: 'center'
    },
    checkboxIconChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    mealLabel: { fontSize: 16, color: Colors.secondary },

    // Allergies
    allergyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    allergyChip: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
        borderWidth: 1, borderColor: Colors.inputBorder, backgroundColor: Colors.white
    },
    allergyChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    allergyText: { color: Colors.secondary },
    allergyTextSelected: { color: Colors.white, fontWeight: '600' }
});