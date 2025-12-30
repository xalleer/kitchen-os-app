import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import {PrimaryButton} from "@/components/ui/PrimaryButton";
import {useRouter} from "expo-router";

export default function Profile() {
    const router = useRouter()

    const handleLogout = () => {
        router.dismissAll();
        router.replace('/(auth)/login');
    }
    return (
        <ScrollView style={SharedStyles.containerMain} showsVerticalScrollIndicator={false}>
            <Text>Profile</Text>
            <PrimaryButton title={'Logout'} onPress={handleLogout}></PrimaryButton>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

});