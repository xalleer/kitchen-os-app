import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

export type GoalType = 'loss' | 'gain' | 'healthy' | 'budget' | null;

export interface OnboardingData {
    name: string;
    email: string;
    password: string;
    height: number;
    weight: number;
    goal: GoalType;
    familySize: number;
    budget: number;
}

interface OnboardingContextType {
    data: OnboardingData;
    updateData: (newData: Partial<OnboardingData>) => void;
    resetData: () => void;
}

const initialData: OnboardingData = {
    name: '',
    email: '',
    password: '',
    height: 175,
    weight: 70,
    goal: null,
    familySize: 1,
    budget: 2000
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<OnboardingData>(initialData);

    const updateData = useCallback((newData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    }, []);

    const resetData = useCallback(() => {
        setData(initialData);
    }, []);

    const value = useMemo(() => ({
        data,
        updateData,
        resetData
    }), [data, updateData, resetData]);

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
    return context;
};