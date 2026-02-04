import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useWeeklyBudgetStore } from '@/store/weeklyBudgetStore';
import { CardStyles } from '@/constants/CardStyles';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { t } = useTranslation();
    const { logout } = useAuthStore();
    const { fetchProfile } = useUserStore();
    const { current, isLoading: isBudgetLoading, error: budgetError, fetchCurrent } = useWeeklyBudgetStore();

    const spentPercentage = useMemo(() => {
        if (!current) return 0;
        if (Number.isFinite(current.spentPercentage)) return Math.max(0, Math.min(100, current.spentPercentage));

        if (current.totalBudget <= 0) return 0;
        const computed = (current.spent / current.totalBudget) * 100;
        return Math.max(0, Math.min(100, computed));
    }, [current]);

    useEffect(() => {
        fetchProfile();
        fetchCurrent();
    }, [fetchCurrent, fetchProfile]);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: Colors.background }}>
            <View style={CardStyles.metricCard}>
                <View style={styles.budgetHeader}>
                    <Text style={styles.budgetTitle}>{t('DASHBOARD.WEEKLY_BUDGET')}</Text>
                    {current?.isOverBudget ? (
                        <View style={[styles.badge, styles.badgeDanger]}>
                            <Text style={styles.badgeText}>{t('DASHBOARD.OVER_BUDGET')}</Text>
                        </View>
                    ) : (
                        <View style={[styles.badge, styles.badgeOk]}>
                            <Text style={styles.badgeText}>{t('DASHBOARD.ON_TRACK')}</Text>
                        </View>
                    )}
                </View>

                {budgetError ? (
                    <Text style={styles.errorText}>{budgetError}</Text>
                ) : isBudgetLoading && !current ? (
                    <Text style={styles.mutedText}>{t('DASHBOARD.LOADING')}</Text>
                ) : current ? (
                    <>
                        <View style={CardStyles.summaryRow}>
                            <Text style={CardStyles.summaryLabel}>{t('DASHBOARD.SPENT')}</Text>
                            <Text style={CardStyles.summaryValue}>{current.spent.toFixed(2)}</Text>
                        </View>
                        <View style={CardStyles.summaryRow}>
                            <Text style={CardStyles.summaryLabel}>{t('DASHBOARD.REMAINING')}</Text>
                            <Text style={CardStyles.summaryValue}>{current.remaining.toFixed(2)}</Text>
                        </View>
                        <View style={CardStyles.summaryRow}>
                            <Text style={CardStyles.summaryLabel}>{t('DASHBOARD.TOTAL')}</Text>
                            <Text style={CardStyles.summaryValue}>{current.totalBudget.toFixed(2)}</Text>
                        </View>

                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${spentPercentage}%`, backgroundColor: current.isOverBudget ? Colors.danger : Colors.primary }]} />
                        </View>
                        <Text style={styles.progressText}>{Math.round(spentPercentage)}%</Text>
                        <Text style={styles.dateText}>{current.weekStartDate} — {current.weekEndDate}</Text>
                    </>
                ) : (
                    <Text style={styles.mutedText}>{t('DASHBOARD.NO_BUDGET_DATA')}</Text>
                )}
            </View>

            <PrimaryButton title={t('LOGOUT')} onPress={logout} />
        </View>
    );
}

const styles = StyleSheet.create({
    budgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    budgetTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    badgeOk: {
        backgroundColor: Colors.lightGreen,
    },
    badgeDanger: {
        backgroundColor: '#FDEDEC',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.secondary,
    },
    progressTrack: {
        height: 10,
        backgroundColor: Colors.inputBackground,
        borderRadius: 999,
        overflow: 'hidden',
        marginTop: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
    },
    progressText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textGray,
    },
    dateText: {
        marginTop: 6,
        fontSize: 12,
        color: Colors.textGray,
    },
    mutedText: {
        fontSize: 14,
        color: Colors.textGray,
    },
    errorText: {
        fontSize: 14,
        color: Colors.danger,
    },
});