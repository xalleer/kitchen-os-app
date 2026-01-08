import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';

export const ProfileHeader = () => {
    const router = useRouter();
    const { profile } = useUserStore();
    const insets = useSafeAreaInsets();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <View style={[
            styles.container,
            {
                paddingTop: insets.top + 10,
                height: 60 + insets.top
            }
        ]}>
            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push('/profile')}
                activeOpacity={0.7}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {profile?.name ? getInitials(profile.name) : 'U'}
                    </Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                    {profile?.name || 'User'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => console.log('Notifications')}
                activeOpacity={0.7}
            >
                <Ionicons name="notifications-outline" size={24} color={Colors.secondary} />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#E74C3C',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
});