import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const SharedStyles = StyleSheet.create({
    containerMain: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    containerCentered: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.secondary,
        textAlign: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 10,
        marginLeft: 4,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    skipText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 30,
        padding: 32,
        alignItems: 'center',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});