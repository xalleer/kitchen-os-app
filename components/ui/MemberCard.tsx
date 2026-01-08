import React, {useTransition} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {useTranslation} from "react-i18next";

interface MemberCardProps {
    name: string;
    role: string;
    isOwner?: boolean;
    onEdit: () => void;
    onDelete?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
                                                          name,
                                                          role,
                                                          isOwner = false,
                                                          onEdit,
                                                          onDelete
                                                      }) => {

    const { t } = useTranslation()
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: isOwner ? Colors.primary : Colors.textGray }]}>
                    <Ionicons
                        name={isOwner ? 'person' : 'people'}
                        size={20}
                        color={Colors.white}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.role}>{role}</Text>
                </View>
                {!isOwner && onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Text style={styles.editText}>{t('EDIT_PREFERENCES')}</Text>
                <Ionicons name="settings-outline" size={16} color={Colors.textGray} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        shadowColor: Colors.cardShadow,
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
    },
    role: {
        fontSize: 12,
        color: Colors.textGray,
    },
    deleteButton: {
        padding: 4,
    },
    editButton: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.inputBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editText: {
        color: Colors.textGray,
        fontSize: 14,
    },
});