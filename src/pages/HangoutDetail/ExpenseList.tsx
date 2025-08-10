import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/hooks/useInstantDb';
import { formatCurrency } from '@/lib/utils';
import { id } from '@instantdb/react';
import { format } from 'date-fns';
import { id as IND } from 'date-fns/locale';
import {
    CalendarIcon,
    CheckIcon,
    EditIcon,
    PlusCircle,
    ReceiptIcon,
    Trash2Icon,
    TrendingDownIcon,
    UsersIcon,
} from 'lucide-react';
import { useState } from 'react';
import { expenseIcons } from './constants';

export function ExpenseList({ hangout, allProfiles, currentUserId }: any) {
    const [editingExpense, setEditingExpense] = useState<any>(null);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        receiptUrl: '',
        date: new Date().toISOString().slice(0, 10),
    });
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const splitMethod = hangout.splitMethod;

    const hostName = allProfiles?.find((p: any) => p.userId === hangout.ownerId).fullName;

    const handleAddClick = () => {
        setEditingExpense({});
        setFormData({
            description: '',
            amount: '',
            category: '',
            receiptUrl: '',
            date: new Date().toISOString().slice(0, 10),
        });
        setSelectedDate(new Date());
    };

    const handleEditClick = (expense: any) => {
        setEditingExpense(expense);
        const expenseDate = expense.date ? new Date(expense.date) : new Date();
        setFormData({
            description: expense.description,
            amount: expense.amount.toString(),
            category: expense.category || '',
            receiptUrl: expense.receiptUrl || '',
            date: format(expenseDate, 'yyyy-MM-dd'),
        });
        setSelectedDate(expenseDate);
    };

    const handleSave = async () => {
        if (editingExpense?.id) {
            // Update
            await db.transact([
                db.tx.hangoutExpenses[editingExpense.id].update({
                    description: formData.description,
                    amount: Number(formData.amount),
                    category: formData.category || undefined,
                    receiptUrl: formData.receiptUrl || undefined,
                    date: selectedDate,
                }),
            ]);
        } else {
            // Create

            await db.transact([
                db.tx.hangoutExpenses[id()]
                    .create({
                        hangoutId: hangout.id,
                        paidById: currentUserId,
                        description: formData.description,
                        amount: Number(formData.amount),
                        category: formData.category,
                        receiptUrl: formData.receiptUrl || undefined,
                        date: selectedDate,
                        createdAt: new Date(),
                        splitAmong: hangout.participantIds || [],
                    })
                    .link({
                        hangouts: hangout.id,
                    }),
            ]);
        }
        setEditingExpense(null);
    };

    const handleDelete = async (expenseId: string) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            await db.transact([db.tx.hangoutExpenses[expenseId].delete()]);
        }
    };

    const formatAmountInput = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Ensure hangoutExpenses is an array and handle null/undefined
    const expenses = Array.isArray(hangout.hangoutExpenses) ? hangout.hangoutExpenses : [];
    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + (exp?.amount || 0), 0);
    const participantCount = hangout.participantIds?.length || hangout.hangoutParticipants?.length || 1;
    const avgPerPerson = totalExpenses / participantCount;

    const selectedIcon = expenseIcons.find((item) => item.value === formData.category);
    const IconComponent = selectedIcon?.icon || ReceiptIcon;

    return (
        <div className="space-y-6 p-6">
            {/* Header with Stats */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <TrendingDownIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Expenses</h3>
                            <p className="text-muted-foreground text-sm">{expenses.length} transactions</p>
                        </div>
                    </div>

                    <Button onClick={handleAddClick} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Expense
                    </Button>
                </div>

                {/* Summary Cards */}

                {expenses.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Total Spent</p>
                                    <p className="text-xl font-bold text-red-900 dark:text-red-100">
                                        {formatCurrency(totalExpenses)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        {splitMethod !== 'manual' && (
                            <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        {splitMethod === 'treat' ? (
                                            <>
                                                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                                    Treated by
                                                </p>
                                                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                                    🎉 {hostName}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                                    Per Person
                                                </p>
                                                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                                    {formatCurrency(avgPerPerson)}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            {/* Expense List */}
            {expenses.length > 0 ? (
                <div className="space-y-3">
                    {expenses.map((expense: any) => {
                        // Ensure expense is a valid object
                        if (!expense || !expense.id) {
                            return null;
                        }

                        const payer = allProfiles?.find((p: any) => p.userId === expense.paidById);

                        const categoryIcon = expenseIcons.find((item) => item.value === expense.category);
                        const CategoryIcon = categoryIcon?.icon || ReceiptIcon;

                        return (
                            <Card
                                key={expense.id}
                                className="transition-all duration-200 hover:border-red-200 hover:shadow-md dark:hover:border-red-800"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                            <CategoryIcon className="h-6 w-6 text-red-600" />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-foreground truncate font-semibold">
                                                        {expense.description}
                                                    </h4>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="flex items-center gap-1 text-xs"
                                                        >
                                                            <UsersIcon className="h-3 w-3" />
                                                            {payer?.fullName || 'Unknown'}
                                                        </Badge>
                                                        {expense.category && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {categoryIcon?.label || expense.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        {format(new Date(expense.date), 'dd MMM yyyy', { locale: IND })}
                                                    </p>
                                                </div>

                                                {/* Amount */}
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-red-600">
                                                        {formatCurrency(expense.amount || 0)}
                                                    </p>
                                                    {/* {expense.receiptUrl && (
                                                        <Badge variant="outline" className="mt-1 text-xs">
                                                            <ImageIcon className="mr-1 h-3 w-3" />
                                                            Receipt
                                                        </Badge>
                                                    )} */}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}

                                            {currentUserId === expense.paidById && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(expense)}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <EditIcon className="h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="flex items-center gap-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                                                    >
                                                        <Trash2Icon className="h-3 w-3" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <ReceiptIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="text-foreground mb-2 font-semibold">No expenses yet</h4>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Start tracking your hangout expenses to split bills fairly
                        </p>
                        {currentUserId === hangout.ownerId && (
                            <Button onClick={handleAddClick} variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add First Expense
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Modal Add/Edit */}
            <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <IconComponent className="h-4 w-4 text-red-600" />
                            </div>
                            {editingExpense?.id ? 'Edit Expense' : 'Add New Expense'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Amount Input */}
                        <div>
                            <Label htmlFor="amount">Amount *</Label>
                            <div className="relative mt-2">
                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform">
                                    Rp
                                </span>
                                <Input
                                    id="amount"
                                    placeholder="0"
                                    value={formatAmountInput(formData.amount)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value.replace(/\D/g, '') })
                                    }
                                    className="h-12 pl-12 text-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                placeholder="What did you buy?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        {/* Category Selection */}
                        <div>
                            <Label>Category</Label>
                            <ScrollArea className="mt-2 h-32 w-full rounded-md border p-2">
                                <div className="grid grid-cols-3 gap-2">
                                    {expenseIcons.map((item) => {
                                        const Icon = item.icon;
                                        const isSelected = formData.category === item.value;
                                        return (
                                            <Button
                                                key={item.value}
                                                variant={isSelected ? 'default' : 'outline'}
                                                className={`relative flex h-auto flex-col gap-1 p-2 ${
                                                    isSelected ? 'bg-red-500 text-white hover:bg-red-600' : ''
                                                }`}
                                                onClick={() => setFormData({ ...formData, category: item.value })}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="text-xs">{item.label}</span>
                                                {isSelected && <CheckIcon className="absolute top-1 right-1 h-3 w-3" />}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Date */}
                        <div>
                            <Label>Date</Label>
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
                        </div>

                        {/* Receipt URL */}
                        {/* <div>
                            <Label htmlFor="receiptUrl">Receipt Photo URL (Optional)</Label>
                            <Input
                                id="receiptUrl"
                                placeholder="https://..."
                                value={formData.receiptUrl}
                                onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                                className="mt-2"
                            />
                        </div> */}

                        {/* Preview */}
                        {formData.amount && formData.description && (
                            <Card className="border-2 border-dashed border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-5 w-5 text-red-600" />
                                            <div>
                                                <p className="font-medium">{formData.description}</p>
                                                <p className="text-sm text-red-600">{selectedIcon?.label}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-red-600">
                                            Rp {formatAmountInput(formData.amount)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Button
                            className="w-full"
                            onClick={handleSave}
                            disabled={!formData.amount || !formData.description}
                        >
                            <CheckIcon className="mr-2 h-4 w-4" />
                            {editingExpense?.id ? 'Update Expense' : 'Add Expense'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
