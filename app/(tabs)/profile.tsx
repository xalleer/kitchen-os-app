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
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
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

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: t('MY_PROFILE'),
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerBackTitle: '',
                }}
            />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.nameText}>{profile.name}</Text>
                        <Text style={styles.emailText}>{profile.email}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('ACCOUNT_SETTINGS')}</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/edit-profile')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="person-outline" size={20} color="#2196F3" />
                            </View>
                            <Text style={styles.menuItemText}>{t('EDIT_PROFILE')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/change-password')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="lock-closed-outline" size={20} color="#FF9800" />
                            </View>
                            <Text style={styles.menuItemText}>{t('CHANGE_PASSWORD')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('FAMILY_SETTINGS')}</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/family-members')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="people-outline" size={20} color="#9C27B0" />
                            </View>
                            <Text style={styles.menuItemText}>{t('FAMILY_MEMBERS')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/preferences')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="restaurant-outline" size={20} color="#4CAF50" />
                            </View>
                            <Text style={styles.menuItemText}>{t('MY_PREFERENCES')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/budget')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF9C4' }]}>
                                <Ionicons name="wallet-outline" size={20} color="#FBC02D" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.menuItemText}>{t('WEEKLY_BUDGET')}</Text>
                                <Text style={styles.budgetValue}>
                                    {profile.family.budgetLimit} {t('CURRENCY.UAH')}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                {/* Налаштування додатку */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('APP_SETTINGS')}</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E0F2F1' }]}>
                                <Ionicons name="language-outline" size={20} color="#009688" />
                            </View>
                            <Text style={styles.menuItemText}>{t('LANGUAGE')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FCE4EC' }]}>
                                <Ionicons name="notifications-outline" size={20} color="#E91E63" />
                            </View>
                            <Text style={styles.menuItemText}>{t('NOTIFICATIONS')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
                    <Text style={styles.logoutText}>{t('LOGOUT')}</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </>
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
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textGray,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.secondary,
        fontWeight: '500',
    },
    budgetValue: {
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