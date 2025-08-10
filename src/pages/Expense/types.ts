
export type FilterPeriod = 'all' | 'thisMonth' | 'lastMonth' | 'last3Months';
export type FilterType = 'all' | 'food' | 'transport' | 'shopping' | 'home' | 'entertainment' | 'health' | 'others';

export interface ExpenseProps {
    userId: string;
}
