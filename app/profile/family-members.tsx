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
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/ToastProvider';
import { Gender } from '@/types/enums';

export default function FamilyMembersScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { familyMembers, profile, fetchFamilyMembers, addFamilyMember, removeFamilyMember, isLoading } =
        useUserStore();

    const [refreshing, setRefreshing] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    useEffect(() => {
        loadMembers();
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
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
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
                        onEdit={() => router.push(`/profile/edit-member/${member.id}`)}
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
});