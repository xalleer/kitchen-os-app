import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface SelectableCardProps {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    isSelected: boolean;
    onPress: () => void;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({ title, iconName, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {isSelected && (
                <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                </View>
            )}
            <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                <Ionicons name={iconName} size={32} color={isSelected ? Colors.primary : Colors.textGray} />
            </View>
            <Text style={[styles.title, isSelected && styles.titleSelected]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '47%',
        aspectRatio: 1,
        marginBottom: 20,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
    },
    checkmark: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    iconContainer: {
        backgroundColor: Colors.inputBackground,
        padding: 16,
        borderRadius: 50,
        marginBottom: 12,
    },
    iconContainerSelected: {
        backgroundColor: Colors.lightGreen,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        textAlign: 'center',
    },
    titleSelected: {
        color: Colors.secondary,
    }
});