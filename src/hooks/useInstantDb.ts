import { env } from '@/lib/env';
import { InstaQLEntity, i, init } from '@instantdb/react';

const APP_ID = env.instantDbAppId;

const schema = i.schema({
    entities: {
        $files: i.entity({
            path: i.string().unique().indexed(),
            url: i.string().optional(),
        }),
        $users: i.entity({
            email: i.string().unique().indexed().optional(),
        }),
        profiles: i.entity({
            userId: i.string().optional(),
            fullName: i.string().optional(),
            profilePicture: i.string().optional(),
            email: i.string().optional(),
            createdAt: i.date().optional(),
            updatedAt: i.date().optional(),
        }),

        // Simple categories for organization
        categories: i.entity({
            userId: i.string().indexed(),
            name: i.string(),
            type: i.string().indexed(), // 'expense', 'income'
            color: i.string().optional(),
            icon: i.string().optional(),
            createdAt: i.date().indexed(),
        }),

        incomes: i.entity({
            userId: i.string().indexed(),
            categoryId: i.string().indexed().optional(),
            notes: i.string().optional(),
            source: i.string(),
            date: i.date().indexed(),
            amount: i.number(),
            createdAt: i.date().indexed(),
        }),

        expenses: i.entity({
            userId: i.string().indexed(),
            categoryId: i.string().indexed().optional(),
            notes: i.string().optional(),
            amount: i.number(),
            date: i.date().indexed(),
            type: i.string().indexed(), // 'food', 'transport', etc
            hangoutId: i.string().indexed().optional(), // link to hangout
            createdAt: i.date().indexed(),
        }),

        savings: i.entity({
            userId: i.string().indexed(),
            goalName: i.string(),
            goalAmount: i.number(),
            currentAmount: i.number(),
            targetDate: i.date().optional(),
            notes: i.string().optional(),
            isCompleted: i.boolean().indexed(),
            createdAt: i.date().indexed(),
        }),

        // Hangout/Nongkrong system
        hangouts: i.entity({
            ownerId: i.string().indexed(),
            title: i.string(),
            description: i.string().optional(),
            date: i.date(),
            location: i.string().optional(),

            // Split bill rules
            splitMethod: i.string().indexed(), // 'equal', 'percentage', 'manual', 'treat'
            splitRules: i.json().optional(), // flexible rules data

            // Status
            isActive: i.boolean().indexed(),
            isSettled: i.boolean().indexed(),

            // Join settings
            joinCode: i.string().unique().indexed().optional(),
            maxParticipants: i.number().optional(),

            createdAt: i.date().indexed(),
            updatedAt: i.date().optional(),
        }),

        hangoutParticipants: i.entity({
            hangoutId: i.string().indexed(),
            userId: i.string().indexed(),
            displayName: i.string(),
            joinedAt: i.date(),

            // Split data
            sharePercentage: i.number().optional(), // for percentage split
            fixedAmount: i.number().optional(), // for manual split

            // Status
            hasConfirmed: i.boolean().indexed(),
            hasPaid: i.boolean().indexed(),

            createdAt: i.date().indexed(),
        }),

        hangoutExpenses: i.entity({
            hangoutId: i.string().indexed(),
            paidById: i.string().indexed(), // who paid
            description: i.string(),
            amount: i.number(),
            date: i.date(),
            category: i.string().indexed(),

            // Split info
            splitAmong: i.json(), // array of participant IDs
            receiptUrl: i.string().optional(),

            createdAt: i.date().indexed(),
        }),
    },
    links: {
        hangoutParticipantsHangouts: {
            forward: {
                on: 'hangoutParticipants',
                has: 'many',
                label: 'hangouts',
            },
            reverse: {
                on: 'hangouts',
                has: 'many',
                label: 'hangoutParticipants',
            },
        },
        hangoutExpensesHangouts: {
            forward: {
                on: 'hangoutExpenses',
                has: 'one',
                label: 'hangouts',
                onDelete: 'cascade',
            },
            reverse: {
                on: 'hangouts',
                has: 'many',
                label: 'hangoutExpenses',
            },
        },
    },
    rooms: {
        hangoutChat: {
            presence: i.entity({
                userId: i.string(),
                name: i.string(),
                avatar: i.string().optional(),
            }),
            data: {
                hangoutId: i.string(),
                message: i.string(),
                senderId: i.string(),
                timestamp: i.date(),
                type: i.string(), // 'message', 'expense_added', 'user_joined', etc
            },
        },
    },
});

// Type exports
export type Profile = InstaQLEntity<typeof schema, 'profiles'>;
export type Category = InstaQLEntity<typeof schema, 'categories'>;
export type Income = InstaQLEntity<typeof schema, 'incomes'>;
export type Expense = InstaQLEntity<typeof schema, 'expenses'>;
export type Saving = InstaQLEntity<typeof schema, 'savings'>;
export type Hangout = InstaQLEntity<typeof schema, 'hangouts'>;
export type HangoutParticipant = InstaQLEntity<typeof schema, 'hangoutParticipants'>;
export type HangoutExpense = InstaQLEntity<typeof schema, 'hangoutExpenses'>;

const db = init({ appId: APP_ID, schema });

export { db };
