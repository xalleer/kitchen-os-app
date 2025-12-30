import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SharedStyles } from '@/constants/SharedStyles';

export default function Dashboard() {
    return (
        <ScrollView style={SharedStyles.containerMain} showsVerticalScrollIndicator={false}>
            {/* Картка Бюджету */}
            <View style={styles.budgetCard}>
                <Text style={styles.cardLabel}>Бюджет на тиждень</Text>
                <Text style={styles.budgetValue}>1,450 / 2,000 <Text style={styles.currency}>UAH</Text></Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '72%' }]} />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Сьогоднішнє меню</Text>
            {/* Сюди пізніше додамо картки страв */}
            <View style={styles.placeholderCard}>
                <Text style={{ color: Colors.textGray }}>Генеруємо ваш ідеальний раціон...</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    budgetCard: {
        backgroundColor: Colors.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
    },
    cardLabel: { color: 'white', opacity: 0.8, fontSize: 14, marginBottom: 8 },
    budgetValue: { color: 'white', fontSize: 28, fontWeight: '800' },
    currency: { fontSize: 16, fontWeight: '400' },
    progressBarBg: { backgroundColor: 'rgba(255,255,255,0.3)', height: 8, borderRadius: 4, marginTop: 15 },
    progressBarFill: { backgroundColor: 'white', height: '100%', borderRadius: 4 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.secondary, marginBottom: 15 },
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