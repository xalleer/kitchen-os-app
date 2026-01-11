import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MealPlan } from '@/store/mealPlanStore';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const getWeekDates = (): Date[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });
};

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
};

interface DaySelectorProps {
    weeklyPlan: MealPlan[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
                                                            weeklyPlan,
                                                            selectedDate,
                                                            onSelectDate,
                                                        }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const dates = getWeekDates();

    useEffect(() => {
        const todayIndex = dates.findIndex(isToday);
        if (todayIndex !== -1 && scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: todayIndex * 80 - 40,
                    animated: true,
                });
            }, 100);
        }
    }, []);

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {dates.map((date, index) => {
                const dateStr = formatDate(date);
                const isSelected = dateStr === selectedDate;
                const isTodayDate = isToday(date);
                const plan = weeklyPlan.find(p => p.date === dateStr);
                const hasData = plan?.isGenerated;

                return (
                    <TouchableOpacity
                        key={dateStr}
                        onPress={() => onSelectDate(dateStr)}
                        style={[
                            styles.dayCard,
                            isSelected && styles.dayCardSelected,
                            isTodayDate && !isSelected && styles.dayCardToday,
                        ]}
                    >
                        <Text style={[
                            styles.dayName,
                            isSelected && styles.dayTextSelected,
                        ]}>
                            {DAYS_OF_WEEK[index]}
                        </Text>
                        <Text style={[
                            styles.dayDate,
                            isSelected && styles.dayTextSelected,
                        ]}>
                            {date.getDate()}
                        </Text>
                        {hasData && !isSelected && (
                            <View style={styles.indicator} />
                        )}
                        {isTodayDate && !isSelected && (
                            <View style={styles.todayDot} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 20,
        gap: 12,
    },
    dayCard: {
        width: 60,
        height: 80,
        backgroundColor: Colors.white,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.inputBorder,
        position: 'relative',
    },
    dayCardSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    dayCardToday: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    dayName: {
        fontSize: 12,
        color: Colors.textGray,
        fontWeight: '600',
        marginBottom: 4,
    },
    dayDate: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.secondary,
    },
    dayTextSelected: {
        color: Colors.white,
    },
    indicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    todayDot: {
        position: 'absolute',
        bottom: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
});
