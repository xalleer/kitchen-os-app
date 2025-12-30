import React, { createContext, useState, useContext } from 'react';

export type GoalType = 'loss' | 'gain' | 'healthy' | 'budget' | null;

interface OnboardingData {
    name: string;
    height: number;
    weight: number;
    goal: GoalType;
    familySize: number;
    budget: number;
}

interface OnboardingContextType {
    data: OnboardingData;
    updateData: (newData: Partial<OnboardingData>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<OnboardingData>({
        height: 175,
        weight: 70,
        goal: null,
        name: '',
        familySize: 1,
        budget: 2000
    });

    const updateData = (newData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error('useOnboarding must be used within provider');
    return context;
};