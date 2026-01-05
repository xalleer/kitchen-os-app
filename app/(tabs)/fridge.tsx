import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';
import {FridgeItem} from "@/components/ui/FridgeItem";

export default function Fridge() {
    const isEmpty: boolean = false
    const foodData = [
        { id: '1', name: 'Oat Milk', exp: '5 Days', status: 'FRESH', freshness: 85, amount: 'x1', image: 'https://link-to-oat-milk.jpg' },
        { id: '2', name: 'Baby Spinach', exp: 'Today', status: 'LOW', freshness: 10, amount: '!', image: 'https://link-to-spinach.jpg' },
    ];
    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={SharedStyles.containerMain}>

                {isEmpty ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="leaf-outline" size={60} color={Colors.inputBorder} />
                        <Text style={{ color: Colors.textGray, marginTop: 10 }}>Холодильник порожній</Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={foodData}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            contentContainerStyle={{ paddingBottom: 100 }} // щоб FAB не перекривав
                            renderItem={({ item }) => <FridgeItem item={item} />}
                        />
                    </>
                )}

            </View>

            <TouchableOpacity style={styles.fab}>
                <Ionicons name="camera" size={28} color="white" />
                <Text style={styles.fabText}>AI Scan</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    fabText: { color: 'white', fontWeight: '700', marginLeft: 10, fontSize: 16 }
});