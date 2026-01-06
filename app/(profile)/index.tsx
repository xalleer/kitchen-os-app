import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import authService from '@/services/auth.service';
import familyService from '@/services/family.service';
import { Family, User } from '@/types/api';

export default function Profile() {
    const router = useRouter();
    const [family, setFamily] = useState<Family | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setIsLoading(true);
            const [familyData, membersData] = await Promise.all([
                familyService.getFamily(),
                familyService.getFamilyMembers(),
            ]);
            setFamily(familyData);
            setMembers(membersData);
        } catch (error: any) {
            console.error('Error loading profile:', error);
            Alert.alert('Помилка', error.message || 'Не вдалося завантажити дані профілю');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Вийти з аккаунту?',
            'Ви впевнені, що хочете вийти?',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Вийти',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authService.logout();
                            router.dismissAll();
                            router.replace('/(auth)/welcome');
                        } catch (error: any) {
                            Alert.alert('Помилка', error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleShareInviteCode = async () => {
        if (!family?.inviteCode) return;

        try {
            await Share.share({
                message: `Приєднуйся до моєї сім'ї в Kitchen OS! Код запрошення: ${family.inviteCode}`,
                title: 'Запрошення до Kitchen OS',
            });
        } catch (error: any) {
            console.error('Error sharing:', error);
        }
    };

    const handleRegenerateInviteCode = async () => {
        Alert.alert(
            'Перегенерувати код?',
            'Старий код запрошення стане недійсним. Продовжити?',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Так',
                    onPress: async () => {
                        try {
                            const result = await familyService.regenerateInviteCode();
                            setFamily(prev => prev ? { ...prev, inviteCode: result.inviteCode } : null);
                            Alert.alert('Успіх', 'Новий код запрошення створено');
                        } catch (error: any) {
                            Alert.alert('Помилка', error.message);
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={[SharedStyles.containerMain, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={SharedStyles.containerMain} showsVerticalScrollIndicator={false}>
            {/* Family Card */}
            {family && (
                <View style={styles.familyCard}>
                    <View style={styles.familyHeader}>
                        <View style={styles.familyIcon}>
                            <Ionicons name="people" size={32} color={Colors.primary} />
                        </View>
                        <View style={styles.familyInfo}>
                            <Text style={styles.familyName}>{family.name}</Text>
                            <Text style={styles.familyMeta}>
                                {members.length} {members.length === 1 ? 'член' : 'членів'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.inviteCodeContainer}>
                        <View style={styles.inviteCodeBox}>
                            <Text style={styles.inviteCodeLabel}>Код запрошення</Text>
                            <Text style={styles.inviteCode}>{family.inviteCode}</Text>
                        </View>
                        <View style={styles.inviteActions}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleShareInviteCode}
                            >
                                <Ionicons name="share-social" size={20} color={Colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleRegenerateInviteCode}
                            >
                                <Ionicons name="refresh" size={20} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.budgetInfo}>
                        <Text style={styles.budgetLabel}>Тижневий бюджет</Text>
                        <Text style={styles.budgetValue}>
                            {family.budgetLimit.toFixed(0)} {family.currency}
                        </Text>
                    </View>
                </View>
            )}

            {/* Members Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Члени сім'ї</Text>
                {members.map((member) => (
                    <View key={member.id} style={styles.memberCard}>
                        <View style={styles.memberAvatar}>
                            <Ionicons name="person" size={24} color={Colors.primary} />
                        </View>
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name || member.email}</Text>
                            <Text style={styles.memberRole}>
                                {member.roleInFamily === 'OWNER' ? 'Власник' : 'Член'}
                            </Text>
                        </View>
                        {member.roleInFamily === 'OWNER' && (
                            <View style={styles.ownerBadge}>
                                <Ionicons name="star" size={16} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                ))}
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Налаштування</Text>

                <SettingsItem
                    icon="person-outline"
                    title="Особисті дані"
                    onPress={() => Alert.alert('Скоро', 'Ця функція буде доступна незабаром')}
                />
                <SettingsItem
                    icon="notifications-outline"
                    title="Сповіщення"
                    onPress={() => Alert.alert('Скоро', 'Ця функція буде доступна незабаром')}
                />
                <SettingsItem
                    icon="language-outline"
                    title="Мова"
                    onPress={() => Alert.alert('Скоро', 'Ця функція буде доступна незабаром')}
                />
                <SettingsItem
                    icon="help-circle-outline"
                    title="Допомога"
                    onPress={() => Alert.alert('Скоро', 'Ця функція буде доступна незабаром')}
                />
            </View>

            {/* Logout Button */}
            <View style={styles.logoutSection}>
                <PrimaryButton
                    title="Вийти"
                    onPress={handleLogout}
                    style={{ backgroundColor: Colors.danger }}
                />
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const SettingsItem = ({
                          icon,
                          title,
                          onPress,
                      }: {
    icon: string;
    title: string;
    onPress: () => void;
}) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
        <View style={styles.settingsLeft}>
            <Ionicons name={icon as any} size={24} color={Colors.secondary} />
            <Text style={styles.settingsText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.textGray} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    familyCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    familyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    familyIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    familyInfo: {
        flex: 1,
    },
    familyName: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.secondary,
        marginBottom: 4,
    },
    familyMeta: {
        fontSize: 14,
        color: Colors.textGray,
    },
    inviteCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    inviteCodeBox: {
        flex: 1,
    },
    inviteCodeLabel: {
        fontSize: 12,
        color: Colors.textGray,
        marginBottom: 4,
    },
    inviteCode: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.secondary,
        letterSpacing: 2,
    },
    inviteActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    budgetInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    },
    budgetLabel: {
        fontSize: 14,
        color: Colors.textGray,
    },
    budgetValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 12,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    memberAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 2,
    },
    memberRole: {
        fontSize: 14,
        color: Colors.textGray,
    },
    ownerBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    settingsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingsText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
    },
    logoutSection: {
        marginTop: 20,
        marginBottom: 20,
    },
});