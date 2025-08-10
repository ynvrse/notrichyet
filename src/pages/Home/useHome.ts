import { db } from '@/hooks/useInstantDb';

export function useHome() {
    const { user } = db.useAuth();
    const userId = user?.id;
    const { data, isLoading } = db.useQuery({
        profiles: {
            $: {
                where: {
                    userId: user?.id,
                },
            },
        },
        incomes: {
            $: {
                where: {
                    userId: userId,
                },
                limit: 3,
                order: {
                    serverCreatedAt: 'desc',
                },
            },
        },
        expenses: {
            $: {
                where: {
                    userId: userId,
                },
                limit: 5,
                order: {
                    serverCreatedAt: 'desc',
                },
            },
        },
        hangouts: {
            $: {
                where: {
                    ownerId: userId,
                    isActive: true,
                },
                limit: 3,
            },
            hangoutParticipants: {},
        },
        savings: {
            $: {
                where: {
                    userId: userId,
                },
                limit: 2,
            },
        },
    });

    const profile = data?.profiles?.[0];
    const incomes = data?.incomes || [];
    const expenses = data?.expenses || [];
    const hangouts = data?.hangouts || [];
    const savings = data?.savings || [];
    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    return {
        profile,
        incomes,
        expenses,
        hangouts,
        savings,
        balance,
        totalIncome,
        totalExpense,
        isLoading,
    };
}
