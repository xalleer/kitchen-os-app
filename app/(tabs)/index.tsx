import React, { useEffect } from 'react';
import { View } from 'react-native';
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

export default function Dashboard() {
    const { logout } = useAuthStore();
    const { fetchProfile } = useUserStore();

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <PrimaryButton title={'Logout'} onPress={logout} />
        </View>
    );
}