/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { Progress } from '@/components/ui/progress';
import { db } from '@/hooks/useInstantDb';
import { format } from 'date-fns';
import { id as IND } from 'date-fns/locale';
import {
    CalendarIcon,
    CheckIcon,
    CoinsIcon,
    PiggyBankIcon,
    PlusCircle,
    PlusIcon,
    TargetIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    Wallet2Icon,
} from 'lucide-react';
import { expenseIcons } from './constants';
import { SavingMode } from './types';
import { useAddForm } from './useAddForm';

export function AddForm() {
    const { user } = db.useAuth();
    const userId = user?.id ?? '';

    const {
        activeTab,
        setActiveTab,
        amount,
        handleAmountChange,
        handleQuickAmount,
        formatCurrency,
        selectedDate,
        setSelectedDate,
        isCalendarOpen,
        setIsCalendarOpen,
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
        savingsGoals,
        selectedSaving,
        handleSubmit,
        isSubmitting,
        quickAmounts,
    } = useAddForm(userId);

    const selectedIcon = expenseIcons.find((item) => item.value === expenseType);
    const IconComponent = selectedIcon?.icon || Wallet2Icon;

    return (
        <div className="bg-background min-h-screen p-4 pb-24">
            <div className="mx-auto max-w-md space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-foreground mb-2 text-2xl font-bold">Quick Add</h1>
                    <p className="text-muted-foreground text-sm">Track your money in seconds ⚡</p>
                </div>

                {/* Tab Selection */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="income" className="flex items-center gap-2">
                            <TrendingUpIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Income</span>
                        </TabsTrigger>
                        <TabsTrigger value="expense" className="flex items-center gap-2">
                            <TrendingDownIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Expense</span>
                        </TabsTrigger>
                        <TabsTrigger value="saving" className="flex items-center gap-2">
                            <PiggyBankIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Saving</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Amount Input - Common for all tabs */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Label htmlFor="amount" className="text-muted-foreground text-sm">
                                        Amount
                                    </Label>
                                    <div className="relative mt-2">
                                        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform">
                                            Rp
                                        </span>
                                        <Input
                                            id="amount"
                                            placeholder="0"
                                            value={formatCurrency(amount)}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            className="h-16 pr-4 pl-12 text-center text-3xl font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Quick Amount Buttons */}
                                <div className="grid grid-cols-3 gap-2">
                                    {quickAmounts.map((quickAmount) => (
                                        <Button
                                            key={quickAmount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickAmount(quickAmount)}
                                            className="text-xs"
                                        >
                                            {quickAmount >= 1000000
                                                ? `${quickAmount / 1000000}M`
                                                : `${quickAmount / 1000}K`}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Date Selector - Common for income and expense */}
                    {activeTab !== 'saving' && (
                        <Card>
                            <CardContent className="pt-6">
                                <Label className="text-muted-foreground text-sm">Date</Label>
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="mt-2 w-full justify-start">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(selectedDate, 'PPP', { locale: IND })}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                if (date) {
                                                    setSelectedDate(date);
                                                    setIsCalendarOpen(false);
                                                }
                                            }}
                                            locale={IND}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </CardContent>
                        </Card>
                    )}

                    {/* Income Tab Content */}
                    <TabsContent value="income" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <TrendingUpIcon className="h-5 w-5" />
                                    Income Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="source">Income Source *</Label>
                                    <Input
                                        id="source"
                                        placeholder="e.g., Salary, Freelance, Investment"
                                        value={incomeSource}
                                        onChange={(e) => setIncomeSource(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="income-notes">Notes (Optional)</Label>
                                    <Textarea
                                        id="income-notes"
                                        placeholder="Add any additional details..."
                                        value={incomeNotes}
                                        onChange={(e) => setIncomeNotes(e.target.value)}
                                        className="mt-2 resize-none"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Expense Tab Content */}
                    <TabsContent value="expense" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <TrendingDownIcon className="h-5 w-5" />
                                    Expense Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Category *</Label>
                                    <ScrollArea className="mt-2 h-32 w-full">
                                        <div className="grid grid-cols-2 gap-2 p-1">
                                            {expenseIcons.map((item) => {
                                                const Icon = item.icon;
                                                const isSelected = expenseType === item.value;
                                                return (
                                                    <Button
                                                        key={item.value}
                                                        variant={isSelected ? 'default' : 'outline'}
                                                        className={`relative flex h-auto flex-col gap-2 p-3 ${
                                                            isSelected ? 'bg-red-500 text-white hover:bg-red-600' : ''
                                                        }`}
                                                        onClick={() => setExpenseType(item.value)}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                        <span className="text-xs">{item.label}</span>
                                                        {isSelected && (
                                                            <CheckIcon className="absolute top-2 right-2 h-3 w-3" />
                                                        )}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <div>
                                    <Label htmlFor="expense-notes">Notes (Optional)</Label>
                                    <Textarea
                                        id="expense-notes"
                                        placeholder="What did you buy? Where?"
                                        value={expenseNotes}
                                        onChange={(e) => setExpenseNotes(e.target.value)}
                                        className="mt-2 resize-none"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Saving Tab Content */}
                    {/* Saving Tab Content - Improved Interactive Version */}
                    <TabsContent value="saving" className="space-y-2">
                        <Card>
                            <CardContent className="">
                                <Tabs
                                    value={savingMode}
                                    onValueChange={(value) => setSavingMode(value as SavingMode)}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="add" className="flex items-center gap-2">
                                            <CoinsIcon className="h-4 w-4 text-purple-500" />
                                            <Label>My Goals</Label>
                                        </TabsTrigger>
                                        <TabsTrigger value="create" className="flex items-center gap-2">
                                            <PlusCircle className="h-4 w-4 text-purple-500" />
                                            <Label>Create new goal</Label>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {savingMode === 'add' ? (
                            // Add to existing goal - Interactive Cards
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-purple-600">
                                        <CoinsIcon className="h-5 w-5" />
                                        Choose Your Goal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {savingsGoals.length === 0 ? (
                                        <div className="py-4 text-center">
                                            <PiggyBankIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                            <p className="text-muted-foreground mb-2">No active saving goals</p>
                                            <p className="text-muted-foreground mb-4 text-sm">
                                                Create your first goal to start saving!
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => setSavingMode('create')}
                                                className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                                            >
                                                <TargetIcon className="mr-2 h-4 w-4" />
                                                Create your first goal
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Label className="text-muted-foreground text-sm">
                                                Select a saving goal to add money:
                                            </Label>
                                            <ScrollArea className="h-64 w-full">
                                                <div className="space-y-3 pr-4">
                                                    {savingsGoals.map((saving) => {
                                                        const progress =
                                                            (saving.currentAmount / saving.goalAmount) * 100;
                                                        const isSelected = selectedSavingId === saving.id;
                                                        const newAmount =
                                                            saving.currentAmount + (amount ? parseInt(amount) : 0);
                                                        const newProgress = (newAmount / saving.goalAmount) * 100;
                                                        const willComplete = newAmount >= saving.goalAmount;

                                                        return (
                                                            <Card
                                                                key={saving.id}
                                                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                                    isSelected
                                                                        ? 'border-purple-400 bg-purple-50 shadow-sm dark:border-purple-600 dark:bg-purple-900/30'
                                                                        : 'border-border hover:border-purple-200 dark:hover:border-purple-700'
                                                                }`}
                                                                onClick={() => setSelectedSavingId(saving.id)}
                                                            >
                                                                <CardContent className="p-4">
                                                                    <div className="space-y-3">
                                                                        {/* Header */}
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <h4 className="text-foreground font-semibold">
                                                                                    {saving.goalName}
                                                                                </h4>
                                                                                {saving.targetDate && (
                                                                                    <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                                                                                        <CalendarIcon className="h-3 w-3" />
                                                                                        Target:{' '}
                                                                                        {format(
                                                                                            new Date(saving.targetDate),
                                                                                            'dd MMM yyyy',
                                                                                            { locale: IND },
                                                                                        )}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex flex-col items-end gap-1">
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className={`${
                                                                                        progress >= 100
                                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                                                                            : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                                                                                    }`}
                                                                                >
                                                                                    {Math.round(progress)}%
                                                                                </Badge>
                                                                                {isSelected && (
                                                                                    <CheckIcon className="h-4 w-4 text-purple-600" />
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Progress Bar */}
                                                                        <div className="space-y-2">
                                                                            <Progress
                                                                                value={progress}
                                                                                className="h-2"
                                                                            />
                                                                            <div className="text-muted-foreground flex justify-between text-xs">
                                                                                <span>
                                                                                    Rp{' '}
                                                                                    {formatCurrency(
                                                                                        saving.currentAmount.toString(),
                                                                                    )}
                                                                                </span>
                                                                                <span>
                                                                                    Rp{' '}
                                                                                    {formatCurrency(
                                                                                        saving.goalAmount.toString(),
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Preview if selected and amount entered */}
                                                                        {isSelected &&
                                                                            amount &&
                                                                            parseInt(amount) > 0 && (
                                                                                <div className="mt-3 border-t border-purple-200 pt-3 dark:border-purple-700">
                                                                                    <div className="space-y-2">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <span className="text-muted-foreground text-sm">
                                                                                                After adding:
                                                                                            </span>
                                                                                            {willComplete && (
                                                                                                <Badge className="animate-pulse bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                                                    🎉 Goal Completed!
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>

                                                                                        <Progress
                                                                                            value={Math.min(
                                                                                                newProgress,
                                                                                                100,
                                                                                            )}
                                                                                            className="h-2 bg-purple-100 dark:bg-purple-900"
                                                                                        />

                                                                                        <div className="flex justify-between text-sm">
                                                                                            <span className="font-semibold text-purple-600">
                                                                                                Rp{' '}
                                                                                                {formatCurrency(
                                                                                                    newAmount.toString(),
                                                                                                )}
                                                                                            </span>
                                                                                            <span className="font-semibold text-purple-600">
                                                                                                {Math.round(
                                                                                                    newProgress,
                                                                                                )}
                                                                                                %
                                                                                            </span>
                                                                                        </div>

                                                                                        {willComplete && (
                                                                                            <div className="text-center text-xs font-medium text-green-600">
                                                                                                Congratulations! You'll
                                                                                                reach your goal! 🚀
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                        {/* Optional notes */}
                                                                        {saving.notes && (
                                                                            <p className="text-muted-foreground text-xs italic">
                                                                                "{saving.notes}"
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            </ScrollArea>

                                            {/* Quick action buttons */}
                                            <div className="flex items-center justify-end">
                                                {selectedSaving && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedSavingId('')}
                                                        className="px-3"
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            // Create new goal - Same as before
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-purple-600">
                                        <TargetIcon className="h-5 w-5" />
                                        Create New Savings Goal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="goal-name">Goal Name *</Label>
                                        <Input
                                            id="goal-name"
                                            placeholder="e.g., iPhone 15, Vacation, Emergency Fund"
                                            value={savingGoalName}
                                            onChange={(e) => setSavingGoalName(e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="goal-amount">Target Amount</Label>
                                        <div className="relative mt-2">
                                            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform">
                                                Rp
                                            </span>
                                            <Input
                                                id="goal-amount"
                                                placeholder="Use amount above or enter different target"
                                                value={formatCurrency(savingGoalAmount)}
                                                onChange={(e) => setSavingGoalAmount(e.target.value.replace(/\D/g, ''))}
                                                className="pl-12"
                                            />
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Leave empty to use amount above as target
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Target Date (Optional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="mt-2 w-full justify-start">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {savingTargetDate
                                                        ? format(savingTargetDate, 'PPP', { locale: IND })
                                                        : 'Select target date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={savingTargetDate}
                                                    onSelect={setSavingTargetDate}
                                                    disabled={(date) => date < new Date()}
                                                    locale={IND}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <Label htmlFor="saving-notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="saving-notes"
                                            placeholder="Why is this goal important to you?"
                                            value={savingNotes}
                                            onChange={(e) => setSavingNotes(e.target.value)}
                                            className="mt-2 resize-none"
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !amount || parseInt(amount) <= 0}
                    className="h-14 w-full text-lg font-semibold"
                    size="lg"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                            {savingMode === 'add' ? 'Adding...' : 'Creating...'}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <PlusIcon className="h-5 w-5" />
                            {activeTab === 'income' && 'Add Income'}
                            {activeTab === 'expense' && 'Add Expense'}
                            {activeTab === 'saving' && (savingMode === 'add' ? 'Add to Goal' : 'Create Goal')}
                        </div>
                    )}
                </Button>

                {/* Preview Card */}
                {amount && parseInt(amount) > 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="pt-4">
                            <div className="space-y-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {activeTab === 'income' && <TrendingUpIcon className="h-5 w-5 text-green-500" />}
                                    {activeTab === 'expense' && <IconComponent className="h-5 w-5 text-red-500" />}
                                    {activeTab === 'saving' && <PiggyBankIcon className="h-5 w-5 text-purple-500" />}
                                    <Badge variant="outline">Preview</Badge>
                                </div>
                                <p className="text-2xl font-bold">Rp {formatCurrency(amount)}</p>
                                <p className="text-muted-foreground text-sm">
                                    {activeTab === 'income' && incomeSource}
                                    {activeTab === 'expense' && selectedIcon?.label}
                                    {activeTab === 'saving' &&
                                        (savingMode === 'add' ? selectedSaving?.goalName : savingGoalName)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
