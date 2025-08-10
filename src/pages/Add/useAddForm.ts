'use client';

import { useEffect, useState } from 'react';

import { db } from '@/hooks/useInstantDb';
import { id } from '@instantdb/react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { quickAmounts } from './constants';
import { AddProps, SavingMode, TransactionType } from './types';

export function useAddForm(userId: AddProps['userId']) {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') || 'expense';

    const [activeTab, setActiveTab] = useState<TransactionType>(tab as TransactionType);
    const [amount, setAmount] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Income form
    const [incomeSource, setIncomeSource] = useState('');
    const [incomeNotes, setIncomeNotes] = useState('');

    // Expense form
    const [expenseType, setExpenseType] = useState('');
    const [expenseNotes, setExpenseNotes] = useState('');

    // Saving form
    const [savingMode, setSavingMode] = useState<SavingMode>('add');
    const [selectedSavingId, setSelectedSavingId] = useState('');
    const [savingGoalName, setSavingGoalName] = useState('');
    const [savingGoalAmount, setSavingGoalAmount] = useState('');
    const [savingTargetDate, setSavingTargetDate] = useState<Date | undefined>();
    const [savingNotes, setSavingNotes] = useState('');

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    const { data } = db.useQuery({
        categories: {
            $: {
                where: {
                    userId: userId,
                },
            },
        },
        savings: {
            $: {
                where: {
                    userId: userId,
                    isCompleted: false,
                },
                order: {
                    serverCreatedAt: 'desc',
                },
            },
        },
    });

    const categories = data?.categories || [];
    const savingsGoals = data?.savings || [];

    const selectedSaving = savingsGoals.find((s) => s.id === selectedSavingId);

    const handleQuickAmount = (quickAmount: number) => {
        setAmount(quickAmount.toString());
    };

    const formatCurrency = (value: string) => {
        const number = parseInt(value.replace(/\D/g, ''));
        if (isNaN(number)) return '';
        return new Intl.NumberFormat('id-ID').format(number);
    };

    const handleAmountChange = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        setAmount(cleanValue);
    };

    const resetForm = () => {
        setAmount('');
        setIncomeSource('');
        setIncomeNotes('');
        setExpenseType('');
        setExpenseNotes('');
        setSelectedSavingId('');
        setSavingGoalName('');
        setSavingGoalAmount('');
        setSavingTargetDate(undefined);
        setSavingNotes('');
        setSelectedDate(new Date());
    };

    const handleSubmit = async () => {
        if (!amount || parseInt(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsSubmitting(true);

        try {
            if (activeTab === 'income') {
                if (!incomeSource.trim()) {
                    toast.error('Please enter income source');
                    return;
                }

                await db.transact([
                    db.tx.incomes[id()].update({
                        userId,
                        source: incomeSource,
                        amount: parseInt(amount),
                        date: selectedDate,
                        notes: incomeNotes || undefined,
                        createdAt: new Date(),
                    }),
                ]);

                toast.success(`Income of Rp ${formatCurrency(amount)} added`);
            } else if (activeTab === 'expense') {
                if (!expenseType) {
                    toast.error('Please select expense type');
                    return;
                }

                await db.transact([
                    db.tx.expenses[id()].update({
                        userId,
                        type: expenseType,
                        amount: parseInt(amount),
                        date: selectedDate,
                        notes: expenseNotes || undefined,
                        createdAt: new Date(),
                    }),
                ]);

                toast.success(`Expense of Rp ${formatCurrency(amount)} added`);
            } else if (activeTab === 'saving') {
                if (savingMode === 'create') {
                    // Create new saving goal
                    if (!savingGoalName.trim()) {
                        toast.error('Please enter saving goal name');
                        return;
                    }

                    const goalAmount = parseInt(savingGoalAmount) || parseInt(amount);

                    await db.transact([
                        db.tx.savings[id()].update({
                            userId,
                            goalName: savingGoalName,
                            goalAmount,
                            currentAmount: 0,
                            targetDate: savingTargetDate || undefined,
                            notes: savingNotes || undefined,
                            isCompleted: false,
                            createdAt: new Date(),
                        }),
                    ]);

                    toast.success(`Saving goal "${savingGoalName}" created`);
                } else {
                    // Add money to existing goal
                    if (!selectedSavingId) {
                        toast.error('Please select a saving goal');
                        return;
                    }

                    if (!selectedSaving) return;

                    const newAmount = selectedSaving.currentAmount + parseInt(amount);
                    const isCompleted = newAmount >= selectedSaving.goalAmount;

                    await db.transact([
                        db.tx.savings[selectedSavingId].update({
                            currentAmount: newAmount,
                            isCompleted,
                        }),
                    ]);

                    toast.success(
                        isCompleted
                            ? `Congratulations! You've reached your "${selectedSaving.goalName}" goal!`
                            : `Added Rp ${formatCurrency(amount)} to "${selectedSaving.goalName}"`,
                    );
                }
            }

            resetForm();
        } catch (error) {
            toast.error('Failed to add transaction. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        amount,
        setAmount,
        selectedDate,
        setSelectedDate,
        isCalendarOpen,
        setIsCalendarOpen,
        isSubmitting,
        setIsSubmitting,
        incomeSource,
        setIncomeSource,
        incomeNotes,
        setIncomeNotes,
        expenseType,
        setExpenseType,
        expenseNotes,
        setExpenseNotes,
        savingMode,
        setSavingMode,
        selectedSavingId,
        setSelectedSavingId,
        savingGoalName,
        setSavingGoalName,
        savingGoalAmount,
        setSavingGoalAmount,
        savingTargetDate,
        setSavingTargetDate,
        savingNotes,
        setSavingNotes,
        data,
        categories,
        savingsGoals,
        selectedSaving,
        handleQuickAmount,
        formatCurrency,
        handleAmountChange,
        resetForm,
        handleSubmit,
        quickAmounts,
    };
}
