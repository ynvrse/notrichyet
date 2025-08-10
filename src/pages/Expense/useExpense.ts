'use client';

import { useMemo, useState } from 'react';

import { db } from '@/hooks/useInstantDb';
import { endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from 'date-fns';
import { ExpenseProps, FilterPeriod, FilterType } from './types';

export function useExpense(userId: ExpenseProps['userId']) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('thisMonth');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const { data, isLoading } = db.useQuery({
        expenses: {
            $: {
                where: {
                    userId: userId,
                },
                order: {
                    serverCreatedAt: 'desc',
                },
            },
        },
        hangouts: {
            $: {
                where: {
                    ownerId: userId,
                },
            },
        },
        hangoutParticipants: {},
        categories: {
            $: {
                where: {
                    userId: userId,
                    type: 'expense',
                },
            },
        },
    });

    const expenses = data?.expenses || [];
    const hangouts = data?.hangouts || [];
    const categories = data?.categories || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
        }).format(new Date(date));
    };

    const getFilteredExpenses = useMemo(() => {
        let filtered = expenses;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (expense) =>
                    expense.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expense.type?.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter((expense) => expense.type === filterType);
        }

        // Filter by period
        if (filterPeriod !== 'all') {
            const now = new Date();
            let startDate: Date;
            let endDate: Date = now;

            switch (filterPeriod) {
                case 'thisMonth':
                    startDate = startOfMonth(now);
                    endDate = endOfMonth(now);
                    break;
                case 'lastMonth':
                    const lastMonth = subMonths(now, 1);
                    startDate = startOfMonth(lastMonth);
                    endDate = endOfMonth(lastMonth);
                    break;
                case 'last3Months':
                    startDate = subMonths(now, 3);
                    break;
                default:
                    startDate = new Date(0);
            }

            filtered = filtered.filter((expense) =>
                isWithinInterval(new Date(expense.date), { start: startDate, end: endDate }),
            );
        }

        // Filter by selected date
        if (selectedDate) {
            filtered = filtered.filter(
                (expense) => format(new Date(expense.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
            );
        }

        return filtered;
    }, [expenses, searchQuery, filterType, filterPeriod, selectedDate]);

    const totalExpenses = getFilteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expensesByType = useMemo(() => {
        const grouped = getFilteredExpenses.reduce(
            (acc, expense) => {
                const type = expense.type || 'others';
                if (!acc[type]) {
                    acc[type] = { total: 0, count: 0 };
                }
                acc[type].total += expense.amount;
                acc[type].count += 1;
                return acc;
            },
            {} as Record<string, { total: number; count: number }>,
        );

        return Object.entries(grouped)
            .map(([type, data]) => ({
                type,
                ...data,
                percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
            }))
            .sort((a, b) => b.total - a.total);
    }, [getFilteredExpenses, totalExpenses]);

    const getHangoutInfo = (hangoutId: string) => {
        return hangouts.find((h) => h.id === hangoutId);
    };

    return {
        searchQuery,
        setSearchQuery,
        filterPeriod,
        setFilterPeriod,
        filterType,
        setFilterType,
        selectedDate,
        setSelectedDate,
        isCalendarOpen,
        setIsCalendarOpen,
        data,
        isLoading,
        expenses,
        hangouts,
        categories,
        formatCurrency,
        formatDate,
        getFilteredExpenses,
        totalExpenses,
        expensesByType,
        getHangoutInfo,
    };
}
