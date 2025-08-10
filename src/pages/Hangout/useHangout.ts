import { db } from '@/hooks/useInstantDb';
import { useUserProfile } from '@/hooks/useUserProfile';
import { id } from '@instantdb/react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SplitMethod } from './types';
import { formatCurrency, generateJoinCode } from './utils';

// Safe date utilities
const isValidDate = (date: any): boolean => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};

const safeDate = (date: any): Date => {
    if (!date) return new Date();

    if (date instanceof Date) {
        return isValidDate(date) ? date : new Date();
    }

    if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date);
        return isValidDate(parsed) ? parsed : new Date();
    }

    return new Date();
};

export function useHangout() {
    // Tab & Dialog State
    const [activeTab, setActiveTab] = useState<'mine' | 'joined' | 'all'>('mine');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    // Auth & Profile
    const { user } = db.useAuth();
    const { profile: userProfile } = useUserProfile();
    const userId = user?.id;

    // Create Hangout Form State
    const [form, setForm] = useState({
        title: '',
        description: '',
        selectedDate: new Date(),
        location: '',
        splitMethod: 'equal' as SplitMethod,
        maxParticipants: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateForm = (field: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Query Data - FIX: Proper query structure
    const { data, isLoading } = db.useQuery({
        hangouts: {
            $: { order: { serverCreatedAt: 'desc' } },
            hangoutParticipants: {},
            hangoutExpenses: {}, // This will get expenses for each hangout
        },
        hangoutParticipants: {
            $: { where: { userId } }, // Only get current user's participations
            hangouts: {
                hangoutParticipants: {}, // Get all participants of hangouts user joined
                hangoutExpenses: {}, // Get all expenses of hangouts user joined
            },
        },
        profiles: {},
    });

    // FIX: Safe data access with proper null checks
    const allHangouts = useMemo(() => {
        const hangouts = data?.hangouts ?? [];
        // FIX: Safe data access with proper null checks and date validation
        return hangouts.map((hangout) => ({
            ...hangout,
            date: safeDate(hangout.date),
            createdAt: safeDate(hangout.createdAt),
            updatedAt: hangout.updatedAt ? safeDate(hangout.updatedAt) : undefined,
            hangoutParticipants: Array.isArray(hangout.hangoutParticipants)
                ? hangout.hangoutParticipants.map((p: any) => ({
                      ...p,
                      joinedAt: safeDate(p.joinedAt),
                      createdAt: safeDate(p.createdAt),
                  }))
                : [],
            hangoutExpenses: Array.isArray(hangout.hangoutExpenses)
                ? hangout.hangoutExpenses.map((e: any) => ({
                      ...e,
                      date: safeDate(e.date),
                      createdAt: safeDate(e.createdAt),
                      amount: Number(e.amount) || 0,
                  }))
                : [],
        }));
    }, [data?.hangouts]);

    const allProfiles = useMemo(() => data?.profiles ?? [], [data?.profiles]);

    // FIX: Proper joined hangouts calculation
    const joinedHangouts = useMemo(() => data?.hangoutParticipants ?? [], [data?.hangoutParticipants]);

    const joinedHangoutParticipants = useMemo(
        () => data?.hangoutParticipants?.length ?? 0,
        [data?.hangoutParticipants],
    );

    const ownedHangouts = useMemo(() => allHangouts.filter((h) => h.ownerId === userId), [allHangouts, userId]);

    const activeHangouts = useMemo(() => allHangouts.filter((h) => h.isActive && !h.isSettled), [allHangouts]);

    const settledHangouts = useMemo(() => allHangouts.filter((h) => h.isSettled), [allHangouts]);

    // Helpers
    const resetCreateForm = () => {
        setForm({
            title: '',
            description: '',
            selectedDate: new Date(),
            location: '',
            splitMethod: 'equal',
            maxParticipants: '',
        });
    };

    const findHangoutByCode = useCallback(
        (code: string) => allHangouts.find((h) => h.joinCode === code.trim().toUpperCase()),
        [allHangouts],
    );

    // Actions
    const handleCreateHangout = async () => {
        if (!form.title.trim()) {
            toast.error('Please enter hangout title');
            return;
        }

        setIsSubmitting(true);
        try {
            const hangoutId = id();
            const participantId = id();
            const code = generateJoinCode();

            await db.transact([
                db.tx.hangouts[hangoutId].update({
                    ownerId: userId,
                    title: form.title.trim(),
                    description: form.description.trim() || undefined,
                    date: safeDate(form.selectedDate),
                    location: form.location.trim() || undefined,
                    splitMethod: form.splitMethod,
                    isActive: true,
                    isSettled: false,
                    joinCode: code,
                    maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
                    createdAt: new Date(),
                }),
                db.tx.hangoutParticipants[participantId]
                    .update({
                        userId,
                        hangoutId,
                        displayName: userProfile?.fullName?.split(' ')[0] || 'Owner',
                        joinedAt: new Date(),
                        sharePercentage: form.splitMethod === 'percentage' ? 100 : undefined,
                        hasConfirmed: true,
                        hasPaid: false,
                        createdAt: new Date(),
                    })
                    .link({ hangouts: hangoutId }),
            ]);

            toast.success(`Share code: ${code}`);
            resetCreateForm();
            setIsCreateDialogOpen(false);
        } catch (error) {
            console.error('Create hangout error:', error);
            toast.error('Failed to create hangout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleJoinHangout = async () => {
        if (!joinCode.trim()) {
            toast.error('Please enter join code');
            return;
        }

        setIsSubmitting(true);
        try {
            const hangout = findHangoutByCode(joinCode);
            if (!hangout) {
                toast.error('Hangout not found with this code');
                return;
            }

            const { hangoutParticipants = [], maxParticipants: maxHp } = hangout;

            if (hangoutParticipants.some((p: any) => p.userId === userId)) {
                toast.info("You're already part of this hangout");
                return;
            }

            if (maxHp && hangoutParticipants.length >= maxHp) {
                toast.error('This hangout has reached maximum participants');
                return;
            }

            await db.transact([
                db.tx.hangoutParticipants[id()]
                    .update({
                        hangoutId: hangout.id,
                        userId,
                        displayName: userProfile?.fullName?.split(' ')[0] || 'User',
                        joinedAt: new Date(),
                        hasConfirmed: false,
                        hasPaid: false,
                        createdAt: new Date(),
                    })
                    .link({ hangouts: hangout.id }),
            ]);

            toast.success(`Welcome to "${hangout.title}"`);
            setJoinCode('');
            setIsJoinDialogOpen(false);
        } catch (error) {
            console.error('Join hangout error:', error);
            toast.error('Failed to join hangout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyJoinCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.info('Join code copied to clipboard');
        } catch {
            toast.error('Please copy the code manually');
        }
    };

    // FIX: Safe calculation with proper null checks
    const calculateHangoutTotal = (hangout: any) => {
        if (!hangout || !Array.isArray(hangout.hangoutExpenses)) {
            return 0;
        }
        return hangout.hangoutExpenses.reduce((sum: number, expense: any) => {
            return sum + (expense?.amount || 0);
        }, 0);
    };

    const getParticipantOwes = (hangout: any, participantId: string) => {
        const total = calculateHangoutTotal(hangout);
        const participantCount = hangout?.hangoutParticipants?.length || 1;

        switch (hangout?.splitMethod) {
            case 'equal':
                return total / participantCount;
            case 'treat':
                return hangout.ownerId === participantId ? total : 0;
            default:
                return 0;
        }
    };

    // FIX: Better error handling and transaction structure
    const handleAddExpense = async (
        hangoutId: string,
        expense: {
            description: string;
            amount: number;
            category?: string;
            receiptUrl?: string;
            splitAmong?: string[];
        },
    ) => {
        if (!expense.description.trim() || !expense.amount || expense.amount <= 0) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!userId) {
            toast.error('User not authenticated');
            return;
        }

        try {
            await db.transact([
                db.tx.hangoutExpenses[id()].update({
                    hangoutId,
                    paidById: userId,
                    description: expense.description.trim(),
                    amount: Number(expense.amount),
                    category: expense.category || undefined,
                    receiptUrl: expense.receiptUrl || undefined,
                    splitAmong: Array.isArray(expense.splitAmong) ? expense.splitAmong : [],
                    date: new Date(),
                    createdAt: new Date(),
                }),
            ]);
            toast.success('Expense added');
        } catch (err) {
            console.error('Add expense error:', err);
            toast.error('Failed to add expense');
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!expenseId) {
            toast.error('Invalid expense ID');
            return;
        }

        try {
            await db.transact([db.tx.hangoutExpenses[expenseId].delete()]);
            toast.success('Expense deleted');
        } catch (err) {
            console.error('Delete expense error:', err);
            toast.error('Failed to delete expense');
        }
    };

    return {
        // State
        activeTab,
        setActiveTab,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isJoinDialogOpen,
        setIsJoinDialogOpen,
        joinCode,
        setJoinCode,
        form,
        updateForm,
        isSubmitting,
        isLoading,

        // Data
        userId,
        ownedHangouts,
        joinedHangouts,
        joinedHangoutParticipants,
        allProfiles,
        activeHangouts,
        settledHangouts,
        allHangouts,

        // Actions
        handleCreateHangout,
        handleJoinHangout,
        copyJoinCode,
        calculateHangoutTotal,
        getParticipantOwes,
        formatCurrency,
        handleAddExpense,
        handleDeleteExpense,
    };
}
