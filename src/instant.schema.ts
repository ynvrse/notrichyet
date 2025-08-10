// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from '@instantdb/react';

const _schema = i.schema({
    // We inferred 1 attribute!
    // Take a look at this schema, and if everything looks good,
    // run `push schema` again to enforce the types.
    entities: {
        $files: i.entity({
            path: i.string().unique().indexed(),
            url: i.string(),
        }),
        $users: i.entity({
            email: i.string().unique().indexed().optional(),
        }),
        expenses: i.entity({
            amount: i.number().optional(),
            createdAt: i.date().indexed().optional(),
            date: i.date().indexed().optional(),
            notes: i.string().optional(),
            type: i.string().indexed().optional(),
            userId: i.string().indexed().optional(),
        }),
        hangoutExpenses: i.entity({
            amount: i.number(),
            category: i.string().indexed(),
            createdAt: i.date().indexed(),
            date: i.date(),
            description: i.string(),
            hangoutId: i.string().indexed(),
            paidById: i.string().indexed(),
            receiptUrl: i.any().optional(),
            splitAmong: i.json(),
        }),
        hangoutParticipants: i.entity({
            createdAt: i.date().indexed().optional(),
            displayName: i.string().optional(),
            fixedAmount: i.number().optional(),
            hangoutId: i.string().indexed().optional(),
            hasConfirmed: i.boolean().indexed().optional(),
            hasPaid: i.boolean().indexed().optional(),
            joinedAt: i.date().optional(),
            sharePercentage: i.number().optional(),
            userId: i.string().indexed().optional(),
        }),
        hangouts: i.entity({
            createdAt: i.date().indexed().optional(),
            date: i.date().optional(),
            description: i.string().optional(),
            isActive: i.boolean().indexed().optional(),
            isSettled: i.boolean().indexed().optional(),
            joinCode: i.string().unique().indexed().optional(),
            location: i.string().optional(),
            maxParticipants: i.number().optional(),
            ownerId: i.string().indexed().optional(),
            splitMethod: i.string().indexed().optional(),
            splitRules: i.any().optional(),
            title: i.string().optional(),
        }),
        incomes: i.entity({
            amount: i.number().optional(),
            createdAt: i.date().indexed().optional(),
            date: i.date().indexed().optional(),
            notes: i.string().optional(),
            source: i.string().optional(),
            userId: i.string().indexed().optional(),
        }),
        profiles: i.entity({
            createdAt: i.string().optional(),
            email: i.string().optional(),
            firstName: i.string().optional(),
            fullName: i.string().optional(),
            lastName: i.string().optional(),
            profilePicture: i.string().optional(),
            updatedAt: i.string().optional(),
            userId: i.string().optional(),
        }),
        savings: i.entity({
            createdAt: i.date().indexed().optional(),
            currentAmount: i.number().optional(),
            goalAmount: i.number().optional(),
            goalName: i.string().optional(),
            isCompleted: i.boolean().indexed().optional(),
            notes: i.string().optional(),
            targetDate: i.date().optional(),
            userId: i.string().indexed().optional(),
        }),
    },
    links: {
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
    },
    rooms: {
        todos: {
            presence: i.entity({}),
        },
    },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
