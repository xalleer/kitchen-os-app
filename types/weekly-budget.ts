export interface WeeklyBudgetCurrent {
    weekStartDate: string;
    weekEndDate: string;
    totalBudget: number;
    spent: number;
    remaining: number;
    isOverBudget: boolean;
    spentPercentage: number;
}
