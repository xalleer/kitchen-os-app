import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import {PrimaryButton} from "@/components/ui/PrimaryButton";
import {useAuthStore} from "@/store/authStore";

export default function Dashboard() {
    const {logout} = useAuthStore()


    return (
       <View>
           <PrimaryButton title={'Logout'} onPress={logout}></PrimaryButton>
       </View>
    );
}

const styles = StyleSheet.create({
    budgetCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
    },
    cardLabel: {
        color: 'white',
        opacity: 0.8,
        fontSize: 14,
        marginBottom: 8
    },
    budgetValue: {
        color: 'white',
        fontSize: 28,
        fontWeight: '800'
    },
    currency: {
        fontSize: 16,
        fontWeight: '400'
    },
    progressBarBg: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        height: 8,
        borderRadius: 4,
        marginTop: 15,
        overflow: 'hidden'
    },
    progressBarFill: {
        backgroundColor: 'white',
        height: '100%',
        borderRadius: 4
    },
    budgetDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    detailLabel: {
        color: 'white',
        opacity: 0.8,
        fontSize: 12,
        marginBottom: 4,
    },
    detailValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 15
    },
    mealCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealType: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cookingTime: {
        fontSize: 12,
        color: Colors.textGray,
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 8,
    },
    mealDescription: {
        fontSize: 14,
        color: Colors.textGray,
        lineHeight: 20,
        marginBottom: 12,
    },
    mealFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorder,
    },
    calories: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '600',
    },
    servings: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '600',
    },
    placeholderCard: {
        padding: 40,
        backgroundColor: Colors.inputBackground,
        borderRadius: 20,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    }
});