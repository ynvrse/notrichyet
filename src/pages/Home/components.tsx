/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon, PlusIcon, TrendingDownIcon, TrendingUpIcon, UsersIcon, WalletIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useHome } from './useHome';
import { formatCurrency, formatDate } from './utils';

export function HomeForm() {
    const navigate = useNavigate();
    const { profile, incomes, expenses, hangouts, savings, balance, totalIncome, totalExpense, isLoading } = useHome();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="border-foreground h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen p-4 pb-24">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-bold">
                        Halo, {profile?.fullName?.split(' ')[0] || 'User'} 👋
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                    </p>
                </div>
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={profile?.profilePicture} />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                        {profile?.fullName?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Balance Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-muted-foreground text-sm font-medium">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-foreground text-2xl font-bold">{formatCurrency(balance)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                            <TrendingUpIcon className="h-4 w-4 text-green-500" />
                            Income
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(totalIncome)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                            <TrendingDownIcon className="h-4 w-4 text-red-500" />
                            Expense
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-semibold text-red-600 dark:text-red-400">
                            {formatCurrency(totalExpense)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
                <h2 className="text-foreground mb-3 text-lg font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={() => navigate('/add?tab=income')}
                        variant="outline"
                        className="flex h-auto flex-col gap-2 p-4"
                    >
                        <PlusIcon className="h-6 w-6 text-green-500" />
                        <span>Add Income</span>
                    </Button>
                    <Button
                        onClick={() => navigate('/add?tab=expense')}
                        variant="outline"
                        className="flex h-auto flex-col gap-2 p-4"
                    >
                        <WalletIcon className="h-6 w-6 text-red-500" />
                        <span>Add Expense</span>
                    </Button>
                </div>
            </div>

            {/* Recent Transactions */}
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-48">
                        <div className="space-y-3">
                            {expenses.slice(0, 5).map((expense: any) => (
                                <div key={expense.id} className="flex items-center justify-between py-2">
                                    <div className="flex-1">
                                        <p className="text-foreground text-sm font-medium">
                                            {expense.notes || expense.type}
                                        </p>
                                        <p className="text-muted-foreground text-xs">{formatDate(expense.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-red-600 dark:text-red-400">
                                            -{formatCurrency(expense.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {incomes.slice(0, 2).map((income: any) => (
                                <div key={income.id} className="flex items-center justify-between py-2">
                                    <div className="flex-1">
                                        <p className="text-foreground text-sm font-medium">{income.source}</p>
                                        <p className="text-muted-foreground text-xs">{formatDate(income.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600 dark:text-green-400">
                                            +{formatCurrency(income.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Active Hangouts */}
            {hangouts.length > 0 && (
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <UsersIcon className="h-5 w-5 text-orange-500" />
                            Active Hangouts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {hangouts.map((hangout: any) => (
                                <div
                                    key={hangout.id}
                                    className="bg-card flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex-1">
                                        <p className="text-foreground text-sm font-medium">{hangout.title}</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <CalendarIcon className="text-muted-foreground h-3 w-3" />
                                            <p className="text-muted-foreground text-xs">{formatDate(hangout.date)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant="secondary"
                                            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                                        >
                                            {hangout.hangoutParticipants?.length || 0} members
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Savings Goals */}
            {savings.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Savings Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {savings.map((saving: any) => {
                                const progress = (saving.currentAmount / saving.goalAmount) * 100;
                                return (
                                    <div key={saving.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-foreground text-sm font-medium">{saving.goalName}</p>
                                            <p className="text-muted-foreground text-xs">{Math.round(progress)}%</p>
                                        </div>
                                        <div className="bg-foreground h-2 w-full rounded-full">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-muted-foreground flex justify-between text-xs">
                                            <span>{formatCurrency(saving.currentAmount)}</span>
                                            <span>{formatCurrency(saving.goalAmount)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
