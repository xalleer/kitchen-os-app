import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { MemberCard } from '@/components/ui/MemberCard';
import { Modal, ModalActions } from '@/components/ui/Modal';
import { ThemeInput } from '@/components/ui/ThemeInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/ToastProvider';
import { Gender } from '@/types/enums';
import { Allergy } from '@/types/dictionaries';
import dictionaryService from '@/services/dictionary.service';

export default function FamilyMembersScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const {
        familyMembers,
        profile,
        fetchFamilyMembers,
        addFamilyMember,
        removeFamilyMember,
        updateFamilyMemberData,
        updatePreferences,
        isLoading
    } = useUserStore();

    const [refreshing, setRefreshing] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    const [editingMember, setEditingMember] = useState<any | null>(null);
    const [tempMemberData, setTempMemberData] = useState<any | null>(null);
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);

    useEffect(() => {
        loadMembers();
        loadAllergies();
    }, []);

    const loadMembers = async () => {
        try {
            await fetchFamilyMembers();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const loadAllergies = async () => {
        try {
            const data = await dictionaryService.getAllergies();
            setAllergies(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingAllergies(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMembers();
        setRefreshing(false);
    };

    const handleAddMember = async () => {
        if (!newMemberName.trim()) {
            showToast({
                message: t('ERRORS.NAME_REQUIRED'),
                type: 'warning',
            });
            return;
        }

        try {
            await addFamilyMember({
                name: newMemberName,
                gender: Gender.UNSPECIFIED,
                eatsBreakfast: true,
                eatsLunch: true,
                eatsDinner: true,
                eatsSnack: false,
            });

            showToast({
                message: t('SUCCESS.MEMBER_ADDED'),
                type: 'success',
                icon: 'person-add',
            });

            setNewMemberName('');
            setIsAddModalVisible(false);
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const handleDeleteMember = (memberId: string, memberName: string) => {
        Alert.alert(
            t('CONFIRM_DELETE'),
            t('CONFIRM_DELETE_MEMBER', { name: memberName }),
            [
                { text: t('BUTTONS.CANCEL'), style: 'cancel' },
                {
                    text: t('BUTTONS.DELETE'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeFamilyMember(memberId);
                            showToast({
                                message: t('SUCCESS.MEMBER_REMOVED'),
                                type: 'success',
                                icon: 'trash',
                            });
                        } catch (error: any) {
                            showToast({
                                message: error.message || t('ERRORS.GENERIC'),
                                type: 'error',
                            });
                        }
                    },
                },
            ]
        );
    };

    const handleEditMember = (member: any) => {
        setEditingMember(member);
        const allergyIds = member.allergies
            ? member.allergies.map((a: any) => (typeof a === 'string' ? a : a.id))
            : (member.allergyIds || []);

        setTempMemberData({
            ...member,
            allergyIds,
        });
    };

    const handleSavePreferences = async () => {
        if (!editingMember || !tempMemberData) return;

        try {
            const dataToUpdate = {
                eatsBreakfast: tempMemberData.eatsBreakfast,
                eatsLunch: tempMemberData.eatsLunch,
                eatsDinner: tempMemberData.eatsDinner,
                eatsSnack: tempMemberData.eatsSnack,
                allergyIds: tempMemberData.allergyIds,
            };


            if (editingMember.userId) {
                await updatePreferences(dataToUpdate);
            } else {
                await updateFamilyMemberData(editingMember.id, dataToUpdate);
            }

            setEditingMember(null);

            showToast({
                message: t('SUCCESS.PREFERENCES_SAVED'),
                type: 'success',
                icon: 'checkmark-circle',
            });

            setTempMemberData(null);

        } catch (error: any) {
            setEditingMember(null);
            setTempMemberData(null);

            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const toggleMeal = (mealKey: string) => {
        if (!tempMemberData) return;
        setTempMemberData({
            ...tempMemberData,
            [mealKey]: !tempMemberData[mealKey],
        });
    };

    const toggleAllergy = (allergyId: string) => {
        if (!tempMemberData) return;
        const current = tempMemberData.allergyIds || [];
        const updated = current.includes(allergyId)
            ? current.filter((id: string) => id !== allergyId)
            : [...current, allergyId];
        setTempMemberData({
            ...tempMemberData,
            allergyIds: updated,
        });
    };

    const getMealsCount = (member: any) => {
        let count = 0;
        if (member.eatsBreakfast) count++;
        if (member.eatsLunch) count++;
        if (member.eatsDinner) count++;
        if (member.eatsSnack) count++;
        return count;
    };

    if (isLoading && familyMembers.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('FAMILY_MEMBERS'),
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.sectionTitle}>
                    {t('FAMILY_SIZE')}: {familyMembers.length} {t('PEOPLE')}
                </Text>

                {familyMembers.map((member) => (
                    <MemberCard
                        key={member.id}
                        name={member.name}
                        role={member.userId ? t('ROLES.OWNER') : t('ROLES.MEMBER')}
                        isOwner={member.userId === profile?.id}
                        onEdit={() => handleEditMember(member)}
                        onDelete={
                            !member.userId
                                ? () => handleDeleteMember(member.id, member.name)
                                : undefined
                        }
                        mealsCount={getMealsCount(member)}
                        allergiesCount={member.allergies?.length || 0}
                    />
                ))}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.addButtonLabel}>{t('ADD_FAMILY_MEMBER')}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Add Member Modal */}
            <Modal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                title={t('ADD_FAMILY_MEMBER')}
            >
                <ThemeInput
                    placeholder={t('PLACEHOLDERS.NAME')}
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    autoFocus
                />
                <ModalActions
                    onCancel={() => setIsAddModalVisible(false)}
                    onConfirm={handleAddMember}
                    cancelText={t('BUTTONS.CANCEL')}
                    confirmText={t('BUTTONS.ADD')}
                    confirmDisabled={!newMemberName.trim()}
                />
            </Modal>

            <Modal
                visible={!!editingMember}
                onClose={() => setEditingMember(null)}
                animationType="slide"
                fullScreen
            >
                {tempMemberData && (
                    <View style={styles.fullScreenModal}>
                        <View style={styles.fsModalHeader}>
                            <Text style={styles.fsModalTitle}>{tempMemberData.name}</Text>
                            <TouchableOpacity onPress={() => setEditingMember(null)}>
                                <Ionicons name="close-circle" size={30} color={Colors.textGray} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            <Text style={styles.modalSectionTitle}>{t('MEALS_TITLE')}</Text>
                            <View style={styles.mealsContainer}>
                                <Checkbox
                                    label={t('MEALS.BREAKFAST')}
                                    isChecked={tempMemberData.eatsBreakfast ?? true}
                                    onPress={() => toggleMeal('eatsBreakfast')}
                                />
                                <Checkbox
                                    label={t('MEALS.LUNCH')}
                                    isChecked={tempMemberData.eatsLunch ?? true}
                                    onPress={() => toggleMeal('eatsLunch')}
                                />
                                <Checkbox
                                    label={t('MEALS.DINNER')}
                                    isChecked={tempMemberData.eatsDinner ?? true}
                                    onPress={() => toggleMeal('eatsDinner')}
                                />
                                <Checkbox
                                    label={t('MEALS.SNACK')}
                                    isChecked={tempMemberData.eatsSnack ?? false}
                                    onPress={() => toggleMeal('eatsSnack')}
                                />
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.modalSectionTitle}>{t('ALLERGIES_TITLE')}</Text>
                            <View style={styles.allergyGrid}>
                                {isLoadingAllergies ? (
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                ) : (
                                    allergies.map((allergy) => {
                                        const selected = tempMemberData.allergyIds?.includes(allergy.id);
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
                            <PrimaryButton title={t('BUTTONS.SAVE')} onPress={handleSavePreferences} />
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 16,
    },
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
        marginTop: 8,
    },
    addButtonLabel: {
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: 8,
    },
    // Modal Styles
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
    modalSectionTitle: {
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