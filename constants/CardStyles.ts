import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const CardStyles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        shadowColor: Colors.cardShadow,
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textGray,
        lineHeight: 20,
    },
    cardDivider: {
        height: 1,
        backgroundColor: Colors.inputBorder,
        marginVertical: 12,
    },
    metricCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        color: Colors.textGray,
        fontSize: 16,
    },
    summaryValue: {
        color: Colors.secondary,
        fontWeight: '600',
        fontSize: 16,
    },
});