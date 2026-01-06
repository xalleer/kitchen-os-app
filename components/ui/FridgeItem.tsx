import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, DimensionValue  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 64) / 2;

interface FridgeItemProps {
    item: {
        id: string;
        name: string;
        exp: string;
        status: string;
        freshness: string;
        amount: string;
        image: string;
        onDelete?: () => void;
    }
}

export const FridgeItem = ({ item }: FridgeItemProps) => {
    const getStatusColor = (status: string) => {
        if (status === 'EXPIRED') return '#E74C3C';
        if (status === 'LOW') return '#FF6B6B';
        if (status === 'OKAY') return '#FFD93D';
        return '#6BCB77';
    };

    const statusColor = getStatusColor(item.status);

    return (
        <View style={styles.card}>
            {item.onDelete && (
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={item.onDelete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close-circle" size={24} color="#E74C3C" />
                </TouchableOpacity>
            )}

            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.amount}</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.expDate}>Exp: {item.exp}</Text>

                <View style={styles.footer}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {item.status}
                    </Text>
                    <Text style={[styles.percentageText, { color: statusColor }]}>
                        {item.freshness}%
                    </Text>
                </View>

                <View style={styles.progressBarBg}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${item.freshness}%` as DimensionValue,
                                backgroundColor: statusColor
                            }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        width: cardWidth,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333'
    },
    infoContainer: {
        marginTop: 12
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A'
    },
    expDate: {
        fontSize: 13,
        color: '#999',
        marginVertical: 4
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800'
    },
    percentageText: {
        fontSize: 11,
        fontWeight: '700'
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        marginTop: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});