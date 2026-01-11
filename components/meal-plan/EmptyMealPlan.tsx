import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface EmptyMealPlanProps {
    onGenerate: () => void;
}

export const EmptyMealPlan: React.FC<EmptyMealPlanProps> = ({ onGenerate }) => {
    return (
        <View style={emptyStyles.container}>
            <View style={emptyStyles.iconContainer}>
                <Ionicons name="calendar-outline" size={80} color={Colors.textGray} />
            </View>
            <Text style={emptyStyles.title}>Немає плану харчування</Text>
            <Text style={emptyStyles.description}>
                Згенеруйте персоналізований план харчування на тиждень відповідно до ваших потреб та цілей
            </Text>
            <TouchableOpacity style={emptyStyles.button} onPress={onGenerate}>
                <Ionicons name="sparkles" size={20} color={Colors.white} />
                <Text style={emptyStyles.buttonText}>Згенерувати план</Text>
            </TouchableOpacity>

            <View style={emptyStyles.features}>
                <View style={emptyStyles.feature}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    <Text style={emptyStyles.featureText}>Враховує ваші цілі</Text>
                </View>
                <View style={emptyStyles.feature}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    <Text style={emptyStyles.featureText}>Підбір під алергії</Text>
                </View>
                <View style={emptyStyles.feature}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    <Text style={emptyStyles.featureText}>В межах бюджету</Text>
                </View>
            </View>
        </View>
    );
};

const emptyStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 40,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    features: {
        alignSelf: 'stretch',
        gap: 16,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 14,
        color: Colors.secondary,
    },
});
