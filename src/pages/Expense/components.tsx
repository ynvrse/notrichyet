/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, EditIcon, PlusIcon, SearchIcon, TrashIcon, TrendingDownIcon, UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { expenseIcons } from './constants';
import { FilterPeriod, FilterType } from './types';
import { useExpense } from './useExpense';

export function ExpenseForm({ userId }: { userId: string }) {
    const navigate = useNavigate();
    const {
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
        isLoading,
        getFilteredExpenses,
        totalExpenses,
        expensesByType,
        getHangoutInfo,
        formatCurrency,
        formatDate,
    } = useExpense(userId);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="border-foreground h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen p-4 pb-24">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold">
                            <TrendingDownIcon className="h-6 w-6 text-red-500" />
                            Expenses
                        </h1>
                        <p className="text-muted-foreground text-sm">Track and analyze your spending</p>
                    </div>
                    <Button onClick={() => navigate('/add?tab=expense')} size="sm" className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        Add Expense
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(totalExpenses)}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Total{' '}
                                {filterPeriod === 'all'
                                    ? 'All Time'
                                    : filterPeriod === 'thisMonth'
                                      ? 'This Month'
                                      : filterPeriod === 'lastMonth'
                                        ? 'Last Month'
                                        : 'Last 3 Months'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-foreground text-2xl font-bold">{getFilteredExpenses.length}</div>
                            <p className="text-muted-foreground text-xs">Total Transactions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-foreground text-2xl font-bold">
                                {totalExpenses > 0
                                    ? formatCurrency(totalExpenses / getFilteredExpenses.length)
                                    : formatCurrency(0)}
                            </div>
                            <p className="text-muted-foreground text-xs">Average per Transaction</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                <Input
                                    placeholder="Search expenses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filter Row */}
                            <div className="flex flex-wrap gap-3">
                                <Select
                                    value={filterPeriod}
                                    onValueChange={(value: FilterPeriod) => setFilterPeriod(value)}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="thisMonth">This Month</SelectItem>
                                        <SelectItem value="lastMonth">Last Month</SelectItem>
                                        <SelectItem value="last3Months">Last 3 Months</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {Object.entries(expenseIcons).map(([key, { label }]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate
                                                ? format(selectedDate, 'dd MMM', { locale: id })
                                                : 'Pick Date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setIsCalendarOpen(false);
                                            }}
                                            locale={id}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {(selectedDate ||
                                    searchQuery ||
                                    filterType !== 'all' ||
                                    filterPeriod !== 'thisMonth') && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedDate(undefined);
                                            setSearchQuery('');
                                            setFilterType('all');
                                            setFilterPeriod('thisMonth');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="list" className="mx-auto w-full max-w-lg space-y-4">
                    {/* Tabs List */}
                    <TabsList className="bg-muted grid w-full grid-cols-2 rounded-lg p-1">
                        <TabsTrigger
                            value="list"
                            className="data-[state=active]:bg-background rounded-md py-2 text-sm font-medium"
                        >
                            Transaction List
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="data-[state=active]:bg-background rounded-md py-2 text-sm font-medium"
                        >
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Transaction List */}
                    <TabsContent value="list">
                        <Card className="border-border rounded-xl border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold">Expense History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getFilteredExpenses.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <TrendingDownIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                        <p className="text-muted-foreground mb-1">No expenses found</p>
                                        <p className="text-muted-foreground text-sm">
                                            {searchQuery || filterType !== 'all' || selectedDate
                                                ? 'Try adjusting your filters'
                                                : 'Start tracking your expenses!'}
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="scrollbar-none h-[500px]">
                                        <div className="space-y-3">
                                            {getFilteredExpenses.map((expense: any) => {
                                                const typeInfo =
                                                    expenseIcons[expense.type as keyof typeof expenseIcons] ||
                                                    expenseIcons.others;
                                                const IconComponent = typeInfo.icon;
                                                const hangout = expense.hangoutId
                                                    ? getHangoutInfo(expense.hangoutId)
                                                    : null;

                                                return (
                                                    <Card
                                                        key={expense.id}
                                                        className="border-border/50 hover:border-border mx-auto w-full rounded-xl border transition-all duration-200 hover:shadow-lg"
                                                    >
                                                        <CardContent className="p-2">
                                                            <div className="flex items-start justify-between gap-2">
                                                                {/* Icon + Info */}
                                                                <div className="flex items-start gap-2">
                                                                    <div
                                                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${typeInfo.color} `}
                                                                    >
                                                                        <IconComponent className="h-5 w-5" />
                                                                    </div>

                                                                    <div>
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            <p className="leading-tight font-semibold">
                                                                                {expense.notes || typeInfo.label}
                                                                            </p>
                                                                            {hangout && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="border-orange-200 text-xs text-orange-600"
                                                                                >
                                                                                    <UsersIcon className="mr-1 h-3 w-3" />
                                                                                    {hangout.title}
                                                                                </Badge>
                                                                            )}
                                                                        </div>

                                                                        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm">
                                                                            <span>{formatDate(expense.date)}</span>
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="text-xs"
                                                                            >
                                                                                {typeInfo.label}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Amount + Actions */}
                                                                <div className="shrink-0 text-right">
                                                                    <p className="font-bold text-red-600 dark:text-red-400">
                                                                        -{formatCurrency(expense.amount)}
                                                                    </p>
                                                                    <div className="mt-2 flex justify-end gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-muted-foreground hover:text-foreground h-7 w-7"
                                                                        >
                                                                            <EditIcon className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 text-red-500 hover:text-red-600"
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics */}
                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Spending by Category */}
                            <Card className="border-border rounded-xl border shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {expensesByType.map(({ type, total, count, percentage }) => {
                                            const typeInfo =
                                                expenseIcons[type as keyof typeof expenseIcons] || expenseIcons.others;
                                            const IconComponent = typeInfo.icon;

                                            return (
                                                <div key={type} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <IconComponent className={`h-4 w-4 ${typeInfo.color}`} />
                                                            <span className="text-sm font-medium">
                                                                {typeInfo.label}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold">
                                                                {formatCurrency(total)}
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                {count} transactions
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-secondary h-2 w-full rounded-full">
                                                        <div
                                                            className="h-2 rounded-full bg-red-500 transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-muted-foreground text-right text-xs">
                                                        {percentage.toFixed(1)}% of total spending
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="border-border rounded-xl border shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                                            <span className="text-sm">Highest Single Expense</span>
                                            <span className="font-semibold text-red-600">
                                                {getFilteredExpenses.length > 0
                                                    ? formatCurrency(
                                                          Math.max(...getFilteredExpenses.map((e) => e.amount)),
                                                      )
                                                    : formatCurrency(0)}
                                            </span>
                                        </div>
                                        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                                            <span className="text-sm">Most Frequent Category</span>
                                            <span className="font-semibold">
                                                {expensesByType.length > 0
                                                    ? expenseIcons[expensesByType[0].type as keyof typeof expenseIcons]
                                                          ?.label || 'Others'
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                                            <span className="text-sm">Hangout Expenses</span>
                                            <span className="font-semibold text-orange-600">
                                                {formatCurrency(
                                                    getFilteredExpenses
                                                        .filter((e) => e.hangoutId)
                                                        .reduce((sum, e) => sum + e.amount, 0),
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
