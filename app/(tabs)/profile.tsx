import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { CardStyles } from '@/constants/CardStyles';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProfileScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const { logout } = useAuthStore();

    const { profile, isLoading, fetchProfile } = useUserStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            await fetchProfile();
        } catch (error: any) {
            showToast({
                message: error.message || t('ERRORS.GENERIC'),
                type: 'error',
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProfile();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/welcome');
        } catch (error: any) {
            showToast({
                message: error.message,
                type: 'error',
            });
        }
    };

    if (isLoading && !profile) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{t('ERRORS.PROFILE_NOT_LOADED')}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.headerCard}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={40} color={Colors.white} />
                </View>
                <Text style={styles.nameText}>{profile.name}</Text>
                <Text style={styles.emailText}>{profile.email}</Text>
            </View>

            <View style={CardStyles.card}>
                <Text style={CardStyles.cardTitle}>{t('ACCOUNT_SETTINGS')}</Text>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/edit-profile')}
                >
                    <Ionicons name="person-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.menuItemText}>{t('EDIT_PROFILE')}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/change-password')}
                >
                    <Ionicons name="lock-closed-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.menuItemText}>{t('CHANGE_PASSWORD')}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>
            </View>

            <View style={CardStyles.card}>
                <Text style={CardStyles.cardTitle}>{t('FAMILY_SETTINGS')}</Text>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/family-members')}
                >
                    <Ionicons name="people-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.menuItemText}>{t('FAMILY_MEMBERS')}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/preferences')}
                >
                    <Ionicons name="restaurant-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.menuItemText}>{t('MY_PREFERENCES')}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/budget')}
                >
                    <Ionicons name="wallet-outline" size={24} color={Colors.secondary} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.menuItemText}>{t('WEEKLY_BUDGET')}</Text>
                        <Text style={styles.budgetValue}>
                            {profile.family.budgetLimit} {t('CURRENCY.UAH')}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>
            </View>

            <View style={CardStyles.card}>
                <Text style={CardStyles.cardTitle}>{t('APP_SETTINGS')}</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="language-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.menuItemText}>{t('LANGUAGE')}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.menuItemText}>{t('NOTIFICATIONS')}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
                <Text style={styles.logoutText}>{t('LOGOUT')}</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
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
    content: {
        padding: 20,
    },
    headerCard: {
        backgroundColor: Colors.primary,
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorder,
    },
    menuItemText: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        color: Colors.secondary,
    },
    budgetValue: {
        marginLeft: 16,
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.danger,
        marginTop: 20,
    },
    logoutText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.danger,
    },
    errorText: {
        fontSize: 16,
        color: Colors.textGray,
    },
});